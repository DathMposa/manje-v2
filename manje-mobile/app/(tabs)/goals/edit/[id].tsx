import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Target, Calendar } from 'lucide-react-native';
import { useTheme } from '../../../../src/hooks';
import { ScreenHeader } from '../../../../src/components/common/ScreenHeader';
import { Button } from '../../../../src/components/common/Button';
import { Input } from '../../../../src/components/common/Input';
import { useGoalStore } from '../../../../src/stores';

export default function EditGoalScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const goal = useGoalStore((state) => state.goals.find((item) => item.id === String(id)));
  const updateGoal = useGoalStore((state) => state.updateGoal);

  const [form, setForm] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (goal) {
      setForm({
        name: goal.name,
        targetAmount: String(goal.targetAmount),
        deadline: goal.deadline || '',
      });
    }
  }, [goal]);

  const handleSave = async () => {
    if (!goal) return;

    setIsLoading(true);
    await updateGoal(goal.id, {
      name: form.name,
      targetAmount: Number(form.targetAmount),
      deadline: form.deadline,
    });
    setIsLoading(false);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background.base }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title="Edit Goal" showBack onBackPress={() => router.back()} />

      <ScrollView
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['4xl'] }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.amountContainer}>
          <Text style={[typography.headline.small, { color: colors.text.secondary, marginBottom: spacing.sm }]}>
            Target Amount
          </Text>
          <View style={[styles.amountInputWrapper, { borderBottomColor: colors.border.medium }]}>
            <Text style={[typography.financial.large, { color: colors.text.primary, marginRight: spacing.xs }]}>MK</Text>
            <TextInput
              style={[styles.amountInput, typography.financial.large, { color: colors.text.primary }]}
              value={form.targetAmount}
              onChangeText={(text) => setForm({ ...form, targetAmount: text.replace(/[^0-9]/g, '') })}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.text.muted}
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Input
            label="Goal Name"
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
            leftIcon={<Target size={20} color={colors.text.muted} />}
          />

          <View style={styles.inputSpacing} />

          <Input
            label="Target Date (Optional)"
            value={form.deadline}
            onChangeText={(text) => setForm({ ...form, deadline: text })}
            leftIcon={<Calendar size={20} color={colors.text.muted} />}
            placeholder="Dec 2026"
          />
        </View>

        <View style={styles.actions}>
          <Button
            title="Save Changes"
            onPress={() => void handleSave()}
            fullWidth
            size="lg"
            variant="primary"
            loading={isLoading}
            disabled={!form.name || !form.targetAmount}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  amountContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 16,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    paddingBottom: 8,
    minWidth: 200,
    justifyContent: 'center',
  },
  amountInput: {
    padding: 0,
    margin: 0,
    minWidth: 100,
  },
  formSection: {
    marginBottom: 40,
  },
  inputSpacing: {
    height: 24,
  },
  actions: {
    marginTop: 'auto',
  },
});
