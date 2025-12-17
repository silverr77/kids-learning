import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getProgress } from '@/utils/storage';
import { getLevelsByCategory } from '@/data/levels';
import { UserProgress, Category } from '@/types';
import BannerAd from '@/components/BannerAd';

const badgeConfig = [
  { id: 'first-star', nameKey: 'badgeFirstStar', descKey: 'badgeDescFirstStar', icon: 'star' as keyof typeof Ionicons.glyphMap },
  { id: 'animal-expert', nameKey: 'badgeAnimalExpert', descKey: 'badgeDescAnimalExpert', icon: 'paw' as keyof typeof Ionicons.glyphMap },
  { id: 'number-whiz', nameKey: 'badgeNumberWhiz', descKey: 'badgeDescNumberWhiz', icon: 'calculator' as keyof typeof Ionicons.glyphMap },
  { id: 'color-artist', nameKey: 'badgeColorArtist', descKey: 'badgeDescColorArtist', icon: 'color-palette' as keyof typeof Ionicons.glyphMap },
  { id: 'shape-genius', nameKey: 'badgeShapeGenius', descKey: 'badgeDescShapeGenius', icon: 'shapes' as keyof typeof Ionicons.glyphMap },
  { id: 'country-explorer', nameKey: 'badgeCountryExplorer', descKey: 'badgeDescCountryExplorer', icon: 'globe' as keyof typeof Ionicons.glyphMap },
  { id: 'fruit-master', nameKey: 'badgeFruitMaster', descKey: 'badgeDescFruitMaster', icon: 'nutrition' as keyof typeof Ionicons.glyphMap },
  { id: 'sport-champion', nameKey: 'badgeSportChampion', descKey: 'badgeDescSportChampion', icon: 'football' as keyof typeof Ionicons.glyphMap },
  { id: 'vehicle-driver', nameKey: 'badgeVehicleDriver', descKey: 'badgeDescVehicleDriver', icon: 'car' as keyof typeof Ionicons.glyphMap },
  { id: 'star-collector', nameKey: 'badgeStarCollector', descKey: 'badgeDescStarCollector', icon: 'star-outline' as keyof typeof Ionicons.glyphMap },
  { id: 'super-learner', nameKey: 'badgeSuperLearner', descKey: 'badgeDescSuperLearner', icon: 'trophy' as keyof typeof Ionicons.glyphMap },
];

export default function RewardsScreen() {
  const { colors } = useTheme();
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const savedProgress = await getProgress();
    if (savedProgress) {
      setProgress(savedProgress);
      calculateBadges(savedProgress);
    }
  };

  const calculateBadges = (userProgress: UserProgress) => {
    // Use stored badges from progress if available
    if (userProgress.badges && userProgress.badges.length > 0) {
      setEarnedBadges(userProgress.badges);
      return;
    }

    // Fallback: Calculate badges (for backward compatibility)
    const earned: string[] = [];

    if (userProgress.stars >= 1) {
      earned.push('first-star');
    }
    
    // Get actual level totals for each category
    const animalsTotal = getLevelsByCategory('animals').length;
    const numbersTotal = getLevelsByCategory('numbers').length;
    const colorsTotal = getLevelsByCategory('colors').length;
    const shapesTotal = getLevelsByCategory('shapes').length;
    const countriesTotal = getLevelsByCategory('countries').length;
    const fruitsTotal = getLevelsByCategory('fruits').length;
    const sportsTotal = getLevelsByCategory('sports').length;
    const vehiclesTotal = getLevelsByCategory('vehicles').length;
    
    if (userProgress.categoryProgress.animals.completed >= animalsTotal) {
      earned.push('animal-expert');
    }
    if (userProgress.categoryProgress.numbers.completed >= numbersTotal) {
      earned.push('number-whiz');
    }
    if (userProgress.categoryProgress.colors.completed >= colorsTotal) {
      earned.push('color-artist');
    }
    if (userProgress.categoryProgress.shapes.completed >= shapesTotal) {
      earned.push('shape-genius');
    }
    if (userProgress.categoryProgress.countries.completed >= countriesTotal) {
      earned.push('country-explorer');
    }
    if (userProgress.categoryProgress.fruits.completed >= fruitsTotal) {
      earned.push('fruit-master');
    }
    if (userProgress.categoryProgress.sports.completed >= sportsTotal) {
      earned.push('sport-champion');
    }
    if (userProgress.categoryProgress.vehicles.completed >= vehiclesTotal) {
      earned.push('vehicle-driver');
    }
    if (userProgress.stars >= 10) {
      earned.push('star-collector');
    }
    if (userProgress.stars >= 25) {
      earned.push('super-learner');
    }

    setEarnedBadges(earned);
  };

  const styles = createStyles(colors, isRTL);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>{t('rewards')}</Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Banner Ad (top) */}
        <BannerAd style={{ marginTop: 12, marginBottom: 16 }} />
        {/* Stats */}
        {progress && (
          <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
            <View style={styles.statCard}>
              <Ionicons name="star" size={32} color={colors.primary} />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {progress.stars}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {t('stars')}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={32} color={colors.secondary} />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {progress.completedLevels.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {t('completed')}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="trophy" size={32} color={colors.warning} />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {earnedBadges.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {t('badges')}
              </Text>
            </View>
          </View>
        )}

        {/* Badges Grid */}
        <View style={styles.badgesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('badges')}</Text>
          <View style={styles.badgesGrid}>
            {badgeConfig.map((badge) => {
              const isEarned = earnedBadges.includes(badge.id);
              return (
                <View
                  key={badge.id}
                  style={[
                    styles.badgeCard,
                    { backgroundColor: colors.surface },
                    !isEarned && styles.badgeLocked,
                  ]}
                >
                  {!isEarned && (
                    <View style={styles.lockOverlay}>
                      <Ionicons name="lock-closed" size={48} color={colors.textSecondary} />
                    </View>
                  )}
                  <Ionicons 
                    name={badge.icon} 
                    size={48} 
                    color={isEarned ? colors.primary : colors.textSecondary}
                    style={!isEarned && { opacity: 0.3 }}
                  />
                  <Text style={[styles.badgeName, { color: colors.text }]}>
                    {t(badge.nameKey)}
                  </Text>
                  <Text style={[styles.badgeDescription, { color: colors.textSecondary }]}>
                    {t(badge.descKey)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

function createStyles(colors: any, isRTL: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      paddingTop: 20,
      paddingBottom: 20,
      paddingHorizontal: 20,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: isRTL ? 'right' : 'left',
    },
    scrollView: {
      flex: 1,
      paddingTop: 16,
      paddingBottom: 20,
    },
    statsContainer: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-around',
      marginHorizontal: 16,
      marginBottom: 24,
      padding: 20,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    statCard: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 8,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
    },
    badgesSection: {
      paddingHorizontal: 16,
      paddingBottom: 20,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: isRTL ? 'right' : 'left',
    },
    badgesGrid: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    badgeCard: {
      width: '48%',
      padding: 16,
      borderRadius: 16,
      alignItems: 'center',
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    badgeLocked: {
      opacity: 0.5,
    },
    lockOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      borderRadius: 16,
    },
    badgeIcon: {
      marginBottom: 12,
    },
    badgeName: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
      textAlign: 'center',
    },
    badgeDescription: {
      fontSize: 12,
      textAlign: 'center',
    },
  });
}

