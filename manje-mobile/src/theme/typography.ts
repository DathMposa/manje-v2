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
  'brand': {
    fontFamily: fonts.brand.bold,
    fontWeight: 'bold',
  },

  // Display - reserved for brand/hero moments only.
  'display.lg': {
    fontFamily: fonts.inter.bold,
    fontSize: 36,
    lineHeight: 44,
  },
  'display.md': {
    fontFamily: fonts.inter.bold,
    fontSize: 32,
    lineHeight: 40,
  },
  'display.sm': {
    fontFamily: fonts.inter.bold,
    fontSize: 28,
    lineHeight: 36,
  },

  'headline.lg': {
    fontFamily: fonts.inter.bold,
    fontSize: 24,
    lineHeight: 32,
  },
  'headline.md': {
    fontFamily: fonts.inter.semiBold,
    fontSize: 22,
    lineHeight: 28,
  },
  'headline.sm': {
    fontFamily: fonts.inter.semiBold,
    fontSize: 20,
    lineHeight: 26,
  },

  'title.lg': {
    fontFamily: fonts.inter.semiBold,
    fontSize: 18,
    lineHeight: 24,
  },
  'title.md': {
    fontFamily: fonts.inter.semiBold,
    fontSize: 16,
    lineHeight: 22,
  },
  'title.sm': {
    fontFamily: fonts.inter.semiBold,
    fontSize: 14,
    lineHeight: 20,
  },

  'body.lg': {
    fontFamily: fonts.inter.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  'body.md': {
    fontFamily: fonts.inter.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  'body.sm': {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    lineHeight: 18,
  },

  'label.lg': {
    fontFamily: fonts.inter.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  'label.md': {
    fontFamily: fonts.inter.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  'label.sm': {
    fontFamily: fonts.inter.medium,
    fontSize: 12,
    lineHeight: 16,
  },

  'caption': {
    fontFamily: fonts.inter.regular,
    fontSize: 11,
    lineHeight: 14,
  },

  'financial.hero': {
    fontFamily: fonts.inter.bold,
    fontSize: 40,
    lineHeight: 44,
    fontVariant: ['tabular-nums'],
  },
  'financial.lg': {
    fontFamily: fonts.inter.bold,
    fontSize: 32,
    lineHeight: 36,
    fontVariant: ['tabular-nums'],
  },
  'financial.md': {
    fontFamily: fonts.inter.bold,
    fontSize: 24,
    lineHeight: 30,
    fontVariant: ['tabular-nums'],
  },
  'financial.sm': {
    fontFamily: fonts.inter.semiBold,
    fontSize: 20,
    lineHeight: 26,
    fontVariant: ['tabular-nums'],
  },

  displayLarge: {
    fontFamily: fonts.inter.bold,
    fontSize: 36,
    lineHeight: 44,
  },
  displayMedium: {
    fontFamily: fonts.inter.bold,
    fontSize: 32,
    lineHeight: 40,
  },
  displaySmall: {
    fontFamily: fonts.inter.bold,
    fontSize: 28,
    lineHeight: 36,
  },
  headlineLarge: {
    fontFamily: fonts.inter.bold,
    fontSize: 24,
    lineHeight: 32,
  },
  headlineMedium: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 22,
    lineHeight: 28,
  },
  headlineSmall: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 20,
    lineHeight: 26,
  },
  titleLarge: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 18,
    lineHeight: 24,
  },
  titleMedium: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 16,
    lineHeight: 22,
  },
  titleSmall: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 14,
    lineHeight: 20,
  },
  bodyLarge: {
    fontFamily: fonts.inter.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: fonts.inter.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  labelLarge: {
    fontFamily: fonts.inter.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: fonts.inter.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  labelSmall: {
    fontFamily: fonts.inter.medium,
    fontSize: 12,
    lineHeight: 16,
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
