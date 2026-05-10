import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Mail } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { Button } from '../../../src/components/common/Button';
import { Input } from '../../../src/components/common/Input';
import { ManjeCharacter } from '../../../src/components/character/ManjeCharacter';
import { useAuthStore } from '../../../src/stores';

export default function EditProfileScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const [name, setName] = useState(user?.displayName ?? '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setName(user?.displayName ?? '');
  }, [user?.displayName]);

  const handleSave = async () => {
    setIsLoading(true);
    await updateProfile(name);
    setIsLoading(false);
    router.back();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background.base }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title="Edit Profile" showBack onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['4xl'] }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <ManjeCharacter mood="happy" size="md" />
            <TouchableOpacity style={[styles.editBadge, { backgroundColor: colors.primary.base }]}>
              <Text style={[typography.label.small, { color: colors.text.inverse }]}>Live</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formSection}>
          <Input label="Full Name" value={name} onChangeText={setName} leftIcon={<User size={20} color={colors.text.muted} />} />

          <View style={styles.inputSpacing} />

          <View>
            <Text style={[typography.label.medium, { color: colors.text.muted, marginBottom: spacing.xs, marginLeft: spacing.xs }]}>
              Email Address (Managed by Authentication)
            </Text>
            <View style={[styles.readOnlyInput, { backgroundColor: colors.background.sunken, borderColor: colors.border.light }]}>
              <Mail size={20} color={colors.text.muted} style={{ marginRight: spacing.sm }} />
              <Text style={[typography.body.large, { color: colors.text.muted }]}>{user?.email ?? 'Not signed in'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Button title="Save Changes" onPress={() => void handleSave()} fullWidth size="lg" variant="primary" loading={isLoading} disabled={!name.trim()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F4F5F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  formSection: {
    marginBottom: 40,
  },
  inputSpacing: {
    height: 24,
  },
  readOnlyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  actions: {
    marginTop: 'auto',
  },
});
