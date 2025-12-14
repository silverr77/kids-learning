import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSettings, saveSettings } from '@/utils/storage';

export type Language = 'en' | 'fr' | 'ar';

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
  exit: { en: 'Exit', fr: 'Quitter', ar: 'خروج' },
  back: { en: 'Back', fr: 'Retour', ar: 'رجوع' },
  next: { en: 'Next', fr: 'Suivant', ar: 'التالي' },
  previous: { en: 'Previous', fr: 'Précédent', ar: 'السابق' },
  replay: { en: 'Replay', fr: 'Réécouter', ar: 'إعادة' },
  practice: { en: 'Practice', fr: 'Pratique', ar: 'تمرين' },
  challenge: { en: 'Challenge', fr: 'Défi', ar: 'تحدي' },
  question: { en: 'Question', fr: 'Question', ar: 'سؤال' },
  correct: { en: 'Correct', fr: 'Correct', ar: 'صحيح' },
  incorrect: { en: 'Incorrect', fr: 'Incorrect', ar: 'خطأ' },
  greatJob: { en: 'Great Job!', fr: 'Excellent travail!', ar: 'عمل رائع!' },
  tryAgain: { en: 'Try Again', fr: 'Réessayer', ar: 'حاول مرة أخرى' },
  congratulations: { en: 'Congratulations!', fr: 'Félicitations!', ar: 'تهانينا!' },
  levelCompleted: { en: 'Level Completed!', fr: 'Niveau terminé!', ar: 'اكتمل المستوى!' },
  earned: { en: 'Earned', fr: 'Gagné', ar: 'حصلت على' },
  badges: { en: 'Badges', fr: 'Badges', ar: 'شارات' },
  // Badge names
  badgeFirstStar: { en: 'First Star', fr: 'Première étoile', ar: 'النجمة الأولى' },
  badgeAnimalExpert: { en: 'Animal Expert', fr: 'Expert en animaux', ar: 'خبير الحيوانات' },
  badgeLetterMaster: { en: 'Letter Master', fr: 'Maître des lettres', ar: 'سيد الحروف' },
  badgeNumberWhiz: { en: 'Number Whiz', fr: 'As des nombres', ar: 'خبير الأرقام' },
  badgeColorArtist: { en: 'Color Artist', fr: 'Artiste des couleurs', ar: 'فنان الألوان' },
  badgeShapeGenius: { en: 'Shape Genius', fr: 'Génie des formes', ar: 'عبقري الأشكال' },
  badgeStarCollector: { en: 'Star Collector', fr: 'Collectionneur d\'étoiles', ar: 'جامع النجوم' },
  badgeSuperLearner: { en: 'Super Learner', fr: 'Super apprenant', ar: 'المتعلم الممتاز' },
  // Badge descriptions
  badgeDescFirstStar: { en: 'Complete your first level', fr: 'Complétez votre premier niveau', ar: 'أكمل مستواك الأول' },
  badgeDescAnimalExpert: { en: 'Complete all animal levels', fr: 'Complétez tous les niveaux d\'animaux', ar: 'أكمل جميع مستويات الحيوانات' },
  badgeDescLetterMaster: { en: 'Complete all letter levels', fr: 'Complétez tous les niveaux de lettres', ar: 'أكمل جميع مستويات الحروف' },
  badgeDescNumberWhiz: { en: 'Complete all number levels', fr: 'Complétez tous les niveaux de nombres', ar: 'أكمل جميع مستويات الأرقام' },
  badgeDescColorArtist: { en: 'Complete all color levels', fr: 'Complétez tous les niveaux de couleurs', ar: 'أكمل جميع مستويات الألوان' },
  badgeDescShapeGenius: { en: 'Complete all shape levels', fr: 'Complétez tous les niveaux de formes', ar: 'أكمل جميع مستويات الأشكال' },
  badgeDescStarCollector: { en: 'Collect 10 stars', fr: 'Collectez 10 étoiles', ar: 'اجمع 10 نجوم' },
  badgeDescSuperLearner: { en: 'Collect 25 stars', fr: 'Collectez 25 étoiles', ar: 'اجمع 25 نجمة' },
  animals: { en: 'Animals', fr: 'Animaux', ar: 'الحيوانات' },
  letters: { en: 'Letters', fr: 'Lettres', ar: 'الحروف' },
  numbers: { en: 'Numbers', fr: 'Nombres', ar: 'الأرقام' },
  colors: { en: 'Colors', fr: 'Couleurs', ar: 'الألوان' },
  shapes: { en: 'Shapes', fr: 'Formes', ar: 'الأشكال' },
  soundAudio: { en: 'Sound & Audio', fr: 'Son et audio', ar: 'الصوت والصوتيات' },
  soundEffects: { en: 'Sound Effects', fr: 'Effets sonores', ar: 'التأثيرات الصوتية' },
  screenTimeReminder: { en: 'Screen Time Reminder', fr: 'Rappel de temps d\'écran', ar: 'تذكير وقت الشاشة' },
  data: { en: 'Data', fr: 'Données', ar: 'البيانات' },
  resetAllProgress: { en: 'Reset All Progress', fr: 'Réinitialiser tout le progrès', ar: 'إعادة تعيين كل التقدم' },
  english: { en: 'English', fr: 'Anglais', ar: 'الإنجليزية' },
  french: { en: 'French', fr: 'Français', ar: 'الفرنسية' },
  arabic: { en: 'Arabic', fr: 'Arabe', ar: 'العربية' },
  of: { en: 'of', fr: 'de', ar: 'من' },
  seeResults: { en: 'See Results', fr: 'Voir les résultats', ar: 'عرض النتائج' },
  tapCorrectAnswer: { en: 'Tap the correct answer!', fr: 'Appuyez sur la bonne réponse!', ar: 'اضغط على الإجابة الصحيحة!' },
  whichOne: { en: 'Which one is', fr: 'Lequel est', ar: 'أي واحد هو' },
  tapThe: { en: 'Tap the', fr: 'Appuyez sur le', ar: 'اضغط على' },
  chooseLevel: { en: 'Choose a level to start learning!', fr: 'Choisissez un niveau pour commencer!', ar: 'اختر مستوى للبدء!' },
  youGot: { en: 'You got', fr: 'Vous avez obtenu', ar: 'حصلت على' },
  outOf: { en: 'out of', fr: 'sur', ar: 'من' },
  // Level titles
  farmAnimals: { en: 'Farm Animals', fr: 'Animaux de la ferme', ar: 'حيوانات المزرعة' },
  wildAnimals: { en: 'Wild Animals', fr: 'Animaux sauvages', ar: 'الحيوانات البرية' },
  lettersAE: { en: 'Letters A-E', fr: 'Lettres A-E', ar: 'الحروف أ-ه' },
  numbers15: { en: 'Numbers 1-5', fr: 'Nombres 1-5', ar: 'الأرقام 1-5' },
  basicColors: { en: 'Basic Colors', fr: 'Couleurs de base', ar: 'الألوان الأساسية' },
  basicShapes: { en: 'Basic Shapes', fr: 'Formes de base', ar: 'الأشكال الأساسية' },
  // Item names - Numbers
  one: { en: 'One', fr: 'Un', ar: 'واحد' },
  two: { en: 'Two', fr: 'Deux', ar: 'اثنان' },
  three: { en: 'Three', fr: 'Trois', ar: 'ثلاثة' },
  four: { en: 'Four', fr: 'Quatre', ar: 'أربعة' },
  five: { en: 'Five', fr: 'Cinq', ar: 'خمسة' },
  // Item names - Animals (Farm)
  cow: { en: 'Cow', fr: 'Vache', ar: 'بقرة' },
  chicken: { en: 'Chicken', fr: 'Poulet', ar: 'دجاجة' },
  sheep: { en: 'Sheep', fr: 'Mouton', ar: 'خروف' },
  horse: { en: 'Horse', fr: 'Cheval', ar: 'حصان' },
  duck: { en: 'Duck', fr: 'Canard', ar: 'بطة' },
  goat: { en: 'Goat', fr: 'Chèvre', ar: 'ماعز' },
  rabbit: { en: 'Rabbit', fr: 'Lapin', ar: 'أرنب' },
  donkey: { en: 'Donkey', fr: 'Âne', ar: 'حمار' },
  rooster: { en: 'Rooster', fr: 'Coq', ar: 'ديك' },
  // Item names - Animals (Wild)
  lion: { en: 'Lion', fr: 'Lion', ar: 'أسد' },
  elephant: { en: 'Elephant', fr: 'Éléphant', ar: 'فيل' },
  tiger: { en: 'Tiger', fr: 'Tigre', ar: 'نمر' },
  bear: { en: 'Bear', fr: 'Ours', ar: 'دب' },
  monkey: { en: 'Monkey', fr: 'Singe', ar: 'قرد' },
  giraffe: { en: 'Giraffe', fr: 'Girafe', ar: 'زرافة' },
  zebra: { en: 'Zebra', fr: 'Zèbre', ar: 'حمار وحشي' },
  wolf: { en: 'Wolf', fr: 'Loup', ar: 'ذئب' },
  fox: { en: 'Fox', fr: 'Renard', ar: 'ثعلب' },
  panda: { en: 'Panda', fr: 'Panda', ar: 'باندا' },
  // Item names - Colors (Basic)
  red: { en: 'Red', fr: 'Rouge', ar: 'أحمر' },
  blue: { en: 'Blue', fr: 'Bleu', ar: 'أزرق' },
  yellow: { en: 'Yellow', fr: 'Jaune', ar: 'أصفر' },
  green: { en: 'Green', fr: 'Vert', ar: 'أخضر' },
  orange: { en: 'Orange', fr: 'Orange', ar: 'برتقالي' },
  // Item names - Colors (More)
  purple: { en: 'Purple', fr: 'Violet', ar: 'بنفسجي' },
  pink: { en: 'Pink', fr: 'Rose', ar: 'وردي' },
  brown: { en: 'Brown', fr: 'Marron', ar: 'بني' },
  black: { en: 'Black', fr: 'Noir', ar: 'أسود' },
  white: { en: 'White', fr: 'Blanc', ar: 'أبيض' },
  gray: { en: 'Gray', fr: 'Gris', ar: 'رمادي' },
  // Item names - Shapes
  circle: { en: 'Circle', fr: 'Cercle', ar: 'دائرة' },
  square: { en: 'Square', fr: 'Carré', ar: 'مربع' },
  triangle: { en: 'Triangle', fr: 'Triangle', ar: 'مثلث' },
  rectangle: { en: 'Rectangle', fr: 'Rectangle', ar: 'مستطيل' },
  star: { en: 'Star', fr: 'Étoile', ar: 'نجمة' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
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

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
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

