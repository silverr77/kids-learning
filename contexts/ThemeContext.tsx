import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { getSettings, saveSettings, AppSettings } from '@/utils/storage';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const lightColors = {
  primary: '#409c44',
  secondary: '#1CB0F6',
  background: '#FFFFFF',
  surface: '#F7F7F7',
  text: '#3C3C43',
  textSecondary: '#8E8E93',
  border: '#E5E5EA',
  success: '#409c44',
  warning: '#FFB800',
  error: '#FF3B30',
};

const darkColors = {
  primary: '#4CAF50',
  secondary: '#1CB0F6',
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
  success: '#4CAF50',
  warning: '#FFB800',
  error: '#FF3B30',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    if (theme === 'system') {
      setIsDark(systemColorScheme === 'dark');
    } else {
      setIsDark(theme === 'dark');
    }
  }, [theme, systemColorScheme]);

  const loadTheme = async () => {
    const settings = await getSettings();
    if (settings.theme) {
      setThemeState(settings.theme as Theme);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    const settings = await getSettings();
    await saveSettings({ ...settings, theme: newTheme });
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

