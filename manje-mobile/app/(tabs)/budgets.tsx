/**
 * Budgets Screen (Placeholder)
 * Budget management screen - simplified for P0.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../src/hooks/useTheme';
import { Button, ClayCard } from '../../src/components/common';
import { ManjeCharacter } from '../../src/components/character';
import { typeScale } from '../../src/theme/typography';
import { spacing, layout } from '../../src/theme/spacing';

export default function BudgetsScreen() {
  const { colors } = useTheme();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg.base }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, typeScale.displaySmall, { color: colors.text.primary }]}>
          Budgets
        </Text>
      </View>
      
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.emptyState}>
          <ManjeCharacter mood="encourage" size="lg" />
          
          <Text style={[styles.emptyTitle, typeScale.headlineLarge, { color: colors.text.primary }]}>
            Set your first budget
          </Text>
          
          <Text style={[styles.emptyDescription, typeScale.bodyMedium, { color: colors.text.secondary }]}>
            Create a budget to track your spending and stay on top of your finances.
          </Text>
          
          <ClayCard variant="subtle" style={styles.tipCard}>
            <View style={styles.tipContent}>
              <Feather name="info" size={20} color={colors.primary.default} />
              <Text style={[styles.tipText, typeScale.bodySmall, { color: colors.text.secondary }]}>
                Start with one budget category like "Groceries" or "Transport" to build the habit.
              </Text>
            </View>
          </ClayCard>
          
          <Button
            title="Create Budget"
            onPress={() => {}}
            variant="primary"
            size="lg"
            icon={<Feather name="plus" size={20} color="#FFFFFF" />}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
  },
  headerTitle: {},
  content: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingH,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing[16],
  },
  emptyTitle: {
    marginTop: spacing[6],
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    marginBottom: spacing[6],
    paddingHorizontal: spacing[4],
  },
  tipCard: {
    marginBottom: spacing[6],
    width: '100%',
  },
  tipContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    marginLeft: spacing[3],
    lineHeight: 20,
  },
});
