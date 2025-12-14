// Audio assets mapping for numbers and animals by language
type Language = 'en' | 'fr' | 'ar';

// Import all number audio files
const numberAudios: Record<Language, Record<string, number>> = {
  en: {
    '1': require('@/assets/numbers/en/1.mp3'),
    '2': require('@/assets/numbers/en/2.mp3'),
    '3': require('@/assets/numbers/en/3.mp3'),
    '4': require('@/assets/numbers/en/4.mp3'),
    '5': require('@/assets/numbers/en/5.mp3'),
    '6': require('@/assets/numbers/en/6.mp3'),
  },
  fr: {
    '1': require('@/assets/numbers/fr/1.mp3'),
    '2': require('@/assets/numbers/fr/2.mp3'),
    '3': require('@/assets/numbers/fr/3.mp3'),
    '4': require('@/assets/numbers/fr/4.mp3'),
    '5': require('@/assets/numbers/fr/5.mp3'),
  },
  ar: {
    '1': require('@/assets/numbers/ar/1.mp3'),
    '2': require('@/assets/numbers/ar/2.mp3'),
    '3': require('@/assets/numbers/ar/3.mp3'),
    '4': require('@/assets/numbers/ar/4.mp3'),
    '5': require('@/assets/numbers/ar/5.mp3'),
  },
};

// Import all animal audio files
const animalAudios: Record<Language, Record<string, number>> = {
  en: {
    'cow': require('@/assets/animals/en/cow.mp3'),
    'chicken': require('@/assets/animals/en/chicken.mp3'),
    'sheep': require('@/assets/animals/en/sheep.mp3'),
    'horse': require('@/assets/animals/en/horse.mp3'),
    'duck': require('@/assets/animals/en/duck.mp3'),
    'goat': require('@/assets/animals/en/goat.mp3'),
    'rabbit': require('@/assets/animals/en/rabbit.mp3'),
    'donkey': require('@/assets/animals/en/donkey.mp3'),
    'rooster': require('@/assets/animals/en/rooster.mp3'),
    'lion': require('@/assets/animals/en/lion.mp3'),
    'elephant': require('@/assets/animals/en/elephant.mp3'),
    'tiger': require('@/assets/animals/en/tiger.mp3'),
    'bear': require('@/assets/animals/en/bear.mp3'),
    'monkey': require('@/assets/animals/en/monkey.mp3'),
    'giraffe': require('@/assets/animals/en/giraffe.mp3'),
    'zebra': require('@/assets/animals/en/zebra.mp3'),
    'wolf': require('@/assets/animals/en/wolf.mp3'),
    'fox': require('@/assets/animals/en/fox.mp3'),
    'panda': require('@/assets/animals/en/panda.mp3'),
  },
  fr: {
    'cow': require('@/assets/animals/fr/cow.mp3'),
    'chicken': require('@/assets/animals/fr/chicken.mp3'),
    'sheep': require('@/assets/animals/fr/sheep.mp3'),
    'horse': require('@/assets/animals/fr/horse.mp3'),
    'duck': require('@/assets/animals/fr/duck.mp3'),
    'goat': require('@/assets/animals/fr/goat.mp3'),
    'rabbit': require('@/assets/animals/fr/rabbit.mp3'),
    'donkey': require('@/assets/animals/fr/dockey.mp3'), // Note: file is named dockey.mp3
    'rooster': require('@/assets/animals/fr/rooster.mp3'),
    'lion': require('@/assets/animals/fr/lion.mp3'),
    'elephant': require('@/assets/animals/fr/elephant.mp3'),
    'tiger': require('@/assets/animals/fr/tiger.mp3'),
    'bear': require('@/assets/animals/fr/bear.mp3'),
    'monkey': require('@/assets/animals/fr/monkey.mp3'),
    'giraffe': require('@/assets/animals/fr/giraffe.mp3'),
    'zebra': require('@/assets/animals/fr/zebra.mp3'),
    'wolf': require('@/assets/animals/fr/wolf.mp3'),
    'fox': require('@/assets/animals/fr/fox.mp3'),
    'panda': require('@/assets/animals/fr/panda.mp3'),
  },
  ar: {
    'cow': require('@/assets/animals/ar/cow.mp3'),
    'chicken': require('@/assets/animals/ar/chicken.mp3'),
    'sheep': require('@/assets/animals/ar/sheep.mp3'),
    'horse': require('@/assets/animals/ar/horse.mp3'),
    'duck': require('@/assets/animals/ar/duck.mp3'),
    'goat': require('@/assets/animals/ar/goat.mp3'),
    'rabbit': require('@/assets/animals/ar/rabbit.mp3'),
    'donkey': require('@/assets/animals/ar/donkey.mp3'),
    'rooster': require('@/assets/animals/ar/rooster.mp3'),
    'lion': require('@/assets/animals/ar/lion.mp3'),
    'elephant': require('@/assets/animals/ar/elephant.mp3'),
    'tiger': require('@/assets/animals/ar/tiger.mp3'),
    'bear': require('@/assets/animals/ar/bear.mp3'),
    'monkey': require('@/assets/animals/ar/monkey.mp3'),
    'giraffe': require('@/assets/animals/ar/giraffe.mp3'),
    'zebra': require('@/assets/animals/ar/zebra.mp3'),
    'wolf': require('@/assets/animals/ar/wolf.mp3'),
    'fox': require('@/assets/animals/ar/fox.mp3'),
    'panda': require('@/assets/animals/ar/panda.mp3'),
  },
};

/**
 * Get the audio file for a number item based on language
 * @param itemId - The item ID (e.g., '1', '2', '3')
 * @param language - The current language ('en', 'fr', 'ar')
 * @returns The require() result (number) for the audio file, or undefined if not found
 */
export const getNumberAudio = (itemId: string, language: Language = 'en'): number | undefined => {
  return numberAudios[language]?.[itemId];
};

/**
 * Get the audio file for an animal item based on language
 * @param itemId - The item ID (e.g., 'cow', 'lion', 'elephant')
 * @param language - The current language ('en', 'fr', 'ar')
 * @returns The require() result (number) for the audio file, or undefined if not found
 */
export const getAnimalAudio = (itemId: string, language: Language = 'en'): number | undefined => {
  return animalAudios[language]?.[itemId];
};

/**
 * Get audio file for any learning item based on category and language
 * @param itemId - The item ID
 * @param category - The category (e.g., 'numbers', 'animals')
 * @param language - The current language
 * @returns The require() result (number) for the audio file, or undefined if not found
 */
export const getItemAudio = (
  itemId: string,
  category: string,
  language: Language = 'en'
): number | undefined => {
  if (category === 'numbers') {
    return getNumberAudio(itemId, language);
  }
  if (category === 'animals') {
    return getAnimalAudio(itemId, language);
  }
  // Add other categories here as needed
  return undefined;
};

