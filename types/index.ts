export type Category = 'animals' | 'letters' | 'numbers' | 'colors' | 'shapes';

export interface Level {
  id: string;
  category: Category;
  levelNumber: number;
  title: string;
  items: LearningItem[];
  requiredStars: number;
  unlocked: boolean;
}

export interface LearningItem {
  id: string;
  name: string;
  image?: string;
  sound?: string | number; // string for URI, number for require() local assets
  pronunciation?: string;
  data?: any; // For letters (uppercase, lowercase), numbers (count), etc.
}

export interface UserProgress {
  completedLevels: string[];
  stars: number;
  badges: string[];
  levelStars: Record<string, number>; // Store stars earned per level (levelId -> stars)
  currentLevel?: string; // Current level ID being played
  currentLevelIndex?: number; // Current index in the level
  categoryProgress: {
    [key in Category]: {
      completed: number;
      total: number;
      stars: number;
    };
  };
}

export interface ChallengeQuestion {
  id: string;
  type: 'multiple-choice' | 'tap' | 'count' | 'match';
  question: string;
  correctAnswer: string | number;
  options?: string[];
  audio?: string | number; // string for pronunciation, number for audio file
}

