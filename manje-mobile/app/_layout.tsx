/**
 * Root Layout
 * Sets up providers, fonts, and navigation structure.
 */

import * as Sentry from '@sentry/react-native';
import { PostHogProvider } from 'posthog-react-native';
import NetInfo from '@react-native-community/netinfo';
import { posthog } from '../src/lib/analytics';
import { runSync } from '../src/lib/syncEngine';
import { supabase } from '../src/lib/supabase';
import { useEffect, useState } from 'react';

Sentry.init({
  dsn: process.env.SENTRY_DSN ?? '',
  enabled: Boolean(process.env.SENTRY_DSN),
  tracesSampleRate: 0.2,
});
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { useFonts, Syne_400Regular, Syne_600SemiBold, Syne_700Bold, Syne_800ExtraBold } from '@expo-google-fonts/syne';
import { WorkSans_400Regular, WorkSans_500Medium, WorkSans_600SemiBold, WorkSans_700Bold } from '@expo-google-fonts/work-sans';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '../src/hooks/useTheme';
import { ToastProvider } from '../src/hooks/useToast';
import { ErrorBoundary } from '../src/components/common/ErrorBoundary';
import { useAuthStore } from '../src/stores/authStore';
import {
  useBillStore,
  useBudgetStore,
  useContentStore,
  useGoalStore,
  useNotificationStore,
  useSettingsStore,
  useTransactionStore,
} from '../src/stores';
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
  const { user, isAuthenticated, isOnboarded, isLoading, initializeAuth, localAuthUserId, biometricAuthState } = useAuthStore();
  const initializeTransactions = useTransactionStore((state) => state.initializeForUser);
  const initializeBudgets = useBudgetStore((state) => state.initializeForUser);
  const initializeGoals = useGoalStore((state) => state.initializeForUser);
  const initializeBills = useBillStore((state) => state.initializeForUser);
  const initializeNotifications = useNotificationStore((state) => state.initializeForUser);
  const initializeSettings = useSettingsStore((state) => state.initializeForUser);
  const initializeContent = useContentStore((state) => state.initializeContent);
  const transactions = useTransactionStore((state) => state.transactions);
  const recalculateSpending = useBudgetStore((state) => state.recalculateSpending);
  const segments = useSegments();
  const router = useRouter();
  
  useEffect(() => {
    let unsubscribe: undefined | (() => void);

    void initializeAuth().then((cleanup) => {
      unsubscribe = cleanup;
    });

    return () => {
      unsubscribe?.();
    };
  }, [initializeAuth]);

  useEffect(() => {
    initializeContent();
  }, [initializeContent]);

  // Auto-sync when network becomes available
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && user?.id) {
        void runSync(user.id);
      }
    });
    return () => unsubscribe();
  }, [user?.id]);

  // Handle PASSWORD_RECOVERY deep link — route to reset-password screen
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        router.push('/(auth)/reset-password');
      }
    });
    return () => listener.subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    initializeTransactions(user.id);
    initializeBudgets(user.id);
    initializeGoals(user.id);
    initializeBills(user.id);
    initializeNotifications(user.id);
    initializeSettings(user.id);
  }, [
    initializeBills,
    initializeBudgets,
    initializeGoals,
    initializeNotifications,
    initializeSettings,
    initializeTransactions,
    user?.id,
  ]);

  useEffect(() => {
    recalculateSpending(transactions);
  }, [recalculateSpending, transactions]);
  
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const segs = segments as string[];
    const inBiometricLock = segs[0] === '(auth)' && segs[1] === 'biometric-lock';

    // If the user has a previous local session and biometric is required, show lock screen
    if (
      localAuthUserId &&
      (biometricAuthState === 'required' || biometricAuthState === 'authenticating' || biometricAuthState === 'failed' || biometricAuthState === 'locked_out') &&
      !inBiometricLock
    ) {
      router.replace('/(auth)/biometric-lock');
      return;
    }

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
  }, [isAuthenticated, isOnboarded, isLoading, localAuthUserId, biometricAuthState, router, segments]);
  
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.bg.base }]}>
        <ActivityIndicator size="large" color={colors.primary.default} />
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

function RootLayout() {
  const [fontsLoaded] = useFonts({
    Syne_400Regular,
    Syne_600SemiBold,
    Syne_700Bold,
    Syne_800ExtraBold,
    WorkSans_400Regular,
    WorkSans_500Medium,
    WorkSans_600SemiBold,
    WorkSans_700Bold,
  });
  
  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);
  
  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <GestureHandlerRootView style={styles.container}>
      <ErrorBoundary>
        <PostHogProvider client={posthog ?? undefined} autocapture>
          <ThemeProvider>
            <ToastProvider>
              <RootLayoutNav />
            </ToastProvider>
          </ThemeProvider>
        </PostHogProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(RootLayout);

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
