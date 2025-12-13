import React, { useEffect, useState } from 'react';
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

type Theme = 'light' | 'dark' | 'system';

export default function SettingsScreen() {
  const { colors, theme, setTheme, isDark } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<AppSettings>({
    soundEnabled: true,
    musicVolume: 0.7,
    language: 'en',
    screenTimeReminder: true,
    theme: 'system',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const savedSettings = await getSettings();
    setSettings(savedSettings);
  };

  const handleToggleSound = async (value: boolean) => {
    const newSettings = { ...settings, soundEnabled: value };
    setSettings(newSettings);
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
    setLanguage(lang);
    const newSettings = { ...settings, language: lang };
    setSettings(newSettings);
    await saveSettings(newSettings);
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
    // In a real app, this would open a privacy policy page
    Alert.alert(t('privacy'), 'Privacy Policy content would go here.');
  };

  const handleAbout = () => {
    Alert.alert(
      t('about'),
      'Learn for Kids\nVersion 1.0.0\n\nAn educational app for children to learn animals, letters, numbers, colors, and shapes through interactive games.',
      [{ text: 'OK' }]
    );
  };

  const styles = createStyles(colors);

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
            {(['light', 'dark', 'system'] as Theme[]).map((themeOption) => (
              <TouchableOpacity
                key={themeOption}
                style={[
                  styles.optionButton,
                  theme === themeOption && { backgroundColor: colors.primary },
                ]}
                onPress={() => handleThemeChange(themeOption)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: theme === themeOption ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {t(themeOption)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Language Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('language')}</Text>
          <View style={styles.optionsContainer}>
            {(['en', 'fr', 'ar'] as const).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.optionButton,
                  language === lang && { backgroundColor: colors.primary },
                ]}
                onPress={() => handleLanguageChange(lang)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: language === lang ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : 'العربية'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sound Settings */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Sound & Audio</Text>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Sound Effects</Text>
            <Switch
              value={settings.soundEnabled}
              onValueChange={handleToggleSound}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Screen Time Reminder</Text>
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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Data</Text>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.error }]}
            onPress={handleResetProgress}
          >
            <Text style={styles.actionButtonText}>Reset All Progress</Text>
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

function createStyles(colors: any) {
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
    },
    optionsContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    optionButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: '#F0F0F0',
      alignItems: 'center',
    },
    optionText: {
      fontSize: 14,
      fontWeight: '600',
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    settingLabel: {
      fontSize: 16,
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

