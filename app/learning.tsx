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
import Svg, { Polygon, Path } from 'react-native-svg';
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
        
        // For numbers, animals, and colors categories, get language-specific audio
        if (level.category === 'numbers' || level.category === 'animals' || level.category === 'colors') {
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
    const shapeStyle = getShapeStyle(item.data.shape);
    if (item.data.shape === 'star') {
      return (
        <View style={[styles.shapeContainer, { width: 200, height: 200 }]}>
          <Svg width="200" height="200" viewBox="0 0 200 200">
            <Polygon
              points="100,10 120,70 190,70 135,110 155,170 100,135 45,170 65,110 10,70 80,70"
              fill="#FFA07A"
            />
          </Svg>
        </View>
      );
    }
    if (item.data.shape === 'heart') {
      return (
        <View style={[styles.shapeContainer, { width: 200, height: 200 }]}>
          <Svg width="200" height="200" viewBox="0 0 200 200">
            <Path
              d="M100,180 C100,180 20,120 20,80 C20,50 40,30 70,30 C85,30 100,45 100,60 C100,45 115,30 130,30 C160,30 180,50 180,80 C180,120 100,180 100,180 Z"
              fill="#FF69B4"
            />
          </Svg>
        </View>
      );
    }
    if (item.data.shape === 'hexagon') {
      return (
        <View style={[styles.shapeContainer, { width: 200, height: 200 }]}>
          <Svg width="200" height="200" viewBox="0 0 200 200">
            <Polygon
              points="100,10 180,60 180,140 100,190 20,140 20,60"
              fill="#3498DB"
            />
          </Svg>
        </View>
      );
    }
    if (item.data.shape === 'pentagon') {
      return (
        <View style={[styles.shapeContainer, { width: 200, height: 200 }]}>
          <Svg width="200" height="200" viewBox="0 0 200 200">
            <Polygon
              points="100,10 180,70 150,160 50,160 20,70"
              fill="#F39C12"
            />
          </Svg>
        </View>
      );
    }
    if (item.data.shape === 'crescent') {
      return (
        <View style={[styles.shapeContainer, { width: 200, height: 200 }]}>
          <Svg width="200" height="200" viewBox="0 0 200 200">
            <Path
              d="M100,100 m-80,0 a80,80 0 1,0 160,0 a80,80 0 1,0 -160,0 M100,100 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0"
              fill="#E74C3C"
            />
          </Svg>
        </View>
      );
    }
    if (item.data.shape === 'arrow') {
      return (
        <View style={[styles.shapeContainer, { width: 200, height: 200 }]}>
          <Svg width="200" height="200" viewBox="0 0 200 200">
            <Polygon
              points="100,20 160,80 120,80 120,160 80,160 80,80 40,80"
              fill="#16A085"
            />
          </Svg>
        </View>
      );
    }
    return <View style={[styles.shapeContainer, shapeStyle]} />;
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
    // Sea animals
    fish: '🐟',
    dolphin: '🐬',
    whale: '🐋',
    shark: '🦈',
    octopus: '🐙',
    seal: '🦭',
    // Birds
    eagle: '🦅',
    owl: '🦉',
    parrot: '🦜',
    penguin: '🐧',
    flamingo: '🦩',
    peacock: '🦚',
    // Countries
    france: '🇫🇷',
    usa: '🇺🇸',
    uk: '🇬🇧',
    japan: '🇯🇵',
    brazil: '🇧🇷',
    egypt: '🇪🇬',
    // European countries
    germany: '🇩🇪',
    spain: '🇪🇸',
    italy: '🇮🇹',
    greece: '🇬🇷',
    netherlands: '🇳🇱',
    sweden: '🇸🇪',
    // Asian countries
    china: '🇨🇳',
    india: '🇮🇳',
    'south-korea': '🇰🇷',
    thailand: '🇹🇭',
    singapore: '🇸🇬',
    indonesia: '🇮🇩',
    // African countries
    'south-africa': '🇿🇦',
    kenya: '🇰🇪',
    morocco: '🇲🇦',
    nigeria: '🇳🇬',
    tanzania: '🇹🇿',
    ghana: '🇬🇭',
    // Fruits & Vegetables
    apple: '🍎',
    banana: '🍌',
    'orange-fruit': '🍊',
    carrot: '🥕',
    tomato: '🍅',
    broccoli: '🥦',
    // More fruits
    strawberry: '🍓',
    grape: '🍇',
    watermelon: '🍉',
    pineapple: '🍍',
    mango: '🥭',
    kiwi: '🥝',
    // More vegetables
    potato: '🥔',
    onion: '🧅',
    pepper: '🫑',
    cucumber: '🥒',
    lettuce: '🥬',
    corn: '🌽',
    // Mixed fruits & vegetables
    cherry: '🍒',
    pear: '🍐',
    cabbage: '🥬',
    spinach: '🥬',
    peas: '🫛',
    beans: '🫘',
    // Sports
    football: '⚽',
    basketball: '🏀',
    tennis: '🎾',
    swimming: '🏊',
    cycling: '🚴',
    running: '🏃',
    // Water sports
    surfing: '🏄',
    diving: '🤿',
    sailing: '⛵',
    'water-polo': '🤽',
    rowing: '🚣',
    kayaking: '🛶',
    // Winter sports
    skiing: '⛷️',
    snowboarding: '🏂',
    'ice-skating': '⛸️',
    hockey: '🏒',
    curling: '🥌',
    sledding: '🛷',
    // Team sports
    volleyball: '🏐',
    baseball: '⚾',
    soccer: '⚽',
    rugby: '🏉',
    cricket: '🏏',
    handball: '🤾',
    // Vehicles
    car: '🚗',
    bus: '🚌',
    train: '🚂',
    airplane: '✈️',
    boat: '⛵',
    bicycle: '🚲',
    // Air vehicles
    helicopter: '🚁',
    rocket: '🚀',
    'hot-air-balloon': '🎈',
    drone: '🚁',
    glider: '🪂',
    jet: '✈️',
    // Water vehicles
    ship: '🚢',
    submarine: '🛸',
    yacht: '🛥️',
    ferry: '⛴️',
    canoe: '🛶',
    sailboat: '⛵',
    // Construction vehicles
    truck: '🚚',
    bulldozer: '🚜',
    crane: '🏗️',
    excavator: '🚜',
    tractor: '🚜',
    forklift: '🚜',
  };
  return <Text style={styles.emoji}>{emojiMap[item.id] || '📚'}</Text>;
};

const getShapeStyle = (shape: string) => {
  switch (shape) {
    case 'circle':
      return { borderRadius: 100, width: 200, height: 200, backgroundColor: '#FF6B6B' };
    case 'square':
      return { borderRadius: 0, width: 200, height: 200, backgroundColor: '#4ECDC4' };
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
      return { borderRadius: 0, width: 250, height: 150, backgroundColor: '#45B7D1' };
    case 'oval':
      return { borderRadius: 100, width: 250, height: 150, backgroundColor: '#9B59B6' };
    case 'diamond':
      return {
        width: 200,
        height: 200,
        backgroundColor: '#E74C3C',
        transform: [{ rotate: '45deg' }],
      };
    case 'heart':
      return { width: 200, height: 200, backgroundColor: '#FF69B4' };
    case 'hexagon':
      return { width: 200, height: 200, backgroundColor: '#3498DB' };
    case 'pentagon':
      return { width: 200, height: 200, backgroundColor: '#F39C12' };
    case 'trapezoid':
      return {
        width: 200,
        height: 150,
        backgroundColor: '#9B59B6',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 30,
        borderRightWidth: 30,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#9B59B6',
      };
    case 'parallelogram':
      return {
        width: 200,
        height: 150,
        backgroundColor: '#E67E22',
        transform: [{ skewX: '-20deg' }],
      };
    case 'rhombus':
      return {
        width: 200,
        height: 200,
        backgroundColor: '#3498DB',
        transform: [{ rotate: '45deg' }],
      };
    case 'crescent':
      return { width: 200, height: 200, backgroundColor: '#E74C3C' };
    case 'arrow':
      return { width: 200, height: 200, backgroundColor: '#16A085' };
    case 'cube':
      return { width: 200, height: 200, backgroundColor: '#8E44AD' };
    case 'sphere':
      return { borderRadius: 100, width: 200, height: 200, backgroundColor: '#27AE60' };
    case 'cylinder':
      return { borderRadius: 20, width: 150, height: 200, backgroundColor: '#D35400' };
    case 'cone':
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
        borderBottomColor: '#C0392B',
      };
    case 'pyramid':
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
        borderBottomColor: '#F39C12',
      };
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

