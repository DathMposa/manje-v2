import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Target } from 'lucide-react-native';
import { useTheme } from '../../../../src/hooks';
import { ScreenHeader } from '../../../../src/components/common/ScreenHeader';
import { Button } from '../../../../src/components/common/Button';
import { Input } from '../../../../src/components/common/Input';
import { ClayCard } from '../../../../src/components/common/ClayCard';
import { ManjeCharacter } from '../../../../src/components/character/ManjeCharacter';
import { useGoalStore } from '../../../../src/stores';

export default function CreateGoalScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const addGoal = useGoalStore((state) => state.addGoal);

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getRequiredMonthly = () => {
    if (!targetAmount) return 0;
    const target = Number(targetAmount) || 0;
    const months = 6;
    return target / months;
  };

  const handleSave = async () => {
    setIsLoading(true);
    const goal = await addGoal({
      name,
      targetAmount: Number(targetAmount),
      deadline,
    });
    setIsLoading(false);
    router.replace({
      pathname: '/(tabs)/goals/[id]',
      params: { id: goal.id },
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background.base }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title="Set Savings Goal" showBack onBackPress={() => router.back()} />

      <ScrollView
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['4xl'] }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <ManjeCharacter mood="encourage" size="md" animated showIdleFloat />
          <Text style={[typography.headline.small, { color: colors.text.secondary, textAlign: 'center', marginTop: spacing.lg }]}>
            What are you saving for?
          </Text>
        </View>

        <View style={styles.formSection}>
          <Input
            label="Goal Name (e.g. Emergency Fund)"
            value={name}
            onChangeText={setName}
            leftIcon={<Target size={20} color={colors.text.muted} />}
          />

          <View style={styles.inputSpacing} />

          <Input
            label="Target Amount (MK)"
            value={targetAmount}
            onChangeText={(text) => setTargetAmount(text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            placeholder="0"
          />

          <View style={styles.inputSpacing} />

          <Input
            label="Target Date (Optional)"
            value={deadline}
            onChangeText={setDeadline}
            leftIcon={<Calendar size={20} color={colors.text.muted} />}
            placeholder="Dec 2026"
          />
        </View>

        {targetAmount ? (
          <ClayCard variant="subtle" style={styles.projectionCard}>
            <View style={styles.projectionHeader}>
              <Text style={[typography.headline.small, { color: colors.text.primary }]}>Monthly Target</Text>
              <View style={[styles.badge, { backgroundColor: `${colors.primary.base}20` }]}>
                <Text style={[typography.label.small, { color: colors.primary.base }]}>Recommended</Text>
              </View>
            </View>

            <Text style={[typography.financial.large, { color: colors.primary.base, marginTop: spacing.md }]}>
              MK {getRequiredMonthly().toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </Text>
            <Text style={[typography.body.medium, { color: colors.text.secondary, marginTop: spacing.xs }]}>
              per month to reach your goal comfortably.
            </Text>
          </ClayCard>
        ) : null}

        <View style={styles.actions}>
          <Button
            title="Create Goal"
            onPress={() => void handleSave()}
            fullWidth
            size="lg"
            variant="primary"
            loading={isLoading}
            disabled={!name || !targetAmount}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  formSection: {
    marginBottom: 24,
  },
  inputSpacing: {
    height: 16,
  },
  projectionCard: {
    padding: 20,
    marginBottom: 32,
  },
  projectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  actions: {
    marginTop: 'auto',
  },
});
