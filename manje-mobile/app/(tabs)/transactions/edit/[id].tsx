import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, FileText } from 'lucide-react-native';
import { useTheme } from '../../../../src/hooks';
import { ScreenHeader } from '../../../../src/components/common/ScreenHeader';
import { Button } from '../../../../src/components/common/Button';
import { Input } from '../../../../src/components/common/Input';
import { useBudgetStore, useTransactionStore } from '../../../../src/stores';

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const transaction = useTransactionStore((state) => state.transactions.find((item) => item.id === String(id)));
  const updateTransaction = useTransactionStore((state) => state.updateTransaction);
  const recalculateSpending = useBudgetStore((state) => state.recalculateSpending);

  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: '',
    note: '',
    type: 'expense',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setForm({
        title: transaction.title,
        amount: String(transaction.amount),
        category: transaction.category,
        note: transaction.note || '',
        type: transaction.type,
      });
    }
  }, [transaction]);

  if (!transaction) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background.base }}>
        <ScreenHeader title="Edit Transaction" showBack onBackPress={() => router.back()} />
      </View>
    );
  }

  const handleSave = async () => {
    setIsLoading(true);
    await updateTransaction(transaction.id, {
      title: form.title,
      amount: Number(form.amount),
      note: form.note,
    });
    recalculateSpending(useTransactionStore.getState().transactions);
    setIsLoading(false);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background.base }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title="Edit Transaction" showBack onBackPress={() => router.back()} />

      <ScrollView
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['4xl'] }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.amountContainer}>
          <Text style={[typography.headline.small, { color: colors.text.secondary, marginBottom: spacing.sm }]}>
            Amount
          </Text>
          <View style={[styles.amountInputWrapper, { borderBottomColor: colors.border.medium }]}>
            <Text style={[typography.financial.large, { color: colors.text.primary, marginRight: spacing.xs }]}>MK</Text>
            <TextInput
              style={[
                styles.amountInput,
                typography.financial.large,
                { color: form.type === 'income' ? colors.status.success.text : colors.text.primary },
              ]}
              value={form.amount}
              onChangeText={(text) => setForm({ ...form, amount: text.replace(/[^0-9]/g, '') })}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.text.muted}
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Input
            label={form.type === 'income' ? 'Source' : 'Merchant'}
            value={form.title}
            onChangeText={(text) => setForm({ ...form, title: text })}
          />

          <View style={styles.inputSpacing} />

          <Text style={[typography.label.medium, { color: colors.text.secondary, marginBottom: spacing.xs, marginLeft: spacing.xs }]}>
            Category
          </Text>
          <TouchableOpacity
            style={[styles.selector, { borderColor: colors.border.medium, backgroundColor: colors.background.card }]}
            activeOpacity={0.7}
          >
            <View style={styles.selectorContent}>
              <View style={[styles.categoryDot, { backgroundColor: colors.category[form.category as keyof typeof colors.category] || colors.category.other }]} />
              <Text style={[typography.body.large, { color: colors.text.primary }]}>{form.category}</Text>
            </View>
            <ArrowLeft size={20} color={colors.text.muted} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>

          <View style={styles.inputSpacing} />

          <Text style={[typography.label.medium, { color: colors.text.secondary, marginBottom: spacing.xs, marginLeft: spacing.xs }]}>
            Date
          </Text>
          <TouchableOpacity
            style={[styles.selector, { borderColor: colors.border.medium, backgroundColor: colors.background.card }]}
            activeOpacity={0.7}
          >
            <View style={styles.selectorContent}>
              <Calendar size={20} color={colors.text.muted} style={{ marginRight: spacing.sm }} />
              <Text style={[typography.body.large, { color: colors.text.primary }]}>
                {new Date(transaction.date).toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.inputSpacing} />

          <Input
            label="Notes (Optional)"
            value={form.note}
            onChangeText={(text) => setForm({ ...form, note: text })}
            leftIcon={<FileText size={20} color={colors.text.muted} />}
          />
        </View>

        <View style={styles.actions}>
          <Button
            title="Save Changes"
            onPress={() => void handleSave()}
            fullWidth
            size="lg"
            variant="primary"
            loading={isLoading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  actions: {
    marginTop: 'auto',
  },
});
