import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Edit2, Plus, Trash2 } from 'lucide-react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { ClayCard } from '../../../src/components/common/ClayCard';
import { useBudgetStore } from '../../../src/stores/budgetStore';
import { categoryColors } from '../../../src/theme/colors';

export default function BudgetDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  
  const budget = useBudgetStore(state => state.getBudget(id as string));
  const deleteBudget = useBudgetStore(state => state.deleteBudget);

  if (!budget) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg.base }]}>
        <ScreenHeader showBack onBackPress={() => router.back()} title="Budget Not Found" />
        <View style={styles.errorContainer}>
          <Text style={[typography.scale['body.md'], { color: colors.text.secondary }]}>This budget could not be found.</Text>
        </View>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Budget",
      "Are you sure you want to delete this budget? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            await deleteBudget(budget.id);
            router.replace('/(tabs)/budgets');
          }
        }
      ]
    );
  };

  const overallPercentage = (budget.totalSpent / budget.totalLimit) * 100;
  
  // A simplified circular progress visualization using border radius
  // In a real app, you'd use a dedicated SVG charting library or react-native-circular-progress
  const renderProgressRing = () => {
    return (
      <View style={styles.ringContainer}>
        <View style={[styles.outerRing, { borderColor: colors.border.light }]}>
          <View style={[styles.innerCircle, { backgroundColor: colors.bg.base }]}>
            <Text style={[typography.scale['display.sm'], { color: colors.text.primary }]}>
              {overallPercentage.toFixed(0)}%
            </Text>
            <Text style={[typography.scale['label.md'], { color: colors.text.secondary }]}>
              Used
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderCategoryBar = (limit: number, spent: number, fgColor: string, bgColor: string) => {
    const percentage = Math.min((spent / limit) * 100, 100);
    const isOver = spent > limit;
    
    return (
      <View style={styles.categoryProgressContainer}>
        <View style={[styles.categoryProgressBar, { backgroundColor: bgColor }]}>
          <View 
            style={[
              styles.categoryProgressFill, 
              { 
                width: `${percentage}%`, 
                backgroundColor: isOver ? colors.status.danger.base : fgColor 
              }
            ]} 
          />
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg.base }]}>
      <ScreenHeader 
        title={budget.name} 
        showBack 
        onBackPress={() => router.back()}
        rightAction={
          <TouchableOpacity onPress={() => router.push(`/(tabs)/budgets/edit/${id}`)} style={styles.headerButton}>
            <Edit2 size={20} color={colors.text.primary} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView 
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['4xl'] }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryContainer}>
          {renderProgressRing()}
          
          <View style={styles.amountsRow}>
            <View style={styles.amountBox}>
              <Text style={[typography.scale['label.md'], { color: colors.text.secondary, marginBottom: spacing.xs }]}>Spent</Text>
              <Text style={[typography.scale['headline.md'], { color: colors.text.primary }]}>MK {budget.totalSpent.toLocaleString()}</Text>
            </View>
            
            <View style={[styles.divider, { backgroundColor: colors.border.light }]} />
            
            <View style={styles.amountBox}>
              <Text style={[typography.scale['label.md'], { color: colors.text.secondary, marginBottom: spacing.xs }]}>Remaining</Text>
              <Text style={[typography.scale['headline.md'], { color: colors.status.success.text }]}>
                MK {(budget.totalLimit - budget.totalSpent).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.categoriesHeader}>
          <Text style={[typography.scale['headline.sm'], { color: colors.text.primary }]}>Categories</Text>
        </View>

        <ClayCard variant="clay" noPadding innerStyle={styles.listCard}>
          {budget.categories.map((cat, index) => {
            const catColors = categoryColors[cat.catKey as keyof typeof categoryColors] || categoryColors.other;
            const leftToSpendCat = cat.limit - cat.spent;
            const isCatOver = cat.spent > cat.limit;

            return (
              <View key={cat.id || index.toString()}>
                <Pressable style={styles.listItem}>
                  <View style={[styles.listIcon, { backgroundColor: catColors.bg }]}>
                    <Feather name={cat.icon as any} size={18} color={catColors.fg} />
                  </View>
                  <View style={styles.listInfo}>
                    <View style={styles.categoryTitleRow}>
                      <Text style={[typography.scale['label.lg'], { color: colors.text.primary }]}>{cat.name}</Text>
                      <Text style={[typography.scale['label.lg'], { color: colors.text.primary }]}>
                        MK {cat.spent.toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.categorySubRow}>
                      <Text style={[typography.scale['body.sm'], { color: isCatOver ? colors.status.danger.text : colors.text.secondary }]}>
                        {isCatOver ? `Over by MK ${Math.abs(leftToSpendCat).toLocaleString()}` : `MK ${leftToSpendCat.toLocaleString()} left`}
                      </Text>
                      <Text style={[typography.scale['body.sm'], { color: colors.text.secondary }]}>
                        of MK {cat.limit.toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.miniProgressWrapper}>
                      {renderCategoryBar(cat.limit, cat.spent, catColors.fg, catColors.bg)}
                    </View>
                  </View>
                </Pressable>
                {index < budget.categories.length - 1 && <View style={[styles.listDivider, { backgroundColor: colors.border.light }]} />}
              </View>
            );
          })}
        </ClayCard>

        <TouchableOpacity 
          style={styles.deleteButtonContainer}
          onPress={handleDelete}
        >
          <View style={[styles.deleteButton, { backgroundColor: `${colors.status.danger.base}15` }]}>
            <Trash2 size={20} color={colors.status.danger.text} />
            <Text style={[typography.scale['label.lg'], { color: colors.status.danger.text, marginLeft: spacing.sm }]}>
              Delete Budget
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    padding: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  summaryContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  outerRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 136,
    height: 136,
    borderRadius: 68,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  amountBox: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: '100%',
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listCard: { paddingVertical: 8 },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16 },
  listIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  listInfo: { flex: 1 },
  categoryTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  categorySubRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  miniProgressWrapper: { marginTop: 2 },
  listDivider: { height: 1, marginLeft: 76, marginRight: 16 },
  categoryProgressContainer: {
    width: '100%',
  },
  categoryProgressBar: {
    height: 6,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  deleteButtonContainer: {
    marginTop: 32,
    marginBottom: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  }
});
