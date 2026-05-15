/**
 * AUTH-04: OTP Verification Screen
 * Verifies the 6-digit code sent via SMS.
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TextInput, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../src/hooks/useTheme';
import { Button, ScreenHeader, ClayCard } from '../../src/components/common';
import { ManjeCharacter } from '../../src/components/character';
import { useAuthStore } from '../../src/stores/authStore';
import { typeScale } from '../../src/theme/typography';
import { spacing, layout, radius } from '../../src/theme/spacing';

const OTP_LENGTH = 6;
const RESEND_TIMER = 30;
const OTP_EXPIRY_SECONDS = 300; // 5 minutes

export default function VerifyOtpScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { phone, name } = useLocalSearchParams<{ phone: string, name?: string }>();
  const { verifyPhoneOtp, sendPhoneOtp, updateProfile } = useAuthStore();
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(RESEND_TIMER);
  const [expiryTimer, setExpiryTimer] = useState(OTP_EXPIRY_SECONDS);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // OTP expiry countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (expiryTimer > 0 && !isExpired) {
      interval = setInterval(() => {
        setExpiryTimer((prev) => {
          if (prev <= 1) {
            setIsExpired(true);
            setError('Code has expired. Please request a new one.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [expiryTimer, isExpired]);

  const handleOtpChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }
    
    // Auto-submit when all digits are entered
    if (newCode.every(digit => digit !== '') && newCode.length === OTP_LENGTH) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const finalCode = otpCode || code.join('');
    if (finalCode.length !== OTP_LENGTH) {
      setError('Please enter the 6-digit code');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await verifyPhoneOtp(phone!, finalCode);
      
      // If name was provided (during sign up), update the profile
      if (name && !result.user.displayName) {
        try {
          await updateProfile(name);
        } catch (updateErr) {
          console.error('Failed to update profile name:', updateErr);
          // We don't block the user if only the name update fails
        }
      }
      
      router.replace(result.isOnboarded ? '/(tabs)' : '/(onboarding)/country');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    
    setResendLoading(true);
    setError(null);
    setIsExpired(false);
    setExpiryTimer(OTP_EXPIRY_SECONDS);
    
    try {
      await sendPhoneOtp(phone!);
      setTimer(RESEND_TIMER);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg.base }]} edges={['top']}>
      <ScreenHeader title="Verify Phone" showBack onBack={() => router.back()} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Animated.View 
            entering={FadeInDown.delay(100).duration(400)}
            style={styles.characterContainer}
          >
            <ManjeCharacter mood="happy" size="md" />
            <Text style={[styles.title, typeScale.headlineMedium, { color: colors.text.primary }]}>
              Enter Code
            </Text>
            <Text style={[styles.subtitle, typeScale.bodyMedium, { color: colors.text.secondary }]}>
              We sent a 6-digit code to {phone}
            </Text>
          </Animated.View>

          {/* Expiry Timer */}
          <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.expiryContainer}>
            <View style={[styles.expiryBadge, { 
              backgroundColor: isExpired 
                ? colors.status?.danger?.bg || '#fee2e2'
                : expiryTimer < 60 
                  ? colors.status?.warning?.bg || '#fef3c7'
                  : colors.bg?.subtle || '#f3f4f6'
            }]}>
              <Feather 
                name={isExpired ? "alert-circle" : "clock"} 
                size={14} 
                color={isExpired 
                  ? colors.status?.danger?.text || '#dc2626'
                  : expiryTimer < 60 
                    ? colors.status?.warning?.text || '#b45309'
                    : colors.text?.secondary || '#6b7280'
                } 
              />
              <Text style={[styles.expiryText, { 
                color: isExpired 
                  ? colors.status?.danger?.text || '#dc2626'
                  : expiryTimer < 60 
                    ? colors.status?.warning?.text || '#b45309'
                    : colors.text?.secondary || '#6b7280'
              }]}>
                {isExpired 
                  ? 'Code expired' 
                  : `Expires in ${formatTime(expiryTimer)}`
                }
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.otpContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref!)}
                style={[
                  styles.otpInput, 
                  { 
                    backgroundColor: colors.bg.surface,
                    borderColor: error ? colors.status.danger.base : colors.border.light,
                    color: colors.text.primary,
                  }
                ]}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </Animated.View>

          {error && (
            <Animated.View entering={FadeInDown.duration(300)}>
              <Text style={[styles.errorText, typeScale.bodySmall, { color: colors.status.danger.text }]}>
                {error}
              </Text>
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.actions}>
            <Button
              title={isExpired ? "Code Expired" : "Verify Code"}
              onPress={() => handleVerify()}
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={resendLoading || isExpired}
            />
            
            <View style={styles.resendContainer}>
              <Text style={[typeScale.bodyMedium, { color: colors.text.secondary }]}>
                Didn't receive code?{' '}
              </Text>
              <Pressable onPress={handleResend} disabled={timer > 0 || resendLoading}>
                <Text 
                  style={[
                    typeScale.labelLarge, 
                    { color: timer > 0 ? colors.text.disabled : colors.primary.default }
                  ]}
                >
                  {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing[8],
  },
  characterContainer: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  title: {
    marginTop: spacing[4],
  },
  subtitle: {
    marginTop: spacing[2],
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },
  otpInput: {
    width: 45,
    height: 55,
    borderRadius: radius.md,
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  actions: {
    marginTop: spacing[4],
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing[6],
  },
  expiryContainer: {
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  expiryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 20,
    gap: 6,
  },
  expiryText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
