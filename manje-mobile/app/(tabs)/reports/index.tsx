import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { TrendingDown, TrendingUp, AlertCircle, ShoppingBag, Car, Zap, CreditCard, BookOpen } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { ClayCard } from '../../../src/components/common/ClayCard';
import { ManjeCharacter } from '../../../src/components/character/ManjeCharacter';
import { buildWeeklySummary } from '../../../src/lib/reports';
import { useBudgetStore, useTransactionStore } from '../../../src/stores';

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  groceries: ShoppingBag,
  dining: ShoppingBag,
  transport: Car,
  utilities: Zap,
  bills: CreditCard,
  education: BookOpen,
};

const CATEGORY_COLORS: Record<string, string> = {
  groceries: '#00B8D9',
  dining: '#00B8D9',
  transport: '#6554C0',
  utilities: '#FF5630',
  bills: '#FFAB00',
  education: '#36B37E',
};

export default function WeeklyReportScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const transactions = useTransactionStore((state) => state.transactions);
  const budgets = useBudgetStore((state) => state.budgets);
  const report = buildWeeklySummary(transactions, budgets);

  const isPositiveTrend = report.comparison <= 0;
  const TrendIcon = isPositiveTrend ? TrendingDown : TrendingUp;

  return (
    <View style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScreenHeader title="Weekly Summary" showBack onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['4xl'] }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ManjeCharacter mood={isPositiveTrend ? 'celebrate' : 'encourage'} size="lg" animated showIdleFloat />
          <Text style={[typography.label.large, { color: colors.text.muted, marginTop: spacing.md }]}>{report.week}</Text>
        </View>

        <ClayCard variant="hero" style={styles.summaryCard}>
          <Text style={[typography.body.large, { color: 'rgba(255,255,255,0.8)', marginBottom: 8 }]}>Total Spent</Text>
          <Text style={[typography.financial.large, { color: colors.text.inverse, marginBottom: 16 }]}>
            MK {report.totalSpent.toLocaleString()}
          </Text>

          <View style={[styles.trendBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <TrendIcon size={16} color={colors.text.inverse} style={{ marginRight: 6 }} />
            <Text style={[typography.label.medium, { color: colors.text.inverse }]}>
              {Math.abs(report.comparison)}% {isPositiveTrend ? 'less' : 'more'} than last week
            </Text>
          </View>
        </ClayCard>

        {!!report.anomalies.length && (
          <View style={styles.anomalySection}>
            <Text style={[typography.headline.small, { color: colors.text.primary, marginBottom: spacing.md }]}>Insights</Text>
            {report.anomalies.map((anomaly, index) => (
              <View key={`${anomaly.message}-${index}`} style={[styles.anomalyCard, { backgroundColor: colors.status.warning.bg }]}>
                <AlertCircle size={20} color={colors.status.warning.base} style={{ marginRight: 12, marginTop: 2 }} />
                <Text style={[typography.body.medium, { color: colors.text.primary, flex: 1 }]}>{anomaly.message}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={[typography.headline.small, { color: colors.text.primary }]}>Top Categories</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/budgets')}>
              <Text style={[typography.label.medium, { color: colors.primary.base }]}>View Budgets</Text>
            </TouchableOpacity>
          </View>

          {report.categories.length === 0 ? (
            <ClayCard variant="subtle" style={styles.emptyCard}>
              <Text style={[typography.body.medium, { color: colors.text.secondary }]}>
                Add some expense transactions to see weekly category trends here.
              </Text>
            </ClayCard>
          ) : (
            report.categories.map((category) => {
              const Icon = CATEGORY_ICONS[category.categoryKey] ?? ShoppingBag;
              const color = CATEGORY_COLORS[category.categoryKey] ?? colors.primary.base;
              const percentage = Math.min((category.spent / Math.max(category.limit, 1)) * 100, 100);

              return (
                <View key={category.categoryKey} style={styles.categoryItem}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryIconName}>
                      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                        <Icon size={20} color={color} />
                      </View>
                      <Text style={[typography.body.large, { color: colors.text.primary }]}>{category.name}</Text>
                    </View>
                    <View style={styles.categoryAmounts}>
                      <Text style={[typography.headline.small, { color: colors.text.primary }]}>MK {category.spent.toLocaleString()}</Text>
                    </View>
                  </View>
                  <View style={styles.categoryProgressContainer}>
                    <View style={[styles.categoryProgressBar, { backgroundColor: colors.border.light }]}>
                      <View style={[styles.categoryProgressFill, { width: `${percentage}%`, backgroundColor: color }]} />
                    </View>
                  </View>
                </View>
              );
            })
          )}
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
    marginBottom: 24,
  },
  summaryCard: {
    padding: 24,
    marginBottom: 24,
    borderRadius: 24,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  anomalySection: {
    marginBottom: 32,
  },
  anomalyCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  categoriesSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyCard: {
    padding: 16,
  },
  categoryItem: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIconName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryAmounts: {
    alignItems: 'flex-end',
  },
  categoryProgressContainer: {
    width: '100%',
  },
  categoryProgressBar: {
    height: 6,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
