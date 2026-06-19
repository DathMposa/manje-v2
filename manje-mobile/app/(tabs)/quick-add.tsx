/**
 * TXN-03 / NAV-01: Quick Add Transaction Screen
 * Modal-style screen for adding transactions quickly.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInDown,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/hooks/useTheme';
import { useToast } from '../../src/hooks/useToast';
import { Button, ClayCard, Input } from '../../src/components/common';
import { ManjeCharacter } from '../../src/components/character';
import { typeScale } from '../../src/theme/typography';
import { spacing, layout, radius } from '../../src/theme/spacing';
import { categoryColors } from '../../src/theme/colors';
import { useBudgetStore, useTransactionStore } from '../../src/stores';

type TransactionType = 'expense' | 'income' | 'transfer';

interface Category {
  id: string;
  name: string;
  icon: keyof typeof Feather.glyphMap;
  color: { bg: string; fg: string };
}

const EXPENSE_CATEGORIES: Category[] = [
  { id: 'groceries', name: 'Groceries', icon: 'shopping-cart', color: categoryColors.food },
  { id: 'dining', name: 'Dining', icon: 'coffee', color: categoryColors.food },
  { id: 'transport', name: 'Transport', icon: 'truck', color: categoryColors.transport },
  { id: 'utilities', name: 'Utilities', icon: 'zap', color: categoryColors.utilities },
  { id: 'entertainment', name: 'Entertainment', icon: 'film', color: categoryColors.entertainment },
  { id: 'healthcare', name: 'Healthcare', icon: 'heart', color: categoryColors.healthcare },
  { id: 'shopping', name: 'Shopping', icon: 'shopping-bag', color: categoryColors.shopping },
  { id: 'bills', name: 'Bills', icon: 'file-text', color: categoryColors.bills },
  { id: 'education', name: 'Education', icon: 'book', color: categoryColors.education },
  { id: 'other', name: 'Other', icon: 'more-horizontal', color: categoryColors.other },
];

const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salary', icon: 'briefcase', color: categoryColors.income },
  { id: 'freelance', name: 'Freelance', icon: 'edit-3', color: categoryColors.income },
  { id: 'gift', name: 'Gift', icon: 'gift', color: categoryColors.personal },
  { id: 'investment', name: 'Investment', icon: 'trending-up', color: categoryColors.savings },
  { id: 'refund', name: 'Refund', icon: 'rotate-ccw', color: categoryColors.personal },
  { id: 'other', name: 'Other', icon: 'more-horizontal', color: categoryColors.other },
];

export default function QuickAddScreen() {
  const { colors, shadow } = useTheme();
  const { showToast } = useToast();
  const router = useRouter();
  const amountInputRef = useRef<TextInput>(null);
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const recalculateSpending = useBudgetStore((state) => state.recalculateSpending);

  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const currencySymbol = 'MK';
  const currentCategories = transactionType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (type: TransactionType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTransactionType(type);
    setSelectedCategory(null);
  };

  const handleCategorySelect = (category: Category) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category);
  };

  const handleAmountChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) return;
    if (parts[1]?.length > 2) return;
    setAmount(cleaned);
  };

  const saveTransaction = async (keepOpen: boolean) => {
    if (!amount || !selectedCategory) {
      return;
    }

    setLoading(true);

    const numericAmount = Number(amount);
    const transaction = await addTransaction({
      title: note.trim() || selectedCategory.name,
      category: selectedCategory.id,
      amount: numericAmount,
      type: transactionType,
      note: note.trim() || undefined,
      date: new Date().toISOString(),
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLoading(false);

    showToast({
      message: `${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)} saved successfully`,
      type: 'success',
    });

    if (keepOpen) {
      setAmount('');
      setSelectedCategory(null);
      setNote('');
      amountInputRef.current?.focus();
      return;
    }

    router.back();
  };

  const isValid = Boolean(amount && Number(amount) > 0 && selectedCategory);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg.base }]} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="x" size={24} color={colors.text.primary} />
          </Pressable>
          <Text style={[styles.headerTitle, typeScale['headline.md'], { color: colors.text.primary }]}>
            Add Transaction
          </Text>
          <View style={styles.headerRight} />
        </Animated.View>

        <View style={styles.scrollContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View entering={FadeInDown.delay(100).duration(400)}>
              <View style={[styles.typeSelector, { backgroundColor: colors.bg.sunken }]}>
                {(['expense', 'income', 'transfer'] as TransactionType[]).map((type) => (
                  <Pressable
                    key={type}
                    onPress={() => handleTypeChange(type)}
                    style={[
                      styles.typeButton,
                      transactionType === type && { backgroundColor: colors.bg.card },
                      transactionType === type && shadow('sm'),
                    ]}
                  >
                    <Feather
                      name={type === 'expense' ? 'minus-circle' : type === 'income' ? 'plus-circle' : 'repeat'}
                      size={18}
                      color={transactionType === type ? colors.primary.default : colors.text.secondary}
                    />
                    <Text
                      style={[
                        styles.typeButtonText,
                        typeScale['label.md'],
                        { color: transactionType === type ? colors.primary.default : colors.text.secondary },
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.amountSection}>
              <Text style={[styles.amountLabel, typeScale['label.md'], { color: colors.text.secondary }]}>
                Amount
              </Text>
              <View style={styles.amountInputRow}>
                <Text style={[styles.currencySymbol, typeScale['financial.sm'], { color: colors.text.secondary }]}>
                  {currencySymbol}
                </Text>
                <TextInput
                  ref={amountInputRef}
                  style={[styles.amountInput, typeScale['financial.lg'], { color: colors.text.primary }]}
                  value={amount}
                  onChangeText={handleAmountChange}
                  placeholder="0"
                  placeholderTextColor={colors.text.secondary}
                  keyboardType="decimal-pad"
                  autoFocus
                />
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.categorySection}>
              <Text style={[styles.sectionTitle, typeScale['label.md'], { color: colors.text.secondary }]}>
                Category
              </Text>
              <View style={styles.categoryGrid}>
                {currentCategories.map((category) => {
                  const isSelected = selectedCategory?.id === category.id;
                  return (
                    <Pressable
                      key={category.id}
                      onPress={() => handleCategorySelect(category)}
                      style={[
                        styles.categoryItem,
                        {
                          backgroundColor: isSelected ? category.color.bg : colors.bg.card,
                          borderColor: isSelected ? category.color.fg : colors.border.light,
                        },
                        shadow('xs'),
                      ]}
                    >
                      <View
                        style={[
                          styles.categoryIcon,
                          { backgroundColor: isSelected ? colors.bg.card : category.color.bg },
                        ]}
                      >
                        <Feather name={category.icon} size={20} color={category.color.fg} />
                      </View>
                      <Text
                        style={[
                          styles.categoryName,
                          typeScale['label.sm'],
                          { color: isSelected ? category.color.fg : colors.text.secondary },
                        ]}
                        numberOfLines={1}
                      >
                        {category.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.noteSection}>
              <Input
                label="Note (optional)"
                value={note}
                onChangeText={setNote}
                leftIcon={<Feather name="edit-3" size={20} color={colors.text.secondary} />}
              />
            </Animated.View>

            {selectedCategory && (
              <Animated.View entering={FadeInUp.delay(100).duration(300)}>
                <ClayCard variant="subtle" style={{ backgroundColor: colors.primary.subtle }}>
                  <View style={styles.aiSuggestion}>
                    <ManjeCharacter mood="thinking" size="sm" variant="badge" />
                    <View style={styles.aiSuggestionText}>
                      <Text style={[typeScale['label.md'], { color: colors.primary.default }]}>Quick tip</Text>
                      <Text
                        style={[
                          typeScale['body.sm'],
                          { color: colors.text.secondary, marginTop: 2 },
                        ]}
                      >
                        Every transaction you save now will show up on your dashboard and activity feed immediately.
                      </Text>
                    </View>
                  </View>
                </ClayCard>
              </Animated.View>
            )}
          </ScrollView>
          <LinearGradient
            colors={['transparent', colors.bg.base]}
            style={styles.scrollFade}
            pointerEvents="none"
          />
        </View>

        <Animated.View entering={SlideInDown.delay(500).duration(400)} style={styles.footer}>
          {!isValid && (
            <Animated.Text
              entering={FadeInDown.duration(300)}
              style={[typeScale['body.sm'], styles.helperText, { color: colors.status.warning.text }]}
            >
              {!amount || Number(amount) <= 0
                ? 'Please enter an amount.'
                : 'Please select a category to save.'}
            </Animated.Text>
          )}
          <View style={styles.footerButtons}>
            <Button
              title={`Save ${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}`}
              onPress={() => saveTransaction(false)}
              variant="primary"
              size="lg"
              fullWidth
              disabled={!isValid}
              loading={loading}
              style={{ flex: 1 }}
            />
            {isValid && (
              <Animated.View entering={FadeIn.duration(300)} style={{ marginLeft: spacing[3] }}>
                <Pressable
                  style={[styles.addAnotherButton, { backgroundColor: colors.bg.card }, shadow('sm')]}
                  onPress={() => saveTransaction(true)}
                  disabled={loading}
                >
                  <Feather name="plus" size={24} color={colors.primary.default} />
                </Pressable>
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingH,
    paddingVertical: spacing[3],
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {},
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: spacing[4],
  },
  typeSelector: {
    flexDirection: 'row',
    padding: spacing[1],
    borderRadius: radius.xl,
    marginBottom: spacing[6],
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[3],
    borderRadius: radius.lg,
    gap: spacing[2],
  },
  typeButtonText: {},
  amountSection: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  amountLabel: {
    marginBottom: spacing[2],
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencySymbol: {
    marginRight: spacing[2],
  },
  amountInput: {
    minWidth: 50,
    textAlign: 'center',
    padding: 0,
    margin: 0,
  },
  categorySection: {
    marginBottom: spacing[5],
  },
  sectionTitle: {
    marginBottom: spacing[3],
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  categoryItem: {
    width: '31%',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: radius.xl,
    borderWidth: 1.5,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  categoryName: {
    textAlign: 'center',
  },
  noteSection: {
    marginBottom: spacing[4],
  },
  aiSuggestion: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiSuggestionText: {
    flex: 1,
    marginLeft: spacing[3],
  },
  footer: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: spacing[6],
    paddingTop: spacing[3],
  },
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helperText: {
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  addAnotherButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
