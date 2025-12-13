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
import { LearningItem } from '@/types';

const { width } = Dimensions.get('window');

export default function PracticeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ levelId: string }>();
  const levelId = params.levelId as string;
  const [items, setItems] = useState<LearningItem[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shuffledItems, setShuffledItems] = useState<LearningItem[]>([]);

  useEffect(() => {
    loadLevel();
  }, [levelId]);

  useEffect(() => {
    if (items.length > 0) {
      generateQuestion();
    }
  }, [currentQuestion, items]);

  const loadLevel = () => {
    const level = getLevelById(levelId);
    if (level) {
      setItems(level.items);
      generateQuestion();
    }
  };

  const generateQuestion = () => {
    // Shuffle items for practice
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled.slice(0, Math.min(4, items.length)));
  };

  const handleAnswer = async (itemId: string) => {
    const correctAnswer = items[currentQuestion % items.length].id;
    const correct = itemId === correctAnswer;
    
    setSelectedAnswer(itemId);
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      await playSuccessSound();
    } else {
      await playErrorSound();
    }

    // Auto-advance after feedback
    setTimeout(() => {
      if (currentQuestion < items.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setShowFeedback(false);
        setSelectedAnswer(null);
        generateQuestion();
      } else {
        // Move to challenge
        router.push({
          pathname: '/challenge',
          params: { levelId },
        });
      }
    }, 1500);
  };

  const handlePlaySound = async () => {
    const currentItem = items[currentQuestion % items.length];
    await playSound(currentItem.sound, currentItem.pronunciation || currentItem.name);
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Level not found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const currentItem = items[currentQuestion % items.length];
  const progress = ((currentQuestion + 1) / items.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Practice: {currentQuestion + 1} / {items.length}
        </Text>
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.instructionText}>Tap the correct answer!</Text>
        <TouchableOpacity
          style={styles.soundButton}
          onPress={handlePlaySound}
        >
          <Text style={styles.soundIcon}>🔊</Text>
        </TouchableOpacity>
      </View>

      {/* Options Grid */}
      <View style={styles.optionsContainer}>
        {shuffledItems.map((item) => {
          const isSelected = selectedAnswer === item.id;
          const isCorrectAnswer = item.id === currentItem.id;
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
              key={item.id}
              style={buttonStyle}
              onPress={() => handleAnswer(item.id)}
              disabled={showFeedback}
            >
              {renderItemVisual(item, 80)}
              <Text style={styles.optionText}>{item.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Feedback */}
      {showFeedback && (
        <View style={styles.feedbackContainer}>
          <Text style={[styles.feedbackText, isCorrect ? styles.correctText : styles.incorrectText]}>
            {isCorrect ? '🎉 Great job!' : '😊 Try again!'}
          </Text>
        </View>
      )}

      {/* Skip Button */}
      <View style={styles.skipContainer}>
        <Button
          title="Skip to Challenge →"
          onPress={() => router.push({ pathname: '/challenge', params: { levelId } })}
          variant="secondary"
          size="medium"
        />
      </View>
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
  progressContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  questionContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
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
  skipContainer: {
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

