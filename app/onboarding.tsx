import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { setOnboardingCompleted } from '@/utils/storage';

const { width } = Dimensions.get('window');

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  isLanguageSelection?: boolean;
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [fadeAnim] = useState(new Animated.Value(1));

  // Get onboarding steps based on selected language
  const getOnboardingSteps = (lang: Language): OnboardingStep[] => {
    const steps: Record<Language, OnboardingStep[]> = {
      en: [
        {
          id: 0,
          title: 'Welcome!',
          description: 'Choose your language to get started',
          icon: 'language',
          isLanguageSelection: true,
        },
        {
          id: 1,
          title: 'Learn',
          description: 'Explore new words, numbers, and shapes through interactive cards. Tap to hear pronunciations!',
          icon: 'book',
        },
        {
          id: 2,
          title: 'Practice',
          description: 'Reinforce what you learned with fun interactive exercises. No pressure, just play!',
          icon: 'game-controller',
        },
        {
          id: 3,
          title: 'Challenge',
          description: 'Test your knowledge in the final challenge. Earn stars based on your performance!',
          icon: 'trophy',
        },
        {
          id: 4,
          title: 'Earn Rewards',
          description: 'Collect stars and unlock badges as you complete levels. Track your progress!',
          icon: 'star',
        },
      ],
      fr: [
        {
          id: 0,
          title: 'Bienvenue!',
          description: 'Choisissez votre langue pour commencer',
          icon: 'language',
          isLanguageSelection: true,
        },
        {
          id: 1,
          title: 'Apprendre',
          description: 'Explorez de nouveaux mots, nombres et formes à travers des cartes interactives. Appuyez pour entendre les prononciations!',
          icon: 'book',
        },
        {
          id: 2,
          title: 'Pratiquer',
          description: 'Renforcez ce que vous avez appris avec des exercices interactifs amusants. Pas de pression, jouez simplement!',
          icon: 'game-controller',
        },
        {
          id: 3,
          title: 'Défi',
          description: 'Testez vos connaissances dans le défi final. Gagnez des étoiles selon vos performances!',
          icon: 'trophy',
        },
        {
          id: 4,
          title: 'Gagner des Récompenses',
          description: 'Collectez des étoiles et débloquez des badges en complétant les niveaux. Suivez votre progression!',
          icon: 'star',
        },
      ],
      ar: [
        {
          id: 0,
          title: 'مرحباً!',
          description: 'اختر لغتك للبدء',
          icon: 'language',
          isLanguageSelection: true,
        },
        {
          id: 1,
          title: 'تعلم',
          description: 'استكشف كلمات وأرقام وأشكال جديدة من خلال البطاقات التفاعلية. اضغط لسماع النطق!',
          icon: 'book',
        },
        {
          id: 2,
          title: 'تمرن',
          description: 'عزز ما تعلمته من خلال تمارين تفاعلية ممتعة. لا ضغط، فقط العب!',
          icon: 'game-controller',
        },
        {
          id: 3,
          title: 'تحدي',
          description: 'اختبر معرفتك في التحدي النهائي. اربح نجوم بناءً على أدائك!',
          icon: 'trophy',
        },
        {
          id: 4,
          title: 'اكسب المكافآت',
          description: 'اجمع النجوم وافتح الشارات أثناء إكمال المستويات. تتبع تقدمك!',
          icon: 'star',
        },
      ],
    };
    return steps[lang];
  };

  const steps = getOnboardingSteps(selectedLanguage);

  useEffect(() => {
    // Animate step change
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentStep, selectedLanguage]);

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLanguage(lang);
    setLanguage(lang);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = async () => {
    await setOnboardingCompleted();
    router.replace('/(tabs)');
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const styles = createStyles(colors, isRTL);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Skip Button */}
      {!isFirstStep && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>{selectedLanguage === 'ar' ? 'تخطي' : selectedLanguage === 'fr' ? 'Passer' : 'Skip'}</Text>
        </TouchableOpacity>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name={currentStepData.icon} size={80} color={colors.primary} />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>{currentStepData.title}</Text>

          {/* Language Selection */}
          {currentStepData.isLanguageSelection ? (
            <View style={styles.languageContainer}>
              {(['en', 'fr', 'ar'] as Language[]).map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.languageButton,
                    {
                      backgroundColor: selectedLanguage === lang ? colors.primary : colors.surface,
                      borderColor: selectedLanguage === lang ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => handleLanguageSelect(lang)}
                >
                  <Text
                    style={[
                      styles.languageText,
                      {
                        color: selectedLanguage === lang ? '#FFFFFF' : colors.text,
                        fontWeight: selectedLanguage === lang ? 'bold' : 'normal',
                      },
                    ]}
                  >
                    {lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : 'العربية'}
                  </Text>
                  {selectedLanguage === lang && (
                    <Ionicons 
                      name="checkmark-circle" 
                      size={24} 
                      color="#FFFFFF" 
                      style={{ marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }} 
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            /* Description */
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {currentStepData.description}
            </Text>
          )}

          {/* Step Indicators */}
          <View style={styles.indicators}>
            {steps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  {
                    backgroundColor: index === currentStep ? colors.primary : colors.border,
                    width: index === currentStep ? 24 : 8,
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={[styles.navigation, { paddingBottom: insets.bottom + 20 }]}>
        {!isFirstStep && (
          <TouchableOpacity
            style={[styles.navButton, styles.backButton, { backgroundColor: colors.surface }]}
            onPress={handleBack}
          >
            <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={20} color={colors.text} />
            <Text style={[styles.navButtonText, { color: colors.text }]}>
              {selectedLanguage === 'ar' ? 'السابق' : selectedLanguage === 'fr' ? 'Précédent' : 'Back'}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.navButton, styles.nextButton, { backgroundColor: colors.primary }]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {isLastStep
              ? selectedLanguage === 'ar'
                ? 'ابدأ'
                : selectedLanguage === 'fr'
                ? 'Commencer'
                : 'Get Started'
              : selectedLanguage === 'ar'
              ? 'التالي'
              : selectedLanguage === 'fr'
              ? 'Suivant'
              : 'Next'}
          </Text>
          {!isLastStep && (
            <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function createStyles(colors: any, isRTL: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    skipButton: {
      position: 'absolute',
      top: 60,
      right: isRTL ? undefined : 20,
      left: isRTL ? 20 : undefined,
      zIndex: 10,
      padding: 10,
    },
    skipText: {
      fontSize: 16,
      fontWeight: '600',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 100,
    },
    content: {
      alignItems: 'center',
    },
    iconContainer: {
      width: 160,
      height: 160,
      borderRadius: 80,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    description: {
      fontSize: 18,
      lineHeight: 28,
      textAlign: 'center',
      paddingHorizontal: 20,
      marginBottom: 40,
    },
    languageContainer: {
      width: '100%',
      gap: 16,
      marginBottom: 40,
    },
    languageButton: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      borderRadius: 16,
      borderWidth: 2,
    },
    languageText: {
      fontSize: 18,
      fontWeight: '600',
    },
    indicators: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      marginTop: 20,
    },
    indicator: {
      height: 8,
      borderRadius: 4,
    },
    navigation: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
      gap: 12,
    },
    navButton: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 16,
      gap: 8,
    },
    backButton: {
      flex: 1,
    },
    nextButton: {
      flex: 2,
    },
    navButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    nextButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
  });
}

