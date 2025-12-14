import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '@/contexts/LanguageContext';

interface LevelCardProps {
  levelNumber: number;
  title: string;
  unlocked: boolean;
  stars?: number;
  onPress: () => void;
  isRTL?: boolean;
  backgroundColor?: string;
  borderColor?: string;
}

export const LevelCard: React.FC<LevelCardProps> = ({
  levelNumber,
  title,
  unlocked,
  stars = 0,
  onPress,
  isRTL = false,
  backgroundColor = '#FFFFFF',
  borderColor = '#E5E5EA',
}) => {
  const { t } = useLanguage();
  
  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: unlocked ? backgroundColor : '#E0E0E0', borderColor: borderColor + '40' },
        !unlocked && styles.lockedCard
      ]}
      onPress={unlocked ? onPress : undefined}
      activeOpacity={unlocked ? 0.7 : 1}
      disabled={!unlocked}
    >
      {!unlocked && (
        <View style={styles.lockOverlay}>
          <Ionicons name="lock-closed" size={48} color="#999" />
        </View>
      )}
      <Text style={styles.levelNumber}>
        {isRTL ? `${levelNumber} ${t('level')}` : `${t('level')} ${levelNumber}`}
      </Text>
      <Text style={styles.title}>{title}</Text>
      {unlocked && stars > 0 && (
        <View style={[styles.starsContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {[1, 2, 3].map((star) => (
            <Ionicons
              key={star}
              name={star <= stars ? 'star' : 'star-outline'}
              size={20}
              color="#FFD700"
            />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: 16,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
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

