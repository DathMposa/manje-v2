/**
 * Profile Screen
 * User profile and settings.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/hooks/useTheme';
import { ClayCard, ConfirmModal } from '../../src/components/common';
import { ManjeCharacter } from '../../src/components/character';
import { useAuthStore, useSettingsStore } from '../../src/stores';
import { typeScale } from '../../src/theme/typography';
import { spacing, layout, radius } from '../../src/theme/spacing';

interface SettingsItemProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value?: string;
  onPress: () => void;
  danger?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon, label, value, onPress, danger }) => {
  const { colors, shadow } = useTheme();
  
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={[styles.settingsItem, { backgroundColor: colors.bg.card }, shadow('xs')]}
    >
      <View style={[styles.settingsIcon, { backgroundColor: danger ? colors.status.dangerBg : colors.bg.sunken }]}>
        <Feather name={icon} size={20} color={danger ? colors.status.danger : colors.text.secondary} />
      </View>
      <Text 
        style={[
          styles.settingsLabel, 
          typeScale.labelLarge, 
          { color: danger ? colors.status.danger : colors.text.primary }
        ]}
      >
        {label}
      </Text>
      {!!value && (
        <Text style={[styles.settingsValue, typeScale.bodySmall, { color: colors.text.secondary }]}>
          {value}
        </Text>
      )}
      <Feather name="chevron-right" size={20} color={colors.text.secondary} />
    </Pressable>
  );
};

export default function ProfileScreen() {
  const { colors, shadow, isDark, toggleTheme, themeMode } = useTheme();
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const currency = useSettingsStore((state) => state.settings.currency);
  
  const [signOutModalVisible, setSignOutModalVisible] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);

  const handleSignOut = () => {
    setSignOutModalVisible(true);
  };

  const confirmSignOut = async () => {
    setSignOutLoading(true);
    try {
      await signOut();
      setSignOutModalVisible(false);
      // Redirection is handled automatically by RootLayoutNav when isAuthenticated becomes false
    } catch (error) {
      console.error('Sign out error:', error);
      setSignOutModalVisible(false);
    } finally {
      setSignOutLoading(false);
    }
  };
  
  const getThemeLabel = () => {
    switch (themeMode) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg.base }]} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, typeScale.headlineLarge, { color: colors.text.primary }]}>
            Profile
          </Text>
        </View>
        
        {/* Profile Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <ClayCard variant="clay" style={styles.profileCard}>
            <View style={styles.profileContent}>
              <View style={[styles.avatar, { backgroundColor: colors.primary.subtle }]}>
                <ManjeCharacter mood="happy" size="sm" variant="badge" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, typeScale.headlineLarge, { color: colors.text.primary }]}>
                  {user?.displayName || 'User'}
                </Text>
                <Text style={[typeScale.bodyMedium, { color: colors.text.secondary }]}>
                  {user?.email || 'user@example.com'}
                </Text>
              </View>
              <Pressable 
                style={[styles.editButton, { backgroundColor: colors.bg.sunken }]}
                onPress={() => router.push('/(tabs)/settings')}
              >
                <Feather name="edit-2" size={18} color={colors.text.secondary} />
              </Pressable>
            </View>
          </ClayCard>
        </Animated.View>
        
        {/* Settings Sections */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
          <Text style={[styles.sectionTitle, typeScale.labelMedium, { color: colors.text.secondary }]}>
            Preferences
          </Text>
          <View style={styles.settingsGroup}>
            <SettingsItem
              icon="globe"
              label="Currency"
              value={currency}
              onPress={() => router.push('/(tabs)/settings/currency')}
            />
            <SettingsItem
              icon="moon"
              label="Appearance"
              value={getThemeLabel()}
              onPress={toggleTheme}
            />
            <SettingsItem
              icon="bell"
              label="Notifications"
              onPress={() => router.push('/(tabs)/settings/notifications')}
            />
            <SettingsItem
              icon="shield"
              label="Security"
              onPress={() => router.push('/(tabs)/settings/security')}
            />
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.section}>
          <Text style={[styles.sectionTitle, typeScale.labelMedium, { color: colors.text.secondary }]}>
            Data & Privacy
          </Text>
          <View style={styles.settingsGroup}>
            <SettingsItem
              icon="lock"
              label="Privacy & Security"
              onPress={() => router.push('/(tabs)/settings/privacy')}
            />
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.section}>
          <Text style={[styles.sectionTitle, typeScale.labelMedium, { color: colors.text.secondary }]}>
            Support
          </Text>
          <View style={styles.settingsGroup}>
            <SettingsItem
              icon="help-circle"
              label="Help & Support"
              onPress={() => router.push('/(tabs)/settings/support')}
            />
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.section}>
          <View style={styles.settingsGroup}>
            <SettingsItem
              icon="log-out"
              label="Sign Out"
              onPress={handleSignOut}
              danger
            />
          </View>
        </Animated.View>
        
        {/* Version */}
        <Animated.View entering={FadeInDown.delay(600).duration(400)} style={styles.version}>
          <Text style={[typeScale.bodySmall, { color: colors.text.secondary }]}>
            Manje v1.0.0
          </Text>
          <Text style={[typeScale.bodySmall, { color: colors.text.secondary }]}>
            Made with 💚 in Malawi
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Sign Out Confirmation Modal */}
      <ConfirmModal
        visible={signOutModalVisible}
        onClose={() => setSignOutModalVisible(false)}
        onConfirm={confirmSignOut}
        title="Sign Out"
        message="Are you sure you want to sign out? You'll need to sign in again to access your account."
        confirmText="Sign Out"
        cancelText="Cancel"
        confirmVariant="danger"
        icon="log-out"
        loading={signOutLoading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: spacing[8],
  },
  header: {
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
  },
  headerTitle: {},
  profileCard: {
    marginBottom: spacing[6],
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[4],
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    marginBottom: 2,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: spacing[5],
  },
  sectionTitle: {
    marginBottom: spacing[3],
    marginLeft: spacing[1],
  },
  settingsGroup: {
    gap: spacing[2],
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: radius['2xl'],
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  settingsLabel: {
    flex: 1,
  },
  settingsValue: {
    marginRight: spacing[2],
  },
  version: {
    alignItems: 'center',
    paddingTop: spacing[4],
    gap: spacing[1],
  },
});
