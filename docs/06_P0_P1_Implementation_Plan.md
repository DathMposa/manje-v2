# Manje App - P0 & P1 Implementation Plan
**Date:** April 2026
**Status:** Planning Phase

## 1. Current State of Development
We have successfully delivered Phase 1 of the MVP (10 core UI screens) using Expo SDK 54, Expo Router, and React Native. The foundation includes:
* **"Hybrid Premium" Design System:** Claymorphism, gradients, and shadows.
* **Component Library:** `ClayCard`, `Button`, `Input`, `ScreenHeader`, and the `ManjeCharacter` (with 8 mood states and animations).
* **Completed Screens:** Welcome, Sign Up, Sign In, Country, Currency, Income Range, Success, Dashboard, Activity Feed, Quick Add Modal, Profile (partial), Budgets (placeholder).
* **Limitations:** The app is currently UI-only, utilizing mock data, with no backend or local persistence.

## 2. Screen Inventory & Remaining Scope

### A. Remaining P0 Scope (MVP Completion)
These screens form the critical path for a functional MVP.
* **Auth & Security:** Forgot Password (`AUTH-04`), Web Reset (`AUTH-05`), Biometric Lock (`AUTH-06`).
* **Navigation Details:** Notification Centre (`NAV-02`), Notification Detail (`NAV-03`).
* **Transactions:** Transactions List (`TXN-01`), Transaction Detail (`TXN-02`), Edit Transaction (`TXN-04`).
* **Budgets:** Budgets List (`BUD-01`), Budget Overview (`BUD-02`), AI Budget Chat (`BUD-03`), Manual Budget (`BUD-04`), Edit Budget (`BUD-06`).
* **Goals:** Create Goal (`GOAL-02`), Goal Detail (`GOAL-03`), Add Contribution (`GOAL-04`), Edit Goal (`GOAL-05`).
* **Profile & Settings:** Edit Profile (`SET-01`), Currency (`SET-02`), Notifications (`SET-03`), Security (`SET-04`), Data/Privacy (`SET-06`), Account Deletion (`SET-09`), Support (`SET-10`).

### B. P1 Scope (Core Expansion)
These screens introduce deeper engagement, AI tools, and monetization.
* **Onboarding Expansion:** Brand Story (`OB-01`), Permissions (`OB-04`), Notification Prefs (`OB-05`), Initial Goal Setting (`OB-06`).
* **AI Assistant:** Chat Home (`AI-01`), Active Chat (`AI-02`), Chat History (`AI-03`), AI Budget Chat (`AI-04`).
* **Bills Management:** Bills List (`BILL-01`), Create Bill (`BILL-02`), Bill Detail (`BILL-03`), Edit Bill (`BILL-04`), Mark Paid (`BILL-05`).
* **Analytics & Education:** Weekly Report (`RPT-01`), Spending Trends (`RPT-02`), Health Score (`RPT-04`), Education Hub (`EDU-01`), Content Detail (`EDU-02`).
* **Expansions:** Goals List (`GOAL-01`), Milestone Celebrations (`GOAL-06`), Category Detail (`BUD-05`), Stored Expenses (`BUD-07`), Transaction Review (`TXN-05`), Income Sources (`EXP-01`, `EXP-02`), Merchant Rules/Language (`SET-05`, `SET-07`).

---

## 3. Scrum Implementation Plan (Sprints 1-8)

### Sprint 1: Data Architecture & Persistence
**Goal:** Hook the existing UI to a real data layer.
* **Tasks:**
  * Setup SQLite with SQLCipher for local storage.
  * Initialize Zustand stores for Transactions, Budgets, and Goals.
  * Connect `TXN-03` (Quick Add) to save real data to SQLite.
  * Update `DASH-01` and `ACT-01` to pull from the SQLite store instead of mock data.
* **Deliverables:** Working local database; real transaction logging.

### Sprint 2: Remaining MVP Transaction & Goal Flows
**Goal:** Complete the P0 transaction and savings goals UI.
* **Tasks:**
  * Build `TXN-01` (List), `TXN-02` (Detail), and `TXN-04` (Edit).
  * Build `GOAL-02` (Create), `GOAL-03` (Detail), `GOAL-04` (Contribute), and `GOAL-05` (Edit).
  * Connect Goals UI to SQLite store.
* **Deliverables:** Users can fully manage transactions and track one savings goal.

### Sprint 3: Budgeting Engine (P0)
**Goal:** Implement the manual and simplified AI budget flows.
* **Tasks:**
  * Build `BUD-01` (List), `BUD-02` (Overview), `BUD-04` (Manual Setup), and `BUD-06` (Edit).
  * Implement the calculation logic to link Transactions to Budget categories.
  * Build `BUD-03` (AI Budget Chat - Simplified 4-step).
* **Deliverables:** Functional budgeting system reflecting real-time spend.

### Sprint 4: Security, Settings & P0 Polish
**Goal:** Finalize MVP screens and prepare for internal testing.
* **Tasks:**
  * Implement Biometric lock overlay (`AUTH-06`).
  * Build settings screens: Profile, Currency, Security, Privacy, Support (`SET-01`, `02`, `04`, `06`, `09`, `10`).
  * Finalize Firebase Auth integrations (Sign up/in logic hookups).
* **Deliverables:** Complete P0 Scope. App is ready for MVP User Validation.

### Sprint 5: Full AI Chat Integration (P1)
**Goal:** Introduce the DeepInfra AI assistant.
* **Tasks:**
  * Build `AI-01` (Home), `AI-02` (Active Chat), `AI-03` (History).
  * Integrate DeepInfra API for conversational AI.
  * Hook up ManjeCharacter mood changes based on AI sentiment context.
* **Deliverables:** Users can chat with Manje about their finances.

### Sprint 6: Bills Management (P1)
**Goal:** Allow users to track recurring bills.
* **Tasks:**
  * Build `BILL-01` through `BILL-05`.
  * Update Dashboard to show upcoming bills dynamically.
  * Integrate push notification scheduling (local notifications) for due dates.
* **Deliverables:** Complete recurring bills module.

### Sprint 7: Gamification & Analytics (P1)
**Goal:** Drive retention with streaks and reports.
* **Tasks:**
  * Build logging streak logic (Zustand) and display on `YOU-01`.
  * Build `GOAL-06` (Milestone overlays).
  * Build `RPT-01` (Weekly Report), `RPT-02` (Trends), and `RPT-04` (Health Score).
* **Deliverables:** Gamified UI and rich chart-based reports.

### Sprint 8: P1 Polish & Premium Infrastructure
**Goal:** Complete P1 and implement the subscription paywall.
* **Tasks:**
  * Build `EDU-01` and `EDU-02` (Education Hub).
  * Implement Premium Paywall logic for P1 features.
  * Expand settings (`SET-05`, `SET-07`) and Onboarding (`OB-01`, `04`, `05`, `06`).
* **Deliverables:** Complete P1 phase, ready for production rollout.