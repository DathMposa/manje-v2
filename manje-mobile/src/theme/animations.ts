/**
 * Manje Design System - Animation Tokens
 * Version: 2.0 Hybrid Premium Edition
 * 
 * Animation configurations for react-native-reanimated.
 * All animations respect reduced motion preferences.
 */

import { WithSpringConfig, WithTimingConfig, Easing } from 'react-native-reanimated';

// Duration tokens (in milliseconds)
export const duration = {
  fast: 150,
  normal: 250,
  moderate: 350,
  slow: 500,
  celebration: 600,
  character: 2000,
} as const;

// Easing curves
export const easing = {
  standard: Easing.bezier(0.2, 0, 0, 1),
  enter: Easing.bezier(0.0, 0.0, 0.2, 1.0),
  exit: Easing.bezier(0.4, 0.0, 1.0, 1.0),
  linear: Easing.linear,
} as const;

// Spring configurations for react-native-reanimated
export const springConfigs = {
  // Default spring for general UI
  default: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  } as WithSpringConfig,
  
  // Snappy spring for press feedback
  snappy: {
    damping: 20,
    stiffness: 400,
    mass: 0.8,
  } as WithSpringConfig,
  
  // Bouncy spring for celebrations
  bouncy: {
    damping: 8,
    stiffness: 100,
    mass: 1,
  } as WithSpringConfig,
  
  // Gentle spring for character animations
  gentle: {
    damping: 12,
    stiffness: 80,
    mass: 1.2,
  } as WithSpringConfig,
  
  // Button press spring
  buttonPress: {
    damping: 15,
    stiffness: 400,
    mass: 0.8,
  } as WithSpringConfig,
  
  // Card press spring
  cardPress: {
    damping: 18,
    stiffness: 300,
    mass: 0.9,
  } as WithSpringConfig,
  
  // Tab selection spring
  tabSelect: {
    damping: 14,
    stiffness: 200,
    mass: 0.7,
  } as WithSpringConfig,
  
  // Modal enter spring
  modalEnter: {
    damping: 20,
    stiffness: 180,
    mass: 1,
  } as WithSpringConfig,
} as const;

// Timing configurations
export const timingConfigs = {
  fast: {
    duration: duration.fast,
    easing: easing.standard,
  } as WithTimingConfig,
  
  normal: {
    duration: duration.normal,
    easing: easing.standard,
  } as WithTimingConfig,
  
  moderate: {
    duration: duration.moderate,
    easing: easing.enter,
  } as WithTimingConfig,
  
  slow: {
    duration: duration.slow,
    easing: easing.standard,
  } as WithTimingConfig,
  
  fadeIn: {
    duration: duration.normal,
    easing: easing.enter,
  } as WithTimingConfig,
  
  fadeOut: {
    duration: duration.fast,
    easing: easing.exit,
  } as WithTimingConfig,
} as const;

// Animation presets for common interactions
export const animationPresets = {
  // Button press animation values
  buttonPress: {
    scale: {
      pressed: 0.96,
      released: 1,
    },
    opacity: {
      pressed: 0.9,
      released: 1,
    },
  },
  
  // Card press animation values
  cardPress: {
    scale: {
      pressed: 0.98,
      released: 1,
      overshoot: 1.02,
    },
  },
  
  // Input focus animation values
  inputFocus: {
    borderWidth: {
      default: 1,
      focused: 2,
    },
    labelTranslateY: -24,
    labelScale: 0.85,
  },
  
  // Toggle switch animation values
  toggleSwitch: {
    thumbTranslateX: 20,
  },
  
  // List item swipe
  listSwipe: {
    threshold: 80,
    actionScale: {
      hidden: 0.8,
      visible: 1,
    },
  },
  
  // Tab bar selection
  tabSelect: {
    iconScale: {
      default: 1,
      selected: 1.15,
    },
    labelOpacity: {
      default: 0.6,
      selected: 1,
    },
    indicatorWidth: 24,
  },
  
  // Number counter
  numberCounter: {
    translateY: 10,
  },
  
  // Character idle float
  characterFloat: {
    translateY: -6,
    duration: 2000,
  },
  
  // Character celebrate
  characterCelebrate: {
    scale: 1.12,
    translateY: -20,
    confettiSpread: { min: 40, max: 80 },
    confettiCount: 8,
  },
  
  // Skeleton shimmer
  skeleton: {
    translateX: { start: -100, end: 100 },
    duration: 1200,
  },
  
  // Toast entrance
  toast: {
    translateY: 64,
    autoDismiss: 3000,
  },
  
  // Page transitions
  pageTransition: {
    slideOffset: 0.3, // 30% of screen width
  },
} as const;

// Haptic feedback types (for expo-haptics)
export const haptics = {
  light: 'light' as const,
  medium: 'medium' as const,
  heavy: 'heavy' as const,
  selection: 'selection' as const,
  success: 'success' as const,
  warning: 'warning' as const,
  error: 'error' as const,
} as const;

export type DurationKey = keyof typeof duration;
export type SpringConfigKey = keyof typeof springConfigs;
export type TimingConfigKey = keyof typeof timingConfigs;
