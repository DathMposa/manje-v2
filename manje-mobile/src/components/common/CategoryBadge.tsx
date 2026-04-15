import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { categoryColors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typeScale } from '../../theme/typography';

export type CategoryType = keyof typeof categoryColors;

interface CategoryBadgeProps {
  category: CategoryType;
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, label, icon }) => {
  const { isDark } = useTheme();
  
  // Get colors
  const colorToken = categoryColors[category] || categoryColors.other;
  
  // Adjust background opacity for dark mode to ensure readability
  const backgroundColor = isDark ? `${colorToken.bg}20` : colorToken.bg;
  const textColor = isDark ? colorToken.fg : colorToken.fg;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {!!icon && (
        <Ionicons 
          name={icon} 
          size={12} 
          color={textColor} 
          style={styles.icon}
        />
      )}
      <Text style={[typeScale['label.sm'], { color: textColor }]}>
        {label || category.charAt(0).toUpperCase() + category.slice(1)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 24,
    borderRadius: radius.full,
    paddingHorizontal: spacing[2] + 2, // 10px
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: spacing[1],
  },
});
