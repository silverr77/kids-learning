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

// Google Official Test Ad Unit IDs (safe for local development)
export const AD_UNIT_IDS = {
  // Production IDs provided by the user
  BANNER_ANDROID: 'ca-app-pub-3002057065219882~5172338492',
  BANNER_IOS: 'ca-app-pub-3002057065219882~5172338492',
  
  INTERSTITIAL_ANDROID: 'ca-app-pub-3002057065219882~5172338492',
  INTERSTITIAL_IOS: 'ca-app-pub-3002057065219882~5172338492',
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

// Test App IDs (for app.json configuration)
// These are Google's official test App IDs for development
export const TEST_APP_IDS = {
  ANDROID: 'ca-app-pub-3002057065219882~5172338492',
  IOS: 'ca-app-pub-3002057065219882~5172338492',
};
