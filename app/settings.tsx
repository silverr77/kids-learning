import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { getSettings, saveSettings, resetProgress, AppSettings } from '@/utils/storage';

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings>({
    soundEnabled: true,
    musicVolume: 0.7,
    language: 'en',
    screenTimeReminder: true,
  });
  const [parentGateAnswer, setParentGateAnswer] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const savedSettings = await getSettings();
    setSettings(savedSettings);
  };

  const handleParentGate = () => {
    const answer = parseInt(parentGateAnswer, 10);
    if (answer === 7 + 3) {
      setIsUnlocked(true);
      setParentGateAnswer('');
    } else {
      Alert.alert('Incorrect', 'Please try again.');
      setParentGateAnswer('');
    }
  };

  const handleToggleSound = (value: boolean) => {
    const newSettings = { ...settings, soundEnabled: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleVolumeChange = (value: number) => {
    const newSettings = { ...settings, musicVolume: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleToggleReminder = (value: boolean) => {
    const newSettings = { ...settings, screenTimeReminder: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all progress? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetProgress();
            Alert.alert('Success', 'Progress has been reset.');
            router.push('/');
          },
        },
      ]
    );
  };

  if (!isUnlocked) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.parentGateContainer}>
          <Text style={styles.parentGateTitle}>Settings Lock 🔒</Text>
          <Text style={styles.parentGateQuestion}>What is 7 + 3?</Text>
          <TextInput
            style={styles.parentGateInput}
            value={parentGateAnswer}
            onChangeText={setParentGateAnswer}
            keyboardType="numeric"
            placeholder="Enter answer"
            placeholderTextColor="#999"
          />
          <Button
            title="Unlock Settings"
            onPress={handleParentGate}
            variant="primary"
          />
          <View style={styles.backButtonContainer}>
            <Button
              title="← Back"
              onPress={() => router.back()}
              variant="secondary"
              size="medium"
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>⚙️ Settings</Text>
          <Text style={styles.subtitle}>Parent Controls</Text>
        </View>

        {/* Sound Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sound & Audio</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Sound Effects</Text>
            <Switch
              value={settings.soundEnabled}
              onValueChange={handleToggleSound}
              trackColor={{ false: '#767577', true: '#4A90E2' }}
              thumbColor={settings.soundEnabled ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Music Volume</Text>
            <Text style={styles.volumeText}>
              {Math.round(settings.musicVolume * 100)}%
            </Text>
          </View>
        </View>

        {/* Screen Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Screen Time</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Reminder</Text>
            <Switch
              value={settings.screenTimeReminder}
              onValueChange={handleToggleReminder}
              trackColor={{ false: '#767577', true: '#4A90E2' }}
              thumbColor={settings.screenTimeReminder ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Current: English</Text>
          </View>
        </View>

        {/* Reset Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <Button
            title="Reset All Progress"
            onPress={handleResetProgress}
            variant="secondary"
          />
          <Text style={styles.warningText}>
            This will delete all progress, stars, and badges.
          </Text>
        </View>

        {/* Back Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="← Back to Home"
            onPress={() => router.back()}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  parentGateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  parentGateTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  parentGateQuestion: {
    fontSize: 24,
    color: '#666',
    marginBottom: 20,
  },
  parentGateInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 18,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  backButtonContainer: {
    marginTop: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
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
    color: '#333',
  },
  volumeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  warningText: {
    fontSize: 12,
    color: '#E74C3C',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 20,
    marginBottom: 20,
  },
});

