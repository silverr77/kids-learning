import { Level, Category } from '@/types';

export const levels: Level[] = [
  // Animals - Level 1
  {
    id: 'animals-1',
    category: 'animals',
    levelNumber: 1,
    title: 'Farm Animals',
    requiredStars: 0,
    unlocked: true,
    items: [
      { id: 'cow', name: 'Cow', pronunciation: 'cow' },
      { id: 'chicken', name: 'Chicken', pronunciation: 'chicken' },
      { id: 'sheep', name: 'Sheep', pronunciation: 'sheep' },
      { id: 'horse', name: 'Horse', pronunciation: 'horse' },
      { id: 'duck', name: 'Duck', pronunciation: 'duck' },
      { id: 'goat', name: 'Goat', pronunciation: 'goat' },
      { id: 'rabbit', name: 'Rabbit', pronunciation: 'rabbit' },
      { id: 'donkey', name: 'Donkey', pronunciation: 'donkey' },
      { id: 'rooster', name: 'Rooster', pronunciation: 'rooster' },
    ],
  },
  // Animals - Level 2
  {
    id: 'animals-2',
    category: 'animals',
    levelNumber: 2,
    title: 'Wild Animals',
    requiredStars: 3,
    unlocked: false,
    items: [
      { id: 'lion', name: 'Lion', pronunciation: 'lion' },
      { id: 'elephant', name: 'Elephant', pronunciation: 'elephant' },
      { id: 'tiger', name: 'Tiger', pronunciation: 'tiger' },
      { id: 'bear', name: 'Bear', pronunciation: 'bear' },
      { id: 'monkey', name: 'Monkey', pronunciation: 'monkey' },
      { id: 'giraffe', name: 'Giraffe', pronunciation: 'giraffe' },
      { id: 'zebra', name: 'Zebra', pronunciation: 'zebra' },
      { id: 'wolf', name: 'Wolf', pronunciation: 'wolf' },
      { id: 'fox', name: 'Fox', pronunciation: 'fox' },
      { id: 'panda', name: 'Panda', pronunciation: 'panda' },
    ],
  },
  // Letters - Level 1
  {
    id: 'letters-1',
    category: 'letters',
    levelNumber: 1,
    title: 'Letters A-E',
    requiredStars: 0,
    unlocked: true,
    items: [
      { id: 'a', name: 'A', pronunciation: 'ay', data: { uppercase: 'A', lowercase: 'a' } },
      { id: 'b', name: 'B', pronunciation: 'bee', data: { uppercase: 'B', lowercase: 'b' } },
      { id: 'c', name: 'C', pronunciation: 'see', data: { uppercase: 'C', lowercase: 'c' } },
      { id: 'd', name: 'D', pronunciation: 'dee', data: { uppercase: 'D', lowercase: 'd' } },
      { id: 'e', name: 'E', pronunciation: 'ee', data: { uppercase: 'E', lowercase: 'e' } },
    ],
  },
  // Numbers - Level 1
  {
    id: 'numbers-1',
    category: 'numbers',
    levelNumber: 1,
    title: 'Numbers 1-5',
    requiredStars: 0,
    unlocked: true,
    items: [
      { 
        id: '1', 
        name: 'One', 
        pronunciation: 'one', 
        sound: require('@/assets/numbers/en/1.mp3'),
        data: { number: 1, count: 1 } 
      },
      { 
        id: '2', 
        name: 'Two', 
        pronunciation: 'two', 
        sound: require('@/assets/numbers/en/2.mp3'),
        data: { number: 2, count: 2 } 
      },
      { 
        id: '3', 
        name: 'Three', 
        pronunciation: 'three', 
        sound: require('@/assets/numbers/en/3.mp3'),
        data: { number: 3, count: 3 } 
      },
      { 
        id: '4', 
        name: 'Four', 
        pronunciation: 'four', 
        sound: require('@/assets/numbers/en/4.mp3'),
        data: { number: 4, count: 4 } 
      },
      { 
        id: '5', 
        name: 'Five', 
        pronunciation: 'five', 
        sound: require('@/assets/numbers/en/5.mp3'),
        data: { number: 5, count: 5 } 
      },
    ],
  },
  // Colors - Level 1
  {
    id: 'colors-1',
    category: 'colors',
    levelNumber: 1,
    title: 'Basic Colors',
    requiredStars: 0,
    unlocked: true,
    items: [
      { id: 'red', name: 'Red', pronunciation: 'red', data: { color: '#FF0000' } },
      { id: 'blue', name: 'Blue', pronunciation: 'blue', data: { color: '#0000FF' } },
      { id: 'yellow', name: 'Yellow', pronunciation: 'yellow', data: { color: '#FFFF00' } },
      { id: 'green', name: 'Green', pronunciation: 'green', data: { color: '#00FF00' } },
      { id: 'orange', name: 'Orange', pronunciation: 'orange', data: { color: '#FFA500' } },
    ],
  },
  // Colors - Level 2
  {
    id: 'colors-2',
    category: 'colors',
    levelNumber: 2,
    title: 'More Colors',
    requiredStars: 3,
    unlocked: false,
    items: [
      { id: 'purple', name: 'Purple', pronunciation: 'purple', data: { color: '#800080' } },
      { id: 'pink', name: 'Pink', pronunciation: 'pink', data: { color: '#FFC0CB' } },
      { id: 'brown', name: 'Brown', pronunciation: 'brown', data: { color: '#A52A2A' } },
      { id: 'black', name: 'Black', pronunciation: 'black', data: { color: '#000000' } },
      { id: 'white', name: 'White', pronunciation: 'white', data: { color: '#FFFFFF' } },
      { id: 'gray', name: 'Gray', pronunciation: 'gray', data: { color: '#808080' } },
    ],
  },
  // Shapes - Level 1
  {
    id: 'shapes-1',
    category: 'shapes',
    levelNumber: 1,
    title: 'Basic Shapes',
    requiredStars: 0,
    unlocked: true,
    items: [
      { id: 'circle', name: 'Circle', pronunciation: 'circle', data: { shape: 'circle' } },
      { id: 'square', name: 'Square', pronunciation: 'square', data: { shape: 'square' } },
      { id: 'triangle', name: 'Triangle', pronunciation: 'triangle', data: { shape: 'triangle' } },
      { id: 'rectangle', name: 'Rectangle', pronunciation: 'rectangle', data: { shape: 'rectangle' } },
      { id: 'star', name: 'Star', pronunciation: 'star', data: { shape: 'star' } },
    ],
  },
];

export const getLevelsByCategory = (category: Category): Level[] => {
  return levels.filter(level => level.category === category);
};

export const getLevelById = (id: string): Level | undefined => {
  return levels.find(level => level.id === id);
};

