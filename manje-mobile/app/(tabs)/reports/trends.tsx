import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { ClayCard } from '../../../src/components/common/ClayCard';
import { buildSpendingTrends } from '../../../src/lib/reports';
import { useTransactionStore } from '../../../src/stores';

export default function SpendingTrendsScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const transactions = useTransactionStore((state) => state.transactions);
  const report = buildSpendingTrends(transactions);
  const maxAmount = Math.max(1, ...report.trends.map((item) => Math.max(item.spent, item.income)));
  const chartHeight = 200;

  return (
    <View style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScreenHeader title="Spending Trends" showBack onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['4xl'] }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${colors.primary.base}20` }]}>
            <Activity size={32} color={colors.primary.base} />
          </View>
          <Text style={[typography.headline.medium, { color: colors.text.primary, marginTop: spacing.lg, textAlign: 'center' }]}>
            6-Month Overview
          </Text>
        </View>

        <ClayCard variant="subtle" style={styles.chartCard}>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.status.success.base }]} />
              <Text style={[typography.label.medium, { color: colors.text.secondary }]}>Income</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primary.base }]} />
              <Text style={[typography.label.medium, { color: colors.text.secondary }]}>Expenses</Text>
            </View>
          </View>

          <View style={[styles.chartContainer, { height: chartHeight }]}>
            {report.trends.map((data) => {
              const incomeHeight = (data.income / maxAmount) * chartHeight;
              const spentHeight = (data.spent / maxAmount) * chartHeight;

              return (
                <View key={data.month} style={styles.barGroup}>
                  <View style={styles.bars}>
                    <View style={[styles.bar, { height: incomeHeight, backgroundColor: colors.status.success.base }]} />
                    <View style={[styles.bar, { height: spentHeight, backgroundColor: colors.primary.base, marginLeft: 4 }]} />
                  </View>
                  <Text style={[typography.label.small, { color: colors.text.muted, marginTop: 8 }]}>{data.month}</Text>
                </View>
              );
            })}
          </View>
        </ClayCard>

        <Text style={[typography.headline.small, { color: colors.text.primary, marginTop: spacing['2xl'], marginBottom: spacing.md }]}>
          Month over Month
        </Text>

        <ClayCard variant="subtle" style={styles.statsCard}>
          <View style={styles.statRow}>
            <View>
              <Text style={[typography.label.medium, { color: colors.text.muted, marginBottom: 4 }]}>Average Monthly Spend</Text>
              <Text style={[typography.headline.small, { color: colors.text.primary }]}>MK {Math.round(report.averageSpent).toLocaleString()}</Text>
            </View>
            <View style={[styles.trendBadge, { backgroundColor: report.spendingChange > 0 ? colors.status.danger.bg : colors.status.success.bg }]}>
              {report.spendingChange > 0 ? (
                <ArrowUpRight size={16} color={colors.status.danger.text} style={{ marginRight: 4 }} />
              ) : (
                <ArrowDownRight size={16} color={colors.status.success.text} style={{ marginRight: 4 }} />
              )}
              <Text style={[typography.label.small, { color: report.spendingChange > 0 ? colors.status.danger.text : colors.status.success.text }]}>
                {report.spendingChange >= 0 ? '+' : ''}{report.spendingChange}%
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

          <View style={styles.statRow}>
            <View>
              <Text style={[typography.label.medium, { color: colors.text.muted, marginBottom: 4 }]}>Average Monthly Savings</Text>
              <Text style={[typography.headline.small, { color: colors.text.primary }]}>MK {Math.round(report.averageSavings).toLocaleString()}</Text>
            </View>
            <View style={[styles.trendBadge, { backgroundColor: report.savingsChange < 0 ? colors.status.warning.bg : colors.status.success.bg }]}>
              {report.savingsChange < 0 ? (
                <ArrowDownRight size={16} color={colors.status.warning.text} style={{ marginRight: 4 }} />
              ) : (
                <ArrowUpRight size={16} color={colors.status.success.text} style={{ marginRight: 4 }} />
              )}
              <Text style={[typography.label.small, { color: report.savingsChange < 0 ? colors.status.warning.text : colors.status.success.text }]}>
                {report.savingsChange >= 0 ? '+' : ''}{report.savingsChange}%
              </Text>
            </View>
          </View>
        </ClayCard>
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
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartCard: {
    padding: 20,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
  },
  barGroup: {
    alignItems: 'center',
    width: 40,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
  },
  bar: {
    width: 12,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  statsCard: {
    padding: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 12,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
