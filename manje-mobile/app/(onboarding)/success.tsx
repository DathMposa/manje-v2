/**
 * OB-07: Onboarding Success Screen
 * Celebration with ManjeCharacter and transition to main app.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/hooks/useTheme';
import { Button } from '../../src/components/common';
import { ManjeCharacter } from '../../src/components/character';
import { useAuthStore } from '../../src/stores/authStore';
import { typeScale } from '../../src/theme/typography';
import { spacing, layout } from '../../src/theme/spacing';
import { springPresets } from '../../src/theme/animations';

export default function SuccessScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { setOnboarded } = useAuthStore();
  
  const confettiScale = useSharedValue(0);
  
  useEffect(() => {
    // Trigger celebration haptic
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Animate confetti
    confettiScale.value = withDelay(
      300,
      withSequence(
        withSpring(1.2, springPresets.bouncy),
        withSpring(1, springPresets.default)
      )
    );
  }, []);
  
  const handleGetStarted = async () => {
    // Mark onboarding as complete
    await setOnboarded(true);
    
    // Navigate to main app
    router.replace('/(tabs)');
  };
  
  const confettiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: confettiScale.value }],
  }));
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg.base }]}>
      {/* Background gradient */}
      <LinearGradient
        colors={isDark 
          ? ['rgba(46,204,113,0.15)', 'transparent', 'rgba(46,204,113,0.08)'] 
          : ['rgba(26,107,74,0.08)', 'transparent', 'rgba(46,204,113,0.05)']
        }
        style={styles.backgroundGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        locations={[0, 0.5, 1]}
      />
      
      {/* Confetti decoration */}
      <Animated.View style={[styles.confettiContainer, confettiStyle]}>
        <Text style={styles.confetti}>🎉</Text>
        <Text style={[styles.confetti, styles.confettiLeft]}>✨</Text>
        <Text style={[styles.confetti, styles.confettiRight]}>🎊</Text>
        <Text style={[styles.confetti, styles.confettiTopLeft]}>⭐</Text>
        <Text style={[styles.confetti, styles.confettiTopRight]}>💫</Text>
      </Animated.View>
      
      {/* Character Area */}
      <Animated.View 
        entering={FadeIn.delay(200).duration(600)}
        style={styles.characterArea}
      >
        <ManjeCharacter mood="celebrate" size="xl" variant="full" animated />
      </Animated.View>
      
      {/* Content Area */}
      <Animated.View 
        entering={FadeInUp.delay(400).duration(600)}
        style={styles.contentArea}
      >
        <Text style={[styles.title, typeScale.headlineLarge, { color: colors.text.primary }]}>
          You're all set!
        </Text>
        
        <Text style={[styles.subtitle, typeScale.headlineMedium, { color: colors.primary.default }]}>
          Welcome to Manje 🌱
        </Text>
        
        <Text style={[styles.description, typeScale.bodyMedium, { color: colors.text.secondary }]}>
          I'm here to help you track your spending, build better habits, and reach your financial goals.
        </Text>
        
        {/* Feature highlights */}
        <View style={styles.features}>
          <FeatureItem 
            icon="📊" 
            text="Track every transaction" 
            color={colors.text.secondary}
            delay={600}
          />
          <FeatureItem 
            icon="🎯" 
            text="Set and achieve goals" 
            color={colors.text.secondary}
            delay={700}
          />
          <FeatureItem 
            icon="💡" 
            text="Get smart insights" 
            color={colors.text.secondary}
            delay={800}
          />
        </View>
      </Animated.View>
      
      {/* Action Area */}
      <Animated.View 
        entering={FadeInDown.delay(900).duration(600)}
        style={styles.actionArea}
      >
        <Button
          title="Let's Go!"
          onPress={handleGetStarted}
          variant="primary"
          size="lg"
          fullWidth
        />
      </Animated.View>
    </SafeAreaView>
  );
}

interface FeatureItemProps {
  icon: string;
  text: string;
  color: string;
  delay: number;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text, color, delay }) => {
  return (
    <Animated.View 
      entering={FadeInUp.delay(delay).duration(400)}
      style={styles.featureItem}
    >
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={[styles.featureText, typeScale.bodyMedium, { color }]}>
        {text}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  confettiContainer: {
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  confetti: {
    fontSize: 40,
    position: 'absolute',
  },
  confettiLeft: {
    left: '20%',
    top: 20,
  },
  confettiRight: {
    right: '20%',
    top: 30,
  },
  confettiTopLeft: {
    left: '30%',
    top: -30,
  },
  confettiTopRight: {
    right: '30%',
    top: -20,
  },
  characterArea: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing[16],
  },
  contentArea: {
    flex: 2,
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingH,
  },
  title: {
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: spacing[4],
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing[6],
  },
  features: {
    alignItems: 'flex-start',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  featureIcon: {
    fontSize: 20,
    marginRight: spacing[3],
  },
  featureText: {},
  actionArea: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: spacing[8],
  },
});
