/**
 * Manje Design System - Theme Index
 * Version: 2.0 Hybrid Premium Edition
 * 
 * Unified export for all theme tokens.
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './gradients';
export * from './shadows';
export * from './animations';

import { lightColors, darkColors, ColorTheme } from './colors';
import { typeScale, fontFamilies } from './typography';
import { spacing, radius, layout, zIndex } from './spacing';
import { gradients, progressGradients } from './gradients';
import { shadows, glowShadows, getShadow, getGlowShadow } from './shadows';
import { duration, springConfigs, timingConfigs, animationPresets, haptics } from './animations';

// Complete theme object
export const theme = {
  colors: {
    light: lightColors,
    dark: darkColors,
  },
  typography: {
    scale: typeScale,
    fonts: fontFamilies,
  },
  spacing,
  radius,
  layout,
  zIndex,
  gradients,
  progressGradients,
  shadows,
  glowShadows,
  animation: {
    duration,
    springs: springConfigs,
    timing: timingConfigs,
    presets: animationPresets,
    haptics,
  },
} as const;

// Theme type
export type Theme = typeof theme;

// Helper to get colors based on color scheme
export const getColors = (isDark: boolean): ColorTheme => {
  return isDark ? darkColors : lightColors;
};
