import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../src/hooks';
import { Button } from '../../src/components/common';
import { ManjeCharacter } from '../../src/components/character';
import { layout, spacing } from '../../src/theme';

export default function BrandStoryScreen() {
  const router = useRouter();
  const { colors, typography } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.base }]} edges={['top', 'bottom']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeInDown.delay(100).duration(600)} 
          style={styles.characterContainer}
        >
          <ManjeCharacter mood="wave" size="xl" variant="full" animated showIdleFloat />
        </Animated.View>

        <View style={styles.textContainer}>
          <Animated.Text 
            entering={FadeInDown.delay(300).duration(600)} 
            style={[typography.headline.large, { color: colors.text.primary, marginBottom: spacing.lg, textAlign: 'center' }]}
          >
            Ever wondered where your money goes each month?
          </Animated.Text>
          
          <Animated.Text 
            entering={FadeInDown.delay(500).duration(600)} 
            style={[typography.body.large, { color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.md }]}
          >
            You're not alone. Many of us feel like our money disappears right after payday.
          </Animated.Text>
          
          <Animated.Text 
            entering={FadeInDown.delay(700).duration(600)} 
            style={[typography.body.large, { color: colors.text.secondary, textAlign: 'center' }]}
          >
            Manje is your personal financial companion, built specifically for our local context, to help you track, budget, and grow your money.
          </Animated.Text>
        </View>
      </ScrollView>

      <Animated.View entering={FadeInDown.delay(900).duration(600)} style={styles.footer}>
        <Button
          title="Let's Fix That"
          onPress={() => router.push('/(onboarding)/country')}
          fullWidth
          size="lg"
          variant="primary"
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: layout.screenPaddingH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['3xl'],
    height: 250,
  },
  textContainer: {
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
});
