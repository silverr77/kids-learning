import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { playSuccessSound, playErrorSound } from '@/utils/soundManager';

const { width } = Dimensions.get('window');

const colors = [
  { name: 'red', hex: '#FF0000', emoji: '🔴' },
  { name: 'blue', hex: '#0000FF', emoji: '🔵' },
  { name: 'green', hex: '#00FF00', emoji: '🟢' },
  { name: 'yellow', hex: '#FFFF00', emoji: '🟡' },
  { name: 'orange', hex: '#FFA500', emoji: '🟠' },
  { name: 'purple', hex: '#800080', emoji: '🟣' },
];

export default function ColorTapGame() {
  const router = useRouter();
  const { colors: themeColors } = useTheme();
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const [targetColor, setTargetColor] = useState(colors[0]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [shuffledColors, setShuffledColors] = useState(colors);

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameOver]);

  const startNewGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    generateNewTarget();
  };

  const generateNewTarget = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setTargetColor(randomColor);
    // Shuffle colors array
    const shuffled = [...colors].sort(() => Math.random() - 0.5);
    setShuffledColors(shuffled);
  };

  const handleColorTap = (color: typeof colors[0]) => {
    if (gameOver) return;

    if (color.name === targetColor.name) {
      playSuccessSound();
      setScore(score + 1);
      generateNewTarget();
    } else {
      playErrorSound();
      // Small penalty - reduce time by 1 second
      setTimeLeft(Math.max(0, timeLeft - 1));
    }
  };

  const endGame = () => {
    setGameOver(true);
    Alert.alert(
      t('gameOver'),
      t('finalScore', { score: score.toString() }),
      [
        { text: t('playAgain'), onPress: startNewGame },
        { text: t('back'), onPress: () => router.back() },
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  const styles = createStyles(themeColors, isRTL);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColors.primary }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{t('gameColorTap')}</Text>
        </View>
        <TouchableOpacity onPress={startNewGame} style={styles.restartButton}>
          <Ionicons name="refresh" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Game Info */}
      <View style={[styles.infoBar, { backgroundColor: themeColors.surface }]}>
        <View style={styles.infoItem}>
          <Ionicons name="trophy" size={20} color={themeColors.warning} />
          <Text style={[styles.infoText, { color: themeColors.text }]}>
            {t('score')}: {score}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="time" size={20} color={themeColors.secondary} />
          <Text style={[styles.infoText, { color: themeColors.text }]}>
            {t('time')}: {timeLeft}s
          </Text>
        </View>
      </View>

      {/* Target Color */}
      <View style={styles.targetContainer}>
        <Text style={styles.targetLabel}>{t('tapColor')}</Text>
        <View style={[styles.targetColorBox, { backgroundColor: targetColor.hex }]}>
          <Text style={styles.targetEmoji}>{targetColor.emoji}</Text>
        </View>
        <Text style={[styles.targetName, { color: themeColors.text }]}>
          {t(targetColor.name)}
        </Text>
      </View>

      {/* Color Options */}
      <View style={styles.colorsGrid}>
        {shuffledColors.map((color) => (
          <TouchableOpacity
            key={color.name}
            style={[styles.colorButton, { backgroundColor: color.hex }]}
            onPress={() => handleColorTap(color)}
            disabled={gameOver}
          >
            <Text style={styles.colorEmoji}>{color.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    restartButton: {
      padding: 8,
    },
    infoBar: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-around',
      paddingVertical: 16,
      paddingHorizontal: 20,
      marginTop: 8,
    },
    infoItem: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 8,
    },
    infoText: {
      fontSize: 16,
      fontWeight: '600',
    },
    targetContainer: {
      alignItems: 'center',
      paddingVertical: 32,
    },
    targetLabel: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    targetColorBox: {
      width: 120,
      height: 120,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    targetEmoji: {
      fontSize: 64,
    },
    targetName: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    colorsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      paddingHorizontal: 16,
      gap: 16,
    },
    colorButton: {
      width: (width - 64) / 3,
      height: (width - 64) / 3,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    colorEmoji: {
      fontSize: 48,
    },
  });
}

