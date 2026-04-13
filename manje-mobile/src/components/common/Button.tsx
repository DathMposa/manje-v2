/**
 * Button Component
 * Premium button with Claymorphism styling and micro-interactions.
 * 
 * Variants: primary, secondary, outline, ghost
 * Sizes: sm, md, lg
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { radius, layout } from '../../theme/spacing';
import { typeScale } from '../../theme/typography';
import { springConfigs, animationPresets } from '../../theme/animations';
import { gradients } from '../../theme/gradients';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
}) => {
  const { colors, shadow, isDark } = useTheme();
  const scale = useSharedValue(1);
  const pressed = useSharedValue(0);
  
  const handlePressIn = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(
        animationPresets.buttonPress.scale.pressed,
        springConfigs.buttonPress
      );
      pressed.value = withSpring(1, springConfigs.buttonPress);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, springConfigs.buttonPress);
    pressed.value = withSpring(0, springConfigs.buttonPress);
  };
  
  const handlePress = () => {
    if (!disabled && !loading) {
      onPress();
    }
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.5 : animationPresets.buttonPress.opacity.released,
  }));
  
  const getHeight = (): number => {
    switch (size) {
      case 'sm': return layout.buttonHeightSm;
      case 'lg': return layout.buttonHeightLg;
      case 'md':
      default: return layout.buttonHeightMd;
    }
  };
  
  const getTextStyle = (): TextStyle => {
    const baseStyle = size === 'sm' ? typeScale.labelMedium : typeScale.labelLarge;
    return baseStyle;
  };
  
  const getVariantStyles = (): {
    container: ViewStyle;
    text: TextStyle;
    showGradient: boolean;
  } => {
    switch (variant) {
      case 'secondary':
        return {
          container: {
            backgroundColor: colors.bg.sunken,
            ...shadow('sm'),
          },
          text: { color: colors.text.primary },
          showGradient: false,
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: colors.primary.main,
          },
          text: { color: colors.primary.main },
          showGradient: false,
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
          },
          text: { color: colors.primary.main },
          showGradient: false,
        };
      case 'primary':
      default:
        return {
          container: {
            backgroundColor: colors.primary.main,
            ...shadow('md'),
          },
          text: { color: colors.text.inverse },
          showGradient: true,
        };
    }
  };
  
  const variantStyles = getVariantStyles();
  const height = getHeight();
  const textStyle = getTextStyle();
  
  const ButtonContent = (
    <>
      {loading ? (
        <ActivityIndicator
          color={variantStyles.text.color}
          size={size === 'sm' ? 'small' : 'small'}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text
            style={[
              styles.text,
              textStyle,
              variantStyles.text,
              icon && iconPosition === 'left' ? styles.textWithIconLeft : null,
              icon && iconPosition === 'right' ? styles.textWithIconRight : null,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </>
  );
  
  if (variant === 'primary' && variantStyles.showGradient) {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.container,
          { height, width: fullWidth ? '100%' : undefined },
          animatedStyle,
          style,
        ]}
      >
        <LinearGradient
          colors={[colors.primary.main, colors.primary.hover]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[
            styles.gradient,
            variantStyles.container,
            { borderRadius: radius.full },
          ]}
        >
          {/* Button shine overlay */}
          <LinearGradient
            colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.shine, { height: height * 0.4 }]}
          />
          {ButtonContent}
        </LinearGradient>
      </AnimatedPressable>
    );
  }
  
  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.container,
        styles.gradient,
        variantStyles.container,
        {
          height,
          width: fullWidth ? '100%' : undefined,
          borderRadius: radius.full,
        },
        animatedStyle,
        style,
      ]}
    >
      {ButtonContent}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: radius.full,
    borderTopRightRadius: radius.full,
  },
  text: {
    textAlign: 'center',
  },
  textWithIconLeft: {
    marginLeft: 8,
  },
  textWithIconRight: {
    marginRight: 8,
  },
});

export default Button;
