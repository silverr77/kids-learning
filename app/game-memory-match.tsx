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
const CARD_SIZE = (width - 48) / 4;

// Simple emoji pairs for memory match
const emojiPairs = ['🐶', '🐱', '🐼', '🐨', '🦁', '🐯', '🐸', '🐷'];

export default function MemoryMatchGame() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    // Create pairs and shuffle
    const pairs = [...emojiPairs, ...emojiPairs];
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardPress = (index: number) => {
    if (flipped.includes(index) || matched.includes(index) || flipped.length >= 2) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      
      if (cards[first] === cards[second]) {
        // Match found
        playSuccessSound();
        setMatched([...matched, first, second]);
        setFlipped([]);
        
        // Check if game is won (all pairs matched)
        const newMatched = [...matched, first, second];
        if (newMatched.length === cards.length) {
          setTimeout(() => {
            setGameWon(true);
            Alert.alert(
              t('congratulations'),
              t('gameWon', { moves: (moves + 1).toString() }),
              [
                { text: t('playAgain'), onPress: startNewGame },
                { text: t('back'), onPress: () => router.back() },
              ]
            );
          }, 500);
        }
      } else {
        // No match
        playErrorSound();
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
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
          <Text style={styles.headerTitle}>{t('gameMemoryMatch')}</Text>
        </View>
        <TouchableOpacity onPress={startNewGame} style={styles.restartButton}>
          <Ionicons name="refresh" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Game Info */}
      <View style={[styles.infoBar, { backgroundColor: colors.surface }]}>
        <View style={styles.infoItem}>
          <Ionicons name="move" size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            {t('moves')}: {moves}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="checkmark-circle" size={20} color={colors.secondary} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            {t('matched')}: {matched.length / 2} / {emojiPairs.length}
          </Text>
        </View>
      </View>

      {/* Game Board */}
      <View style={styles.gameBoard}>
        {cards.map((emoji, index) => {
          const isFlipped = flipped.includes(index);
          const isMatched = matched.includes(index);
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                isFlipped && styles.cardFlipped,
                isMatched && styles.cardMatched,
                { backgroundColor: isMatched ? colors.secondary : colors.surface },
              ]}
              onPress={() => handleCardPress(index)}
              disabled={isMatched}
            >
              {isFlipped || isMatched ? (
                <Text style={styles.emoji}>{emoji}</Text>
              ) : (
                <Ionicons name="help-circle" size={32} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          );
        })}
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
    gameBoard: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      gap: 8,
    },
    card: {
      width: CARD_SIZE,
      height: CARD_SIZE,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    cardFlipped: {
      backgroundColor: colors.primary + '20',
    },
    cardMatched: {
      opacity: 0.7,
    },
    emoji: {
      fontSize: 40,
    },
  });
}

