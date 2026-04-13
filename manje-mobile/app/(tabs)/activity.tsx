/**
 * ACT-01: Activity / Transaction History Screen
 * Full transaction list with filtering and search.
 */

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useTheme } from '../../src/hooks/useTheme';
import { ClayCard, ScreenHeader } from '../../src/components/common';
import { typeScale } from '../../src/theme/typography';
import { spacing, layout, radius } from '../../src/theme/spacing';
import { categories } from '../../src/theme/colors';

interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  time: string;
}

// Mock data grouped by date
const MOCK_TRANSACTIONS: { date: string; transactions: Transaction[] }[] = [
  {
    date: 'Today',
    transactions: [
      { id: '1', title: 'Shoprite Groceries', category: 'groceries', amount: -12500, date: 'Today', time: '2:30 PM' },
      { id: '2', title: 'Airtel Mobile Money', category: 'income', amount: 50000, date: 'Today', time: '11:15 AM' },
      { id: '3', title: 'Coffee Shop', category: 'dining', amount: -1500, date: 'Today', time: '9:00 AM' },
    ],
  },
  {
    date: 'Yesterday',
    transactions: [
      { id: '4', title: 'Uber Ride', category: 'transport', amount: -3500, date: 'Yesterday', time: '6:45 PM' },
      { id: '5', title: 'Netflix Subscription', category: 'entertainment', amount: -8900, date: 'Yesterday', time: '12:00 AM' },
    ],
  },
  {
    date: 'March 15',
    transactions: [
      { id: '6', title: 'Electricity Bill', category: 'utilities', amount: -15000, date: 'March 15', time: '3:00 PM' },
      { id: '7', title: 'Pharmacy', category: 'healthcare', amount: -4500, date: 'March 15', time: '10:30 AM' },
      { id: '8', title: 'Salary Deposit', category: 'income', amount: 250000, date: 'March 15', time: '8:00 AM' },
    ],
  },
  {
    date: 'March 14',
    transactions: [
      { id: '9', title: 'Restaurant Dinner', category: 'dining', amount: -12000, date: 'March 14', time: '7:30 PM' },
      { id: '10', title: 'Fuel Station', category: 'transport', amount: -8000, date: 'March 14', time: '5:00 PM' },
    ],
  },
];

type FilterType = 'all' | 'income' | 'expense';

export default function ActivityScreen() {
  const { colors, shadow } = useTheme();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  
  const currencySymbol = 'MK';
  
  const filteredData = useMemo(() => {
    return MOCK_TRANSACTIONS.map(group => ({
      ...group,
      transactions: group.transactions.filter(t => {
        // Filter by type
        if (activeFilter === 'income' && t.amount < 0) return false;
        if (activeFilter === 'expense' && t.amount > 0) return false;
        
        // Filter by search
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          return (
            t.title.toLowerCase().includes(query) ||
            t.category.toLowerCase().includes(query)
          );
        }
        
        return true;
      }),
    })).filter(group => group.transactions.length > 0);
  }, [searchQuery, activeFilter]);
  
  const formatCurrency = (amount: number) => {
    return Math.abs(amount).toLocaleString();
  };
  
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
  
  const renderTransaction = ({ item, index }: { item: Transaction; index: number }) => (
    <Animated.View entering={FadeInRight.delay(index * 30).duration(300)}>
      <Pressable 
        style={[styles.transactionItem, { backgroundColor: colors.bg.card }, shadow('sm')]}
        onPress={() => {}}
      >
        <View 
          style={[
            styles.transactionIcon, 
            { backgroundColor: `${categories[item.category as keyof typeof categories] || categories.other}20` }
          ]}
        >
          <Feather 
            name={getTransactionIcon(item.category)} 
            size={20} 
            color={categories[item.category as keyof typeof categories] || categories.other} 
          />
        </View>
        
        <View style={styles.transactionInfo}>
          <Text style={[styles.transactionTitle, typeScale.labelLarge, { color: colors.text.primary }]}>
            {item.title}
          </Text>
          <Text style={[typeScale.bodySmall, { color: colors.text.muted }]}>
            {item.time} • {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </Text>
        </View>
        
        <Text 
          style={[
            styles.transactionAmount, 
            typeScale.labelLarge, 
            { color: item.amount > 0 ? colors.status.success : colors.text.primary }
          ]}
        >
          {item.amount > 0 ? '+' : '-'}{currencySymbol} {formatCurrency(item.amount)}
        </Text>
      </Pressable>
    </Animated.View>
  );
  
  const renderDateGroup = ({ item, index }: { item: typeof MOCK_TRANSACTIONS[0]; index: number }) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).duration(400)}
      style={styles.dateGroup}
    >
      <Text style={[styles.dateHeader, typeScale.labelMedium, { color: colors.text.muted }]}>
        {item.date}
      </Text>
      {item.transactions.map((transaction, tIndex) => (
        <View key={transaction.id} style={styles.transactionWrapper}>
          {renderTransaction({ item: transaction, index: tIndex })}
        </View>
      ))}
    </Animated.View>
  );
  
  const FilterChip: React.FC<{ label: string; type: FilterType; icon: keyof typeof Feather.glyphMap }> = ({ 
    label, 
    type, 
    icon 
  }) => {
    const isActive = activeFilter === type;
    return (
      <Pressable
        onPress={() => setActiveFilter(type)}
        style={[
          styles.filterChip,
          {
            backgroundColor: isActive ? colors.primary.main : colors.bg.card,
            borderColor: isActive ? colors.primary.main : colors.border.light,
          },
          shadow('xs'),
        ]}
      >
        <Feather 
          name={icon} 
          size={16} 
          color={isActive ? colors.text.inverse : colors.text.secondary} 
        />
        <Text 
          style={[
            styles.filterChipText, 
            typeScale.labelMedium, 
            { color: isActive ? colors.text.inverse : colors.text.secondary }
          ]}
        >
          {label}
        </Text>
      </Pressable>
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg.base }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, typeScale.displaySmall, { color: colors.text.primary }]}>
          Activity
        </Text>
        <Pressable 
          style={[styles.exportButton, { backgroundColor: colors.bg.card }, shadow('sm')]}
          onPress={() => {}}
        >
          <Feather name="download" size={20} color={colors.text.primary} />
        </Pressable>
      </View>
      
      {/* Search */}
      <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.searchSection}>
        <View style={[
          styles.searchContainer,
          { 
            backgroundColor: colors.bg.sunken,
            borderColor: colors.border.medium,
          }
        ]}>
          <Feather name="search" size={20} color={colors.text.muted} />
          <TextInput
            style={[styles.searchInput, typeScale.bodyMedium, { color: colors.text.primary }]}
            placeholder="Search transactions..."
            placeholderTextColor={colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Feather name="x" size={20} color={colors.text.muted} />
            </Pressable>
          )}
        </View>
      </Animated.View>
      
      {/* Filters */}
      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.filters}>
        <FilterChip label="All" type="all" icon="list" />
        <FilterChip label="Income" type="income" icon="trending-up" />
        <FilterChip label="Expenses" type="expense" icon="trending-down" />
      </Animated.View>
      
      {/* Transaction List */}
      <FlatList
        data={filteredData}
        renderItem={renderDateGroup}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="inbox" size={48} color={colors.text.muted} />
            <Text style={[styles.emptyText, typeScale.bodyMedium, { color: colors.text.muted }]}>
              No transactions found
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
  },
  headerTitle: {},
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    paddingHorizontal: layout.screenPaddingH,
    marginBottom: spacing[3],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing[4],
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing[3],
    height: '100%',
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: layout.screenPaddingH,
    marginBottom: spacing[4],
    gap: spacing[2],
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radius.full,
    borderWidth: 1,
  },
  filterChipText: {
    marginLeft: spacing[2],
  },
  listContent: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: spacing[8],
  },
  dateGroup: {
    marginBottom: spacing[4],
  },
  dateHeader: {
    marginBottom: spacing[3],
  },
  transactionWrapper: {
    marginBottom: spacing[2],
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: radius['2xl'],
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    marginBottom: 2,
  },
  transactionAmount: {},
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[16],
  },
  emptyText: {
    marginTop: spacing[3],
  },
});
