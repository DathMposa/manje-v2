import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ShoppingBag, Edit2, Trash2, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { ClayCard } from '../../../src/components/common/ClayCard';
import { Button } from '../../../src/components/common/Button';
import { useBudgetStore, useTransactionStore } from '../../../src/stores';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const transaction = useTransactionStore((state) => state.transactions.find((item) => item.id === String(id)));
  const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);
  const recalculateSpending = useBudgetStore((state) => state.recalculateSpending);

  if (!transaction) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.base }]}>
        <ScreenHeader title="Transaction Details" showBack onBackPress={() => router.back()} />
        <View style={styles.emptyState}>
          <Text style={[typography.headline.medium, { color: colors.text.primary }]}>Transaction not found</Text>
        </View>
      </View>
    );
  }

  const isIncome = transaction.type === 'income';
  const amountPrefix = isIncome ? '+' : transaction.type === 'expense' ? '-' : '';
  const amountColor = isIncome ? colors.status.success.text : colors.text.primary;

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTransaction(transaction.id);
            recalculateSpending(useTransactionStore.getState().transactions);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScreenHeader
        title="Transaction Details"
        showBack
        onBackPress={() => router.back()}
        rightAction={
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/(tabs)/transactions/edit/[id]',
                params: { id: transaction.id },
              })
            }
            style={styles.editButton}
          >
            <Edit2 size={20} color={colors.text.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={{ padding: spacing.xl }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${colors.category[transaction.category as keyof typeof colors.category] || colors.category.other}20` }]}>
            <ShoppingBag size={32} color={colors.category[transaction.category as keyof typeof colors.category] || colors.category.other} />
          </View>

          <Text
            style={[
              typography.financial.large,
              { color: amountColor, marginTop: spacing.lg, marginBottom: spacing.xs },
            ]}
          >
            {amountPrefix} MK {transaction.amount.toLocaleString()}
          </Text>
          <Text style={[typography.body.large, { color: colors.text.secondary }]}>{transaction.title}</Text>
        </View>

        <ClayCard variant="subtle" style={styles.card}>
          <View style={styles.detailRow}>
            <Text style={[typography.body.medium, { color: colors.text.muted }]}>Status</Text>
            <View style={[styles.statusBadge, { backgroundColor: colors.status.success.bg }]}>
              <Text style={[typography.label.small, { color: colors.status.success.text }]}>Saved</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

          <View style={styles.detailRow}>
            <Text style={[typography.body.medium, { color: colors.text.muted }]}>Category</Text>
            <Text style={[typography.body.medium, { color: colors.text.primary }]}>
              {transaction.category}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

          <View style={styles.detailRow}>
            <Text style={[typography.body.medium, { color: colors.text.muted }]}>Date</Text>
            <Text style={[typography.body.medium, { color: colors.text.primary }]}>
              {new Date(transaction.date).toLocaleString()}
            </Text>
          </View>

          {transaction.note ? (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border.light }]} />
              <View style={styles.detailRow}>
                <Text style={[typography.body.medium, { color: colors.text.muted }]}>Notes</Text>
                <Text style={[typography.body.medium, { color: colors.text.primary, flex: 1, textAlign: 'right' }]}>
                  {transaction.note}
                </Text>
              </View>
            </>
          ) : null}
        </ClayCard>

        <View style={styles.actions}>
          <Button
            title="Edit Transaction"
            onPress={() =>
              router.push({
                pathname: '/(tabs)/transactions/edit/[id]',
                params: { id: transaction.id },
              })
            }
            fullWidth
            size="lg"
            variant="outline"
            icon={<Edit2 size={20} color={colors.primary.base} />}
          />

          <View style={styles.actionSpacing} />

          <Button
            title="Delete Transaction"
            onPress={handleDelete}
            fullWidth
            size="lg"
            variant="ghost"
            icon={<Trash2 size={20} color={colors.status.danger.text} />}
            textStyle={{ color: colors.status.danger.text }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    padding: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  actions: {
    marginTop: 32,
  },
  actionSpacing: {
    height: 16,
  },
});
