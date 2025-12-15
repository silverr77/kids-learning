// Audio assets mapping for numbers, animals, and colors by language
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
    '7': require('@/assets/numbers/en/7.mp3'),
    '8': require('@/assets/numbers/en/8.mp3'),
    '9': require('@/assets/numbers/en/9.mp3'),
    '10': require('@/assets/numbers/en/10.mp3'),
    '11': require('@/assets/numbers/en/11.mp3'),
    '12': require('@/assets/numbers/en/12.mp3'),
    '13': require('@/assets/numbers/en/13.mp3'),
    '14': require('@/assets/numbers/en/14.mp3'),
    '15': require('@/assets/numbers/en/15.mp3'),
    '16': require('@/assets/numbers/en/16.mp3'),
    '17': require('@/assets/numbers/en/17.mp3'),
    '18': require('@/assets/numbers/en/18.mp3'),
    '19': require('@/assets/numbers/en/19.mp3'),
    '20': require('@/assets/numbers/en/20.mp3'),
  },
  fr: {
    '1': require('@/assets/numbers/fr/1.mp3'),
    '2': require('@/assets/numbers/fr/2.mp3'),
    '3': require('@/assets/numbers/fr/3.mp3'),
    '4': require('@/assets/numbers/fr/4.mp3'),
    '5': require('@/assets/numbers/fr/5.mp3'),
    '6': require('@/assets/numbers/fr/6.mp3'),
    '7': require('@/assets/numbers/fr/7.mp3'),
    '8': require('@/assets/numbers/fr/8.mp3'),
    '9': require('@/assets/numbers/fr/9.mp3'),
    '10': require('@/assets/numbers/fr/10.mp3'),
    '11': require('@/assets/numbers/fr/11.mp3'),
    '12': require('@/assets/numbers/fr/12.mp3'),
    '13': require('@/assets/numbers/fr/13.mp3'),
    '14': require('@/assets/numbers/fr/14.mp3'),
    '15': require('@/assets/numbers/fr/15.mp3'),
    '16': require('@/assets/numbers/fr/16.mp3'),
    '17': require('@/assets/numbers/fr/17.mp3'),
    '18': require('@/assets/numbers/fr/18.mp3'),
    '19': require('@/assets/numbers/fr/19.mp3'),
    '20': require('@/assets/numbers/fr/20.mp3'),
  },
  ar: {
    '1': require('@/assets/numbers/ar/1.mp3'),
    '2': require('@/assets/numbers/ar/2.mp3'),
    '3': require('@/assets/numbers/ar/3.mp3'),
    '4': require('@/assets/numbers/ar/4.mp3'),
    '5': require('@/assets/numbers/ar/5.mp3'),
    '6': require('@/assets/numbers/ar/6.mp3'),
    '7': require('@/assets/numbers/ar/7.mp3'),
    '8': require('@/assets/numbers/ar/8.mp3'),
    '9': require('@/assets/numbers/ar/9.mp3'),
    '10': require('@/assets/numbers/ar/10.mp3'),
    '11': require('@/assets/numbers/ar/11.mp3'),
    '12': require('@/assets/numbers/ar/12.mp3'),
    '13': require('@/assets/numbers/ar/13.mp3'),
    '14': require('@/assets/numbers/ar/14.mp3'),
    '15': require('@/assets/numbers/ar/15.mp3'),
    '16': require('@/assets/numbers/ar/16.mp3'),
    '17': require('@/assets/numbers/ar/17.mp3'),
    '18': require('@/assets/numbers/ar/18.mp3'),
    '19': require('@/assets/numbers/ar/19.mp3'),
    '20': require('@/assets/numbers/ar/20.mp3'),
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
    'fish': require('@/assets/animals/en/fish.mp3'),
    'dolphin': require('@/assets/animals/en/dolphin.mp3'),
    'whale': require('@/assets/animals/en/whale.mp3'),
    'shark': require('@/assets/animals/en/shark.mp3'),
    'octopus': require('@/assets/animals/en/octopus.mp3'),
    'seal': require('@/assets/animals/en/seal.mp3'),
    'eagle': require('@/assets/animals/en/eagle.mp3'),
    'owl': require('@/assets/animals/en/owl.mp3'),
    'parrot': require('@/assets/animals/en/parrot.mp3'),
    'penguin': require('@/assets/animals/en/penguin.mp3'),
    'flamingo': require('@/assets/animals/en/flamingo.mp3'),
    'peacock': require('@/assets/animals/en/peacock.mp3'),
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
    'fish': require('@/assets/animals/fr/fish.mp3'),
    'dolphin': require('@/assets/animals/fr/dolphin.mp3'),
    'whale': require('@/assets/animals/fr/whale.mp3'),
    'shark': require('@/assets/animals/fr/shark.mp3'),
    'octopus': require('@/assets/animals/fr/octopus.mp3'),
    'seal': require('@/assets/animals/fr/seal.mp3'),
    'eagle': require('@/assets/animals/fr/eagle.mp3'),
    'owl': require('@/assets/animals/fr/owl.mp3'),
    'parrot': require('@/assets/animals/fr/parrot.mp3'),
    'penguin': require('@/assets/animals/fr/penguin.mp3'),
    'flamingo': require('@/assets/animals/fr/flamingo.mp3'),
    'peacock': require('@/assets/animals/fr/peacock.mp3'),
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
    'fish': require('@/assets/animals/ar/fish.mp3'),
    'dolphin': require('@/assets/animals/ar/dolphin.mp3'),
    'whale': require('@/assets/animals/ar/whale.mp3'),
    'shark': require('@/assets/animals/ar/shark.mp3'),
    'octopus': require('@/assets/animals/ar/octopus.mp3'),
    'seal': require('@/assets/animals/ar/seal.mp3'),
    'eagle': require('@/assets/animals/ar/eagle.mp3'),
    'owl': require('@/assets/animals/ar/owl.mp3'),
    'parrot': require('@/assets/animals/ar/parrot.mp3'),
    'penguin': require('@/assets/animals/ar/penguin.mp3'),
    'flamingo': require('@/assets/animals/ar/flamingo.mp3'),
    'peacock': require('@/assets/animals/ar/peacock.mp3'),
  },
};

// Import all color audio files
const colorAudios: Record<Language, Record<string, number>> = {
  en: {
    'red': require('@/assets/colors/en/red.mp3'),
    'blue': require('@/assets/colors/en/blue.mp3'),
    'yellow': require('@/assets/colors/en/yellow.mp3'),
    'green': require('@/assets/colors/en/green.mp3'),
    'orange': require('@/assets/colors/en/orange.mp3'),
    'purple': require('@/assets/colors/en/purple.mp3'),
    'pink': require('@/assets/colors/en/pink.mp3'),
    'brown': require('@/assets/colors/en/brown.mp3'),
    'black': require('@/assets/colors/en/black.mp3'),
    'white': require('@/assets/colors/en/white.mp3'),
    'gray': require('@/assets/colors/en/gray.mp3'),
    'lavender': require('@/assets/colors/en/lavender.mp3'),
    'mint': require('@/assets/colors/en/mint.mp3'),
    'peach': require('@/assets/colors/en/peach.mp3'),
    'sky-blue': require('@/assets/colors/en/sky-blue.mp3'),
    'rose': require('@/assets/colors/en/rose.mp3'),
    'cyan': require('@/assets/colors/en/cyan.mp3'),
    'magenta': require('@/assets/colors/en/magenta.mp3'),
    'lime': require('@/assets/colors/en/lime.mp3'),
    'gold': require('@/assets/colors/en/gold.mp3'),
    'silver': require('@/assets/colors/en/silver.mp3'),
  },
  fr: {
    'red': require('@/assets/colors/fr/red.mp3'),
    'blue': require('@/assets/colors/fr/blue.mp3'),
    'yellow': require('@/assets/colors/fr/yellow.mp3'),
    'green': require('@/assets/colors/fr/green.mp3'),
    'orange': require('@/assets/colors/fr/orange.mp3'),
    'purple': require('@/assets/colors/fr/purple.mp3'),
    'pink': require('@/assets/colors/fr/pink.mp3'),
    'brown': require('@/assets/colors/fr/brown.mp3'),
    'black': require('@/assets/colors/fr/black.mp3'),
    'white': require('@/assets/colors/fr/white.mp3'),
    'gray': require('@/assets/colors/fr/gray.mp3'),
    'lavender': require('@/assets/colors/fr/lavender.mp3'),
    'mint': require('@/assets/colors/fr/mint.mp3'),
    'peach': require('@/assets/colors/fr/peach.mp3'),
    'sky-blue': require('@/assets/colors/fr/sky-blue.mp3'),
    'rose': require('@/assets/colors/fr/rose.mp3'),
    'cyan': require('@/assets/colors/fr/cyan.mp3'),
    'magenta': require('@/assets/colors/fr/magenta.mp3'),
    'lime': require('@/assets/colors/fr/lime.mp3'),
    'gold': require('@/assets/colors/fr/gold.mp3'),
    'silver': require('@/assets/colors/fr/silver.mp3'),
  },
  ar: {
    'red': require('@/assets/colors/ar/red.mp3'),
    'blue': require('@/assets/colors/ar/blue.mp3'),
    'yellow': require('@/assets/colors/ar/yellow.mp3'),
    'green': require('@/assets/colors/ar/green.mp3'),
    'orange': require('@/assets/colors/ar/orange.mp3'),
    'purple': require('@/assets/colors/ar/purple.mp3'),
    'pink': require('@/assets/colors/ar/pink.mp3'),
    'brown': require('@/assets/colors/ar/brown.mp3'),
    'black': require('@/assets/colors/ar/black.mp3'),
    'white': require('@/assets/colors/ar/white.mp3'),
    'gray': require('@/assets/colors/ar/gray.mp3'),
    'lavender': require('@/assets/colors/ar/lavender.mp3'),
    'mint': require('@/assets/colors/ar/mint.mp3'),
    'peach': require('@/assets/colors/ar/peach.mp3'),
    'sky-blue': require('@/assets/colors/ar/sky-blue.mp3'),
    'rose': require('@/assets/colors/ar/rose.mp3'),
    'cyan': require('@/assets/colors/ar/cyan.mp3'),
    'magenta': require('@/assets/colors/ar/magenta.mp3'),
    'lime': require('@/assets/colors/ar/lime.mp3'),
    'gold': require('@/assets/colors/ar/gold.mp3'),
    'silver': require('@/assets/colors/ar/silver.mp3'),
  },
};

// Import all shape audio files
const shapeAudios: Record<Language, Record<string, number>> = {
  en: {
    'circle': require('@/assets/shapes/en/circle.mp3'),
    'square': require('@/assets/shapes/en/square.mp3'),
    'triangle': require('@/assets/shapes/en/triangle.mp3'),
    'rectangle': require('@/assets/shapes/en/rectangle.mp3'),
    'star': require('@/assets/shapes/en/star.mp3'),
    'oval': require('@/assets/shapes/en/oval.mp3'),
    'diamond': require('@/assets/shapes/en/diamond.mp3'),
    'heart': require('@/assets/shapes/en/heart.mp3'),
    'hexagon': require('@/assets/shapes/en/hexagon.mp3'),
    'pentagon': require('@/assets/shapes/en/pentagon.mp3'),
  },
  fr: {
    'circle': require('@/assets/shapes/fr/circle.mp3'),
    'square': require('@/assets/shapes/fr/square.mp3'),
    'triangle': require('@/assets/shapes/fr/triangle.mp3'),
    'rectangle': require('@/assets/shapes/fr/rectangle.mp3'),
    'star': require('@/assets/shapes/fr/star.mp3'),
    'oval': require('@/assets/shapes/fr/oval.mp3'),
    'diamond': require('@/assets/shapes/fr/diamond.mp3'),
    'heart': require('@/assets/shapes/fr/heart.mp3'),
    'hexagon': require('@/assets/shapes/fr/hexagon.mp3'),
    'pentagon': require('@/assets/shapes/fr/pentagon.mp3'),
  },
  ar: {
    'circle': require('@/assets/shapes/ar/circle.mp3'),
    'square': require('@/assets/shapes/ar/square.mp3'),
    'triangle': require('@/assets/shapes/ar/triangle.mp3'),
    'rectangle': require('@/assets/shapes/ar/rectangle.mp3'),
    'star': require('@/assets/shapes/ar/star.mp3'),
    'oval': require('@/assets/shapes/ar/oval.mp3'),
    'diamond': require('@/assets/shapes/ar/diamond.mp3'),
    'heart': require('@/assets/shapes/ar/heart.mp3'),
    'hexagon': require('@/assets/shapes/ar/hexagon.mp3'),
    'pentagon': require('@/assets/shapes/ar/pentagon.mp3'),
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
 * Get the audio file for a color item based on language
 * @param itemId - The item ID (e.g., 'red', 'blue', 'purple')
 * @param language - The current language ('en', 'fr', 'ar')
 * @returns The require() result (number) for the audio file, or undefined if not found
 */
export const getColorAudio = (itemId: string, language: Language = 'en'): number | undefined => {
  return colorAudios[language]?.[itemId];
};

/**
 * Get the audio file for a shape item based on language
 * @param itemId - The item ID (e.g., 'circle', 'square', 'triangle')
 * @param language - The current language ('en', 'fr', 'ar')
 * @returns The require() result (number) for the audio file, or undefined if not found
 */
export const getShapeAudio = (itemId: string, language: Language = 'en'): number | undefined => {
  return shapeAudios[language]?.[itemId];
};

/**
 * Get audio file for any learning item based on category and language
 * @param itemId - The item ID
 * @param category - The category (e.g., 'numbers', 'animals', 'colors')
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
  if (category === 'colors') {
    return getColorAudio(itemId, language);
  }
  if (category === 'shapes') {
    return getShapeAudio(itemId, language);
  }
  // Add other categories here as needed
  return undefined;
};

