/**
 * Manje Design System - Theme Index
 * Version: 2.0 Hybrid Premium Edition
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './gradients';
export * from './shadows';
export * from './animations';

import { lightColors, darkColors, ColorTheme } from './colors';
import { typeScale, fonts } from './typography';
import { layout, radius, spacing } from './spacing';
import { gradients } from './gradients';
import { createShadows } from './shadows';
import { duration, springPresets } from './animations';

// Complete theme object structure reference
export const theme = {
  colors: {
    light: lightColors,
    dark: darkColors,
  },
  typography: {
    scale: typeScale,
    fonts: fonts,
  },
  spacing,
  radius,
  layout,
  gradients,
  animation: {
    duration,
    springs: springPresets,
  },
} as const;

export type Theme = typeof theme;

// Helper to get colors based on color scheme
export const getColors = (isDark: boolean): ColorTheme => {
  return isDark ? darkColors : lightColors;
};

// Helper to get shadows based on color scheme
export const getShadows = (isDark: boolean) => {
  return createShadows(isDark);
};
