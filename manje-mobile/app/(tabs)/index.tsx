/**
 * DASH-01: Dashboard / Home Screen
 * Main dashboard with balance, recent transactions, and quick actions.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useTheme } from '../../src/hooks/useTheme';
import { ClayCard, Button } from '../../src/components/common';
import { ManjeCharacter } from '../../src/components/character';
import { useAuthStore } from '../../src/stores/authStore';
import { typeScale } from '../../src/theme/typography';
import { spacing, layout, radius } from '../../src/theme/spacing';
import { gradients } from '../../src/theme/gradients';
import { categories } from '../../src/theme/colors';

// Mock data for demonstration
const MOCK_TRANSACTIONS = [
  { id: '1', title: 'Shoprite Groceries', category: 'groceries', amount: -12500, date: 'Today' },
  { id: '2', title: 'Airtel Mobile Money', category: 'transfer', amount: 50000, date: 'Today' },
  { id: '3', title: 'Uber Ride', category: 'transport', amount: -3500, date: 'Yesterday' },
  { id: '4', title: 'Netflix Subscription', category: 'entertainment', amount: -8900, date: 'Yesterday' },
];

const QUICK_ACTIONS = [
  { id: 'expense', icon: 'minus-circle', label: 'Expense', color: '#EF4444' },
  { id: 'income', icon: 'plus-circle', label: 'Income', color: '#22C55E' },
  { id: 'transfer', icon: 'repeat', label: 'Transfer', color: '#3B82F6' },
  { id: 'budget', icon: 'pie-chart', label: 'Budget', color: '#8B5CF6' },
];

export default function DashboardScreen() {
  const { colors, shadow, isDark } = useTheme();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [balance] = useState(245680);
  const [monthlySpent] = useState(87500);
  const [monthlyBudget] = useState(150000);
  
  const currencySymbol = 'MK';
  const budgetPercentage = (monthlySpent / monthlyBudget) * 100;
  
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };
  
  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    if (absAmount >= 1000000) {
      return `${(absAmount / 1000000).toFixed(1)}M`;
    }
    if (absAmount >= 1000) {
      return `${(absAmount / 1000).toFixed(0)}K`;
    }
    return absAmount.toLocaleString();
  };
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };
  
  const firstName = user?.displayName?.split(' ')[0] || 'there';
  
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
            tintColor={colors.primary.main}
            colors={[colors.primary.main]}
          />
        }
      >
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.header}
        >
          <View style={styles.headerLeft}>
            <Text style={[styles.greeting, typeScale.bodyMedium, { color: colors.text.secondary }]}>
              {getGreeting()},
            </Text>
            <Text style={[styles.userName, typeScale.headlineLarge, { color: colors.text.primary }]}>
              {firstName} 👋
            </Text>
          </View>
          <Pressable 
            style={[styles.notificationButton, { backgroundColor: colors.bg.card }, shadow('sm')]}
            onPress={() => {}}
          >
            <Feather name="bell" size={22} color={colors.text.primary} />
            <View style={[styles.notificationBadge, { backgroundColor: colors.status.danger }]} />
          </Pressable>
        </Animated.View>
        
        {/* Balance Card (Hero) */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <ClayCard variant="hero" style={styles.balanceCard}>
            <View style={styles.balanceContent}>
              <View style={styles.balanceHeader}>
                <Text style={[styles.balanceLabel, typeScale.labelMedium, { color: 'rgba(255,255,255,0.8)' }]}>
                  Total Balance
                </Text>
                <Pressable>
                  <Feather name="eye" size={20} color="rgba(255,255,255,0.8)" />
                </Pressable>
              </View>
              
              <View style={styles.balanceRow}>
                <Text style={[styles.currencySymbol, typeScale.headlineLarge, { color: 'rgba(255,255,255,0.9)' }]}>
                  {currencySymbol}
                </Text>
                <Text style={[styles.balanceAmount, typeScale.heroMetric, { color: '#FFFFFF' }]}>
                  {formatCurrency(balance)}
                </Text>
              </View>
              
              {/* Monthly Progress */}
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={[typeScale.labelSmall, { color: 'rgba(255,255,255,0.7)' }]}>
                    Monthly Spending
                  </Text>
                  <Text style={[typeScale.labelSmall, { color: 'rgba(255,255,255,0.9)' }]}>
                    {currencySymbol} {formatCurrency(monthlySpent)} / {formatCurrency(monthlyBudget)}
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${Math.min(budgetPercentage, 100)}%`,
                        backgroundColor: budgetPercentage > 80 ? '#FBBF24' : '#FFFFFF',
                      }
                    ]} 
                  />
                </View>
              </View>
              
              {/* Character peek */}
              <View style={styles.characterPeek}>
                <ManjeCharacter mood="happy" size="sm" />
              </View>
            </View>
          </ClayCard>
        </Animated.View>
        
        {/* Quick Actions */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, typeScale.headlineSmall, { color: colors.text.primary }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActions}>
            {QUICK_ACTIONS.map((action, index) => (
              <Animated.View 
                key={action.id}
                entering={FadeInRight.delay(350 + index * 50).duration(300)}
              >
                <Pressable 
                  style={[styles.quickActionItem, { backgroundColor: colors.bg.card }, shadow('sm')]}
                  onPress={() => router.push('/(tabs)/quick-add')}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}15` }]}>
                    <Feather name={action.icon as any} size={22} color={action.color} />
                  </View>
                  <Text style={[styles.quickActionLabel, typeScale.labelSmall, { color: colors.text.secondary }]}>
                    {action.label}
                  </Text>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
        
        {/* Recent Transactions */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(400)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, typeScale.headlineSmall, { color: colors.text.primary }]}>
              Recent Transactions
            </Text>
            <Pressable onPress={() => router.push('/(tabs)/activity')}>
              <Text style={[typeScale.labelMedium, { color: colors.primary.main }]}>
                See All
              </Text>
            </Pressable>
          </View>
          
          <ClayCard variant="clay" innerStyle={styles.transactionsCard}>
            {MOCK_TRANSACTIONS.map((transaction, index) => (
              <Animated.View 
                key={transaction.id}
                entering={FadeInRight.delay(450 + index * 50).duration(300)}
              >
                <Pressable style={styles.transactionItem}>
                  <View 
                    style={[
                      styles.transactionIcon, 
                      { backgroundColor: `${categories[transaction.category as keyof typeof categories]}20` }
                    ]}
                  >
                    <Feather 
                      name={getTransactionIcon(transaction.category)} 
                      size={18} 
                      color={categories[transaction.category as keyof typeof categories]} 
                    />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={[styles.transactionTitle, typeScale.labelLarge, { color: colors.text.primary }]}>
                      {transaction.title}
                    </Text>
                    <Text style={[typeScale.bodySmall, { color: colors.text.muted }]}>
                      {transaction.date}
                    </Text>
                  </View>
                  <Text 
                    style={[
                      styles.transactionAmount, 
                      typeScale.labelLarge, 
                      { color: transaction.amount > 0 ? colors.status.success : colors.text.primary }
                    ]}
                  >
                    {transaction.amount > 0 ? '+' : ''}{currencySymbol} {formatCurrency(transaction.amount)}
                  </Text>
                </Pressable>
                {index < MOCK_TRANSACTIONS.length - 1 && (
                  <View style={[styles.transactionDivider, { backgroundColor: colors.border.light }]} />
                )}
              </Animated.View>
            ))}
          </ClayCard>
        </Animated.View>
        
        {/* AI Insight Card */}
        <Animated.View 
          entering={FadeInDown.delay(500).duration(400)}
          style={styles.section}
        >
          <ClayCard variant="subtle" style={{ backgroundColor: colors.primary.light }}>
            <View style={styles.insightContent}>
              <ManjeCharacter mood="encourage" size="sm" />
              <View style={styles.insightText}>
                <Text style={[typeScale.labelLarge, { color: colors.primary.main }]}>
                  💡 Spending Insight
                </Text>
                <Text style={[typeScale.bodySmall, { color: colors.text.secondary, marginTop: 4 }]}>
                  You've spent 15% less on groceries this week compared to last week. Keep it up!
                </Text>
              </View>
            </View>
          </ClayCard>
        </Animated.View>
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
    income: 'trending-up',
    transfer: 'repeat',
    other: 'more-horizontal',
  };
  return icons[category] || 'circle';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: spacing[8],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[4],
    marginBottom: spacing[5],
  },
  headerLeft: {},
  greeting: {},
  userName: {
    marginTop: 2,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  balanceCard: {
    marginBottom: spacing[5],
  },
  balanceContent: {
    padding: spacing[2],
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  balanceLabel: {},
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currencySymbol: {
    marginRight: spacing[2],
  },
  balanceAmount: {},
  progressSection: {
    marginTop: spacing[4],
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  characterPeek: {
    position: 'absolute',
    right: -spacing[2],
    bottom: -spacing[4],
    opacity: 0.9,
  },
  section: {
    marginBottom: spacing[5],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  sectionTitle: {
    marginBottom: spacing[3],
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: radius.xl,
    width: 76,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  quickActionLabel: {},
  transactionsCard: {
    padding: 0,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[1],
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {},
  transactionAmount: {},
  transactionDivider: {
    height: 1,
    marginLeft: 52,
  },
  insightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightText: {
    flex: 1,
    marginLeft: spacing[3],
  },
});
