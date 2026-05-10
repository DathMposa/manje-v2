import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Check } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { Input } from '../../../src/components/common/Input';
import { ClayCard } from '../../../src/components/common/ClayCard';
import { useSettingsStore } from '../../../src/stores';

const CURRENCIES = [
  { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MK', flag: 'MW', popular: true },
  { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK', flag: 'ZM', popular: true },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: 'ZA', popular: true },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: 'US', popular: true },
  { code: 'EUR', name: 'Euro', symbol: 'EUR', flag: 'EU', popular: false },
  { code: 'GBP', name: 'British Pound', symbol: 'GBP', flag: 'GB', popular: false },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: 'KE', popular: false },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', flag: 'TZ', popular: false },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', flag: 'UG', popular: false },
  { code: 'NGN', name: 'Nigerian Naira', symbol: 'NGN', flag: 'NG', popular: false },
];

export default function CurrencySettingsScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const selectedCurrency = useSettingsStore((state) => state.settings.currency);
  const updateCurrency = useSettingsStore((state) => state.updateCurrency);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredCurrencies = useMemo(
    () =>
      CURRENCIES.filter(
        (currency) =>
          currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          currency.code.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const handleSelect = async (code: string) => {
    await updateCurrency(code);
    router.back();
  };

  const renderCurrencyGroup = (title: string, currencies: typeof CURRENCIES) => {
    if (currencies.length === 0) return null;

    return (
      <View style={styles.groupContainer}>
        <Text style={[typography.label.medium, { color: colors.text.muted, marginBottom: spacing.md, marginLeft: spacing.xs }]}>
          {title}
        </Text>
        <ClayCard variant="subtle" style={styles.card}>
          {currencies.map((currency, index) => {
            const isSelected = selectedCurrency === currency.code;
            return (
              <TouchableOpacity
                key={currency.code}
                style={[
                  styles.currencyRow,
                  index < currencies.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border.light },
                ]}
                onPress={() => void handleSelect(currency.code)}
                activeOpacity={0.7}
              >
                <View style={styles.currencyInfo}>
                  <Text style={[typography.headline.small, { marginRight: spacing.md }]}>{currency.flag}</Text>
                  <View>
                    <Text style={[typography.body.large, { color: colors.text.primary, marginBottom: 2 }]}>{currency.code}</Text>
                    <Text style={[typography.label.medium, { color: colors.text.secondary }]}>{currency.name}</Text>
                  </View>
                </View>
                <View style={styles.rightContent}>
                  <View style={[styles.symbolBadge, { backgroundColor: colors.background.sunken }]}>
                    <Text style={[typography.label.small, { color: colors.text.muted }]}>{currency.symbol}</Text>
                  </View>
                  {isSelected && (
                    <View style={[styles.checkCircle, { backgroundColor: colors.primary.base }]}>
                      <Check size={14} color={colors.text.inverse} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ClayCard>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScreenHeader title="Currency" showBack onBackPress={() => router.back()} />

      <View style={[styles.searchContainer, { paddingHorizontal: spacing.xl }]}>
        <Input label="" placeholder="Search currencies..." value={searchQuery} onChangeText={setSearchQuery} leftIcon={<Search size={20} color={colors.text.muted} />} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['4xl'] }} showsVerticalScrollIndicator={false}>
        {searchQuery ? renderCurrencyGroup('Search Results', filteredCurrencies) : (
          <>
            {renderCurrencyGroup('Popular', CURRENCIES.filter((currency) => currency.popular))}
            {renderCurrencyGroup('All Currencies', CURRENCIES.filter((currency) => !currency.popular))}
          </>
        )}
      </ScrollView>
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
  groupContainer: {
    marginBottom: 24,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  currencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbolBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
