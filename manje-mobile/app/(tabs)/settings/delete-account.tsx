import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { AlertTriangle } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader, Button, Input, ClayCard, ConfirmModal } from '../../../src/components/common';

export default function DeleteAccountScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();

  const [step, setStep] = useState(1);
  const [confirmationText, setConfirmationText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const handleDelete = () => {
    if (confirmationText !== 'DELETE') {
      setErrorModalVisible(true);
      return;
    }

    setIsLoading(true);
    // Simulate deletion
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, this would clear local storage, auth state, and route to welcome
      router.replace('/(auth)/welcome');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: colors.background.base }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader 
        title="Delete Account" 
        showBack 
        onBackPress={() => step === 2 ? setStep(1) : router.back()}
      />
      
      <ScrollView 
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['4xl'] }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: colors.status.danger.bg }]}>
            <AlertTriangle size={32} color={colors.status.danger.text} />
          </View>
        </View>

        {step === 1 ? (
          <View>
            <Text style={[typography.headline.large, { color: colors.text.primary, textAlign: 'center', marginBottom: spacing.lg }]}>
              Are you sure?
            </Text>
            
            <ClayCard variant="subtle" style={[styles.warningCard, { borderColor: colors.status.danger.base + '50' }]}>
              <Text style={[typography.headline.small, { color: colors.status.danger.text, marginBottom: spacing.sm }]}>
                This action is permanent
              </Text>
              <Text style={[typography.body.medium, { color: colors.text.primary, marginBottom: spacing.md }]}>
                Deleting your account will result in:
              </Text>
              <View style={styles.bulletList}>
                <Text style={[typography.body.medium, { color: colors.text.secondary, marginBottom: 8 }]}>• Loss of all transaction history</Text>
                <Text style={[typography.body.medium, { color: colors.text.secondary, marginBottom: 8 }]}>• Deletion of all budgets and goals</Text>
                <Text style={[typography.body.medium, { color: colors.text.secondary, marginBottom: 8 }]}>• Removal of all personal data</Text>
              </View>
            </ClayCard>

            <View style={styles.actions}>
              <Button
                title="I Understand, Continue"
                onPress={() => setStep(2)}
                fullWidth
                size="lg"
                variant="primary"
                style={{ backgroundColor: colors.status.danger.base }}
              />
              <Button
                title="Cancel"
                onPress={() => router.back()}
                fullWidth
                size="lg"
                variant="ghost"
                style={{ marginTop: spacing.md }}
              />
            </View>
          </View>
        ) : (
          <View>
            <Text style={[typography.headline.large, { color: colors.text.primary, textAlign: 'center', marginBottom: spacing.lg }]}>
              Final Confirmation
            </Text>
            
            <Text style={[typography.body.large, { color: colors.text.secondary, marginBottom: spacing.xl }]}>
              Please type <Text style={{ fontWeight: 'bold', color: colors.text.primary }}>DELETE</Text> below to confirm that you want to permanently delete your account.
            </Text>

            <Input
              label=""
              placeholder="Type DELETE"
              value={confirmationText}
              onChangeText={setConfirmationText}
              autoCapitalize="characters"
            />

            <View style={styles.actions}>
              <Button
                title="Permanently Delete"
                onPress={handleDelete}
                fullWidth
                size="lg"
                variant="primary"
                style={{ backgroundColor: colors.status.danger.base }}
                loading={isLoading}
                disabled={confirmationText !== 'DELETE'}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Error Modal */}
      <ConfirmModal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        onConfirm={() => setErrorModalVisible(false)}
        title="Invalid Confirmation"
        message="Please type DELETE exactly (in uppercase) to confirm account deletion."
        confirmText="Got it"
        cancelText=""
        confirmVariant="primary"
        icon="alert-triangle"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningCard: {
    padding: 20,
    borderWidth: 1,
    marginBottom: 32,
  },
  bulletList: {
    paddingLeft: 8,
  },
  actions: {
    marginTop: 32,
  }
});
