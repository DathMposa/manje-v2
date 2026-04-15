# MANJE — Comprehensive Design System & Screen Redesign Guide
**Version:** 2.0 — Hybrid Premium Edition  
**Date:** April 2026  
**Reference Apps:** Cleo · PiggyVest · Wallet by BudgetBakers  
**Stack:** Expo SDK 54 · React Native · Reanimated · Claymorphism  

---

## Table of Contents

1. [Design Philosophy & Reference Apps](#1-design-philosophy--reference-apps)
2. [Color System — Full Token Reference](#2-color-system--full-token-reference)
3. [Typography System](#3-typography-system)
4. [Spacing, Layout & Grid](#4-spacing-layout--grid)
5. [Shape Language & Border Radius](#5-shape-language--border-radius)
6. [Shadow & Elevation System](#6-shadow--elevation-system)
7. [Gradient Token Library](#7-gradient-token-library)
8. [Component Library — Specifications](#8-component-library--specifications)
9. [ManjeCharacter Design System](#9-manjecharacter-design-system)
10. [Animation & Micro-Interaction System](#10-animation--micro-interaction-system)
11. [Navigation Patterns](#11-navigation-patterns)
12. [Dark Mode System](#12-dark-mode-system)
13. [Screen Redesign Specifications (10 Screens)](#13-screen-redesign-specifications)
14. [Icon Usage Guide](#14-icon-usage-guide)
15. [Accessibility Standards](#15-accessibility-standards)
16. [Implementation Checklist](#16-implementation-checklist)

---

## 1. Design Philosophy & Reference Apps

### 1.1 The Hybrid Premium Principle

Manje's visual language is built on a single governing idea: make complex financial data feel human, warm, and approachable — without sacrificing the trust signals of a premium financial product. This is achieved by layering two distinct design vocabularies.

| Dimension | Claymorphism Layer | Premium Polish Layer |
|---|---|---|
| Mood | Soft, playful, tactile | Confident, trustworthy, precise |
| Shapes | Rounded, puffy, 3D-feeling cards | Clean geometry, tight grid, optical balance |
| Depth | Inner highlights, inner shadows, inset borders | Gradient overlays, tinted shadows, layered glass |
| Motion | Spring physics, bouncy, organic | Precisely timed, purposeful, no gratuitous animation |
| Color | Soft, desaturated tints; pastel backgrounds | High-contrast hero areas; strategic accent pops |

---

### 1.2 Three Reference Apps — What We Take From Each

#### Reference App 01: Cleo
> Cleo teaches us that a finance app can have a personality. The AI mascot IS the product — every screen is centred around a character relationship, not a data dashboard. From Cleo we inherit: **character-first emotional design**, conversational onboarding, mood-aware UI states, and the principle that every ManjeCharacter appearance should feel like a living response — not a decoration.

#### Reference App 02: PiggyVest
> PiggyVest teaches us how to serve African users who are goal-oriented savers operating in constrained economies. From PiggyVest we inherit: **goal card visual metaphors** (progress bar, target amount, percentage fill), gamification hooks (streaks, milestones, celebrations), and the design principle that savings goals should feel like achievements to unlock — not just numbers to track.

#### Reference App 03: Wallet by BudgetBakers
> Wallet teaches us how to build a finance app that works under real-world constraints — no internet, low-end Android, manual entry. From Wallet we inherit: **local-first UI patterns** (sync status indicators, offline state messaging), the multi-wallet card dashboard layout, fast transaction entry UX (large keypad, instant category selection), and horizontal month-scroll navigation.

---

### 1.3 Core Design Principles

- **Principle 1 — Character Before Data:** ManjeCharacter always appears before numbers. The first thing a user sees on any key screen is a character mood, not a balance.
- **Principle 2 — One Hero Number:** Every screen has exactly one number that is larger than everything else. The user should never have to search for the most important figure.
- **Principle 3 — Offline is Normal:** The UI should look complete and functional even when offline. Sync states are shown quietly — not as errors.
- **Principle 4 — Earn Every Tap:** Every screen transition and animation must justify itself. We use motion to teach, confirm, and reward — never to decorate.
- **Principle 5 — African Context is Default:** Currency formatting, names, colour meanings, and cultural context are designed for Malawi first. MWK is not an afterthought.

---

## 2. Color System — Full Token Reference

### 2.1 Primitive Color Ramps

> **Rule:** Never use primitive values directly in component code — always use semantic tokens.

#### Green Ramp (Primary Brand)

| Token | Hex | Use | Description |
|---|---|---|---|
| `green.50` | `#F0FAF5` | Bg tint | Lightest background wash — onboarding screens, success states |
| `green.100` | `#C8E6D8` | Border tint | Subtle borders, dividers, input focus rings in light mode |
| `green.200` | `#94CDB0` | Disabled | Disabled primary button backgrounds, placeholder icons |
| `green.300` | `#5AB58A` | Progress | Progress bar fill — mid-health state |
| `green.400` | `#2E9E6B` | Hover | Button hover state; active tab indicator |
| `green.500` | `#1A6B4A` | **Primary** | **PRIMARY BRAND COLOR** — buttons, links, active elements, ManjeCharacter body |
| `green.600` | `#155A3D` | Pressed | Button pressed state; strong emphasis text on light backgrounds |
| `green.700` | `#0F4530` | Deep | Dark mode primary; header backgrounds; deep shadow tints |
| `green.800` | `#0D3B2E` | Darkest | Page/section headers; dark card backgrounds |

#### Neutral Ramp

| Token | Hex | Use | Description |
|---|---|---|---|
| `neutral.0` | `#FFFFFF` | White | Card backgrounds (light), text on dark surfaces |
| `neutral.50` | `#F8FAF9` | Screen bg | Default screen background in light mode — green-tinted white |
| `neutral.100` | `#F1F4F2` | Inset bg | Sunken/inset card backgrounds, input fills |
| `neutral.300` | `#CBD5D0` | Border | Default border color for cards and inputs |
| `neutral.500` | `#6B7B74` | Muted text | Secondary labels, placeholder text, captions |
| `neutral.900` | `#1C2421` | Body text | Primary text in light mode — slightly green-tinted, never pure black |
| `neutral.950` | `#0F1512` | Dark bg | Dark mode screen background |

#### Status Colors

| Token | Hex | Usage |
|---|---|---|
| `status.success` | `#16A34A` | Positive balance, income transactions, goal achieved |
| `status.successBg` | `#DCFCE7` | Success message backgrounds, income badge backgrounds |
| `status.warning` | `#D97706` | Budget nearing limit (75%+), bill due soon |
| `status.warningBg` | `#FEF3C7` | Warning card backgrounds |
| `status.danger` | `#DC2626` | Expense transactions, overspent budget, negative balance |
| `status.dangerBg` | `#FEE2E2` | Error state backgrounds, overspent indicator fills |
| `status.info` | `#2563EB` | Informational tags, AI insight badges |
| `status.infoBg` | `#DBEAFE` | Info card backgrounds, AI insight card tint |

---

### 2.2 Semantic Color Tokens — Light Mode

| Semantic Token | Maps To | Purpose |
|---|---|---|
| `bg.base` | `neutral.50` / `#F8FAF9` | Default screen background |
| `bg.card` | `#FFFFFF` | All ClayCard backgrounds |
| `bg.sunken` | `neutral.100` / `#F1F4F2` | Inset/recessed areas (input fills, stat wells) |
| `bg.overlay` | `rgba(0,0,0,0.5)` | Modal backdrop, bottom sheet scrim |
| `primary.default` | `green.500` / `#1A6B4A` | Primary actions, active states |
| `primary.pressed` | `green.600` / `#155A3D` | Button press state |
| `primary.subtle` | `green.50` / `#F0FAF5` | Ghost button fills, secondary backgrounds |
| `text.primary` | `neutral.900` / `#1C2421` | All primary body text |
| `text.secondary` | `neutral.500` / `#6B7B74` | Labels, captions, helper text |
| `text.inverse` | `#FFFFFF` | Text on primary/dark backgrounds |
| `border.light` | `neutral.300` / `#CBD5D0` | Card borders, dividers |
| `border.focus` | `green.500` / `#1A6B4A` | Input focus ring |
| `clay.innerHighlight` | `rgba(255,255,255,0.7)` | Top inner highlight on all clay cards |
| `clay.innerShadow` | `rgba(0,0,0,0.06)` | Bottom inner shadow on clay cards |
| `glass.bg` | `rgba(255,255,255,0.85)` | Frosted glass modals/overlays |
| `glass.border` | `rgba(255,255,255,0.3)` | Glass card border |

> **Dark Mode Note:** All semantic tokens have a dark mode variant. In dark mode, `bg.base` → `neutral.950`, `bg.card` → `#1C2421`, `primary.default` remains `green.500` but with adjusted contrast companions. Full dark token map is in [Section 12](#12-dark-mode-system).

---

### 2.3 Transaction Category Colors

| Category | Background | Foreground | Hex (bg / fg) |
|---|---|---|---|
| Food & Dining | Warm Orange | Deep Orange | `#FFF3E0` / `#E65100` |
| Transport | Sky Blue | Dark Blue | `#E3F2FD` / `#1565C0` |
| Shopping | Lavender | Deep Purple | `#F3E5F5` / `#6A1B9A` |
| Utilities | Amber | Dark Amber | `#FFF8E1` / `#F57F17` |
| Healthcare | Rose | Dark Red | `#FFEBEE` / `#B71C1C` |
| Education | Brown | Dark Brown | `#EFEBE9` / `#4E342E` |
| Entertainment | Pink | Deep Pink | `#FCE4EC` / `#880E4F` |
| Savings / Transfer | Mint Green | Brand Green | `#E8F5EE` / `#1A6B4A` |
| Income | Success Green | Dark Green | `#DCFCE7` / `#14532D` |
| Bills | Teal | Dark Teal | `#E0F7FA` / `#006064` |
| Personal Care | Sky | Deep Sky | `#E1F5FE` / `#01579B` |
| Other | Neutral | Gray | `#F5F5F5` / `#424242` |

---

## 3. Typography System

### 3.1 Font Families

| Role | Family | Usage |
|---|---|---|
| Display / Headings | Syne (Bold, ExtraBold) | Screen titles, hero metrics, ManjeCharacter speech, large numerics |
| Body / UI | Work Sans (Regular, Medium, SemiBold) | All body copy, labels, inputs, navigation, captions |
| Financial Numerics | Syne Mono OR Work Sans Tabular | All currency amounts — tabular numerals ensure columns align |
| System Fallback | System UI / -apple-system | Used until custom fonts load via expo-font |

> **Implementation:** Load fonts in `app/_layout.tsx` using expo-font's `useFonts()`. Render a SplashScreen until fonts resolve to prevent FOUT. Font files go in `assets/fonts/`.

---

### 3.2 Type Scale

| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `display.lg` | 36px | ExtraBold (800) | 1.1× | Welcome screen hero text, success celebration headline |
| `display.md` | 30px | Bold (700) | 1.15× | Onboarding step headlines, major screen titles |
| `display.sm` | 24px | Bold (700) | 1.2× | Section titles, modal headers |
| `headline.lg` | 20px | SemiBold (600) | 1.3× | Card titles, list section headers |
| `headline.md` | 18px | SemiBold (600) | 1.3× | Sub-headers, form field group labels |
| `headline.sm` | 16px | SemiBold (600) | 1.4× | Navigation labels, button text (md), tab labels |
| `body.lg` | 18px | Regular (400) | 1.5× | Primary body copy, insight card text |
| `body.md` | 16px | Regular (400) | 1.5× | Standard body, list item descriptions, input text |
| `body.sm` | 14px | Regular (400) | 1.5× | Captions, helper text, secondary labels |
| `label.lg` | 16px | Medium (500) | 1.4× | Floating input labels (unfocused position) |
| `label.md` | 14px | Medium (500) | 1.3× | Badge text, tag labels, category chips |
| `label.sm` | 12px | Medium (500) | 1.3× | Timestamps, minor metadata, legal/footer text |
| `financial.hero` | 52px | ExtraBold (800) | 1.0× | **DASHBOARD ONLY:** Available to Spend hero number |
| `financial.lg` | 48px | Bold (700) | 1.0× | Goal target amounts, onboarding income display |
| `financial.md` | 30px | Bold (700) | 1.1× | Card subtotals, budget totals, net worth |
| `financial.sm` | 20px | SemiBold (600) | 1.2× | Transaction amounts in list items |

---

### 3.3 MWK Currency Formatting Rules

- Always prefix with `MWK` followed by a non-breaking space: `MWK 125,000`
- Use comma as thousands separator (Malawian convention): `1,250,000`
- Never show decimal places for MWK (no `MWK 125.00` — always `MWK 125`)
- Negative amounts use a leading minus and danger color: `−MWK 3,500`
- For very large amounts (1M+), use condensed form in tight spaces: `MWK 1.2M`
- Always use tabular numeral variant to keep columns optically aligned

---

## 4. Spacing, Layout & Grid

### 4.1 Spacing Scale (4px base unit)

| Token | Value | px | Primary Usage |
|---|---|---|---|
| `space.1` | 0.25rem | 4px | Icon internal padding, micro gaps between badges |
| `space.2` | 0.5rem | 8px | Between icon and label, chip internal padding |
| `space.3` | 0.75rem | 12px | Card internal row gaps, tight list item spacing |
| `space.4` | 1rem | 16px | Standard vertical screen padding (top/bottom edge) |
| `space.5` | 1.25rem | **20px** | **STANDARD HORIZONTAL SCREEN PADDING** — every screen |
| `space.6` | 1.5rem | 24px | Card internal padding, section gaps |
| `space.8` | 2rem | 32px | Between major screen sections, large card padding |
| `space.10` | 2.5rem | 40px | Header bottom margin, modal top padding |
| `space.12` | 3rem | 48px | Bottom of scrollable screens (above tab bar) |
| `space.16` | 4rem | 64px | Onboarding screens top breathing room |
| `space.20` | 5rem | 80px | Large visual gap, splash/hero area padding |

---

### 4.2 Layout Constants

| Constant | Value | Notes |
|---|---|---|
| Screen horizontal padding | 20px | Applied to all scrollable screen content wrappers |
| Minimum touch target | 44×44px | All tappable elements — iOS/WCAG requirement |
| Standard header height | 56px | ScreenHeader component default |
| Tab bar height | 72px | Includes safe area inset on iPhone |
| Input height | 52px | All Input components |
| Button sm / md / lg | 40 / 48 / 56px | Heights for the three button size tokens |
| Bottom scroll padding | 80px | `contentContainerStyle paddingBottom` on all FlatLists — clears tab bar |
| Card border radius | 24px | Standard clay card corner radius |
| Modal border radius (top) | 32px | Bottom sheet and full-screen modal top corners |

---

## 5. Shape Language & Border Radius

### 5.1 Border Radius Scale

| Token | Value | Usage |
|---|---|---|
| `radius.sm` | 8px | Chips, badges, small tags, input helper text blocks |
| `radius.md` | 12px | Inner elements inside cards: progress bars, category pills, mini buttons |
| `radius.lg` | 16px | Inline notification banners, medium modals, secondary cards |
| `radius.xl` | 20px | Input fields, list item cards, activity row items |
| `radius.2xl` | **24px** | **PRIMARY CLAY CARD RADIUS** — all ClayCard components default |
| `radius.3xl` | 28px | Bottom sheet modal top corners, hero card variants |
| `radius.4xl` | 32px | Main modals, onboarding step cards, large hero panels |
| `radius.full` | 9999px | Pills, avatar circles, FAB button, circular icon containers |

> **Clay Rule:** Every ClayCard must always have: (a) `radius.2xl` minimum, (b) a white inner highlight overlay at the top (height 40% of card, opacity 0.7), and (c) a subtle shadow at the bottom inner edge. These three elements together create the claymorphism 'puffiness' — removing any one breaks the effect.

---

## 6. Shadow & Elevation System

### 6.1 Standard Shadow Levels

> Manje uses **color-tinted shadows** (subtle green tint) instead of pure black to keep the palette cohesive.

| Level | iOS Shadow (color / offset / opacity / radius) | Android (elevation + shadowColor) |
|---|---|---|
| `shadow.xs` | `#1A6B4A` / 0,1 / 0.05 / 2 | elevation: 1 |
| `shadow.sm` | `#1A6B4A` / 0,2 / 0.08 / 4 | elevation: 2 |
| `shadow.md` | `#1A6B4A` / 0,4 / 0.10 / 8 | elevation: 4 |
| `shadow.lg` | `#0D3B2E` / 0,8 / 0.12 / 16 | elevation: 8 |
| `shadow.xl` | `#0D3B2E` / 0,12 / 0.16 / 24 | elevation: 16 |

### 6.2 Glow Shadows (Focus / Active States)

| Type | Shadow Color / Opacity / Radius | When to Use |
|---|---|---|
| `glow.primary` | `#1A6B4A` / 0.25 / 12 | Input focus ring, active primary button, selected tab icon |
| `glow.accent` | `#2563EB` / 0.20 / 10 | AI insight card highlight, special feature CTA |
| `glow.success` | `#16A34A` / 0.20 / 8 | Goal achieved card, positive balance hero |
| `glow.danger` | `#DC2626` / 0.20 / 8 | Error input state, overspent budget card |

### 6.3 Claymorphism Inner Effects

```
innerHighlight:
  position: 'absolute'
  top: 0, left: 0, right: 0
  height: '40%'
  background: rgba(255,255,255,0.7)
  borderTopLeftRadius: 24, borderTopRightRadius: 24
  → Simulates light hitting the top of a clay surface

innerShadow:
  position: 'absolute'
  bottom: 0, left: 0, right: 0
  height: 40
  background: rgba(0,0,0,0.06)
  borderBottomLeftRadius: 24, borderBottomRightRadius: 24
  → Simulates depth at the base

insetBorder:
  border: 1px solid rgba(255,255,255,0.6)
  → Creates a subtle raised edge against the background
```

---

## 7. Gradient Token Library

| Token | Colors & Direction | Usage |
|---|---|---|
| `gradient.hero` | `['#1A6B4A', '#0D3B2E']` → top to bottom | Dashboard hero card, welcome screen main panel |
| `gradient.heroShine` | `['#2E9E6B', '#1A6B4A', '#0D3B2E']` → 135° | Premium hero card variant with lighter catch-light |
| `gradient.button` | `['#2E9E6B', '#1A6B4A']` → left to right | All primary Button components |
| `gradient.accent` | `['#2563EB', '#7C3AED']` → 135° | AI insight card, special feature highlights |
| `gradient.cardGlow` | `['rgba(26,107,74,0.12)', 'transparent']` → top | Overlay on card tops to enhance depth |
| `gradient.progress.healthy` | `['#2E9E6B', '#16A34A']` → left to right | Progress bars at 0–70% budget usage |
| `gradient.progress.caution` | `['#F59E0B', '#D97706']` → left to right | Progress bars at 71–99% budget usage |
| `gradient.progress.exceeded` | `['#EF4444', '#DC2626']` → left to right | Progress bars at 100%+ (overspent) |
| `gradient.darkHero` | `['#0D3B2E', '#050F0A']` → top to bottom | Dark mode hero card and welcome screen |
| `gradient.surface` | `['#F8FAF9', '#EEF5F1']` → 180° | Subtle screen background gradient on key screens |
| `gradient.onboarding` | `['#E8F5EE', '#F0FAF5', '#FFFFFF']` → top | Onboarding screen backgrounds |

> **Reference — Cleo:** Cleo uses a rich dark gradient as the primary screen background — not a flat color. Apply `gradient.hero` on all Dashboard hero card areas and the welcome screen, mirroring Cleo's approach.

---

## 8. Component Library — Specifications

### 8.1 ClayCard

**File:** `src/components/common/ClayCard.tsx`  
**Purpose:** The foundational surface component. Every card in the app is a ClayCard.

| Variant | Background | Shadow Level | When to Use |
|---|---|---|---|
| `clay` (default) | `bg.card` / `#FFFFFF` | `shadow.md` + inner | Standard content cards: transactions, categories, budgets |
| `hero` | `gradient.hero` overlay | `shadow.xl` + `glow.primary` | Dashboard hero panel — one per screen maximum |
| `inset` | `bg.sunken` / `#F1F4F2` | `shadow.xs` (inner only) | Stat wells inside cards, input containers |
| `subtle` | `bg.card` at 0.6 opacity | `shadow.sm` | De-emphasised list items, inactive states |

**Pressable Behaviour:**
- Press-in: scale `1.0 → 0.97` using `spring(stiffness: 400, damping: 40)`
- Press-out: scale back to `1.0` using `spring(stiffness: 300, damping: 30)`
- Trigger `Haptics.impactAsync(ImpactFeedbackStyle.Light)` on press-in
- Only apply when `pressable` prop is `true`

**Props:**
```typescript
variant?: 'clay' | 'hero' | 'inset' | 'subtle'
pressable?: boolean
highlightHeight?: number
onPress?: () => void
```

---

### 8.2 Button

**File:** `src/components/common/Button.tsx`

| Variant | Background | Text Color | Usage |
|---|---|---|---|
| `primary` | `gradient.button` | `text.inverse` (#FFFFFF) | Main CTA — one per screen. Sign In, Continue, Save. |
| `secondary` | `primary.subtle` (green.50) | `primary.default` | Secondary actions alongside primary: Learn More, Skip. |
| `outline` | Transparent | `primary.default` | Destructive-adjacent or equal-weight alternatives |
| `ghost` | Transparent | `text.secondary` | Tertiary actions, dismissals, 'Cancel' in modals |

**Shine Overlay on Primary:**  
The primary button has a linear gradient shine overlay at the top third (`rgba(255,255,255,0.15)` → `transparent`) to simulate the clay catch-light. Implemented as `position: absolute` View on top of the gradient.

**Loading State:**
- Replace button text with `ActivityIndicator` (color: white, size: small)
- Keep button at full width/height — prevent layout shift
- Disable all interaction while loading — `pointerEvents: 'none'`

**Props:**
```typescript
title: string
onPress: () => void
variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
size?: 'sm' | 'md' | 'lg'        // 40px | 48px | 56px
disabled?: boolean
loading?: boolean
icon?: React.ReactNode
fullWidth?: boolean
```

---

### 8.3 Input

**File:** `src/components/common/Input.tsx`

**Floating Label Animation Spec:**
- Unfocused + empty: label at center (`translateY: 0`, `scale: 1.0`, color: `text.secondary`)
- Focused OR has value: label floats to top (`translateY: -24px`, `scale: 0.85`, color: `primary.default`)
- Animation: `timing`, duration `200ms`, easing `Easing.bezier(0.4, 0, 0.2, 1)`
- Focus border: `borderColor → border.focus`, `borderWidth 1px → 2px`, `glow.primary` shadow
- Error state: `borderColor → status.danger`, `background → status.dangerBg`, show error text below
- Hint text (non-error): always visible below input in `text.secondary` color

**Props:**
```typescript
label: string
error?: string
hint?: string
leftIcon?: React.ReactNode
rightIcon?: React.ReactNode
```

---

### 8.4 ScreenHeader

**File:** `src/components/common/ScreenHeader.tsx`

- Back button: Ionicons `chevron-back` (24px), minimum 44×44 touch target, haptic on press
- Title: `typography.headline.lg`, `text.primary`, centered absolute — not flexed
- Right action: absolutely positioned right — supports any React node
- `transparent` prop: removes background and border, used over gradient hero screens
- Always rendered inside `SafeAreaView` or accounts for status bar height

---

### 8.5 TransactionItem

**File:** `src/components/transactions/TransactionItem.tsx`  
**Reference:** Wallet by BudgetBakers activity list

**Anatomy (left to right):**
1. Category Icon Container: 44×44 circle, category background color, category icon centered
2. Text Block: merchant name (`headline.sm`) top, category label + date (`body.sm`, `text.secondary`) bottom
3. Amount: aligned right, `financial.sm`, danger color for expenses, success color for income
4. Optional: right chevron if tappable (only on Activity screen)

**Swipe Actions:**
- Swipe left reveals: Edit (amber) + Delete (red) action buttons
- Each action button: 64px wide, full item height, centered icon + label
- Swipe is spring-based, with rubber-band at max swipe extent
- Implementation: `react-native-gesture-handler` Swipeable

---

### 8.6 Category Badge

**File:** `src/components/common/CategoryBadge.tsx`

- Shape: rounded pill (`radius.full`), height 24px, horizontal padding 10px
- Background: `category.bg` token (see Color System 2.3)
- Text: `label.sm`, `category.fg` color token
- Optional icon: 12px icon to left of label text
- Never use more than 3 badges in a row before wrapping

---

### 8.7 Progress Bar

- Height: 8px standard, 12px on goal cards
- Background track: `neutral.100` (`#F1F4F2`)
- Fill: gradient based on percentage — use `gradient.progress.*` tokens
- Border radius: `radius.full` on both track and fill
- Animated: fill width animates from 0 to target on mount (`duration: 800ms`, `Easing.out(Easing.cubic)`)
- Percentage label: `body.sm`, right-aligned above or below bar

---

### 8.8 Bottom Tab Bar

**File:** `src/navigation/TabBar.tsx`

- Height: 72px + safe area inset
- Background: `glass.bg` (`rgba(255,255,255,0.92)`) with expo-blur `BlurView` (intensity: 40)
- Top border: 1px solid `border.light`
- Icons: 24px Ionicons, unselected: `text.secondary`, selected: `primary.default`
- Selected indicator: 32px wide, 3px tall pill under icon, `primary.default` color, `radius.full`
- Labels: `label.sm`, hide on unselected tabs
- Active icon scale animation: spring from `1.0 → 1.15` on selection
- Center FAB (Quick Add): 56px circle, `gradient.button`, `shadow.xl`, raised 12px above tab bar line

---

## 9. ManjeCharacter Design System

### 9.1 Character Identity

ManjeCharacter is a Black African male with a 'cool geek' aesthetic — glasses, confident posture, casual-smart styling. The character exists as an SVG/Lottie asset rendered via the ManjeCharacter component. He is not decorative — every appearance communicates a meaningful financial state.

> **Reference — Cleo:** Cleo's mascot appears on almost every primary screen and SPEAKS to the user. ManjeCharacter must follow this same principle: **never render the character without accompanying contextual text**. The character is the voice of the AI — not a logo.

---

### 9.2 Eight Moods — Full Specification

| Mood ID | Trigger Condition | Visual State | Example Message |
|---|---|---|---|
| `wave` | First daily app open, empty dashboard | Right hand raised and waving, neutral expression, slight lean forward | "Mwadzuka bwanji! Ready to track today?" |
| `happy` | Positive balance, goal reached, streak milestone | Wide smile, arms up, sparkle particles around head | "Yes! You're MWK 12,000 ahead this month!" |
| `thinking` | AI generating insight, categorising transaction | Finger on chin, eyes slightly upward, thought bubble | "Let me check your spending patterns..." |
| `concern` | Overspent budget (>100%), negative balance | Furrowed brow, crossed arms, slight lean back | "Your food budget ran out 5 days early." |
| `celebrate` | First transaction logged, first goal created | Arms wide open, confetti around, biggest smile | "Your first step! This is how it starts." |
| `tip` | Education Hub, AI insight card | Glasses adjusted, pointing finger, upright posture | "Did you know? 10% saved = 1 month buffer in 10 months." |
| `focus` | Budget nearing limit (75–99%) | Leaning forward, intent gaze, one hand on desk | "You've used 82% of transport budget. 5 days left." |
| `sleep` | Offline mode, no recent activity (7+ days) | Eyes closed, ZZZ bubbles, relaxed posture | "I'm offline right now. All your data is safe." |

---

### 9.3 Character Placement Rules

- **Dashboard:** Always in the hero ClayCard, centered, `size: 100px`. Mood changes dynamically.
- **Welcome/Success screens:** Centered, large (150–200px). Primary emotional anchor.
- **Pull-to-refresh:** Character appears mid-screen (100px) during animation, `thinking` → `wave` on complete.
- **AI insight card:** Small (60px) to the left of insight text, `tip` mood.
- **Offline banner:** Small (60px) with `sleep` mood inside the offline indicator.
- **Never** place ManjeCharacter as a background element — always foreground, always readable.

---

### 9.4 Lottie Animation Specs

- All moods are Lottie JSON files in `assets/animations/character/`
- **Idle loop:** each mood has a subtle idle loop (breathing, blinking) at low frame rate
- **Transition:** mood change uses 200ms fade-out → 200ms fade-in — never a hard swap
- **Pull-to-refresh:** `thinking.json` plays at speed proportional to pull distance (0–100% = 0–50% animation progress)
- **Celebration:** `celebrate.json` plays once through (non-looping) on trigger, then reverts to `happy` loop

---

## 10. Animation & Micro-Interaction System

### 10.1 Duration Tokens

| Token | ms | Usage |
|---|---|---|
| `duration.instant` | 0ms | Immediate state changes — toggle switch position |
| `duration.fast` | 150ms | Button press scale, icon state changes, ripple feedback |
| `duration.normal` | 250ms | Input focus, card press, tab selection |
| `duration.moderate` | 400ms | Screen entry animations, modal appear/dismiss |
| `duration.slow` | 600ms | Hero number counter, progress bar fill on mount |
| `duration.stagger` | 1000ms | Total stagger window for list items entering screen |

---

### 10.2 Spring Configurations

| Preset | Stiffness | Damping | Use Case |
|---|---|---|---|
| `spring.buttonPress` | 400 | 40 | Button and card press-in — snappy and tight |
| `spring.cardRelease` | 300 | 30 | Card press-out, returning to original size |
| `spring.bouncy` | 200 | 20 | Celebration animations, goal achievement |
| `spring.default` | 250 | 28 | General purpose — most UI animations |
| `spring.snappy` | 500 | 50 | Tab bar indicator movement, fast switch toggles |
| `spring.gentle` | 100 | 20 | Screen mount stagger, floating label transition |
| `spring.modal` | 350 | 35 | Modal enter from bottom (Quick Add), bottom sheet |

---

### 10.3 Interaction Patterns — Full Specification

#### Button Press
```
press-in:  withSpring(0.96, spring.buttonPress)
           haptics: ImpactFeedbackStyle.Light
press-out: withSpring(1.0, spring.cardRelease)
disabled:  opacity 0.5, no animation, no haptics
```

#### Input Focus
```
Border width:    withTiming(2, { duration: 200 })
Label Y:         withTiming(-24, { duration: 200, easing: Easing.bezier(0.4,0,0.2,1) })
Label scale:     withTiming(0.85, { duration: 200 })
Label color:     interpolateColor(anim, [0,1], [text.secondary, primary.default])
Glow shadow:     withTiming(opacity 0.25, { duration: 200 })
```

#### Screen Entry (Staggered)
```
Each card/section enters:  translateY 20 → 0, opacity 0 → 1
Stagger delay:             80ms between each element
Animation preset:          spring.gentle (stiffness: 100, damping: 20)
Maximum stagger items:     6 — after that, enter instantly
```

#### Number Counter (Hero Metric)
```
On balance update:    animate from old value → new value over duration.slow (600ms)
Easing:               Easing.bezier(0.4, 0, 0.2, 1)
Implementation:       interpolate + useAnimatedProps on TextInput
Never skip directly — always count through intermediate values
```

#### Pull to Refresh
```
0–60px pull:    ManjeCharacter appears (thinking mood), opacity 0 → 1
At 60px:        spring bounce of character +5px → back
On release:     trigger refresh, character animates thinking loop
On complete:    character transitions to wave mood for 1.5s, then hides
```

#### Tab Selection
```
Selected icon:   withSpring(1.15, spring.snappy)
Deselected icon: withSpring(1.0, spring.snappy)
Indicator pill:  translateX withSpring to new position
Haptics:         ImpactFeedbackStyle.Light on each tab select
```

#### List Item Swipe Reveal
```
Reveal distance:    128px (two 64px action buttons)
Rubber band at max: velocity dampens at >128px — spring back
Action opacity:     interpolate 0–64px = opacity 0–1
Delete confirm:     require second tap on red button, show 'tap again' label
```

> **Reduced Motion:** Check `AccessibilityInfo.isReduceMotionEnabled()` on app start. Store in theme context. When true: disable all spring animations (duration → 0), disable stagger (all items enter instantly), disable progress bar fill animation, keep haptics.

---

## 11. Navigation Patterns

### 11.1 Navigation Architecture

| Route Group | Screens |
|---|---|
| `(auth)` — stack | AUTH-01 Welcome → AUTH-02 Sign Up / AUTH-03 Sign In |
| `(onboarding)` — stack | OB-02 Country → OB-03 Currency → OB-08 Income Range → OB-07 Success |
| `(app)` — tab | DASH-01 Dashboard \| BUD-01 Budgets \| GOALS \| ACT-01 Activity \| PROF-01 Profile |
| Modals (over app) | TXN-03 Quick Add (bottom sheet), TXN-01 Transaction Detail (full screen modal) |

### 11.2 Transition Specifications

| Transition | Spec |
|---|---|
| Stack push (Auth/Onboarding) | Slide from right (native stack default). Duration: 350ms. |
| Modal presentation (Quick Add) | Slide up from bottom with `spring.modal`. Backdrop scrim fades in simultaneously. |
| Tab switch | No transition — content is immediate. Only tab indicator moves. |
| Back navigation | Slide to right (native default). Swipe gesture enabled on all stack screens. |
| Full screen modal dismiss | Slide down, backdrop fades out. |

---

## 12. Dark Mode System

### 12.1 Dark Mode Color Overrides

> Dark mode is not simply inverted light mode. It uses deep, saturated dark greens for backgrounds to maintain brand identity.

| Semantic Token | Dark Mode Value | Notes |
|---|---|---|
| `bg.base` | `#0F1512` | Very dark green-black — not pure black, maintains brand warmth |
| `bg.card` | `#1C2421` | Slightly lighter than `bg.base` — creates card depth |
| `bg.sunken` | `#141C18` | Sunken areas are darker than the card |
| `text.primary` | `#F0FAF5` | Not pure white — slightly green-tinted for warmth |
| `text.secondary` | `#7A9E8B` | Muted green-gray — never pure gray on dark green bg |
| `border.light` | `#2D3D35` | Subtle border visible on dark card surfaces |
| `primary.default` | `#2E9E6B` | Slightly lighter green in dark mode — maintains contrast |
| `clay.innerHighlight` | `rgba(255,255,255,0.04)` | Very subtle — dark cards are less reflective |
| `clay.innerShadow` | `rgba(0,0,0,0.3)` | Deeper shadow for dark mode depth |
| `gradient.hero` (dark) | `['#0D3B2E', '#050F0A']` | Deep and rich, not washed out |

> **Implementation:** Use `getColors(isDark)` helper from `src/theme/index.ts` in every component. Access current mode via `useColorScheme()`. Persist user preference in AsyncStorage (system/light/dark). **Test every screen in dark mode before considering it complete.**

---

## 13. Screen Redesign Specifications

> **How to use this section:** For each screen: read 'Current Issues' first to understand what to fix. Then follow 'Redesign Specifications' for exact implementation. Reference the named competitor app pattern for visual context.

---

### `AUTH-01` — Welcome Screen
**Reference:** Cleo — dark-first, character-forward, emotional opening  
**Purpose:** The first impression. Sets the entire emotional tone of the app.

**Current Issues:**
- Hero area lacks depth — flat background does not create the premium feel the design system promises
- ManjeCharacter needs to be the absolute first element the eye lands on
- CTA buttons contrast too subtle — primary vs secondary too similar
- Missing brand tagline in Chichewa — "Ndalama zako. Bwino. Tsopano." is a key brand asset

**Redesign Specifications:**
- Background: `gradient.hero` (`#1A6B4A → #0D3B2E`, full screen) — matching Cleo's rich dark opening
- ManjeCharacter: 180px, `wave` mood, centered at 45% screen height — dominant visual element
- App name 'Manje': `display.lg` (36px), Syne ExtraBold, `text.inverse` (#FFFFFF), centered below character
- Tagline: "Ndalama zako. Bwino. Tsopano." `body.md`, `rgba(255,255,255,0.75)`, centered below app name
- Floating sub-tagline in English: "Your money. Clear. Now." `label.md`, `rgba(255,255,255,0.55)`
- Bottom panel: frosted glass card (`glass.bg`, blur 20, `radius.4xl` top corners only) — contains both CTAs
- Primary CTA "I'm New Here": Button `variant=primary`, `size=lg`, `fullWidth`
- Secondary CTA "I Have an Account": Button `variant=ghost`, `size=lg`, `fullWidth`, white text at 0.8 opacity
- Bottom glass panel slides up 300ms after screen mounts (`spring.gentle`), character enters with scale 0→1

**Components:** `ManjeCharacter` (wave, 180px) · `LinearGradient` (hero) · `BlurView` (glass panel) · `Button` (primary lg) · `Button` (ghost lg, white)  
**Color Tokens:** `bg: gradient.hero` · `text: text.inverse` · `glass panel: glass.bg` · `btn: gradient.button`

**Interactions:**
- Character entrance: scale `0.6 → 1.0` with `spring.bouncy`, 200ms delay after mount
- Glass panel: `translateY +80 → 0` with `spring.gentle`, 400ms delay
- Text fade in: opacity `0 → 1`, `duration.moderate`, 600ms delay

---

### `AUTH-02` — Sign Up Screen
**Reference:** Wallet by BudgetBakers — clean, efficient form with minimal friction  
**Purpose:** Account creation — fast and trustworthy. Designed for a first-time fintech user.

**Current Issues:**
- Form may feel too long if all fields shown at once — consider progressive disclosure
- Social proof element missing — a privacy line under the form builds trust
- Password strength indicator needed — visual feedback reduces friction
- Full-width gradient behind form may feel heavy

**Redesign Specifications:**
- Screen background: `gradient.surface` (very subtle) — this is a transactional screen
- ScreenHeader: transparent, back button returns to AUTH-01
- Top: ManjeCharacter at 60px, `happy` mood, centered
- Title: "Create your account" `display.sm`, Syne Bold, `text.primary`, left-aligned
- Subtitle: "Takes about 2 minutes." `body.sm`, `text.secondary` — signals low friction immediately
- Form fields: Full Name, Email Address, Password, Confirm Password — each using `Input` with floating label
- Password field: right icon toggles visibility (eye/eye-off, 20px Ionicon)
- Password strength bar: 4-segment bar below password field — red/orange/yellow/green
- Trust line: `lock-closed` icon (14px) + "Your data is encrypted and stored securely." `label.sm`
- Primary CTA: "Create Account" Button, primary, lg, fullWidth, pinned above keyboard
- Sign-in link: "Already have an account? Sign in" centered, `label.sm`, `text.secondary` with `primary.default` span

**Components:** `ScreenHeader` · `ManjeCharacter` (happy, 60px) · `Input` ×4 · Password strength bar · `Button` (primary lg) · `KeyboardAvoidingView`  
**Color Tokens:** `bg: gradient.surface` · `inputs: bg.sunken` · `primary: primary.default` · `error: status.danger`

**Interactions:**
- Staggered input entry: 80ms stagger, `translateY 12 → 0`, opacity `0 → 1`
- Password strength: animated segment fill from left, `duration.normal` each segment
- Submit loading: Button enters loading state, blocks interaction until response

---

### `AUTH-03` — Sign In Screen
**Reference:** Cleo — emotional re-welcome, fast login, character responds to returning user  
**Purpose:** Returning user login — should feel like coming home.

**Current Issues:**
- Welcome back message too generic — ManjeCharacter should make it feel personal
- Biometric login option missing from layout — should be primary login method on second open
- Forgot password link should be more visible

**Redesign Specifications:**
- Screen background: `gradient.hero` — creates visual continuity with AUTH-01
- Top: ManjeCharacter at 100px, `wave` mood, on gradient background
- Welcome text: "Welcome back!" `display.sm`, Syne Bold, `text.inverse`, centered
- Glass bottom panel (same pattern as AUTH-01) contains all form elements
- Inside glass: Email + Password inputs with floating labels
- Biometric row (if enrolled): 60×60 glass button with face-id or fingerprint icon, centered above main CTA
- Forgot password: right-aligned "Forgot password?" `label.md`, `primary.default` color
- Primary CTA: "Sign In" Button, primary, lg, fullWidth
- Bottom: "New to Manje? Create an account" `label.sm`, centered
- Error state: inline error message with `status.dangerBg` tint between password and CTA

**Components:** `ManjeCharacter` (wave, 100px) · `LinearGradient` (hero) · `BlurView` glass panel · `Input` ×2 · Biometric button (conditional) · `Button` (primary lg)  
**Color Tokens:** `bg: gradient.hero` · `glass: glass.bg` · `text on gradient: text.inverse`

**Interactions:**
- Character mood reacts: if last session positive (goal met), show `happy`; if overdue, show `concern`
- Biometric pulse: scale `1.0 → 1.05 → 1.0` on 2s loop
- Error shake: `translateX: 0 → -8 → 8 → -4 → 4 → 0`, 400ms on failed login

---

### `OB-02` — Country Selection
**Reference:** PiggyVest — onboarding steps feel like progress, not forms  
**Purpose:** Step 1 of onboarding — country context for currency and financial products.

**Current Issues:**
- Flat list of countries is overwhelming — Malawi must be pre-selected as obvious primary choice
- Progress indicator needed — user should know they're on step 1 of a short flow
- No ManjeCharacter on this screen

**Redesign Specifications:**
- Screen background: `gradient.onboarding` (pale green tint, very subtle)
- Progress bar at top: 4-step pill progress bar (step 1 active in `primary.default`)
- ManjeCharacter: 60px, `happy` mood, with speech bubble: "Let's set up your account"
- Title: "Where are you based?" `display.md`, Syne Bold, `text.primary`
- Subtitle: "This sets your default currency." `body.sm`, `text.secondary`
- Malawi pre-selected card: ClayCard (clay, pressable) — Malawian flag emoji + "Malawi" `headline.md` + "MWK — Malawian Kwacha" `body.sm` — always at top, `primary.default` border + bg tint
- Section label: "Other Countries" `label.sm` uppercase with divider
- Country list: flat rows below — flag + name only (not ClayCards)
- CTA: "Continue" Button, primary, lg, fullWidth — disabled until selection made

**Interactions:**
- Malawi card springs in from left 200ms after mount (hero entrance for primary option)
- Other countries fade in with 40ms stagger after Malawi card settles
- Selection: selected card — border color change + scale `1.0 → 1.02` pulse
- CTA: transitions from disabled (`opacity 0.5`) to active with `duration.normal`

---

### `OB-03` — Currency Selection
**Reference:** Wallet by BudgetBakers — currency as a first-class choice  
**Purpose:** Step 2 — confirm currency. For Malawi users, near-instant (MWK default).

**Current Issues:**
- MWK should be so obviously correct that the user barely pauses
- Purpose of the screen risks being unclear without educational micro-copy

**Redesign Specifications:**
- Screen bg: `gradient.onboarding` (step 2 active on progress indicator)
- ManjeCharacter: 60px, `tip` mood — speech: "All amounts will show in your local currency."
- Title: "Confirm your currency" `display.md`, Syne Bold
- MWK pre-selected card: Large ClayCard (hero-adjacent) — "MWK" `financial.md` + "Malawian Kwacha" `headline.md` + flag emoji + check icon in `primary.default` circle top-right
- Preview inside card: sample amount "MWK 125,000" at `financial.hero` size — shows exactly what they'll see
- Other currencies: collapsed behind a "Change currency" ghost button — doesn't clutter the default path
- CTA: "Use MWK" Button, primary, lg, fullWidth

**Interactions:**
- Sample amount counts up from `0 → 125,000` on screen mount (600ms, `duration.slow`) — immediately impactful
- Checkmark: scale `0 → 1` with `spring.bouncy` when MWK confirmed

---

### `OB-08` — Income Range
**Reference:** PiggyVest — non-intimidating salary selection, feels like personalisation not interrogation  
**Purpose:** Step 3 — optional income range. Sets initial AI context.

**Current Issues:**
- A text input for income is too direct — many users will abandon if asked for exact salary
- Optional nature must be crystal clear upfront
- Ranges must feel relatable to the Malawian income context

**Redesign Specifications:**
- Screen bg: `gradient.onboarding` (step 3 active), "Optional" label in green pill badge top right
- ManjeCharacter: 60px, `thinking` — speech: "This helps me give smarter budget suggestions. You can always skip."
- Title: "What's your monthly income range?" `display.md`
- Income range grid: 2-column, each a pressable ClayCard
- Ranges (MWK): Under 80k | 80k–150k | 150k–300k | 300k–500k | 500k–1M | Over 1M
- Each card: range label (`headline.md`) top, informal label (`body.sm`, `text.secondary`) below ("Entry-level", "Mid-level", etc.)
- Selected card: `primary.default` border (2px), `primary.subtle` background, check badge
- Prefer not to say: ghost button row at bottom
- CTA: "Continue" (active if selection made) | "Skip for now" (ghost button)

**Interactions:**
- Grid cards stagger in: each row 100ms after previous
- Selection: selected card scale pulse + border color transition
- Deselected cards: others fade to `opacity 0.6`
- "Skip" always visible — never hidden behind keyboard or scroll

---

### `OB-07` — Onboarding Success
**Reference:** Cleo + PiggyVest — celebration as a product moment, not just a transition  
**Purpose:** End of onboarding. The emotional peak.

**Current Issues:**
- Under-designed — treated as a loading screen rather than a milestone moment
- ManjeCharacter should be in the most expressive, celebratory mood available
- CTA "Let's Go!" should feel earned

**Redesign Specifications:**
- Full screen `gradient.hero` background
- Lottie confetti animation playing behind everything (looping)
- ManjeCharacter: 150px, `celebrate` mood — largest character appearance in onboarding
- Headline: "You're all set, [first name]!" `display.lg` (36px), Syne ExtraBold, `text.inverse`, centered
- Sub-headline: "Let's make your money work for you." `body.lg`, `rgba(255,255,255,0.8)`, centered
- Milestone chips: "✓ Account created", "✓ Currency set", "✓ Profile ready" — white semi-transparent pills
- First step nudge: "First up: add your first transaction to see Manje in action." `body.sm`, `rgba(255,255,255,0.65)`
- CTA: "Let's Go!" — glass-white button variant (`rgba(255,255,255,0.2)` bg, `rgba(255,255,255,0.4)` border, white text), 56px height

**Interactions:**
- Character entrance: scale `0 → 1.1 → 1.0` with `spring.bouncy` — a visual "ta-da"
- Milestone chips: stagger in from bottom, 150ms each
- Confetti: auto-starts, plays throughout screen stay
- CTA appears last: 800ms delay, slides up with `spring.modal`

---

### `DASH-01` — Dashboard (Main)
**Reference:** Cleo (character hero) + PocketGuard (single hero number) + Wallet by BudgetBakers (monthly nav)  
**Purpose:** The core product screen. Users return here every day.

**Current Issues:**
- Hero section needs to consolidate ManjeCharacter, hero metric, and AI insight into one cohesive panel
- Month navigation (Wallet-inspired) missing — users can't view previous months
- Budget progress cards likely absent or too small
- AI insight card needs stronger visual distinction
- Pull-to-refresh with ManjeCharacter not yet implemented
- Quick Add FAB must be the most findable element after the hero number

**Redesign Specifications:**

**Status Bar:** Light content (white text) over hero card gradient.

**Hero Card** (`ClayCard` hero variant, `gradient.hero`): Full width, `borderRadius 0` bottom, 220px min height.
- Left: ManjeCharacter (100px, dynamic mood)
- Right: "Available to Spend" `label.sm` `text.inverse` opacity 0.7 → hero metric `financial.hero` (52px) `text.inverse` → "of MWK X,000 this month" `body.sm` `text.inverse` opacity 0.6
- Bottom row: AI insight snippet (ManjeCharacter 24px icon + one-line insight text)

**Month Navigator:** Horizontal scroll bar of month chips below hero — current month selected (primary.default pill), past months as ghost pills. Inspired by Wallet by BudgetBakers.

**Budget Health Row:** 2-column grid of compact ClayCard items showing top 2 budget categories — each with progress bar, category icon, amount remaining. Section header: "Budgets" with "See all" right link.

**Recent Transactions:** Section header "Recent" with "See all" right link. FlatList of last 5 `TransactionItem` components. Empty state: ManjeCharacter (thinking) + "No transactions yet. Tap + to add your first."

**AI Insight Card:** ClayCard with `gradient.accent` (blue-purple) background. ManjeCharacter (60px, `tip`) left side. Insight text right (`body.md`, `text.inverse`). "AI" badge in top right corner.

**Floating Quick Add Button:** 56px circle, `gradient.button`, `shadow.xl`, `position: absolute bottom: 96px right: 20px`. Ionicons `add`, white, 28px.

**Components:** `ClayCard` (hero variant) · `ManjeCharacter` (dynamic, 100px/60px) · Month Navigator · Budget Health Row · `FlatList` + `TransactionItem` · `ClayCard` with `gradient.accent` · Animated FAB · `Animated.ScrollView`  
**Color Tokens:** `hero: gradient.hero` · `hero text: text.inverse` · `screen: bg.base` · `insight: gradient.accent` · `FAB: gradient.button`

**Interactions:**
- Dashboard entry: hero card fades + scales from 0.95, then staggered sections below
- Hero number: counts up from 0 on first load, animates on value change
- ManjeCharacter in hero: idle breathing loop (scale `1.0 → 1.02` on 3s cycle)
- Pull to refresh: full spec from Section 10.3
- FAB: on scroll down >40px, shrinks to 44px icon only; on scroll up, returns to full size

---

### `TXN-03` — Quick Add Transaction (Modal)
**Reference:** Wallet by BudgetBakers — fast, keypad-first entry that minimises taps  
**Purpose:** The most used action in the app. Must be completable in under 10 seconds.

**Current Issues:**
- Category selection should be horizontal scroll of chips — not a dropdown or long list
- Amount entry needs a large phone-calculator-style keypad
- Transaction type toggle (Expense/Income) should be the very first choice
- Merchant/description field is secondary — should not be required for the fast path

**Redesign Specifications:**
- Modal presentation: slides up from bottom (`spring.modal`), full-screen minus status bar, `borderTopRadius 32px`
- Drag handle: 40px wide, 4px tall, `neutral.300`, centered at top
- Header row: "Add Transaction" `headline.lg` left, "Cancel" ghost button right
- **Type Toggle:** Pill segmented control — "Expense | Income" — full width, 48px height. Expense = `status.danger` active, Income = `status.success` active. **Step 1.**
- **Amount Display:** `financial.hero` (52px), Syne Bold, centered. Starts "0". "MWK" `label.md` to left. Backspace icon at right.
- **Custom Keypad:** 3×4 numpad grid. Each key: 72×64px, `headline.lg` text, `bg.sunken` background, `radius.md`, spring press animation.
- **Category Row:** Horizontal scroll of `CategoryChip` components with icons. Auto-scroll to selected. "More" chip at end opens full category sheet.
- Description Field (collapsible): "Add note" single-line Input, ghost style. Not required.
- Date Row: "Today" chip with calendar icon. Tap to open DatePicker.
- Save Button: "Save Transaction" Button, primary, lg, fullWidth. Shows ManjeCharacter (36px, `happy`) left of button text on save success.

**Components:** Animated bottom sheet modal · Segmented control toggle · Custom Numpad (3×4 grid) · HorizontalScrollView of `CategoryChip` · `Input` (ghost, description) · `Button` (primary fullWidth) · `ManjeCharacter` (36px, happy — save confirmation)  
**Color Tokens:** `modal: bg.card` · `expense toggle: status.danger` · `income toggle: status.success` · `keypad: bg.sunken`

**Interactions:**
- Modal entry: `translateY` screen bottom → 0, `spring.modal` (350ms from tap)
- Keypad press: key scale `1.0 → 0.88 → 1.0` with `spring.buttonPress` + haptic
- Amount update: fast counter (80ms) as user types
- Save success: checkmark + ManjeCharacter happy (300ms), then modal dismisses
- Dismiss gesture: downward swipe on drag handle — momentum-tracked

---

### `ACT-01` — Activity Screen (Transaction History)
**Reference:** Wallet by BudgetBakers — grouped activity list, search first, filter chips  
**Purpose:** Full transaction history. Fast to scan, easy to search and filter.

**Current Issues:**
- Transaction groups need clear visual separation — not just text labels
- Search bar must be at the very top — primary navigation tool on this screen
- Filter chips need to be horizontal scroll, always visible
- Empty state for filtered results differs from no-transactions empty state — handle both

**Redesign Specifications:**
- Screen header: "Activity" `display.sm` title, no back (tab root), settings/filter icon right
- **Search Bar:** Full-width, pinned just below header. 52px tall, `bg.sunken`, `search` left icon. Focusable — animate to expand on focus (dismiss title, take full width).
- **Filter Chips Row:** Horizontal scroll below search. Default chips: "All", "Expenses", "Income", then categories. Selected: `primary.default` bg + white text. Unselected: `bg.card` + `border.light`.
- **Month Total Banner:** When filtering by month, show collapsed ClayCard (inset) — "Oct 2025: Spent MWK 45,200 · Earned MWK 120,000"
- **Transaction Groups:** Grouped by date. Header: `label.sm` uppercase, `text.secondary`, day total right-aligned.
- **Transaction Rows:** `TransactionItem` with swipe-reveal actions (Edit + Delete). 1px divider between rows.
- **Empty State (no transactions):** ManjeCharacter (100px, `wave`) centered, "No transactions yet" `display.sm`, "Tap + to log your first expense." `body.md`, "Add Transaction" Button (primary, md).
- **Empty State (search no results):** ManjeCharacter (80px, `thinking`), "No results for '[query]'" `headline.md`, "Try a different search or clear filters." `body.sm`

**Components:** `ScreenHeader` (tab root) · Animated search bar · HorizontalScrollView of `FilterChip` · `ClayCard` inset (month summary) · `SectionList` (date-grouped) · `TransactionItem` with `Swipeable` · ManjeCharacter (two empty state variants)  
**Color Tokens:** `screen: bg.base` · `search: bg.sunken` · `active filter: primary.default` · `section headers: text.secondary` · `swipe actions: amber/danger`

**Interactions:**
- Search focus: header title fades out (`duration.fast`), search bar expands to full width (`spring.snappy`)
- Filter chip selection: active chip scale `1.0 → 1.05` + color transition
- List scroll: no special animations — speed is priority
- Swipe-to-reveal: full spec from Section 10.3
- Empty state: ManjeCharacter bounces in (`spring.bouncy`) 300ms after render

---

## 14. Icon Usage Guide

### 14.1 Primary Icon Library

Manje uses `@expo/vector-icons` with the **Ionicons** set as the primary icon library. Ionicons provides iOS-native filled and outlined variants that match React Native aesthetic conventions.

### 14.2 Icon Size Standards

| Context | Size | Usage |
|---|---|---|
| Tab bar icons | 24px | All bottom tab navigation icons |
| Header actions | 22px | Back chevron, settings gear, notification bell |
| Input icons | 20px | Left/right icons inside Input component |
| Category icons | 20px | Inside category icon containers in TransactionItem |
| Button icons | 18px | Left/right icon support in Button component |
| Badge/chip icons | 12px | CategoryBadge, filter chip icons |
| FAB icon | 28px | Quick Add floating action button center icon |

### 14.3 Icon Color Rules

- Icons inherit their parent context's text color by default (`text.secondary` for most)
- Active/selected icons use `primary.default` (`#1A6B4A`)
- Danger icons (delete, error) use `status.danger` (`#DC2626`)
- Category icons use `category.fg` token — never a generic color
- Icons on gradient/dark backgrounds always use `text.inverse` (`#FFFFFF`)
- Never use opacity to create a 'muted' icon — use the `text.secondary` token instead

---

## 15. Accessibility Standards

### 15.1 Contrast Requirements

| Element Pair | Min Ratio | Our Value |
|---|---|---|
| Body text on `bg.base` | 4.5:1 (AA) | `text.primary` on `#F8FAF9` = 14.2:1 ✓ AAA |
| Label text on `bg.card` | 4.5:1 (AA) | `text.secondary` on `#FFFFFF` = 4.7:1 ✓ AA |
| White text on `gradient.hero` | 4.5:1 (AA) | `#FFFFFF` on `#1A6B4A` = 5.1:1 ✓ AA |
| Category badge text on bg | 4.5:1 (AA) | All 12 pairs pre-validated in color system |
| Disabled button text | 3:1 (large) | Primary button at 50% opacity — re-verify per bg |

### 15.2 Touch Target Requirements

- Minimum **44×44pt** for all interactive elements (iOS HIG + WCAG 2.5.5)
- List items: full row is tappable — not just the chevron icon
- Keypad keys: 72×64px — well above minimum
- Category chips in Quick Add: 80×44px — meets minimum on height
- Tab bar items: full segment width × 72px height

### 15.3 Screen Reader Labels

```tsx
// Icon buttons
accessibilityLabel="Back"
accessibilityLabel="Add transaction"
accessibilityLabel="Delete"

// ManjeCharacter
accessibilityLabel="Manje says: Your food budget is at 82%"

// Amount input
accessibilityLabel="Transaction amount in MWK, currently 0"

// Progress bars
accessibilityRole="progressbar"
accessibilityValue={{ min: 0, max: 100, now: percentUsed }}

// Category chips
accessibilityRole="radio"   // each chip
// parent:
accessibilityRole="radiogroup"
```

---

## 16. Implementation Checklist

### 16.1 Design System Foundation

- [ ] Load Syne and Work Sans fonts via expo-font in `app/_layout.tsx`
- [ ] Verify all color tokens mapped correctly in both light and dark `getColors()` returns
- [ ] Test all `gradient.*` tokens render correctly with expo-linear-gradient on Android
- [ ] `shadow.md` and above: verify tinted green shadow on Android (elevation + shadowColor)
- [ ] Confirm reduced motion detection wired into animation context

### 16.2 Per-Screen Completion Criteria

| Screen | Must-Fix Before Considered Complete | Priority |
|---|---|---|
| AUTH-01 | `gradient.hero` full screen bg, ManjeCharacter 180px wave, glass panel CTA group | CRITICAL |
| AUTH-02 | Staggered form entry, password strength bar, trust copy below form | HIGH |
| AUTH-03 | `gradient.hero` bg, biometric option conditional, error shake animation | HIGH |
| OB-02 | 4-step progress indicator, Malawi pre-selected hero card, country list below | HIGH |
| OB-03 | Sample amount counter animation, MWK hero preview card | MEDIUM |
| OB-08 | 2-col income range grid, 'Optional' badge prominent, skip always visible | HIGH |
| OB-07 | `gradient.hero` full screen, `celebrate` mood 150px, Lottie confetti | CRITICAL |
| DASH-01 | Hero card with character+metric, month navigator, AI insight card `gradient.accent`, FAB | CRITICAL |
| TXN-03 | Custom numpad, horizontal category scroll, expense/income toggle, modal spring entry | CRITICAL |
| ACT-01 | Animated search bar, filter chips, section headers, swipe-to-reveal actions | HIGH |

### 16.3 Testing Requirements Before Shipping

- [ ] Test all screens on: Xiaomi Redmi 10 (mid-range), Samsung Galaxy A05 (entry-level), iPhone 14 (iOS)
- [ ] Test dark mode on all 10 screens — every semantic token must render correctly
- [ ] Test with system font size set to Largest (accessibility) — layouts must not break
- [ ] Test reduced motion preference on both iOS and Android
- [ ] Manually test all animations at 60fps on the Redmi 10 — if any drop frames, simplify
- [ ] Screen reader pass: VoiceOver (iOS) and TalkBack (Android) on every screen
- [ ] Run contrast checker on every text-on-gradient pairing — gradient midpoints often fail

---

*Manje Design System v2.0 — Hybrid Premium Edition*  
*April 2026 · Manje Technologies — AI-Powered Personal Finance for Southern Africa*
