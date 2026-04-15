/**
 * Manje Design System - Shadows & Elevation System
 * Version: 2.0 Hybrid Premium Edition
 */
import { Platform } from 'react-native';
import { green, status } from './colors';

// Internal type for shadowing since we need to reuse it across light/dark but the base definition here uses the core values
// Note: We use green tinted shadows instead of pure black.

export const createShadows = (isDark: boolean) => {
  // Use slightly darker tint in dark mode for better visibility
  const baseShadowColor = isDark ? '#081D14' : green[500]; // #1A6B4A
  const darkShadowColor = isDark ? '#030A07' : green[800]; // #0D3B2E
  
  return {
    xs: Platform.select({
      ios: {
        shadowColor: baseShadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
        shadowColor: baseShadowColor,
      },
    }),
    sm: Platform.select({
      ios: {
        shadowColor: baseShadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
        shadowColor: baseShadowColor,
      },
    }),
    md: Platform.select({
      ios: {
        shadowColor: baseShadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
        shadowColor: baseShadowColor,
      },
    }),
    lg: Platform.select({
      ios: {
        shadowColor: darkShadowColor,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
        shadowColor: darkShadowColor,
      },
    }),
    xl: Platform.select({
      ios: {
        shadowColor: darkShadowColor,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.16,
        shadowRadius: 24,
      },
      android: {
        elevation: 16,
        shadowColor: darkShadowColor,
      },
    }),
    glow: {
      primary: Platform.select({
        ios: {
          shadowColor: green[500],
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
        },
        android: {
          elevation: 12, // Requires shadowColor workaround for Android glow
          shadowColor: green[500],
        },
      }),
      accent: Platform.select({
        ios: {
          shadowColor: '#2563EB', // info blue used for accent glow
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.20,
          shadowRadius: 10,
        },
        android: {
          elevation: 10,
          shadowColor: '#2563EB',
        },
      }),
      success: Platform.select({
        ios: {
          shadowColor: status.success,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.20,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
          shadowColor: status.success,
        },
      }),
      danger: Platform.select({
        ios: {
          shadowColor: status.danger,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.20,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
          shadowColor: status.danger,
        },
      }),
    },
  } as const;
};

// Backward compatible shadow accessor for components
export const shadows = createShadows(false);

export type ShadowLevel = keyof ReturnType<typeof createShadows>;
