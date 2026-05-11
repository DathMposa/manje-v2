import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Clock, Zap, Home, Shield, Check, FileText } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { ClayCard } from '../../../src/components/common/ClayCard';
import { formatBillDueDateLabel, useBillStore } from '../../../src/stores';

const getBillIcon = (name: string) => {
  if (/escom|electric|utility|power/i.test(name)) return Zap;
  if (/rent|house|home|mortgage/i.test(name)) return Home;
  if (/insurance|cover|shield/i.test(name)) return Shield;
  return FileText;
};

export default function BillsListScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const bills = useBillStore((state) => state.bills);
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'paid'>('all');

  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'paid') return bill.status === 'paid';
      return bill.status === 'upcoming' || bill.status === 'urgent';
    });
  }, [activeFilter, bills]);

  const dueThisMonth = bills
    .filter((bill) => {
      const dueDate = new Date(bill.nextDueDate);
      const now = new Date();
      return dueDate.getMonth() === now.getMonth() && dueDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, bill) => sum + bill.amount, 0);

  const getStatusColor = (status: string) => {
    if (status === 'urgent') return colors.status.danger.base;
    if (status === 'upcoming') return colors.status.warning.base;
    if (status === 'paid') return colors.status.success.base;
    return colors.text.muted;
  };

  const getStatusBgColor = (status: string) => {
    if (status === 'urgent') return colors.status.danger.bg;
    if (status === 'upcoming') return colors.status.warning.bg;
    if (status === 'paid') return colors.status.success.bg;
    return colors.background.sunken;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScreenHeader
        title="Bills & Subscriptions"
        rightAction={
          <TouchableOpacity onPress={() => router.push('/(tabs)/bills/create')} style={styles.headerButton}>
            <Plus size={24} color={colors.primary.base} />
          </TouchableOpacity>
        }
      />

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.xl }}>
          {(['all', 'upcoming', 'paid'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                {
                  backgroundColor: activeFilter === filter ? colors.primary.base : colors.background.card,
                  borderColor: activeFilter === filter ? colors.primary.base : colors.border.medium,
                },
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  typography.label.medium,
                  {
                    color: activeFilter === filter ? colors.text.inverse : colors.text.secondary,
                    textTransform: 'capitalize',
                  },
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['4xl'] }} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={[typography.label.medium, { color: colors.text.secondary, marginBottom: 4 }]}>Due this month</Text>
          <Text style={[typography.display.medium, { color: colors.text.primary }]}>MK {dueThisMonth.toLocaleString()}</Text>
        </View>

        {filteredBills.length === 0 ? (
          <ClayCard variant="subtle" style={styles.emptyCard}>
            <Text style={[typography.headline.small, { color: colors.text.primary, marginBottom: 8 }]}>
              No live bills yet
            </Text>
            <Text style={[typography.body.medium, { color: colors.text.secondary }]}>
              Add your first bill to start tracking upcoming payments.
            </Text>
          </ClayCard>
        ) : (
          <View style={styles.billsList}>
            {filteredBills.map((bill) => {
              const Icon = getBillIcon(bill.name);
              const isPaid = bill.status === 'paid';
              const dueLabel = formatBillDueDateLabel(bill.nextDueDate);

              return (
                <TouchableOpacity key={bill.id} activeOpacity={0.7} onPress={() => router.push(`/(tabs)/bills/${bill.id}`)}>
                  <ClayCard variant="subtle" style={styles.billCard}>
                    <View style={styles.billCardContent}>
                      <View
                        style={[
                          styles.iconContainer,
                          { backgroundColor: isPaid ? colors.status.success.bg : `${colors.primary.base}20` },
                        ]}
                      >
                        {isPaid ? <Check size={24} color={colors.status.success.text} /> : <Icon size={24} color={colors.primary.base} />}
                      </View>

                      <View style={styles.billInfo}>
                        <Text style={[typography.headline.small, { color: colors.text.primary, marginBottom: 2 }]}>{bill.name}</Text>
                        <View style={styles.statusRow}>
                          <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(bill.status) }]}>
                            <Clock size={12} color={getStatusColor(bill.status)} style={{ marginRight: 4 }} />
                            <Text style={[typography.label.small, { color: getStatusColor(bill.status) }]}>{isPaid ? 'Paid' : dueLabel}</Text>
                          </View>
                          <Text style={[typography.label.small, { color: colors.text.muted, marginLeft: 8 }]}>{bill.frequency}</Text>
                        </View>
                      </View>

                      <View style={styles.billAmounts}>
                        <Text style={[typography.headline.small, { color: colors.text.primary }]}>MK {bill.amount.toLocaleString()}</Text>
                        {!isPaid && (
                          <TouchableOpacity
                            style={[styles.payButton, { backgroundColor: `${colors.primary.base}20` }]}
                            onPress={() => router.push(`/(tabs)/bills/pay/${bill.id}`)}
                          >
                            <Text style={[typography.label.small, { color: colors.primary.base }]}>Mark Paid</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </ClayCard>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    padding: 8,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  summaryCard: {
    padding: 20,
    backgroundColor: '#36B37E15',
    borderRadius: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  emptyCard: {
    padding: 20,
  },
  billsList: {
    gap: 16,
  },
  billCard: {
    padding: 16,
  },
  billCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  billInfo: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  billAmounts: {
    alignItems: 'flex-end',
  },
  payButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
});
