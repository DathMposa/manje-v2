import React from 'react';
import { View, StyleSheet, ScrollView, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../../src/hooks';
import { Button } from '../../../src/components/common/Button';
import { useBudgetStore } from '../../../src/stores/budgetStore';
import { layout, spacing, radius } from '../../../src/theme/spacing';

export default function BudgetsListScreen() {
  const router = useRouter();
  const { colors, typography, shadow } = useTheme();
  const budgets = useBudgetStore(state => state.budgets);

  const handleCreateBudget = () => {
    router.push('/(tabs)/budgets/create/manual');
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather name="pie-chart" size={48} color={colors.text.secondary} />
      <Text style={[styles.emptyText, typography.scale['headline.sm'], { color: colors.text.primary }]}>
        No Budgets Yet
      </Text>
      <Text style={[typography.scale['body.md'], { color: colors.text.secondary, textAlign: 'center', marginTop: spacing[2], marginBottom: spacing[6], paddingHorizontal: spacing[4] }]}>
        Create a budget to start tracking your spending and reaching your financial goals.
      </Text>
      <Button
        title="Create Budget"
        onPress={handleCreateBudget}
        icon={<Feather name="plus" size={20} color={colors.text.inverse} />}
        size="lg"
        variant="primary"
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg.base }]} edges={['top']}>
      {/* Header matching Activity/Profile */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, typography.scale['display.sm'], { color: colors.text.primary }]}>
          Budgets
        </Text>
        <Pressable 
          style={[styles.addButton, { backgroundColor: colors.bg.card }, shadow('sm')]}
          onPress={handleCreateBudget}
        >
          <Feather name="plus" size={20} color={colors.text.primary} />
        </Pressable>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {budgets.length === 0 ? renderEmptyState() : (
          <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.listContainer}>
            {budgets.map((budget) => {
              const overallPercentage = (budget.totalSpent / budget.totalLimit) * 100;
              const leftToSpend = budget.totalLimit - budget.totalSpent;
              const isDanger = overallPercentage > 100;
              const isWarning = overallPercentage > 85 && !isDanger;

              let progressColor = colors.primary.default;
              if (isWarning) progressColor = colors.status.warning.base;
              if (isDanger) progressColor = colors.status.danger.base;

              return (
                <Pressable
                  key={budget.id}
                  onPress={() => router.push(`/(tabs)/budgets/${budget.id}`)}
                  style={[styles.budgetItem, { backgroundColor: colors.bg.card }, shadow('sm')]}
                >
                  <View style={styles.budgetMainRow}>
                    <View style={[styles.budgetIcon, { backgroundColor: budget.isPrimary ? colors.primary.subtle : colors.bg.sunken }]}>
                      <Feather name="pie-chart" size={20} color={budget.isPrimary ? colors.primary.default : colors.text.secondary} />
                    </View>
                    
                    <View style={styles.budgetInfo}>
                      <View style={styles.budgetTitleRow}>
                        <Text style={[styles.budgetTitle, typography.scale['label.lg'], { color: colors.text.primary }]}>
                          {budget.name}
                        </Text>
                        {budget.isPrimary && (
                          <View style={[styles.primaryBadge, { backgroundColor: colors.primary.default + '15' }]}>
                            <Text style={[typography.scale['label.sm'], { color: colors.primary.default }]}>Primary</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[typography.scale['body.sm'], { color: colors.text.secondary }]}>
                        {overallPercentage.toFixed(0)}% used of MK {budget.totalLimit.toLocaleString()}
                      </Text>
                    </View>
                    
                    <View style={styles.budgetAmountBox}>
                      <Text style={[typography.scale['label.lg'], { color: isDanger ? colors.status.danger.text : colors.text.primary }]}>
                        MK {Math.max(0, leftToSpend).toLocaleString()}
                      </Text>
                      <Text style={[typography.scale['body.sm'], { color: colors.text.secondary, textAlign: 'right' }]}>
                        Left
                      </Text>
                    </View>
                  </View>

                  <View style={styles.progressWrapper}>
                    <View style={[styles.progressBarBg, { backgroundColor: colors.border.light }]}>
                      <View 
                        style={[
                          styles.progressBarFill, 
                          { width: `${Math.min(overallPercentage, 100)}%`, backgroundColor: progressColor }
                        ]} 
                      />
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </Animated.View>
        )}
      </ScrollView>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: spacing[8],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[16],
  },
  emptyText: {
    marginTop: spacing[3],
  },
  listContainer: {
    gap: spacing[3],
  },
  budgetItem: {
    padding: spacing[4],
    borderRadius: radius['2xl'],
  },
  budgetMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  budgetIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  budgetInfo: {
    flex: 1,
  },
  budgetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: spacing[2],
  },
  budgetTitle: {},
  primaryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.md,
  },
  budgetAmountBox: {
    alignItems: 'flex-end',
    marginLeft: spacing[2],
  },
  progressWrapper: {
    width: '100%',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  }
});
