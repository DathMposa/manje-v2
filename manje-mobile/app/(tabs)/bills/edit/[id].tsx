import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, FileText } from 'lucide-react-native';
import { useTheme } from '../../../../src/hooks';
import { ScreenHeader } from '../../../../src/components/common/ScreenHeader';
import { Button } from '../../../../src/components/common/Button';
import { Input } from '../../../../src/components/common/Input';
import { ClayCard } from '../../../../src/components/common/ClayCard';
import { useBillStore } from '../../../../src/stores';

export default function EditBillScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const bill = useBillStore((state) => state.getBill(String(id)));
  const updateBill = useBillStore((state) => state.updateBill);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Monthly');
  const [reminders, setReminders] = useState(true);
  const [nextDueDate, setNextDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!bill) {
      return;
    }

    setName(bill.name);
    setAmount(String(bill.amount));
    setFrequency(bill.frequency);
    setReminders(bill.remindersEnabled);
    setNextDueDate(bill.nextDueDate.slice(0, 10));
  }, [bill]);

  const handleSave = async () => {
    if (!bill) {
      return;
    }

    setIsLoading(true);
    await updateBill(bill.id, {
      name,
      amount: Number(amount),
      frequency,
      nextDueDate: new Date(nextDueDate).toISOString(),
      remindersEnabled: reminders,
    });
    setIsLoading(false);
    router.replace(`/(tabs)/bills/${bill.id}`);
  };

  if (!bill) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background.base }}>
        <ScreenHeader title="Edit Bill" showBack onBackPress={() => router.back()} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background.base }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title="Edit Bill" showBack onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['4xl'] }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.formSection}>
          <Input label="Bill Name" value={name} onChangeText={setName} leftIcon={<FileText size={20} color={colors.text.muted} />} />

          <View style={styles.inputSpacing} />

          <Input label="Amount (MK)" value={amount} onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ''))} keyboardType="numeric" placeholder="0" />

          <View style={styles.inputSpacing} />

          <Input
            label="Next Due Date (YYYY-MM-DD)"
            value={nextDueDate}
            onChangeText={setNextDueDate}
            leftIcon={<Calendar size={20} color={colors.text.muted} />}
            placeholder="2026-05-15"
          />

          <View style={styles.inputSpacing} />

          <Text style={[typography.label.medium, { color: colors.text.secondary, marginBottom: spacing.xs, marginLeft: spacing.xs }]}>Frequency</Text>
          <View style={styles.frequencyChips}>
            {(['Weekly', 'Monthly', 'Yearly'] as const).map((value) => (
              <Button key={value} title={value} onPress={() => setFrequency(value)} variant={frequency === value ? 'primary' : 'secondary'} style={styles.frequencyButton} />
            ))}
          </View>
        </View>

        <ClayCard variant="subtle" style={styles.remindersCard}>
          <View style={styles.switchContainer}>
            <View>
              <Text style={[typography.headline.small, { color: colors.text.primary, marginBottom: 4 }]}>Reminders</Text>
              <Text style={[typography.body.medium, { color: colors.text.secondary }]}>Keep reminders enabled for this bill.</Text>
            </View>
            <Switch value={reminders} onValueChange={setReminders} trackColor={{ false: colors.border.medium, true: colors.primary.base }} thumbColor={colors.text.inverse} />
          </View>
        </ClayCard>

        <View style={styles.actions}>
          <Button title="Save Changes" onPress={() => void handleSave()} fullWidth size="lg" variant="primary" loading={isLoading} disabled={!name.trim() || !amount || !nextDueDate.trim()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  formSection: {
    marginBottom: 24,
  },
  inputSpacing: {
    height: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  frequencyChips: {
    flexDirection: 'row',
    gap: 12,
  },
  frequencyButton: {
    flex: 1,
  },
  remindersCard: {
    padding: 16,
    marginBottom: 32,
  },
  actions: {
    marginTop: 'auto',
  },
});
