import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
  I18nManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { getLevelById } from '@/data/levels';
import { playSound } from '@/utils/soundManager';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { saveProgress, getProgress } from '@/utils/storage';
import { getItemAudio } from '@/utils/audioAssets';
import { getItemName, getLevelTitle } from '@/utils/translations';
import { LearningItem } from '@/types';

const { width } = Dimensions.get('window');

export default function LearningScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ levelId: string }>();
  const levelId = params.levelId as string;
  const { colors } = useTheme();
  const { t, isRTL, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState<LearningItem[]>([]);
  const [levelTitle, setLevelTitle] = useState('');
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadLevel();
    slideAnim.setValue(0);
  }, [levelId, language]);

  useEffect(() => {
    if (items.length > 0 && currentIndex < items.length) {
      playItemSound(items[currentIndex]);
      slideAnim.setValue(-currentIndex * width);
    }
  }, [currentIndex, items]);

  const loadLevel = () => {
    const level = getLevelById(levelId);
    if (level) {
      // Get language-specific audio and names for items
      const itemsWithAudio = level.items.map(item => {
        const updatedItem = { ...item };
        
        // Get language-specific name
        updatedItem.name = getItemName(item.id, language as 'en' | 'fr' | 'ar');
        
        // For numbers and animals categories, get language-specific audio
        if (level.category === 'numbers' || level.category === 'animals') {
          const languageAudio = getItemAudio(item.id, level.category, language as 'en' | 'fr' | 'ar');
          if (languageAudio) {
            updatedItem.sound = languageAudio;
          }
        }
        return updatedItem;
      });
      setItems(itemsWithAudio);
      // Use translated level title
      setLevelTitle(getLevelTitle(levelId, language as 'en' | 'fr' | 'ar'));
    }
  };

  const playItemSound = async (item: LearningItem) => {
    // Use the item's sound (which is now language-specific) or fallback to pronunciation
    await playSound(item.sound, item.pronunciation || item.name);
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
            // Save current progress
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
      // Mark level as in progress (not completed, but started)
      const updatedProgress = {
        ...progress,
        currentLevel: levelId,
        currentLevelIndex: currentIndex,
      };
      await saveProgress(updatedProgress);
    }
  };

  const handleNext = async () => {
    if (currentIndex < items.length - 1) {
      Animated.timing(slideAnim, {
        toValue: -(currentIndex + 1) * width,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setCurrentIndex(currentIndex + 1);
      // Save progress
      await saveCurrentProgress();
    } else {
      // Save progress before moving to practice
      await saveCurrentProgress();
      // Move to practice screen
      router.push({
        pathname: '/practice',
        params: { levelId },
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      Animated.timing(slideAnim, {
        toValue: -(currentIndex - 1) * width,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleReplaySound = () => {
    if (items[currentIndex]) {
      playItemSound(items[currentIndex]);
    }
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

  const currentItem = items[currentIndex];
  const progress = ((currentIndex + 1) / items.length) * 100;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with Exit Button */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={handleExit} style={styles.exitButton}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{levelTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.primary }]} />
        </View>
        <Text style={[styles.progressText, { color: colors.text }]}>
          {currentIndex + 1} / {items.length}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Animated.View
          style={[
            styles.cardsContainer,
            {
              width: width * items.length,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {items.map((item, index) => (
            <View key={item.id} style={[styles.card, { width }]}>
              {/* Visual Representation */}
              <View style={styles.visualContainer}>
                {renderItemVisual(item, styles)}
              </View>

              {/* Name */}
              <Text style={styles.itemName}>{item.name}</Text>

              {/* Replay Button */}
              <TouchableOpacity
                style={[styles.replayButton, { backgroundColor: colors.primary }]}
                onPress={handleReplaySound}
              >
                <Ionicons name="volume-high" size={24} color="#FFFFFF" />
                <Text style={styles.replayText}>{t('replay')}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Navigation */}
      <View style={[styles.navigationContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Button
          title={isRTL ? `${t('next')} →` : `← ${t('previous')}`}
          onPress={handlePrevious}
          variant="secondary"
          disabled={currentIndex === 0}
          size="medium"
        />
        <Button
          title={currentIndex === items.length - 1 ? t('continue') : isRTL ? `← ${t('next')}` : `${t('next')} →`}
          onPress={handleNext}
          variant="primary"
          size="medium"
        />
      </View>
    </SafeAreaView>
  );
}

const renderItemVisual = (item: LearningItem, styles: any) => {
  // For letters
  if (item.data?.uppercase) {
    return (
      <View style={styles.letterContainer}>
        <Text style={styles.letterUppercase}>{item.data.uppercase}</Text>
        <Text style={styles.letterLowercase}>{item.data.lowercase}</Text>
      </View>
    );
  }

  // For numbers
  if (item.data?.number) {
    return (
      <View style={styles.numberContainer}>
        <Text style={styles.numberText}>{item.data.number}</Text>
        <View style={styles.countContainer}>
          {Array.from({ length: Math.min(item.data.count, 10) }).map((_, i) => (
            <View key={i} style={styles.countDot} />
          ))}
        </View>
      </View>
    );
  }

  // For colors
  if (item.data?.color) {
    return (
      <View
        style={[
          styles.colorCircle,
          { backgroundColor: item.data.color },
        ]}
      />
    );
  }

  // For shapes
  if (item.data?.shape) {
    return <View style={[styles.shapeContainer, getShapeStyle(item.data.shape)]} />;
  }

  // Default: Emoji representation
  const emojiMap: Record<string, string> = {
    // Farm animals
    cow: '🐄',
    chicken: '🐔',
    sheep: '🐑',
    horse: '🐴',
    duck: '🦆',
    goat: '🐐',
    rabbit: '🐰',
    donkey: '🫏',
    rooster: '🐓',
    // Wild animals
    lion: '🦁',
    elephant: '🐘',
    tiger: '🐅',
    bear: '🐻',
    monkey: '🐵',
    giraffe: '🦒',
    zebra: '🦓',
    wolf: '🐺',
    fox: '🦊',
    panda: '🐼',
  };
  return <Text style={styles.emoji}>{emojiMap[item.id] || '📚'}</Text>;
};

const getShapeStyle = (shape: string) => {
  switch (shape) {
    case 'circle':
      return { borderRadius: 100, width: 200, height: 200 };
    case 'square':
      return { borderRadius: 20, width: 200, height: 200 };
    case 'triangle':
      return {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 100,
        borderRightWidth: 100,
        borderBottomWidth: 173,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#FF6B6B',
      };
    case 'rectangle':
      return { borderRadius: 10, width: 250, height: 150 };
    case 'star':
      return { borderRadius: 0, width: 200, height: 200 };
    default:
      return {};
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
      backgroundColor: colors.surface,
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
      borderRadius: 4,
    },
    progressText: {
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '600',
    },
    contentContainer: {
      flex: 1,
      overflow: 'hidden',
    },
    cardsContainer: {
      flexDirection: 'row',
    },
    card: {
      width: width,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 30,
    },
    visualContainer: {
      width: '100%',
      height: 300,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 30,
    },
    itemName: {
      fontSize: 48,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 20,
      textTransform: 'capitalize',
    },
    replayButton: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 25,
      marginTop: 20,
      gap: 8,
    },
    replayText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    navigationContainer: {
      justifyContent: 'space-around',
      padding: 20,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 12,
    },
  letterContainer: {
    alignItems: 'center',
  },
  letterUppercase: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 20,
  },
  letterLowercase: {
    fontSize: 100,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  numberContainer: {
    alignItems: 'center',
  },
  numberText: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#45B7D1',
    marginBottom: 30,
  },
  countContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  countDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF6B6B',
  },
  colorCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#333',
  },
  shapeContainer: {
    backgroundColor: '#FF6B6B',
  },
    emoji: {
      fontSize: 150,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      fontSize: 18,
      color: colors.textSecondary,
      marginBottom: 20,
    },
  });
}

