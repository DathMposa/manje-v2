import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { categoryColors } from '../../theme/colors';
import { formatMWK } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { ManjeText } from '../common/ManjeText';

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: keyof typeof categoryColors;
  icon: keyof typeof Ionicons.glyphMap;
}

interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
  isLast?: boolean;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onEdit,
  onDelete,
  isLast = false,
}) => {
  const { colors, isDark } = useTheme();

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scaleEdit = dragX.interpolate({
      inputRange: [-128, -64, 0],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });

    const scaleDelete = dragX.interpolate({
      inputRange: [-128, -64, 0],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.rightActions}>
        <Animated.View style={{ transform: [{ scale: scaleEdit }] }}>
          <RectButton
            style={[styles.actionButton, { backgroundColor: colors.status.warning.base }]}
            onPress={() => onEdit?.(transaction)}
          >
            <Ionicons name="pencil" size={24} color={colors.text.inverse} />
            <ManjeText variant="label.sm" style={{ color: colors.text.inverse, marginTop: 4 }}>
              Edit
            </ManjeText>
          </RectButton>
        </Animated.View>
        <Animated.View style={{ transform: [{ scale: scaleDelete }] }}>
          <RectButton
            style={[styles.actionButton, { backgroundColor: colors.status.danger.base }]}
            onPress={() => onDelete?.(transaction)}
          >
            <Ionicons name="trash" size={24} color={colors.text.inverse} />
            <ManjeText variant="label.sm" style={{ color: colors.text.inverse, marginTop: 4 }}>
              Delete
            </ManjeText>
          </RectButton>
        </Animated.View>
      </View>
    );
  };

  const isExpense = transaction.amount < 0;
  const amountColor = isExpense ? colors.status.danger.text : colors.status.success.text;
  const categoryToken = categoryColors[transaction.category] || categoryColors.other;

  return (
    <Swipeable renderRightActions={renderRightActions} friction={2} rightThreshold={40}>
      <View
        style={[
          styles.container,
          { backgroundColor: colors.bg.card },
          !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border.light },
        ]}
      >
        <View style={styles.content}>
          {/* Icon Container */}
          <View style={[styles.iconContainer, { backgroundColor: categoryToken.bg }]}>
            <Ionicons name={transaction.icon} size={20} color={categoryToken.fg} />
          </View>

          {/* Text Block */}
          <View style={styles.textContainer}>
            <ManjeText variant="headline.sm" style={{ color: colors.text.primary }} numberOfLines={1}>
              {transaction.merchant}
            </ManjeText>
            <ManjeText variant="body.sm" style={{ color: colors.text.secondary }}>
              {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)} • {transaction.date}
            </ManjeText>
          </View>

          {/* Amount */}
          <View style={styles.amountContainer}>
            <ManjeText variant="financial.sm" style={{ color: amountColor }}>
              {formatMWK(transaction.amount)}
            </ManjeText>
          </View>
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  amountContainer: {
    marginLeft: spacing[3],
    alignItems: 'flex-end',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 64,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
