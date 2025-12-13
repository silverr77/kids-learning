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
import { UserProgress } from '@/types';

const badges = [
  { id: 'first-star', name: 'First Star', icon: 'star' as keyof typeof Ionicons.glyphMap, description: 'Complete your first level' },
  { id: 'animal-expert', name: 'Animal Expert', icon: 'paw' as keyof typeof Ionicons.glyphMap, description: 'Complete all animal levels' },
  { id: 'letter-master', name: 'Letter Master', icon: 'text' as keyof typeof Ionicons.glyphMap, description: 'Complete all letter levels' },
  { id: 'number-whiz', name: 'Number Whiz', icon: 'calculator' as keyof typeof Ionicons.glyphMap, description: 'Complete all number levels' },
  { id: 'color-artist', name: 'Color Artist', icon: 'color-palette' as keyof typeof Ionicons.glyphMap, description: 'Complete all color levels' },
  { id: 'shape-genius', name: 'Shape Genius', icon: 'shapes' as keyof typeof Ionicons.glyphMap, description: 'Complete all shape levels' },
  { id: 'star-collector', name: 'Star Collector', icon: 'star-outline' as keyof typeof Ionicons.glyphMap, description: 'Collect 10 stars' },
  { id: 'super-learner', name: 'Super Learner', icon: 'trophy' as keyof typeof Ionicons.glyphMap, description: 'Collect 25 stars' },
];

export default function RewardsScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
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
    const earned: string[] = [];

    if (userProgress.stars >= 1) {
      earned.push('first-star');
    }
    if (userProgress.categoryProgress.animals.completed >= 2) {
      earned.push('animal-expert');
    }
    if (userProgress.categoryProgress.letters.completed >= 1) {
      earned.push('letter-master');
    }
    if (userProgress.categoryProgress.numbers.completed >= 1) {
      earned.push('number-whiz');
    }
    if (userProgress.categoryProgress.colors.completed >= 1) {
      earned.push('color-artist');
    }
    if (userProgress.categoryProgress.shapes.completed >= 1) {
      earned.push('shape-genius');
    }
    if (userProgress.stars >= 10) {
      earned.push('star-collector');
    }
    if (userProgress.stars >= 25) {
      earned.push('super-learner');
    }

    setEarnedBadges(earned);
  };

  const styles = createStyles(colors);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>{t('rewards')}</Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
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
                Badges
              </Text>
            </View>
          </View>
        )}

        {/* Badges Grid */}
        <View style={styles.badgesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Badges</Text>
          <View style={styles.badgesGrid}>
            {badges.map((badge) => {
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
                      <Text style={styles.lockIcon}>🔒</Text>
                    </View>
                  )}
                  <Ionicons 
                    name={badge.icon} 
                    size={48} 
                    color={isEarned ? colors.primary : colors.textSecondary}
                    style={!isEarned && { opacity: 0.3 }}
                  />
                  <Text style={[styles.badgeName, { color: colors.text }]}>
                    {badge.name}
                  </Text>
                  <Text style={[styles.badgeDescription, { color: colors.textSecondary }]}>
                    {badge.description}
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

function createStyles(colors: any) {
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
    },
    scrollView: {
      flex: 1,
      paddingTop: 16,
      paddingBottom: 20,
    },
    statsContainer: {
      flexDirection: 'row',
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
    },
    badgesGrid: {
      flexDirection: 'row',
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
    },
    lockIcon: {
      fontSize: 48,
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

