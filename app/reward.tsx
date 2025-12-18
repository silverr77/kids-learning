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
import { getLevelById, getLevelsByCategory } from '@/data/levels';
import { getProgress, saveProgress } from '@/utils/storage';
import { getLevelTitle } from '@/utils/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import { playSuccessSound } from '@/utils/soundManager';
import { Category, UserProgress } from '@/types';
import { interstitialAdManager } from '@/utils/interstitialAd';

export default function RewardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ levelId: string; stars: string; score: string }>();
  const levelId = params.levelId as string;
  const starsEarned = parseInt(params.stars || '1', 10);
  const score = parseInt(params.score || '0', 10);
  const { t, language, isRTL } = useLanguage();
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
    
    // Show interstitial ad after level completion (with frequency control)
    // Delay slightly to let the reward animation play first
    const adTimer = setTimeout(() => {
      interstitialAdManager.showAdAfterLevelCompletion();
    }, 2000);
    
    return () => clearTimeout(adTimer);
  }, [language]);

  const loadLevel = () => {
    const level = getLevelById(levelId);
    if (level) {
      setLevelTitle(getLevelTitle(levelId, language as 'en' | 'fr' | 'ar'));
      saveLevelProgress(level);
    }
  };

  const saveLevelProgress = async (level: { category: string }) => {
    let progress = await getProgress();
    
    // Initialize progress if it doesn't exist
    if (!progress) {
      const { getDefaultProgress } = await import('@/utils/storage');
      progress = getDefaultProgress();
    }

    if (level.category) {
      const category = level.category as Category;
      const wasAlreadyCompleted = progress.completedLevels.includes(levelId);
      
      // Ensure categoryProgress exists and has the category
      if (!progress.categoryProgress) {
        const { getDefaultProgress } = await import('@/utils/storage');
        progress.categoryProgress = getDefaultProgress().categoryProgress;
      }
      if (!progress.categoryProgress[category]) {
        const categoryTotal = getLevelsByCategory(category as Category).length;
        progress.categoryProgress[category] = { completed: 0, total: categoryTotal, stars: 0 };
      }
      
      // Only add stars if level wasn't already completed (prevent duplicate stars)
      const starsToAdd = wasAlreadyCompleted ? 0 : starsEarned;
      
      // Update level stars (keep the highest if replayed)
      const currentLevelStars = progress.levelStars[levelId] || 0;
      const newLevelStars = Math.max(currentLevelStars, starsEarned);
      
      // Calculate new total stars
      const newTotalStars = progress.stars + starsToAdd;
      
      // Calculate badges based on new progress
      const newBadges = [...new Set(progress.badges)];
      
      // First star badge
      if (newTotalStars >= 1 && !newBadges.includes('first-star')) {
        newBadges.push('first-star');
      }
      
      // Category completion badges
      const newCategoryCompleted = wasAlreadyCompleted 
        ? progress.categoryProgress[category].completed 
        : progress.categoryProgress[category].completed + 1;
      
      // Get actual level totals for each category
      const categoryTotal = getLevelsByCategory(category as Category).length;
      
      if (category === 'animals' && newCategoryCompleted >= categoryTotal && !newBadges.includes('animal-expert')) {
        newBadges.push('animal-expert');
      }
      if (category === 'numbers' && newCategoryCompleted >= categoryTotal && !newBadges.includes('number-whiz')) {
        newBadges.push('number-whiz');
      }
      if (category === 'colors' && newCategoryCompleted >= categoryTotal && !newBadges.includes('color-artist')) {
        newBadges.push('color-artist');
      }
      if (category === 'shapes' && newCategoryCompleted >= categoryTotal && !newBadges.includes('shape-genius')) {
        newBadges.push('shape-genius');
      }
      if (category === 'countries' && newCategoryCompleted >= categoryTotal && !newBadges.includes('country-explorer')) {
        newBadges.push('country-explorer');
      }
      if (category === 'fruits' && newCategoryCompleted >= categoryTotal && !newBadges.includes('fruit-master')) {
        newBadges.push('fruit-master');
      }
      if (category === 'sports' && newCategoryCompleted >= categoryTotal && !newBadges.includes('sport-champion')) {
        newBadges.push('sport-champion');
      }
      if (category === 'vehicles' && newCategoryCompleted >= categoryTotal && !newBadges.includes('vehicle-driver')) {
        newBadges.push('vehicle-driver');
      }
      
      // Star collector badges
      if (newTotalStars >= 10 && !newBadges.includes('star-collector')) {
        newBadges.push('star-collector');
      }
      if (newTotalStars >= 25 && !newBadges.includes('super-learner')) {
        newBadges.push('super-learner');
      }
      
      const updatedProgress: UserProgress = {
        ...progress,
        completedLevels: wasAlreadyCompleted 
          ? progress.completedLevels 
          : [...new Set([...progress.completedLevels, levelId])],
        stars: newTotalStars,
        badges: newBadges,
        levelStars: {
          ...progress.levelStars,
          [levelId]: newLevelStars,
        },
        categoryProgress: {
          ...progress.categoryProgress,
          [category]: {
            ...progress.categoryProgress[category],
            completed: newCategoryCompleted,
            stars: progress.categoryProgress[category].stars + starsToAdd,
          },
        },
      };
      
      await saveProgress(updatedProgress);
      console.log('Progress saved:', updatedProgress);
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
        <Text style={styles.congratulations}>{t('congratulations')} 🎊</Text>
        <Text style={styles.levelTitle}>{levelTitle}</Text>
        <Text style={styles.completedText}>{t('levelCompleted')}</Text>

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
          <Text style={styles.scoreText}>
            {t('youGot')} {score} {t('outOf')} 5 {t('correct')}!
          </Text>
          <Text style={styles.starsText}>
            {t('earned')} {starsEarned} {t('stars')}! ⭐
          </Text>
        </View>

        {/* Badge */}
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeIcon}>🏆</Text>
          <Text style={styles.badgeText}>{t('greatJob')}</Text>
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={t('continue') + ` ${isRTL ? '←' : '→'}`}
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

