/**
 * Manje Design System - Spacing & Layout Tokens
 * Version: 2.0 Hybrid Premium Edition
 */

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20, // STANDARD HORIZONTAL SCREEN PADDING
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

export const layout = {
  screenPaddingH: spacing[5],
  touchTargetMin: 44,
  headerHeight: 56,
  tabBarHeight: 72,
  inputHeight: 52,
  buttonHeights: {
    sm: 40,
    md: 48,
    lg: 56,
  },
  bottomScrollPadding: 80,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24, // PRIMARY CLAY CARD RADIUS
  '3xl': 28,
  '4xl': 32,
  full: 9999,
} as const;

export type SpacingKey = keyof typeof spacing;
export type RadiusKey = keyof typeof radius;
