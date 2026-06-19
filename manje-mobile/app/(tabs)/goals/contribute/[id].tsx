import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, FileText } from 'lucide-react-native';
import { useTheme } from '../../../../src/hooks';
import { ScreenHeader } from '../../../../src/components/common/ScreenHeader';
import { Button } from '../../../../src/components/common/Button';
import { Input } from '../../../../src/components/common/Input';
import { ManjeCharacter } from '../../../../src/components/character/ManjeCharacter';
import { useGoalStore } from '../../../../src/stores';

export default function AddContributionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const addContribution = useGoalStore((state) => state.addContribution);

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await addContribution(String(id), {
      amount: Number(amount),
      note,
      date: new Date().toISOString(),
    });
    setIsLoading(false);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background.base }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title="Add Contribution" showBack onBackPress={() => router.back()} />

      <ScrollView
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['4xl'] }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <ManjeCharacter mood="happy" size="md" animated showIdleFloat />
          <Text style={[typography.headline.small, { color: colors.text.secondary, textAlign: 'center', marginTop: spacing.lg }]}>
            How much are you adding?
          </Text>
        </View>

        <View style={styles.amountContainer}>
          <View style={[styles.amountInputWrapper, { borderBottomColor: colors.border.medium }]}>
            <Text style={[typography.financial.large, { color: colors.status.success.text, marginRight: spacing.xs }]}>MK</Text>
            <TextInput
              style={[styles.amountInput, typography.financial.large, { color: colors.status.success.text }]}
              value={amount}
              onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.text.muted}
              autoFocus
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Input
            label="Date"
            value={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            editable={false}
            leftIcon={<Calendar size={20} color={colors.text.muted} />}
          />

          <View style={styles.inputSpacing} />

          <Input
            label="Notes (Optional)"
            value={note}
            onChangeText={setNote}
            leftIcon={<FileText size={20} color={colors.text.muted} />}
          />
        </View>

        <View style={styles.actions}>
          <Button
            title="Add Contribution"
            onPress={() => void handleSave()}
            fullWidth
            size="lg"
            variant="primary"
            loading={isLoading}
            disabled={!amount}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    paddingBottom: 8,
    minWidth: 200,
    justifyContent: 'center',
  },
  amountInput: {
    padding: 0,
    margin: 0,
    minWidth: 100,
  },
  formSection: {
    marginBottom: 40,
  },
  inputSpacing: {
    height: 24,
  },
  actions: {
    marginTop: 'auto',
  },
});
