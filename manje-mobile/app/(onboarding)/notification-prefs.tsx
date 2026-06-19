import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Clock, Bell } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { Button } from '../../src/components/common/Button';
import { ClayCard } from '../../src/components/common/ClayCard';
import { layout, spacing } from '../../src/theme/spacing';

export default function NotificationPrefsScreen() {
  const router = useRouter();
  const { colors, typography } = useTheme();

  const [settings, setSettings] = useState({
    dailyReminder: true,
    budgetAlerts: true,
    weeklyReport: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleContinue = () => {
    router.push('/(onboarding)/goal-setting');
  };

  const renderToggle = (key: keyof typeof settings, title: string, desc: string, isLast = false) => (
    <View style={[styles.toggleRow, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border.light }]}>
      <View style={styles.toggleInfo}>
        <Text style={[typography.headline.small, { color: colors.text.primary, marginBottom: 4 }]}>{title}</Text>
        <Text style={[typography.body.medium, { color: colors.text.secondary }]}>{desc}</Text>
      </View>
      <Switch
        value={settings[key]}
        onValueChange={() => toggleSetting(key)}
        trackColor={{ false: colors.border.medium, true: colors.primary.base }}
        thumbColor={colors.text.inverse}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.base }]} edges={['top', 'bottom']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.header}>
          <Text style={[typography.headline.large, { color: colors.text.primary, marginBottom: spacing.md, textAlign: 'center' }]}>
            How should we notify you?
          </Text>
          <Text style={[typography.body.large, { color: colors.text.secondary, textAlign: 'center', marginBottom: spacing['2xl'] }]}>
            Customize your alerts so you only get what's helpful.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <Text style={[typography.headline.small, { color: colors.text.primary, marginBottom: spacing.md, marginLeft: 4 }]}>
            Alert Types
          </Text>
          <ClayCard variant="subtle" style={styles.card}>
            {renderToggle('dailyReminder', 'Daily Reminder', 'A quick ping to log your spending')}
            {renderToggle('budgetAlerts', 'Budget Warnings', 'When you approach your limits')}
            {renderToggle('weeklyReport', 'Weekly Summary', 'A breakdown of your week', true)}
          </ClayCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(600)} style={{ marginTop: spacing['2xl'] }}>
          <Text style={[typography.headline.small, { color: colors.text.primary, marginBottom: spacing.md, marginLeft: 4 }]}>
            Reminder Time
          </Text>
          <ClayCard variant="subtle" style={styles.timeCard}>
            <TouchableOpacity style={styles.timeSelector} activeOpacity={0.7}>
              <View style={styles.timeInfo}>
                <Clock size={20} color={colors.text.primary} style={{ marginRight: 12 }} />
                <Text style={[typography.body.large, { color: colors.text.primary }]}>Daily at 8:00 PM</Text>
              </View>
              <Text style={[typography.label.medium, { color: colors.primary.base }]}>Change</Text>
            </TouchableOpacity>
          </ClayCard>
        </Animated.View>

      </ScrollView>

      <Animated.View entering={FadeInDown.delay(700).duration(600)} style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
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
    paddingTop: spacing['2xl'],
  },
  header: {
    alignItems: 'center',
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  timeCard: {
    padding: 16,
  },
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
});
