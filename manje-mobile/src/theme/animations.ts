/**
 * Manje Design System - Animation & Micro-Interaction Tokens
 * Version: 2.0 Hybrid Premium Edition
 */

export const duration = {
  instant: 0,
  fast: 150,
  normal: 250,
  moderate: 400,
  slow: 600,
  stagger: 1000,
} as const;

export const springPresets = {
  buttonPress: {
    stiffness: 400,
    damping: 40,
    mass: 1,
    overshootClamping: false,
  },
  cardRelease: {
    stiffness: 300,
    damping: 30,
    mass: 1,
    overshootClamping: false,
  },
  bouncy: {
    stiffness: 200,
    damping: 20,
    mass: 1,
    overshootClamping: false,
  },
  default: {
    stiffness: 250,
    damping: 28,
    mass: 1,
    overshootClamping: false,
  },
  snappy: {
    stiffness: 500,
    damping: 50,
    mass: 1,
    overshootClamping: false,
  },
  gentle: {
    stiffness: 100,
    damping: 20,
    mass: 1,
    overshootClamping: false,
  },
  modal: {
    stiffness: 350,
    damping: 35,
    mass: 1,
    overshootClamping: false,
  },
} as const;

export type DurationKey = keyof typeof duration;
export type SpringPresetKey = keyof typeof springPresets;
