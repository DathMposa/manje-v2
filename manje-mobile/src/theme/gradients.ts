/**
 * Manje Design System - Gradient Tokens
 * Version: 2.0 Hybrid Premium Edition
 * 
 * Premium gradients for hero cards, buttons, and accent effects.
 * Use with expo-linear-gradient.
 */

// Gradient definitions for LinearGradient component
export const gradients = {
  // Hero card gradient (diagonal)
  hero: {
    colors: ['#1A6B4A', '#2ECC71', '#1A6B4A'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    locations: [0, 0.5, 1],
  },
  
  // Hero shine overlay
  heroShine: {
    colors: ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0)'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    locations: [0, 0.5],
  },
  
  // Accent gradient (horizontal)
  accent: {
    colors: ['#2ECC71', '#27B360'],
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
  
  // Button top shine
  buttonShine: {
    colors: ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0)'],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
    locations: [0, 0.5],
  },
  
  // Card top glow (radial effect simulated)
  cardGlow: {
    colors: ['rgba(46,204,113,0.08)', 'transparent'],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 0.7 },
  },
  
  // Dark mode hero
  darkHero: {
    colors: ['#0C1410', '#1A6B4A', '#0C1410'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    locations: [0, 0.5, 1],
  },
  
  // Dark mode accent (brighter)
  darkAccent: {
    colors: ['#2ECC71', '#4FDE8C'],
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
  
  // Success gradient
  success: {
    colors: ['#22C55E', '#10B981'],
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
  
  // Warning gradient
  warning: {
    colors: ['#F59E0B', '#FBBF24'],
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
  
  // Danger gradient
  danger: {
    colors: ['#EF4444', '#F87171'],
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
  
  // Skeleton loading shimmer
  skeleton: {
    colors: ['transparent', 'rgba(255,255,255,0.3)', 'transparent'],
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
    locations: [0, 0.5, 1],
  },
} as const;

// Progress bar gradients based on health state
export const progressGradients = {
  healthy: {
    colors: ['#22C55E', '#10B981'],
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
  caution: {
    colors: ['#F59E0B', '#FBBF24'],
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
  critical: {
    colors: ['#EF4444', '#F87171'],
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
  exceeded: {
    colors: ['#DC2626', '#EF4444'],
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
} as const;

export type GradientKey = keyof typeof gradients;
export type ProgressGradientKey = keyof typeof progressGradients;
