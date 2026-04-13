/**
 * OB-03: Currency Selection Screen
 * Confirm or change currency based on country selection.
 */

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/hooks/useTheme';
import { Button, ScreenHeader, ClayCard } from '../../src/components/common';
import { ManjeCharacter } from '../../src/components/character';
import { typeScale } from '../../src/theme/typography';
import { spacing, layout, radius } from '../../src/theme/spacing';

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

const CURRENCIES: Currency[] = [
  { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MK' },
  { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK' },
  { code: 'ZWL', name: 'Zimbabwean Dollar', symbol: 'Z$' },
  { code: 'MZN', name: 'Mozambican Metical', symbol: 'MT' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'BWP', name: 'Botswana Pula', symbol: 'P' },
  { code: 'NAD', name: 'Namibian Dollar', symbol: 'N$' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
];

export default function CurrencyScreen() {
  const { colors, shadow } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ 
    countryCode: string; 
    currency: string;
    currencySymbol: string;
  }>();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    CURRENCIES.find(c => c.code === params.currency) || CURRENCIES[0]
  );
  
  const filteredCurrencies = useMemo(() => {
    if (!searchQuery.trim()) return CURRENCIES;
    const query = searchQuery.toLowerCase();
    return CURRENCIES.filter(
      currency => 
        currency.name.toLowerCase().includes(query) ||
        currency.code.toLowerCase().includes(query) ||
        currency.symbol.toLowerCase().includes(query)
    );
  }, [searchQuery]);
  
  // Move recommended currency to top
  const sortedCurrencies = useMemo(() => {
    if (!params.currency) return filteredCurrencies;
    const recommended = filteredCurrencies.find(c => c.code === params.currency);
    if (!recommended) return filteredCurrencies;
    return [recommended, ...filteredCurrencies.filter(c => c.code !== params.currency)];
  }, [filteredCurrencies, params.currency]);
  
  const handleSelectCurrency = (currency: Currency) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCurrency(currency);
  };
  
  const handleContinue = () => {
    if (selectedCurrency) {
      router.push({
        pathname: '/(onboarding)/income',
        params: { 
          currency: selectedCurrency.code,
          currencySymbol: selectedCurrency.symbol,
        },
      });
    }
  };
  
  const renderCurrencyItem = ({ item, index }: { item: Currency; index: number }) => {
    const isSelected = selectedCurrency?.code === item.code;
    const isRecommended = item.code === params.currency && index === 0;
    
    return (
      <Animated.View entering={FadeInRight.delay(index * 30).duration(300)}>
        <Pressable
          onPress={() => handleSelectCurrency(item)}
          style={[
            styles.currencyItem,
            {
              backgroundColor: isSelected ? colors.primary.light : colors.bg.card,
              borderColor: isSelected ? colors.primary.main : colors.border.light,
            },
            shadow('sm'),
          ]}
        >
          <View style={[styles.symbolBadge, { backgroundColor: colors.bg.sunken }]}>
            <Text style={[styles.symbol, typeScale.headlineMedium, { color: colors.text.primary }]}>
              {item.symbol}
            </Text>
          </View>
          <View style={styles.currencyInfo}>
            <View style={styles.currencyNameRow}>
              <Text style={[styles.currencyName, typeScale.labelLarge, { color: colors.text.primary }]}>
                {item.code}
              </Text>
              {isRecommended && (
                <View style={[styles.recommendedBadge, { backgroundColor: colors.status.successBg }]}>
                  <Text style={[typeScale.labelSmall, { color: colors.status.success }]}>
                    Recommended
                  </Text>
                </View>
              )}
            </View>
            <Text style={[typeScale.bodySmall, { color: colors.text.muted }]}>
              {item.name}
            </Text>
          </View>
          {isSelected && (
            <View style={[styles.checkmark, { backgroundColor: colors.primary.main }]}>
              <Feather name="check" size={14} color={colors.text.inverse} />
            </View>
          )}
        </Pressable>
      </Animated.View>
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg.base }]} edges={['top']}>
      <ScreenHeader title="Choose your currency" />
      
      <View style={styles.content}>
        {/* Character & Intro */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.header}
        >
          <ManjeCharacter mood="happy" size="sm" />
          <Text style={[styles.subtitle, typeScale.bodyMedium, { color: colors.text.secondary }]}>
            All your transactions will be tracked in this currency
          </Text>
        </Animated.View>
        
        {/* Search */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
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
              placeholder="Search currencies..."
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
        
        {/* Currency List */}
        <FlatList
          data={sortedCurrencies}
          renderItem={renderCurrencyItem}
          keyExtractor={(item) => item.code}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
      
      {/* Continue Button */}
      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          variant="primary"
          size="lg"
          fullWidth
          disabled={!selectedCurrency}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingH,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  subtitle: {
    textAlign: 'center',
    marginTop: spacing[2],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing[3],
    height: '100%',
  },
  listContent: {
    paddingBottom: spacing[4],
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: radius['2xl'],
    borderWidth: 1.5,
  },
  symbolBadge: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  symbol: {
    fontWeight: '600',
  },
  currencyInfo: {
    flex: 1,
  },
  currencyNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  currencyName: {
    marginRight: spacing[2],
  },
  recommendedBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: spacing[3],
  },
  footer: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: spacing[6],
    paddingTop: spacing[3],
  },
});
