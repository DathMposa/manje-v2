/**
 * Root Layout
 * Sets up providers, fonts, and navigation structure.
 */

import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '../src/hooks/useTheme';
import { useAuthStore } from '../src/stores/authStore';
import { green } from '../src/theme/colors';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

// Font loading - using system fonts as fallback until custom fonts are added
const loadFonts = async () => {
  // For now, we'll use system fonts
  // When you add font files to assets/fonts/, uncomment this:
  // await Font.loadAsync({
  //   'Syne': require('../assets/fonts/Syne-Regular.ttf'),
  //   'Syne-Bold': require('../assets/fonts/Syne-Bold.ttf'),
  //   'Syne-SemiBold': require('../assets/fonts/Syne-SemiBold.ttf'),
  //   'WorkSans': require('../assets/fonts/WorkSans-Regular.ttf'),
  //   'WorkSans-Medium': require('../assets/fonts/WorkSans-Medium.ttf'),
  //   'WorkSans-SemiBold': require('../assets/fonts/WorkSans-SemiBold.ttf'),
  //   'WorkSans-Bold': require('../assets/fonts/WorkSans-Bold.ttf'),
  // });
  return true;
};

function RootLayoutNav() {
  const { colors, isDark } = useTheme();
  const { isAuthenticated, isOnboarded, isLoading, checkAuthState } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  
  useEffect(() => {
    checkAuthState();
  }, []);
  
  useEffect(() => {
    if (isLoading) return;
    
    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    
    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to auth if not authenticated
      router.replace('/(auth)/welcome');
    } else if (isAuthenticated && !isOnboarded && !inOnboardingGroup) {
      // Redirect to onboarding if authenticated but not onboarded
      router.replace('/(onboarding)/country');
    } else if (isAuthenticated && isOnboarded && (inAuthGroup || inOnboardingGroup)) {
      // Redirect to main app if authenticated and onboarded
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isOnboarded, isLoading, segments]);
  
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.bg.base }]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }
  
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg.base },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  
  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
        setFontsLoaded(true);
      } catch (e) {
        console.warn('Error loading fonts:', e);
        setFontsLoaded(true); // Continue anyway with system fonts
      } finally {
        await SplashScreen.hideAsync();
      }
    }
    
    prepare();
  }, []);
  
  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
