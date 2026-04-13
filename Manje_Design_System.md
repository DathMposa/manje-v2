# Manje Design System & Brand Guide
**Version:** 2.0 — Hybrid Premium Edition | **Date:** April 2026 | **Supersedes:** v1.0

> **v2.0 Changes:** Added premium gradients, refined shadow system with colour tints, glass/frosted effects, micro-interaction specifications, and enhanced dark mode polish. Inspired by Revolut's professional aesthetic while preserving Manje's Claymorphism foundation.

> Single source of truth for all design, engineering, and brand decisions across every Manje product surface. This document wins when conflicts arise.

---

## Table of Contents
1. [Document Overview](#1-document-overview)
2. [Brand Identity](#2-brand-identity)
3. [ManjeCharacter — The Living Brand](#3-manjecharacter--the-living-brand)
4. [Colour System](#4-colour-system)
5. [Typography](#5-typography)
6. [Spacing, Layout & Grid](#6-spacing-layout--grid)
7. [Motion & Animation System](#7-motion--animation-system)
8. [Claymorphism Component Patterns](#8-claymorphism-component-patterns)
9. [Iconography](#9-iconography)
10. [Data Visualisation](#10-data-visualisation)
11. [Cross-Surface Guidelines](#11-cross-surface-guidelines)
12. [Accessibility Standards](#12-accessibility-standards)
13. [Governance](#13-governance)

---

## 1. Document Overview

### 1.1 Purpose
Manje is not just a finance app — it is a character-driven financial companion. This design system defines every visual, motion, and interaction decision that makes Manje recognisably itself across mobile (React Native/Expo), web platform (Next.js manje-web), and public landing site (manje-landing).

### 1.2 Audience Guide

| Role | Sections to prioritise |
|------|----------------------|
| Mobile engineers | §3.4, §3.6, §4, §6, §7, §8, §11.1 |
| Web engineers | §4, §5, §6, §8, §11.2, §11.3 |
| UI/UX Designers | §2, §3, §4, §5, §8, §9, §10 |
| Illustrators / Animators | §3 in full |
| Product / Stakeholders | §2, §3.1–3.3 |

### 1.3 Design Reference Aesthetic
- **Headspace** — warm earthy light palette, character-driven UX, calming purposeful motion
- **Cash App** — bold dark mode, high-contrast financial data, confident spatial hierarchy

**Result:**
- Light mode: warm earthy clay surfaces — approachable and trustworthy
- Dark mode: rich deep green-black, luminous accents — premium and confident

### 1.4 Update Process
Update this document **first**, then code tokens, then components. Never change code without updating this document. All structural changes need product team review.

---

## 2. Brand Identity

### 2.1 Name & Etymology
**Manje** — pronounced *"mahn-jeh"* — means *"now"* in Chichewa, the national language of Malawi. Core promise: an immediate, honest picture of your financial life. No waiting, no complexity — *manje*.

### 2.2 Brand Promise & Tagline
> **"Know where your money is going. Know what to do next. Feel in control — right now."**

**Tagline:** *Track it. Budget it. Grow it.*

### 2.3 Brand Personality

| Trait | In practice |
|-------|-------------|
| **Knowledgeable** | Explains simply, never condescends |
| **Encouraging** | Never shames. Celebrates progress, reframes challenges |
| **Relatable** | Speaks like a brilliant friend, not a bank |
| **Culturally Grounded** | Village savings, mobile money, informal lending are first-class features |
| **Trustworthy** | Transparent about data, security, and limitations |

### 2.4 Voice & Tone

| ✅ Do | ❌ Don't |
|------|---------|
| Conversational, warm language | Financial jargon |
| Celebrate progress ("You saved 15% more!") | Be preachy or guilt-inducing |
| Active voice, short sentences | Passive constructions |
| Address the user as "you" | Say "users" or "customers" |
| Be specific ("MWK 3,200 left this month") | Be vague ("some money remaining") |

**Financial Term Rewrites**

| ❌ Avoid | ✅ Use instead |
|---------|--------------|
| Amortization | "How your loan repayments are structured" |
| Principal Balance | "Amount you still owe (not including interest)" |
| Budget Variance | "How much you're over or under your budget" |
| Liquidity | "Cash you have available right now" |

**Tone by Context**

| Context | Example |
|---------|---------|
| Budget at 80% | "Heads up — you've used most of your dining budget this month." |
| Budget exceeded | "You've gone a bit over this month — let's see what we can do." |
| Goal milestone | "You're halfway to your vacation fund! Keep going!" |
| Overdue bill | "Your ESCOM bill is overdue — let's sort this out quickly." |
| Offline | "You're offline. Your data is safe here — we'll sync when you reconnect." |

### 2.5 Logo Guidelines
- **Minimum clear space:** Equal to height of "M" on all sides
- **Minimum digital size:** 24px height
- **Approved variants:** Full colour (green on white), Reversed (white on deep green), Monochrome
- **Never:** stretch, rotate, add drop shadows, recolour, place on busy backgrounds

---

## 3. ManjeCharacter — The Living Brand

> Manje is not a mascot. He is the product's personality made visible — a trusted, warm, financially-savvy companion who reacts to the user's financial reality in real time.

### 3.1 Character Identity

| Attribute | Specification |
|-----------|--------------|
| Identity | Black male, age 25–35 |
| Aesthetic | "Cool geek" — glasses, balancing formality with warmth |
| Wardrobe | Contextual per feature area (see §3.1.1) |
| Presence | Full-body (hero/celebration), half-body (conversation), face badge (inline/ManjeMood) |
| Sizes | sm: 60px · md: 100px · lg: 150px · xl: 200px |

**3.1.1 Contextual Wardrobe**

| Feature Area | Outfit |
|-------------|--------|
| Dashboard, budgets, planning | Business casual — collared shirt |
| Celebration, goals achieved | Smart casual — open collar, relaxed |
| AI chat, education | Casual — comfortable, approachable |
| Sleep / inactivity | Loungewear |
| Concern / warnings | Attentive — slightly more formal, leaning in |

### 3.2 Character Personality

- **Speaks in first person.** "I can see you're doing well this month" — not "The data shows positive trends."
- **Never passive.** Reacts, suggests, celebrates — never a static icon.
- **Reads the room.** Acknowledges problems with warmth and immediately offers a path forward.
- **Culturally present.** Understands village savings, MWK, mobile money. Never treats them as foreign.
- **Has warm humour.** Light and never at the user's expense.

**Manje's Voice by Mood**

| Mood | Example line |
|------|-------------|
| `wave` | "Good to see you back! Let's take a look at how things are going." |
| `happy` | "You're doing really well — MWK 8,400 still available. Nice work." |
| `thinking` | "Let me crunch through your numbers for a moment…" |
| `celebrate` | "You did it! Emergency fund goal hit. This is a big deal — seriously!" |
| `concern` | "I noticed your food budget is getting tight. Want to see where it went?" |
| `encourage` | "You're close — just MWK 1,200 away from your savings target. You've got this." |
| `sleep` | "Hey, it's been a while. Want to catch up on what's happened with your money?" |
| `surprise` | "Whoa — that's a bigger grocery spend than usual. Everything okay?" |

### 3.3 The 8 Mood States

| Mood | Trigger | Expression | Use / Never use |
|------|---------|-----------|----------------|
| `wave` | App open (first session), onboarding, return after absence | Curved eyes, wide smile, right arm mid-wave | Welcome screens, greetings / never on error states |
| `happy` | Budget < 75% used, positive trend, income confirmed | Curved eyes, broad smile, blush | Healthy dashboard, success confirmations |
| `thinking` | AI processing, data loading | Asymmetric eyes, chin-tap pose, 3 animated dots | All AI features while loading |
| `celebrate` | Goal milestone, streak hit, onboarding complete | Arms raised, widest smile, confetti | MilestoneCelebration overlay, success screens |
| `concern` | Budget > 90%, overdue bill, anomaly | Slight frown, forward lean — attentive not distressed | Budget critical state, overdue bills |
| `encourage` | Budget 75–90%, goal behind pace, streak at risk | Determined eyes, fist-pump | Budget warning, goal behind-pace |
| `sleep` | 5+ days inactive | Closed eyes, tiny smile, floating Zzz | Re-engagement screens only |
| `surprise` | 2× average spend anomaly, unexpected data | Wide round eyes, O-mouth, backward lean | Anomaly card only — use sparingly |

### 3.4 Animation Vocabulary — Complete Specification

> **All animations must respect `AccessibilityInfo.isReduceMotionEnabled`.** When reduce motion is on: static correct-mood state, no animation.

**3.4.1 Idle Float** (passive presence)
Y: 0 → −6px → 0 · 2000ms per direction · sinusoidal · infinite loop · Active on hero/prominent placements only

**3.4.2 Mood Entry** (mood state change)
Scale: 0.8 → 1.05 → 1.0 · 400ms · spring (friction: 6, tension: 80)

**3.4.3 Celebrate Burst** (milestone achievement)
1. Scale 1.0→1.12 + Y: 0→−20px · 300ms spring up
2. Scale 1.12→0.98→1.0 + Y: −20px→0 · 400ms ease-in-out down
3. 8 confetti particles: radial spread 40–80px, scale 0→1→0, opacity 1→0, 600ms, 0–80ms staggered delay
4. Particle colours cycle: `accent-500`, `primary.light`, `character.blush`, `cards.yellow`

**3.4.4 Thinking Pulse** (AI loading)
3 dots, 8px diameter, 6px gap · Each: opacity 0.2→1.0→0.2 · 600ms · 200ms stagger between dots · Loop while loading

**3.4.5 Wave Gesture** (greeting)
Right arm: base (−15°) → +30° → base · 600ms/cycle · ease-in-out · 3 cycles then rest

**3.4.6 Concern Lean** (warning visible on screen)
translateX: +4px + rotate: 5° toward content · 300ms ease-out · Reverses on mood change

**3.4.7 Surprise Pop** (anomaly detected)
Scale: 1.0→1.15→1.0 · 250ms · spring (friction: 4, tension: 120)

**3.4.8 Sleep Drift** (inactive mood)
3 Zzz text elements (sizes: 12%s, 9%s, 6%s where s = character size)
Each: translateY 0→−24px + opacity 0→0.6→0 · 2000ms · stagger: 0ms / 700ms / 1400ms · loop

**3.4.9 Screen Entry** (first appearance on mount)
translateY +16px→0 + opacity 0→1 · 400ms · cubic-bezier(0.0, 0.0, 0.2, 1.0) · once on mount

**3.4.10 Bounce Reaction** (positive action completed)
Scale: 1.0→1.08→0.96→1.0 · 500ms · spring (friction: 5, tension: 90)

### 3.5 Character-Driven UX Rules

**When & How to Show Manje**

| Context | Size | Mood | Animated |
|---------|------|------|----------|
| Onboarding welcome | xl | `wave` | Idle float + wave gesture |
| Dashboard hero — healthy budget | lg | `happy` | Idle float |
| Dashboard hero — budget warning | md | `concern` | Concern lean |
| Dashboard hero — no budget set | lg | `encourage` | Idle float |
| All empty states | md | `wave` or `encourage` | Idle float |
| AI chat (loading) | sm | `thinking` | Thinking pulse |
| AI chat (idle) | sm | `happy` | No animation |
| Goal milestone overlay | xl | `celebrate` | Celebrate burst |
| Onboarding success | xl | `celebrate` | Celebrate burst |
| Error / offline states | md | `concern` | Static — no animation |
| Inline insight card | Badge only | Varies | Static badge |

**Scarcity Principle:** Never show xl/lg character with full animation on every screen. Reserve milestone animations for moments of genuine achievement. On dense data screens, ManjeMood badge only.

**Emotional Reaction Triggers (Data → Mood)**

| Financial State | Manje Mood |
|----------------|-----------|
| Budget < 75% used | `happy` |
| Budget 75–90% used | `encourage` |
| Budget > 90% used | `concern` |
| Goal milestone hit | `celebrate` |
| Bill overdue | `concern` |
| Anomaly detected | `surprise` |
| Streak milestone | `celebrate` |
| First open of day | `wave` |
| Inactive 5+ days | `sleep` |

**Manje as Conversation Driver (AI Chat)**
- `thinking` mood + thinking pulse activates instantly when user sends a message
- Response text reveals character-by-character (20ms delay) — never dumps a wall of text
- Transitions `thinking` → `happy` (positive result) or `concern` (concerning data) on response
- Never says "As an AI language model…" — he is always Manje

### 3.6 Asset Handoff Specification

**Required Assets Per Mood (×8 moods)**
1. Full-body illustration — 800×800px, 120px padding all sides
2. Half-body illustration — 400×600px, waist up
3. Face badge (ManjeMood) — 200×200px circular crop

**File Structure**
```
assets/character/
  {mood}/
    {mood}-full.svg + {mood}-full.lottie
    {mood}-half.svg
    {mood}-badge.svg
```

**Colour Reference for Illustrator**

| Body Part | Hex |
|-----------|-----|
| Body base | #1A6B4A |
| Body highlight | #2ECC71 |
| Body shadow | #0E3D2A |
| Face / whites | #FFFFFF |
| Eyes & mouth | #0E2418 |
| Blush | #F472B6 |
| Sparkle / accent | #FCD34D |
| Glasses frame (light) | #1E293B |
| Glasses frame (dark) | #E8F5EE |

**Drop-in replacement:** Set `USE_ILLUSTRATION_ASSETS = true` in `ManjeCharacter.tsx` when Lottie assets are ready. No other code changes required.

---

## 4. Colour System

### 4.1 Design Reference
Light mode draws from Headspace's warm earthy palette. Dark mode draws from Cash App's confidence — deep green-black backgrounds where luminous accents pop dramatically.

### 4.2 Primitive Tokens — Green Ramp

| Token | Hex | Token | Hex |
|-------|-----|-------|-----|
| `green-50` | #F0FAF4 | `green-600` | #156040 |
| `green-100` | #D1F0DC | `green-700` | #0E4530 |
| `green-200` | #A7E0BC | `green-800` | #092B1E |
| `green-300` | #76C99A | `green-900` | #05160F |
| `green-400` | #45B278 | `green-950` | #020B08 |
| **`green-500`** | **#1A6B4A** ← Brand Primary | | |

### 4.3 Primitive Tokens — Accent & Neutral Ramps

| Accent Token | Hex | Neutral Token | Hex |
|-------------|-----|--------------|-----|
| `accent-300` | #7FE9A8 | `neutral-50` | #F7FBF8 |
| `accent-400` | #4FDE8C | `neutral-100` | #EEF4F0 |
| **`accent-500`** | **#2ECC71** ← Brand Accent | `neutral-200` | #D4E4D8 |
| `accent-600` | #27B360 | `neutral-400` | #8AAF9A |
| `accent-700` | #1E8A4A | `neutral-600` | #4A7060 |
| | | `neutral-900` | #0E2418 |

### 4.4 Semantic Tokens — Light Mode

| Token | Value | Usage |
|-------|-------|-------|
| `color.bg.base` | #F7FBF8 | App background |
| `color.bg.card` | #FFFFFF | Card surfaces |
| `color.bg.sunken` | #EEF4F0 | Inset fields, sunken areas |
| `color.bg.overlay` | rgba(0,0,0,0.45) | Modal scrim |
| `color.primary` | #1A6B4A | CTA buttons, active states |
| `color.primary.hover` | #156040 | Pressed/hover state |
| `color.primary.light` | #D1F0DC | Tint backgrounds, chips |
| `color.accent` | #2ECC71 | Progress, success highlights |
| `color.text.primary` | #0E2418 | Primary body text |
| `color.text.secondary` | #4A7060 | Supporting text |
| `color.text.muted` | #8AAF9A | Placeholder, disabled |
| `color.text.inverse` | #FFFFFF | Text on dark/primary |
| `color.border.light` | #D4E4D8 | Dividers |
| `color.border.medium` | #B0C9B6 | Input borders |
| `color.border.focus` | #1A6B4A | Input focus ring |

### 4.5 Semantic Tokens — Dark Mode

| Token | Value | Usage |
|-------|-------|-------|
| `color.bg.base` | #0C1410 | App background — rich dark green-black |
| `color.bg.card` | #142018 | Card surfaces |
| `color.bg.sunken` | #0A0F0C | Inset fields |
| `color.bg.overlay` | rgba(0,0,0,0.65) | Modal scrim |
| `color.primary` | #2ECC71 | CTA in dark (accent pops on dark) |
| `color.primary.hover` | #27B360 | Pressed |
| `color.primary.light` | rgba(46,204,113,0.15) | Tint on dark |
| `color.text.primary` | #E8F5EE | Primary — off-white with green warmth |
| `color.text.secondary` | #7DB896 | Secondary |
| `color.text.muted` | #4A7060 | Muted, placeholder |
| `color.text.inverse` | #0C1410 | Text on bright surfaces |
| `color.border.light` | rgba(255,255,255,0.08) | Subtle dividers |
| `color.border.medium` | rgba(255,255,255,0.16) | Input borders |
| `color.border.focus` | #2ECC71 | Focus ring |

### 4.6 Status Colour Tokens

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `status.success` | #22C55E | #22C55E | Positive, income, on-track |
| `status.success.bg` | #DCFCE7 | rgba(34,197,94,0.15) | Success tint |
| `status.warning` | #F59E0B | #FBBF24 | Budget 75–90% |
| `status.warning.bg` | #FEF3C7 | rgba(245,158,11,0.15) | Warning tint |
| `status.danger` | #EF4444 | #F87171 | Error, overdue, exceeded |
| `status.danger.bg` | #FEE2E2 | rgba(239,68,68,0.15) | Danger tint |
| `status.info` | #3B82F6 | #60A5FA | Informational |
| `status.info.bg` | #DBEAFE | rgba(59,130,246,0.15) | Info tint |

### 4.7 Budget Health & Bill Urgency States

| Budget State | Threshold | Colour |
|-------------|-----------|--------|
| Healthy | < 75% used | `status.success` |
| Caution | 75–89% | `status.warning` |
| Critical | 90–99% | `status.danger` |
| Exceeded | 100%+ | `status.danger` solid + pulse |

| Bill State | Days remaining | Colour |
|-----------|---------------|--------|
| Comfortable | 7+ | `status.success` |
| Due soon | 3–6 | `status.warning` |
| Urgent | 0–2 | `status.danger` |
| Overdue | Past due | #DC2626 (darker danger) |

### 4.8 Category Colour Palette

| # | Name | Hex | Category |
|---|------|-----|---------|
| 1 | Leaf | #22C55E | Groceries |
| 2 | Amber | #F59E0B | Dining |
| 3 | Sky | #3B82F6 | Transport |
| 4 | Violet | #8B5CF6 | Utilities |
| 5 | Rose | #EC4899 | Entertainment |
| 6 | Cyan | #06B6D4 | Healthcare |
| 7 | Orange | #F97316 | Shopping |
| 8 | Red | #EF4444 | Bills |
| 9 | Indigo | #6366F1 | Education |
| 10 | Emerald | #10B981 | Income |
| 11 | Slate | #64748B | Transfer |
| 12 | Gray | #94A3B8 | Other |

**Rule:** Never use category colours for status. Never use status colours decoratively.

### 4.9 Claymorphism Surface Tokens

| Token | Light | Dark |
|-------|-------|------|
| `clay.innerHighlight` | rgba(255,255,255,0.40) | rgba(255,255,255,0.07) |
| `clay.innerShadow` | rgba(0,0,0,0.06) | rgba(0,0,0,0.25) |
| `clay.buttonHighlight` | rgba(255,255,255,0.25) | rgba(255,255,255,0.10) |
| `clay.insetBorder` | rgba(0,0,0,0.04) | rgba(255,255,255,0.08) |
| `clay.insetBg` | #EEF4F0 | #0A0F0C |

### 4.10 Premium Gradient Tokens (v2.0)

| Token | Value | Usage |
|-------|-------|-------|
| `gradient.hero` | `linear-gradient(135deg, #1A6B4A 0%, #2ECC71 50%, #1A6B4A 100%)` | Hero card background |
| `gradient.heroShine` | `linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%)` | Hero card shine overlay |
| `gradient.accent` | `linear-gradient(90deg, #2ECC71 0%, #27B360 100%)` | Accent highlights, progress fills |
| `gradient.button` | `linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 50%)` | Button top shine |
| `gradient.cardGlow` | `radial-gradient(ellipse at 50% 0%, rgba(46,204,113,0.08) 0%, transparent 70%)` | Subtle card top glow |
| `gradient.dark.hero` | `linear-gradient(135deg, #0C1410 0%, #1A6B4A 50%, #0C1410 100%)` | Dark mode hero |
| `gradient.dark.accent` | `linear-gradient(90deg, #2ECC71 0%, #4FDE8C 100%)` | Dark mode accent (brighter) |

### 4.11 Glass Effect Tokens (v2.0)

| Token | Value | Usage |
|-------|-------|-------|
| `glass.blur` | 20px | Backdrop blur amount |
| `glass.blurLight` | 10px | Subtle blur for overlays |
| `glass.opacity.light` | rgba(255,255,255,0.72) | Light mode glass background |
| `glass.opacity.dark` | rgba(12,20,16,0.85) | Dark mode glass background |
| `glass.border.light` | rgba(255,255,255,0.18) | Glass border light |
| `glass.border.dark` | rgba(255,255,255,0.08) | Glass border dark |
| `glass.shadow` | 0 8px 32px rgba(0,0,0,0.12) | Glass element shadow |

**Implementation (React Native):**
```typescript
// expo-blur for glass effects
import { BlurView } from 'expo-blur';

<BlurView intensity={80} tint="light" style={styles.glassCard}>
  {children}
</BlurView>
```

### 4.12 Premium Shadow System (v2.0)

Refined shadows with subtle colour tints for depth and premium feel.

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `shadow.xs` | `0 1px 2px rgba(14,36,24,0.05)` | `0 1px 2px rgba(0,0,0,0.3)` | Subtle lift |
| `shadow.sm` | `0 2px 4px rgba(14,36,24,0.06), 0 1px 2px rgba(14,36,24,0.04)` | `0 2px 4px rgba(0,0,0,0.4)` | Small cards, chips |
| `shadow.md` | `0 4px 12px rgba(14,36,24,0.08), 0 2px 4px rgba(14,36,24,0.04)` | `0 4px 12px rgba(0,0,0,0.5)` | Standard cards |
| `shadow.lg` | `0 8px 24px rgba(14,36,24,0.10), 0 4px 8px rgba(14,36,24,0.05)` | `0 8px 24px rgba(0,0,0,0.6)` | Elevated cards |
| `shadow.xl` | `0 16px 48px rgba(14,36,24,0.12), 0 8px 16px rgba(14,36,24,0.06)` | `0 16px 48px rgba(0,0,0,0.7)` | Modals, hero |
| `shadow.glow.accent` | `0 0 20px rgba(46,204,113,0.25)` | `0 0 24px rgba(46,204,113,0.35)` | Active states, focus |
| `shadow.glow.primary` | `0 0 16px rgba(26,107,74,0.20)` | `0 0 20px rgba(46,204,113,0.25)` | Primary button glow |

**Android Elevation Mapping:**
| Token | Elevation |
|-------|-----------|
| `shadow.xs` | 1 |
| `shadow.sm` | 2 |
| `shadow.md` | 4 |
| `shadow.lg` | 8 |
| `shadow.xl` | 16 |

### 4.13 Colour Accessibility Rules
- Body text (< 18px): minimum **4.5:1** contrast — WCAG 2.1 AA
- Large text (≥ 18px regular, ≥ 14px bold): minimum **3:1**
- UI components (borders, focus rings): minimum **3:1**
- Never use colour as the sole differentiator — always pair with icon, text, or pattern

---

## 5. Typography

### 5.1 Font Families

| Family | Role | Load method |
|--------|------|-------------|
| **Syne** | Display, headlines, financial numbers | `expo-font` (mobile) · Google Fonts (web) |
| **Work Sans** | Body text, UI labels, buttons | `expo-font` (mobile) · Google Fonts (web) |

Fallback chain: Syne → Inter → system-ui → sans-serif

### 5.2 Complete Type Scale

| Style | Font | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|------|--------|-------------|---------------|-------|
| `displayLarge` | Syne Bold | 36px | 700 | 1.2× | −0.5px | Hero headlines |
| `displayMedium` | Syne SemiBold | 30px | 600 | 1.2× | −0.5px | Section titles |
| `displaySmall` | Syne SemiBold | 24px | 600 | 1.25× | 0 | Card titles |
| `headlineLarge` | Work Sans SemiBold | 20px | 600 | 1.25× | 0 | Sub-headers |
| `headlineMedium` | Work Sans SemiBold | 18px | 600 | 1.4× | 0 | List headers |
| `headlineSmall` | Work Sans Medium | 16px | 500 | 1.5× | 0 | Small section headers |
| `bodyLarge` | Work Sans Regular | 18px | 400 | 1.5× | 0 | Long-form content |
| `bodyMedium` | Work Sans Regular | 16px | 400 | 1.5× | 0 | Default body text |
| `bodySmall` | Work Sans Regular | 14px | 400 | 1.5× | 0 | Captions, secondary |
| `labelLarge` | Work Sans Medium | 16px | 500 | 1.25× | +0.5px | Buttons, primary labels |
| `labelMedium` | Work Sans Medium | 14px | 500 | 1.25× | +0.5px | Tags, chips |
| `labelSmall` | Work Sans Medium | 12px | 500 | 1.25× | +1px | Badges, metadata |
| `heroMetric` | Syne Bold | 52px | 700 | 1.1× | −1.5px | "Available to Spend" number |
| `currencyLarge` | Syne Bold | 48px | 700 | 1.1× | −1px | Balance display |
| `currencyMedium` | Syne SemiBold | 30px | 600 | 1.2× | −0.5px | Secondary amounts |
| `currencySmall` | Work Sans SemiBold | 20px | 600 | 1.25× | 0 | Inline amounts |

### 5.3 Typography Rules
1. Headlines always Syne; body text always Work Sans
2. Financial amounts always use `currency*` or `heroMetric` styles
3. Max 2 distinct font sizes per card component
4. **Minimum body text: 14px** — never smaller for readable content
5. Dark mode: swap colour tokens only — font specs unchanged
6. All layouts must support dynamic type scaling to 200% without breaking

---

## 6. Spacing, Layout & Grid

### 6.1 Base Unit: 4px. Every spacing value is a multiple of 4.

### 6.2 Spacing Scale

| Token | Value | Token | Value |
|-------|-------|-------|-------|
| `space-0` | 0px | `space-6` | 24px |
| `space-1` | 4px | `space-8` | 32px |
| `space-2` | 8px | `space-10` | 40px |
| `space-3` | 12px | `space-12` | 48px |
| `space-4` | 16px | `space-16` | 64px |
| `space-5` | 20px | `space-20` | 80px |

### 6.3 Border Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 4px | Tags, small chips |
| `radius-md` | 8px | Input fields, small components |
| `radius-lg` | 12px | Buttons |
| `radius-xl` | 16px | Small cards |
| `radius-2xl` | 20px | Standard cards |
| `radius-3xl` | 24px | **Clay cards** (primary) |
| `radius-4xl` | 32px | Hero cards, bottom sheets |
| `radius-full` | 9999px | Pills, avatars, circular buttons |

### 6.4 Screen Layout Templates

**Standard Scroll Screen**
```
[Safe Area Top] → [Header 56px: back + title + action] → [Scroll Content: padding-h 20px, card gap 12px] → [Safe Area Bottom]
```

**Tab Screen (Home, Activity, Manje, You)**
```
[Safe Area Top] → [Screen Header 64px] → [Scroll Content] → [Bottom Tab Bar 72px + safe area]
```

**Modal / Bottom Sheet**
```
[Full-screen scrim] → [Sheet: radius-4xl top, slide from bottom]
  [Handle 4×32px centered, 8px top] → [Content: 20px padding] → [Action area pinned bottom]
```

**Full-Screen Hero (Onboarding, Celebration)**
```
[Safe Area full-bleed] → [Character area: flex 2, centred] → [Content: flex 1, 20px padding] → [Action: 20px + safe area bottom]
```

### 6.5 Touch Targets
- Minimum interactive area: **44×44px**
- Minimum gap between adjacent targets: **8px**
- Destructive actions: separated from primary by 32px+ or confirmation step

### 6.6 Z-Index Scale

| Layer | Z-Index | Usage |
|-------|---------|-------|
| `z-base` | 0 | Standard content |
| `z-raised` | 10 | Dropdowns, floating labels |
| `z-sticky` | 20 | Sticky headers |
| `z-modal` | 40 | Modals, bottom sheets |
| `z-overlay` | 50 | Full-screen overlays |
| `z-toast` | 70 | Toast / snackbar |

---

## 7. Motion & Animation System

### 7.1 Motion Principles
1. **Purposeful** — if it doesn't inform, remove it
2. **Calming** — ease in and out gracefully; never jarring
3. **Character-led** — most expressive animations are Manje's; UI components animate subtly
4. **Responsive** — press feedback < 150ms perceived
5. **Accessible** — every animation has a static fallback for `prefers-reduced-motion`

### 7.2 Duration Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `duration.fast` | 150ms | Press feedback, hover |
| `duration.normal` | 250ms | Standard transitions |
| `duration.moderate` | 350ms | Modal enter, page transition |
| `duration.slow` | 500ms | Progress bars, complex transitions |
| `duration.celebration` | 600ms+ | Milestone animations |
| `duration.character` | 2000ms | Idle float cycle |

### 7.3 Easing Tokens

| Token | Curve | Usage |
|-------|-------|-------|
| `ease.standard` | cubic-bezier(0.2, 0, 0, 1) | General UI transitions |
| `ease.enter` | cubic-bezier(0.0, 0.0, 0.2, 1.0) | Elements entering |
| `ease.exit` | cubic-bezier(0.4, 0.0, 1.0, 1.0) | Elements leaving |
| `ease.spring` | Spring (friction: 8, tension: 100) | Interactive press/release |
| `ease.bounceIn` | Spring (friction: 4, tension: 60) | Celebration, bounces |

### 7.4 Interaction Patterns

**Press (all pressable elements):** Scale 1.0→0.97 (150ms spring in), 0.97→1.0 (120ms spring out). Haptic: light impact on mobile.

**Page transitions:** Stack push — new screen from right, existing slides left (0.3× width). Modal — slides up, scrim fades 0→0.45. Tab switch — cross-fade.

**Loading states:** Skeleton screens — opacity 0.4→0.8→0.4, 1200ms linear loop, `color.bg.sunken` colour. **No spinners in data views** — spinners only for button loading states.

**Toast entrance:** Slide in from bottom +64px→0 + opacity 0→1, `duration.normal`, auto-dismiss after 3000ms.

### 7.5 Micro-Interactions (v2.0)

Premium micro-interactions for professional feel. All use `react-native-reanimated` for 60fps performance.

**7.5.1 Button Press (Premium)**
```typescript
// Reanimated spring config
const buttonPressConfig = {
  damping: 15,
  stiffness: 400,
  mass: 0.8,
};

// Animation sequence:
// 1. Scale: 1.0 → 0.96 (press down)
// 2. Background: darken 8%
// 3. Shadow: reduce to shadow.sm
// 4. Haptic: Haptics.impactAsync(ImpactFeedbackStyle.Light)
// 5. Release: spring back to 1.0
```

**7.5.2 Input Focus**
```typescript
// On focus:
// 1. Border: color.border.medium → color.border.focus (150ms)
// 2. Border width: 1px → 2px
// 3. Shadow: add shadow.glow.primary
// 4. Label: translateY 0 → -24px, scale 1.0 → 0.85, color → primary
// 5. Background: sunken → card
```

**7.5.3 Card Hover/Press**
```typescript
// Press down:
// 1. Scale: 1.0 → 0.98 (spring, 150ms)
// 2. Shadow: shadow.md → shadow.sm
// 3. Inner highlight: opacity 0.4 → 0.5

// Release:
// 1. Scale: 0.98 → 1.02 → 1.0 (spring overshoot)
// 2. Shadow: restore to shadow.md
```

**7.5.4 Toggle Switch**
```typescript
// Off → On:
// 1. Thumb: translateX 0 → 20px (spring, 200ms)
// 2. Track: neutral-200 → primary (150ms)
// 3. Thumb shadow: add shadow.glow.accent
// 4. Haptic: Haptics.impactAsync(ImpactFeedbackStyle.Medium)
```

**7.5.5 List Item Swipe**
```typescript
// Swipe reveal:
// 1. Item: translateX 0 → -80px (gesture-driven)
// 2. Actions: opacity 0 → 1, scale 0.8 → 1.0
// 3. Haptic at threshold: Haptics.impactAsync(ImpactFeedbackStyle.Light)

// Snap back:
// 1. Spring to 0 or snap to -80px if past threshold
```

**7.5.6 Pull to Refresh**
```typescript
// Pull down:
// 1. ManjeCharacter: enters from top, scale 0.5 → 1.0
// 2. Mood: transitions to 'thinking'
// 3. At threshold: Haptic medium impact

// Refresh complete:
// 1. ManjeCharacter: mood → 'happy', bounce animation
// 2. Collapse: spring back to 0
```

**7.5.7 Tab Bar Selection**
```typescript
// On select:
// 1. Icon: scale 1.0 → 1.15 → 1.0 (spring, 200ms)
// 2. Label: opacity 0.6 → 1.0, translateY 2px → 0
// 3. Indicator: width 0 → 24px (spring, 250ms)
// 4. Haptic: Haptics.selectionAsync()
```

**7.5.8 Number Counter (Financial Amounts)**
```typescript
// Value change:
// 1. Old value: opacity 1 → 0, translateY 0 → -10px (150ms)
// 2. New value: opacity 0 → 1, translateY 10px → 0 (150ms)
// 3. If increase: flash green glow
// 4. If decrease: flash red glow
```

---

## 8. Claymorphism Component Patterns

> Every interactive surface uses Claymorphism. No flat design. This is non-negotiable.

### 8.1 Clay Card Anatomy (5 layers, bottom to top)
1. **Outer shadow** — lifts card from page
2. **Card background** — solid fill
3. **Inner highlight** — top edge, 36px, `clay.innerHighlight` — "lit from above" feel
4. **Inner shadow** — bottom edge, 20px, `clay.innerShadow` — grounds the card
5. **Content** — z-index above all overlays

### 8.2 Shadow Specifications

| Level | Y-offset | Blur | Opacity | Android elevation | Usage |
|-------|----------|------|---------|-------------------|-------|
| Subtle | 4px | 16px | 8% | 4 | Small cards, chips |
| Standard | 8px | 30px | 12% | 8 | Standard cards |
| Hero | 16px | 40px | 18% | 16 | Hero cards |
| Button | 4px | 8px | 15% | 4 | Buttons |

### 8.3 Card Variants

| Variant | Background | Shadow | Inner Highlight Height | Use case |
|---------|-----------|--------|----------------------|---------|
| `clay` | `color.bg.card` | Standard | 36px, 40% white | Standard content cards |
| `claySubtle` | `color.bg.card` | Subtle | 28px, 30% white | Secondary, list items |
| `hero` | Gradient/solid | Hero | 48px, 50% white | Primary hero (Available to Spend) |
| `inset` | `color.bg.sunken` | None (reversed) | Bottom glow | Input fields, sunken areas |
| `colored` | Category/status colour | Standard | 36px, 40% white | Category cards, status |

Press interaction on all tappable cards: scale 0.97, 150ms spring.

### 8.4 Button Patterns

| Variant | Background | Shadow | Text colour | Border radius |
|---------|-----------|--------|------------|---------------|
| Primary | `color.primary` | Button | White | `radius-full` |
| Secondary | `color.bg.sunken` | Subtle | `color.text.primary` | `radius-full` |
| Outline | Transparent | Subtle | `color.primary` | `radius-full` |
| Ghost | Transparent | None | `color.primary` | `radius-full` |

Sizes: sm 40px height · md 48px · lg 56px. Primary button has inner top sheen (`clay.buttonHighlight`, 20px height).

States: default → pressed (scale 0.97, darken 8%) → disabled (opacity 50%) → loading (spinner replaces label).

### 8.5 Input Field Pattern

| State | Border | Background |
|-------|--------|-----------|
| Default | `color.border.medium`, 1px | `color.bg.sunken` |
| Focus | `color.border.focus`, 2px | `color.bg.card` + subtle outer shadow |
| Error | `status.danger`, 2px | `status.danger.bg` |
| Disabled | `color.border.light` | `color.bg.sunken` dimmed |

Height: 52px standard · Border radius: `radius-lg` (12px) · Padding: 16px H, 14px V
Label: above field, `labelMedium`, `color.text.secondary` · Error: below field, `bodySmall`, `status.danger`

### 8.6 Bottom Sheet / Modal
- Handle bar: 4×32px, `color.border.medium`, `radius-full`, centred, 8px top
- Top corners: `radius-4xl` (32px)
- Background: `color.bg.card` with clay treatment
- Full-width inner highlight: 48px, `clay.buttonHighlight`
- Animation: slides up, `duration.moderate`, `ease.enter`
- Dismiss: tap scrim (non-mandatory) or swipe down

### 8.7 Empty State Pattern (mandatory 3 elements)
1. **ManjeCharacter** — md (100px), `wave` or `encourage`, idle float animation
2. **Message** — `headlineMedium` (max 1 line) + `bodyMedium` (max 2 lines). Warm, contextual copy.
3. **Primary CTA** — full-width button, navigates to creation flow

Never show empty state with just an icon and "No data found."

### 8.8 Filter Pills
- Default: `color.bg.sunken` bg, `color.text.secondary` text, `radius-full`
- Active: `color.primary.light` bg, `color.primary` text, 1px `color.primary` border
- Height: 36px · Padding-h: 16px · Gap: 8px

### 8.9 Progress Bar
- Track: `color.bg.sunken`, 8px height, `radius-full`
- Fill: gradient per health state (§4.7)
- Animation: width 0%→actual%, 500ms `ease.standard` on mount
- Overflow: solid `status.danger` + subtle pulse

### 8.10 Financial Metric Display
- Primary amount: `heroMetric` / `currencyLarge`, `color.text.primary`
- Currency symbol: `currencySmall`, `color.text.secondary`, top-right aligned
- Label: `labelMedium`, `color.text.muted`
- Positive trend: Feather `trending-up`, `status.success`
- Negative trend: Feather `trending-down`, `status.danger`

---

## 9. Iconography

### 9.1 Primary System: Feather Icons
`@expo/vector-icons` (mobile) · `react-feather` (web) · Outlined, 2px stroke, rounded caps.

### 9.2 Icon Size Scale

| Token | Size | Usage |
|-------|------|-------|
| `icon-xs` | 14px | Inline text |
| `icon-sm` | 16px | Compact UI, chips |
| `icon-md` | 20px | Standard list items |
| `icon-lg` | 24px | Headers, navigation |
| `icon-xl` | 32px | Feature cards, empty states |
| `icon-2xl` | 48px | Hero features |

### 9.3 Standard Icon Vocabulary

| Action | Feather name | Action | Feather name |
|--------|-------------|--------|-------------|
| Back | `arrow-left` | Home | `home` |
| Close | `x` | Activity | `zap` |
| Send | `send` | AI / Chat | `message-circle` |
| Edit | `edit-2` | Budget | `pie-chart` |
| Delete | `trash-2` | Goals | `target` |
| Add | `plus` | Bills | `file-text` |
| Search | `search` | Income trend | `trending-up` |
| Settings | `sliders` | Expense trend | `trending-down` |
| Notifications | `bell` | Check / Done | `check` |
| Profile | `user` | Chevron | `chevron-right` |
| Lock | `lock` | Alert | `alert-triangle` |
| Star / Primary | `star` | Info | `info` |

### 9.4 Category Emoji System (Transaction lists, warm contexts)

| Category | Emoji | Category | Emoji |
|----------|-------|----------|-------|
| Groceries | 🛒 | Healthcare | 💊 |
| Dining | 🍽️ | Shopping | 🛍️ |
| Transport | 🚌 | Bills | 📋 |
| Utilities | 💡 | Education | 📚 |
| Entertainment | 🎬 | Income | 💰 |
| Village Savings | 🤝 | Loans | 🏦 |

Use emoji in list items and conversational contexts. Use Feather icons on data-dense screens.

---

## 10. Data Visualisation

### 10.1 Principles
1. User understands chart in 3 seconds without a legend
2. Colour with meaning — category palette (§4.8) consistently applied
3. Always pair colour with label — never colour as sole differentiator
4. Dark mode: chart fills at 80% opacity to prevent harsh saturation

### 10.2 Progress Bars
Per §8.9. Always show numeric remaining amount. Budget bars show: name + spent/limit + percentage.

### 10.3 Sparklines
Height: 32px · Width: 80–120px · Stroke: 2px
Colour: `status.success` (upward) / `status.danger` (downward) · Area fill: 15% opacity · No axes or labels.

### 10.4 Bar Charts
Bar colour: category colour at 85% opacity (70% dark mode) · Top radius: `radius-sm` (4px)
Axis labels: `labelSmall`, `color.text.muted` · Touch: scale to 100% opacity + tooltip

### 10.5 Health Score Ring
SVG `strokeDasharray` circle · Track: `color.bg.sunken` · Fill: gradient (score → green/amber/red)
Animation: strokeDashoffset 0→actual, 500ms `ease.standard` on mount · Centre: score in `displayMedium`, label in `labelSmall`

---

## 11. Cross-Surface Guidelines

### 11.1 Mobile (React Native / Expo)

**Platform specifics**
- Shadows: define both iOS (`shadowColor/Offset/Opacity/Radius`) and Android (`elevation`) for every shadow token
- Safe areas: `react-native-safe-area-context` — never hardcode status bar heights
- Haptics: light impact (press) · medium (milestone) · error (failure)
- Keyboard: `KeyboardAvoidingView behavior="padding"`, `keyboardShouldPersistTaps="handled"`
- Fonts: loaded via `expo-font` in root `_layout.tsx` before first render
- Lists: always `FlatList` / `SectionList` — never `ScrollView` with `.map()`

**Implementation notes**
- Clay highlights are `View` overlays, `pointerEvents="none"`
- All press animations: `Animated.spring()` — not `Animated.timing()`
- Character animations: `Animated.loop(Animated.sequence([...]))` — stopped on unmount

### 11.2 Web Platform (Next.js — manje-web)

**Responsive Breakpoints**

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 640px | Single column, 20px gutters |
| Tablet | 640–1023px | 2-column, 24px gutters |
| Desktop | 1024–1279px | Sidebar + main, 32px gutters |
| Wide | ≥ 1280px | Max-width 1280px, centred |

**CSS Token Mapping**
```css
:root {
  --color-bg-base: #F7FBF8;
  --color-bg-card: #FFFFFF;
  --color-primary: #1A6B4A;
  --color-accent: #2ECC71;
  --color-text-primary: #0E2418;
  --radius-clay: 24px;
  --shadow-clay: 0 8px 30px rgba(0,0,0,0.12);
}
[data-theme="dark"] {
  --color-bg-base: #0C1410;
  --color-bg-card: #142018;
  --color-primary: #2ECC71;
  --color-text-primary: #E8F5EE;
}
```

**Clay cards on web:** `box-shadow` for outer depth + `::before` pseudo-element (height: 36px, top 0, rgba(255,255,255,0.40)) for inner highlight.

**Hover states (web only):** Cards: `translateY(-2px)` + shadow step up, 150ms. Buttons: darken 6%, 100ms. List items: `color.bg.sunken` wash, 100ms.

**Focus ring:** 2px solid `color.primary`, 2px offset. Never remove — only restyle.

### 11.3 Landing Site (manje-landing)

- Hero sections use `green-950` (#020B08) background with `accent-500` accents — dramatic dark treatment not used in product
- ManjeCharacter at xl, `wave` mood, animated via Lottie (`@lottiefiles/react-lottie-player`)
- Transitions to `celebrate` on successful waitlist signup
- Marketing typography: larger scale (4xl–5xl heroes) vs product standard scale
- Clay cards used for feature showcase sections with same implementation as manje-web

---

## 12. Accessibility Standards

### 12.1 Non-Negotiable Minimum: WCAG 2.1 AA
Every screen passes automated a11y checks before merge. No known contrast failures ship.

### 12.2 Contrast Requirements

| Text type | Minimum ratio |
|-----------|-------------|
| Body text (< 18px regular, < 14px bold) | **4.5:1** |
| Large text (≥ 18px regular, ≥ 14px bold) | **3:1** |
| UI components (borders, focus rings) | **3:1** |

### 12.3 Touch Targets
- Minimum: **44×44px** — non-negotiable
- Gap between adjacent targets: **8px** minimum
- Destructive actions: 32px+ from primary actions, or require confirmation step

### 12.4 Screen Reader Conventions (Mobile)
```typescript
// Every interactive element:
accessibilityLabel="Descriptive label"
accessibilityRole="button" | "text" | "header" | "link"
accessibilityHint="What happens when activated"  // for non-obvious actions

// Financial amounts — always announce currency:
// ❌ accessibilityLabel="45,200"
// ✅ accessibilityLabel="Available to spend: 45,200 Malawian Kwacha"

// Progress bars:
// ✅ accessibilityLabel="Groceries budget: 68 percent used. MWK 1,280 remaining."
```

### 12.5 Reduced Motion
```typescript
// Mobile:
const [reduceMotion, setReduceMotion] = useState(false);
useEffect(() => {
  AccessibilityInfo.isReduceMotionEnabled?.().then(setReduceMotion);
}, []);
// reduceMotion === true → skip Animated.loop / Animated.timing
// Character still shows correct mood — no animation
```
```css
/* Web: */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 12.6 Dynamic Type
- Test at 100%, 150%, 200% system font scale
- No text clipped or overlapping at 200%
- `heroMetric` / `currencyLarge` may scale down gracefully rather than overflow

### 12.7 Colour-Blind Safe Design
- Budget health: always show icon + percentage, not just bar colour
- Category charts: always show name label alongside colour
- Income vs expense: + / − prefix AND trending icon, not just green/red

---

## 13. Governance

### 13.1 Document Authority
Owned by the Manje product team. Update process: (1) propose in planning session → (2) update this document → (3) update code tokens → (4) retrofit components. PRs must reference the supporting section.

### 13.2 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | April 2026 | Initial canonical release — supersedes brand-guide.md |

### 13.3 Naming Conventions

**Design tokens:** `category.property.variant` (e.g., `color.text.secondary`, `shadow.clay.hero`)
**TypeScript:** camelCase within objects (`colors.primary.main`)
**CSS custom properties:** `--color-text-secondary` (kebab-case with category prefix)
**Components:** PascalCase files (`ClayCard.tsx`), camelCase props (`variant`, `onPress`, `mood`)
**Variant strings:** camelCase (`'claySubtle'`, `'hero'`, `'inset'`)

### 13.4 File Organisation (Mobile)
```
src/
  theme/
    colors.ts         All colour tokens (light + dark)
    typography.ts     Font families, scale, text styles
    spacing.ts        Spacing, border radius, layout constants
    animation.ts      Duration, easing, spring configs
    theme.ts          Unified export
  components/
    common/           Design system primitives (ClayCard, Button, Input, ...)
    character/        ManjeCharacter, ManjeMood
    home/             Dashboard-specific composed components
    activity/         Activity feed components
    modals/           Modal components
    charts/           Data visualisation
```

### 13.5 New Component Checklist
Before any new component enters the codebase:
- [ ] Defined in this document (or document updated first)
- [ ] Implements Claymorphism visual language
- [ ] All states defined: default, pressed, disabled, loading, error
- [ ] Dark mode tokens applied and tested in both modes
- [ ] `accessibilityLabel` + `accessibilityRole` defined
- [ ] Reduced motion handled
- [ ] Touch target ≥ 44×44px (mobile)
- [ ] No hardcoded hex colours — tokens only
- [ ] Font sizes use type scale tokens — no hardcoded values
- [ ] Reviewed by at least one engineer and one designer

---

*End of Manje Design System & Brand Guide v1.0*
*Next review: Q3 2026 or before any Phase 2 feature area begins engineering*
