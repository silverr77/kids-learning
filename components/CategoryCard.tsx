import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  title: string;
  icon: string;
  progress: number;
  totalLevels: number;
  onPress: () => void;
}

const categoryColors: Record<Category, string> = {
  animals: '#FF6B6B',
  letters: '#4ECDC4',
  numbers: '#45B7D1',
  colors: '#FFA07A',
  shapes: '#98D8C8',
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  title,
  icon,
  progress,
  totalLevels,
  onPress,
}) => {
  const progressPercent = totalLevels > 0 ? (progress / totalLevels) * 100 : 0;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: categoryColors[category] }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {progress}/{totalLevels}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 15,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  icon: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

