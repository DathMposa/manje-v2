/**
 * OB-02: Country Selection Screen
 * Select home country with auto-detect and search.
 */

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/hooks/useTheme';
import { Button, ScreenHeader, ClayCard } from '../../src/components/common';
import { ManjeCharacter } from '../../src/components/character';
import { typeScale } from '../../src/theme/typography';
import { spacing, layout, radius } from '../../src/theme/spacing';

interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
}

const COUNTRIES: Country[] = [
  { code: 'MW', name: 'Malawi', flag: '🇲🇼', currency: 'MWK', currencySymbol: 'MK' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', currency: 'ZMW', currencySymbol: 'ZK' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', currency: 'ZWL', currencySymbol: 'Z$' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', currency: 'MZN', currencySymbol: 'MT' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', currency: 'TZS', currencySymbol: 'TSh' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES', currencySymbol: 'KSh' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', currency: 'UGX', currencySymbol: 'USh' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'ZAR', currencySymbol: 'R' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼', currency: 'BWP', currencySymbol: 'P' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦', currency: 'NAD', currencySymbol: 'N$' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', currencySymbol: '₦' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', currency: 'GHS', currencySymbol: 'GH₵' },
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', currencySymbol: '$' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', currencySymbol: '£' },
];

export default function CountryScreen() {
  const { colors, shadow } = useTheme();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(COUNTRIES[0]); // Default to Malawi
  
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return COUNTRIES;
    const query = searchQuery.toLowerCase();
    return COUNTRIES.filter(
      country => 
        country.name.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);
  
  const handleSelectCountry = (country: Country) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCountry(country);
  };
  
  const handleContinue = () => {
    if (selectedCountry) {
      // Pass selected country to next screen
      router.push({
        pathname: '/(onboarding)/currency',
        params: { 
          countryCode: selectedCountry.code,
          currency: selectedCountry.currency,
          currencySymbol: selectedCountry.currencySymbol,
        },
      });
    }
  };
  
  const renderCountryItem = ({ item, index }: { item: Country; index: number }) => {
    const isSelected = selectedCountry?.code === item.code;
    
    return (
      <Animated.View entering={FadeInRight.delay(index * 50).duration(300)}>
        <Pressable
          onPress={() => handleSelectCountry(item)}
          style={[
            styles.countryItem,
            {
              backgroundColor: isSelected ? colors.primary.subtle : colors.bg.card,
              borderColor: isSelected ? colors.primary.default : colors.border.light,
            },
            shadow('sm'),
          ]}
        >
          <Text style={styles.flag}>{item.flag}</Text>
          <View style={styles.countryInfo}>
            <Text style={[styles.countryName, typeScale.labelLarge, { color: colors.text.primary }]}>
              {item.name}
            </Text>
            <Text style={[typeScale.bodySmall, { color: colors.text.secondary }]}>
              {item.currency} ({item.currencySymbol})
            </Text>
          </View>
          {isSelected && (
            <View style={[styles.checkmark, { backgroundColor: colors.primary.default }]}>
              <Feather name="check" size={14} color={colors.text.inverse} />
            </View>
          )}
        </Pressable>
      </Animated.View>
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg.base }]} edges={['top']}>
      <ScreenHeader title="Where are you based?" showBack={false} />
      
      <View style={styles.content}>
        {/* Character & Intro */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.header}
        >
          <ManjeCharacter mood="happy" size="sm" />
          <Text style={[styles.subtitle, typeScale.bodyMedium, { color: colors.text.secondary }]}>
            This helps me show you relevant features and currency
          </Text>
        </Animated.View>
        
        {/* Search */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <View style={[
            styles.searchContainer,
            { 
              backgroundColor: colors.bg.sunken,
              borderColor: colors.border.light,
            }
          ]}>
            <Feather name="search" size={20} color={colors.text.secondary} />
            <TextInput
              style={[styles.searchInput, typeScale.bodyMedium, { color: colors.text.primary }]}
              placeholder="Search countries..."
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
        
        {/* Country List */}
        <FlatList
          data={filteredCountries}
          renderItem={renderCountryItem}
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
          disabled={!selectedCountry}
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
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: radius['2xl'],
    borderWidth: 1.5,
  },
  flag: {
    fontSize: 32,
    marginRight: spacing[3],
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    marginBottom: 2,
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
