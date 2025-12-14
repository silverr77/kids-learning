import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, Category } from '@/types';

const STORAGE_KEYS = {
  PROGRESS: '@learnforkids:progress',
  SETTINGS: '@learnforkids:settings',
  ONBOARDING_COMPLETED: '@learnforkids:onboarding_completed',
};

export const getDefaultProgress = (): UserProgress => {
  return {
    completedLevels: [],
    stars: 0,
    badges: [],
    levelStars: {},
    categoryProgress: {
      animals: { completed: 0, total: 2, stars: 0 },
      letters: { completed: 0, total: 1, stars: 0 },
      numbers: { completed: 0, total: 1, stars: 0 },
      colors: { completed: 0, total: 1, stars: 0 },
      shapes: { completed: 0, total: 1, stars: 0 },
    },
  };
};

export interface AppSettings {
  soundEnabled: boolean;
  musicVolume: number;
  language: string;
  screenTimeReminder: boolean;
  theme?: 'light' | 'dark' | 'system';
}

export const getProgress = async (): Promise<UserProgress | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (data) {
      const progress = JSON.parse(data);
      // Ensure levelStars exists for backward compatibility
      if (!progress.levelStars) {
        progress.levelStars = {};
      }
      return progress;
    }
    return null;
  } catch (error) {
    console.error('Error getting progress:', error);
    return null;
  }
};

export const saveProgress = async (progress: UserProgress): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

export const getSettings = async (): Promise<AppSettings> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error getting settings:', error);
  }
  // Default settings
  return {
    soundEnabled: true,
    musicVolume: 0.7,
    language: 'en',
    screenTimeReminder: true,
    theme: 'system',
  };
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const resetProgress = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.PROGRESS);
  } catch (error) {
    console.error('Error resetting progress:', error);
  }
};

export const getOnboardingCompleted = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return value === 'true';
  } catch (error) {
    console.error('Error getting onboarding status:', error);
    return false;
  }
};

export const setOnboardingCompleted = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
  } catch (error) {
    console.error('Error setting onboarding status:', error);
  }
};

