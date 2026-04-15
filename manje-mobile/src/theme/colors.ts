/**
 * Manje Design System - Color Tokens
 * Version: 2.0 Hybrid Premium Edition
 */

export const green = {
  50: '#F0FAF5',
  100: '#C8E6D8',
  200: '#94CDB0',
  300: '#5AB58A',
  400: '#2E9E6B',
  500: '#1A6B4A', // Brand Primary
  600: '#155A3D',
  700: '#0F4530',
  800: '#0D3B2E',
} as const;

export const neutral = {
  0: '#FFFFFF',
  50: '#F8FAF9',
  100: '#F1F4F2',
  300: '#CBD5D0',
  500: '#6B7B74',
  900: '#1C2421',
  950: '#0F1512',
} as const;

export const status = {
  success: '#16A34A',
  successBg: { light: '#DCFCE7', dark: 'rgba(22,163,74,0.15)' },
  warning: '#D97706',
  warningBg: { light: '#FEF3C7', dark: 'rgba(217,119,6,0.15)' },
  danger: '#DC2626',
  dangerBg: { light: '#FEE2E2', dark: 'rgba(220,38,38,0.15)' },
  info: '#2563EB',
  infoBg: { light: '#DBEAFE', dark: 'rgba(37,99,235,0.15)' },
} as const;

export const categoryColors = {
  food: { bg: '#FFF3E0', fg: '#E65100' },
  transport: { bg: '#E3F2FD', fg: '#1565C0' },
  shopping: { bg: '#F3E5F5', fg: '#6A1B9A' },
  utilities: { bg: '#FFF8E1', fg: '#F57F17' },
  healthcare: { bg: '#FFEBEE', fg: '#B71C1C' },
  education: { bg: '#EFEBE9', fg: '#4E342E' },
  entertainment: { bg: '#FCE4EC', fg: '#880E4F' },
  savings: { bg: '#E8F5EE', fg: '#1A6B4A' },
  income: { bg: '#DCFCE7', fg: '#14532D' },
  bills: { bg: '#E0F7FA', fg: '#006064' },
  personal: { bg: '#E1F5FE', fg: '#01579B' },
  other: { bg: '#F5F5F5', fg: '#424242' },
} as const;

export const lightColors = {
  bg: {
    base: neutral[50],
    card: neutral[0],
    sunken: neutral[100],
    overlay: 'rgba(0,0,0,0.5)',
  },
  primary: {
    default: green[500],
    pressed: green[600],
    subtle: green[50],
  },
  text: {
    primary: neutral[900],
    secondary: neutral[500],
    inverse: neutral[0],
  },
  border: {
    light: neutral[300],
    focus: green[500],
  },
  clay: {
    innerHighlight: 'rgba(255,255,255,0.7)',
    innerShadow: 'rgba(0,0,0,0.06)',
  },
  glass: {
    bg: 'rgba(255,255,255,0.85)',
    border: 'rgba(255,255,255,0.3)',
  },
  status: {
    success: status.success,
    successBg: status.successBg.light,
    warning: status.warning,
    warningBg: status.warningBg.light,
    danger: status.danger,
    dangerBg: status.dangerBg.light,
    info: status.info,
    infoBg: status.infoBg.light,
  },
} as const;

export const darkColors = {
  bg: {
    base: neutral[950],
    card: '#1C2421',
    sunken: '#141C18',
    overlay: 'rgba(0,0,0,0.7)',
  },
  primary: {
    default: green[500],
    pressed: green[600],
    subtle: 'rgba(26,107,74,0.2)',
  },
  text: {
    primary: '#F0FAF5',
    secondary: '#7A9E8B',
    inverse: '#FFFFFF',
  },
  border: {
    light: '#2D3D35',
    focus: green[500],
  },
  clay: {
    innerHighlight: 'rgba(255,255,255,0.04)',
    innerShadow: 'rgba(0,0,0,0.3)',
  },
  glass: {
    bg: 'rgba(15,21,18,0.85)',
    border: 'rgba(255,255,255,0.1)',
  },
  status: {
    success: status.success,
    successBg: status.successBg.dark,
    warning: status.warning,
    warningBg: status.warningBg.dark,
    danger: status.danger,
    dangerBg: status.dangerBg.dark,
    info: status.info,
    infoBg: status.infoBg.dark,
  },
} as const;

export type ColorTheme = {
  bg: {
    base: string;
    card: string;
    sunken: string;
    overlay: string;
  };
  primary: {
    default: string;
    pressed: string;
    subtle: string;
  };
  text: {
    primary: string;
    secondary: string;
    inverse: string;
  };
  border: {
    light: string;
    focus: string;
  };
  clay: {
    innerHighlight: string;
    innerShadow: string;
  };
  glass: {
    bg: string;
    border: string;
  };
  status: {
    success: string;
    successBg: string;
    warning: string;
    warningBg: string;
    danger: string;
    dangerBg: string;
    info: string;
    infoBg: string;
  };
};
