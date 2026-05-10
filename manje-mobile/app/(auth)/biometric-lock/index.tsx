import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTheme } from '../../../src/hooks/useTheme';
import { Button } from '../../../src/components/common/Button';
import { ManjeCharacter } from '../../../src/components/character/ManjeCharacter';

export default function BiometricLockScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    
    if (hasHardware && isEnrolled) {
      setIsSupported(true);
      authenticate();
    } else {
      setError('Biometrics not available. Please use your PIN.');
    }
  };

  const authenticate = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Manje',
        fallbackLabel: 'Use PIN',
      });

      if (result.success) {
        // In a real app, this would update a global "isUnlocked" state
        router.back();
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (e) {
      setError('An error occurred during authentication.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.base }]}>
      <View style={styles.content}>
        <ManjeCharacter mood="wave" size="lg" animated showIdleFloat />
        
        <Text style={[
          typography.display.medium,
          { color: colors.text.primary, textAlign: 'center', marginTop: spacing.xl, marginBottom: spacing.sm }
        ]}>
          App Locked
        </Text>
        
        <Text style={[
          typography.body.large,
          { color: colors.text.secondary, textAlign: 'center', marginBottom: spacing['3xl'] }
        ]}>
          {error || 'Please authenticate to unlock Manje'}
        </Text>
        
        {isSupported && (
          <Button
            title="Unlock"
            onPress={authenticate}
            fullWidth
            size="lg"
            variant="primary"
          />
        )}
        
        <View style={{ marginTop: spacing.lg }}>
          <Button
            title="Sign Out"
            onPress={() => router.replace('/(auth)/signin')}
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
  }
});
