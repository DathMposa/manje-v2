/**
 * Manje Design System - Typography Tokens
 * Refactored: Dual-font system (Comfortaa & Inter)
 */
import { TextStyle } from 'react-native';

export const fonts = {
  comfortaa: {
    medium: 'Comfortaa_500Medium',
    bold: 'Comfortaa_700Bold',
  },
  inter: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  brand: {
    bold: 'Comfortaa_700Bold',
  },
};

export const typeScale = {
  // Brand
  'brand': {
    fontFamily: fonts.brand.bold,
    fontWeight: 'bold',
  },
  // Display - Branding & Hero
  'display.lg': {
    fontFamily: fonts.comfortaa.bold,
    fontSize: 64,
    lineHeight: 64 * 1.1,
  },
  'display.md': {
    fontFamily: fonts.comfortaa.bold,
    fontSize: 48,
    lineHeight: 48 * 1.15,
  },
  'display.sm': {
    fontFamily: fonts.comfortaa.bold,
    fontSize: 32,
    lineHeight: 32 * 1.2,
  },

  // Headlines
  'headline.lg': {
    fontFamily: fonts.comfortaa.medium,
    fontSize: 24,
    lineHeight: 24 * 1.3,
  },
  'headline.md': {
    fontFamily: fonts.inter.semiBold,
    fontSize: 20,
    lineHeight: 20 * 1.3,
  },
  'headline.sm': {
    fontFamily: fonts.inter.semiBold,
    fontSize: 16,
    lineHeight: 16 * 1.4,
  },

  // Body
  'body.lg': {
    fontFamily: fonts.inter.regular,
    fontSize: 16,
    lineHeight: 16 * 1.5,
  },
  'body.md': {
    fontFamily: fonts.inter.regular,
    fontSize: 14,
    lineHeight: 14 * 1.5,
  },
  'body.sm': {
    fontFamily: fonts.inter.regular,
    fontSize: 12,
    lineHeight: 12 * 1.5,
  },

  // Labels
  'label.lg': {
    fontFamily: fonts.inter.medium,
    fontSize: 16,
    lineHeight: 16 * 1.4,
  },
  'label.md': {
    fontFamily: fonts.inter.medium,
    fontSize: 14,
    lineHeight: 14 * 1.3,
  },
  'label.sm': {
    fontFamily: fonts.inter.medium,
    fontSize: 12,
    lineHeight: 12 * 1.3,
  },

  // Financial Data
  'financial.hero': {
    fontFamily: fonts.inter.bold,
    fontSize: 64,
    lineHeight: 64 * 1.0,
    fontVariant: ['tabular-nums'],
  },
  'financial.lg': {
    fontFamily: fonts.inter.bold,
    fontSize: 48,
    lineHeight: 48 * 1.0,
    fontVariant: ['tabular-nums'],
  },
  'financial.md': {
    fontFamily: fonts.inter.bold,
    fontSize: 32,
    lineHeight: 32 * 1.1,
    fontVariant: ['tabular-nums'],
  },
  'financial.sm': {
    fontFamily: fonts.inter.semiBold,
    fontSize: 24,
    lineHeight: 24 * 1.2,
    fontVariant: ['tabular-nums'],
  },

  // Compatibility Mappings (CamelCase)
  displayLarge: {
    fontFamily: fonts.comfortaa.bold,
    fontSize: 64,
    lineHeight: 64 * 1.1,
  },
  displayMedium: {
    fontFamily: fonts.comfortaa.bold,
    fontSize: 48,
    lineHeight: 48 * 1.15,
  },
  displaySmall: {
    fontFamily: fonts.comfortaa.bold,
    fontSize: 32,
    lineHeight: 32 * 1.2,
  },
  headlineLarge: {
    fontFamily: fonts.comfortaa.medium,
    fontSize: 24,
    lineHeight: 24 * 1.3,
  },
  headlineMedium: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 20,
    lineHeight: 20 * 1.3,
  },
  headlineSmall: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 16,
    lineHeight: 16 * 1.4,
  },
  bodyLarge: {
    fontFamily: fonts.inter.regular,
    fontSize: 16,
    lineHeight: 16 * 1.5,
  },
  bodyMedium: {
    fontFamily: fonts.inter.regular,
    fontSize: 14,
    lineHeight: 14 * 1.5,
  },
  bodySmall: {
    fontFamily: fonts.inter.regular,
    fontSize: 12,
    lineHeight: 12 * 1.5,
  },
  labelLarge: {
    fontFamily: fonts.inter.medium,
    fontSize: 16,
    lineHeight: 16 * 1.4,
  },
  labelMedium: {
    fontFamily: fonts.inter.medium,
    fontSize: 14,
    lineHeight: 14 * 1.3,
  },
  labelSmall: {
    fontFamily: fonts.inter.medium,
    fontSize: 12,
    lineHeight: 12 * 1.3,
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typeScale;

/**
 * Format amount as MWK currency according to Design Guide rules
 */
export const formatMWK = (amount: number, condensed: boolean = false): string => {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  let formattedValue = '';
  
  if (condensed && absAmount >= 1000000) {
    // 1.2M format
    formattedValue = (absAmount / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (condensed && absAmount >= 1000) {
    // 1.2k format
    formattedValue = (absAmount / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  } else {
    // standard comma separated
    formattedValue = absAmount.toLocaleString('en-MW');
  }
  
  return `${isNegative ? '-' : ''}MWK ${formattedValue}`;
};
