import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { getLevelById } from '@/data/levels';
import { playSound, playSuccessSound, playErrorSound } from '@/utils/soundManager';
import { LearningItem, ChallengeQuestion } from '@/types';

const { width } = Dimensions.get('window');

export default function ChallengeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ levelId: string }>();
  const levelId = params.levelId as string;
  const [items, setItems] = useState<LearningItem[]>([]);
  const [questions, setQuestions] = useState<ChallengeQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    loadLevel();
  }, [levelId]);

  const loadLevel = () => {
    const level = getLevelById(levelId);
    if (level) {
      setItems(level.items);
      generateQuestions(level.items);
    }
  };

  const generateQuestions = (levelItems: LearningItem[]) => {
    // Generate 5 random questions
    const questionTypes: Array<'multiple-choice' | 'tap' | 'count'> = [
      'multiple-choice',
      'tap',
      'multiple-choice',
      'tap',
      'multiple-choice',
    ];

    const generatedQuestions: ChallengeQuestion[] = questionTypes.map((type, index) => {
      const randomItem = levelItems[Math.floor(Math.random() * levelItems.length)];
      const wrongOptions = levelItems
        .filter(item => item.id !== randomItem.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      const allOptions = [randomItem, ...wrongOptions].sort(() => Math.random() - 0.5);

      return {
        id: `q${index}`,
        type,
        question: type === 'multiple-choice' 
          ? `Which one is ${randomItem.name}?`
          : `Tap the ${randomItem.name}!`,
        correctAnswer: randomItem.id,
        options: allOptions.map(item => item.id),
        audio: randomItem.pronunciation || randomItem.name,
      };
    });

    setQuestions(generatedQuestions);
  };

  const handleAnswer = async (answerId: string) => {
    const question = questions[currentQuestion];
    const correct = answerId === question.correctAnswer;
    
    setSelectedAnswer(answerId);
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + 1);
      await playSuccessSound();
    } else {
      await playErrorSound();
    }

    setCanProceed(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(false);
      setSelectedAnswer(null);
      setCanProceed(false);
    } else {
      // Calculate stars based on score
      const starsEarned = score >= 4 ? 3 : score >= 3 ? 2 : 1;
      router.push({
        pathname: '/reward',
        params: { levelId, stars: starsEarned.toString(), score: score.toString() },
      });
    }
  };

  const handlePlaySound = async () => {
    const question = questions[currentQuestion];
    if (question.audio) {
      await playSound(undefined, question.audio);
    }
  };

  if (items.length === 0 || questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Loading challenge...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const question = questions[currentQuestion];
  const correctItem = items.find(item => item.id === question.correctAnswer);
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Final Challenge! 🎯</Text>
        <Text style={styles.subtitle}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>
        <TouchableOpacity
          style={styles.soundButton}
          onPress={handlePlaySound}
        >
          <Text style={styles.soundIcon}>🔊</Text>
        </TouchableOpacity>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {question.options?.map((optionId) => {
          const optionItem = items.find(item => item.id === optionId);
          if (!optionItem) return null;

          const isSelected = selectedAnswer === optionId;
          const isCorrectAnswer = optionId === question.correctAnswer;
          let buttonStyle: any = styles.optionButton;
          
          if (showFeedback) {
            if (isCorrectAnswer) {
              buttonStyle = [styles.optionButton, styles.correctButton];
            } else if (isSelected && !isCorrect) {
              buttonStyle = [styles.optionButton, styles.incorrectButton];
            }
          }

          return (
            <TouchableOpacity
              key={optionId}
              style={buttonStyle}
              onPress={() => handleAnswer(optionId)}
              disabled={showFeedback}
            >
              {renderItemVisual(optionItem, 100)}
              <Text style={styles.optionText}>{optionItem.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Feedback */}
      {showFeedback && (
        <View style={styles.feedbackContainer}>
          <Text style={[styles.feedbackText, isCorrect ? styles.correctText : styles.incorrectText]}>
            {isCorrect ? '🎉 Correct!' : `😊 The answer is ${correctItem?.name}`}
          </Text>
        </View>
      )}

      {/* Navigation */}
      {canProceed && (
        <View style={styles.navigationContainer}>
          <Button
            title={currentQuestion === questions.length - 1 ? 'See Results →' : 'Next Question →'}
            onPress={handleNext}
            variant="primary"
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const renderItemVisual = (item: LearningItem, size: number = 100) => {
  if (item.data?.uppercase) {
    return (
      <View style={[styles.visualContainer, { width: size, height: size }]}>
        <Text style={[styles.letterPreview, { fontSize: size * 0.6 }]}>
          {item.data.uppercase}
        </Text>
      </View>
    );
  }

  if (item.data?.number) {
    return (
      <View style={[styles.visualContainer, { width: size, height: size }]}>
        <Text style={[styles.numberPreview, { fontSize: size * 0.6 }]}>
          {item.data.number}
        </Text>
      </View>
    );
  }

  if (item.data?.color) {
    return (
      <View
        style={[
          styles.colorPreview,
          { width: size, height: size, backgroundColor: item.data.color },
        ]}
      />
    );
  }

  if (item.data?.shape) {
    return (
      <View
        style={[
          styles.shapePreview,
          { width: size, height: size },
          getShapePreviewStyle(item.data.shape, size),
        ]}
      />
    );
  }

  const emojiMap: Record<string, string> = {
    cow: '🐄',
    pig: '🐷',
    chicken: '🐔',
    sheep: '🐑',
    horse: '🐴',
    lion: '🦁',
    elephant: '🐘',
    tiger: '🐅',
    bear: '🐻',
    monkey: '🐵',
  };
  return (
    <View style={[styles.visualContainer, { width: size, height: size }]}>
      <Text style={{ fontSize: size * 0.8 }}>{emojiMap[item.id] || '📚'}</Text>
    </View>
  );
};

const getShapePreviewStyle = (shape: string, size: number): any => {
  switch (shape) {
    case 'circle':
      return { borderRadius: size / 2, backgroundColor: '#FF6B6B' };
    case 'square':
      return { borderRadius: 10, backgroundColor: '#4ECDC4' };
    case 'triangle':
      return {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid' as const,
        borderLeftWidth: size / 2,
        borderRightWidth: size / 2,
        borderBottomWidth: size * 0.87,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#FF6B6B',
      };
    case 'rectangle':
      return { borderRadius: 5, backgroundColor: '#45B7D1', width: size * 1.5, height: size };
    case 'star':
      return { backgroundColor: '#FFA07A', borderRadius: 0 };
    default:
      return { backgroundColor: '#95A5A6' };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  progressContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  questionContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  soundButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  soundIcon: {
    fontSize: 40,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 15,
    gap: 15,
  },
  optionButton: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  correctButton: {
    backgroundColor: '#2ECC71',
    borderWidth: 3,
    borderColor: '#27AE60',
  },
  incorrectButton: {
    backgroundColor: '#E74C3C',
    borderWidth: 3,
    borderColor: '#C0392B',
  },
  visualContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  letterPreview: {
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  numberPreview: {
    fontWeight: 'bold',
    color: '#45B7D1',
  },
  colorPreview: {
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#333',
  },
  shapePreview: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    textTransform: 'capitalize',
  },
  feedbackContainer: {
    alignItems: 'center',
    padding: 20,
  },
  feedbackText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  correctText: {
    color: '#2ECC71',
  },
  incorrectText: {
    color: '#E74C3C',
  },
  navigationContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
});

