/**
 * Theme Hook & Context
 * Provides theme colors and utilities based on system/user preference.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ColorTheme } from '../theme/colors';
import { getShadow, getGlowShadow, ShadowSize, GlowType } from '../theme/shadows';

interface ThemeContextType {
  isDark: boolean;
  colors: ColorTheme;
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark' | 'system') => void;
  themeMode: 'light' | 'dark' | 'system';
  shadow: (size: ShadowSize) => ReturnType<typeof getShadow>;
  glow: (type: GlowType) => ReturnType<typeof getGlowShadow>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system');
  
  const isDark = themeMode === 'system' 
    ? systemColorScheme === 'dark'
    : themeMode === 'dark';
  
  const colors = isDark ? darkColors : lightColors;
  
  const toggleTheme = () => {
    setThemeMode(prev => {
      if (prev === 'system') return 'light';
      if (prev === 'light') return 'dark';
      return 'system';
    });
  };
  
  const setTheme = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
  };
  
  const shadow = (size: ShadowSize) => getShadow(size, isDark);
  const glow = (type: GlowType) => getGlowShadow(type, isDark);
  
  return (
    <ThemeContext.Provider value={{
      isDark,
      colors,
      toggleTheme,
      setTheme,
      themeMode,
      shadow,
      glow,
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
