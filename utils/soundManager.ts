import { Audio } from 'expo-av';
import { getSettings } from './storage';

let soundEnabled = true;

export const initializeSoundManager = async () => {
  const settings = await getSettings();
  soundEnabled = settings.soundEnabled;
};

export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
};

export const playSound = async (soundFile?: string, textToSpeak?: string): Promise<void> => {
  if (!soundEnabled) return;

  try {
    if (textToSpeak) {
      // Use text-to-speech for pronunciation
      // In a real app, you'd use expo-speech or a TTS service
      console.log('Speaking:', textToSpeak);
      // For now, we'll simulate with a simple beep or use expo-speech
    }

    if (soundFile) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: soundFile },
        { shouldPlay: true, volume: 1.0 }
      );
      await sound.unloadAsync();
    }
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

export const playSuccessSound = async (): Promise<void> => {
  if (!soundEnabled) return;
  // Play success sound effect
  console.log('Playing success sound');
};

export const playErrorSound = async (): Promise<void> => {
  if (!soundEnabled) return;
  // Play gentle error sound
  console.log('Playing error sound');
};

