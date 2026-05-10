import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, FileText, Download, Trash2, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { ClayCard } from '../../../src/components/common/ClayCard';
import { Button } from '../../../src/components/common/Button';

export default function DataPrivacyScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScreenHeader 
        title="Data & Privacy" 
        showBack 
        onBackPress={() => router.back()}
      />
      
      <ScrollView 
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['4xl'] }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary.base + '20' }]}>
            <Shield size={32} color={colors.primary.base} />
          </View>
          <Text style={[typography.headline.medium, { color: colors.text.primary, marginTop: spacing.lg, textAlign: 'center' }]}>
            Your Data is Yours
          </Text>
          <Text style={[typography.body.medium, { color: colors.text.secondary, textAlign: 'center', marginTop: spacing.xs }]}>
            We believe you should have full control over your financial data.
          </Text>
        </View>

        <ClayCard variant="subtle" style={styles.card}>
          <TouchableOpacity style={[styles.actionRow, { borderBottomWidth: 1, borderBottomColor: colors.border.light }]}>
            <View style={styles.actionIcon}>
              <Download size={20} color={colors.text.primary} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={[typography.headline.small, { color: colors.text.primary }]}>Export Data</Text>
              <Text style={[typography.label.medium, { color: colors.text.secondary }]}>Download all your data as CSV</Text>
            </View>
            <ArrowRight size={20} color={colors.text.muted} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionRow, { borderBottomWidth: 1, borderBottomColor: colors.border.light }]}>
            <View style={styles.actionIcon}>
              <FileText size={20} color={colors.text.primary} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={[typography.headline.small, { color: colors.text.primary }]}>Privacy Policy</Text>
              <Text style={[typography.label.medium, { color: colors.text.secondary }]}>Read how we handle your data</Text>
            </View>
            <ArrowRight size={20} color={colors.text.muted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow}>
            <View style={styles.actionIcon}>
              <FileText size={20} color={colors.text.primary} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={[typography.headline.small, { color: colors.text.primary }]}>Terms of Service</Text>
              <Text style={[typography.label.medium, { color: colors.text.secondary }]}>Read our terms of service</Text>
            </View>
            <ArrowRight size={20} color={colors.text.muted} />
          </TouchableOpacity>
        </ClayCard>

        <View style={styles.dangerZone}>
          <Text style={[typography.headline.small, { color: colors.status.danger.text, marginBottom: spacing.md }]}>
            Danger Zone
          </Text>
          <ClayCard variant="subtle" style={styles.dangerCard}>
            <Text style={[typography.body.medium, { color: colors.text.secondary, marginBottom: spacing.lg }]}>
              Permanently delete your account and all associated data. This action cannot be undone.
            </Text>
            <Button
              title="Delete Account"
              onPress={() => router.push('/(tabs)/settings/delete-account')}
              fullWidth
              variant="ghost"
              icon={<Trash2 size={20} color={colors.status.danger.text} />}
            />
          </ClayCard>
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
    marginBottom: 32,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionInfo: {
    flex: 1,
    marginRight: 16,
  },
  dangerZone: {
    marginTop: 16,
  },
  dangerCard: {
    borderColor: '#FF563030', // danger with opacity
    borderWidth: 1,
  }
});
