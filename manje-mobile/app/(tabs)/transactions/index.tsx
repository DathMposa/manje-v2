import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, ShoppingBag, Coffee, Car, Zap, ArrowDownRight, Briefcase, Edit3, RotateCcw, TrendingUp } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { Input } from '../../../src/components/common/Input';
import { ManjeCharacter } from '../../../src/components/character';
import { useTransactionStore } from '../../../src/stores';

const iconMap = {
  groceries: ShoppingBag,
  dining: Coffee,
  transport: Car,
  utilities: Zap,
  salary: Briefcase,
  freelance: Edit3,
  refund: RotateCcw,
  investment: TrendingUp,
} as const;

export default function TransactionsListScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const transactions = useTransactionStore((state) => state.transactions);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'expense' | 'income' | 'transfer'>('all');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'expense', label: 'Expenses' },
    { id: 'income', label: 'Income' },
    { id: 'transfer', label: 'Transfers' },
  ] as const;

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((transaction) => {
        const matchesSearch =
          transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'all' || transaction.type === activeFilter;
        return matchesSearch && matchesFilter;
      }),
    [activeFilter, searchQuery, transactions]
  );

  const renderTransaction = ({ item }: { item: (typeof filteredTransactions)[number] }) => {
    const isIncome = item.type === 'income';
    const amountPrefix = isIncome ? '+' : item.type === 'expense' ? '-' : '';
    const amountColor = isIncome ? colors.status.success.text : colors.text.primary;
    const Icon = iconMap[item.category as keyof typeof iconMap] || ArrowDownRight;

    return (
      <TouchableOpacity
        style={[styles.transactionItem, { borderBottomColor: colors.border.light }]}
        activeOpacity={0.7}
        onPress={() =>
          router.push({
            pathname: '/(tabs)/transactions/[id]',
            params: { id: item.id },
          })
        }
      >
        <View style={[styles.iconContainer, { backgroundColor: `${colors.category[item.category as keyof typeof colors.category] || colors.category.other}20` }]}>
          <Icon size={20} color={colors.category[item.category as keyof typeof colors.category] || colors.category.other} />
        </View>

        <View style={styles.transactionDetails}>
          <Text style={[typography.headline.small, { color: colors.text.primary, marginBottom: 2 }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[typography.label.medium, { color: colors.text.secondary }]}>
            {item.category} • {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Text>
        </View>

        <Text style={[typography.headline.small, { color: amountColor }]}>
          {amountPrefix}{item.amount.toLocaleString()}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScreenHeader title="All Transactions" showBack onBackPress={() => router.back()} />

      <View style={[styles.searchContainer, { paddingHorizontal: spacing.xl }]}>
        <Input
          label=""
          placeholder="Search transactions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={colors.text.muted} />}
        />

        <View style={styles.filterScroll}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: activeFilter === filter.id ? colors.primary.base : colors.background.card,
                    borderColor: activeFilter === filter.id ? colors.primary.base : colors.border.medium,
                  },
                ]}
                onPress={() => setActiveFilter(filter.id)}
              >
                <Text
                  style={[
                    typography.label.medium,
                    { color: activeFilter === filter.id ? colors.text.inverse : colors.text.secondary },
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing['4xl'] }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={[styles.emptyContainer, { padding: spacing['2xl'] }]}>
            <ManjeCharacter utility="empty-state" size={170} animated showIdleFloat />
            <Text style={[typography.headline.medium, { color: colors.text.primary, marginTop: spacing.xl, marginBottom: spacing.xs }]}>
              No transactions found
            </Text>
            <Text style={[typography.body.medium, { color: colors.text.secondary, textAlign: 'center' }]}>
              Try adjusting your search or filters.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  filterScroll: {
    marginTop: 16,
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
    marginRight: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
