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
import BannerAd from '@/components/BannerAd';

const categories: { category: Category; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
  { category: 'animals', icon: 'paw', color: '#FF6B6B' },
  { category: 'numbers', icon: 'calculator', color: '#45B7D1' },
  { category: 'colors', icon: 'color-palette', color: '#FFA07A' },
  { category: 'shapes', icon: 'shapes', color: '#98D8C8' },
  { category: 'countries', icon: 'globe', color: '#3498DB' },
  { category: 'fruits', icon: 'nutrition', color: '#2ECC71' },
  { category: 'sports', icon: 'football', color: '#9B59B6' },
  { category: 'vehicles', icon: 'car', color: '#E67E22' },
];

export default function CategoriesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t, isRTL } = useLanguage();
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

  const styles = createStyles(colors, isRTL);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>{t('categories')}</Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Banner Ad (top) */}
        <BannerAd style={{ marginTop: 12, marginBottom: 16 }} />

        <View style={styles.categoriesGrid}>
          {categories.map((cat) => {
            const categoryLevels = getLevelsByCategory(cat.category);
            const actualTotal = categoryLevels.length;
            const categoryProgress = progress?.categoryProgress[cat.category] || {
              completed: 0,
              total: actualTotal,
              stars: 0,
            };
            // Always use the actual total from levels data, not the stored total
            const progressPercent = actualTotal > 0
              ? (categoryProgress.completed / actualTotal) * 100
              : 0;

            return (
              <TouchableOpacity
                key={cat.category}
                style={[styles.categoryCard, { backgroundColor: cat.color + '20', borderColor: cat.color + '40' }]}
                onPress={() => handleCategoryPress(cat.category)}
                activeOpacity={0.7}
              >
                <View style={styles.categoryHeader}>
                  <View style={[styles.categoryIconContainer, { backgroundColor: cat.color + '20' }]}>
                    <Ionicons name={cat.icon} size={30} color={cat.color} />
                  </View>
                  <View style={styles.categoryInfo}>
                    <Text style={[styles.categoryTitle, { color: colors.text }]}>
                      {t(cat.category)}
                    </Text>
                    <Text style={[styles.categorySubtitle, { color: colors.textSecondary }]}>
                      {categoryProgress.completed} / {actualTotal} {t('completed')}
                    </Text>
                  </View>
                  <View style={styles.starsContainer}>
                    <Ionicons name="star" size={20} color={colors.warning} />
                    <Text style={[styles.starCount, { color: colors.text }]}>
                      {categoryProgress.stars}
                    </Text>
                  </View>
                </View>
                <View style={[styles.progressBar, { backgroundColor: cat.color + '30' }]}>
                  <View
                    style={[
                      styles.progressFill,
                      { 
                        width: `${progressPercent}%`, 
                        backgroundColor: cat.color,
                        alignSelf: isRTL ? 'flex-end' : 'flex-start',
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
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
    categoriesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 8,
    },
    categoryCard: {
      width: '48%',
      marginHorizontal: '1%',
      marginBottom: 16,
      padding: 16,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    categoryHeader: {
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 12,
    },
    categoryIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    categoryIcon: {
      fontSize: 30,
    },
    categoryInfo: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 8,
    },
    categoryTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
      textAlign: 'center',
    },
    categorySubtitle: {
      fontSize: 12,
      textAlign: 'center',
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

