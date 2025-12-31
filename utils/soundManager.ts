import { Audio } from 'expo-av';
import { getSettings } from './storage';
import { Platform } from 'react-native';

let soundEnabled = true;
let audioModeConfigured = false;

export const initializeSoundManager = async () => {
  const settings = await getSettings();
  soundEnabled = settings.soundEnabled;
  
  // Configure audio mode for iOS devices (especially important for iPhone 11)
  await configureAudioMode();
};

const configureAudioMode = async () => {
  if (audioModeConfigured) return;
  
  try {
    // Set audio mode to playback - this is critical for iPhone 11 and other iOS devices
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true, // Play even when device is in silent mode
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    audioModeConfigured = true;
    console.log('Audio mode configured successfully');
  } catch (error) {
    console.error('Error configuring audio mode:', error);
    // Don't block if configuration fails, but log it
  }
};

export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
};

export const playSound = async (soundFile?: string | number, textToSpeak?: string): Promise<void> => {
  if (!soundEnabled) return;

  // Ensure audio mode is configured before playing
  if (!audioModeConfigured) {
    await configureAudioMode();
  }

  console.log("soundFile", soundFile)

  try {
    // Priority: play audio file if available
    if (soundFile) {
      let source;
      
      if (typeof soundFile === 'number') {
        // require() returns a number for local assets
        // expo-av can use the number directly
        source = soundFile;
      } else {
        // URI string for remote assets
        source = { uri: soundFile };
      }
      console.log("source", source)
      
      // Configure audio mode again before each play (helps with iPhone 11)
      if (Platform.OS === 'ios') {
        try {
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
          });
        } catch (modeError) {
          console.log('Audio mode update warning:', modeError);
        }
      }
      
      // load sound before playing
      const { sound } = await Audio.Sound.createAsync(
        source,
        { 
          shouldPlay: true, 
          volume: 1.0,
          isMuted: false,
        }
      );
      
      // Validate sound was created successfully
      if (!sound) {
        console.error('Sound object is null or undefined');
        return;
      }
      
      // Wait for sound to finish before unloading
      await new Promise<void>((resolve) => {
        let resolved = false;
        
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            if (status.didJustFinish && !resolved) {
              resolved = true;
              resolve();
            }
            // Log playback errors
            if (status.error) {
              console.error('Audio playback error:', status.error);
              if (!resolved) {
                resolved = true;
                resolve();
              }
            }
          }
        });
        
        // Fallback timeout - increased for slower devices
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            resolve();
          }
        }, 8000); // Increased from 5000 to 8000 for slower devices
      });
      
      // Safely unload sound - wrap in try-catch to prevent crashes
      try {
        if (sound) {
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            await sound.unloadAsync();
          }
        }
      } catch (unloadError) {
        console.error('Error unloading sound:', unloadError);
        // Don't throw - this is cleanup, failure is non-critical
      }
    } else if (textToSpeak) {
      // Only log if no audio file is available
      console.log('No audio file available for:', textToSpeak);
    }
  } catch (error) {
    console.error('Error playing sound:', error);
    // Try to reconfigure audio mode on error (helps with iPhone 11)
    if (Platform.OS === 'ios') {
      audioModeConfigured = false;
      await configureAudioMode();
    }
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

