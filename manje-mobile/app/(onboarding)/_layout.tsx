/**
 * Onboarding Layout
 * Stack navigator for onboarding screens.
 */

import { Stack } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';

export default function OnboardingLayout() {
  const { colors } = useTheme();
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg.base },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="country" />
      <Stack.Screen name="currency" />
      <Stack.Screen name="income" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
