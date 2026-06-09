/**
 * AUTH-01: Welcome Screen
 * Brand entry point
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import Animated, { FadeInDown, FadeInUp, SlideInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../src/hooks/useTheme';
import { Button } from '../../src/components/common/Button';
import { ManjeCharacter } from '../../src/components/character/ManjeCharacter';
import { typeScale } from '../../src/theme/typography';
import { spacing, layout, radius } from '../../src/theme/spacing';
import { gradients } from '../../src/theme/gradients';

export default function WelcomeScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg.base }]}>
      <View style={styles.topSection}>
        <Animated.View entering={FadeInDown.delay(200).springify().damping(28).stiffness(200)}>
          <ManjeCharacter mood="wave" size={180} animated />
        </Animated.View>
        
        <Animated.View entering={FadeInUp.delay(600).duration(400)} style={styles.titleContainer}>
          <Text style={[typeScale['display.lg'], { color: colors.text.primary }]}>Manje</Text>
          <Text style={[typeScale['body.md'], { color: colors.text.secondary, marginTop: spacing[2] }]}>
            Kuthana ndi Maluzi
          </Text>
          <Text style={[typeScale['label.md'], { color: colors.text.secondary, marginTop: spacing[1], opacity: 0.7 }]}>
            The Gateway to Financial Freedom
          </Text>
        </Animated.View>
      </View>

      <Animated.View entering={SlideInDown.delay(400).springify().damping(30).stiffness(150)}>
        <BlurView
          intensity={20}
          tint={isDark ? 'dark' : 'light'}
          style={[styles.bottomPanel, { backgroundColor: colors.glass.bg }]}
        >
          <Button
            title="I'm New Here"
            onPress={() => router.push('/(auth)/signup')}
            variant="primary"
            size="lg"
            fullWidth
            style={{ marginBottom: spacing[4] }}
          />
          <Button
            title="I Have an Account"
            onPress={() => router.push('/(auth)/signin')}
            variant="ghost"
            size="lg"
            fullWidth
            textStyle={{ color: colors.text.primary }}
          />
        </BlurView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '10%',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: spacing[8],
  },
  bottomPanel: {
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing[8],
    paddingBottom: spacing[12],
    borderTopLeftRadius: radius['4xl'],
    borderTopRightRadius: radius['4xl'],
    overflow: 'hidden',
  },
});
