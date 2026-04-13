# Manje — Technical Product Requirements Document
**Version:** 1.0 | **Date:** July 2025 | **Prepared by:** System Architect  
**Status:** Draft for engineering team review  
**Purpose:** Engineering-focused requirements, architecture, acceptance criteria, and implementation guidance. This document is the bridge between the Refined PVD and code.

---

## Table of Contents
1. [Document Purpose & Audience](#1-document-purpose--audience)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Technology Stack — Detailed Rationale](#3-technology-stack--detailed-rationale)
4. [Architecture Decisions & Patterns](#4-architecture-decisions--patterns)
5. [P0 Feature Requirements & Acceptance Criteria](#5-p0-feature-requirements--acceptance-criteria)
6. [P1 Feature Requirements & Acceptance Criteria](#6-p1-feature-requirements--acceptance-criteria)
7. [Data Models](#7-data-models)
8. [API Contracts](#8-api-contracts)
9. [Security Requirements](#9-security-requirements)
10. [Performance Requirements](#10-performance-requirements)
11. [Testing Strategy](#11-testing-strategy)
12. [DevOps & CI/CD](#12-devops--cicd)
13. [Monitoring & Observability](#13-monitoring--observability)
14. [Engineering Guidelines](#14-engineering-guidelines)
15. [Appendix: Decision Log](#appendix-decision-log)

---

## 1. Document Purpose & Audience

This document is for **engineers, tech leads, and QA**. It translates the Refined PVD (product "what") into technical "how." 

**Read this alongside:**
- `03_Refined_Product_Vision_Document.md` — phased scope, business context
- `Manje_IA_and_User_Flows.md` — screen inventory, user flows
- `Manje_Design_System.md` — design tokens, component specs, accessibility

**Conventions:**
- **MUST** = non-negotiable requirement
- **SHOULD** = strongly recommended, exceptions need tech lead approval
- **MAY** = optional / nice-to-have
- **AC** = Acceptance Criteria
- Screen IDs (e.g., `DASH-01`, `TXN-03`) reference `Manje_IA_and_User_Flows.md`

---

## 2. System Architecture Overview

### 2.1 High-Level Architecture Diagram (Textual)

```
┌─────────────────────────────────────────────────────────────────┐
│                        MANJE MOBILE APP                         │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌──────────────┐  │
│  │   UI      │  │  Zustand   │  │  SQLite  │  │   Sync       │  │
│  │  (React   │←→│  State     │←→│  (Local  │←→│   Engine     │  │
│  │  Native)  │  │  Store     │  │  SQLCipher│  │  (Firestore) │  │
│  └──────────┘  └───────────┘  └──────────┘  └──────┬───────┘  │
│       ↕                                              │          │
│  ┌──────────┐                                        │          │
│  │  AI       │────────────────────────────────────┐  │          │
│  │  Service  │                                    │  │          │
│  └──────────┘                                    │  │          │
└──────────────────────────────────────────────────┼──┼──────────┘
                                                   │  │
                    ┌──────────────────────────────┐│  │
                    │         CLOUD SERVICES        ││  │
                    │  ┌────────────┐ ┌──────────┐ ││  │
                    │  │  Firebase   │ │ Firebase │ ││  │
                    │  │  Auth       │ │ Firestore│←┘│  │
                    │  └────────────┘ └──────────┘   │  │
                    │  ┌────────────┐ ┌──────────┐   │  │
                    │  │  Firebase   │ │ DeepInfra│←──┘  │
                    │  │  FCM        │ │ AI API   │      │
                    │  └────────────┘ └──────────┘      │
                    └────────────────────────────────────┘
```

### 2.2 Architecture Principles

1. **Offline-First:** Every feature MUST work without internet, except AI chat and AI categorisation (which fall back gracefully).
2. **Local-First Data:** SQLite is the source of truth. Firestore is the sync layer, not the primary store.
3. **Encryption-Default:** All local data encrypted with SQLCipher. Encryption keys stored in Expo Secure Store.
4. **Stateless Cloud:** No custom backend server. Firebase services + DeepInfra API. Reduces ops burden.
5. **Thin Sync Layer:** Sync logic is a distinct module. All business logic operates on local SQLite data.
6. **AI Abstraction:** AI calls go through a provider-agnostic interface. Swapping DeepInfra for another provider requires changing one module.

### 2.3 Data Flow — Transaction Lifecycle

```
User enters transaction → Zustand store updates → SQLite write (encrypted)
  → UI updates immediately (optimistic)
  → AI categorisation request (if online) → category suggestion returned
  → User confirms/overrides category → SQLite update
  → Sync engine queues change → Firestore write (when connected)
  → Firestore confirms → sync status updated locally
```

---

## 3. Technology Stack — Detailed Rationale

### 3.1 Mobile Framework: React Native + Expo SDK

| Factor | Decision | Rationale |
|--------|----------|-----------|
| **Framework** | React Native | Cross-platform (Android-first + iOS); large ecosystem; strong TypeScript support; most developers available in the market |
| **Tooling** | Expo SDK (managed workflow) | Eliminates native build complexity; OTA updates via EAS Update; managed builds via EAS Build; rich library ecosystem (`expo-font`, `expo-local-authentication`, `expo-secure-store`, `expo-sqlite`) |
| **Why not Flutter?** | Smaller developer pool in the region; Dart is less widely known than TypeScript; React Native/Expo ecosystem is more mature for the specific integrations needed (Firebase, SQLite, Lottie) |
| **Why not native?** | Two separate codebases (Kotlin + Swift) doubles engineering cost; team size doesn't justify it; Expo bridges the performance gap for this app type |

### 3.2 Language: TypeScript (Strict Mode)

| Factor | Rationale |
|--------|-----------|
| **Type safety** | Financial data demands correctness; TypeScript catches amount/currency errors at compile time |
| **Developer experience** | IntelliSense, refactoring support, self-documenting interfaces |
| **Configuration** | `strict: true`, `noImplicitAny: true`, `strictNullChecks: true` in `tsconfig.json` |

### 3.3 State Management: Zustand

| Factor | Rationale |
|--------|-----------|
| **Why Zustand?** | Minimal boilerplate; excellent TypeScript support; no provider wrappers; works well with React Native's architecture |
| **Why not Redux?** | Overkill for this app's complexity; more boilerplate; Zustand achieves the same with less code |
| **Why not MobX?** | Observable patterns add complexity; Zustand's simplicity is better for a small-to-medium team |
| **Store structure** | One store per domain: `useAuthStore`, `useTransactionStore`, `useBudgetStore`, `useGoalStore`, `useSettingsStore`, `useAIStore` |
| **Persistence** | Zustand stores hydrate from SQLite on app launch. Stores are in-memory during session; writes propagate to SQLite. |

### 3.4 Local Database: SQLite + SQLCipher (via `expo-sqlite`)

| Factor | Rationale |
|--------|-----------|
| **Why SQLite?** | Industry standard for mobile local storage; ACID-compliant; works fully offline; single-file database |
| **Why SQLCipher?** | AES-256 encryption at rest; transparent to the application layer; protects financial data even if device is compromised |
| **Why not WatermelonDB?** | Adds abstraction overhead; SQLite via `expo-sqlite` is sufficient and more predictable |
| **Why not Realm?** | Proprietary sync protocol conflicts with Firestore; MongoDB acquisition created uncertainty; SQLite is more portable |
| **Key storage** | Encryption key generated on first launch, stored in `expo-secure-store` (Keychain on iOS, Keystore on Android) |

### 3.5 Cloud Database: Firebase Firestore

| Factor | Rationale |
|--------|-----------|
| **Why Firestore?** | Real-time sync for VSLA (P2); serverless — no backend to maintain; generous free tier; offline persistence built-in |
| **Why not Supabase?** | Supabase is PostgreSQL-based, which is better for relational queries but worse for real-time sync on mobile; Firestore's offline SDK is more mature |
| **Why not custom backend?** | Adds operational complexity (server hosting, scaling, monitoring); team is lean; Firebase is fully managed |
| **Sync strategy** | Local SQLite is truth. Firestore receives sync writes. On conflict: last-write-wins with Firestore server timestamp. |
| **Cost management** | Firestore charges per read/write. Batch writes during sync. Limit real-time listeners to VSLA screens only (P2). |

### 3.6 Authentication: Firebase Auth

| Factor | Rationale |
|--------|-----------|
| **Providers (P0)** | Email/password + Google OAuth |
| **Providers (P1+)** | Add Apple Sign-In (iOS App Store requirement if we ship iOS) |
| **Biometric** | `expo-local-authentication` for device-level biometric lock (fingerprint/face). Not a Firebase provider — it's a local app lock. |
| **Session management** | Firebase Auth token with auto-refresh. Token stored securely. |

### 3.7 AI: DeepInfra + Meta Llama 3.3 70B Instruct

| Factor | Rationale |
|--------|-----------|
| **Model** | Meta Llama 3.3 70B Instruct | Best open-source model for instruction-following; strong multilingual capability; cost-effective via DeepInfra |
| **Provider** | DeepInfra | Managed inference; pay-per-token; no GPU infrastructure needed; supports OpenAI-compatible API format |
| **Why not OpenAI GPT-4?** | 3–5× more expensive per token; proprietary; data processing concerns for African market users |
| **Why not on-device?** | 70B model cannot run on mobile. Explore 2B models for offline categorisation fallback in P1. |
| **Abstraction** | `AIProvider` interface with `DeepInfraProvider` implementation. Future providers (OpenAI, Anthropic, Google) plug in via same interface. |
| **Cost estimate** | ~$0.0001–0.0003 per categorisation request; ~$0.001–0.005 per chat turn. At 10K users: ~$50–150/month. |

### 3.8 Additional Libraries (Key Dependencies)

| Library | Purpose | Phase |
|---------|---------|-------|
| `expo-sqlite` | Local SQLite database | P0 |
| `expo-secure-store` | Encryption key storage | P0 |
| `expo-local-authentication` | Biometric authentication | P0 |
| `expo-font` | Custom fonts (Syne, Work Sans) | P0 |
| `expo-notifications` | Push notification handling | P0 |
| `expo-haptics` | Tactile feedback | P0 |
| `@react-navigation/native` | Navigation (stack + tabs) | P0 |
| `@react-navigation/bottom-tabs` | Bottom tab bar | P0 |
| `react-native-reanimated` | Animations (ManjeCharacter, UI) | P0 |
| `react-native-gesture-handler` | Swipe gestures (activity feed) | P0 |
| `lottie-react-native` | ManjeCharacter Lottie animations | P1 |
| `react-native-svg` | Charts (progress bars, health ring) | P0 |
| `date-fns` | Date manipulation | P0 |
| `zod` | Runtime schema validation | P0 |

---

## 4. Architecture Decisions & Patterns

### 4.1 Project Structure

```
src/
├── app/                    # Expo Router file-based routing
│   ├── (auth)/             # Auth screens (login, register, forgot-password)
│   ├── (onboarding)/       # Onboarding screens
│   ├── (tabs)/             # Bottom tab navigator
│   │   ├── home/           # Dashboard (DASH-01)
│   │   ├── activity/       # Activity feed (ACT-01)
│   │   ├── manje/          # AI Chat (AI-01, AI-02) [P1]
│   │   └── you/            # You tab (YOU-01)
│   ├── transaction/        # Transaction add/edit/detail
│   ├── budget/             # Budget screens
│   ├── goal/               # Goal screens
│   ├── settings/           # Settings screens
│   └── _layout.tsx         # Root layout (font loading, auth guard)
├── components/
│   ├── common/             # Design system primitives (ClayCard, Button, Input, etc.)
│   ├── character/          # ManjeCharacter, ManjeMood
│   ├── home/               # Dashboard-specific components
│   ├── activity/           # Activity feed components
│   ├── budget/             # Budget components
│   ├── goal/               # Goal components
│   ├── modals/             # Bottom sheets, modals
│   └── charts/             # Progress bars, sparklines, rings
├── stores/                 # Zustand stores
│   ├── authStore.ts
│   ├── transactionStore.ts
│   ├── budgetStore.ts
│   ├── goalStore.ts
│   ├── settingsStore.ts
│   └── aiStore.ts
├── database/               # SQLite layer
│   ├── schema.ts           # Table definitions
│   ├── migrations.ts       # Schema migrations
│   ├── queries/            # Domain-specific query modules
│   │   ├── transactionQueries.ts
│   │   ├── budgetQueries.ts
│   │   └── goalQueries.ts
│   └── db.ts               # Database initialisation + encryption
├── services/               # External service integrations
│   ├── ai/
│   │   ├── aiProvider.ts           # Provider interface
│   │   ├── deepInfraProvider.ts    # DeepInfra implementation
│   │   ├── offlineFallback.ts      # Keyword-based categorisation
│   │   └── prompts.ts              # System prompts, templates
│   ├── sync/
│   │   ├── syncEngine.ts           # Sync orchestration
│   │   ├── firestoreSync.ts        # Firestore read/write
│   │   └── conflictResolver.ts     # Last-write-wins logic
│   ├── auth/
│   │   └── authService.ts          # Firebase Auth wrapper
│   └── notifications/
│       └── notificationService.ts  # FCM + local notifications
├── theme/                  # Design system tokens
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── animation.ts
│   └── theme.ts            # Unified export
├── utils/                  # Pure utility functions
│   ├── currency.ts         # MWK formatting
│   ├── date.ts             # Date helpers
│   ├── validation.ts       # Zod schemas
│   └── constants.ts        # App-wide constants
├── hooks/                  # Custom React hooks
│   ├── useDatabase.ts
│   ├── useSync.ts
│   ├── useAI.ts
│   └── useTheme.ts
├── types/                  # Global TypeScript types
│   ├── transaction.ts
│   ├── budget.ts
│   ├── goal.ts
│   └── user.ts
└── assets/
    ├── character/          # ManjeCharacter assets per mood
    ├── fonts/              # Syne + Work Sans
    └── images/             # App icons, illustrations
```

### 4.2 Navigation Architecture

**Router:** Expo Router (file-based routing)

```
Root Layout (_layout.tsx)
├── Auth Guard: checks Firebase Auth state
│   ├── Not authenticated → (auth) stack
│   │   ├── Welcome screen (AUTH-01)
│   │   ├── Sign Up (AUTH-02)
│   │   ├── Sign In (AUTH-03)
│   │   └── Forgot Password (AUTH-04)
│   ├── Not onboarded → (onboarding) stack
│   │   ├── Welcome (ONB-01)
│   │   ├── Currency (ONB-02)
│   │   └── Income Range (ONB-03)
│   └── Authenticated + onboarded → (tabs) layout
│       ├── Home tab → Dashboard (DASH-01)
│       ├── Activity tab → Activity Feed (ACT-01)
│       ├── Add (centre) → Quick Add Modal (NAV-01)
│       ├── Manje tab → AI Chat [P1, placeholder in P0]
│       └── You tab → You Hub (YOU-01)
│           ├── Settings screens
│           ├── Goal screens
│           └── Budget screens
```

### 4.3 Offline-First Data Pattern

```typescript
// Pattern: Every write goes to SQLite first, then queues for sync
async function addTransaction(txn: NewTransaction): Promise<Transaction> {
  // 1. Validate with Zod
  const validated = transactionSchema.parse(txn);
  
  // 2. Write to SQLite (immediate, offline-safe)
  const saved = await transactionQueries.insert(validated);
  
  // 3. Update Zustand store (UI updates immediately)
  useTransactionStore.getState().addTransaction(saved);
  
  // 4. Queue for sync (non-blocking)
  syncEngine.queueWrite('transactions', saved);
  
  // 5. Request AI categorisation (non-blocking, online only)
  if (isOnline()) {
    aiService.categorise(saved.merchant).then(suggestion => {
      if (suggestion.confidence > 0.7) {
        // Show suggestion to user, don't auto-apply
        useTransactionStore.getState().setSuggestion(saved.id, suggestion);
      }
    }).catch(() => {/* silent fail — offline fallback already applied */});
  }
  
  return saved;
}
```

### 4.4 Sync Engine Design

```
┌──────────────────────────────────────┐
│            SYNC ENGINE               │
│                                      │
│  ┌──────────┐    ┌──────────────┐   │
│  │  Change   │    │  Network     │   │
│  │  Queue    │    │  Monitor     │   │
│  │  (SQLite  │    │  (NetInfo)   │   │
│  │  table)   │    └──────┬───────┘   │
│  └─────┬────┘           │           │
│        │                │           │
│        v                v           │
│  ┌──────────────────────────────┐   │
│  │      Sync Orchestrator       │   │
│  │  - Batches changes           │   │
│  │  - Retries on failure (3x)   │   │
│  │  - Respects rate limits      │   │
│  │  - Resolves conflicts (LWW)  │   │
│  └──────────────┬───────────────┘   │
│                 │                    │
│                 v                    │
│  ┌──────────────────────────────┐   │
│  │      Firestore Adapter       │   │
│  │  - Batch writes              │   │
│  │  - Snapshot listeners [P2]   │   │
│  └──────────────────────────────┘   │
└──────────────────────────────────────┘
```

**Sync rules:**
- MUST: Queue all local writes for sync
- MUST: Batch Firestore writes (max 500 per batch, Firestore limit)
- MUST: Retry failed syncs up to 3 times with exponential backoff
- MUST: After 3 consecutive failures, show subtle banner: "Sync delayed — your data is safe on this device."
- MUST: Use Firestore server timestamps for conflict resolution
- SHOULD: Sync on app foreground, network reconnect, and every 15 minutes while active
- MUST NOT: Block UI on sync operations

### 4.5 AI Service Abstraction

```typescript
// services/ai/aiProvider.ts
interface AIProvider {
  categorise(merchant: string, amount: number, context?: string): Promise<CategorySuggestion>;
  chat(messages: ChatMessage[], userContext: UserFinancialContext): Promise<AIResponse>;
  generateInsight(financialSummary: FinancialSummary): Promise<InsightText>;
}

interface CategorySuggestion {
  category: TransactionCategory;
  confidence: number; // 0.0 – 1.0
  reasoning?: string;
}

interface AIResponse {
  text: string;
  mood: ManjeMood;
  actionButton?: { label: string; route: string };
}

// services/ai/deepInfraProvider.ts — implements AIProvider
// services/ai/offlineFallback.ts — keyword-based, implements AIProvider.categorise only
```

---

## 5. P0 Feature Requirements & Acceptance Criteria

### 5.1 FR-AUTH: Authentication

**Screen refs:** AUTH-01, AUTH-02, AUTH-03, AUTH-04

#### FR-AUTH-01: Email/Password Registration
- MUST: Accept email and password (min 8 chars, 1 uppercase, 1 number)
- MUST: Send verification email via Firebase Auth
- MUST: Show inline validation errors (never modal dialogs)
- MUST: Handle "email already exists" with "Want to sign in instead?" CTA
- MUST: Create local SQLite database on successful registration
- AC: User can register, receive verification email, and access the app within 30 seconds

#### FR-AUTH-02: Google OAuth
- MUST: Implement Google Sign-In via `expo-auth-session` + Firebase Auth
- MUST: Handle first-time Google sign-in as registration (create local DB)
- MUST: Handle returning Google sign-in as login (hydrate from Firestore if available)
- AC: Google sign-in completes in < 5 seconds on stable connection

#### FR-AUTH-03: Biometric Lock
- MUST: Use `expo-local-authentication` for device biometric check
- MUST: Show biometric capability label ("Fingerprint Available" / "Face ID Available")
- MUST: Gracefully fall back to device PIN/passcode if biometric hardware unavailable
- MUST: Configurable timeout: 30s / 1min / 5min / 15min / Never
- MUST: Biometric is an app lock, NOT an authentication method (Firebase Auth remains the auth provider)
- AC: Biometric prompt appears within 150ms of app foreground when enabled

#### FR-AUTH-04: Session Management
- MUST: Persist Firebase Auth session across app restarts
- MUST: Auto-refresh expired tokens
- MUST: On sign-out: clear Zustand stores, close SQLite connection (do NOT delete local DB unless explicitly requested)
- AC: User remains signed in across app restarts until explicit sign-out

---

### 5.2 FR-ONB: Onboarding

**Screen refs:** ONB-01, ONB-02, ONB-03

#### FR-ONB-01: 3-Screen Onboarding Flow
- MUST: Screen 1 — Welcome with ManjeCharacter (`wave` mood, xl size) + "Let's get started" CTA
- MUST: Screen 2 — Currency selection. MWK pre-selected. Allow USD as secondary [future].
- MUST: Screen 3 — Monthly income range picker (optional). Ranges: "Under MWK 50,000", "MWK 50,000–100,000", "MWK 100,000–200,000", "MWK 200,000–500,000", "Over MWK 500,000", "Prefer not to say"
- MUST: "Skip" option available on all screens
- MUST: On completion: mark `onboardingComplete: true` in user settings
- AC: Full onboarding completes in < 60 seconds; skip path < 10 seconds

---

### 5.3 FR-DASH: Dashboard

**Screen ref:** DASH-01

#### FR-DASH-01: Available to Spend Hero
- MUST: Display "Available to Spend" using `heroMetric` typography
- MUST: Calculate as: (Budget total for period) − (Sum of expenses in period)
- MUST: If no budget exists: show total income − total expenses for current month
- MUST: Colour-coded progress bar (green/yellow/red per §4.7 of Design System)
- MUST: Tap → navigates to budget overview (BUD-02)
- AC: Number updates within 500ms of a transaction being saved

#### FR-DASH-02: ManjeCharacter
- MUST: Display ManjeCharacter at `lg` (150px) size
- MUST: P0 moods: `wave` (first open of day), `happy` (budget < 75%), `concern` (budget > 90%)
- MUST: Idle float animation (Y: 0 → −6px → 0, 2000ms sinusoidal loop)
- MUST: Respect `AccessibilityInfo.isReduceMotionEnabled` — static on reduce motion
- MUST: Tap ManjeCharacter → placeholder for AI chat (P1) with toast "Coming soon!"
- AC: Correct mood displays within 1 second of dashboard mount

#### FR-DASH-03: Smart Insight Card
- MUST: Display one AI-generated insight (or canned fallback) per day
- MUST: Include ManjeMood badge
- MUST: Canned insights for P0 (no AI call): "You've spent MWK X this week — Y% of your budget" / "Your top category is Z" / "You've logged N transactions this week — keep it up!"
- AC: Insight card visible on dashboard load without additional API call

#### FR-DASH-04: Top 3 Spending Categories
- MUST: Show top 3 categories by spend amount in current budget period
- MUST: Each shows: category name, amount spent, progress bar, % of limit
- MUST: Tap category → BUD-05 Category Detail
- AC: Categories reflect all transactions in current period

#### FR-DASH-05: Primary Goal Snippet
- MUST: Show active goal (if exists): name, progress bar, saved/target, projected date
- MUST: If no goal: show empty state with "Add a Goal" CTA → GOAL-02
- AC: Goal progress reflects latest contributions within 500ms

#### FR-DASH-06: Pull to Refresh
- MUST: Pull-down triggers: re-query SQLite, trigger sync (if online)
- MUST: Show refresh indicator during operation
- AC: Refresh completes in < 2 seconds (offline) / < 5 seconds (online with sync)

---

### 5.4 FR-TXN: Transactions

**Screen refs:** TXN-03, TXN-02, ACT-01, NAV-01

#### FR-TXN-01: Quick Add Modal (NAV-01)
- MUST: Centre tab button opens bottom sheet (not a new screen)
- MUST: 4 action tiles: Add Transaction, Add Budget, Add Goal, Chat with Manje [P1 placeholder]
- MUST: Dismiss by tapping scrim or dragging down
- AC: Modal appears within 200ms of tab press

#### FR-TXN-02: Add Transaction Screen (TXN-03)
- MUST: Type selector: Expense | Income | Transfer (3 pills)
- MUST: Amount input with numeric keyboard, MWK prefix
- MUST: Merchant/payee text input
- MUST: AI category suggestion displayed below merchant field as user types (debounced 500ms)
- MUST: Category selector (tap to open full picker as bottom sheet)
- MUST: Date field (defaults to today; tap for date picker)
- MUST: Notes input (optional, single line)
- MUST: Recurring toggle (flag stored, no auto-creation in P0)
- MUST: "Save Transaction" CTA — full width, disabled until amount > 0
- MUST: Save writes to SQLite immediately (offline-safe)
- MUST: On save with unsaved changes + back press: "Discard changes?" confirmation
- AC: Typical expense entry completes in < 15 seconds
- AC: Transaction appears in activity feed within 500ms of save

#### FR-TXN-03: AI Category Suggestion
- MUST: On merchant input change (debounced 500ms): send merchant name to AI categorisation endpoint
- MUST: Display suggestion with confidence badge (High > 0.8, Medium 0.5–0.8, Low < 0.5)
- MUST: User can accept suggestion (tap) or override (open full picker)
- MUST: When offline: use keyword-based fallback (local dictionary of merchant → category mappings)
- MUST: Log all user corrections (accepted, overridden to X) for future model improvement
- AC: AI suggestion appears within 2 seconds of merchant input pause (online)
- AC: Keyword fallback provides suggestion within 100ms (offline)

#### FR-TXN-04: Activity Feed (ACT-01)
- MUST: FlatList (never ScrollView + map) of transactions, most recent first
- MUST: Section headers by date
- MUST: Each row: category emoji, merchant name, amount (green for income, red for expense), date
- MUST: Filter pills: All | Expenses | Income | Transfer
- MUST: Search by merchant name or notes
- MUST: Swipe left on row → Edit / Delete actions
- MUST: Delete requires confirmation modal
- MUST: Pull to refresh
- AC: Feed loads 50 most recent transactions in < 500ms
- AC: Scroll performance: 60fps on mid-range Android device

#### FR-TXN-05: Transaction Detail (TXN-02)
- MUST: Display all transaction fields (type, amount, merchant, category, date, notes, recurring flag)
- MUST: "Edit" button → opens TXN-03 pre-filled
- MUST: "Delete" button → confirmation → delete from SQLite → queue sync
- AC: Detail screen loads in < 300ms

---

### 5.5 FR-BUD: Budget

**Screen refs:** BUD-02, BUD-03, BUD-04, BUD-05

#### FR-BUD-01: Budget Creation — AI Assisted (Simplified P0)
- MUST: 4-step conversational flow (simplified from full 8-step in P1):
  1. "What's your monthly income?" — amount input
  2. "What are your fixed costs?" — add items (rent, ESCOM, etc.) with amounts
  3. "How much would you like to save?" — amount or percentage
  4. "Let's split the rest" — AI suggests category splits for remaining amount; user adjusts
- MUST: ManjeCharacter visible in `happy` mood throughout
- MUST: Final confirmation screen showing full budget summary
- MUST: Save creates budget in SQLite with all categories
- AC: Budget creation completes in < 3 minutes for typical user

#### FR-BUD-02: Manual Budget Creation (BUD-04)
- MUST: Form-based alternative to AI flow
- MUST: Add budget name, period (weekly/bi-weekly/monthly), total limit
- MUST: Add categories with individual limits
- MUST: Validate that category limits sum ≤ total limit (warning, not block)
- AC: Manual budget creation completes in < 2 minutes

#### FR-BUD-03: Budget Overview (BUD-02)
- MUST: Show budget period, total spent / total limit
- MUST: List all categories with: name, icon, spent amount, limit, progress bar, health colour
- MUST: Progress bar colours per Design System §4.7 (green < 75%, yellow 75–89%, red 90%+)
- MUST: Tap category → BUD-05 Category Detail
- AC: Budget overview reflects all transactions in current period within 500ms

#### FR-BUD-04: Category Detail (BUD-05)
- MUST: Category name, icon, budget limit
- MUST: Large spend amount + "of MWK X limit" label
- MUST: Progress bar with health colour
- MUST: "Amount remaining: MWK X" or "Over by MWK X" label
- MUST: Transaction list for this category in this period
- MUST: "Adjust Limit" inline edit
- MUST: Tap transaction → TXN-02 detail
- AC: Loads in < 300ms with up to 100 category transactions

---

### 5.6 FR-GOAL: Savings Goal

**Screen refs:** GOAL-02, GOAL-03

#### FR-GOAL-01: Create Goal (GOAL-02)
- MUST: Name, target amount (MWK), target date (optional), initial contribution (optional)
- MUST: Show "MWK X / month needed" calculation if target date provided
- MUST: Save to SQLite
- AC: Goal creation in < 30 seconds

#### FR-GOAL-02: Goal Detail (GOAL-03)
- MUST: Progress bar (saved / target)
- MUST: Percentage complete
- MUST: "Add Contribution" CTA → GOAL-04 modal (amount + optional note)
- MUST: Contribution history list
- MUST: If target date set: on-track / behind pace indicator
- AC: Goal updates within 500ms of contribution save

---

### 5.7 FR-SET: Settings

**Screen refs:** YOU-01, SET-01 to SET-09

#### FR-SET-01: Settings Hub (YOU-01)
- MUST: Profile section (name, email — read-only in P0)
- MUST: Settings list: Notifications, Security, Theme, Currency, About, Privacy Policy, Sign Out, Delete Account
- MUST: Goal snippet (if exists) with progress bar

#### FR-SET-02: Theme Toggle
- MUST: Light / Dark / System modes
- MUST: Apply Design System light/dark tokens immediately on toggle
- AC: Theme change applies within 200ms with no flash

#### FR-SET-03: Account Deletion (SET-09)
- MUST: High-friction 2-step process per IA spec
- MUST: Step 1 — Warning listing all data that will be deleted
- MUST: Step 2 — Type "DELETE" to confirm; button disabled until exact match
- MUST: On confirm: wipe local SQLite DB, delete encryption keys, delete Firestore user data, delete Firebase Auth account
- MUST: Navigate to AUTH-01 (fresh state) after deletion
- AC: Full deletion completes in < 10 seconds; no data remains on device or cloud

---

## 6. P1 Feature Requirements & Acceptance Criteria

*(Summary — detailed AC to be written at P1 planning)*

### FR-AI: AI Chat Assistant
- Full conversational interface (AI-01, AI-02)
- ManjeCharacter all 8 moods
- 30-message context window
- Action buttons in AI responses (navigate to budget/goal creation)
- Character-by-character text reveal (20ms delay)
- `thinking` mood + thinking pulse animation during API call
- Requires internet; show offline state gracefully

### FR-BILL: Bill Management
- Add recurring bills (name, amount, frequency, due date, category)
- Bill calendar view
- Push notification reminders (3 days before, 1 day before, due date)
- Mark paid modal
- Auto-creates expense transaction when marked paid

### FR-STREAK: Gamification
- Daily transaction logging streak counter
- Streak display on dashboard and You tab
- Milestone celebrations (7 days, 30 days, 100 days) with ManjeCharacter `celebrate` mood
- Streak breaks show `encourage` mood with recovery message

### FR-RPT: Weekly Report
- Auto-generated every Sunday
- Push notification: "Your weekly financial report is ready"
- Contents: income/expense totals, category breakdown, week-over-week comparison, AI summary
- ManjeCharacter mood based on budget health

### FR-EDU: Education Hub
- Curated article list (Malawi-specific financial education)
- Article detail with ManjeCharacter inline commentary
- Categories: Budgeting, Saving, Debt, Village Savings, Investing basics

---

## 7. Data Models

### 7.1 SQLite Schema (P0)

```sql
-- Users table (minimal — Firebase Auth is source of truth for auth)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,               -- Firebase Auth UID
  email TEXT NOT NULL,
  display_name TEXT,
  currency TEXT DEFAULT 'MWK',
  income_range TEXT,
  onboarding_complete INTEGER DEFAULT 0,
  theme TEXT DEFAULT 'system',       -- 'light' | 'dark' | 'system'
  biometric_enabled INTEGER DEFAULT 0,
  biometric_timeout INTEGER DEFAULT 60, -- seconds
  created_at TEXT NOT NULL,          -- ISO 8601
  updated_at TEXT NOT NULL
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,               -- UUID v4
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,                -- 'expense' | 'income' | 'transfer'
  amount REAL NOT NULL,              -- Always positive; type determines sign
  currency TEXT DEFAULT 'MWK',
  merchant TEXT,
  category TEXT NOT NULL,
  date TEXT NOT NULL,                -- ISO 8601 date
  notes TEXT,
  is_recurring INTEGER DEFAULT 0,
  ai_category_suggestion TEXT,       -- Original AI suggestion
  ai_confidence REAL,                -- 0.0–1.0
  user_overrode_category INTEGER DEFAULT 0,
  sync_status TEXT DEFAULT 'pending', -- 'pending' | 'synced' | 'conflict'
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,                   -- Soft delete
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_sync ON transactions(sync_status);

-- Budgets
CREATE TABLE IF NOT EXISTS budgets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  period TEXT NOT NULL,              -- 'weekly' | 'biweekly' | 'monthly'
  total_limit REAL NOT NULL,
  start_date TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  sync_status TEXT DEFAULT 'pending',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Budget Categories
CREATE TABLE IF NOT EXISTS budget_categories (
  id TEXT PRIMARY KEY,
  budget_id TEXT NOT NULL,
  category TEXT NOT NULL,
  limit_amount REAL NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE
);

-- Goals
CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  target_amount REAL NOT NULL,
  current_amount REAL DEFAULT 0,
  target_date TEXT,                  -- ISO 8601 date, nullable
  sync_status TEXT DEFAULT 'pending',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Goal Contributions
CREATE TABLE IF NOT EXISTS goal_contributions (
  id TEXT PRIMARY KEY,
  goal_id TEXT NOT NULL,
  amount REAL NOT NULL,
  note TEXT,
  date TEXT NOT NULL,
  sync_status TEXT DEFAULT 'pending',
  created_at TEXT NOT NULL,
  FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
);

-- Sync Queue
CREATE TABLE IF NOT EXISTS sync_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  operation TEXT NOT NULL,           -- 'insert' | 'update' | 'delete'
  payload TEXT NOT NULL,             -- JSON
  retry_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  last_attempted_at TEXT
);

-- App Settings (key-value store for misc settings)
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

### 7.2 Firestore Document Structure

```
users/{uid}/
  profile: { email, displayName, currency, incomeRange, onboardingComplete, createdAt, updatedAt }
  
users/{uid}/transactions/{txnId}
  { type, amount, currency, merchant, category, date, notes, isRecurring, createdAt, updatedAt }

users/{uid}/budgets/{budgetId}
  { name, period, totalLimit, startDate, isActive, categories: [...], createdAt, updatedAt }

users/{uid}/goals/{goalId}
  { name, targetAmount, currentAmount, targetDate, createdAt, updatedAt }

users/{uid}/goals/{goalId}/contributions/{contribId}
  { amount, note, date, createdAt }
```

### 7.3 Transaction Categories (P0 — Fixed Set)

```typescript
const TRANSACTION_CATEGORIES = [
  { id: 'groceries', label: 'Groceries', emoji: '🛒', color: '#22C55E' },
  { id: 'dining', label: 'Dining', emoji: '🍽️', color: '#F59E0B' },
  { id: 'transport', label: 'Transport', emoji: '🚌', color: '#3B82F6' },
  { id: 'utilities', label: 'Utilities', emoji: '💡', color: '#8B5CF6' },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎬', color: '#EC4899' },
  { id: 'healthcare', label: 'Healthcare', emoji: '💊', color: '#06B6D4' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️', color: '#F97316' },
  { id: 'bills', label: 'Bills', emoji: '📋', color: '#EF4444' },
  { id: 'education', label: 'Education', emoji: '📚', color: '#6366F1' },
  { id: 'income', label: 'Income', emoji: '💰', color: '#10B981' },
  { id: 'transfer', label: 'Transfer', emoji: '🔄', color: '#64748B' },
  { id: 'other', label: 'Other', emoji: '📦', color: '#94A3B8' },
] as const;
```

---

## 8. API Contracts

### 8.1 AI Categorisation Request

```
POST https://api.deepinfra.com/v1/openai/chat/completions
Authorization: Bearer {DEEPINFRA_API_KEY}

{
  "model": "meta-llama/Llama-3.3-70B-Instruct",
  "messages": [
    {
      "role": "system",
      "content": "You are a transaction categorisation engine for a personal finance app used in Malawi. Given a merchant name and transaction amount in MWK, return the most likely category. Categories: groceries, dining, transport, utilities, entertainment, healthcare, shopping, bills, education, income, transfer, other. Respond with JSON only: {\"category\": \"...\", \"confidence\": 0.0-1.0}"
    },
    {
      "role": "user",
      "content": "Merchant: \"Shoprite Lilongwe\", Amount: MWK 15,400"
    }
  ],
  "temperature": 0.1,
  "max_tokens": 50,
  "response_format": { "type": "json_object" }
}
```

**Expected response:**
```json
{
  "category": "groceries",
  "confidence": 0.95
}
```

### 8.2 AI Chat Request (P1)

```
POST https://api.deepinfra.com/v1/openai/chat/completions

{
  "model": "meta-llama/Llama-3.3-70B-Instruct",
  "messages": [
    {
      "role": "system",
      "content": "You are Manje, a warm, knowledgeable financial companion for people in Malawi. You speak in first person. You are encouraging, never shame the user. You understand MWK, village savings, mobile money, ESCOM bills, and local financial realities. Keep responses under 150 words. When you suggest an action, include an action_button JSON object. Respond with: {\"text\": \"...\", \"mood\": \"happy|concern|encourage|thinking\", \"action_button\": {\"label\": \"...\", \"route\": \"...\"} | null}"
    },
    // ... user financial context injected here ...
    // ... last 30 messages of conversation ...
  ],
  "temperature": 0.7,
  "max_tokens": 300
}
```

### 8.3 API Key Management
- MUST: Store `DEEPINFRA_API_KEY` in environment variables (`.env`), never in source code
- MUST: Use Expo's `expo-constants` to access env vars at runtime
- SHOULD: Implement request signing or a thin cloud function proxy in production to avoid exposing the API key in the mobile app binary
- **Recommended P1:** Firebase Cloud Function as API proxy — receives request from app, forwards to DeepInfra, returns response. This hides the API key entirely.

---

## 9. Security Requirements

### 9.1 Data at Rest
- MUST: SQLite encrypted with SQLCipher (AES-256-CBC)
- MUST: Encryption key generated via `expo-crypto.getRandomBytesAsync(32)` on first launch
- MUST: Key stored in `expo-secure-store` (iOS Keychain / Android Keystore)
- MUST: If key cannot be retrieved (device reset), prompt user to re-authenticate and re-sync from Firestore

### 9.2 Data in Transit
- MUST: All API calls over HTTPS (TLS 1.2+)
- MUST: Firebase SDK handles its own TLS
- MUST: DeepInfra API calls over HTTPS
- SHOULD: Certificate pinning for DeepInfra API endpoint

### 9.3 Authentication Security
- MUST: Firebase Auth token used for all cloud operations
- MUST: Biometric lock requires re-authentication after timeout
- MUST: Failed biometric attempts (5 consecutive) → fall back to device PIN
- MUST: Account deletion is irreversible and complete (see FR-SET-03)

### 9.4 Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 9.5 Sensitive Data Handling
- MUST: Never log transaction amounts, merchant names, or financial data to console in production
- MUST: Sentry error reporting must scrub financial data from error payloads
- MUST: AI API requests should not include user ID — only merchant + amount

---

## 10. Performance Requirements

| Metric | Target | Measurement |
|--------|--------|-------------|
| App cold start | < 3 seconds | Measured on Tecno Spark 10 (representative mid-range device) |
| App warm start | < 1 second | Time to interactive from background |
| Transaction save | < 500ms | Write to SQLite + UI update |
| Dashboard load | < 1 second | All widgets rendered with data |
| Activity feed scroll | 60fps | No frame drops on 100-item list |
| AI categorisation response | < 3 seconds | Network round-trip to DeepInfra |
| Sync batch | < 5 seconds | 50 pending changes synced to Firestore |
| SQLite query (transactions) | < 100ms | Query for current month's transactions |
| APK size | < 50MB | Including fonts and placeholder character assets |
| RAM usage | < 150MB | Steady state during normal use |
| Battery drain | < 5%/hour | Active use with sync enabled |

### 10.1 Performance Optimisation Guidelines
- Use `FlatList` with `getItemLayout` for all lists (fixed row height where possible)
- Implement `React.memo` on expensive card components
- Debounce AI categorisation requests (500ms)
- Lazy-load non-visible tab screens
- Precompute dashboard metrics in SQLite views or cached queries
- Limit Firestore reads: cache and compute locally first

---

## 11. Testing Strategy

### 11.1 Unit Tests (Jest)
- **Target coverage:** > 70% for `database/`, `services/`, `stores/`, `utils/`
- **Priority areas:** Currency formatting, budget calculations, sync conflict resolution, AI response parsing
- **Not required for P0:** UI component tests (focus on logic)

### 11.2 Integration Tests
- SQLite read/write/query cycles
- Sync engine: queue → batch → mock Firestore
- AI service: mock DeepInfra responses, test categorisation parsing and fallback
- Auth flow: mock Firebase Auth

### 11.3 E2E Tests (P1+)
- Use Detox (React Native E2E framework)
- Critical flows: registration → onboarding → add transaction → view dashboard → create budget

### 11.4 Manual QA Checklist (P0 Launch)
- [ ] Offline transaction entry (airplane mode)
- [ ] Sync recovery after reconnect
- [ ] Biometric lock/unlock cycle
- [ ] Budget progress bar accuracy
- [ ] Dark mode rendering (all screens)
- [ ] Account deletion completeness
- [ ] Low-memory device behaviour (2GB RAM)
- [ ] Accessibility: screen reader navigation of dashboard

---

## 12. DevOps & CI/CD

### 12.1 Build Pipeline
- **Tool:** EAS Build (Expo Application Services)
- **Environments:** `development`, `staging`, `production`
- **Triggers:** Push to `main` → staging build; Git tag `v*` → production build

### 12.2 OTA Updates
- **Tool:** EAS Update
- **Use:** Non-native code changes (JS bundle, assets) pushed without app store review
- **Constraint:** Never OTA-update native module changes

### 12.3 Environment Variables
```
DEEPINFRA_API_KEY=<secret>
FIREBASE_API_KEY=<project-key>
FIREBASE_AUTH_DOMAIN=<project>.firebaseapp.com
FIREBASE_PROJECT_ID=<project-id>
FIREBASE_STORAGE_BUCKET=<project>.appspot.com
FIREBASE_MESSAGING_SENDER_ID=<id>
FIREBASE_APP_ID=<app-id>
APP_ENV=development|staging|production
```

### 12.4 Release Checklist
- [ ] All P0 acceptance criteria pass
- [ ] Unit test suite green (> 70% coverage)
- [ ] Manual QA checklist complete
- [ ] Performance benchmarks met on target device
- [ ] Firestore security rules deployed
- [ ] Firebase Auth providers configured
- [ ] APK size < 50MB
- [ ] Privacy policy URL live
- [ ] Play Store listing prepared (screenshots, description, category)

---

## 13. Monitoring & Observability

### 13.1 Error Tracking
- **Tool:** Sentry (React Native SDK)
- **Configuration:** Capture unhandled exceptions, promise rejections, navigation errors
- **Scrubbing:** Remove all financial data (amounts, merchants, categories) from error payloads
- **Alert threshold:** > 1% crash rate triggers P0 alert

### 13.2 Analytics
- **Tool:** Firebase Analytics
- **Key events:**
  - `transaction_added` (type, category — no amount)
  - `budget_created` (method: ai | manual)
  - `goal_created`
  - `ai_categorisation_used` (accepted | overridden)
  - `ai_chat_message_sent` [P1]
  - `onboarding_completed` (skipped steps)
  - `theme_changed` (light | dark | system)
  - `biometric_enabled`
  - `sync_completed` (items_synced, duration_ms)
  - `sync_failed` (error_type)
  - `app_opened` (source: organic | notification)

### 13.3 AI Cost Monitoring
- Log every AI API call: timestamp, endpoint (categorise | chat), token_count_in, token_count_out, cost_estimate, latency_ms
- Dashboard: daily/weekly AI spend aggregated
- Alert: AI daily spend exceeds $10 (adjustable threshold)

### 13.4 Sync Health
- Track: sync queue depth, average sync latency, failure rate
- Alert: sync queue > 100 items (indicates persistent connectivity issue)

---

## 14. Engineering Guidelines

### 14.1 Code Style
- **Formatting:** Prettier with default config
- **Linting:** ESLint with `@react-native-community/eslint-config` + TypeScript rules
- **Naming:** PascalCase components, camelCase functions/variables, UPPER_SNAKE constants
- **File naming:** PascalCase for components (`ClayCard.tsx`), camelCase for utilities (`currency.ts`)

### 14.2 Git Workflow
- **Branching:** `main` (production), `develop` (staging), `feature/*`, `bugfix/*`
- **Commits:** Conventional Commits format (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`)
- **PRs:** Required review from 1 team member; must pass lint + tests
- **No force pushes** to `main` or `develop`

### 14.3 Key Principles
1. **SQLite first, always.** Every data operation writes to SQLite before anything else.
2. **Optimistic UI.** Update the UI immediately on user action; sync in the background.
3. **Fail gracefully.** Network failures, AI failures, sync failures — all must show user-friendly messages, never crash.
4. **Design System compliance.** No hardcoded hex colours, font sizes, or spacing values. Use tokens from `theme/`.
5. **Accessibility from day one.** Every interactive element has `accessibilityLabel` and `accessibilityRole`.
6. **Financial amounts are never floats in display.** Use integer cents internally (MWK has no sub-units, so this is straightforward — store as integers, display as formatted strings).

### 14.4 Recommended Development Order (P0)

```
Week 1-2:   Project scaffolding, theme tokens, design system primitives
            (ClayCard, Button, Input, Typography components)
Week 2-3:   SQLite setup, schema, encryption, database module
Week 3-4:   Authentication (Firebase Auth + biometric)
Week 4-5:   Onboarding flow, navigation structure
Week 5-7:   Transaction entry + activity feed
Week 7-8:   AI categorisation service + offline fallback
Week 8-10:  Dashboard (all widgets, ManjeCharacter P0 moods)
Week 10-11: Budget creation (AI-assisted + manual) + budget overview
Week 11-12: Savings goal
Week 12-13: Settings, account deletion, push notifications
Week 13-14: Sync engine + Firestore integration
Week 14-16: QA, performance optimisation, polish, launch prep
```

---

## Appendix: Decision Log

| # | Decision | Date | Rationale | Alternatives Considered |
|---|----------|------|-----------|------------------------|
| D1 | React Native + Expo over Flutter | July 2025 | Larger TS developer pool; better Firebase/SQLite integration; Expo managed workflow reduces ops | Flutter (Dart less common), Native (2 codebases) |
| D2 | SQLite + SQLCipher over WatermelonDB | July 2025 | Direct control; fewer abstractions; SQLCipher encryption is battle-tested | WatermelonDB (adds sync opinions), Realm (MongoDB dependency) |
| D3 | Zustand over Redux | July 2025 | Minimal boilerplate; excellent TS support; sufficient for app complexity | Redux Toolkit (heavier), MobX (different paradigm) |
| D4 | Firebase over Supabase | July 2025 | Superior mobile offline SDK; real-time listeners for VSLA; fully managed; generous free tier | Supabase (better SQL, worse mobile offline) |
| D5 | DeepInfra + Llama 3.3 over OpenAI | July 2025 | 3–5× cheaper; open-source model; adequate multilingual performance; OpenAI-compatible API | OpenAI GPT-4 (better quality, much more expensive), Anthropic Claude (similar trade-off) |
| D6 | Expo Router over React Navigation standalone | July 2025 | File-based routing; deep linking built-in; better Expo integration | React Navigation (more manual but more control) |
| D7 | P0 scope excludes AI chat | July 2025 | Chat is high-cost and complex; validate basic budgeting value first; AI categorisation ships in P0 | Ship AI chat in P0 (too much scope) |
| D8 | Freemium monetisation | July 2025 | Industry standard; allows free adoption → premium conversion; validated by Cleo, PocketGuard | Paid-only (limits adoption), Ad-supported (bad UX for finance) |
| D9 | Android-first | July 2025 | ~80% of Malawian smartphones are Android; iOS secondary market | iOS-first (wrong market), Simultaneous (spreads QA resources) |
| D10 | No custom backend in P0 | July 2025 | Firebase serverless reduces ops; team is lean; custom backend can be added in P2 if needed | Express/Node backend (more control, more ops burden) |

---

*End of Technical PRD v1.0*
