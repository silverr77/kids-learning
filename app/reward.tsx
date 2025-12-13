import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { getLevelById } from '@/data/levels';
import { getProgress, saveProgress } from '@/utils/storage';
import { playSuccessSound } from '@/utils/soundManager';

export default function RewardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ levelId: string; stars: string; score: string }>();
  const levelId = params.levelId as string;
  const starsEarned = parseInt(params.stars || '1', 10);
  const score = parseInt(params.score || '0', 10);
  const [levelTitle, setLevelTitle] = useState('');
  const [confettiAnim] = useState(new Animated.Value(0));
  const [starsAnim] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);

  useEffect(() => {
    loadLevel();
    animateRewards();
    playSuccessSound();
  }, []);

  const loadLevel = () => {
    const level = getLevelById(levelId);
    if (level) {
      setLevelTitle(level.title);
      saveLevelProgress(level);
    }
  };

  const saveLevelProgress = async (level: { category: string }) => {
    const progress = await getProgress();
    if (progress && level.category) {
      const category = level.category as keyof typeof progress.categoryProgress;
      const updatedProgress = {
        ...progress,
        completedLevels: [...new Set([...progress.completedLevels, levelId])],
        stars: progress.stars + starsEarned,
        categoryProgress: {
          ...progress.categoryProgress,
          [category]: {
            ...progress.categoryProgress[category],
            completed: progress.categoryProgress[category].completed + 1,
            stars: progress.categoryProgress[category].stars + starsEarned,
          },
        },
      };
      await saveProgress(updatedProgress);
    }
  };

  const animateRewards = () => {
    // Confetti animation
    Animated.sequence([
      Animated.timing(confettiAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(confettiAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Stars animation
    starsAnim.forEach((anim, index) => {
      if (index < starsEarned) {
        Animated.sequence([
          Animated.delay(index * 200),
          Animated.spring(anim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });
  };

  const handleContinue = () => {
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Confetti Effect */}
      <View style={styles.confettiContainer}>
        <Text style={styles.confetti}>🎉</Text>
        <Text style={[styles.confetti, { left: '30%', top: '20%' }]}>✨</Text>
        <Text style={[styles.confetti, { right: '20%', top: '30%' }]}>🌟</Text>
        <Text style={[styles.confetti, { left: '20%', bottom: '20%' }]}>⭐</Text>
        <Text style={[styles.confetti, { right: '30%', bottom: '30%' }]}>🎊</Text>
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.congratulations}>Congratulations! 🎊</Text>
        <Text style={styles.levelTitle}>{levelTitle}</Text>
        <Text style={styles.completedText}>Level Completed!</Text>

        {/* Stars */}
        <View style={styles.starsContainer}>
          {[1, 2, 3].map((star, index) => {
            const scale = starsAnim[index].interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            });
            return (
              <Animated.View
                key={star}
                style={[
                  styles.starContainer,
                  { transform: [{ scale }] },
                ]}
              >
                <Text style={[
                  styles.star,
                  star <= starsEarned && styles.starFilled,
                ]}>
                  ⭐
                </Text>
              </Animated.View>
            );
          })}
        </View>

        {/* Score */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>You got {score} out of 5 correct!</Text>
          <Text style={styles.starsText}>Earned {starsEarned} stars! ⭐</Text>
        </View>

        {/* Badge */}
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeIcon}>🏆</Text>
          <Text style={styles.badgeText}>Great Job!</Text>
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Continue Learning →"
          onPress={handleContinue}
          variant="success"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  confetti: {
    position: 'absolute',
    fontSize: 40,
    opacity: 0.8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    zIndex: 2,
  },
  congratulations: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
    textAlign: 'center',
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  completedText: {
    fontSize: 20,
    color: '#666',
    marginBottom: 40,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 40,
  },
  starContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  star: {
    fontSize: 60,
    opacity: 0.3,
  },
  starFilled: {
    opacity: 1,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 20,
    color: '#333',
    marginBottom: 10,
  },
  starsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  badgeContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  badgeIcon: {
    fontSize: 64,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    padding: 20,
    zIndex: 2,
  },
});

