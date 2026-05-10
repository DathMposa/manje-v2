import React, { useState, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, Pressable } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { radius, layout, spacing } from '../../theme/spacing';
import { typeScale } from '../../theme/typography';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  value,
  onFocus,
  onBlur,
  ...textInputProps
}) => {
  const { colors, glow } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleContainerPress = () => {
    inputRef.current?.focus();
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const isError = !!error;
  const borderColor = isError ? colors.status.danger.base : isFocused ? colors.border.focus : colors.border.light;
  const borderWidth = isFocused || isError ? 2 : 1;
  const backgroundColor = isError ? colors.status.danger.bg : colors.bg.sunken;

  const glowShadow = isFocused ? (isError ? glow('danger') : glow('primary')) : {};

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleContainerPress}
        style={[
          styles.inputContainer,
          {
            borderColor,
            borderWidth,
            backgroundColor,
            borderRadius: radius.xl,
            height: layout.inputHeight,
          },
          glowShadow,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef}
            style={[styles.textInput, { color: colors.text.primary }]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={value}
            placeholder={label}
            placeholderTextColor={colors.text.secondary}
            {...textInputProps}
          />
        </View>

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </Pressable>

      {(error || hint) ? (
        <Text
          style={[
            styles.helperText,
            { color: isError ? colors.status.danger.text : colors.text.secondary },
          ]}
        >
          {error || hint}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
  },
  textInput: {
    ...typeScale['body.md'],
    padding: 0,
    margin: 0,
    height: '100%',
    textAlignVertical: 'center',
  },
  leftIcon: {
    marginRight: spacing[2],
  },
  rightIcon: {
    marginLeft: spacing[2],
  },
  helperText: {
    ...typeScale['body.sm'],
    marginTop: spacing[1],
    marginLeft: spacing[4],
  },
});
