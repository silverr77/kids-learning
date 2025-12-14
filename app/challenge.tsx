import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { getLevelById } from '@/data/levels';
import { playSound, playSuccessSound, playErrorSound } from '@/utils/soundManager';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { saveProgress, getProgress } from '@/utils/storage';
import { LearningItem, ChallengeQuestion } from '@/types';

const { width } = Dimensions.get('window');

export default function ChallengeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ levelId: string }>();
  const levelId = params.levelId as string;
  const { colors } = useTheme();
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<LearningItem[]>([]);
  const [questions, setQuestions] = useState<ChallengeQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [canProceed, setCanProceed] = useState(false);
  const [levelTitle, setLevelTitle] = useState('');

  useEffect(() => {
    loadLevel();
  }, [levelId]);

  const loadLevel = () => {
    const level = getLevelById(levelId);
    if (level) {
      setItems(level.items);
      setLevelTitle(level.title);
      generateQuestions(level.items);
    }
  };

  const handleExit = () => {
    Alert.alert(
      t('exit'),
      'Are you sure you want to exit? Your progress will be saved.',
      [
        { text: t('back'), style: 'cancel' },
        {
          text: t('exit'),
          style: 'destructive',
          onPress: async () => {
            await saveCurrentProgress();
            router.back();
          },
        },
      ]
    );
  };

  const saveCurrentProgress = async () => {
    const progress = await getProgress();
    if (progress && levelId) {
      const updatedProgress = {
        ...progress,
        currentLevel: levelId,
        currentLevelIndex: currentQuestion,
      };
      await saveProgress(updatedProgress);
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
      // Save progress before moving to reward
      saveCurrentProgress();
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

  const styles = createStyles(colors, isRTL);

  if (items.length === 0 || questions.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Loading challenge...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const question = questions[currentQuestion];
  const correctItem = items.find(item => item.id === question.correctAnswer);
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header with Exit Button */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={handleExit} style={styles.exitButton}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{t('challenge')}!</Text>
          <Text style={styles.subtitle}>
            {t('question')} {currentQuestion + 1} {t('of')} {questions.length}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: canProceed ? 100 + insets.bottom : 20 + insets.bottom }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress */}
        <View style={[styles.progressContainer, { backgroundColor: colors.surface }]}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.primary }]} />
          </View>
        </View>

        {/* Question */}
        <View style={[styles.questionContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.questionText, { color: colors.text }]}>{question.question}</Text>
          <TouchableOpacity
            style={[styles.soundButton, { backgroundColor: colors.primary }]}
            onPress={handlePlaySound}
          >
            <Ionicons name="volume-high" size={40} color="#FFFFFF" />
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
                {renderItemVisual(optionItem, 100, colors)}
                <Text style={styles.optionText}>{optionItem.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Feedback */}
        {showFeedback && (
          <View style={styles.feedbackContainer}>
            <Text style={[styles.feedbackText, { color: isCorrect ? colors.success : colors.error }]}>
              {isCorrect ? t('correct') + '!' : `${t('incorrect')}: ${correctItem?.name}`}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Navigation - Fixed at bottom */}
      {canProceed && (
        <View style={[styles.navigationContainer, { paddingBottom: insets.bottom }]}>
          <Button
            title={currentQuestion === questions.length - 1 
              ? (isRTL ? `← ${t('seeResults')}` : `${t('seeResults')} →`)
              : (isRTL ? `← ${t('next')}` : `${t('next')} →`)
            }
            onPress={handleNext}
            variant="primary"
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const renderItemVisual = (item: LearningItem, size: number = 100, colors: any) => {
  if (item.data?.uppercase) {
    return (
      <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ fontSize: size * 0.6, fontWeight: 'bold', color: colors.primary }}>
          {item.data.uppercase}
        </Text>
      </View>
    );
  }

  if (item.data?.number) {
    return (
      <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ fontSize: size * 0.6, fontWeight: 'bold', color: colors.secondary }}>
          {item.data.number}
        </Text>
      </View>
    );
  }

  if (item.data?.color) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: 50,
          borderWidth: 3,
          borderColor: colors.border,
          backgroundColor: item.data.color,
        }}
      />
    );
  }

  if (item.data?.shape) {
    return (
      <View
        style={[
          { width: size, height: size, justifyContent: 'center', alignItems: 'center' },
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
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
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

function createStyles(colors: any, isRTL: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    exitButton: {
      padding: 8,
    },
    headerContent: {
      flex: 1,
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: '#FFFFFF',
      opacity: 0.9,
    },
    progressContainer: {
      padding: 20,
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
    questionContainer: {
      alignItems: 'center',
      padding: 30,
      marginBottom: 20,
    },
    questionText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    soundButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
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
      backgroundColor: colors.surface,
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
      backgroundColor: colors.success,
      borderWidth: 3,
      borderColor: colors.success,
    },
    incorrectButton: {
      backgroundColor: colors.error,
      borderWidth: 3,
      borderColor: colors.error,
    },
    visualContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    letterPreview: {
      fontWeight: 'bold',
      color: colors.primary,
    },
    numberPreview: {
      fontWeight: 'bold',
      color: colors.secondary,
    },
    colorPreview: {
      borderRadius: 50,
      borderWidth: 3,
      borderColor: colors.border,
    },
    shapePreview: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    optionText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginTop: 10,
      textTransform: 'capitalize',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    feedbackContainer: {
      alignItems: 'center',
      padding: 20,
    },
    feedbackText: {
      fontSize: 28,
      fontWeight: 'bold',
    },
    navigationContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 20,
      paddingTop: 10,
      alignItems: 'center',
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      fontSize: 18,
      marginBottom: 20,
    },
  });
}

