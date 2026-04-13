/**
 * Manje Design System - Shadow Tokens
 * Version: 2.0 Hybrid Premium Edition
 * 
 * Premium shadow system with colour tints for depth.
 * Includes both iOS shadow properties and Android elevation.
 */

import { Platform, ViewStyle } from 'react-native';

// Shadow definitions with iOS and Android support
export const shadows = {
  xs: {
    light: {
      shadowColor: '#0E2418',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    } as ViewStyle,
    dark: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 1,
    } as ViewStyle,
  },
  
  sm: {
    light: {
      shadowColor: '#0E2418',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    } as ViewStyle,
    dark: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 2,
    } as ViewStyle,
  },
  
  md: {
    light: {
      shadowColor: '#0E2418',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    } as ViewStyle,
    dark: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 4,
    } as ViewStyle,
  },
  
  lg: {
    light: {
      shadowColor: '#0E2418',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.10,
      shadowRadius: 24,
      elevation: 8,
    } as ViewStyle,
    dark: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.6,
      shadowRadius: 24,
      elevation: 8,
    } as ViewStyle,
  },
  
  xl: {
    light: {
      shadowColor: '#0E2418',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.12,
      shadowRadius: 48,
      elevation: 16,
    } as ViewStyle,
    dark: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.7,
      shadowRadius: 48,
      elevation: 16,
    } as ViewStyle,
  },
} as const;

// Glow shadows for active/focus states
export const glowShadows = {
  accent: {
    light: {
      shadowColor: '#2ECC71',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 0, // Glow doesn't use elevation
    } as ViewStyle,
    dark: {
      shadowColor: '#2ECC71',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius: 24,
      elevation: 0,
    } as ViewStyle,
  },
  
  primary: {
    light: {
      shadowColor: '#1A6B4A',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.20,
      shadowRadius: 16,
      elevation: 0,
    } as ViewStyle,
    dark: {
      shadowColor: '#2ECC71',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 0,
    } as ViewStyle,
  },
  
  success: {
    light: {
      shadowColor: '#22C55E',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 0,
    } as ViewStyle,
    dark: {
      shadowColor: '#22C55E',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius: 20,
      elevation: 0,
    } as ViewStyle,
  },
  
  danger: {
    light: {
      shadowColor: '#EF4444',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 0,
    } as ViewStyle,
    dark: {
      shadowColor: '#F87171',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius: 20,
      elevation: 0,
    } as ViewStyle,
  },
} as const;

// Helper function to get shadow based on theme
export const getShadow = (
  size: keyof typeof shadows,
  isDark: boolean
): ViewStyle => {
  return isDark ? shadows[size].dark : shadows[size].light;
};

// Helper function to get glow shadow based on theme
export const getGlowShadow = (
  type: keyof typeof glowShadows,
  isDark: boolean
): ViewStyle => {
  return isDark ? glowShadows[type].dark : glowShadows[type].light;
};

// Combined shadow + glow for focused/active states
export const getCombinedShadow = (
  size: keyof typeof shadows,
  glowType: keyof typeof glowShadows,
  isDark: boolean
): ViewStyle => {
  const baseShadow = getShadow(size, isDark);
  const glow = getGlowShadow(glowType, isDark);
  
  // On iOS, we can only have one shadow, so we prioritize the glow
  // On Android, elevation handles the base shadow
  if (Platform.OS === 'ios') {
    return glow;
  }
  
  return {
    ...baseShadow,
    // Android doesn't support colored shadows well, so we just use elevation
  };
};

export type ShadowSize = keyof typeof shadows;
export type GlowType = keyof typeof glowShadows;
