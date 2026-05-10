import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Target, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { Button } from '../../../src/components/common/Button';
import { ClayCard } from '../../../src/components/common/ClayCard';
import { ManjeCharacter } from '../../../src/components/character/ManjeCharacter';
import { useGoalStore } from '../../../src/stores';

export default function GoalsListScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const goals = useGoalStore((state) => state.goals);

  const activeGoals = goals.filter((goal) => goal.currentAmount < goal.targetAmount);
  const completedGoals = goals.filter((goal) => goal.currentAmount >= goal.targetAmount);
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  if (goals.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.base }]}>
        <ScreenHeader title="Savings Goals" />
        <View style={styles.emptyContainer}>
          <Target size={64} color={colors.text.muted} />
          <Text style={[typography.headline.medium, { color: colors.text.primary, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
            No Goals Yet
          </Text>
          <Text style={[typography.body.medium, { color: colors.text.secondary, textAlign: 'center', paddingHorizontal: spacing.xl, marginBottom: spacing['3xl'] }]}>
            Set a goal to start saving for what matters to you.
          </Text>
          <Button title="Set a Goal" onPress={() => router.push('/(tabs)/goals/create/index')} size="lg" variant="primary" />
        </View>
      </View>
    );
  }

  const renderGoalCard = (goal: (typeof goals)[number]) => {
    const percentage = Math.min((goal.currentAmount / Math.max(goal.targetAmount, 1)) * 100, 100);
    const isCompleted = goal.currentAmount >= goal.targetAmount;

    return (
      <TouchableOpacity
        key={goal.id}
        activeOpacity={0.9}
        onPress={() =>
          router.push({
            pathname: '/(tabs)/goals/[id]',
            params: { id: goal.id },
          })
        }
      >
        <ClayCard variant="subtle" style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View style={styles.goalIconName}>
              <View style={[styles.iconContainer, { backgroundColor: isCompleted ? colors.status.success.bg : `${colors.primary.base}20` }]}>
                <Target size={24} color={isCompleted ? colors.status.success.text : colors.primary.base} />
              </View>
              <View>
                <Text style={[typography.headline.small, { color: colors.text.primary }]}>{goal.name}</Text>
                <Text style={[typography.label.medium, { color: colors.text.muted }]}>
                  Target: MK {goal.targetAmount.toLocaleString()}
                </Text>
              </View>
            </View>
            <ArrowRight size={20} color={colors.text.muted} />
          </View>

          <View style={styles.goalProgressContainer}>
            <View style={styles.goalAmounts}>
              <Text style={[typography.headline.small, { color: colors.text.primary }]}>
                MK {goal.currentAmount.toLocaleString()}
              </Text>
              <Text style={[typography.label.medium, { color: isCompleted ? colors.status.success.text : colors.primary.base }]}>
                {percentage.toFixed(0)}%
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: colors.border.light }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${percentage}%`, backgroundColor: isCompleted ? colors.status.success.base : colors.primary.base },
                ]}
              />
            </View>
          </View>
        </ClayCard>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScreenHeader title="Savings Goals" />

      <ScrollView contentContainerStyle={{ padding: spacing.xl }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ManjeCharacter mood="happy" size="md" animated />
          <View style={styles.headerText}>
            <Text style={[typography.headline.medium, { color: colors.text.primary }]}>You're doing great!</Text>
            <Text style={[typography.body.medium, { color: colors.text.secondary }]}>
              Total saved: MK {totalSaved.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[typography.headline.small, { color: colors.text.primary }]}>Active Goals</Text>
        </View>
        {activeGoals.map(renderGoalCard)}

        <Button
          title="Add New Goal"
          onPress={() => router.push('/(tabs)/goals/create/index')}
          fullWidth
          variant="outline"
          style={{ marginTop: spacing.md, marginBottom: spacing['3xl'] }}
        />

        {completedGoals.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[typography.headline.small, { color: colors.text.primary }]}>Completed</Text>
            </View>
            {completedGoals.map(renderGoalCard)}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#36B37E15',
    padding: 16,
    borderRadius: 20,
    marginBottom: 32,
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  goalCard: {
    padding: 20,
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  goalIconName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  goalProgressContainer: {
    width: '100%',
  },
  goalAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
