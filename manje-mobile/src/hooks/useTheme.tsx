/**
 * Theme Hook & Context
 * Provides theme colors and utilities based on system/user preference.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, categoryColors } from '../theme/colors';
import { createShadows, ShadowLevel } from '../theme/shadows';
import { typeScale, fonts } from '../theme/typography';
import { spacing, layout, radius } from '../theme/spacing';

type Shadows = ReturnType<typeof createShadows>;

interface ThemeContextType {
  isDark: boolean;
  colors: any;
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark' | 'system') => void;
  themeMode: 'light' | 'dark' | 'system';
  shadow: (level: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => any;
  glow: (type: keyof Shadows['glow']) => any;
  typography: any;
  spacing: any;
  layout: typeof layout;
  radius: any;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('light');
  
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');
  
  const baseColors = isDark ? darkColors : lightColors;
  const currentShadows = createShadows(isDark);

  const colors = {
    ...baseColors,
    background: baseColors.bg,
    primary: {
      ...baseColors.primary,
      base: baseColors.primary.default,
      text: baseColors.text.inverse,
    },
    text: {
      ...baseColors.text,
      muted: baseColors.text.secondary,
    },
    border: {
      ...baseColors.border,
      medium: baseColors.border.light,
    },
    status: {
      success: {
        base: baseColors.status.success,
        text: baseColors.status.success,
        bg: baseColors.status.successBg,
      },
      warning: {
        base: baseColors.status.warning,
        text: baseColors.status.warning,
        bg: baseColors.status.warningBg,
      },
      danger: {
        base: baseColors.status.danger,
        text: baseColors.status.danger,
        bg: baseColors.status.dangerBg,
      },
      info: {
        base: baseColors.status.info,
        text: baseColors.status.info,
        bg: baseColors.status.infoBg,
      },
    },
    category: {
      groceries: categoryColors.food.fg,
      dining: categoryColors.food.fg,
      transport: categoryColors.transport.fg,
      utilities: categoryColors.utilities.fg,
      entertainment: categoryColors.entertainment.fg,
      healthcare: categoryColors.healthcare.fg,
      shopping: categoryColors.shopping.fg,
      bills: categoryColors.bills.fg,
      education: categoryColors.education.fg,
      income: categoryColors.income.fg,
      transfer: categoryColors.personal.fg,
      other: categoryColors.other.fg,
    },
  };

  const typography = {
    scale: typeScale,
    fonts,
    display: {
      large: typeScale['display.lg'],
      medium: typeScale['display.md'],
      small: typeScale['display.sm'],
    },
    headline: {
      large: typeScale['headline.lg'],
      medium: typeScale['headline.md'],
      small: typeScale['headline.sm'],
    },
    body: {
      large: typeScale['body.lg'],
      medium: typeScale['body.md'],
      small: typeScale['body.sm'],
    },
    label: {
      large: typeScale['label.lg'],
      medium: typeScale['label.md'],
      small: typeScale['label.sm'],
    },
    financial: {
      hero: typeScale['financial.hero'],
      large: typeScale['financial.lg'],
      medium: typeScale['financial.md'],
      small: typeScale['financial.sm'],
    },
  };

  const spacingCompat = {
    ...spacing,
    xs: spacing[1],
    sm: spacing[2],
    md: spacing[4],
    lg: spacing[6],
    xl: spacing[8],
    '2xl': spacing[10],
    '3xl': spacing[12],
    '4xl': spacing[16],
  };
  
  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };
  
  const shadow = (level: keyof Omit<Shadows, 'glow'>) => currentShadows[level];
  const glow = (type: keyof Shadows['glow']) => currentShadows.glow[type];
  
  return (
    <ThemeContext.Provider value={{
      isDark,
      colors,
      toggleTheme,
      setTheme: setThemeMode,
      themeMode,
      shadow,
      glow,
      typography,
      spacing: spacingCompat,
      layout,
      radius,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default useTheme;
