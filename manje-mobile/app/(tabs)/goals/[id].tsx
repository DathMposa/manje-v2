import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Edit2, Plus, Target, Calendar } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { ClayCard } from '../../../src/components/common/ClayCard';
import { Button } from '../../../src/components/common/Button';
import { useGoalStore } from '../../../src/stores';

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const goal = useGoalStore((state) => state.goals.find((item) => item.id === String(id)));

  if (!goal) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.base }]}>
        <ScreenHeader title="Goal Details" showBack onBackPress={() => router.back()} />
      </View>
    );
  }

  const percentage = Math.min((goal.currentAmount / Math.max(goal.targetAmount, 1)) * 100, 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScreenHeader
        title={goal.name}
        showBack
        onBackPress={() => router.back()}
        rightAction={
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/(tabs)/goals/edit/[id]',
                params: { id: goal.id },
              })
            }
            style={styles.headerButton}
          >
            <Edit2 size={20} color={colors.text.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['4xl'] }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: colors.status.success.bg }]}>
            <Target size={32} color={colors.status.success.text} />
          </View>
        </View>

        <ClayCard variant="subtle" style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={[typography.financial.large, { color: colors.text.primary }]}>
              MK {goal.currentAmount.toLocaleString()}
            </Text>
            <Text style={[typography.headline.small, { color: colors.text.muted }]}>
              / MK {goal.targetAmount.toLocaleString()}
            </Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarBg, { backgroundColor: colors.border.light }]}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${percentage}%`, backgroundColor: colors.status.success.base },
                ]}
              />
            </View>
          </View>

          <View style={styles.progressFooter}>
            <Text style={[typography.label.medium, { color: colors.status.success.text }]}>
              {percentage.toFixed(0)}% completed
            </Text>
            {goal.deadline ? (
              <View style={styles.dateInfo}>
                <Calendar size={14} color={colors.text.muted} style={{ marginRight: 4 }} />
                <Text style={[typography.label.small, { color: colors.text.muted }]}>Target: {goal.deadline}</Text>
              </View>
            ) : null}
          </View>
        </ClayCard>

        <Button
          title="Add Contribution"
          onPress={() =>
            router.push({
              pathname: '/(tabs)/goals/contribute/[id]',
              params: { id: goal.id },
            })
          }
          fullWidth
          size="lg"
          variant="primary"
          icon={<Plus size={20} color={colors.text.inverse} />}
        />

        <View style={styles.historySection}>
          <Text style={[typography.headline.small, { color: colors.text.primary, marginBottom: spacing.lg }]}>
            Contribution History
          </Text>

          {goal.contributions.length === 0 ? (
            <Text style={[typography.body.medium, { color: colors.text.secondary }]}>
              No contributions yet.
            </Text>
          ) : (
            goal.contributions.map((contribution, index) => (
              <View
                key={contribution.id}
                style={[
                  styles.contributionItem,
                  index < goal.contributions.length - 1 && {
                    borderBottomColor: colors.border.light,
                    borderBottomWidth: 1,
                  },
                ]}
              >
                <View style={styles.contributionDetails}>
                  <View style={[styles.smallIconContainer, { backgroundColor: colors.status.success.bg }]}>
                    <Plus size={16} color={colors.status.success.text} />
                  </View>
                  <View>
                    <Text style={[typography.body.large, { color: colors.text.primary }]}>Added to goal</Text>
                    <Text style={[typography.label.medium, { color: colors.text.muted }]}>
                      {new Date(contribution.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                    {contribution.note ? (
                      <Text style={[typography.label.medium, { color: colors.text.secondary }]}>
                        {contribution.note}
                      </Text>
                    ) : null}
                  </View>
                </View>
                <Text style={[typography.headline.small, { color: colors.status.success.text }]}>
                  +MK {contribution.amount.toLocaleString()}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    padding: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCard: {
    padding: 20,
    marginBottom: 24,
  },
  progressHeader: {
    marginBottom: 20,
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBarBg: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historySection: {
    marginTop: 32,
  },
  contributionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  contributionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  smallIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
});
