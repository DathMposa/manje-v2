/**
 * ClayCard Component
 * Claymorphism card with inner highlight and shadow effects.
 * 
 * Variants: clay (default), hero, inset, subtle
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Pressable,
  PressableProps,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { radius, spacing } from '../../theme/spacing';
import { springConfigs, animationPresets } from '../../theme/animations';
import { gradients } from '../../theme/gradients';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type CardVariant = 'clay' | 'hero' | 'inset' | 'subtle';

interface ClayCardProps extends Omit<PressableProps, 'style'> {
  variant?: CardVariant;
  children: React.ReactNode;
  style?: ViewStyle;
  innerStyle?: ViewStyle;
  pressable?: boolean;
  highlightHeight?: number;
}

export const ClayCard: React.FC<ClayCardProps> = ({
  variant = 'clay',
  children,
  style,
  innerStyle,
  pressable = false,
  highlightHeight,
  onPress,
  ...pressableProps
}) => {
  const { colors, shadow, isDark } = useTheme();
  const scale = useSharedValue(1);
  
  const handlePressIn = () => {
    if (pressable || onPress) {
      scale.value = withSpring(
        animationPresets.cardPress.scale.pressed,
        springConfigs.cardPress
      );
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const handlePressOut = () => {
    if (pressable || onPress) {
      scale.value = withSpring(1, springConfigs.cardPress);
    }
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const getVariantStyles = (): {
    container: ViewStyle;
    highlight: { height: number; opacity: number };
    showGradient: boolean;
  } => {
    switch (variant) {
      case 'hero':
        return {
          container: {
            backgroundColor: 'transparent',
            borderRadius: radius['4xl'],
            ...shadow('xl'),
          },
          highlight: { height: highlightHeight || 48, opacity: 0.5 },
          showGradient: true,
        };
      case 'inset':
        return {
          container: {
            backgroundColor: colors.clay.insetBg,
            borderRadius: radius['2xl'],
            borderWidth: 1,
            borderColor: colors.clay.insetBorder,
          },
          highlight: { height: 0, opacity: 0 },
          showGradient: false,
        };
      case 'subtle':
        return {
          container: {
            backgroundColor: colors.bg.card,
            borderRadius: radius['2xl'],
            ...shadow('sm'),
          },
          highlight: { height: highlightHeight || 28, opacity: 0.3 },
          showGradient: false,
        };
      case 'clay':
      default:
        return {
          container: {
            backgroundColor: colors.bg.card,
            borderRadius: radius['3xl'],
            ...shadow('md'),
          },
          highlight: { height: highlightHeight || 36, opacity: 0.4 },
          showGradient: false,
        };
    }
  };
  
  const variantStyles = getVariantStyles();
  
  const CardContent = (
    <>
      {/* Inner highlight overlay */}
      {variantStyles.highlight.height > 0 && (
        <View
          style={[
            styles.innerHighlight,
            {
              height: variantStyles.highlight.height,
              backgroundColor: colors.clay.innerHighlight,
              opacity: variantStyles.highlight.opacity,
              borderTopLeftRadius: variantStyles.container.borderRadius as number,
              borderTopRightRadius: variantStyles.container.borderRadius as number,
            },
          ]}
          pointerEvents="none"
        />
      )}
      
      {/* Inner shadow at bottom */}
      {variant !== 'inset' && (
        <View
          style={[
            styles.innerShadow,
            {
              backgroundColor: colors.clay.innerShadow,
              borderBottomLeftRadius: variantStyles.container.borderRadius as number,
              borderBottomRightRadius: variantStyles.container.borderRadius as number,
            },
          ]}
          pointerEvents="none"
        />
      )}
      
      {/* Content */}
      <View style={[styles.content, innerStyle]}>
        {children}
      </View>
    </>
  );
  
  if (variant === 'hero') {
    const gradientConfig = isDark ? gradients.darkHero : gradients.hero;
    
    if (pressable || onPress) {
      return (
        <AnimatedPressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[animatedStyle, style]}
          {...pressableProps}
        >
          <LinearGradient
            colors={gradientConfig.colors as [string, string, ...string[]]}
            start={gradientConfig.start}
            end={gradientConfig.end}
            locations={gradientConfig.locations}
            style={[styles.container, variantStyles.container]}
          >
            {/* Shine overlay */}
            <LinearGradient
              colors={gradients.heroShine.colors as [string, string, ...string[]]}
              start={gradients.heroShine.start}
              end={gradients.heroShine.end}
              locations={gradients.heroShine.locations}
              style={StyleSheet.absoluteFill}
            />
            {CardContent}
          </LinearGradient>
        </AnimatedPressable>
      );
    }
    
    return (
      <LinearGradient
        colors={gradientConfig.colors as [string, string, ...string[]]}
        start={gradientConfig.start}
        end={gradientConfig.end}
        locations={gradientConfig.locations}
        style={[styles.container, variantStyles.container, style]}
      >
        {/* Shine overlay */}
        <LinearGradient
          colors={gradients.heroShine.colors as [string, string, ...string[]]}
          start={gradients.heroShine.start}
          end={gradients.heroShine.end}
          locations={gradients.heroShine.locations}
          style={StyleSheet.absoluteFill}
        />
        {CardContent}
      </LinearGradient>
    );
  }
  
  if (pressable || onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.container, variantStyles.container, animatedStyle, style]}
        {...pressableProps}
      >
        {CardContent}
      </AnimatedPressable>
    );
  }
  
  return (
    <View style={[styles.container, variantStyles.container, style]}>
      {CardContent}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  innerHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  innerShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
  },
  content: {
    padding: spacing[4],
  },
});

export default ClayCard;
