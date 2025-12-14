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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LevelCard } from '@/components/LevelCard';
import { getLevelsByCategory, getLevelById } from '@/data/levels';
import { getProgress } from '@/utils/storage';
import { getLevelTitle } from '@/utils/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Category, Level, UserProgress } from '@/types';

export default function LevelOverviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category: Category }>();
  const category = params.category as Category;
  const { t, language, isRTL } = useLanguage();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [levels, setLevels] = useState<Level[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    loadData();
  }, [category, language]);

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

  const getCategoryColor = (cat: Category): string => {
    const colors: Record<Category, string> = {
      animals: '#FF6B6B',
      numbers: '#45B7D1',
      colors: '#FFA07A',
      shapes: '#98D8C8',
      countries: '#3498DB',
      fruits: '#2ECC71',
      sports: '#9B59B6',
      vehicles: '#E67E22',
    };
    return colors[cat] || '#4A90E2';
  };

  const getCategoryTitle = (cat: Category): string => {
    return t(cat);
  };

  const getLevelColors = (cat: Category, levelNumber: number): { backgroundColor: string; borderColor: string } => {
    // Define color palettes for each category
    const colorPalettes: Record<Category, string[]> = {
      animals: ['#FFE5E5', '#FFD4D4', '#FFC4C4', '#FFB3B3'], // Light reds
      numbers: ['#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6'], // Light blues
      colors: ['#FFF3E0', '#FFE0B2', '#FFCC80', '#FFB74D'], // Light oranges
      shapes: ['#E0F2F1', '#B2DFDB', '#80CBC4', '#4DB6AC'], // Light teals
      countries: ['#E8EAF6', '#C5CAE9', '#9FA8DA', '#7986CB'], // Light purples
      fruits: ['#E8F5E9', '#C8E6C9', '#A5D6A7', '#81C784'], // Light greens
      sports: ['#F3E5F5', '#E1BEE7', '#CE93D8', '#BA68C8'], // Light purples
      vehicles: ['#FFF8E1', '#FFECB3', '#FFE082', '#FFD54F'], // Light yellows
    };

    const palette = colorPalettes[cat] || colorPalettes.animals;
    const colorIndex = (levelNumber - 1) % palette.length;
    const bgColor = palette[colorIndex];
    const borderColor = getCategoryColor(cat);

    return {
      backgroundColor: bgColor,
      borderColor: borderColor,
    };
  };

  const styles = createStyles(colors, isRTL);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Header with Back Button */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.categoryTitle}>{getCategoryTitle(category)}</Text>
          <Text style={styles.subtitle}>{t('chooseLevel')}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 + insets.bottom }}
      >
        {/* Levels Grid */}
        <View style={styles.levelsContainer}>
          {levels.map((level) => {
            // Get stars from stored progress
            const levelStars = progress?.levelStars?.[level.id] || 0;
            // Get background color for this level
            const levelColors = getLevelColors(category, level.levelNumber);
            return (
              <LevelCard
                key={level.id}
                levelNumber={level.levelNumber}
                title={getLevelTitle(level.id, language as 'en' | 'fr' | 'ar')}
                unlocked={level.unlocked}
                stars={levelStars}
                onPress={() => handleLevelPress(level.id)}
                isRTL={isRTL}
                backgroundColor={levelColors.backgroundColor}
                borderColor={levelColors.borderColor}
              />
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
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 20,
      paddingBottom: 20,
      paddingHorizontal: 16,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    backButton: {
      padding: 8,
    },
    headerTextContainer: {
      flex: 1,
    },
    categoryTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 4,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: '#FFFFFF',
      opacity: 0.9,
      textAlign: 'center',
    },
    scrollView: {
      flex: 1,
      paddingTop: 16,
    },
    levelsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 8,
    },
  });
}

