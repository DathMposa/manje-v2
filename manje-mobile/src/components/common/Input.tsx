/**
 * Input Component
 * Text input with floating label and premium focus animations.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { radius, layout, spacing } from '../../theme/spacing';
import { typeScale } from '../../theme/typography';
import { timingConfigs, animationPresets } from '../../theme/animations';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerStyle,
  value,
  onFocus,
  onBlur,
  ...textInputProps
}) => {
  const { colors, glow, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  
  const focusAnim = useSharedValue(0);
  const hasValue = value && value.length > 0;
  const isLabelFloating = isFocused || hasValue;
  
  const handleFocus = (e: any) => {
    setIsFocused(true);
    focusAnim.value = withTiming(1, timingConfigs.fast);
    onFocus?.(e);
  };
  
  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (!hasValue) {
      focusAnim.value = withTiming(0, timingConfigs.fast);
    }
    onBlur?.(e);
  };
  
  const handleContainerPress = () => {
    inputRef.current?.focus();
  };
  
  const labelAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      isLabelFloating ? 1 : focusAnim.value,
      [0, 1],
      [0, animationPresets.inputFocus.labelTranslateY]
    );
    const scale = interpolate(
      isLabelFloating ? 1 : focusAnim.value,
      [0, 1],
      [1, animationPresets.inputFocus.labelScale]
    );
    
    return {
      transform: [
        { translateY },
        { scale },
      ],
    };
  });
  
  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      borderWidth: isFocused 
        ? animationPresets.inputFocus.borderWidth.focused 
        : animationPresets.inputFocus.borderWidth.default,
    };
  });
  
  const getBorderColor = () => {
    if (error) return colors.status.danger;
    if (isFocused) return colors.border.focus;
    return colors.border.medium;
  };
  
  const getBackgroundColor = () => {
    if (error) return colors.status.dangerBg;
    if (isFocused) return colors.bg.card;
    return colors.bg.sunken;
  };
  
  const getLabelColor = () => {
    if (error) return colors.status.danger;
    if (isFocused) return colors.primary.main;
    return colors.text.secondary;
  };
  
  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Pressable onPress={handleContainerPress}>
        <Animated.View
          style={[
            styles.container,
            containerAnimatedStyle,
            {
              backgroundColor: getBackgroundColor(),
              borderColor: getBorderColor(),
            },
            isFocused && !error && glow('primary'),
          ]}
        >
          {/* Left Icon */}
          {leftIcon && (
            <View style={styles.leftIcon}>
              {leftIcon}
            </View>
          )}
          
          {/* Input Area */}
          <View style={styles.inputArea}>
            {/* Floating Label */}
            <Animated.Text
              style={[
                styles.label,
                typeScale.bodyMedium,
                labelAnimatedStyle,
                { color: getLabelColor() },
                isLabelFloating && styles.labelFloating,
              ]}
            >
              {label}
            </Animated.Text>
            
            {/* Text Input */}
            <TextInput
              ref={inputRef}
              value={value}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={[
                styles.input,
                typeScale.bodyMedium,
                { color: colors.text.primary },
                leftIcon ? styles.inputWithLeftIcon : null,
              ]}
              placeholderTextColor={colors.text.muted}
              selectionColor={colors.primary.main}
              {...textInputProps}
            />
          </View>
          
          {/* Right Icon */}
          {rightIcon && (
            <View style={styles.rightIcon}>
              {rightIcon}
            </View>
          )}
        </Animated.View>
      </Pressable>
      
      {/* Error or Hint */}
      {(error || hint) && (
        <Text
          style={[
            styles.helperText,
            typeScale.bodySmall,
            { color: error ? colors.status.danger : colors.text.muted },
          ]}
        >
          {error || hint}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing[4],
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: layout.inputHeight,
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing[4],
  },
  leftIcon: {
    marginRight: spacing[3],
  },
  rightIcon: {
    marginLeft: spacing[3],
  },
  inputArea: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
  },
  label: {
    position: 'absolute',
    left: 0,
    top: '50%',
    marginTop: -10,
    transformOrigin: 'left center',
  },
  labelFloating: {
    top: 8,
    marginTop: 0,
  },
  input: {
    flex: 1,
    paddingTop: spacing[4],
    paddingBottom: spacing[1],
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  helperText: {
    marginTop: spacing[1],
    marginLeft: spacing[4],
  },
});

export default Input;
