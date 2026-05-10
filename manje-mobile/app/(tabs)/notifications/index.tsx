import React from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, AlertCircle, TrendingUp, TrendingDown, Target, Info } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { useNotificationStore } from '../../../src/stores';

export default function NotificationCentreScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const notifications = useNotificationStore((state) => state.notifications);

  const getIcon = (type: string, color: string) => {
    switch (type) {
      case 'alert': return <AlertCircle size={24} color={color} />;
      case 'goal': return <Target size={24} color={color} />;
      case 'insight': return <TrendingUp size={24} color={color} />;
      case 'transaction': return <TrendingDown size={24} color={color} />;
      default: return <Info size={24} color={color} />;
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScreenHeader title="Notifications" showBack onBackPress={() => router.back()} />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push(`/(tabs)/notifications/${item.id}`)}
            style={[
              styles.notificationItem,
              {
                backgroundColor: item.read ? colors.background.base : `${colors.primary.base}10`,
                borderBottomColor: colors.border.light,
              },
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: getIconBg(item.type) }]}>
              {getIcon(item.type, getIconColor(item.type))}
            </View>

            <View style={styles.contentContainer}>
              <Text style={[typography.headline.small, { color: colors.text.primary, marginBottom: 4 }]}>{item.title}</Text>
              <Text style={[typography.body.medium, { color: colors.text.secondary }]} numberOfLines={2}>
                {item.message}
              </Text>
              <Text style={[typography.label.small, { color: colors.text.muted, marginTop: 8 }]}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>

            {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary.base }]} />}
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: spacing['3xl'] }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={[styles.emptyContainer, { padding: spacing['2xl'] }]}>
            <View style={[styles.emptyIconContainer, { backgroundColor: colors.background.card }]}>
              <Bell size={32} color={colors.text.muted} />
            </View>
            <Text style={[typography.headline.medium, { color: colors.text.primary, marginTop: spacing.xl, marginBottom: spacing.xs }]}>
              You're all caught up
            </Text>
            <Text style={[typography.body.medium, { color: colors.text.secondary, textAlign: 'center' }]}>
              New account and activity updates from Firestore will show up here.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
