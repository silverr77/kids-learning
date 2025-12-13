# Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on device:**
   - Install Expo Go app on your phone
   - Scan the QR code from the terminal
   - Or press `i` for iOS / `a` for Android emulator

## Project Structure

```
learn-for-kids/
├── app/              # All screens (Expo Router)
├── components/       # Reusable UI components
├── data/            # Level configurations
├── types/           # TypeScript type definitions
├── utils/           # Helper functions
└── assets/          # Images, sounds, etc.
```

## Adding Assets

### Icons
- `assets/icon.png` - App icon (1024x1024)
- `assets/splash.png` - Splash screen (1242x2436)
- `assets/adaptive-icon.png` - Android adaptive icon (1024x1024)

### Audio Files
Place audio files in `assets/sounds/` and reference in level data:
```typescript
{ id: 'cow', name: 'Cow', sound: require('@/assets/sounds/cow.mp3') }
```

### Images
Place images in `assets/images/` for learning items.

## Customization

### Adding New Levels
Edit `data/levels.ts` and add new level objects.

### Modifying Categories
Update the categories array in `app/index.tsx`.

### Changing Colors
Modify the `categoryColors` object in `components/CategoryCard.tsx`.

## Troubleshooting

### Metro bundler issues
```bash
npx expo start --clear
```

### TypeScript errors
```bash
npx tsc --noEmit
```

### Reset cache
```bash
npm start -- --reset-cache
```

