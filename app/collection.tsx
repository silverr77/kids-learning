import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { getProgress } from '@/utils/storage';
import { UserProgress, Category } from '@/types';

const badges = [
  { id: 'first-star', name: 'First Star', icon: '⭐', description: 'Complete your first level' },
  { id: 'animal-expert', name: 'Animal Expert', icon: '🐶', description: 'Complete all animal levels' },
  { id: 'letter-master', name: 'Letter Master', icon: '🔤', description: 'Complete all letter levels' },
  { id: 'number-whiz', name: 'Number Whiz', icon: '🔢', description: 'Complete all number levels' },
  { id: 'color-artist', name: 'Color Artist', icon: '🎨', description: 'Complete all color levels' },
  { id: 'shape-genius', name: 'Shape Genius', icon: '🔺', description: 'Complete all shape levels' },
  { id: 'star-collector', name: 'Star Collector', icon: '🌟', description: 'Collect 10 stars' },
  { id: 'super-learner', name: 'Super Learner', icon: '🏆', description: 'Collect 25 stars' },
];

export default function CollectionScreen() {
  const router = useRouter();
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

    // First star
    if (userProgress.stars >= 1) {
      earned.push('first-star');
    }

    // Category badges
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

    // Star badges
    if (userProgress.stars >= 10) {
      earned.push('star-collector');
    }
    if (userProgress.stars >= 25) {
      earned.push('super-learner');
    }

    setEarnedBadges(earned);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🏆 Collection</Text>
          <Text style={styles.subtitle}>Your achievements and badges</Text>
        </View>

        {/* Stats */}
        {progress && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statNumber}>{progress.stars}</Text>
              <Text style={styles.statLabel}>Total Stars</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>✅</Text>
              <Text style={styles.statNumber}>{progress.completedLevels.length}</Text>
              <Text style={styles.statLabel}>Levels Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🏆</Text>
              <Text style={styles.statNumber}>{earnedBadges.length}</Text>
              <Text style={styles.statLabel}>Badges Earned</Text>
            </View>
          </View>
        )}

        {/* Badges Grid */}
        <View style={styles.badgesContainer}>
          <Text style={styles.sectionTitle}>Badges</Text>
          <View style={styles.badgesGrid}>
            {badges.map((badge) => {
              const isEarned = earnedBadges.includes(badge.id);
              return (
                <View
                  key={badge.id}
                  style={[
                    styles.badgeCard,
                    !isEarned && styles.badgeLocked,
                  ]}
                >
                  {!isEarned && (
                    <View style={styles.lockOverlay}>
                      <Text style={styles.lockIcon}>🔒</Text>
                    </View>
                  )}
                  <Text style={[styles.badgeIcon, !isEarned && styles.badgeIconLocked]}>
                    {badge.icon}
                  </Text>
                  <Text style={[styles.badgeName, !isEarned && styles.badgeNameLocked]}>
                    {badge.name}
                  </Text>
                  <Text style={[styles.badgeDescription, !isEarned && styles.badgeDescriptionLocked]}>
                    {badge.description}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Back Button */}
        <View style={styles.buttonContainer}>
          <Button title="← Back to Home" onPress={() => router.back()} variant="secondary" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginTop: 20,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  badgesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
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
    fontSize: 48,
    marginBottom: 10,
  },
  badgeIconLocked: {
    opacity: 0.3,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: '#999',
  },
  badgeDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  badgeDescriptionLocked: {
    color: '#999',
  },
  buttonContainer: {
    padding: 20,
    marginBottom: 20,
  },
});

