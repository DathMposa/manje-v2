/**
 * DASH-01: Dashboard / Home Screen
 * Main dashboard with balance, recent transactions, and quick actions.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../src/hooks/useTheme';
import { ClayCard } from '../../src/components/common';
import { ManjeCharacter } from '../../src/components/character';
import { useAuthStore, useBudgetStore, useGoalStore, useTransactionStore } from '../../src/stores';
import { typeScale } from '../../src/theme/typography';
import { spacing, layout, radius } from '../../src/theme/spacing';
import { categoryColors } from '../../src/theme/colors';

const isSameMonth = (date: string) => {
  const target = new Date(date);
  const now = new Date();
  return target.getMonth() === now.getMonth() && target.getFullYear() === now.getFullYear();
};

export default function DashboardScreen() {
  const { colors, shadow } = useTheme();
  const router = useRouter();
  const { user } = useAuthStore();
  const transactions = useTransactionStore((state) => state.transactions);
  const budgets = useBudgetStore((state) => state.budgets);
  const goals = useGoalStore((state) => state.goals);
  const recalculateSpending = useBudgetStore((state) => state.recalculateSpending);

  const [refreshing, setRefreshing] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Track initial mount - animations only run on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    recalculateSpending(transactions);
  }, [transactions, recalculateSpending]);

  const primaryBudget = useMemo(
    () => budgets.find((b) => b.isPrimary) ?? budgets[0],
    [budgets]
  );

  const monthlyTransactions = useMemo(
    () => transactions.filter((transaction) => isSameMonth(transaction.date)),
    [transactions]
  );

  const monthlyIncome = useMemo(
    () => monthlyTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    [monthlyTransactions]
  );

  const monthlySpent = useMemo(
    () => monthlyTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    [monthlyTransactions]
  );

  const availableToSpend = useMemo(
    () =>
      primaryBudget
        ? Math.max(primaryBudget.totalLimit - primaryBudget.totalSpent, 0)
        : Math.max(monthlyIncome - monthlySpent, 0),
    [primaryBudget, monthlyIncome, monthlySpent]
  );

  const topGoal = useMemo(() => goals[0], [goals]);
  const recentTransactions = useMemo(() => transactions.slice(0, 4), [transactions]);

  const attentionCategories = useMemo(
    () =>
      primaryBudget?.categories.filter((c) => c.limit > 0 && c.spent / c.limit >= 0.75) ?? [],
    [primaryBudget]
  );

  const isEmptyState = useMemo(
    () => !transactions.length && !budgets.length && !goals.length,
    [transactions.length, budgets.length, goals.length]
  );
  const currencySymbol = 'MK';

  const onRefresh = async () => {
    setRefreshing(true);
    recalculateSpending(useTransactionStore.getState().transactions);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toLocaleString();
  };

  const renderTopArea = () => (
    <Animated.View entering={isInitialLoad ? FadeInDown.delay(100).duration(400) : undefined} style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={[styles.greeting, typeScale['headline.md'], { color: colors.text.secondary }]}>
          Hello,
        </Text>
        <Text style={[styles.nameText, typeScale['headline.lg'], { color: colors.text.primary, marginTop: 2 }]}>
          {user?.displayName || 'there'}!
        </Text>
      </View>
      <View style={styles.headerRight}>
        <Pressable
          style={[styles.notificationButton, { backgroundColor: colors.bg.card }, shadow('sm')]}
          onPress={() => router.push('/(tabs)/notifications/index')}
        >
          <Feather name="bell" size={22} color={colors.text.primary} />
          {!!attentionCategories.length && (
            <View style={[styles.notificationBadge, { backgroundColor: colors.status.warning.base }]} />
          )}
        </Pressable>
      </View>
    </Animated.View>
  );

  const renderHeroArea = () => (
    <Animated.View entering={isInitialLoad ? FadeInDown.delay(200).duration(400) : undefined}>
      <ClayCard variant="hero" style={styles.balanceCard}>
        <View style={styles.balanceContent}>
          <Text style={[styles.balanceLabel, typeScale['label.lg'], { color: 'rgba(255,255,255,0.8)' }]}>
            Available to Spend
          </Text>

          <View style={styles.balanceRow}>
            <Text style={[styles.currencySymbol, typeScale['headline.lg'], { color: 'rgba(255,255,255,0.9)' }]}>
              {currencySymbol}
            </Text>
            <Text style={[styles.balanceAmount, typeScale['financial.hero'], { color: '#FFFFFF' }]}>
              {formatCurrency(availableToSpend)}
            </Text>
          </View>

          <View style={styles.heroMetricsRow}>
            <View style={styles.heroMetric}>
              <Text style={[typeScale['label.sm'], { color: 'rgba(255,255,255,0.7)', marginBottom: 2 }]}>Income</Text>
              <Text style={[typeScale['label.lg'], { color: '#FFFFFF' }]}>{formatCurrency(monthlyIncome)}</Text>
            </View>
            <View style={styles.heroMetricDivider} />
            <View style={styles.heroMetric}>
              <Text style={[typeScale['label.sm'], { color: 'rgba(255,255,255,0.7)', marginBottom: 2 }]}>Spent</Text>
              <Text style={[typeScale['label.lg'], { color: '#FFFFFF' }]}>{formatCurrency(monthlySpent)}</Text>
            </View>
            <View style={styles.heroMetricDivider} />
            <View style={styles.heroMetric}>
              <Text style={[typeScale['label.sm'], { color: 'rgba(255,255,255,0.7)', marginBottom: 2 }]}>Goals</Text>
              <Text style={[typeScale['label.lg'], { color: '#FFFFFF' }]}>{goals.length}</Text>
            </View>
          </View>
        </View>
      </ClayCard>
    </Animated.View>
  );

  const renderInsightArea = () => {
    if (isEmptyState) {
      return null;
    }

    const insightText = primaryBudget
      ? `Your primary budget is ${Math.round((primaryBudget.totalSpent / Math.max(primaryBudget.totalLimit, 1)) * 100)}% used this month.`
      : monthlySpent > 0
        ? `You've logged ${monthlyTransactions.length} transactions this month.`
        : 'Start adding transactions to unlock richer insights.';

    return (
      <Animated.View entering={isInitialLoad ? FadeInDown.delay(250).duration(400) : undefined} style={styles.section}>
        <ClayCard variant="subtle" style={{ backgroundColor: colors.primary.subtle }}>
          <View style={styles.insightContent}>
            <ManjeCharacter mood="happy" size={44} variant="badge" animated={false} />
            <View style={styles.insightTextContainer}>
              <Text style={[typeScale['body.sm'], { color: colors.text.primary }]}>
                {insightText}
              </Text>
            </View>
          </View>
        </ClayCard>
      </Animated.View>
    );
  };

  const renderOverviewArea = () => {
    if (!primaryBudget && !topGoal) {
      return null;
    }

    return (
      <Animated.View entering={isInitialLoad ? FadeInDown.delay(350).duration(400) : undefined} style={styles.section}>
        <Text style={[styles.sectionTitle, typeScale['headline.sm'], { color: colors.text.primary }]}>
          Budget & Goals
        </Text>

        <View style={styles.overviewContainer}>
          {primaryBudget ? (
            <ClayCard variant="clay" noPadding style={styles.overviewCard}>
              <View style={styles.overviewCardHeader}>
                <Text style={[typeScale['label.md'], { color: colors.text.primary }]}>Budget Health</Text>
                <Feather name="pie-chart" size={16} color={colors.text.secondary} />
              </View>

              {primaryBudget.categories.slice(0, 2).map((category, index) => {
                const pct = category.limit ? Math.min((category.spent / category.limit) * 100, 100) : 0;
                const isWarning = pct > 85;
                const trackColor =
                  categoryColors[category.catKey as keyof typeof categoryColors]?.fg || colors.primary.default;

                return (
                  <View key={category.id} style={[styles.budgetPreviewItem, index > 0 && { marginTop: spacing[3] }]}>
                    <View style={styles.budgetPreviewHeader}>
                      <Text style={[typeScale['label.sm'], { color: colors.text.secondary }]}>{category.name}</Text>
                      <Text style={[typeScale['label.sm'], { color: colors.text.primary }]}>{Math.round(pct)}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${pct}%`, backgroundColor: isWarning ? colors.status.warning.base : trackColor },
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </ClayCard>
          ) : null}

          {topGoal ? (
            <ClayCard variant="clay" noPadding style={styles.overviewCard}>
              <View style={styles.overviewCardHeader}>
                <Text style={[typeScale['label.md'], { color: colors.text.primary }]} numberOfLines={1}>
                  {topGoal.name}
                </Text>
                <Feather name="target" size={16} color={colors.text.secondary} />
              </View>

              <View style={styles.goalProgressContainer}>
                <View style={styles.circularProgress}>
                  <View style={[styles.circleOuter, { borderColor: colors.border.light }]}>
                    <View
                      style={[
                        styles.circleInner,
                        {
                          borderLeftColor: colors.status.success.base,
                          borderTopColor: colors.status.success.base,
                        },
                      ]}
                    />
                    <Text style={[typeScale['label.md'], { color: colors.text.primary }]}>
                      {Math.round((topGoal.currentAmount / Math.max(topGoal.targetAmount, 1)) * 100)}%
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    typeScale['label.sm'],
                    { color: colors.text.secondary, marginTop: spacing[2], textAlign: 'center' },
                  ]}
                >
                  {currencySymbol} {formatCurrency(topGoal.currentAmount)} / {formatCurrency(topGoal.targetAmount)}
                </Text>
              </View>
            </ClayCard>
          ) : null}
        </View>
      </Animated.View>
    );
  };

  const renderReferenceArea = () => {
    if (!recentTransactions.length && !attentionCategories.length) {
      return null;
    }

    return (
      <View>
        {!!attentionCategories.length && (
          <Animated.View entering={isInitialLoad ? FadeInDown.delay(400).duration(400) : undefined} style={styles.section}>
            <Text style={[styles.sectionTitle, typeScale['headline.sm'], { color: colors.text.primary }]}>
              Needs Attention
            </Text>
            <ClayCard variant="clay" noPadding innerStyle={styles.listCard}>
              {attentionCategories.slice(0, 3).map((category, index) => {
                const pct = Math.round((category.spent / Math.max(category.limit, 1)) * 100);
                return (
                  <View key={category.id}>
                    <Pressable style={styles.listItem}>
                      <View style={[styles.listIcon, { backgroundColor: colors.status.warning.bg }]}>
                        <Feather name="alert-circle" size={18} color={colors.status.warning.text} />
                      </View>
                      <View style={styles.listInfo}>
                        <Text style={[typeScale['label.lg'], { color: colors.text.primary }]}>{category.name}</Text>
                        <Text style={[typeScale['body.sm'], { color: colors.text.secondary }]}>
                          {pct}% of budget used
                        </Text>
                      </View>
                      <Text style={[typeScale['label.lg'], { color: colors.text.primary }]}>
                        {currencySymbol} {formatCurrency(Math.max(category.limit - category.spent, 0))}
                      </Text>
                    </Pressable>
                    {index < attentionCategories.slice(0, 3).length - 1 && (
                      <View style={[styles.listDivider, { backgroundColor: colors.border.light }]} />
                    )}
                  </View>
                );
              })}
            </ClayCard>
          </Animated.View>
        )}

        {!!recentTransactions.length && (
          <Animated.View entering={isInitialLoad ? FadeInDown.delay(450).duration(400) : undefined} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, typeScale['headline.sm'], { color: colors.text.primary, marginBottom: 0 }]}>
                Recent Activity
              </Text>
              <Pressable onPress={() => router.push('/(tabs)/activity')}>
                <Text style={[typeScale['label.md'], { color: colors.primary.default }]}>See All</Text>
              </Pressable>
            </View>
            <ClayCard variant="clay" noPadding innerStyle={styles.listCard}>
              {recentTransactions.map((transaction, index) => {
                const tone =
                  categoryColors[transaction.category as keyof typeof categoryColors] || categoryColors.other;

                return (
                  <View key={transaction.id}>
                    <Pressable
                      style={styles.listItem}
                      onPress={() =>
                        router.push({
                          pathname: '/(tabs)/transactions/[id]',
                          params: { id: transaction.id },
                        })
                      }
                    >
                      <View style={[styles.listIcon, { backgroundColor: `${tone.fg}20` }]}>
                        <Feather name={getTransactionIcon(transaction.category)} size={18} color={tone.fg} />
                      </View>
                      <View style={styles.listInfo}>
                        <Text style={[typeScale['label.lg'], { color: colors.text.primary }]}>{transaction.title}</Text>
                        <Text style={[typeScale['body.sm'], { color: colors.text.secondary }]}>
                          {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </Text>
                      </View>
                      <Text
                        style={[
                          typeScale['label.lg'],
                          {
                            color:
                              transaction.type === 'income' ? colors.status.success.text : colors.text.primary,
                          },
                        ]}
                      >
                        {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                        {currencySymbol} {formatCurrency(transaction.amount)}
                      </Text>
                    </Pressable>
                    {index < recentTransactions.length - 1 && (
                      <View style={[styles.listDivider, { backgroundColor: colors.border.light }]} />
                    )}
                  </View>
                );
              })}
            </ClayCard>
          </Animated.View>
        )}
      </View>
    );
  };

  const renderEmptyStateAction = () => {
    if (!isEmptyState) {
      return null;
    }

    return (
      <Animated.View entering={isInitialLoad ? FadeInDown.delay(400).duration(400) : undefined} style={[styles.section, { alignItems: 'center', marginTop: spacing[8] }]}>
        <ManjeCharacter utility="empty-state" size={180} animated showIdleFloat />
        <Text style={[typeScale['headline.md'], { color: colors.text.primary, marginTop: spacing[4], textAlign: 'center' }]}>
          No activity yet
        </Text>
        <Text
          style={[
            typeScale['body.md'],
            { color: colors.text.secondary, marginTop: spacing[2], textAlign: 'center', maxWidth: '80%' },
          ]}
        >
          Add your first transaction to start seeing your financial picture.
        </Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg.base }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.default}
            colors={[colors.primary.default]}
          />
        }
      >
        {renderTopArea()}
        {renderHeroArea()}
        {renderInsightArea()}
        {renderOverviewArea()}
        {renderReferenceArea()}
        {renderEmptyStateAction()}
      </ScrollView>
    </SafeAreaView>
  );
}

const getTransactionIcon = (category: string): keyof typeof Feather.glyphMap => {
  const icons: Record<string, keyof typeof Feather.glyphMap> = {
    groceries: 'shopping-cart',
    dining: 'coffee',
    transport: 'truck',
    utilities: 'zap',
    entertainment: 'film',
    healthcare: 'heart',
    shopping: 'shopping-bag',
    bills: 'file-text',
    education: 'book',
    salary: 'briefcase',
    freelance: 'edit-3',
    investment: 'trending-up',
    refund: 'rotate-ccw',
    income: 'trending-up',
    transfer: 'repeat',
    other: 'more-horizontal',
  };
  return icons[category] || 'circle';
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: layout.screenPaddingH, paddingBottom: spacing[8] },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: spacing[2], marginBottom: spacing[5] },
  headerLeft: { flex: 1, justifyContent: 'center' },
  headerRight: { justifyContent: 'center', alignItems: 'flex-end', paddingTop: 2 },
  greeting: { marginBottom: 2 },
  nameText: {},
  notificationButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  notificationBadge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4 },
  balanceCard: { marginBottom: spacing[4] },
  balanceContent: { padding: spacing[2] },
  balanceLabel: { marginBottom: spacing[2] },
  balanceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: spacing[4] },
  currencySymbol: { marginRight: spacing[2] },
  balanceAmount: {},
  heroMetricsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', padding: spacing[3], borderRadius: radius.lg },
  heroMetric: { flex: 1, alignItems: 'center' },
  heroMetricDivider: { width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.2)' },
  section: { marginBottom: spacing[6] },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[3] },
  sectionTitle: { marginBottom: spacing[3] },
  insightContent: { flexDirection: 'row', alignItems: 'center' },
  insightTextContainer: { flex: 1, marginLeft: spacing[3] },
  overviewContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing[4] },
  overviewCard: { flex: 1, padding: spacing[4] },
  overviewCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4] },
  budgetPreviewItem: { width: '100%' },
  budgetPreviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[1] },
  progressBarBg: { height: 6, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
  goalProgressContainer: { alignItems: 'center', justifyContent: 'center' },
  circularProgress: { width: 64, height: 64, position: 'relative' },
  circleOuter: { width: '100%', height: '100%', borderRadius: 32, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
  circleInner: { position: 'absolute', width: '100%', height: '100%', borderRadius: 32, borderWidth: 4, borderRightColor: 'transparent', borderBottomColor: 'transparent', transform: [{ rotate: '-45deg' }] },
  listCard: { paddingVertical: spacing[2] },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing[3], paddingHorizontal: spacing[4] },
  listIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: spacing[4] },
  listInfo: { flex: 1 },
  listDivider: { height: 1, marginLeft: 72, marginRight: spacing[4] },
});
