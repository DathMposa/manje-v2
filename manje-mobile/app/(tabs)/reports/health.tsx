import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Target, TrendingUp } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { ClayCard } from '../../../src/components/common/ClayCard';
import { ManjeCharacter } from '../../../src/components/character/ManjeCharacter';
import { buildFinancialHealth } from '../../../src/lib/reports';
import { useBudgetStore, useGoalStore, useTransactionStore } from '../../../src/stores';

const FACTOR_ICONS = [Target, TrendingUp, Shield];
const FACTOR_COLORS = ['#36B37E', '#FFAB00', '#00B8D9'];

export default function HealthScoreScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const transactions = useTransactionStore((state) => state.transactions);
  const budgets = useBudgetStore((state) => state.budgets);
  const goals = useGoalStore((state) => state.goals);
  const health = buildFinancialHealth(transactions, budgets, goals);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScreenHeader title="Financial Health" showBack onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['4xl'] }} showsVerticalScrollIndicator={false}>
        <View style={styles.scoreHeader}>
          <View style={styles.scoreCircleWrapper}>
            <View style={[styles.scoreCircle, { borderColor: colors.status.success.base }]}>
              <Text style={[typography.display.large, { color: colors.text.primary }]}>{health.score}</Text>
            </View>
          </View>
          <Text style={[typography.headline.medium, { color: colors.text.primary, marginTop: spacing.lg }]}>
            {health.status} Standing
          </Text>
          <Text style={[typography.body.medium, { color: colors.text.secondary, textAlign: 'center', marginTop: spacing.xs }]}>
            Your score is calculated from live budgets, savings behaviour, and goal progress.
          </Text>
        </View>

        <Text style={[typography.headline.small, { color: colors.text.primary, marginTop: spacing['2xl'], marginBottom: spacing.md }]}>
          Score Factors
        </Text>

        {health.factors.map((factor, index) => {
          const Icon = FACTOR_ICONS[index] ?? Target;
          const color = FACTOR_COLORS[index] ?? colors.primary.base;
          return (
            <ClayCard key={factor.name} variant="subtle" style={styles.factorCard}>
              <View style={styles.factorHeader}>
                <View style={styles.factorIconName}>
                  <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                    <Icon size={20} color={color} />
                  </View>
                  <Text style={[typography.body.large, { color: colors.text.primary }]}>{factor.name}</Text>
                </View>
                <Text style={[typography.headline.small, { color: colors.text.primary }]}>{factor.score}/100</Text>
              </View>

              <View style={styles.factorProgressContainer}>
                <View style={[styles.factorProgressBar, { backgroundColor: colors.border.light }]}>
                  <View style={[styles.factorProgressFill, { width: `${factor.score}%`, backgroundColor: color }]} />
                </View>
              </View>
            </ClayCard>
          );
        })}

        <Text style={[typography.headline.small, { color: colors.text.primary, marginTop: spacing.xl, marginBottom: spacing.md }]}>
          Tips to Improve
        </Text>

        <ClayCard variant="subtle" style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <ManjeCharacter mood="encourage" size="sm" />
            <Text style={[typography.headline.small, { color: colors.text.primary, marginLeft: 12 }]}>Manje's Advice</Text>
          </View>

          {health.tips.map((tip) => (
            <View key={tip} style={styles.tipItem}>
              <View style={styles.bullet} />
              <Text style={[typography.body.medium, { color: colors.text.secondary, flex: 1 }]}>{tip}</Text>
            </View>
          ))}
        </ClayCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scoreHeader: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  scoreCircleWrapper: {
    padding: 16,
  },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  factorCard: {
    padding: 16,
    marginBottom: 16,
  },
  factorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  factorIconName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  factorProgressContainer: {
    width: '100%',
  },
  factorProgressBar: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  factorProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  tipsCard: {
    padding: 20,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#36B37E',
    marginTop: 8,
    marginRight: 12,
  },
});
