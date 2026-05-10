import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks/useTheme';
import { Button } from '../../../src/components/common/Button';
import { Input } from '../../../src/components/common/Input';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { ManjeCharacter } from '../../../src/components/character/ManjeCharacter';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleReset = () => {
    setError('');
    
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
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
        <ScreenHeader 
          title="" 
          showBack 
          onBackPress={() => router.back()}
          transparent
        />
        
        <View style={styles.successContent}>
          <ManjeCharacter mood="happy" size="lg" animated showIdleFloat />
          
          <Text style={[
            typography.display.medium,
            { color: colors.text.primary, textAlign: 'center', marginTop: spacing.xl, marginBottom: spacing.sm }
          ]}>
            Check your email
          </Text>
          
          <Text style={[
            typography.body.large,
            { color: colors.text.secondary, textAlign: 'center', marginBottom: spacing['3xl'] }
          ]}>
            We've sent password reset instructions to {email}
          </Text>
          
          <Button
            title="Back to Sign In"
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
        showBack 
        onBackPress={() => router.back()}
        transparent
      />
      
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { padding: spacing.xl }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ManjeCharacter mood="concern" size="md" animated />
          
          <Text style={[
            typography.display.medium,
            { color: colors.text.primary, marginTop: spacing.xl, marginBottom: spacing.sm }
          ]}>
            Forgot Password?
          </Text>
          
          <Text style={[
            typography.body.large,
            { color: colors.text.secondary }
          ]}>
            Don't worry! It happens. Please enter the email address associated with your account.
          </Text>
        </View>

        <View style={[styles.form, { marginTop: spacing['2xl'], marginBottom: spacing['3xl'] }]}>
          <Input
            label="Email Address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
            leftIcon={<Mail size={20} color={colors.text.muted} />}
          />
        </View>

        <Button
          title="Send Reset Link"
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
