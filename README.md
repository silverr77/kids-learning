# Train you brains 🎓

A beautiful, educational mobile app (ages 3-7) built with React Native and Expo. Teach children about animals, letters, numbers, colors, and shapes through interactive games and challenges.

## Features

- 🎮 **Interactive Learning**: Swipeable cards, practice games, and challenges
- 🎯 **Level System**: Progressive learning with unlockable levels
- ⭐ **Rewards**: Star system and badges to motivate learning
- 🔊 **Audio Support**: Pronunciation and sound effects
- 📊 **Progress Tracking**: Local storage of progress and achievements
- 🎨 **Kid-Friendly UI**: Bright colors, large buttons, friendly animations
- 🔒 **Parent Controls**: Settings screen with parent gate
- 📱 **Offline-First**: No internet connection required

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **Expo Router** for navigation
- **Expo AV** for audio
- **AsyncStorage** for local data persistence
- **Lottie** for animations (ready to use)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator / `a` for Android emulator

## Project Structure

```
train-your-brain/
├── app/                    # Expo Router screens
│   ├── index.tsx          # Home screen
│   ├── level-overview.tsx # Level selection
│   ├── learning.tsx       # Learning cards
│   ├── practice.tsx       # Practice games
│   ├── challenge.tsx      # Final challenge
│   ├── reward.tsx         # Reward screen
│   ├── collection.tsx     # Badges & achievements
│   └── settings.tsx       # Parent settings
├── components/            # Reusable components
│   ├── Button.tsx
│   ├── CategoryCard.tsx
│   └── LevelCard.tsx
├── data/                  # Level configurations
│   └── levels.ts
├── types/                 # TypeScript types
│   └── index.ts
└── utils/                 # Utilities
    ├── storage.ts         # AsyncStorage helpers
    └── soundManager.ts   # Audio management
```

## Learning Categories

1. **🐶 Animals**: Farm animals, wild animals, sea animals
2. **🔤 Letters**: Alphabet learning with phonics
3. **🔢 Numbers**: Counting and number recognition
4. **🎨 Colors**: Color identification and matching
5. **🔺 Shapes**: Basic shape recognition

## Level Flow

1. **Home** → Select category
2. **Level Overview** → Choose level
3. **Learning** → Swipe through cards
4. **Practice** → Interactive mini-games
5. **Challenge** → Final test (5 questions)
6. **Reward** → Earn stars and badges

## Customization

### Adding New Levels

Edit `data/levels.ts` to add new levels:

```typescript
{
  id: 'animals-3',
  category: 'animals',
  levelNumber: 3,
  title: 'Sea Animals',
  requiredStars: 6,
  unlocked: false,
  items: [
    { id: 'fish', name: 'Fish', pronunciation: 'fish' },
    // ... more items
  ],
}
```

### Adding Audio Files

Place audio files in `assets/sounds/` and reference them in level items:

```typescript
{ id: 'cow', name: 'Cow', sound: require('@/assets/sounds/cow.mp3') }
```

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

Or use EAS Build:
```bash
eas build --platform ios
eas build --platform android
```

## Notes

- The app uses emoji representations for visual elements (can be replaced with images)
- Audio pronunciation uses text-to-speech (can be enhanced with actual audio files)
- Progress is stored locally using AsyncStorage
- All screens are designed to be kid-friendly with large touch targets

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!

