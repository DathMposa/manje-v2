import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, FileText } from 'lucide-react-native';
import { useTheme } from '../../../../src/hooks';
import { ScreenHeader } from '../../../../src/components/common/ScreenHeader';
import { Button } from '../../../../src/components/common/Button';
import { Input } from '../../../../src/components/common/Input';
import { ManjeCharacter } from '../../../../src/components/character/ManjeCharacter';
import { useBillStore } from '../../../../src/stores';

export default function MarkBillPaidScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const bill = useBillStore((state) => state.getBill(String(id)));
  const payBill = useBillStore((state) => state.payBill);

  const [amount, setAmount] = useState(bill ? String(bill.amount) : '');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!bill) {
      return;
    }

    setIsLoading(true);
    await payBill(bill.id, {
      amount: Number(amount),
      note,
      date: new Date().toISOString(),
    });
    setIsLoading(false);
    router.replace(`/(tabs)/bills/${bill.id}`);
  };

  if (!bill) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background.base }}>
        <ScreenHeader title="Record Payment" showBack onBackPress={() => router.back()} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background.base }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title="Record Payment" showBack onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['4xl'] }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <ManjeCharacter mood="celebrate" size="md" animated showIdleFloat />
          <Text style={[typography.headline.small, { color: colors.text.secondary, textAlign: 'center', marginTop: spacing.lg }]}>
            Paying {bill.name}
          </Text>
        </View>

        <View style={styles.amountContainer}>
          <View style={[styles.amountInputWrapper, { borderBottomColor: colors.border.medium }]}>
            <Text style={[typography.display.medium, { color: colors.text.primary, marginRight: spacing.xs }]}>MK</Text>
            <TextInput
              style={[styles.amountInput, typography.display.medium, { color: colors.text.primary }]}
              value={amount}
              onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.text.muted}
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Input
            label="Payment Date"
            value={new Date().toLocaleDateString()}
            editable={false}
            leftIcon={<Calendar size={20} color={colors.text.muted} />}
          />

          <View style={styles.inputSpacing} />

          <Input label="Reference / Note (Optional)" value={note} onChangeText={setNote} leftIcon={<FileText size={20} color={colors.text.muted} />} />
        </View>

        <View style={styles.actions}>
          <Button title="Confirm Payment" onPress={() => void handleSave()} fullWidth size="lg" variant="primary" loading={isLoading} disabled={!amount} />
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
