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

  const getCategoryIcon = (cat: Category): keyof typeof Ionicons.glyphMap => {
    const icons: Record<Category, keyof typeof Ionicons.glyphMap> = {
      animals: 'paw',
      letters: 'text',
      numbers: 'calculator',
      colors: 'color-palette',
      shapes: 'shapes',
    };
    return icons[cat] || 'library';
  };

  const getCategoryColor = (cat: Category): string => {
    const colors: Record<Category, string> = {
      animals: '#FF6B6B',
      letters: '#4ECDC4',
      numbers: '#45B7D1',
      colors: '#FFA07A',
      shapes: '#98D8C8',
    };
    return colors[cat] || '#4A90E2';
  };

  const getCategoryTitle = (cat: Category): string => {
    return t(cat);
  };

  const styles = createStyles(colors, isRTL);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Header with Back Button */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={[styles.categoryIconContainer, { backgroundColor: getCategoryColor(category) + '20' }]}>
            <Ionicons 
              name={getCategoryIcon(category)} 
              size={40} 
              color={getCategoryColor(category)} 
            />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.categoryTitle}>{getCategoryTitle(category)}</Text>
            <Text style={styles.subtitle}>{t('chooseLevel')}</Text>
          </View>
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
            return (
              <LevelCard
                key={level.id}
                levelNumber={level.levelNumber}
                title={getLevelTitle(level.id, language as 'en' | 'fr' | 'ar')}
                unlocked={level.unlocked}
                stars={levelStars}
                onPress={() => handleLevelPress(level.id)}
                isRTL={isRTL}
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
    headerContent: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    categoryIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: isRTL ? 0 : 16,
      marginLeft: isRTL ? 16 : 0,
    },
    headerTextContainer: {
      flex: 1,
    },
    categoryTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 4,
      textAlign: isRTL ? 'right' : 'left',
    },
    subtitle: {
      fontSize: 16,
      color: '#FFFFFF',
      opacity: 0.9,
      textAlign: isRTL ? 'right' : 'left',
    },
    scrollView: {
      flex: 1,
      paddingTop: 16,
    },
    levelsContainer: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      padding: 15,
    },
  });
}

