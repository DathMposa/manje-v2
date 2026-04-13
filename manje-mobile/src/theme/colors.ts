/**
 * Manje Design System - Color Tokens
 * Version: 2.0 Hybrid Premium Edition
 * 
 * All colors are defined as semantic tokens with light/dark mode variants.
 * Never use hex values directly in components - always reference these tokens.
 */

// Primitive Green Ramp
export const green = {
  50: '#F0FAF4',
  100: '#D1F0DC',
  200: '#A7E0BC',
  300: '#76C99A',
  400: '#45B278',
  500: '#1A6B4A', // Brand Primary
  600: '#156040',
  700: '#0E4530',
  800: '#092B1E',
  900: '#05160F',
  950: '#020B08',
} as const;

// Primitive Accent Ramp
export const accent = {
  300: '#7FE9A8',
  400: '#4FDE8C',
  500: '#2ECC71', // Brand Accent
  600: '#27B360',
  700: '#1E8A4A',
} as const;

// Primitive Neutral Ramp
export const neutral = {
  50: '#F7FBF8',
  100: '#EEF4F0',
  200: '#D4E4D8',
  400: '#8AAF9A',
  600: '#4A7060',
  900: '#0E2418',
} as const;

// Status Colors
export const status = {
  success: '#22C55E',
  successBg: {
    light: '#DCFCE7',
    dark: 'rgba(34,197,94,0.15)',
  },
  warning: '#F59E0B',
  warningBright: '#FBBF24',
  warningBg: {
    light: '#FEF3C7',
    dark: 'rgba(245,158,11,0.15)',
  },
  danger: '#EF4444',
  dangerBright: '#F87171',
  dangerBg: {
    light: '#FEE2E2',
    dark: 'rgba(239,68,68,0.15)',
  },
  info: '#3B82F6',
  infoBright: '#60A5FA',
  infoBg: {
    light: '#DBEAFE',
    dark: 'rgba(59,130,246,0.15)',
  },
} as const;

// Category Colors (for transaction categories)
export const categories = {
  groceries: '#22C55E',
  dining: '#F59E0B',
  transport: '#3B82F6',
  utilities: '#8B5CF6',
  entertainment: '#EC4899',
  healthcare: '#06B6D4',
  shopping: '#F97316',
  bills: '#EF4444',
  education: '#6366F1',
  income: '#10B981',
  transfer: '#64748B',
  other: '#94A3B8',
} as const;

// Semantic Color Tokens - Light Mode
export const lightColors = {
  // Backgrounds
  bg: {
    base: '#F7FBF8',
    card: '#FFFFFF',
    sunken: '#EEF4F0',
    overlay: 'rgba(0,0,0,0.45)',
  },
  
  // Primary
  primary: {
    main: '#1A6B4A',
    hover: '#156040',
    light: '#D1F0DC',
  },
  
  // Accent
  accent: {
    main: '#2ECC71',
    hover: '#27B360',
  },
  
  // Text
  text: {
    primary: '#0E2418',
    secondary: '#4A7060',
    muted: '#8AAF9A',
    inverse: '#FFFFFF',
  },
  
  // Borders
  border: {
    light: '#D4E4D8',
    medium: '#B0C9B6',
    focus: '#1A6B4A',
  },
  
  // Claymorphism
  clay: {
    innerHighlight: 'rgba(255,255,255,0.40)',
    innerShadow: 'rgba(0,0,0,0.06)',
    buttonHighlight: 'rgba(255,255,255,0.25)',
    insetBorder: 'rgba(0,0,0,0.04)',
    insetBg: '#EEF4F0',
  },
  
  // Glass Effects
  glass: {
    bg: 'rgba(255,255,255,0.72)',
    border: 'rgba(255,255,255,0.18)',
  },
  
  // Status
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

// Semantic Color Tokens - Dark Mode
export const darkColors = {
  // Backgrounds
  bg: {
    base: '#0C1410',
    card: '#142018',
    sunken: '#0A0F0C',
    overlay: 'rgba(0,0,0,0.65)',
  },
  
  // Primary (accent pops on dark)
  primary: {
    main: '#2ECC71',
    hover: '#27B360',
    light: 'rgba(46,204,113,0.15)',
  },
  
  // Accent
  accent: {
    main: '#2ECC71',
    hover: '#4FDE8C',
  },
  
  // Text
  text: {
    primary: '#E8F5EE',
    secondary: '#7DB896',
    muted: '#4A7060',
    inverse: '#0C1410',
  },
  
  // Borders
  border: {
    light: 'rgba(255,255,255,0.08)',
    medium: 'rgba(255,255,255,0.16)',
    focus: '#2ECC71',
  },
  
  // Claymorphism
  clay: {
    innerHighlight: 'rgba(255,255,255,0.07)',
    innerShadow: 'rgba(0,0,0,0.25)',
    buttonHighlight: 'rgba(255,255,255,0.10)',
    insetBorder: 'rgba(255,255,255,0.08)',
    insetBg: '#0A0F0C',
  },
  
  // Glass Effects
  glass: {
    bg: 'rgba(12,20,16,0.85)',
    border: 'rgba(255,255,255,0.08)',
  },
  
  // Status
  status: {
    success: status.success,
    successBg: status.successBg.dark,
    warning: status.warningBright,
    warningBg: status.warningBg.dark,
    danger: status.dangerBright,
    dangerBg: status.dangerBg.dark,
    info: status.infoBright,
    infoBg: status.infoBg.dark,
  },
} as const;

// Character Colors (for ManjeCharacter)
export const character = {
  bodyBase: '#1A6B4A',
  bodyHighlight: '#2ECC71',
  bodyShadow: '#0E3D2A',
  face: '#FFFFFF',
  eyes: '#0E2418',
  blush: '#F472B6',
  sparkle: '#FCD34D',
  glassesLight: '#1E293B',
  glassesDark: '#E8F5EE',
} as const;

// Color theme type - uses a more flexible structure for light/dark compatibility
export interface ColorTheme {
  bg: {
    base: string;
    card: string;
    sunken: string;
    overlay: string;
  };
  primary: {
    main: string;
    hover: string;
    light: string;
  };
  accent: {
    main: string;
    hover: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };
  border: {
    light: string;
    medium: string;
    focus: string;
  };
  clay: {
    innerHighlight: string;
    innerShadow: string;
    buttonHighlight: string;
    insetBorder: string;
    insetBg: string;
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
}
