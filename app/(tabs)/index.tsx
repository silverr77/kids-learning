import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getProgress } from '@/utils/storage';
import { getLevelsByCategory, levels } from '@/data/levels';
import { getLevelTitle } from '@/utils/translations';
import { UserProgress, Category } from '@/types';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t, language, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [currentLevel, setCurrentLevel] = useState<any>(null);
  const [lastReward, setLastReward] = useState<any>(null);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const savedProgress = await getProgress();
    if (savedProgress) {
      setProgress(savedProgress);
      // Find current level (first incomplete level)
      const allLevels = levels.sort((a, b) => {
        if (a.category !== b.category) return a.category.localeCompare(b.category);
        return a.levelNumber - b.levelNumber;
      });
      const incomplete = allLevels.find(
        (level) => !savedProgress.completedLevels.includes(level.id)
      );
      setCurrentLevel(incomplete || allLevels[allLevels.length - 1]);
      
      // Get last completed level as last reward
      if (savedProgress.completedLevels.length > 0) {
        const lastCompletedId = savedProgress.completedLevels[savedProgress.completedLevels.length - 1];
        setLastReward(levels.find(l => l.id === lastCompletedId));
      }
    }
  };

  const handleContinue = () => {
    if (currentLevel) {
      router.push({
        pathname: '/learning',
        params: { levelId: currentLevel.id },
      });
    }
  };

  const styles = createStyles(colors, isRTL);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <View style={styles.headerContent}>
            <View style={styles.greetingContainer}>
              <Ionicons name={isRTL ? "hand-right" : "hand-left"} size={24} color="#FFFFFF" />
              <Text style={styles.greeting}> {t('home')}</Text>
            </View>
            <View style={styles.starBadge}>
              <Ionicons name="star" size={20} color="#FFFFFF" />
              <Text style={styles.starCount}>{progress?.stars || 0}</Text>
            </View>
          </View>
        </View>

        {/* Current Level Card */}
        {currentLevel && (
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {t('currentLevel')}
            </Text>
            <View style={styles.levelInfo}>
              <View style={styles.levelIconContainer}>
                <Ionicons 
                  name={getCategoryIcon(currentLevel.category)} 
                  size={30} 
                  color={colors.primary} 
                />
              </View>
              <View style={styles.levelDetails}>
                <Text style={[styles.levelName, { color: colors.text }]}>
                  {getLevelTitle(currentLevel.id, language as 'en' | 'fr' | 'ar')}
                </Text>
                <Text style={[styles.levelCategory, { color: colors.textSecondary }]}>
                  {t(currentLevel.category)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.continueButton, { backgroundColor: colors.primary }]}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>{t('continue')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Today's Progress */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {t('todayProgress')}
          </Text>
          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {progress?.completedLevels.length || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {t('completed')}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.secondary }]}>
                {progress?.stars || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {t('stars')}
              </Text>
            </View>
          </View>
        </View>

        {/* Last Reward */}
        {lastReward && (
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {t('lastReward')}
            </Text>
            <View style={styles.rewardInfo}>
              <Ionicons name="trophy" size={40} color={colors.warning} />
              <View style={styles.rewardDetails}>
                <Text style={[styles.rewardName, { color: colors.text }]}>
                  {getLevelTitle(lastReward.id, language as 'en' | 'fr' | 'ar')}
                </Text>
                <Text style={[styles.rewardDate, { color: colors.textSecondary }]}>
                  {t('completed')}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: colors.secondary }]}
            onPress={() => router.push('/(tabs)/categories')}
          >
            <Ionicons name="library" size={32} color="#FFFFFF" />
            <Text style={styles.quickActionText}>{t('categories')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: colors.warning }]}
            onPress={() => router.push('/(tabs)/rewards')}
          >
            <Ionicons name="trophy" size={32} color="#FFFFFF" />
            <Text style={styles.quickActionText}>{t('rewards')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: '#FF6B6B' }]}
            onPress={() => router.push('/games')}
          >
            <Ionicons name="game-controller" size={32} color="#FFFFFF" />
            <Text style={styles.quickActionText}>{t('games')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function getCategoryIcon(category: Category): keyof typeof Ionicons.glyphMap {
  const icons: Record<Category, keyof typeof Ionicons.glyphMap> = {
    animals: 'paw',
    numbers: 'calculator',
    colors: 'color-palette',
    shapes: 'shapes',
    countries: 'globe',
    fruits: 'nutrition',
    sports: 'football',
    vehicles: 'car',
  };
  return icons[category] || 'library';
}

function createStyles(colors: any, isRTL: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
      paddingBottom: 20,
    },
    header: {
      paddingTop: 20,
      paddingBottom: 30,
      paddingHorizontal: 20,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    headerContent: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    greetingContainer: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
    },
    greeting: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    starBadge: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      gap: 6,
    },
    starCount: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    card: {
      margin: 16,
      padding: 20,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: isRTL ? 'right' : 'left',
    },
    levelInfo: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    levelIconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: isRTL ? 0 : 16,
      marginLeft: isRTL ? 16 : 0,
    },
    levelDetails: {
      flex: 1,
    },
    levelName: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 4,
      textAlign: isRTL ? 'right' : 'left',
    },
    levelCategory: {
      fontSize: 14,
      textAlign: isRTL ? 'right' : 'left',
    },
    continueButton: {
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 16,
      alignItems: 'center',
    },
    continueButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    progressStats: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
    },
    rewardInfo: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 16,
    },
    rewardDetails: {
      flex: 1,
    },
    rewardName: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 4,
      textAlign: isRTL ? 'right' : 'left',
    },
    rewardDate: {
      fontSize: 14,
      textAlign: isRTL ? 'right' : 'left',
    },
    quickActions: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      paddingHorizontal: 16,
      paddingBottom: 20,
      gap: 12,
    },
    quickActionButton: {
      flex: 1,
      marginHorizontal: 8,
      paddingVertical: 20,
      borderRadius: 16,
      alignItems: 'center',
    },
    quickActionText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
  });
}

