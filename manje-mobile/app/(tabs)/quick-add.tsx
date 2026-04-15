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
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/hooks/useTheme';
import { Button, ClayCard, Input } from '../../src/components/common';
import { ManjeCharacter } from '../../src/components/character';
import { typeScale } from '../../src/theme/typography';
import { spacing, layout, radius } from '../../src/theme/spacing';
import { categoryColors } from '../../src/theme/colors';

type TransactionType = 'expense' | 'income' | 'transfer';

interface Category {
  id: string;
  name: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
}

const EXPENSE_categoryColors: Category[] = [
  { id: 'groceries', name: 'Groceries', icon: 'shopping-cart', color: categoryColors.food.bg },
  { id: 'dining', name: 'Dining', icon: 'coffee', color: categoryColors.food.bg },
  { id: 'transport', name: 'Transport', icon: 'truck', color: categoryColors.transport.bg },
  { id: 'utilities', name: 'Utilities', icon: 'zap', color: categoryColors.utilities.bg },
  { id: 'entertainment', name: 'Entertainment', icon: 'film', color: categoryColors.entertainment.bg },
  { id: 'healthcare', name: 'Healthcare', icon: 'heart', color: categoryColors.healthcare.bg },
  { id: 'shopping', name: 'Shopping', icon: 'shopping-bag', color: categoryColors.shopping.bg },
  { id: 'bills', name: 'Bills', icon: 'file-text', color: categoryColors.bills.bg },
  { id: 'education', name: 'Education', icon: 'book', color: categoryColors.education.bg },
  { id: 'other', name: 'Other', icon: 'more-horizontal', color: categoryColors.other.bg },
];

const INCOME_categoryColors: Category[] = [
  { id: 'salary', name: 'Salary', icon: 'briefcase', color: categoryColors.income.bg },
  { id: 'freelance', name: 'Freelance', icon: 'edit-3', color: '#10B981' },
  { id: 'gift', name: 'Gift', icon: 'gift', color: '#EC4899' },
  { id: 'investment', name: 'Investment', icon: 'trending-up', color: '#8B5CF6' },
  { id: 'refund', name: 'Refund', icon: 'rotate-ccw', color: '#06B6D4' },
  { id: 'other', name: 'Other', icon: 'more-horizontal', color: categoryColors.other.bg },
];

export default function QuickAddScreen() {
  const { colors, shadow } = useTheme();
  const router = useRouter();
  const amountInputRef = useRef<TextInput>(null);
  
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  
  const currencySymbol = 'MK';
  
  const currentcategoryColors = transactionType === 'income' ? INCOME_categoryColors : EXPENSE_categoryColors;
  
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
    // Only allow numbers and one decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) return;
    if (parts[1]?.length > 2) return;
    setAmount(cleaned);
  };
  
  const handleSave = async () => {
    if (!amount || !selectedCategory) return;
    
    setLoading(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    router.back();
  };
  
  const isValid = amount && parseFloat(amount) > 0 && selectedCategory;
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg.base }]} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <Pressable 
            onPress={() => router.back()}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="x" size={24} color={colors.text.primary} />
          </Pressable>
          <Text style={[styles.headerTitle, typeScale.headlineMedium, { color: colors.text.primary }]}>
            Add Transaction
          </Text>
          <View style={styles.headerRight} />
        </Animated.View>
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Transaction Type Selector */}
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
                      typeScale.labelMedium, 
                      { color: transactionType === type ? colors.primary.default : colors.text.secondary }
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
          
          {/* Amount Input */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.amountSection}>
            <Text style={[styles.amountLabel, typeScale.labelMedium, { color: colors.text.secondary }]}>
              Amount
            </Text>
            <View style={styles.amountInputRow}>
              <Text style={[styles.currencySymbol, typeScale.displayMedium, { color: colors.text.secondary }]}>
                {currencySymbol}
              </Text>
              <TextInput
                ref={amountInputRef}
                style={[styles.amountInput, typeScale.heroMetric, { color: colors.text.primary }]}
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="0"
                placeholderTextColor={colors.text.secondary}
                keyboardType="decimal-pad"
                autoFocus
              />
            </View>
          </Animated.View>
          
          {/* Category Selection */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.categorySection}>
            <Text style={[styles.sectionTitle, typeScale.labelMedium, { color: colors.text.secondary }]}>
              Category
            </Text>
            <View style={styles.categoryGrid}>
              {currentcategoryColors.map((category, index) => {
                const isSelected = selectedCategory?.id === category.id;
                return (
                  <Pressable
                    key={category.id}
                    onPress={() => handleCategorySelect(category)}
                    style={[
                      styles.categoryItem,
                      {
                        backgroundColor: isSelected ? `${category.color}20` : colors.bg.card,
                        borderColor: isSelected ? category.color : colors.border.light,
                      },
                      shadow('xs'),
                    ]}
                  >
                    <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                      <Feather name={category.icon} size={20} color={category.color} />
                    </View>
                    <Text 
                      style={[
                        styles.categoryName, 
                        typeScale.labelSmall, 
                        { color: isSelected ? category.color : colors.text.secondary }
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
          
          {/* Note Input */}
          <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.noteSection}>
            <Input
              label="Note (optional)"
              value={note}
              onChangeText={setNote}
              leftIcon={<Feather name="edit-3" size={20} color={colors.text.secondary} />}
            />
          </Animated.View>
          
          {/* AI Suggestion */}
          {selectedCategory && (
            <Animated.View entering={FadeInUp.delay(100).duration(300)}>
              <ClayCard variant="subtle" style={{ backgroundColor: colors.primary.subtle }}>
                <View style={styles.aiSuggestion}>
                  <ManjeCharacter mood="thinking" size="sm" />
                  <View style={styles.aiSuggestionText}>
                    <Text style={[typeScale.labelMedium, { color: colors.primary.default }]}>
                      💡 Quick tip
                    </Text>
                    <Text style={[typeScale.bodySmall, { color: colors.text.secondary, marginTop: 2 }]}>
                      You usually spend around MK 15,000 on {selectedCategory.name.toLowerCase()} per week.
                    </Text>
                  </View>
                </View>
              </ClayCard>
            </Animated.View>
          )}
        </ScrollView>
        
        {/* Save Button */}
        <Animated.View entering={SlideInDown.delay(500).duration(400)} style={styles.footer}>
          <Button
            title={`Save ${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}`}
            onPress={handleSave}
            variant="primary"
            size="lg"
            fullWidth
            disabled={!isValid}
            loading={loading}
          />
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
    alignItems: 'baseline',
  },
  currencySymbol: {
    marginRight: spacing[2],
  },
  amountInput: {
    minWidth: 100,
    textAlign: 'center',
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
});
