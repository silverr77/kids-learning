import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getProgress } from '@/utils/storage';
import { getLevelsByCategory } from '@/data/levels';
import { Category, UserProgress } from '@/types';

const categories: { category: Category; title: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
  { category: 'animals', title: 'Animals', icon: 'paw', color: '#FF6B6B' },
  { category: 'letters', title: 'Letters', icon: 'text', color: '#4ECDC4' },
  { category: 'numbers', title: 'Numbers', icon: 'calculator', color: '#45B7D1' },
  { category: 'colors', title: 'Colors', icon: 'color-palette', color: '#FFA07A' },
  { category: 'shapes', title: 'Shapes', icon: 'shapes', color: '#98D8C8' },
];

export default function CategoriesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const savedProgress = await getProgress();
    if (savedProgress) {
      setProgress(savedProgress);
    }
  };

  const handleCategoryPress = (category: Category) => {
    router.push({
      pathname: '/level-overview',
      params: { category },
    });
  };

  const styles = createStyles(colors);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>{t('categories')}</Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        {categories.map((cat) => {
          const categoryLevels = getLevelsByCategory(cat.category);
          const categoryProgress = progress?.categoryProgress[cat.category] || {
            completed: 0,
            total: categoryLevels.length,
            stars: 0,
          };
          const progressPercent = categoryProgress.total > 0
            ? (categoryProgress.completed / categoryProgress.total) * 100
            : 0;

          return (
            <TouchableOpacity
              key={cat.category}
              style={[styles.categoryCard, { backgroundColor: colors.surface }]}
              onPress={() => handleCategoryPress(cat.category)}
              activeOpacity={0.7}
            >
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryIconContainer, { backgroundColor: cat.color + '20' }]}>
                  <Ionicons name={cat.icon} size={30} color={cat.color} />
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={[styles.categoryTitle, { color: colors.text }]}>
                    {cat.title}
                  </Text>
                  <Text style={[styles.categorySubtitle, { color: colors.textSecondary }]}>
                    {categoryProgress.completed} / {categoryProgress.total} {t('completed')}
                  </Text>
                </View>
                <View style={styles.starsContainer}>
                  <Ionicons name="star" size={20} color={colors.warning} />
                  <Text style={[styles.starCount, { color: colors.text }]}>
                    {categoryProgress.stars}
                  </Text>
                </View>
              </View>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progressPercent}%`, backgroundColor: cat.color },
                  ]}
                />
              </View>
            </TouchableOpacity>
          );
        })}
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
    categoryCard: {
      marginHorizontal: 16,
      marginBottom: 16,
      padding: 20,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    categoryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    categoryIconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    categoryIcon: {
      fontSize: 30,
    },
    categoryInfo: {
      flex: 1,
    },
    categoryTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    categorySubtitle: {
      fontSize: 14,
    },
    starsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    starCount: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    progressBar: {
      height: 8,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
  });
}

