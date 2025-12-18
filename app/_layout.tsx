import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, I18nManager } from 'react-native';
import { useEffect } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { initializeSoundManager } from '@/utils/soundManager';

function RootStack() {
  const { isRTL } = useLanguage();
  
  // Force RTL layout for Arabic
  useEffect(() => {
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
      I18nManager.allowRTL(isRTL);
    }
  }, [isRTL]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: isRTL ? 'slide_from_left' : 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="level-overview" />
      <Stack.Screen name="learning" />
      <Stack.Screen name="practice" />
      <Stack.Screen name="challenge" />
      <Stack.Screen name="reward" />
    </Stack>
  );
}

export default function RootLayout() {
  // Initialize audio manager when app starts (important for iPhone 11)
  useEffect(() => {
    initializeSoundManager();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <ThemeProvider>
          <LanguageProvider>
            <RootStack />
          </LanguageProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

