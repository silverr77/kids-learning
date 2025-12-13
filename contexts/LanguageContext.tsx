import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSettings, saveSettings } from '@/utils/storage';

type Language = 'en' | 'fr' | 'ar';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  home: { en: 'Home', fr: 'Accueil', ar: 'الرئيسية' },
  categories: { en: 'Categories', fr: 'Catégories', ar: 'الفئات' },
  rewards: { en: 'Rewards', fr: 'Récompenses', ar: 'المكافآت' },
  settings: { en: 'Settings', fr: 'Paramètres', ar: 'الإعدادات' },
  continue: { en: 'Continue', fr: 'Continuer', ar: 'متابعة' },
  start: { en: 'Start', fr: 'Commencer', ar: 'ابدأ' },
  level: { en: 'Level', fr: 'Niveau', ar: 'المستوى' },
  stars: { en: 'Stars', fr: 'Étoiles', ar: 'النجوم' },
  progress: { en: 'Progress', fr: 'Progrès', ar: 'التقدم' },
  completed: { en: 'Completed', fr: 'Terminé', ar: 'مكتمل' },
  theme: { en: 'Theme', fr: 'Thème', ar: 'المظهر' },
  language: { en: 'Language', fr: 'Langue', ar: 'اللغة' },
  light: { en: 'Light', fr: 'Clair', ar: 'فاتح' },
  dark: { en: 'Dark', fr: 'Sombre', ar: 'داكن' },
  system: { en: 'System', fr: 'Système', ar: 'النظام' },
  privacy: { en: 'Privacy Policy', fr: 'Politique de confidentialité', ar: 'سياسة الخصوصية' },
  about: { en: 'About', fr: 'À propos', ar: 'حول' },
  currentLevel: { en: 'Current Level', fr: 'Niveau actuel', ar: 'المستوى الحالي' },
  lastReward: { en: 'Last Reward', fr: 'Dernière récompense', ar: 'آخر مكافأة' },
  todayProgress: { en: 'Today\'s Progress', fr: 'Progrès d\'aujourd\'hui', ar: 'تقدم اليوم' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const settings = await getSettings();
    if (settings.language) {
      setLanguageState(settings.language as Language);
    }
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    const settings = await getSettings();
    await saveSettings({ ...settings, language: lang });
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

