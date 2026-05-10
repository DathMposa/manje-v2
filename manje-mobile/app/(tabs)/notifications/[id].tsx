import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AlertCircle, Target, TrendingUp, TrendingDown, Info } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { Button } from '../../../src/components/common/Button';
import { ClayCard } from '../../../src/components/common/ClayCard';
import { useNotificationStore } from '../../../src/stores';

const DEFAULT_ROUTE_BY_TYPE: Record<string, string> = {
  alert: '/(tabs)/budgets',
  goal: '/(tabs)/goals',
  insight: '/(tabs)/reports',
  transaction: '/(tabs)/activity',
  info: '/(tabs)',
};

export default function NotificationDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const notification = useNotificationStore((state) => state.getNotification(String(id)));
  const markRead = useNotificationStore((state) => state.markRead);

  useEffect(() => {
    if (notification && !notification.read) {
      void markRead(notification.id, true);
    }
  }, [markRead, notification]);

  const getIcon = (type: string, color: string) => {
    switch (type) {
      case 'alert': return <AlertCircle size={32} color={color} />;
      case 'goal': return <Target size={32} color={color} />;
      case 'insight': return <TrendingUp size={32} color={color} />;
      case 'transaction': return <TrendingDown size={32} color={color} />;
      default: return <Info size={32} color={color} />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'alert': return colors.status.warning.bg;
      case 'goal': return colors.status.success.bg;
      case 'insight': return `${colors.primary.base}20`;
      case 'transaction': return colors.status.danger.bg;
      default: return colors.status.info.bg;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'alert': return colors.status.warning.text;
      case 'goal': return colors.status.success.text;
      case 'insight': return colors.primary.base;
      case 'transaction': return colors.status.danger.text;
      default: return colors.status.info.text;
    }
  };

  if (!notification) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.base }]}>
        <ScreenHeader title="Detail" showBack onBackPress={() => router.back()} />
      </View>
    );
  }

  const actionRoute = notification.actionRoute ?? DEFAULT_ROUTE_BY_TYPE[notification.type] ?? '/(tabs)';

  return (
    <View style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScreenHeader title="Detail" showBack onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: spacing.xl }} showsVerticalScrollIndicator={false}>
        <ClayCard variant="subtle">
          <View style={styles.cardContent}>
            <View style={[styles.iconContainer, { backgroundColor: getIconBg(notification.type) }]}>
              {getIcon(notification.type, getIconColor(notification.type))}
            </View>

            <Text style={[typography.display.small, { color: colors.text.primary, marginTop: spacing.xl, textAlign: 'center' }]}>
              {notification.title}
            </Text>

            <Text style={[typography.label.medium, { color: colors.text.muted, marginTop: spacing.sm, textAlign: 'center' }]}>
              {new Date(notification.createdAt).toLocaleString()}
            </Text>

            <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

            <Text style={[typography.body.large, { color: colors.text.secondary, lineHeight: 28 }]}>{notification.message}</Text>
          </View>
        </ClayCard>

        <View style={{ marginTop: spacing['2xl'] }}>
          <Button title="Open Related Screen" onPress={() => router.push(actionRoute as never)} fullWidth size="lg" variant="primary" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContent: {
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 24,
  },
});
