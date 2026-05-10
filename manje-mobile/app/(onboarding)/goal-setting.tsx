import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Target, Car, Home, GraduationCap, HeartPulse, MoreHorizontal } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { Button } from '../../src/components/common/Button';
import { Input } from '../../src/components/common/Input';
import { layout, spacing } from '../../src/theme/spacing';
import { ManjeCharacter } from '../../src/components/character/ManjeCharacter';
import { useGoalStore } from '../../src/stores';

const GOAL_TYPES = [
  { id: 'emergency', label: 'Emergency Fund', icon: HeartPulse, color: '#36B37E' },
  { id: 'property', label: 'Home / Property', icon: Home, color: '#6554C0' },
  { id: 'vehicle', label: 'Car / Vehicle', icon: Car, color: '#00B8D9' },
  { id: 'education', label: 'Education', icon: GraduationCap, color: '#FFAB00' },
  { id: 'other', label: 'Other', icon: MoreHorizontal, color: '#FF5630' },
];

export default function GoalSettingScreen() {
  const router = useRouter();
  const { colors, typography } = useTheme();
  const addGoal = useGoalStore((state) => state.addGoal);

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [targetAmount, setTargetAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    setIsLoading(true);

    if (selectedType && targetAmount) {
      const selectedGoal = GOAL_TYPES.find((goal) => goal.id === selectedType);

      if (selectedGoal) {
        await addGoal({
          name: selectedGoal.label,
          targetAmount: Number(targetAmount),
        });
      }
    }

    setIsLoading(false);
    router.push('/(onboarding)/income');
  };

  const handleSkip = () => {
    router.push('/(onboarding)/income');
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: colors.background.base }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={[typography.label.large, { color: colors.text.muted }]}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.header}>
            <ManjeCharacter mood="encourage" size="md" animated showIdleFloat />
            <Text style={[typography.display.medium, { color: colors.text.primary, marginTop: spacing.lg, marginBottom: spacing.xs, textAlign: 'center' }]}>
              Let's set a goal
            </Text>
            <Text style={[typography.body.large, { color: colors.text.secondary, textAlign: 'center', marginBottom: spacing['2xl'] }]}>
              People who set goals save 30% more. What are you working towards?
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.typesGrid}>
            {GOAL_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeCard,
                    { 
                      backgroundColor: isSelected ? type.color + '15' : colors.background.card,
                      borderColor: isSelected ? type.color : colors.border.light 
                    }
                  ]}
                  onPress={() => setSelectedType(type.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconWrapper, { backgroundColor: type.color + '20' }]}>
                    <Icon size={24} color={type.color} />
                  </View>
                  <Text style={[
                    typography.label.medium, 
                    { color: isSelected ? colors.text.primary : colors.text.secondary, textAlign: 'center' }
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>

          {selectedType && (
            <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.amountSection}>
              <View style={[styles.amountInputWrapper, { borderBottomColor: colors.border.medium }]}>
                <Text style={[typography.display.medium, { color: colors.text.primary, marginRight: spacing.xs }]}>MK</Text>
                <TextInput
                  style={[styles.amountInput, typography.display.medium, { color: colors.text.primary }]}
                  value={targetAmount}
                  onChangeText={(text) => setTargetAmount(text.replace(/[^0-9]/g, ''))}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.text.muted}
                  autoFocus
                />
              </View>
              <Text style={[typography.body.medium, { color: colors.text.muted, marginTop: spacing.md, textAlign: 'center' }]}>
                How much do you need to save?
              </Text>
            </Animated.View>
          )}

        </ScrollView>

        <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.footer}>
          <Button
            title={selectedType ? "Set This Goal" : "Skip for now"}
            onPress={selectedType ? () => void handleContinue() : handleSkip}
            fullWidth
            size="lg"
            variant={selectedType ? "primary" : "ghost"}
            loading={isLoading}
            disabled={!!selectedType && !targetAmount}
          />
        </Animated.View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing.md,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: layout.screenPaddingH,
  },
  header: {
    alignItems: 'center',
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeCard: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  amountSection: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
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
  footer: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
});
