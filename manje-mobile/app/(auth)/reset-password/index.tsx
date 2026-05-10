import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks/useTheme';
import { Button } from '../../../src/components/common/Button';
import { Input } from '../../../src/components/common/Input';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { ManjeCharacter } from '../../../src/components/character/ManjeCharacter';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = () => {
    setError('');
    
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.base }]}>
        <View style={styles.successContent}>
          <ManjeCharacter mood="celebrate" size="lg" animated showIdleFloat />
          
          <Text style={[
            typography.display.medium,
            { color: colors.text.primary, textAlign: 'center', marginTop: spacing.xl, marginBottom: spacing.sm }
          ]}>
            Password Reset
          </Text>
          
          <Text style={[
            typography.body.large,
            { color: colors.text.secondary, textAlign: 'center', marginBottom: spacing['3xl'] }
          ]}>
            Your password has been successfully reset. You can now sign in with your new password.
          </Text>
          
          <Button
            title="Sign In"
            onPress={() => router.replace('/(auth)/signin')}
            fullWidth
            size="lg"
            variant="primary"
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: colors.background.base }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader 
        title="" 
        showBack={false}
        transparent
      />
      
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { padding: spacing.xl }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ManjeCharacter mood="happy" size="md" animated />
          
          <Text style={[
            typography.display.medium,
            { color: colors.text.primary, marginTop: spacing.xl, marginBottom: spacing.sm }
          ]}>
            Create New Password
          </Text>
          
          <Text style={[
            typography.body.large,
            { color: colors.text.secondary }
          ]}>
            Your new password must be different from previous used passwords.
          </Text>
        </View>

        <View style={[styles.form, { marginTop: spacing['2xl'], marginBottom: spacing['3xl'] }]}>
          <View style={{ marginBottom: spacing.lg }}>
            <Input
              label="New Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError('');
              }}
              secureTextEntry={!showPassword}
              error={error.includes('Password') ? error : undefined}
              leftIcon={<Lock size={20} color={colors.text.muted} />}
            />
          </View>

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setError('');
            }}
            secureTextEntry={!showPassword}
            error={error.includes('match') ? error : undefined}
            leftIcon={<Lock size={20} color={colors.text.muted} />}
          />
        </View>

        <Button
          title="Reset Password"
          onPress={handleReset}
          fullWidth
          size="lg"
          variant="primary"
          loading={isLoading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  successContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
