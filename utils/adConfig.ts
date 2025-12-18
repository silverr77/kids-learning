/**
 * AdMob Configuration
 * 
 * ⚠️ IMPORTANT: These are Google's official TEST ad unit IDs.
 * They are safe to use for local development and testing.
 * 
 * These test IDs will show test ads that don't generate revenue.
 * Always use these test IDs during development to avoid invalid traffic.
 * 
 * To get your REAL ad unit IDs for production:
 * 1. Go to https://apps.admob.com
 * 2. Create an app (if you haven't already)
 * 3. Create ad units for Banner and Interstitial
 * 4. Replace the IDs below with your real IDs
 * 
 * 📚 Google Test Ad Unit IDs Documentation:
 * https://developers.google.com/admob/android/test-ads
 * https://developers.google.com/admob/ios/test-ads
 */

// Google Official Test Ad Unit IDs (safe for local development and testing)
// NOTE: Replace these with your REAL ad unit IDs from AdMob for production
// Ad Unit IDs have a SLASH (/), App IDs have a TILDE (~)
export const AD_UNIT_IDS = {
  // Google's official test ad unit IDs
  BANNER_ANDROID: 'ca-app-pub-3940256099942544/6300978111',
  BANNER_IOS: 'ca-app-pub-3940256099942544/2934735716',
  
  INTERSTITIAL_ANDROID: 'ca-app-pub-3940256099942544/1033173712',
  INTERSTITIAL_IOS: 'ca-app-pub-3940256099942544/4411468910',
};

// Platform-specific ad unit IDs
import { Platform } from 'react-native';

export const getBannerAdUnitId = () => {
  // Returns the appropriate test ID based on platform
  return Platform.OS === 'ios' ? AD_UNIT_IDS.BANNER_IOS : AD_UNIT_IDS.BANNER_ANDROID;
};

export const getInterstitialAdUnitId = () => {
  // Returns the appropriate test ID based on platform
  return Platform.OS === 'ios' ? AD_UNIT_IDS.INTERSTITIAL_IOS : AD_UNIT_IDS.INTERSTITIAL_ANDROID;
};

// Ad display frequency settings
export const AD_SETTINGS = {
  // Show interstitial ad after every N level completions
  INTERSTITIAL_FREQUENCY: 2, // Show ad every 2 level completions
  
  // Minimum time between interstitial ads (in milliseconds)
  MIN_TIME_BETWEEN_ADS: 60000, // 1 minute
};

// Your App IDs (for app.json configuration)
// App IDs have a TILDE (~) - these go in app.json plugins config
export const APP_IDS = {
  ANDROID: 'ca-app-pub-3002057065219882~5172338492',
  IOS: 'ca-app-pub-3002057065219882~5172338492',
};

// TODO: Create real ad units in your AdMob console:
// 1. Go to https://apps.admob.com
// 2. Select your app (or create one with the App IDs above)
// 3. Create Banner and Interstitial ad units
// 4. Replace AD_UNIT_IDS above with the real ad unit IDs (they have a SLASH /)
