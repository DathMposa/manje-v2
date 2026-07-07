/**
 * ManjeCharacter
 * Image-backed brand companion with mood, crop, and utility-pose variants.
 */

import React, { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { duration, springPresets } from '../../theme/animations';
import {
  characterAssets,
  characterUtilityAssets,
  ManjeMood,
  ManjeUtilityPose,
  ManjeVariant,
} from './characterAssets';

export type { ManjeMood, ManjeUtilityPose, ManjeVariant } from './characterAssets';

export type ManjeSize = 'sm' | 'md' | 'lg' | 'xl' | number;

interface ManjeCharacterProps {
  mood?: ManjeMood;
  size?: ManjeSize;
  variant?: ManjeVariant;
  utility?: ManjeUtilityPose;
  animated?: boolean;
  showIdleFloat?: boolean;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
}

const getSizeValue = (size: ManjeSize): number => {
  if (typeof size === 'number') return size;
  switch (size) {
    case 'sm':
      return 60;
    case 'md':
      return 100;
    case 'lg':
      return 150;
    case 'xl':
      return 200;
    default:
      return 100;
  }
};

const getAsset = (
  mood: ManjeMood,
  variant: ManjeVariant,
  utility?: ManjeUtilityPose
): ImageSourcePropType => {
  if (utility) return characterUtilityAssets[utility];
  return characterAssets[mood][variant];
};

export const ManjeCharacter: React.FC<ManjeCharacterProps> = ({
  mood = 'happy',
  size = 'md',
  variant = 'half',
  utility,
  animated = true,
  showIdleFloat = true,
  style,
  imageStyle,
}) => {
  const sizeValue = getSizeValue(size);
  const [reduceMotion, setReduceMotion] = useState(false);

  const floatY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const dot1 = useSharedValue(0.25);
  const dot2 = useSharedValue(0.25);
  const dot3 = useSharedValue(0.25);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener?.(
      'reduceMotionChanged',
      setReduceMotion
    );

    return () => {
      subscription?.remove?.();
    };
  }, []);

  useEffect(() => {
    const shouldFloat = animated && showIdleFloat && !reduceMotion && mood !== 'sleep';

    if (shouldFloat) {
      floatY.value = withRepeat(
        withSequence(
          withTiming(-6, { duration: duration.slow, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: duration.slow, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    } else {
      cancelAnimation(floatY);
      floatY.value = 0;
    }

    return () => cancelAnimation(floatY);
  }, [animated, showIdleFloat, reduceMotion, mood, floatY]);

  useEffect(() => {
    cancelAnimation(scale);
    cancelAnimation(rotation);
    cancelAnimation(dot1);
    cancelAnimation(dot2);
    cancelAnimation(dot3);

    if (!animated || reduceMotion) {
      scale.value = 1;
      rotation.value = 0;
      dot1.value = 0.25;
      dot2.value = 0.25;
      dot3.value = 0.25;
      return;
    }

    switch (mood) {
      case 'celebrate':
        scale.value = withSequence(
          withSpring(1.12, springPresets.bouncy),
          withSpring(1, springPresets.default)
        );
        break;
      case 'thinking':
        dot1.value = withRepeat(withSequence(withTiming(1, { duration: 300 }), withTiming(0.25, { duration: 300 })), -1, false);
        dot2.value = withRepeat(withSequence(withTiming(0.25, { duration: 200 }), withTiming(1, { duration: 300 }), withTiming(0.25, { duration: 300 })), -1, false);
        dot3.value = withRepeat(withSequence(withTiming(0.25, { duration: 400 }), withTiming(1, { duration: 300 }), withTiming(0.25, { duration: 300 })), -1, false);
        break;
      case 'surprise':
        scale.value = withSequence(
          withSpring(1.15, { damping: 4, stiffness: 120, mass: 1, overshootClamping: false }),
          withSpring(1, springPresets.default)
        );
        break;
      case 'concern':
      case 'focus':
        rotation.value = withTiming(3, { duration: 300 });
        break;
      default:
        scale.value = withSpring(1, springPresets.default);
        rotation.value = withTiming(0, { duration: 200 });
    }
  }, [animated, reduceMotion, mood, scale, rotation, dot1, dot2, dot3]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const dot1Style = useAnimatedStyle(() => ({ opacity: dot1.value }));
  const dot2Style = useAnimatedStyle(() => ({ opacity: dot2.value }));
  const dot3Style = useAnimatedStyle(() => ({ opacity: dot3.value }));

  const source = getAsset(mood, variant, utility);
  const isBadge = variant === 'badge' && !utility;

  return (
    <Animated.View
      style={[
        styles.container,
        { width: sizeValue, height: sizeValue },
        isBadge && { borderRadius: sizeValue / 2, overflow: 'hidden' },
        containerAnimatedStyle,
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel={`Manje ${utility ? utility.replace(/-/g, ' ') : mood}`}
    >
      <Image
        source={source}
        resizeMode="contain"
        style={[
          styles.image,
          { width: sizeValue, height: sizeValue },
          isBadge && { borderRadius: sizeValue / 2 },
          imageStyle,
        ]}
      />

      {mood === 'thinking' && animated && !reduceMotion && !utility && (
        <View style={[styles.thinkingDots, { bottom: sizeValue * 0.04 }]}>
          <Animated.View style={[styles.dot, dot1Style]} />
          <Animated.View style={[styles.dot, dot2Style]} />
          <Animated.View style={[styles.dot, dot3Style]} />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  image: {
    flexShrink: 0,
  },
  thinkingDots: {
    position: 'absolute',
    flexDirection: 'row',
    gap: 5,
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.84)',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#1A6B4A',
  },
});

export default ManjeCharacter;
