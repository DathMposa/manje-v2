/**
 * Manje Design System - Spacing & Layout Tokens
 * Version: 2.0 Hybrid Premium Edition
 * 
 * Base unit: 4px. All spacing values are multiples of 4.
 */

// Spacing Scale (multiples of 4px)
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

// Border Radius Scale
export const radius = {
  sm: 4,    // Tags, small chips
  md: 8,    // Input fields, small components
  lg: 12,   // Buttons
  xl: 16,   // Small cards
  '2xl': 20, // Standard cards
  '3xl': 24, // Clay cards (primary)
  '4xl': 32, // Hero cards, bottom sheets
  full: 9999, // Pills, avatars, circular buttons
} as const;

// Layout Constants
export const layout = {
  // Screen padding
  screenPaddingH: 20,
  screenPaddingV: 16,
  
  // Card gaps
  cardGap: 12,
  sectionGap: 24,
  
  // Header heights
  headerHeight: 56,
  tabHeaderHeight: 64,
  tabBarHeight: 72,
  
  // Touch targets
  minTouchTarget: 44,
  touchTargetGap: 8,
  
  // Input heights
  inputHeight: 52,
  buttonHeightSm: 40,
  buttonHeightMd: 48,
  buttonHeightLg: 56,
  
  // Bottom sheet
  sheetHandleWidth: 32,
  sheetHandleHeight: 4,
  sheetHandleTop: 8,
  
  // Character sizes
  characterSm: 60,
  characterMd: 100,
  characterLg: 150,
  characterXl: 200,
} as const;

// Z-Index Scale
export const zIndex = {
  base: 0,
  raised: 10,
  sticky: 20,
  modal: 40,
  overlay: 50,
  toast: 70,
} as const;

// Screen Layout Templates (for reference)
export const screenTemplates = {
  standard: {
    description: 'Standard scroll screen with header',
    structure: '[Safe Area Top] → [Header 56px] → [Scroll Content: padding-h 20px, card gap 12px] → [Safe Area Bottom]',
  },
  tab: {
    description: 'Tab screen with bottom navigation',
    structure: '[Safe Area Top] → [Screen Header 64px] → [Scroll Content] → [Bottom Tab Bar 72px + safe area]',
  },
  modal: {
    description: 'Modal / Bottom Sheet',
    structure: '[Full-screen scrim] → [Sheet: radius-4xl top, slide from bottom] → [Handle 4×32px centered, 8px top] → [Content: 20px padding] → [Action area pinned bottom]',
  },
  hero: {
    description: 'Full-screen hero (Onboarding, Celebration)',
    structure: '[Safe Area full-bleed] → [Character area: flex 2, centred] → [Content: flex 1, 20px padding] → [Action: 20px + safe area bottom]',
  },
} as const;

export type SpacingKey = keyof typeof spacing;
export type RadiusKey = keyof typeof radius;
