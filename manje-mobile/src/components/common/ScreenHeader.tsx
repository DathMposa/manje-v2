/**
 * ScreenHeader Component
 * Standard header with back button, title, and optional action.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { layout, spacing } from '../../theme/spacing';
import { typeScale } from '../../theme/typography';
import { springConfigs } from '../../theme/animations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ScreenHeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
  transparent?: boolean;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  showBack = true,
  onBackPress,
  rightAction,
  transparent = false,
}) => {
  const { colors } = useTheme();
  const router = useRouter();
  const backScale = useSharedValue(1);
  
  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };
  
  const handleBackPressIn = () => {
    backScale.value = withSpring(0.9, springConfigs.snappy);
  };
  
  const handleBackPressOut = () => {
    backScale.value = withSpring(1, springConfigs.snappy);
  };
  
  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backScale.value }],
  }));
  
  return (
    <View style={[
      styles.container,
      { backgroundColor: transparent ? 'transparent' : colors.bg.base },
    ]}>
      {/* Left - Back Button */}
      <View style={styles.left}>
        {showBack && (
          <AnimatedPressable
            onPress={handleBackPress}
            onPressIn={handleBackPressIn}
            onPressOut={handleBackPressOut}
            style={[styles.backButton, backAnimatedStyle]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="arrow-left" size={24} color={colors.text.primary} />
          </AnimatedPressable>
        )}
      </View>
      
      {/* Center - Title */}
      <View style={styles.center}>
        {title && (
          <Text
            style={[
              styles.title,
              typeScale.headlineMedium,
              { color: colors.text.primary },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
      </View>
      
      {/* Right - Action */}
      <View style={styles.right}>
        {rightAction}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
  },
  left: {
    width: 44,
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    width: 44,
    alignItems: 'flex-end',
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
});

export default ScreenHeader;
