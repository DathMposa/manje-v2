import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable, PressableProps } from 'react-native';

import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { radius, spacing } from '../../theme/spacing';
import { springPresets } from '../../theme/animations';


const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type CardVariant = 'clay' | 'hero' | 'inset' | 'subtle';

export interface ClayCardProps extends Omit<PressableProps, 'style'> {
  variant?: CardVariant;
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  innerStyle?: ViewStyle;
  pressable?: boolean;
  noPadding?: boolean;
}

export const ClayCard: React.FC<ClayCardProps> = ({
  variant = 'clay',
  children,
  style,
  innerStyle,
  pressable = false,
  noPadding = false,
  onPress,
  ...pressableProps
}) => {
  const { colors, shadow, isDark, glow } = useTheme();
  const scale = useSharedValue(1);

  const isPressable = pressable || !!onPress;

  const handlePressIn = () => {
    if (isPressable) {
      scale.value = withSpring(0.97, springPresets.buttonPress);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    if (isPressable) {
      scale.value = withSpring(1.0, springPresets.cardRelease);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getVariantStyles = () => {
    switch (variant) {
      case 'hero':
        return {
          container: [
            { borderRadius: radius['4xl'] },
            shadow('xl'),
            glow('primary'),
          ],
          hasGradient: true,
          hasClay: true,
        };
      case 'inset':
        return {
          container: [
            {
              backgroundColor: colors.bg.sunken,
              borderRadius: radius['2xl'],
            },
            shadow('xs'),
          ],
          hasGradient: false,
          hasClay: false,
        };
      case 'subtle':
        return {
          container: [
            {
              backgroundColor: colors.bg.card,
              borderRadius: radius['2xl'],
              opacity: 0.6,
            },
            shadow('sm'),
          ],
          hasGradient: false,
          hasClay: true,
        };
      case 'clay':
      default:
        return {
          container: [
            {
              backgroundColor: colors.bg.card,
              borderRadius: radius['2xl'],
            },
            shadow('md'),
          ],
          hasGradient: false,
          hasClay: true,
        };
    }
  };

  const vStyles = getVariantStyles();

  const renderInnerClayEffects = () => {
    // Inner shadow removed for cleaner card appearance
    return null;
  };

  const contentWrap = (
    <View style={[!noPadding && styles.content, innerStyle]}>{children}</View>
  );

  const containerStyle = [styles.base, vStyles.container, style];

  if (vStyles.hasGradient) {
    const content = (
      <View style={[containerStyle, { backgroundColor: colors.primary.default }]}>
        {renderInnerClayEffects()}
        {contentWrap}
      </View>
    );

    if (isPressable) {
      return (
        <AnimatedPressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={animatedStyle}
          {...pressableProps}
        >
          {content}
        </AnimatedPressable>
      );
    }
    return content;
  }

  if (isPressable) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[containerStyle, animatedStyle]}
        {...pressableProps}
      >
        {renderInnerClayEffects()}
        {contentWrap}
      </AnimatedPressable>
    );
  }

  return (
    <View style={containerStyle}>
      {renderInnerClayEffects()}
      {contentWrap}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  content: {
    padding: spacing[6],
  },
});
