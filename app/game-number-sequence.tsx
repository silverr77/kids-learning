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

export default function NumberSequenceGame() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setCurrentLevel(1);
    setScore(0);
    setGameOver(false);
    generateSequence(1);
  };

  const generateSequence = (level: number) => {
    const length = 3 + level; // Start with 3 numbers, add 1 each level
    const newSequence: number[] = [];
    for (let i = 0; i < length; i++) {
      newSequence.push(Math.floor(Math.random() * 10) + 1);
    }
    setSequence(newSequence);
    setUserSequence([]);
    setIsShowingSequence(true);
    
    // Hide sequence after showing it
    setTimeout(() => {
      setIsShowingSequence(false);
    }, 2000 + (level * 500)); // Show longer for higher levels
  };

  const handleNumberPress = (number: number) => {
    if (isShowingSequence || gameOver) return;

    const newUserSequence = [...userSequence, number];
    setUserSequence(newUserSequence);

    // Check if correct
    if (newUserSequence[newUserSequence.length - 1] === sequence[newUserSequence.length - 1]) {
      playSuccessSound();
      
      // Check if sequence is complete
      if (newUserSequence.length === sequence.length) {
        // Level complete
        const levelScore = sequence.length * 10;
        setScore(score + levelScore);
        setCurrentLevel(currentLevel + 1);
        
        setTimeout(() => {
          generateSequence(currentLevel + 1);
        }, 1000);
      }
    } else {
      // Wrong number
      playErrorSound();
      setGameOver(true);
      Alert.alert(
        t('gameOver'),
        t('sequenceGameOver', { level: currentLevel.toString(), score: score.toString() }),
        [
          { text: t('playAgain'), onPress: startNewGame },
          { text: t('back'), onPress: () => router.back() },
        ]
      );
    }
  };

  const handleBack = () => {
    router.back();
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
          <Text style={styles.headerTitle}>{t('gameNumberSequence')}</Text>
        </View>
        <TouchableOpacity onPress={startNewGame} style={styles.restartButton}>
          <Ionicons name="refresh" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Game Info */}
      <View style={[styles.infoBar, { backgroundColor: colors.surface }]}>
        <View style={styles.infoItem}>
          <Ionicons name="trophy" size={20} color={colors.warning} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            {t('score')}: {score}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="layers" size={20} color={colors.secondary} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            {t('level')}: {currentLevel}
          </Text>
        </View>
      </View>

      {/* Sequence Display */}
      <View style={styles.sequenceContainer}>
        <Text style={[styles.sequenceLabel, { color: colors.text }]}>
          {isShowingSequence ? t('watchSequence') : t('repeatSequence')}
        </Text>
        <View style={styles.sequenceDisplay}>
          {isShowingSequence ? (
            sequence.map((num, index) => (
              <View key={index} style={[styles.sequenceNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.sequenceNumberText}>{num}</Text>
              </View>
            ))
          ) : (
            userSequence.map((num, index) => (
              <View key={index} style={[styles.sequenceNumber, { backgroundColor: colors.secondary }]}>
                <Text style={styles.sequenceNumberText}>{num}</Text>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Number Pad */}
      <View style={styles.numberPad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <TouchableOpacity
            key={num}
            style={[styles.numberButton, { backgroundColor: colors.surface }]}
            onPress={() => handleNumberPress(num)}
            disabled={isShowingSequence || gameOver}
          >
            <Text style={[styles.numberButtonText, { color: colors.text }]}>{num}</Text>
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
    sequenceContainer: {
      alignItems: 'center',
      paddingVertical: 32,
    },
    sequenceLabel: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 24,
    },
    sequenceDisplay: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 12,
      minHeight: 80,
    },
    sequenceNumber: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    sequenceNumberText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    numberPad: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      paddingHorizontal: 16,
      gap: 12,
      paddingBottom: 20,
    },
    numberButton: {
      width: (width - 64) / 5,
      height: (width - 64) / 5,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    numberButtonText: {
      fontSize: 24,
      fontWeight: 'bold',
    },
  });
}

