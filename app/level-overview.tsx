import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { LevelCard } from '@/components/LevelCard';
import { getLevelsByCategory, getLevelById } from '@/data/levels';
import { getProgress } from '@/utils/storage';
import { Category, Level, UserProgress } from '@/types';

const categoryInfo: Record<Category, { title: string; icon: string }> = {
  animals: { title: 'Animals', icon: '🐶' },
  letters: { title: 'Letters', icon: '🔤' },
  numbers: { title: 'Numbers', icon: '🔢' },
  colors: { title: 'Colors', icon: '🎨' },
  shapes: { title: 'Shapes', icon: '🔺' },
};

export default function LevelOverviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category: Category }>();
  const category = params.category as Category;
  const [levels, setLevels] = useState<Level[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    loadData();
  }, [category]);

  const loadData = async () => {
    const categoryLevels = getLevelsByCategory(category);
    const savedProgress = await getProgress();

    // Update unlocked status based on progress
    const updatedLevels = categoryLevels.map((level) => {
      const isCompleted = savedProgress?.completedLevels.includes(level.id) || false;
      const hasEnoughStars = (savedProgress?.stars || 0) >= level.requiredStars;
      return {
        ...level,
        unlocked: level.requiredStars === 0 || hasEnoughStars,
      };
    });

    setLevels(updatedLevels);
    setProgress(savedProgress);
  };

  const handleLevelPress = (levelId: string) => {
    router.push({
      pathname: '/learning',
      params: { levelId },
    });
  };

  const handleBack = () => {
    router.back();
  };

  const categoryData = categoryInfo[category] || { title: 'Category', icon: '📚' };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.categoryIcon}>{categoryData.icon}</Text>
          <Text style={styles.categoryTitle}>{categoryData.title}</Text>
          <Text style={styles.subtitle}>Choose a level to start learning!</Text>
        </View>

        {/* Levels Grid */}
        <View style={styles.levelsContainer}>
          {levels.map((level) => {
            const levelStars = progress?.completedLevels.includes(level.id)
              ? Math.floor(Math.random() * 3) + 1 // In real app, store stars per level
              : 0;
            return (
              <LevelCard
                key={level.id}
                levelNumber={level.levelNumber}
                title={level.title}
                unlocked={level.unlocked}
                stars={levelStars}
                onPress={() => handleLevelPress(level.id)}
              />
            );
          })}
        </View>

        {/* Back Button */}
        <View style={styles.buttonContainer}>
          <Button title="← Back to Home" onPress={handleBack} variant="secondary" />
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
  categoryIcon: {
    fontSize: 64,
    marginBottom: 10,
  },
  categoryTitle: {
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
  levelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 15,
  },
  buttonContainer: {
    padding: 20,
    marginBottom: 20,
  },
});

