/**
 * ManjeCharacter Component
 * The living brand mascot with mood states and animations.
 * 
 * Moods: wave, happy, thinking, celebrate, concern, encourage, sleep, surprise
 * Sizes: sm (60px), md (100px), lg (150px), xl (200px)
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { layout } from '../../theme/spacing';
import { duration, springConfigs } from '../../theme/animations';
import { character as characterColors } from '../../theme/colors';

export type ManjeMood = 
  | 'wave' 
  | 'happy' 
  | 'thinking' 
  | 'celebrate' 
  | 'concern' 
  | 'encourage' 
  | 'sleep' 
  | 'surprise';

export type ManjeSize = 'sm' | 'md' | 'lg' | 'xl';

interface ManjeCharacterProps {
  mood?: ManjeMood;
  size?: ManjeSize;
  animated?: boolean;
  showIdleFloat?: boolean;
}

const getSizeValue = (size: ManjeSize): number => {
  switch (size) {
    case 'sm': return layout.characterSm;
    case 'md': return layout.characterMd;
    case 'lg': return layout.characterLg;
    case 'xl': return layout.characterXl;
  }
};

export const ManjeCharacter: React.FC<ManjeCharacterProps> = ({
  mood = 'happy',
  size = 'md',
  animated = true,
  showIdleFloat = true,
}) => {
  const { isDark } = useTheme();
  const sizeValue = getSizeValue(size);
  
  // Animation values
  const floatY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const waveRotation = useSharedValue(0);
  const thinkingDot1 = useSharedValue(0.2);
  const thinkingDot2 = useSharedValue(0.2);
  const thinkingDot3 = useSharedValue(0.2);
  
  // Idle float animation
  useEffect(() => {
    if (animated && showIdleFloat && mood !== 'sleep') {
      floatY.value = withRepeat(
        withSequence(
          withTiming(-6, { duration: duration.character, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: duration.character, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    } else {
      cancelAnimation(floatY);
      floatY.value = 0;
    }
    
    return () => {
      cancelAnimation(floatY);
    };
  }, [animated, showIdleFloat, mood]);
  
  // Mood-specific animations
  useEffect(() => {
    if (!animated) return;
    
    switch (mood) {
      case 'wave':
        // Wave gesture animation
        waveRotation.value = withRepeat(
          withSequence(
            withTiming(30, { duration: 300, easing: Easing.inOut(Easing.ease) }),
            withTiming(-15, { duration: 300, easing: Easing.inOut(Easing.ease) })
          ),
          3,
          true
        );
        break;
        
      case 'celebrate':
        // Celebrate burst animation
        scale.value = withSequence(
          withSpring(1.12, springConfigs.bouncy),
          withSpring(1, springConfigs.default)
        );
        break;
        
      case 'thinking':
        // Thinking dots animation
        thinkingDot1.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 300 }),
            withTiming(0.2, { duration: 300 })
          ),
          -1,
          false
        );
        setTimeout(() => {
          thinkingDot2.value = withRepeat(
            withSequence(
              withTiming(1, { duration: 300 }),
              withTiming(0.2, { duration: 300 })
            ),
            -1,
            false
          );
        }, 200);
        setTimeout(() => {
          thinkingDot3.value = withRepeat(
            withSequence(
              withTiming(1, { duration: 300 }),
              withTiming(0.2, { duration: 300 })
            ),
            -1,
            false
          );
        }, 400);
        break;
        
      case 'surprise':
        // Surprise pop animation
        scale.value = withSequence(
          withSpring(1.15, { damping: 4, stiffness: 120 }),
          withSpring(1, springConfigs.default)
        );
        break;
        
      case 'concern':
        // Lean forward animation
        rotation.value = withTiming(5, { duration: 300 });
        break;
        
      default:
        // Reset animations
        scale.value = withSpring(1, springConfigs.default);
        rotation.value = withTiming(0, { duration: 200 });
        waveRotation.value = 0;
    }
    
    return () => {
      cancelAnimation(scale);
      cancelAnimation(rotation);
      cancelAnimation(waveRotation);
      cancelAnimation(thinkingDot1);
      cancelAnimation(thinkingDot2);
      cancelAnimation(thinkingDot3);
    };
  }, [mood, animated]);
  
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));
  
  const thinkingDot1Style = useAnimatedStyle(() => ({
    opacity: thinkingDot1.value,
  }));
  
  const thinkingDot2Style = useAnimatedStyle(() => ({
    opacity: thinkingDot2.value,
  }));
  
  const thinkingDot3Style = useAnimatedStyle(() => ({
    opacity: thinkingDot3.value,
  }));
  
  // Get expression based on mood
  const getExpression = () => {
    switch (mood) {
      case 'wave':
        return { eyes: '◠ ◠', mouth: '◡', eyebrows: '' };
      case 'happy':
        return { eyes: '◠ ◠', mouth: '◡', eyebrows: '' };
      case 'thinking':
        return { eyes: '◔ ◔', mouth: '—', eyebrows: '' };
      case 'celebrate':
        return { eyes: '★ ★', mouth: '◡', eyebrows: '' };
      case 'concern':
        return { eyes: '• •', mouth: '︵', eyebrows: '╭ ╮' };
      case 'encourage':
        return { eyes: '◠ ◠', mouth: '◡', eyebrows: '' };
      case 'sleep':
        return { eyes: '— —', mouth: '∼', eyebrows: '' };
      case 'surprise':
        return { eyes: '○ ○', mouth: 'O', eyebrows: '' };
      default:
        return { eyes: '◠ ◠', mouth: '◡', eyebrows: '' };
    }
  };
  
  const expression = getExpression();
  const glassesColor = isDark ? characterColors.glassesDark : characterColors.glassesLight;
  
  return (
    <Animated.View style={[styles.container, { width: sizeValue, height: sizeValue }, containerAnimatedStyle]}>
      {/* Body */}
      <View style={[styles.body, { 
        width: sizeValue * 0.7, 
        height: sizeValue * 0.8,
        backgroundColor: characterColors.bodyBase,
        borderRadius: sizeValue * 0.35,
      }]}>
        {/* Body highlight */}
        <View style={[styles.bodyHighlight, {
          width: sizeValue * 0.5,
          height: sizeValue * 0.3,
          backgroundColor: characterColors.bodyHighlight,
          borderRadius: sizeValue * 0.25,
          opacity: 0.3,
        }]} />
      </View>
      
      {/* Face */}
      <View style={[styles.face, {
        width: sizeValue * 0.5,
        height: sizeValue * 0.5,
        backgroundColor: characterColors.face,
        borderRadius: sizeValue * 0.25,
        top: sizeValue * 0.08,
      }]}>
        {/* Glasses */}
        <View style={[styles.glasses, {
          width: sizeValue * 0.45,
          height: sizeValue * 0.15,
          borderColor: glassesColor,
          borderWidth: 2,
          borderRadius: sizeValue * 0.05,
          top: sizeValue * 0.12,
        }]} />
        
        {/* Eyes */}
        <Text style={[styles.eyes, { 
          fontSize: sizeValue * 0.12,
          color: characterColors.eyes,
          top: sizeValue * 0.12,
        }]}>
          {expression.eyes}
        </Text>
        
        {/* Eyebrows (for concern) */}
        {expression.eyebrows && (
          <Text style={[styles.eyebrows, {
            fontSize: sizeValue * 0.08,
            color: characterColors.eyes,
            top: sizeValue * 0.06,
          }]}>
            {expression.eyebrows}
          </Text>
        )}
        
        {/* Mouth */}
        <Text style={[styles.mouth, {
          fontSize: sizeValue * 0.12,
          color: characterColors.eyes,
          top: sizeValue * 0.28,
        }]}>
          {expression.mouth}
        </Text>
        
        {/* Blush (for happy/celebrate) */}
        {(mood === 'happy' || mood === 'celebrate' || mood === 'wave') && (
          <>
            <View style={[styles.blush, {
              width: sizeValue * 0.08,
              height: sizeValue * 0.04,
              backgroundColor: characterColors.blush,
              borderRadius: sizeValue * 0.02,
              left: sizeValue * 0.05,
              top: sizeValue * 0.22,
              opacity: 0.6,
            }]} />
            <View style={[styles.blush, {
              width: sizeValue * 0.08,
              height: sizeValue * 0.04,
              backgroundColor: characterColors.blush,
              borderRadius: sizeValue * 0.02,
              right: sizeValue * 0.05,
              top: sizeValue * 0.22,
              opacity: 0.6,
            }]} />
          </>
        )}
      </View>
      
      {/* Thinking dots */}
      {mood === 'thinking' && (
        <View style={[styles.thinkingDots, { top: sizeValue * 0.7 }]}>
          <Animated.View style={[styles.dot, thinkingDot1Style, { backgroundColor: characterColors.bodyBase }]} />
          <Animated.View style={[styles.dot, thinkingDot2Style, { backgroundColor: characterColors.bodyBase }]} />
          <Animated.View style={[styles.dot, thinkingDot3Style, { backgroundColor: characterColors.bodyBase }]} />
        </View>
      )}
      
      {/* Sleep Zzz */}
      {mood === 'sleep' && (
        <View style={[styles.sleepZzz, { right: -sizeValue * 0.1, top: sizeValue * 0.1 }]}>
          <Text style={[styles.zzz, { fontSize: sizeValue * 0.12, color: characterColors.bodyBase }]}>Z</Text>
          <Text style={[styles.zzz, { fontSize: sizeValue * 0.09, color: characterColors.bodyBase, marginLeft: 4 }]}>z</Text>
          <Text style={[styles.zzz, { fontSize: sizeValue * 0.06, color: characterColors.bodyBase, marginLeft: 4 }]}>z</Text>
        </View>
      )}
      
      {/* Sparkles for celebrate */}
      {mood === 'celebrate' && (
        <>
          <Text style={[styles.sparkle, { 
            fontSize: sizeValue * 0.1, 
            color: characterColors.sparkle,
            top: -sizeValue * 0.05,
            left: sizeValue * 0.1,
          }]}>✦</Text>
          <Text style={[styles.sparkle, { 
            fontSize: sizeValue * 0.08, 
            color: characterColors.sparkle,
            top: sizeValue * 0.1,
            right: -sizeValue * 0.05,
          }]}>✦</Text>
          <Text style={[styles.sparkle, { 
            fontSize: sizeValue * 0.06, 
            color: characterColors.sparkle,
            bottom: sizeValue * 0.2,
            left: -sizeValue * 0.05,
          }]}>✦</Text>
        </>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    overflow: 'hidden',
  },
  bodyHighlight: {
    position: 'absolute',
    top: '10%',
  },
  face: {
    position: 'absolute',
    alignItems: 'center',
  },
  glasses: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  eyes: {
    position: 'absolute',
    letterSpacing: 4,
  },
  eyebrows: {
    position: 'absolute',
    letterSpacing: 8,
  },
  mouth: {
    position: 'absolute',
  },
  blush: {
    position: 'absolute',
  },
  thinkingDots: {
    position: 'absolute',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sleepZzz: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  zzz: {
    fontWeight: 'bold',
  },
  sparkle: {
    position: 'absolute',
  },
});

export default ManjeCharacter;
