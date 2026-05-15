import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Trash2 } from 'lucide-react-native';
import { useTheme } from '../../../../src/hooks';
import { ScreenHeader } from '../../../../src/components/common/ScreenHeader';
import { Button } from '../../../../src/components/common/Button';
import { Input } from '../../../../src/components/common/Input';
import { ClayCard } from '../../../../src/components/common/ClayCard';
import { useBudgetStore, BudgetCategory } from '../../../../src/stores/budgetStore';

export default function ManualBudgetScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  
  const addBudget = useBudgetStore(state => state.addBudget);

  const [name, setName] = useState('My Budget');
  const [totalIncome, setTotalIncome] = useState('');
  const [isPrimary, setIsPrimary] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Default categories
  const [categories, setCategories] = useState([
    { id: '1', name: 'Groceries', limit: '' },
    { id: '2', name: 'Transport', limit: '' },
    { id: '3', name: 'Utilities', limit: '' }
  ]);

  const totalAllocated = categories.reduce((sum, cat) => sum + (parseFloat(cat.limit) || 0), 0);
  const unallocated = (parseFloat(totalIncome) || 0) - totalAllocated;

  const handleUpdateCategory = (id: string, limit: string) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, limit: limit.replace(/[^0-9]/g, '') } : cat
    ));
  };

  const handleRemoveCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleAddCategory = () => {
    const newId = (categories.length + 1).toString();
    setCategories([...categories, { id: newId, name: 'New Category', limit: '' }]);
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    const formattedCategories: BudgetCategory[] = categories.map(cat => ({
      id: Math.random().toString(36).substring(7),
      name: cat.name,
      limit: parseFloat(cat.limit) || 0,
      spent: 0,
      icon: 'circle',
      catKey: 'other'
    }));

    await addBudget({
      name,
      totalLimit: parseFloat(totalIncome) || 0,
      totalSpent: 0,
      isPrimary,
      categories: formattedCategories,
    });
    setIsLoading(false);
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: colors.bg.base }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader 
        title="Create Budget" 
        showBack 
        onBackPress={() => router.back()}
      />
      
      <ScrollView 
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['4xl'] }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ClayCard variant="clay" style={styles.card}>
          <Input
            label="Budget Name"
            value={name}
            onChangeText={setName}
          />

          <View style={styles.inputSpacing} />

          <Input
            label="Total Monthly Income (MK)"
            value={totalIncome}
            onChangeText={(text) => setTotalIncome(text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            placeholder="0"
          />

          <View style={[styles.switchContainer, { marginTop: spacing.xl }]}>
            <View>
              <Text style={[typography.scale['headline.sm'], { color: colors.text.primary }]}>Primary Budget</Text>
              <Text style={[typography.scale['body.md'], { color: colors.text.secondary }]}>Use this for dashboard calculations</Text>
            </View>
            <Switch
              value={isPrimary}
              onValueChange={setIsPrimary}
              trackColor={{ false: colors.border.light, true: colors.primary.default }}
              thumbColor={colors.text.inverse}
            />
          </View>
        </ClayCard>

        <View style={styles.allocationSummary}>
          <View style={styles.allocationBox}>
            <Text style={[typography.scale['label.md'], { color: colors.text.secondary, marginBottom: spacing.xs }]}>Allocated</Text>
            <Text style={[typography.scale['headline.sm'], { color: colors.text.primary }]}>MK {totalAllocated.toLocaleString()}</Text>
          </View>
          <View style={styles.allocationBox}>
            <Text style={[typography.scale['label.md'], { color: colors.text.secondary, marginBottom: spacing.xs }]}>Unallocated</Text>
            <Text style={[typography.scale['headline.sm'], { color: unallocated < 0 ? colors.status.danger.text : colors.status.success.text }]}>
              MK {unallocated.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[typography.scale['headline.sm'], { color: colors.text.primary }]}>Categories</Text>
          <TouchableOpacity onPress={handleAddCategory} style={styles.addButton}>
            <Plus size={20} color={colors.primary.default} />
            <Text style={[typography.scale['label.lg'], { color: colors.primary.default, marginLeft: 4 }]}>Add</Text>
          </TouchableOpacity>
        </View>

        {categories.map((cat, index) => (
          <View key={cat.id} style={styles.categoryRow}>
            <View style={styles.categoryInputWrapper}>
              <Input
                label={`Category ${index + 1}`}
                value={cat.name}
                onChangeText={(text) => setCategories(categories.map(c => c.id === cat.id ? { ...c, name: text } : c))}
              />
            </View>
            <View style={styles.limitInputWrapper}>
              <Input
                label="Limit"
                value={cat.limit}
                onChangeText={(text) => handleUpdateCategory(cat.id, text)}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
            {categories.length > 1 && (
              <TouchableOpacity 
                style={[styles.removeButton, { backgroundColor: `${colors.status.danger.base}20` }]}
                onPress={() => handleRemoveCategory(cat.id)}
              >
                <Trash2 size={20} color={colors.status.danger.text} />
              </TouchableOpacity>
            )}
          </View>
        ))}

        <View style={styles.actions}>
          <Button
            title="Save Budget"
            onPress={() => void handleSave()}
            fullWidth
            size="lg"
            variant="primary"
            loading={isLoading}
            disabled={!name || !totalIncome || unallocated < 0}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 24,
  },
  inputSpacing: {
    height: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  allocationSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  allocationBox: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  categoryInputWrapper: {
    flex: 2,
    marginRight: 12,
  },
  limitInputWrapper: {
    flex: 1.5,
  },
  removeButton: {
    width: 44,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    marginTop: 0,
  },
  actions: {
    marginTop: 32,
  }
});
