/**
 * OB-08: Income Range Screen
 * Optional income range input for P0 simplified onboarding.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/hooks/useTheme';
import { Button, ScreenHeader, ClayCard } from '../../src/components/common';
import { ManjeCharacter } from '../../src/components/character';
import { typeScale } from '../../src/theme/typography';
import { spacing, layout, radius } from '../../src/theme/spacing';

interface IncomeRange {
  id: string;
  label: string;
  minValue: number;
  maxValue: number | null;
}

const INCOME_RANGES: IncomeRange[] = [
  { id: 'under_50k', label: 'Under 50,000', minValue: 0, maxValue: 50000 },
  { id: '50k_100k', label: '50,000 - 100,000', minValue: 50000, maxValue: 100000 },
  { id: '100k_250k', label: '100,000 - 250,000', minValue: 100000, maxValue: 250000 },
  { id: '250k_500k', label: '250,000 - 500,000', minValue: 250000, maxValue: 500000 },
  { id: '500k_1m', label: '500,000 - 1,000,000', minValue: 500000, maxValue: 1000000 },
  { id: 'over_1m', label: 'Over 1,000,000', minValue: 1000000, maxValue: null },
];

export default function IncomeScreen() {
  const { colors, shadow } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ 
    currency: string;
    currencySymbol: string;
  }>();
  
  const [selectedRange, setSelectedRange] = useState<IncomeRange | null>(null);
  
  const currencySymbol = params.currencySymbol || 'MK';
  
  const handleSelectRange = (range: IncomeRange) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedRange(range);
  };
  
  const handleContinue = () => {
    // Store income range preference (optional)
    router.push('/(onboarding)/success');
  };
  
  const handleSkip = () => {
    router.push('/(onboarding)/success');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg.base }]} edges={['top']}>
      <ScreenHeader 
        title="Monthly Income" 
        rightAction={
          <Pressable onPress={handleSkip}>
            <Text style={[typeScale.labelMedium, { color: colors.text.muted }]}>Skip</Text>
          </Pressable>
        }
      />
      
      <View style={styles.content}>
        {/* Character & Intro */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.header}
        >
          <ManjeCharacter mood="thinking" size="md" />
          <Text style={[styles.title, typeScale.headlineLarge, { color: colors.text.primary }]}>
            What's your monthly income range?
          </Text>
          <Text style={[styles.subtitle, typeScale.bodyMedium, { color: colors.text.secondary }]}>
            This helps me give you better budget suggestions. You can skip this if you prefer.
          </Text>
        </Animated.View>
        
        {/* Income Ranges */}
        <View style={styles.rangesContainer}>
          {INCOME_RANGES.map((range, index) => {
            const isSelected = selectedRange?.id === range.id;
            
            return (
              <Animated.View 
                key={range.id}
                entering={FadeInUp.delay(200 + index * 50).duration(300)}
              >
                <Pressable
                  onPress={() => handleSelectRange(range)}
                  style={[
                    styles.rangeItem,
                    {
                      backgroundColor: isSelected ? colors.primary.light : colors.bg.card,
                      borderColor: isSelected ? colors.primary.main : colors.border.light,
                    },
                    shadow('sm'),
                  ]}
                >
                  <View style={styles.rangeContent}>
                    <Text style={[styles.currencySymbol, typeScale.labelMedium, { color: colors.text.muted }]}>
                      {currencySymbol}
                    </Text>
                    <Text style={[styles.rangeLabel, typeScale.labelLarge, { color: colors.text.primary }]}>
                      {range.label}
                    </Text>
                  </View>
                  
                  <View style={[
                    styles.radioOuter,
                    { borderColor: isSelected ? colors.primary.main : colors.border.medium }
                  ]}>
                    {isSelected && (
                      <View style={[styles.radioInner, { backgroundColor: colors.primary.main }]} />
                    )}
                  </View>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
        
        {/* Privacy Note */}
        <Animated.View 
          entering={FadeInUp.delay(500).duration(400)}
          style={styles.privacyNote}
        >
          <Feather name="lock" size={16} color={colors.text.muted} />
          <Text style={[styles.privacyText, typeScale.bodySmall, { color: colors.text.muted }]}>
            Your income data stays on your device and is never shared
          </Text>
        </Animated.View>
      </View>
      
      {/* Continue Button */}
      <View style={styles.footer}>
        <Button
          title={selectedRange ? "Continue" : "Skip for now"}
          onPress={selectedRange ? handleContinue : handleSkip}
          variant={selectedRange ? "primary" : "secondary"}
          size="lg"
          fullWidth
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
    marginBottom: spacing[6],
  },
  title: {
    textAlign: 'center',
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 22,
  },
  rangesContainer: {
    gap: spacing[3],
  },
  rangeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[4],
    borderRadius: radius['2xl'],
    borderWidth: 1.5,
  },
  rangeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    marginRight: spacing[2],
  },
  rangeLabel: {},
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[6],
    paddingHorizontal: spacing[4],
  },
  privacyText: {
    marginLeft: spacing[2],
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: spacing[6],
    paddingTop: spacing[3],
  },
});
