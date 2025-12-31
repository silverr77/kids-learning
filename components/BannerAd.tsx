import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { getBannerAdUnitId } from '@/utils/adConfig';

// Try to import the ad library, but handle gracefully if not available
let MobileAds: any = null;
let BannerAd: any = null;
let isAdLibraryAvailable = false;

try {
  const googleMobileAds = require('react-native-google-mobile-ads');
  // Check if the native module is actually available
  if (googleMobileAds && googleMobileAds.MobileAds && googleMobileAds.BannerAd) {
    MobileAds = googleMobileAds.MobileAds;
    BannerAd = googleMobileAds.BannerAd;
    isAdLibraryAvailable = true;
  }
} catch (error) {
  // Library not available (e.g., in Expo Go or native module not linked)
  console.log('AdMob library not available - ads will be disabled');
  isAdLibraryAvailable = false;
}

interface BannerAdComponentProps {
  style?: any;
  size?: 'BANNER' | 'LARGE_BANNER' | 'MEDIUM_RECTANGLE' | 'FULL_BANNER' | 'LEADERBOARD' | 'SMART_BANNER';
}

export default function BannerAdComponent({ 
  style, 
  size = 'BANNER' 
}: BannerAdComponentProps) {
  const [adUnitId, setAdUnitId] = useState<string | null>(null);
  const [isAdAvailable, setIsAdAvailable] = useState(false);

  useEffect(() => {
    // Only initialize if the library is actually available
    if (!isAdLibraryAvailable || !MobileAds) {
      return;
    }

    try {
      // Initialize Mobile Ads SDK
      MobileAds()
        .initialize()
        .then((adapterStatuses: any) => {
          console.log('AdMob initialized', adapterStatuses);
          setAdUnitId(getBannerAdUnitId());
          setIsAdAvailable(true);
        })
        .catch((error: any) => {
          console.log('AdMob initialization error:', error);
          setIsAdAvailable(false);
        });
    } catch (error) {
      // Handle any errors during initialization
      console.log('AdMob setup error:', error);
      setIsAdAvailable(false);
    }
  }, []);

  // If ad library is not available, don't render anything
  if (!isAdLibraryAvailable || !BannerAd || !isAdAvailable || !adUnitId) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={adUnitId}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true, // COPPA compliance - non-personalized ads only
        }}
        onAdLoaded={() => {
          console.log('Banner ad loaded');
        }}
        onAdFailedToLoad={(error: any) => {
          console.log('Banner ad failed to load:', error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});

