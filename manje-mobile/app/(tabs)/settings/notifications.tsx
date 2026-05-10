import React from 'react';
import { View, StyleSheet, ScrollView, Text, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, AlertCircle, Target, FileText } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { ClayCard } from '../../../src/components/common/ClayCard';
import { useSettingsStore } from '../../../src/stores';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const settings = useSettingsStore((state) => state.settings.notificationPreferences);
  const updateNotificationPreferences = useSettingsStore((state) => state.updateNotificationPreferences);

  const toggleSetting = async (key: keyof typeof settings) => {
    if (key === 'pushEnabled' && settings.pushEnabled) {
      await updateNotificationPreferences({
        pushEnabled: false,
        dailyReminder: false,
        budgetAlerts: false,
        goalMilestones: false,
        weeklyReport: false,
        promotional: false,
      });
      return;
    }

    const nextValue = !settings[key];
    const nextSettings: Partial<typeof settings> = { [key]: nextValue };

    if (key !== 'pushEnabled' && nextValue) {
      nextSettings.pushEnabled = true;
    }

    await updateNotificationPreferences(nextSettings);
  };

  const renderToggleRow = (
    key: keyof typeof settings,
    title: string,
    description: string,
    icon?: React.ReactNode,
    isLast = false
  ) => (
    <View style={[styles.toggleRow, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border.light }]}>
      {icon ? <View style={[styles.iconContainer, { backgroundColor: colors.background.sunken }]}>{icon}</View> : null}
      <View style={styles.toggleInfo}>
        <Text style={[typography.headline.small, { color: colors.text.primary, marginBottom: 2 }]}>{title}</Text>
        <Text style={[typography.label.medium, { color: colors.text.secondary }]}>{description}</Text>
      </View>
      <Switch
        value={settings[key]}
        onValueChange={() => void toggleSetting(key)}
        trackColor={{ false: colors.border.medium, true: colors.primary.base }}
        thumbColor={colors.text.inverse}
        disabled={key !== 'pushEnabled' && !settings.pushEnabled}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScreenHeader title="Notifications" showBack onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['4xl'] }} showsVerticalScrollIndicator={false}>
        <Text style={[typography.body.large, { color: colors.text.secondary, marginBottom: spacing.xl }]}>
          Choose which updates you want to receive to stay on top of your finances.
        </Text>

        <ClayCard variant="subtle" style={styles.card}>
          {renderToggleRow('pushEnabled', 'Enable Push Notifications', 'Allow Manje to send you notifications', <Bell size={20} color={colors.text.primary} />, true)}
        </ClayCard>

        <View style={styles.sectionHeader}>
          <Text style={[typography.headline.small, { color: colors.text.primary }]}>Alerts & Reminders</Text>
        </View>

        <ClayCard variant="subtle" style={styles.card}>
          {renderToggleRow('dailyReminder', 'Daily Check-in', 'A quick reminder to log your transactions', <Bell size={20} color={colors.primary.base} />)}
          {renderToggleRow('budgetAlerts', 'Budget Alerts', 'Warnings when you near your budget limits', <AlertCircle size={20} color={colors.status.warning.base} />)}
          {renderToggleRow('goalMilestones', 'Goal Milestones', 'Celebrations when you reach saving targets', <Target size={20} color={colors.status.success.base} />, true)}
        </ClayCard>

        <View style={styles.sectionHeader}>
          <Text style={[typography.headline.small, { color: colors.text.primary }]}>Insights & Reports</Text>
        </View>

        <ClayCard variant="subtle" style={styles.card}>
          {renderToggleRow('weeklyReport', 'Weekly Summary', 'Your personalized spending report every Monday', <FileText size={20} color={colors.category.utilities} />, true)}
        </ClayCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    padding: 0,
    marginBottom: 24,
    overflow: 'hidden',
  },
  sectionHeader: {
    marginBottom: 16,
    paddingLeft: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
});
