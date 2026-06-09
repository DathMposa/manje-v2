/**
 * Manje Design System - Animation & Micro-Interaction Tokens
 * Version: 2.1 Refined Motion Edition
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
    damping: 45, // Increased from 40 for a tighter feel
    mass: 0.8,
    overshootClamping: true, // No bounce on button press
  },
  cardRelease: {
    stiffness: 300,
    damping: 40, // Increased from 30
    mass: 1,
    overshootClamping: true,
  },
  bouncy: {
    stiffness: 200,
    damping: 35, // Increased from 20 to tone down the "cheap" bounce
    mass: 1,
    overshootClamping: false,
  },
  default: {
    stiffness: 250,
    damping: 35, // Increased from 28
    mass: 1,
    overshootClamping: true,
  },
  snappy: {
    stiffness: 500,
    damping: 60, // Increased from 50
    mass: 1,
    overshootClamping: true,
  },
  gentle: {
    stiffness: 100,
    damping: 30, // Increased from 20
    mass: 1,
    overshootClamping: true,
  },
  modal: {
    stiffness: 350,
    damping: 45, // Increased from 35
    mass: 1,
    overshootClamping: true,
  },
} as const;

export type DurationKey = keyof typeof duration;
export type SpringPresetKey = keyof typeof springPresets;
