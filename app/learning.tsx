import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { getLevelById } from '@/data/levels';
import { playSound } from '@/utils/soundManager';
import { LearningItem } from '@/types';

const { width } = Dimensions.get('window');

export default function LearningScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ levelId: string }>();
  const levelId = params.levelId as string;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState<LearningItem[]>([]);
  const [levelTitle, setLevelTitle] = useState('');
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadLevel();
    slideAnim.setValue(0);
  }, [levelId]);

  useEffect(() => {
    if (items.length > 0 && currentIndex < items.length) {
      playItemSound(items[currentIndex]);
      slideAnim.setValue(-currentIndex * width);
    }
  }, [currentIndex, items]);

  const loadLevel = () => {
    const level = getLevelById(levelId);
    if (level) {
      setItems(level.items);
      setLevelTitle(level.title);
    }
  };

  const playItemSound = async (item: LearningItem) => {
    await playSound(item.sound, item.pronunciation || item.name);
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      Animated.timing(slideAnim, {
        toValue: -(currentIndex + 1) * width,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setCurrentIndex(currentIndex + 1);
    } else {
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

  const currentItem = items[currentIndex];
  const progress = ((currentIndex + 1) / items.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
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
                {renderItemVisual(item)}
              </View>

              {/* Name */}
              <Text style={styles.itemName}>{item.name}</Text>

              {/* Replay Button */}
              <TouchableOpacity
                style={styles.replayButton}
                onPress={handleReplaySound}
              >
                <Text style={styles.replayIcon}>🔊</Text>
                <Text style={styles.replayText}>Replay</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <Button
          title="← Previous"
          onPress={handlePrevious}
          variant="secondary"
          disabled={currentIndex === 0}
          size="medium"
        />
        <Button
          title={currentIndex === items.length - 1 ? 'Continue →' : 'Next →'}
          onPress={handleNext}
          variant="primary"
          size="medium"
        />
      </View>
    </SafeAreaView>
  );
}

const renderItemVisual = (item: LearningItem) => {
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
    color: '#333',
    marginBottom: 20,
    textTransform: 'capitalize',
  },
  replayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  replayIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  replayText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
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
    color: '#666',
    marginBottom: 20,
  },
});

