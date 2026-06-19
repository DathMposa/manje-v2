/**
 * AUTH-02: Sign Up Screen
 * Email/password registration with Google option.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../src/hooks/useTheme';
import { Button, Input, ScreenHeader, ClayCard } from '../../src/components/common';
import { ManjeCharacter } from '../../src/components/character';
import { useAuthStore } from '../../src/stores/authStore';
import { typeScale } from '../../src/theme/typography';
import { spacing, layout, radius } from '../../src/theme/spacing';

export default function SignUpScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { signUpWithEmail } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Please enter your name';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Please enter a password';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreeToTerms) {
      newErrors.terms = 'Please agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSignUp = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});
    
    try {
      const result = await signUpWithEmail(name.trim(), email.trim(), password);
      if ('confirmationPending' in result) {
        setConfirmationEmail(result.email);
      } else {
        router.replace('/(onboarding)/country');
      }
    } catch (error) {
      console.error('Email sign up error:', error);
      setErrors({ general: error instanceof Error ? error.message : 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  
  if (confirmationEmail) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg.base }]} edges={['top']}>
        <ScreenHeader title="Check Your Email" />
        <View style={styles.confirmationContainer}>
          <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.confirmationContent}>
            <ManjeCharacter mood="happy" size="md" />
            <Text style={[typeScale.headlineMedium, { color: colors.text.primary, marginTop: spacing[6], textAlign: 'center' }]}>
              Almost there!
            </Text>
            <Text style={[typeScale.bodyMedium, { color: colors.text.secondary, marginTop: spacing[3], textAlign: 'center' }]}>
              We sent a confirmation link to{' '}
              <Text style={{ color: colors.primary.default, fontWeight: '600' }}>{confirmationEmail}</Text>
              {'. Open it to activate your account, then sign in.'}
            </Text>
            <Button
              title="Go to Sign In"
              onPress={() => router.replace('/(auth)/signin')}
              variant="primary"
              size="lg"
              fullWidth
              style={{ marginTop: spacing[8] }}
            />
            <Button
              title="Use a Different Email"
              onPress={() => setConfirmationEmail(null)}
              variant="ghost"
              size="lg"
              fullWidth
              style={{ marginTop: spacing[3] }}
              textStyle={{ color: colors.text.secondary }}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg.base }]} edges={['top']}>
      <ScreenHeader title="Create Account" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Character */}
          <Animated.View 
            entering={FadeInDown.delay(100).duration(400)}
            style={styles.characterContainer}
          >
            <ManjeCharacter mood="happy" size="md" />
            <Text style={[styles.welcomeText, typeScale.bodyMedium, { color: colors.text.secondary }]}>
              Let's get you started!
            </Text>
          </Animated.View>
          
          {/* Form */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            {/* General Error */}
            {!!errors.general && (
              <ClayCard variant="subtle" style={{ ...styles.errorCard, backgroundColor: colors.status.danger.bg }}>
                <Text style={[typeScale.bodySmall, { color: colors.status.danger.text }]}>
                  {errors.general}
                </Text>
              </ClayCard>
            )}
            
            <Input
              label="Full Name"
              value={name}
              onChangeText={setName}
              error={errors.name}
              autoCapitalize="words"
              autoComplete="name"
              leftIcon={<Feather name="user" size={20} color={colors.text.secondary} />}
            />

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              leftIcon={<Feather name="mail" size={20} color={colors.text.secondary} />}
            />
            
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password-new"
              leftIcon={<Feather name="lock" size={20} color={colors.text.secondary} />}
              rightIcon={
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Feather 
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={20} 
                    color={colors.text.secondary} 
                  />
                </Pressable>
              }
            />
            
            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={errors.confirmPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password-new"
              leftIcon={<Feather name="lock" size={20} color={colors.text.secondary} />}
            />
            
            {/* Terms Checkbox */}
            <Pressable 
              style={styles.termsRow}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              <View style={[
                styles.checkbox,
                { 
                  borderColor: errors.terms ? colors.status.danger.base : colors.border.light,
                  backgroundColor: agreeToTerms ? colors.primary.default : 'transparent',
                }
              ]}>
                {!!agreeToTerms && (
                  <Feather name="check" size={14} color={colors.text.inverse} />
                )}
              </View>
              <Text style={[styles.termsText, typeScale.bodySmall, { color: colors.text.secondary }]}>
                I agree to the{' '}
                <Text style={{ color: colors.primary.default }}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={{ color: colors.primary.default }}>Privacy Policy</Text>
              </Text>
            </Pressable>
            {!!errors.terms && (
              <Text style={[styles.termsError, typeScale.bodySmall, { color: colors.status.danger.text }]}>
                {errors.terms}
              </Text>
            )}
          </Animated.View>
          
          {/* Actions */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.actions}>
            <Button
              title="Create Account"
              onPress={handleEmailSignUp}
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            />
          </Animated.View>
          
          {/* Sign In Link */}
          <View style={styles.signInLink}>
            <Text style={[typeScale.bodyMedium, { color: colors.text.secondary }]}>
              Already have an account?{' '}
            </Text>
            <Pressable onPress={() => router.push('/(auth)/signin')}>
              <Text style={[typeScale.labelLarge, { color: colors.primary.default }]}>
                Sign In
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: spacing[8],
  },
  characterContainer: {
    alignItems: 'center',
    marginVertical: spacing[6],
  },
  welcomeText: {
    marginTop: spacing[3],
  },
  errorCard: {
    marginBottom: spacing[4],
    padding: spacing[3],
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing[2],
    marginBottom: spacing[2],
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    lineHeight: 20,
  },
  termsError: {
    marginLeft: spacing[8],
    marginBottom: spacing[2],
  },
  actions: {
    marginTop: spacing[6],
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing[5],
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: spacing[4],
  },
  signInLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing[6],
  },
  confirmationContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: layout.screenPaddingH,
  },
  confirmationContent: {
    alignItems: 'center',
  },
});
