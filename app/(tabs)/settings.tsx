import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getSettings, saveSettings, resetProgress, AppSettings } from '@/utils/storage';
import { setSoundEnabled } from '@/utils/soundManager';

type Theme = 'light' | 'dark' | 'system';

export default function SettingsScreen() {
  const { colors, theme, setTheme, isDark } = useTheme();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<AppSettings>({
    soundEnabled: true,
    musicVolume: 0.7,
    language: 'en',
    screenTimeReminder: true,
    theme: 'system',
  });
  const languageAudioTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadSettings();
    return () => {
      if (languageAudioTimeout.current) {
        clearTimeout(languageAudioTimeout.current);
      }
      // Restore user sound preference on unmount
      setSoundEnabled(settings.soundEnabled);
    };
  }, []);

  const loadSettings = async () => {
    const savedSettings = await getSettings();
    setSettings(savedSettings);
  };

  const handleToggleSound = async (value: boolean) => {
    const newSettings = { ...settings, soundEnabled: value };
    setSettings(newSettings);
    setSoundEnabled(value);
    await saveSettings(newSettings);
  };

  const handleToggleReminder = async (value: boolean) => {
    const newSettings = { ...settings, screenTimeReminder: value };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const handleThemeChange = async (newTheme: Theme) => {
    setTheme(newTheme);
    const newSettings = { ...settings, theme: newTheme };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const handleLanguageChange = async (lang: 'en' | 'fr' | 'ar') => {
    // Temporarily mute to avoid autoplay from other screens reacting to language change
    setSoundEnabled(false);
    if (languageAudioTimeout.current) {
      clearTimeout(languageAudioTimeout.current);
    }

    setLanguage(lang);
    const newSettings = { ...settings, language: lang };
    setSettings(newSettings);
    await saveSettings(newSettings);

    languageAudioTimeout.current = setTimeout(() => {
      setSoundEnabled(newSettings.soundEnabled);
    }, 400);
  };

  const handleResetProgress = () => {
    Alert.alert(
      t('settings'),
      'Are you sure you want to reset all progress? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetProgress();
            Alert.alert('Success', 'Progress has been reset.');
          },
        },
      ]
    );
  };

  const handlePrivacyPolicy = () => {
    const message =
      'This app stores progress, badges, and language settings locally on your device. ' +
      'We do not collect personal information like name, email, or precise location. ' +
      'Ads are served via Google AdMob, which may collect device identifiers for ad delivery and frequency capping. ' +
      'Audio and media are used only to play learning content you select. ' +
      'You can clear local progress anytime from Settings (Reset All Progress).';
    Alert.alert(t('privacy'), message, [{ text: 'OK' }]);
  };

  const handleAbout = () => {
    Alert.alert(
      t('about'),
      'تحدي - درب عقلك\nVersion 1.5.0\n\nAn educational app to learn animals, numbers, colors, shapes, countries, fruits, sports, and vehicles through interactive games and challenges.',
      [{ text: 'OK' }]
    );
  };

  const styles = createStyles(colors, isRTL);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>{t('settings')}</Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Theme Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('theme')}</Text>
          <View style={styles.optionsContainer}>
            {(['light', 'dark', 'system'] as Theme[]).map((themeOption) => {
              const isSelected = theme === themeOption;
              return (
                <TouchableOpacity
                  key={themeOption}
                  style={[
                    styles.optionButton,
                    isSelected && { 
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    },
                    !isSelected && {
                      backgroundColor: '#F0F0F0',
                      borderColor: 'transparent',
                    },
                  ]}
                  onPress={() => handleThemeChange(themeOption)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: isSelected ? '#FFFFFF' : colors.text },
                    ]}
                  >
                    {t(themeOption)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Language Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('language')}</Text>
          <View style={styles.optionsContainer}>
            {(['en', 'fr', 'ar'] as const).map((lang) => {
              const isSelected = language === lang;
              return (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.optionButton,
                    isSelected && {
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    },
                    !isSelected && {
                      backgroundColor: '#F0F0F0',
                      borderColor: 'transparent',
                    },
                  ]}
                  onPress={() => handleLanguageChange(lang)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: isSelected ? '#FFFFFF' : colors.text },
                    ]}
                  >
                    {lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : 'العربية'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Sound Settings */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('soundAudio')}</Text>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>{t('soundEffects')}</Text>
            <Switch
              value={settings.soundEnabled}
              onValueChange={handleToggleSound}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>{t('screenTimeReminder')}</Text>
            <Switch
              value={settings.screenTimeReminder}
              onValueChange={handleToggleReminder}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Data Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('data')}</Text>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.error }]}
            onPress={handleResetProgress}
          >
            <Text style={styles.actionButtonText}>{t('resetAllProgress')}</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={handlePrivacyPolicy}
          >
            <Text style={[styles.linkText, { color: colors.primary }]}>
              {t('privacy')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={handleAbout}
          >
            <Text style={[styles.linkText, { color: colors.primary }]}>
              {t('about')}
            </Text>
          </TouchableOpacity>
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
      paddingTop: 20,
      paddingBottom: 20,
      paddingHorizontal: 20,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: isRTL ? 'right' : 'left',
    },
    scrollView: {
      flex: 1,
      paddingTop: 16,
      paddingBottom: 20,
    },
    section: {
      marginHorizontal: 16,
      marginBottom: 16,
      padding: 20,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: isRTL ? 'right' : 'left',
    },
    optionsContainer: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      gap: 12,
    },
    optionButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: '#F0F0F0',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    optionText: {
      fontSize: 14,
      fontWeight: '600',
    },
    settingRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    settingLabel: {
      fontSize: 16,
      textAlign: isRTL ? 'right' : 'left',
    },
    actionButton: {
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: 'center',
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    linkButton: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    linkText: {
      fontSize: 16,
      fontWeight: '600',
    },
  });
}

