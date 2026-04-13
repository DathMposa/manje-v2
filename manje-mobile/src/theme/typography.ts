/**
 * Manje Design System - Typography Tokens
 * Version: 2.0 Hybrid Premium Edition
 * 
 * Font families: Syne (display/headlines), Work Sans (body/UI)
 * All sizes use the 4px base unit system.
 */

// Font Families
export const fontFamilies = {
  display: 'Syne',
  displayBold: 'Syne-Bold',
  displaySemiBold: 'Syne-SemiBold',
  body: 'WorkSans',
  bodyMedium: 'WorkSans-Medium',
  bodySemiBold: 'WorkSans-SemiBold',
  bodyBold: 'WorkSans-Bold',
} as const;

// Font Weights (for reference - actual weight applied via font family)
export const fontWeights = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;

// Type Scale
export const typeScale = {
  // Display styles (Syne)
  displayLarge: {
    fontFamily: fontFamilies.displayBold,
    fontSize: 36,
    lineHeight: 43.2, // 1.2×
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontFamily: fontFamilies.displaySemiBold,
    fontSize: 30,
    lineHeight: 36, // 1.2×
    letterSpacing: -0.5,
  },
  displaySmall: {
    fontFamily: fontFamilies.displaySemiBold,
    fontSize: 24,
    lineHeight: 30, // 1.25×
    letterSpacing: 0,
  },
  
  // Headline styles (Work Sans)
  headlineLarge: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 20,
    lineHeight: 25, // 1.25×
    letterSpacing: 0,
  },
  headlineMedium: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 18,
    lineHeight: 25.2, // 1.4×
    letterSpacing: 0,
  },
  headlineSmall: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 16,
    lineHeight: 24, // 1.5×
    letterSpacing: 0,
  },
  
  // Body styles (Work Sans)
  bodyLarge: {
    fontFamily: fontFamilies.body,
    fontSize: 18,
    lineHeight: 27, // 1.5×
    letterSpacing: 0,
  },
  bodyMedium: {
    fontFamily: fontFamilies.body,
    fontSize: 16,
    lineHeight: 24, // 1.5×
    letterSpacing: 0,
  },
  bodySmall: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    lineHeight: 21, // 1.5×
    letterSpacing: 0,
  },
  
  // Label styles (Work Sans Medium)
  labelLarge: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 16,
    lineHeight: 20, // 1.25×
    letterSpacing: 0.5,
  },
  labelMedium: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    lineHeight: 17.5, // 1.25×
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 12,
    lineHeight: 15, // 1.25×
    letterSpacing: 1,
  },
  
  // Financial number styles (Syne)
  heroMetric: {
    fontFamily: fontFamilies.displayBold,
    fontSize: 52,
    lineHeight: 57.2, // 1.1×
    letterSpacing: -1.5,
  },
  currencyLarge: {
    fontFamily: fontFamilies.displayBold,
    fontSize: 48,
    lineHeight: 52.8, // 1.1×
    letterSpacing: -1,
  },
  currencyMedium: {
    fontFamily: fontFamilies.displaySemiBold,
    fontSize: 30,
    lineHeight: 36, // 1.2×
    letterSpacing: -0.5,
  },
  currencySmall: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 20,
    lineHeight: 25, // 1.25×
    letterSpacing: 0,
  },
} as const;

// Font files to load (for expo-font)
// NOTE: Add font files to assets/fonts/ and uncomment the requires below
// For now, using system fonts as fallback
export const fontsToLoad = {
  // 'Syne': require('../../assets/fonts/Syne-Regular.ttf'),
  // 'Syne-Bold': require('../../assets/fonts/Syne-Bold.ttf'),
  // 'Syne-SemiBold': require('../../assets/fonts/Syne-SemiBold.ttf'),
  // 'WorkSans': require('../../assets/fonts/WorkSans-Regular.ttf'),
  // 'WorkSans-Medium': require('../../assets/fonts/WorkSans-Medium.ttf'),
  // 'WorkSans-SemiBold': require('../../assets/fonts/WorkSans-SemiBold.ttf'),
  // 'WorkSans-Bold': require('../../assets/fonts/WorkSans-Bold.ttf'),
} as const;

// System font fallbacks (used until custom fonts are loaded)
export const systemFonts = {
  display: 'System',
  displayBold: 'System',
  displaySemiBold: 'System',
  body: 'System',
  bodyMedium: 'System',
  bodySemiBold: 'System',
  bodyBold: 'System',
} as const;

export type TypeStyle = keyof typeof typeScale;
