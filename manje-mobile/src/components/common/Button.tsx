import React from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { radius, layout } from '../../theme/spacing';
import { typeScale } from '../../theme/typography';
import { springPresets } from '../../theme/animations';
import { gradients } from '../../theme/gradients';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const { colors, shadow, isDark } = useTheme();
  const scale = useSharedValue(1);

  const isInteractive = !disabled && !loading;

  const handlePressIn = () => {
    if (isInteractive) {
      scale.value = withSpring(0.96, springPresets.buttonPress);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    if (isInteractive) {
      scale.value = withSpring(1.0, springPresets.cardRelease);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getContainerStyle = () => {
    const baseHeight = layout.buttonHeights[size];
    
    let baseStyle: ViewStyle = {
      height: baseHeight,
      borderRadius: radius.full,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: size === 'lg' ? 32 : size === 'md' ? 24 : 16,
      opacity: disabled ? 0.5 : 1,
      alignSelf: fullWidth ? 'stretch' : 'flex-start',
    };

    switch (variant) {
      case 'primary':
        return [baseStyle, shadow('md'), { backgroundColor: colors.primary.default }];
      case 'secondary':
        return [baseStyle, { backgroundColor: colors.primary.subtle }];
      case 'outline':
        return [baseStyle, { borderWidth: 1, borderColor: colors.primary.default, backgroundColor: 'transparent' }];
      case 'ghost':
        return [baseStyle, { backgroundColor: 'transparent' }];
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const fontStyle = size === 'sm' ? typeScale['label.md'] : size === 'md' ? typeScale['headline.sm'] : typeScale['headline.md'];
    
    switch (variant) {
      case 'primary':
        return { ...fontStyle, color: colors.text.inverse };
      case 'secondary':
      case 'outline':
        return { ...fontStyle, color: colors.primary.default };
      case 'ghost':
        return { ...fontStyle, color: colors.text.secondary };
      default:
        return fontStyle;
    }
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color={variant === 'primary' ? colors.text.inverse : colors.primary.default} size="small" />;
    }
    return (
      <>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      </>
    );
  };

  const containerStyle = getContainerStyle();

  return (
    <AnimatedPressable
      onPress={isInteractive ? onPress : undefined}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[containerStyle, animatedStyle, style]}
      pointerEvents={loading ? 'none' : 'auto'}
    >
      {renderContent()}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginRight: 8,
  },
});
