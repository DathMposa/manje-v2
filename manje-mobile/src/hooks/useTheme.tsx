/**
 * Theme Hook & Context
 * Provides theme colors and utilities based on system/user preference.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ColorTheme } from '../theme/colors';
import { createShadows, ShadowLevel } from '../theme/shadows';

type Shadows = ReturnType<typeof createShadows>;

interface ThemeContextType {
  isDark: boolean;
  colors: ColorTheme;
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark' | 'system') => void;
  themeMode: 'light' | 'dark' | 'system';
  shadow: (level: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => any;
  glow: (type: keyof Shadows['glow']) => any;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('light');
  
  const isDark = false;
  
  const colors = lightColors;
  const currentShadows = createShadows(false);
  
  const toggleTheme = () => {
    // Theme toggling disabled for now - defaulting to light mode
    console.log('Theme toggling is currently disabled.');
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
