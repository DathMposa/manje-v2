/**
 * Manje Design System - Typography Tokens
 * Version: 2.0 Hybrid Premium Edition
 */
import { Platform, TextStyle } from 'react-native';

export const fonts = {
  syne: {
    regular: 'Syne_400Regular',
    semiBold: 'Syne_600SemiBold',
    bold: 'Syne_700Bold',
    extraBold: 'Syne_800ExtraBold',
  },
  workSans: {
    regular: 'WorkSans_400Regular',
    medium: 'WorkSans_500Medium',
    semiBold: 'WorkSans_600SemiBold',
    bold: 'WorkSans_700Bold',
  },
};

export const typeScale: Record<string, TextStyle> = {
  'display.lg': {
    fontFamily: fonts.syne.extraBold,
    fontSize: 36,
    lineHeight: 36 * 1.1,
  },
  'display.md': {
    fontFamily: fonts.syne.bold,
    fontSize: 30,
    lineHeight: 30 * 1.15,
  },
  'display.sm': {
    fontFamily: fonts.syne.bold,
    fontSize: 24,
    lineHeight: 24 * 1.2,
  },
  'headline.lg': {
    fontFamily: fonts.workSans.semiBold,
    fontSize: 20,
    lineHeight: 20 * 1.3,
  },
  'headline.md': {
    fontFamily: fonts.workSans.semiBold,
    fontSize: 18,
    lineHeight: 18 * 1.3,
  },
  'headline.sm': {
    fontFamily: fonts.workSans.semiBold,
    fontSize: 16,
    lineHeight: 16 * 1.4,
  },
  'body.lg': {
    fontFamily: fonts.workSans.regular,
    fontSize: 18,
    lineHeight: 18 * 1.5,
  },
  'body.md': {
    fontFamily: fonts.workSans.regular,
    fontSize: 16,
    lineHeight: 16 * 1.5,
  },
  'body.sm': {
    fontFamily: fonts.workSans.regular,
    fontSize: 14,
    lineHeight: 14 * 1.5,
  },
  'label.lg': {
    fontFamily: fonts.workSans.medium,
    fontSize: 16,
    lineHeight: 16 * 1.4,
  },
  'label.md': {
    fontFamily: fonts.workSans.medium,
    fontSize: 14,
    lineHeight: 14 * 1.3,
  },
  'label.sm': {
    fontFamily: fonts.workSans.medium,
    fontSize: 12,
    lineHeight: 12 * 1.3,
  },
  'financial.hero': {
    fontFamily: fonts.syne.extraBold,
    fontSize: 52,
    lineHeight: 52 * 1.0,
    fontVariant: ['tabular-nums'],
  },
  'financial.lg': {
    fontFamily: fonts.syne.bold,
    fontSize: 48,
    lineHeight: 48 * 1.0,
    fontVariant: ['tabular-nums'],
  },
  'financial.md': {
    fontFamily: fonts.syne.bold,
    fontSize: 30,
    lineHeight: 30 * 1.1,
    fontVariant: ['tabular-nums'],
  },
  'financial.sm': {
    fontFamily: fonts.workSans.semiBold,
    fontSize: 20,
    lineHeight: 20 * 1.2,
    fontVariant: ['tabular-nums'],
  },
};

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
