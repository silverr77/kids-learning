import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getProgress } from '@/utils/storage';
import { UserProgress } from '@/types';

const { width } = Dimensions.get('window');

const gamesConfig = [
  {
    id: 'memory-match',
    nameKey: 'gameMemoryMatch',
    descKey: 'gameDescMemoryMatch',
    icon: 'grid' as keyof typeof Ionicons.glyphMap,
    requiredBadges: 2,
    color: '#FF6B6B',
  },
  {
    id: 'color-tap',
    nameKey: 'gameColorTap',
    descKey: 'gameDescColorTap',
    icon: 'color-palette' as keyof typeof Ionicons.glyphMap,
    requiredBadges: 4,
    color: '#4ECDC4',
  },
  {
    id: 'number-sequence',
    nameKey: 'gameNumberSequence',
    descKey: 'gameDescNumberSequence',
    icon: 'calculator' as keyof typeof Ionicons.glyphMap,
    requiredBadges: 6,
    color: '#FFE66D',
  },
];

export default function GamesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t, isRTL } = useLanguage();
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
      setEarnedBadges(savedProgress.badges || []);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleGamePress = (gameId: string) => {
    router.push(`/game-${gameId}`);
  };

  const isGameUnlocked = (requiredBadges: number) => {
    return earnedBadges.length >= requiredBadges;
  };

  const styles = createStyles(colors, isRTL);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{t('games')}</Text>
          <Text style={styles.subtitle}>{t('gamesSubtitle')}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 + insets.bottom }}
      >
        {/* Games Grid */}
        <View style={styles.gamesContainer}>
          {gamesConfig.map((game) => {
            const unlocked = isGameUnlocked(game.requiredBadges);
            return (
              <TouchableOpacity
                key={game.id}
                style={[
                  styles.gameCard,
                  { backgroundColor: game.color },
                  !unlocked && styles.gameLocked,
                ]}
                onPress={() => unlocked && handleGamePress(game.id)}
                disabled={!unlocked}
              >
                {!unlocked && (
                  <View style={styles.lockOverlay}>
                    <Ionicons name="lock-closed" size={48} color="#FFFFFF" />
                    <Text style={styles.lockText}>
                      {t('unlockWithBadges', { count: game.requiredBadges.toString() })}
                    </Text>
                  </View>
                )}
                <Ionicons 
                  name={game.icon} 
                  size={64} 
                  color="#FFFFFF"
                  style={!unlocked && { opacity: 0.5 }}
                />
                <Text style={styles.gameName}>{t(game.nameKey)}</Text>
                <Text style={styles.gameDescription}>{t(game.descKey)}</Text>
                {unlocked && (
                  <View style={styles.playButton}>
                    <Ionicons name="play" size={24} color={game.color} />
                    <Text style={[styles.playButtonText, { color: game.color }]}>
                      {t('play')}
                    </Text>
                  </View>
                )}
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
      alignItems: 'center',
    },
    headerTitle: {
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
    gamesContainer: {
      paddingHorizontal: 16,
    },
    gameCard: {
      width: '100%',
      marginBottom: 20,
      padding: 24,
      borderRadius: 24,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
      minHeight: 200,
      justifyContent: 'center',
    },
    gameLocked: {
      opacity: 0.7,
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
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 24,
    },
    lockText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
      marginTop: 8,
      textAlign: 'center',
    },
    gameName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginTop: 16,
      marginBottom: 8,
      textAlign: 'center',
    },
    gameDescription: {
      fontSize: 16,
      color: '#FFFFFF',
      opacity: 0.9,
      textAlign: 'center',
      marginBottom: 16,
    },
    playButton: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 20,
      marginTop: 8,
    },
    playButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: isRTL ? 0 : 8,
      marginRight: isRTL ? 8 : 0,
    },
  });
}

