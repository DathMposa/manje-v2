import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInUp, FadeOutUp, SlideInUp, SlideOutUp, useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from './useTheme';
import { typeScale } from '../theme/typography';
import { spacing, radius, layout } from '../theme/spacing';

export type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const { colors, shadow } = useTheme();
  const insets = useSafeAreaInsets();

  const showToast = useCallback((options: ToastOptions) => {
    setToast(options);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, toast.duration || 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  const getToastColors = (type: ToastType = 'info') => {
    switch (type) {
      case 'success':
        return { bg: colors.status.success.bg, border: colors.status.success.base, icon: colors.status.success.text, iconName: 'check-circle' as const };
      case 'error':
        return { bg: colors.status.danger.bg, border: colors.status.danger.base, icon: colors.status.danger.text, iconName: 'alert-circle' as const };
      case 'info':
      default:
        return { bg: colors.primary.subtle, border: colors.primary.default, icon: colors.primary.default, iconName: 'info' as const };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <Animated.View
          entering={SlideInUp.springify().damping(15)}
          exiting={FadeOutUp.duration(200)}
          style={[
            styles.toastContainer,
            { top: Math.max(insets.top, spacing[4]) },
            shadow('md')
          ]}
          pointerEvents="none"
        >
          <View
            style={[
              styles.toastContent,
              {
                backgroundColor: colors.bg.card,
                borderLeftColor: getToastColors(toast.type).border,
              }
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: getToastColors(toast.type).bg }]}>
              <Feather name={getToastColors(toast.type).iconName} size={20} color={getToastColors(toast.type).icon} />
            </View>
            <Text style={[styles.toastMessage, typeScale['label.md'], { color: colors.text.primary }]}>
              {toast.message}
            </Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: layout.screenPaddingH,
    right: layout.screenPaddingH,
    zIndex: 9999,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: radius.xl,
    borderLeftWidth: 4,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  toastMessage: {
    flex: 1,
  },
});
