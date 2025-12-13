import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface LevelCardProps {
  levelNumber: number;
  title: string;
  unlocked: boolean;
  stars?: number;
  onPress: () => void;
}

export const LevelCard: React.FC<LevelCardProps> = ({
  levelNumber,
  title,
  unlocked,
  stars = 0,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, !unlocked && styles.lockedCard]}
      onPress={unlocked ? onPress : undefined}
      activeOpacity={unlocked ? 0.7 : 1}
      disabled={!unlocked}
    >
      {!unlocked && (
        <View style={styles.lockOverlay}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>
      )}
      <Text style={styles.levelNumber}>Level {levelNumber}</Text>
      <Text style={styles.title}>{title}</Text>
      {unlocked && stars > 0 && (
        <View style={styles.starsContainer}>
          {[1, 2, 3].map((star) => (
            <Text
              key={star}
              style={[styles.star, star <= stars && styles.starFilled]}
            >
              ⭐
            </Text>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    margin: 10,
    minWidth: 140,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lockedCard: {
    backgroundColor: '#E0E0E0',
    opacity: 0.6,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 48,
  },
  levelNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 4,
  },
  star: {
    fontSize: 20,
    opacity: 0.3,
  },
  starFilled: {
    opacity: 1,
  },
});

