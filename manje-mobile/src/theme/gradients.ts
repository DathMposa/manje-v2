/**
 * Manje Design System - Gradient Token Library
 * Version: 2.0 Hybrid Premium Edition
 */

export const gradients = {
  hero: {
    colors: ['#1A6B4A', '#0D3B2E'], // top to bottom
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  heroShine: {
    colors: ['#2E9E6B', '#1A6B4A', '#0D3B2E'], // 135°
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  button: {
    colors: ['#2E9E6B', '#1A6B4A'], // left to right
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
  accent: {
    colors: ['#2563EB', '#7C3AED'], // 135°
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  cardGlow: {
    colors: ['rgba(26,107,74,0.12)', 'transparent'], // top
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  darkHero: {
    colors: ['#0D3B2E', '#050F0A'], // top to bottom
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  surface: {
    colors: ['#F8FAF9', '#EEF5F1'], // 180° (top to bottom)
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  onboarding: {
    colors: ['#E8F5EE', '#F0FAF5', '#FFFFFF'], // top to bottom
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  
  // Progress specific
  progress: {
    healthy: {
      colors: ['#2E9E6B', '#16A34A'], // left to right
      start: { x: 0, y: 0.5 },
      end: { x: 1, y: 0.5 },
    },
    caution: {
      colors: ['#F59E0B', '#D97706'], // left to right
      start: { x: 0, y: 0.5 },
      end: { x: 1, y: 0.5 },
    },
    exceeded: {
      colors: ['#EF4444', '#DC2626'], // left to right
      start: { x: 0, y: 0.5 },
      end: { x: 1, y: 0.5 },
    },
  },
};

export type GradientKey = keyof typeof gradients;
export type ProgressGradientKey = keyof typeof gradients.progress;
