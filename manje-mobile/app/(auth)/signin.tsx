/**
 * AUTH-03: Sign In Screen
 * Email/password login with Google Sign-In option.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../../src/hooks/useTheme';
import { Button, Input, ScreenHeader, ClayCard } from '../../src/components/common';
import { ManjeCharacter } from '../../src/components/character';
import { useAuthStore } from '../../src/stores/authStore';
import { typeScale } from '../../src/theme/typography';
import { spacing, layout } from '../../src/theme/spacing';

export default function SignInScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { setUser, setOnboarded } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Please enter your password';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSignIn = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Simulate API call - replace with Firebase Auth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store mock auth token
      await SecureStore.setItemAsync('manje_auth_token', 'mock_token_' + Date.now());
      
      // Set user in store (simulating existing user who completed onboarding)
      setUser({
        id: 'user_' + Date.now(),
        email: email,
        displayName: email.split('@')[0],
      });
      
      // Mark as onboarded (existing user)
      await setOnboarded(true);
      
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Sign in error:', error);
      setErrors({ general: 'Invalid email or password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    // TODO: Implement Google Sign-In
    console.log('Google Sign In');
  };
  
  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password screen
    console.log('Forgot Password');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg.base }]} edges={['top']}>
      <ScreenHeader title="Welcome Back" />
      
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
            <ManjeCharacter mood="wave" size="lg" />
            <Text style={[styles.welcomeText, typeScale.headlineMedium, { color: colors.text.primary }]}>
              Good to see you again!
            </Text>
            <Text style={[styles.subtitleText, typeScale.bodyMedium, { color: colors.text.secondary }]}>
              Let's check on your finances
            </Text>
          </Animated.View>
          
          {/* Form */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            {/* General Error */}
            {!!errors.general && (
              <ClayCard variant="subtle" style={{ ...styles.errorCard, backgroundColor: colors.status.dangerBg }}>
                <Text style={[typeScale.bodySmall, { color: colors.status.danger }]}>
                  {errors.general}
                </Text>
              </ClayCard>
            )}
            
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
              autoComplete="password"
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
            
            {/* Forgot Password */}
            <Pressable onPress={handleForgotPassword} style={styles.forgotPassword}>
              <Text style={[typeScale.labelMedium, { color: colors.primary.default }]}>
                Forgot Password?
              </Text>
            </Pressable>
          </Animated.View>
          
          {/* Actions */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.actions}>
            <Button
              title="Sign In"
              onPress={handleSignIn}
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            />
            
            {/* Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border.light }]} />
              <Text style={[styles.dividerText, typeScale.labelSmall, { color: colors.text.secondary }]}>
                or
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border.light }]} />
            </View>
            
            {/* Google Sign In */}
            <Button
              title="Continue with Google"
              onPress={handleGoogleSignIn}
              variant="secondary"
              size="lg"
              fullWidth
              icon={<Feather name="chrome" size={20} color={colors.text.primary} />}
            />
          </Animated.View>
          
          {/* Sign Up Link */}
          <View style={styles.signUpLink}>
            <Text style={[typeScale.bodyMedium, { color: colors.text.secondary }]}>
              Don't have an account?{' '}
            </Text>
            <Pressable onPress={() => router.push('/(auth)/signup')}>
              <Text style={[typeScale.labelLarge, { color: colors.primary.default }]}>
                Sign Up
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
    marginVertical: spacing[8],
  },
  welcomeText: {
    marginTop: spacing[4],
  },
  subtitleText: {
    marginTop: spacing[1],
  },
  errorCard: {
    marginBottom: spacing[4],
    padding: spacing[3],
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -spacing[2],
    marginBottom: spacing[2],
  },
  actions: {
    marginTop: spacing[4],
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
  signUpLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing[6],
  },
});
