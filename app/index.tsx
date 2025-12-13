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
import { CategoryCard } from '@/components/CategoryCard';
import { getProgress, saveProgress } from '@/utils/storage';
import { getLevelsByCategory, levels } from '@/data/levels';
import { Category, UserProgress } from '@/types';
import { initializeSoundManager } from '@/utils/soundManager';

const categories: { category: Category; title: string; icon: string }[] = [
  { category: 'animals', title: 'Animals', icon: '🐶' },
  { category: 'letters', title: 'Letters', icon: '🔤' },
  { category: 'numbers', title: 'Numbers', icon: '🔢' },
  { category: 'colors', title: 'Colors', icon: '🎨' },
  { category: 'shapes', title: 'Shapes', icon: '🔺' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [totalStars, setTotalStars] = useState(0);

  useEffect(() => {
    loadProgress();
    initializeSoundManager();
  }, []);

  const loadProgress = async () => {
    const savedProgress = await getProgress();
    if (savedProgress) {
      setProgress(savedProgress);
      setTotalStars(savedProgress.stars);
    } else {
      // Initialize default progress
      const defaultProgress: UserProgress = {
        completedLevels: [],
        stars: 0,
        badges: [],
        categoryProgress: {
          animals: { completed: 0, total: 2, stars: 0 },
          letters: { completed: 0, total: 1, stars: 0 },
          numbers: { completed: 0, total: 1, stars: 0 },
          colors: { completed: 0, total: 1, stars: 0 },
          shapes: { completed: 0, total: 1, stars: 0 },
        },
      };
      await saveProgress(defaultProgress);
      setProgress(defaultProgress);
    }
  };

  const handleCategoryPress = (category: Category) => {
    router.push({
      pathname: '/level-overview',
      params: { category },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🎓</Text>
          <Text style={styles.title}>Learn for Kids</Text>
          <View style={styles.starCounter}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.starCount}>{totalStars}</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          {categories.map((cat) => {
            const categoryLevels = getLevelsByCategory(cat.category);
            const categoryProgress = progress?.categoryProgress[cat.category] || {
              completed: 0,
              total: categoryLevels.length,
              stars: 0,
            };
            return (
              <CategoryCard
                key={cat.category}
                category={cat.category}
                title={cat.title}
                icon={cat.icon}
                progress={categoryProgress.completed}
                totalLevels={categoryLevels.length}
                onPress={() => handleCategoryPress(cat.category)}
              />
            );
          })}
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/collection')}
          >
            <Text style={styles.actionIcon}>🏆</Text>
            <Text style={styles.actionText}>Collection</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/settings')}
          >
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    fontSize: 64,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  starCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  starIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  starCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  categoriesContainer: {
    paddingVertical: 20,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginBottom: 20,
  },
  actionButton: {
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
  actionIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

