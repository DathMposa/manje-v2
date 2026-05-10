import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Edit2, Zap, Clock, Trash2, FileText, Home, Shield } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { ClayCard } from '../../../src/components/common/ClayCard';
import { Button } from '../../../src/components/common/Button';
import { formatBillDueDateLabel, useBillStore } from '../../../src/stores';

const getBillIcon = (name: string) => {
  if (/escom|electric|utility|power/i.test(name)) return { icon: Zap, color: '#FF5630' };
  if (/rent|house|home|mortgage/i.test(name)) return { icon: Home, color: '#6554C0' };
  if (/insurance|cover|shield/i.test(name)) return { icon: Shield, color: '#36B37E' };
  return { icon: FileText, color: '#00B8D9' };
};

export default function BillDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const bill = useBillStore((state) => state.getBill(String(id)));
  const deleteBill = useBillStore((state) => state.deleteBill);

  if (!bill) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.base }]}>
        <ScreenHeader title="Bill Details" showBack onBackPress={() => router.back()} />
        <View style={styles.emptyState}>
          <Text style={[typography.headline.medium, { color: colors.text.primary }]}>Bill not found</Text>
        </View>
      </View>
    );
  }

  const isPaid = bill.status === 'paid';
  const { icon: Icon, color } = getBillIcon(bill.name);
  const dueLabel = formatBillDueDateLabel(bill.nextDueDate);

  const getStatusColor = (status: string) => {
    if (status === 'urgent') return colors.status.danger.base;
    if (status === 'upcoming') return colors.status.warning.base;
    if (status === 'paid') return colors.status.success.base;
    return colors.text.muted;
  };

  const handleDelete = () => {
    Alert.alert('Delete Bill', 'Are you sure you want to delete this bill? Future reminders will be cancelled.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteBill(bill.id);
          router.replace('/(tabs)/bills');
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScreenHeader
        title="Bill Details"
        showBack
        onBackPress={() => router.back()}
        rightAction={
          <TouchableOpacity onPress={() => router.push(`/(tabs)/bills/edit/${bill.id}`)} style={styles.headerButton}>
            <Edit2 size={20} color={colors.text.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['4xl'] }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
            <Icon size={32} color={color} />
          </View>

          <Text style={[typography.display.medium, { color: colors.text.primary, marginTop: spacing.lg, marginBottom: spacing.xs }]}>
            MK {bill.amount.toLocaleString()}
          </Text>
          <Text style={[typography.body.large, { color: colors.text.secondary }]}>{bill.name}</Text>
        </View>

        <ClayCard variant="subtle" style={styles.infoCard}>
          <View style={styles.detailRow}>
            <Text style={[typography.body.medium, { color: colors.text.muted }]}>Due Date</Text>
            <View style={styles.statusBadge}>
              <Clock size={16} color={getStatusColor(bill.status)} style={{ marginRight: 6 }} />
              <Text style={[typography.label.large, { color: getStatusColor(bill.status) }]}>{isPaid ? 'Paid' : dueLabel}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

          <View style={styles.detailRow}>
            <Text style={[typography.body.medium, { color: colors.text.muted }]}>Next Due</Text>
            <Text style={[typography.body.medium, { color: colors.text.primary }]}>
              {new Date(bill.nextDueDate).toLocaleDateString()}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

          <View style={styles.detailRow}>
            <Text style={[typography.body.medium, { color: colors.text.muted }]}>Frequency</Text>
            <Text style={[typography.body.medium, { color: colors.text.primary }]}>{bill.frequency}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

          <View style={styles.detailRow}>
            <Text style={[typography.body.medium, { color: colors.text.muted }]}>Reminders</Text>
            <Text style={[typography.body.medium, { color: bill.remindersEnabled ? colors.status.success.text : colors.text.muted }]}>
              {bill.remindersEnabled ? 'On' : 'Off'}
            </Text>
          </View>
        </ClayCard>

        {!isPaid && (
          <Button
            title="Mark as Paid"
            onPress={() => router.push(`/(tabs)/bills/pay/${bill.id}`)}
            fullWidth
            size="lg"
            variant="primary"
            style={{ marginBottom: spacing['2xl'] }}
          />
        )}

        <View style={styles.historySection}>
          <Text style={[typography.headline.small, { color: colors.text.primary, marginBottom: spacing.lg }]}>Payment History</Text>

          {bill.paymentHistory.length === 0 ? (
            <Text style={[typography.body.medium, { color: colors.text.secondary }]}>No payments have been recorded yet.</Text>
          ) : (
            bill.paymentHistory.map((history, index) => (
              <View
                key={history.id}
                style={[
                  styles.historyItem,
                  index < bill.paymentHistory.length - 1 && {
                    borderBottomColor: colors.border.light,
                    borderBottomWidth: 1,
                  },
                ]}
              >
                <View style={styles.historyDetails}>
                  <View style={[styles.smallIconContainer, { backgroundColor: colors.background.sunken }]}>
                    <FileText size={16} color={colors.text.secondary} />
                  </View>
                  <View>
                    <Text style={[typography.body.large, { color: colors.text.primary }]}>Paid</Text>
                    <Text style={[typography.label.medium, { color: colors.text.muted }]}>
                      {new Date(history.date).toLocaleDateString()}
                    </Text>
                    {history.note ? (
                      <Text style={[typography.label.medium, { color: colors.text.secondary }]}>{history.note}</Text>
                    ) : null}
                  </View>
                </View>
                <Text style={[typography.headline.small, { color: colors.text.primary }]}>MK {history.amount.toLocaleString()}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.actions}>
          <Button
            title="Delete Bill"
            onPress={handleDelete}
            fullWidth
            variant="ghost"
            icon={<Trash2 size={20} color={colors.status.danger.text} />}
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
  headerButton: {
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    padding: 20,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historySection: {
    marginBottom: 32,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  historyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  smallIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actions: {
    marginTop: 'auto',
  },
});
