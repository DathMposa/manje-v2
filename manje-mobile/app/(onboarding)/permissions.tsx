import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Shield } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../src/hooks/useTheme';
import { Button } from '../../src/components/common/Button';
import { ClayCard } from '../../src/components/common/ClayCard';
import { layout, spacing } from '../../src/theme/spacing';

export default function PermissionsScreen() {
  const router = useRouter();
  const { colors, typography } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleEnable = () => {
    setIsLoading(true);
    // Simulate permission request
    setTimeout(() => {
      setIsLoading(false);
      router.push('/(onboarding)/notification-prefs');
    }, 1000);
  };

  const handleSkip = () => {
    router.push('/(onboarding)/notification-prefs');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.base }]} edges={['top', 'bottom']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.iconWrapper}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primary.base + '20' }]}>
            <Bell size={48} color={colors.primary.base} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.textContainer}>
          <Text style={[typography.display.medium, { color: colors.text.primary, marginBottom: spacing.md, textAlign: 'center' }]}>
            Stay on Track
          </Text>
          <Text style={[typography.body.large, { color: colors.text.secondary, textAlign: 'center', marginBottom: spacing['2xl'] }]}>
            Enable notifications to get the most out of Manje. We'll only send what matters.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.cardsContainer}>
          <ClayCard variant="subtle" style={styles.infoCard}>
            <View style={[styles.smallIcon, { backgroundColor: colors.status.warning.bg }]}>
              <Bell size={20} color={colors.status.warning.text} />
            </View>
            <View style={styles.cardText}>
              <Text style={[typography.headline.small, { color: colors.text.primary, marginBottom: 4 }]}>Budget Alerts</Text>
              <Text style={[typography.body.medium, { color: colors.text.secondary }]}>Get warned before you overspend</Text>
            </View>
          </ClayCard>

          <ClayCard variant="subtle" style={styles.infoCard}>
            <View style={[styles.smallIcon, { backgroundColor: colors.status.success.bg }]}>
              <Shield size={20} color={colors.status.success.text} />
            </View>
            <View style={styles.cardText}>
              <Text style={[typography.headline.small, { color: colors.text.primary, marginBottom: 4 }]}>Privacy First</Text>
              <Text style={[typography.body.medium, { color: colors.text.secondary }]}>Your data stays on your device</Text>
            </View>
          </ClayCard>
        </Animated.View>
      </ScrollView>

      <Animated.View entering={FadeInDown.delay(700).duration(600)} style={styles.footer}>
        <Button
          title="Enable Notifications"
          onPress={handleEnable}
          fullWidth
          size="lg"
          variant="primary"
          loading={isLoading}
          style={{ marginBottom: spacing.md }}
        />
        <Button
          title="Maybe Later"
          onPress={handleSkip}
          fullWidth
          size="lg"
          variant="ghost"
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
    paddingTop: spacing['4xl'],
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  cardsContainer: {
    gap: spacing.md,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  smallIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
});
