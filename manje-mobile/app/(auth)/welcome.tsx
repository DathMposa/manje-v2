/**
 * AUTH-01: Welcome Screen
 * Branded entry point with ManjeCharacter wave animation.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../src/hooks/useTheme';
import { Button } from '../../src/components/common';
import { ManjeCharacter } from '../../src/components/character';
import { typeScale } from '../../src/theme/typography';
import { spacing, layout } from '../../src/theme/spacing';
import { green } from '../../src/theme/colors';

export default function WelcomeScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  
  const handleNewUser = () => {
    router.push('/(auth)/signup');
  };
  
  const handleExistingUser = () => {
    router.push('/(auth)/signin');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg.base }]}>
      {/* Background gradient accent */}
      <LinearGradient
        colors={isDark 
          ? ['rgba(46,204,113,0.08)', 'transparent'] 
          : ['rgba(26,107,74,0.05)', 'transparent']
        }
        style={styles.backgroundGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
      />
      
      {/* Character Area */}
      <Animated.View 
        entering={FadeInDown.delay(200).duration(600)}
        style={styles.characterArea}
      >
        <ManjeCharacter mood="wave" size="xl" animated />
      </Animated.View>
      
      {/* Content Area */}
      <Animated.View 
        entering={FadeInUp.delay(400).duration(600)}
        style={styles.contentArea}
      >
        {/* Logo / Brand */}
        <Text style={[styles.brandName, typeScale.displayLarge, { color: colors.primary.main }]}>
          Manje
        </Text>
        
        {/* Tagline */}
        <Text style={[styles.tagline, typeScale.headlineMedium, { color: colors.text.secondary }]}>
          Track it. Budget it. Grow it.
        </Text>
        
        {/* Description */}
        <Text style={[styles.description, typeScale.bodyMedium, { color: colors.text.muted }]}>
          Your AI-powered financial companion.{'\n'}
          Know where your money is going — right now.
        </Text>
      </Animated.View>
      
      {/* Action Area */}
      <Animated.View 
        entering={FadeInUp.delay(600).duration(600)}
        style={styles.actionArea}
      >
        <Button
          title="I'm New Here"
          onPress={handleNewUser}
          variant="primary"
          size="lg"
          fullWidth
        />
        
        <View style={styles.buttonSpacer} />
        
        <Button
          title="I Have an Account"
          onPress={handleExistingUser}
          variant="outline"
          size="lg"
          fullWidth
        />
        
        {/* Terms */}
        <Text style={[styles.terms, typeScale.bodySmall, { color: colors.text.muted }]}>
          By continuing, you agree to our{' '}
          <Text style={{ color: colors.primary.main }}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={{ color: colors.primary.main }}>Privacy Policy</Text>
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  characterArea: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing[10],
  },
  contentArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingH,
  },
  brandName: {
    marginBottom: spacing[2],
  },
  tagline: {
    marginBottom: spacing[4],
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
  },
  actionArea: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: spacing[8],
  },
  buttonSpacer: {
    height: spacing[3],
  },
  terms: {
    textAlign: 'center',
    marginTop: spacing[6],
    lineHeight: 20,
  },
});
