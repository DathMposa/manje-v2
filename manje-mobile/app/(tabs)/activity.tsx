/**
 * ACT-01: Activity / Transaction History Screen
 * Full transaction list with filtering and search.
 */

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useTheme } from '../../src/hooks/useTheme';
import { typeScale } from '../../src/theme/typography';
import { spacing, layout, radius } from '../../src/theme/spacing';
import { categoryColors } from '../../src/theme/colors';
import { useTransactionStore } from '../../src/stores';

type FilterType = 'all' | 'income' | 'expense';

const getDateLabel = (date: string) => {
  const target = new Date(date);
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const targetStart = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const diffDays = Math.round((todayStart - targetStart) / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';

  return target.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};

const getTimeLabel = (date: string) =>
  new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

const getSignedAmount = (amount: number, type: string) => {
  if (type === 'expense') return -amount;
  if (type === 'income') return amount;
  return 0;
};

export default function ActivityScreen() {
  const { colors, shadow } = useTheme();
  const router = useRouter();
  const transactions = useTransactionStore((state) => state.transactions);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const currencySymbol = 'MK';

  const filteredData = useMemo(() => {
    const filteredTransactions = transactions.filter((transaction) => {
      if (activeFilter !== 'all' && transaction.type !== activeFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          transaction.title.toLowerCase().includes(query) ||
          transaction.category.toLowerCase().includes(query)
        );
      }

      return true;
    });

    const groups = filteredTransactions.reduce<Record<string, typeof filteredTransactions>>((acc, transaction) => {
      const label = getDateLabel(transaction.date);
      acc[label] = [...(acc[label] || []), transaction];
      return acc;
    }, {});

    return Object.entries(groups).map(([date, groupedTransactions]) => ({
      date,
      transactions: groupedTransactions,
    }));
  }, [activeFilter, searchQuery, transactions]);

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

  const renderTransaction = ({ item, index }: { item: (typeof filteredData)[number]['transactions'][number]; index: number }) => {
    const categoryTone =
      categoryColors[item.category as keyof typeof categoryColors] || categoryColors.other;
    const signedAmount = getSignedAmount(item.amount, item.type);

    return (
      <Animated.View entering={FadeInRight.delay(index * 30).duration(300)}>
        <Pressable
          style={[styles.transactionItem, { backgroundColor: colors.bg.card }, shadow('sm')]}
          onPress={() =>
            router.push({
              pathname: '/(tabs)/transactions/[id]',
              params: { id: item.id },
            })
          }
        >
          <View style={[styles.transactionIcon, { backgroundColor: `${categoryTone.fg}20` }]}>
            <Feather name={getTransactionIcon(item.category)} size={20} color={categoryTone.fg} />
          </View>

          <View style={styles.transactionInfo}>
            <Text style={[styles.transactionTitle, typeScale['label.lg'], { color: colors.text.primary }]}>
              {item.title}
            </Text>
            <Text style={[typeScale['body.sm'], { color: colors.text.secondary }]}>
              {getTimeLabel(item.date)} • {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Text>
          </View>

          <Text
            style={[
              styles.transactionAmount,
              typeScale['label.lg'],
              { color: item.type === 'income' ? colors.status.success.text : colors.text.primary },
            ]}
          >
            {signedAmount > 0 ? '+' : signedAmount < 0 ? '-' : ''}
            {currencySymbol} {Math.abs(signedAmount).toLocaleString()}
          </Text>
        </Pressable>
      </Animated.View>
    );
  };

  const renderDateGroup = ({ item, index }: { item: (typeof filteredData)[number]; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(400)} style={styles.dateGroup}>
      <Text style={[styles.dateHeader, typeScale['label.md'], { color: colors.text.secondary }]}>
        {item.date}
      </Text>
      {item.transactions.map((transaction, transactionIndex) => (
        <View key={transaction.id} style={styles.transactionWrapper}>
          {renderTransaction({ item: transaction, index: transactionIndex })}
        </View>
      ))}
    </Animated.View>
  );

  const FilterChip: React.FC<{ label: string; type: FilterType; icon: keyof typeof Feather.glyphMap }> = ({
    label,
    type,
    icon,
  }) => {
    const isActive = activeFilter === type;

    return (
      <Pressable
        onPress={() => setActiveFilter(type)}
        style={[
          styles.filterChip,
          {
            backgroundColor: isActive ? colors.primary.default : colors.bg.card,
            borderColor: isActive ? colors.primary.default : colors.border.light,
          },
          shadow('xs'),
        ]}
      >
        <Feather name={icon} size={16} color={isActive ? colors.text.inverse : colors.text.secondary} />
        <Text
          style={[
            styles.filterChipText,
            typeScale['label.md'],
            { color: isActive ? colors.text.inverse : colors.text.secondary },
          ]}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg.base }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, typeScale['headline.lg'], { color: colors.text.primary }]}>
          Activity
        </Text>
        <Pressable
          style={[styles.exportButton, { backgroundColor: colors.bg.card }, shadow('sm')]}
          onPress={() => router.push('/(tabs)/transactions/index')}
        >
          <Feather name="list" size={20} color={colors.text.primary} />
        </Pressable>
      </View>

      <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.searchSection}>
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: colors.bg.sunken,
              borderColor: colors.border.light,
            },
          ]}
        >
          <Feather name="search" size={20} color={colors.text.secondary} />
          <TextInput
            style={[styles.searchInput, typeScale['body.md'], { color: colors.text.primary }]}
            placeholder="Search transactions..."
            placeholderTextColor={colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Feather name="x" size={20} color={colors.text.secondary} />
            </Pressable>
          )}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.filters}>
        <FilterChip label="All" type="all" icon="list" />
        <FilterChip label="Income" type="income" icon="trending-up" />
        <FilterChip label="Expenses" type="expense" icon="trending-down" />
      </Animated.View>

      <FlatList
        data={filteredData}
        renderItem={renderDateGroup}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="inbox" size={48} color={colors.text.secondary} />
            <Text style={[styles.emptyText, typeScale['body.md'], { color: colors.text.secondary }]}>
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
