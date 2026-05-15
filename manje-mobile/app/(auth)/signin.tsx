/**
 * AUTH-03: Sign In Screen
 * Phone-first authentication with email/password and Google options.
 */

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../src/hooks/useTheme';
import { Button, Input, ScreenHeader, ClayCard, CountryCodePicker, defaultCountryCode, type CountryCode } from '../../src/components/common';
import { ManjeCharacter } from '../../src/components/character';
import { useAuthStore } from '../../src/stores/authStore';
import { typeScale } from '../../src/theme/typography';
import { spacing, layout } from '../../src/theme/spacing';

export default function SignInScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { signInWithEmail, signInWithGoogle, sendPhoneOtp } = useAuthStore();
  
  const [authMode, setAuthMode] = useState<'phone' | 'email'>('phone');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(defaultCountryCode);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (authMode === 'phone') {
      if (!phone.trim()) {
        newErrors.phone = 'Please enter your phone number';
      } else if (!/^\d{7,10}$/.test(phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number (7-10 digits)';
      }
    } else {
      if (!email.trim()) {
        newErrors.email = 'Please enter your email';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Please enter a valid email';
      }
      
      if (!password) {
        newErrors.password = 'Please enter your password';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      // Combine country code with phone number
      const fullPhoneNumber = `${selectedCountry.dialCode}${phone.trim()}`;
      await sendPhoneOtp(fullPhoneNumber);
      router.push({
        pathname: '/(auth)/verify-otp',
        params: { phone: fullPhoneNumber }
      });
    } catch (error) {
      console.error('Send OTP error:', error);
      setErrors({ general: error instanceof Error ? error.message : 'Failed to send verification code.' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignIn = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});
    
    try {
      const result = await signInWithEmail(email.trim(), password);
      router.replace(result.isOnboarded ? '/(tabs)' : '/(onboarding)/country');
    } catch (error) {
      console.error('Sign in error:', error);
      setErrors({ general: error instanceof Error ? error.message : 'Invalid credentials. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrors({});

    try {
      const result = await signInWithGoogle();

      if ('cancelled' in result) {
        return;
      }

      router.replace(result.isOnboarded ? '/(tabs)' : '/(onboarding)/country');
    } catch (error) {
      console.error('Google sign in error:', error);
      setErrors({
        general: error instanceof Error ? error.message : 'Google sign-in failed. Please try again.',
      });
    } finally {
      setGoogleLoading(false);
    }
  };
  
  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
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
              <ClayCard variant="subtle" style={{ ...styles.errorCard, backgroundColor: colors.status.danger.bg }}>
                <Text style={[typeScale.bodySmall, { color: colors.status.danger.text }]}>
                  {errors.general}
                </Text>
              </ClayCard>
            )}
            
            {authMode === 'phone' ? (
              <View>
                <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>
                  Phone Number
                </Text>
                <View style={styles.phoneInputContainer}>
                  <CountryCodePicker
                    selectedCountry={selectedCountry}
                    onSelect={setSelectedCountry}
                    colors={colors}
                  />
                  <View style={[styles.phoneInputWrapper, { borderColor: errors.phone ? colors.status?.danger?.base || '#ef4444' : colors.border.light }]}>
                    <Feather name="phone" size={20} color={colors.text.secondary} style={styles.phoneIcon} />
                    <TextInput
                      style={[styles.phoneInput, { color: colors.text.primary }]}
                      value={phone}
                      onChangeText={(text: string) => {
                        // Only allow digits
                        const digitsOnly = text.replace(/\D/g, '');
                        setPhone(digitsOnly);
                      }}
                      keyboardType="phone-pad"
                      placeholder="999123456"
                      placeholderTextColor={colors.text.secondary}
                      maxLength={12}
                    />
                  </View>
                </View>
                {errors.phone && (
                  <Text style={[styles.errorText, { color: colors.status?.danger?.text || '#ef4444' }]}>
                    {errors.phone}
                  </Text>
                )}
              </View>
            ) : (
              <>
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
              </>
            )}
          </Animated.View>
          
          {/* Actions */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.actions}>
            {authMode === 'phone' ? (
              <Button
                title="Send Code"
                onPress={handleSendOtp}
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                disabled={googleLoading}
              />
            ) : (
              <Button
                title="Sign In"
                onPress={handleSignIn}
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                disabled={googleLoading}
              />
            )}
            
            <Button
              title={authMode === 'phone' ? "Continue with Email" : "Continue with Phone"}
              onPress={() => {
                setAuthMode(authMode === 'phone' ? 'email' : 'phone');
                setErrors({});
              }}
              variant="ghost"
              size="lg"
              fullWidth
              style={{ marginTop: spacing[2] }}
              textStyle={{ color: colors.text.secondary }}
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
              loading={googleLoading}
              disabled={loading}
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
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    marginTop: 12,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  phoneIcon: {
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 2,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
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
