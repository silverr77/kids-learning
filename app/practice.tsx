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
import { LearningItem } from '@/types';

const { width } = Dimensions.get('window');

export default function PracticeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ levelId: string }>();
  const levelId = params.levelId as string;
  const { colors } = useTheme();
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<LearningItem[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shuffledItems, setShuffledItems] = useState<LearningItem[]>([]);
  const [levelTitle, setLevelTitle] = useState('');

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
      setLevelTitle(level.title);
      generateQuestion();
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
        // Save progress before moving to challenge
        saveCurrentProgress();
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

  const styles = createStyles(colors, isRTL);

  if (items.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Level not found</Text>
          <Button title={t('back')} onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const currentItem = items[currentQuestion % items.length];
  const progress = ((currentQuestion + 1) / items.length) * 100;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header with Exit Button */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={handleExit} style={styles.exitButton}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{levelTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 100 + insets.bottom }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress */}
        <View style={[styles.progressContainer, { backgroundColor: colors.surface }]}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {t('practice')}: {currentQuestion + 1} / {items.length}
          </Text>
        </View>

        {/* Question */}
        <View style={[styles.questionContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.instructionText, { color: colors.text }]}>
            {t('practice')}: {t('question')} {currentQuestion + 1}
          </Text>
          <TouchableOpacity
            style={[styles.soundButton, { backgroundColor: colors.primary }]}
            onPress={handlePlaySound}
          >
            <Ionicons name="volume-high" size={40} color="#FFFFFF" />
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
                {renderItemVisual(item, 80, styles, colors)}
                <Text style={styles.optionText}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Feedback */}
        {showFeedback && (
          <View style={styles.feedbackContainer}>
            <Text style={[styles.feedbackText, { color: isCorrect ? colors.success : colors.error }]}>
              {isCorrect ? t('greatJob') : t('tryAgain')}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Skip Button - Fixed at bottom */}
      <View style={[styles.skipContainer, { paddingBottom: insets.bottom }]}>
        <Button
          title={isRTL ? `← ${t('challenge')}` : `${t('challenge')} →`}
          onPress={async () => {
            await saveCurrentProgress();
            router.push({ pathname: '/challenge', params: { levelId } });
          }}
          variant="secondary"
          size="medium"
        />
      </View>
    </SafeAreaView>
  );
}

const renderItemVisual = (item: LearningItem, size: number = 100, styles: any, colors: any) => {
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
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      flex: 1,
      textAlign: 'center',
    },
    progressContainer: {
      padding: 20,
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    progressText: {
      textAlign: 'center',
      fontSize: 14,
      color: colors.text,
      fontWeight: '600',
    },
    questionContainer: {
      alignItems: 'center',
      padding: 30,
      marginBottom: 20,
    },
    instructionText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
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
      color: colors.text,
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
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    skipContainer: {
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

