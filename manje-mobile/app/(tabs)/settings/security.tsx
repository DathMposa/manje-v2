import React from 'react';
import { View, StyleSheet, ScrollView, Text, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Fingerprint, Clock, Lock } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { ClayCard } from '../../../src/components/common/ClayCard';
import { Button } from '../../../src/components/common/Button';
import { useSettingsStore } from '../../../src/stores';

const LOCK_OPTIONS = ['30 seconds', '1 minute', '5 minutes', 'Never'];

export default function SecuritySettingsScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const security = useSettingsStore((state) => state.settings.security);
  const updateSecurity = useSettingsStore((state) => state.updateSecurity);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScreenHeader title="Security" showBack onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['4xl'] }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${colors.primary.base}20` }]}>
            <Shield size={32} color={colors.primary.base} />
          </View>
          <Text style={[typography.headline.medium, { color: colors.text.primary, marginTop: spacing.lg, textAlign: 'center' }]}>
            Your Data is Secure
          </Text>
          <Text style={[typography.body.medium, { color: colors.text.secondary, textAlign: 'center', marginTop: spacing.xs }]}>
            These preferences are stored per account in Supabase.
          </Text>
        </View>

        <ClayCard variant="subtle" style={styles.card}>
          <View style={[styles.settingRow, { borderBottomWidth: 1, borderBottomColor: colors.border.light }]}>
            <View style={styles.settingIcon}>
              <Fingerprint size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[typography.headline.small, { color: colors.text.primary }]}>Biometric Lock</Text>
              <Text style={[typography.label.medium, { color: colors.text.secondary }]}>Use fingerprint/face to unlock</Text>
            </View>
            <Switch
              value={security.biometricEnabled}
              onValueChange={(value) => void updateSecurity({ biometricEnabled: value })}
              trackColor={{ false: colors.border.medium, true: colors.primary.base }}
              thumbColor={colors.text.inverse}
            />
          </View>

          {LOCK_OPTIONS.map((option) => (
            <TouchableOpacity key={option} style={styles.settingRow} activeOpacity={0.7} onPress={() => void updateSecurity({ autoLockTimeout: option })}>
              <View style={styles.settingIcon}>
                <Clock size={20} color={colors.text.primary} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[typography.headline.small, { color: colors.text.primary }]}>Auto-Lock Timeout</Text>
                <Text style={[typography.label.medium, { color: colors.text.secondary }]}>{option}</Text>
              </View>
              <Text style={[typography.body.medium, { color: security.autoLockTimeout === option ? colors.primary.base : colors.text.muted }]}>
                {security.autoLockTimeout === option ? 'Selected' : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </ClayCard>

        <ClayCard variant="subtle" style={[styles.card, { marginTop: spacing.lg }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Lock size={20} color={colors.status.success.base} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[typography.headline.small, { color: colors.text.primary }]}>Data Encryption</Text>
              <Text style={[typography.label.medium, { color: colors.text.secondary }]}>Managed through Supabase and TLS transport security</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.status.success.bg }]}>
              <Text style={[typography.label.small, { color: colors.status.success.text }]}>Active</Text>
            </View>
          </View>
        </ClayCard>

        <View style={styles.actions}>
          <Button title="Change Password" onPress={() => router.push('/(auth)/forgot-password')} fullWidth size="lg" variant="outline" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  actions: {
    marginTop: 32,
  },
});
