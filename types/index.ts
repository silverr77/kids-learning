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
  sound?: string;
  pronunciation?: string;
  data?: any; // For letters (uppercase, lowercase), numbers (count), etc.
}

export interface UserProgress {
  completedLevels: string[];
  stars: number;
  badges: string[];
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
  audio?: string;
}

