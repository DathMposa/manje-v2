import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { RectButton } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { categoryColors } from '../../theme/colors';
import { formatMWK, typeScale } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

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
            style={[styles.actionButton, { backgroundColor: colors.status.warning }]}
            onPress={() => onEdit?.(transaction)}
          >
            <Ionicons name="pencil" size={24} color={colors.text.inverse} />
            <Text style={[typeScale['label.sm'], { color: colors.text.inverse, marginTop: 4 }]}>
              Edit
            </Text>
          </RectButton>
        </Animated.View>
        <Animated.View style={{ transform: [{ scale: scaleDelete }] }}>
          <RectButton
            style={[styles.actionButton, { backgroundColor: colors.status.danger }]}
            onPress={() => onDelete?.(transaction)}
          >
            <Ionicons name="trash" size={24} color={colors.text.inverse} />
            <Text style={[typeScale['label.sm'], { color: colors.text.inverse, marginTop: 4 }]}>
              Delete
            </Text>
          </RectButton>
        </Animated.View>
      </View>
    );
  };

  const isExpense = transaction.amount < 0;
  const amountColor = isExpense ? colors.status.danger : colors.status.success;
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
            <Text style={[typeScale['headline.sm'], { color: colors.text.primary }]} numberOfLines={1}>
              {transaction.merchant}
            </Text>
            <Text style={[typeScale['body.sm'], { color: colors.text.secondary }]}>
              {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)} • {transaction.date}
            </Text>
          </View>

          {/* Amount */}
          <View style={styles.amountContainer}>
            <Text style={[typeScale['financial.sm'], { color: amountColor }]}>
              {formatMWK(transaction.amount)}
            </Text>
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
