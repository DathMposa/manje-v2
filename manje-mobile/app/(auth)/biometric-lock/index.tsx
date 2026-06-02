/**
 * Biometric Lock Screen
 * Shown on launch when the user has previously signed in on this device.
 * Authenticates locally without needing a network connection.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../src/hooks/useTheme';
import { Button } from '../../../src/components/common/Button';
import { ManjeCharacter } from '../../../src/components/character/ManjeCharacter';
import { useAuthStore } from '../../../src/stores/authStore';

export default function BiometricLockScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const { biometricAuthState, authenticateBiometric, signOut } = useAuthStore();

  // Trigger biometric prompt automatically on mount
  useEffect(() => {
    if (biometricAuthState === 'required') {
      void authenticateBiometric();
    }
  }, []);

  // Navigate to main app after successful authentication
  useEffect(() => {
    if (biometricAuthState === 'authenticated') {
      router.replace('/(tabs)');
    }
  }, [biometricAuthState, router]);

  const handleUnlock = () => {
    void authenticateBiometric();
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/welcome');
  };

  const isLockedOut = biometricAuthState === 'locked_out';
  const isAuthenticating = biometricAuthState === 'authenticating';
  const hasFailed = biometricAuthState === 'failed';

  const statusText = isLockedOut
    ? 'Too many failed attempts. Please sign out and sign in again.'
    : hasFailed
    ? 'Authentication failed. Tap Unlock to try again.'
    : isAuthenticating
    ? 'Verifying...'
    : 'Tap Unlock or use your fingerprint to continue.';

  return (
    <View style={[styles.container, { backgroundColor: colors.background.base }]}>
      <View style={styles.content}>
        <ManjeCharacter
          mood={isLockedOut || hasFailed ? 'concern' : 'wave'}
          size="lg"
          animated
          showIdleFloat
        />

        <Text
          style={[
            typography.display.medium,
            { color: colors.text.primary, textAlign: 'center', marginTop: spacing.xl, marginBottom: spacing.sm },
          ]}
        >
          {isLockedOut ? 'Account Locked' : 'Welcome Back'}
        </Text>

        <Text
          style={[
            typography.body.medium,
            { color: colors.text.secondary, textAlign: 'center', marginBottom: spacing['3xl'], paddingHorizontal: spacing.xl },
          ]}
        >
          {statusText}
        </Text>

        {!isLockedOut && (
          <Button
            title={isAuthenticating ? 'Verifying...' : 'Unlock'}
            onPress={handleUnlock}
            fullWidth
            size="lg"
            variant="primary"
            disabled={isAuthenticating}
          />
        )}

        <View style={{ marginTop: spacing.lg }}>
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            fullWidth
            size="md"
            variant="ghost"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
