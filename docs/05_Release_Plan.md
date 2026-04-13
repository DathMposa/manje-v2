# Manje — Release Plan (Jira Format)
**Version:** 1.0 | **Date:** April 2026 | **Aligned with:** Refined PVD v2.0, Technical PRD v1.0, IA v2.0

---

## Document Purpose

This document provides a **Jira-ready release plan** for Manje, organized by phase (P0–P3). Each phase contains:
- **Initiatives** (high-level strategic goals)
- **Epics** (feature domains)
- **User Stories** with acceptance criteria, story points, dependencies, and sprint mapping

**Conventions:**
- Story points use Fibonacci scale: 1, 2, 3, 5, 8, 13
- Priority: **Must** (required for phase), **Should** (high value), **Could** (nice-to-have)
- Sprint duration: 2 weeks
- Screen IDs reference `Manje_IA_and_User_Flows.md` v2.0

---

## Phase Summary

| Phase | Timeline | Goal | Epics | Stories |
|-------|----------|------|-------|---------|
| **P0 (MVP)** | Months 1–4 | Validate core value proposition | 8 | 45 |
| **P1 (Core Expansion)** | Months 4–7 | Deepen engagement, full AI | 7 | 38 |
| **P2 (Social & Advanced)** | Months 8–14 | Network effects, advanced tools | 6 | 42 |
| **P3 (Marketplace)** | Months 15+ | Platform expansion, new revenue | 4 | 24 |

---

# P0: MVP — Months 1–4 (16 weeks)

## Initiative: P0-INIT-01 — Validate Core Value Proposition
**Goal:** Can users consistently log transactions and benefit from AI-powered budget insights?

---

## Epic: P0-E01 — Authentication & Security
**Description:** Secure user registration, login, and session management.
**Screens:** AUTH-01 to AUTH-06

### User Stories

#### P0-E01-S01: New User Registration
**As a** new user  
**I want to** create an account with email and password  
**So that** I can securely access my financial data

**Acceptance Criteria:**
- [ ] Given I am on AUTH-01, when I tap "Create Account", then I see AUTH-02 Sign Up form
- [ ] Given I enter valid email, name, and password (min 8 chars), when I tap "Create Account", then Firebase Auth creates my account
- [ ] Given email is already registered, when I submit, then I see inline error "Email already in use"
- [ ] Given password is weak, when I submit, then I see inline error with requirements

**Story Points:** 5  
**Priority:** Must  
**Dependencies:** None  
**Sprint:** 1

---

#### P0-E01-S02: Google OAuth Sign-In
**As a** user  
**I want to** sign in with my Google account  
**So that** I don't need to remember another password

**Acceptance Criteria:**
- [ ] Given I am on AUTH-02 or AUTH-03, when I tap "Continue with Google", then Google OAuth flow initiates
- [ ] Given OAuth succeeds, when I return to app, then I am navigated to onboarding (new) or dashboard (existing)
- [ ] Given OAuth fails, when I return to app, then I see error toast and remain on auth screen

**Story Points:** 3  
**Priority:** Must  
**Dependencies:** P0-E01-S01  
**Sprint:** 1

---

#### P0-E01-S03: Returning User Sign-In
**As a** returning user  
**I want to** sign in with my credentials  
**So that** I can access my existing data

**Acceptance Criteria:**
- [ ] Given I am on AUTH-03, when I enter valid credentials and tap "Sign In", then I am navigated to DASH-01
- [ ] Given credentials are invalid, when I submit, then I see inline error "Invalid email or password"
- [ ] Given I tap "Forgot Password", then I navigate to AUTH-04

**Story Points:** 3  
**Priority:** Must  
**Dependencies:** P0-E01-S01  
**Sprint:** 1

---

#### P0-E01-S04: Password Reset Flow
**As a** user who forgot my password  
**I want to** reset it via email  
**So that** I can regain access to my account

**Acceptance Criteria:**
- [ ] Given I am on AUTH-04, when I enter my email and tap "Send Reset Link", then Firebase sends reset email
- [ ] Given email is sent, when I tap link in email, then I am taken to AUTH-05 web page
- [ ] Given I set new password on AUTH-05, when I tap "Set Password", then app deep-links to AUTH-03 with success toast

**Story Points:** 3  
**Priority:** Must  
**Dependencies:** P0-E01-S01  
**Sprint:** 2

---

#### P0-E01-S05: Biometric Lock
**As a** security-conscious user  
**I want to** lock the app with fingerprint/face  
**So that** my financial data is protected if someone accesses my phone

**Acceptance Criteria:**
- [ ] Given biometric is enabled in SET-04, when app resumes after timeout, then AUTH-06 overlay appears
- [ ] Given I authenticate successfully, when biometric completes, then overlay dismisses and app resumes
- [ ] Given biometric fails 3 times, when I tap "Use PIN", then device passcode prompt appears
- [ ] Given timeout is set to 30s/1min/5min/15min, when app backgrounds for that duration, then lock triggers

**Story Points:** 5  
**Priority:** Must  
**Dependencies:** P0-E01-S01  
**Sprint:** 2

---

## Epic: P0-E02 — Onboarding
**Description:** First-time user setup flow (simplified 3-screen P0 version).
**Screens:** OB-02, OB-03, OB-07, OB-08

### User Stories

#### P0-E02-S01: Country & Currency Selection
**As a** new user  
**I want to** select my country and currency  
**So that** all amounts are displayed in my local currency

**Acceptance Criteria:**
- [ ] Given I complete registration, when I land on OB-02, then my country is auto-detected from device locale
- [ ] Given I select a country, when I tap "Confirm", then currency is auto-set (MWK for Malawi)
- [ ] Given I am on OB-03, when I tap currency field, then searchable list of 50+ currencies appears
- [ ] Given I confirm currency, when I tap "Use [MWK]", then I proceed to OB-08

**Story Points:** 3  
**Priority:** Must  
**Dependencies:** P0-E01-S01  
**Sprint:** 2

---

#### P0-E02-S02: Income Range Input (Optional)
**As a** new user  
**I want to** optionally share my income range  
**So that** Manje can provide more relevant insights

**Acceptance Criteria:**
- [ ] Given I am on OB-08, when I see income range options, then I can select one or tap "Skip"
- [ ] Given I select a range, when I tap "Continue", then income range is saved to profile
- [ ] Given I tap "Skip", when I proceed, then no income data is saved and I continue to OB-07

**Story Points:** 2  
**Priority:** Should  
**Dependencies:** P0-E02-S01  
**Sprint:** 2

---

#### P0-E02-S03: Onboarding Success Screen
**As a** new user  
**I want to** see a celebration when onboarding completes  
**So that** I feel welcomed and ready to start

**Acceptance Criteria:**
- [ ] Given I complete onboarding, when I land on OB-07, then ManjeCharacter celebrate animation plays
- [ ] Given animation completes, when I tap "Let's Go!", then I navigate to DASH-01
- [ ] Given I am on OB-07, then I see summary of what was set up (currency, income range if provided)

**Story Points:** 2  
**Priority:** Must  
**Dependencies:** P0-E02-S01, P0-E02-S02  
**Sprint:** 2

---

## Epic: P0-E03 — Dashboard
**Description:** Home screen with financial health overview.
**Screens:** DASH-01, NAV-02, NAV-03

### User Stories

#### P0-E03-S01: Available to Spend Hero
**As a** user  
**I want to** see my "Available to Spend" amount prominently  
**So that** I instantly know my financial position

**Acceptance Criteria:**
- [ ] Given I have a budget, when I view DASH-01, then "Available to Spend" shows (budget limit - spent this period)
- [ ] Given I have no budget, when I view DASH-01, then "Available to Spend" shows (income - expenses this month)
- [ ] Given amount is positive, when displayed, then text is green; if negative, text is red
- [ ] Given I tap the amount, when tapped, then I navigate to TXN-01 filtered by current period

**Story Points:** 5  
**Priority:** Must  
**Dependencies:** P0-E04 (Transactions), P0-E05 (Budget)  
**Sprint:** 4

---

#### P0-E03-S02: ManjeCharacter Mood Display
**As a** user  
**I want to** see ManjeCharacter's mood reflect my financial health  
**So that** I get an emotional cue about my spending

**Acceptance Criteria:**
- [ ] Given budget health > 50%, when I view DASH-01, then ManjeCharacter shows `happy` mood
- [ ] Given budget health 25-50%, when I view DASH-01, then ManjeCharacter shows `wave` mood
- [ ] Given budget health < 25%, when I view DASH-01, then ManjeCharacter shows `concern` mood
- [ ] Given I tap ManjeCharacter, when tapped, then I navigate to AI-02 (P1 — show placeholder in P0)

**Story Points:** 3  
**Priority:** Must  
**Dependencies:** P0-E05 (Budget)  
**Sprint:** 4

---

#### P0-E03-S03: Income & Spent Cards
**As a** user  
**I want to** see my month-to-date income and spending  
**So that** I can track my cash flow at a glance

**Acceptance Criteria:**
- [ ] Given I have transactions, when I view DASH-01, then Income card shows MTD income total
- [ ] Given I have transactions, when I view DASH-01, then Spent card shows MTD expense total
- [ ] Given I tap Income card, when tapped, then I navigate to TXN-01 filtered by income type
- [ ] Given I tap Spent card, when tapped, then I navigate to TXN-01 filtered by expense type

**Story Points:** 3  
**Priority:** Must  
**Dependencies:** P0-E04 (Transactions)  
**Sprint:** 4

---

#### P0-E03-S04: Top Spending Categories
**As a** user  
**I want to** see my top 3 spending categories  
**So that** I know where my money is going

**Acceptance Criteria:**
- [ ] Given I have a budget, when I view DASH-01, then top 3 categories by spend are shown
- [ ] Given each category, when displayed, then I see name, amount spent, progress bar, % of limit
- [ ] Given I tap a category, when tapped, then I navigate to BUD-05 Category Detail (P1 — show BUD-02 in P0)
- [ ] Given no transactions, when I view DASH-01, then empty state shows "Start tracking to see categories"

**Story Points:** 3  
**Priority:** Must  
**Dependencies:** P0-E04, P0-E05  
**Sprint:** 5

---

#### P0-E03-S05: AI Insight Card
**As a** user  
**I want to** see a daily AI-generated insight  
**So that** I get actionable financial advice

**Acceptance Criteria:**
- [ ] Given I have transaction data, when I view DASH-01, then AI insight card shows one canned insight
- [ ] Given insight is displayed, when shown, then ManjeMood badge appears next to message
- [ ] Given I tap "Chat with Manje", when tapped, then I navigate to AI-02 (P1 — show "Coming Soon" in P0)
- [ ] Given no data, when I view DASH-01, then insight card shows onboarding tip

**Story Points:** 5  
**Priority:** Should  
**Dependencies:** P0-E04, P0-E07 (AI Categorisation)  
**Sprint:** 6

---

#### P0-E03-S06: Goal Snippet
**As a** user  
**I want to** see my primary goal progress on dashboard  
**So that** I stay motivated toward my savings target

**Acceptance Criteria:**
- [ ] Given I have a goal, when I view DASH-01, then goal snippet shows name, progress bar, saved/target
- [ ] Given I tap goal snippet, when tapped, then I navigate to GOAL-03 Goal Detail
- [ ] Given no goals, when I view DASH-01, then snippet shows "Set your first goal" CTA

**Story Points:** 3  
**Priority:** Must  
**Dependencies:** P0-E06 (Goals)  
**Sprint:** 5

---

#### P0-E03-S07: Notification Centre
**As a** user  
**I want to** view all my app notifications in one place  
**So that** I don't miss important alerts

**Acceptance Criteria:**
- [ ] Given I tap bell icon on DASH-01, when tapped, then I navigate to NAV-02 Notification Centre
- [ ] Given I have notifications, when I view NAV-02, then list shows recent notifications with timestamps
- [ ] Given I tap a notification, when tapped, then I navigate to relevant screen via deep link
- [ ] Given bell has unread count, when displayed, then badge shows count (max 9+)

**Story Points:** 5  
**Priority:** Should  
**Dependencies:** P0-E08 (Push Notifications)  
**Sprint:** 6

---

## Epic: P0-E04 — Transactions
**Description:** Manual transaction entry, viewing, and editing.
**Screens:** TXN-01 to TXN-04, ACT-01

### User Stories

#### P0-E04-S01: Add Expense Transaction
**As a** user  
**I want to** quickly log an expense  
**So that** I can track where my money goes

**Acceptance Criteria:**
- [ ] Given I tap + tab, when Quick Add Modal appears, then I tap "Add Transaction" → TXN-03
- [ ] Given I am on TXN-03, when "Expense" is selected by default, then I see amount, merchant, category, date, notes fields
- [ ] Given I enter amount and merchant, when I type merchant name, then AI category suggestion appears below field
- [ ] Given I tap "Save Transaction", when amount > 0, then transaction saves to SQLite and I return to previous screen
- [ ] Given save completes, when budget exists, then budget totals recalculate immediately

**Story Points:** 8  
**Priority:** Must  
**Dependencies:** P0-E07 (AI Categorisation)  
**Sprint:** 3

---

#### P0-E04-S02: Add Income Transaction
**As a** user  
**I want to** log my income  
**So that** I can see my full financial picture

**Acceptance Criteria:**
- [ ] Given I am on TXN-03, when I tap "Income" pill, then form updates — merchant becomes "Source"
- [ ] Given I enter amount and source, when I tap "Save Transaction", then income transaction saves
- [ ] Given save completes, when I view DASH-01, then income totals update immediately

**Story Points:** 3  
**Priority:** Must  
**Dependencies:** P0-E04-S01  
**Sprint:** 3

---

#### P0-E04-S03: Activity Feed
**As a** user  
**I want to** see all my transactions in chronological order  
**So that** I can review my spending history

**Acceptance Criteria:**
- [ ] Given I tap Activity tab, when I view ACT-01, then transactions show newest first
- [ ] Given I have transactions, when displayed, then each row shows: type icon, merchant/source, category, amount, date
- [ ] Given I tap a transaction row, when tapped, then I navigate to TXN-02 Transaction Detail
- [ ] Given I swipe left on a row, when swiped, then edit/delete quick actions appear

**Story Points:** 5  
**Priority:** Must  
**Dependencies:** P0-E04-S01  
**Sprint:** 3

---

#### P0-E04-S04: Transaction Detail View
**As a** user  
**I want to** view full details of a transaction  
**So that** I can verify or modify it

**Acceptance Criteria:**
- [ ] Given I tap a transaction in ACT-01, when I view TXN-02, then all fields display: type, amount, merchant, category, date, notes
- [ ] Given I tap Edit button, when tapped, then I navigate to TXN-04 with pre-filled form
- [ ] Given I tap Delete icon, when tapped, then confirmation modal appears

**Story Points:** 3  
**Priority:** Must  
**Dependencies:** P0-E04-S03  
**Sprint:** 3

---

#### P0-E04-S05: Edit Transaction
**As a** user  
**I want to** modify a transaction I entered incorrectly  
**So that** my records stay accurate

**Acceptance Criteria:**
- [ ] Given I am on TXN-04, when form loads, then all fields are pre-filled with current values
- [ ] Given I change any field, when I tap "Save Changes", then transaction updates in SQLite
- [ ] Given I change category, when saved, then budget totals recalculate for both old and new categories

**Story Points:** 3  
**Priority:** Must  
**Dependencies:** P0-E04-S04  
**Sprint:** 4

---

#### P0-E04-S06: Delete Transaction
**As a** user  
**I want to** delete an incorrect transaction  
**So that** my records are accurate

**Acceptance Criteria:**
- [ ] Given I tap delete on TXN-02, when confirmation modal appears, then I see "Delete this transaction? Cannot be undone."
- [ ] Given I tap "Delete", when confirmed, then transaction is removed from SQLite
- [ ] Given deletion completes, when I return to ACT-01, then transaction no longer appears
- [ ] Given I tap "Cancel", when tapped, then modal dismisses and transaction remains

**Story Points:** 2  
**Priority:** Must  
**Dependencies:** P0-E04-S04  
**Sprint:** 4

---

#### P0-E04-S07: Transaction Search & Filter
**As a** user  
**I want to** search and filter my transactions  
**So that** I can find specific entries quickly

**Acceptance Criteria:**
- [ ] Given I am on ACT-01 or TXN-01, when I tap search icon, then search field appears
- [ ] Given I type in search, when typing, then results filter by merchant/source name
- [ ] Given I tap filter icon, when tapped, then filter options appear: date range, category, type
- [ ] Given I apply filters, when applied, then list updates to show only matching transactions

**Story Points:** 5  
**Priority:** Should  
**Dependencies:** P0-E04-S03  
**Sprint:** 5

---

## Epic: P0-E05 — Budget Management
**Description:** Single budget creation and tracking.
**Screens:** BUD-01 to BUD-04, BUD-06

### User Stories

#### P0-E05-S01: Create Budget (AI-Assisted — Simplified)
**As a** user  
**I want to** create a budget with AI assistance  
**So that** I get a personalized spending plan

**Acceptance Criteria:**
- [ ] Given I tap "Add Budget" in Quick Add, when modal asks "AI-assisted or manual?", then I can choose AI
- [ ] Given I choose AI, when BUD-03 loads, then 4-step flow begins: income → fixed costs → savings target → discretionary split
- [ ] Given I complete all steps, when I tap "Save This Budget", then budget saves to SQLite
- [ ] Given budget saves, when I view BUD-02, then all categories with limits are displayed

**Story Points:** 13  
**Priority:** Must  
**Dependencies:** P0-E07 (AI)  
**Sprint:** 5-6

---

#### P0-E05-S02: Create Budget (Manual)
**As a** user  
**I want to** create a budget manually  
**So that** I have full control over my allocations

**Acceptance Criteria:**
- [ ] Given I choose "Manual" in budget creation, when BUD-04 loads, then I see form with income and category fields
- [ ] Given I enter income, when I add categories, then I can set name and limit for each
- [ ] Given I tap "Save Budget", when all required fields filled, then budget saves to SQLite
- [ ] Given budget saves, when I view BUD-01, then new budget appears in list

**Story Points:** 5  
**Priority:** Must  
**Dependencies:** None  
**Sprint:** 4

---

#### P0-E05-S03: Budget Overview
**As a** user  
**I want to** see my budget status at a glance  
**So that** I know if I'm on track

**Acceptance Criteria:**
- [ ] Given I have a budget, when I view BUD-02, then I see progress ring showing overall % used
- [ ] Given I view BUD-02, when categories load, then each shows: name, spent/limit, progress bar, health colour
- [ ] Given a category is > 75%, when displayed, then progress bar is yellow
- [ ] Given a category is > 100%, when displayed, then progress bar is red
- [ ] Given I tap a category, when tapped, then I navigate to BUD-05 (P1 — show transactions in P0)

**Story Points:** 5  
**Priority:** Must  
**Dependencies:** P0-E05-S01 or P0-E05-S02  
**Sprint:** 5

---

#### P0-E05-S04: Edit Budget
**As a** user  
**I want to** modify my budget  
**So that** I can adjust to changing circumstances

**Acceptance Criteria:**
- [ ] Given I am on BUD-02, when I tap Edit, then I navigate to BUD-06 with pre-filled form
- [ ] Given I change any category limit, when I tap "Save Changes", then budget updates in SQLite
- [ ] Given I add a new category, when saved, then category appears in BUD-02
- [ ] Given I remove a category, when saved, then category no longer appears (transactions remain uncategorized)

**Story Points:** 3  
**Priority:** Must  
**Dependencies:** P0-E05-S03  
**Sprint:** 5

---

#### P0-E05-S05: Budget Alerts
**As a** user  
**I want to** receive alerts when I'm overspending  
**So that** I can take corrective action

**Acceptance Criteria:**
- [ ] Given a category reaches 75%, when transaction saves, then in-app toast appears
- [ ] Given a category reaches 90%, when transaction saves, then push notification is queued
- [ ] Given a category reaches 100%, when transaction saves, then push notification with "over budget" message
- [ ] Given I tap notification, when tapped, then I deep-link to BUD-02 (P0) or BUD-05 (P1)

**Story Points:** 5  
**Priority:** Must  
**Dependencies:** P0-E05-S03, P0-E08 (Push)  
**Sprint:** 6

---

## Epic: P0-E06 — Goals & Savings
**Description:** Single savings goal creation and tracking.
**Screens:** GOAL-02 to GOAL-05

### User Stories

#### P0-E06-S01: Create Savings Goal
**As a** user  
**I want to** set a savings goal  
**So that** I can work toward a financial target

**Acceptance Criteria:**
- [ ] Given I tap "Add Goal" in Quick Add, when GOAL-02 loads, then I see form: type, name, target amount, deadline
- [ ] Given I enter target and deadline, when calculated, then required monthly contribution displays
- [ ] Given I tap "Create Goal", when saved, then goal appears in GOAL-03 at 0%
- [ ] Given goal saves, when I view DASH-01, then goal snippet updates

**Story Points:** 5  
**Priority:** Must  
**Dependencies:** None  
**Sprint:** 4

---

#### P0-E06-S02: Goal Detail View
**As a** user  
**I want to** see my goal progress  
**So that** I stay motivated

**Acceptance Criteria:**
- [ ] Given I tap goal snippet on DASH-01, when GOAL-03 loads, then I see: progress bar, saved/target, projected date
- [ ] Given I have contributions, when displayed, then contribution history shows below progress
- [ ] Given I tap "Add Contribution", when tapped, then GOAL-04 modal appears

**Story Points:** 3  
**Priority:** Must  
**Dependencies:** P0-E06-S01  
**Sprint:** 4

---

#### P0-E06-S03: Add Contribution
**As a** user  
**I want to** record money I've saved toward my goal  
**So that** my progress updates

**Acceptance Criteria:**
- [ ] Given I am on GOAL-04 modal, when I enter amount, then I can optionally add a note
- [ ] Given I tap "Add", when saved, then contribution records to SQLite
- [ ] Given contribution saves, when GOAL-03 refreshes, then progress bar animates to new percentage
- [ ] Given contribution saves, when projected date recalculates, then new date displays

**Story Points:** 3  
**Priority:** Must  
**Dependencies:** P0-E06-S02  
**Sprint:** 4

---

#### P0-E06-S04: Edit Goal
**As a** user  
**I want to** modify my goal  
**So that** I can adjust my target or timeline

**Acceptance Criteria:**
- [ ] Given I am on GOAL-03, when I tap Edit, then I navigate to GOAL-05 with pre-filled form
- [ ] Given I change target amount, when saved, then progress % recalculates
- [ ] Given I change deadline, when saved, then required monthly contribution recalculates

**Story Points:** 2  
**Priority:** Should  
**Dependencies:** P0-E06-S02  
**Sprint:** 5

---

## Epic: P0-E07 — AI Categorisation
**Description:** AI-powered transaction categorisation.
**Screens:** Integrated into TXN-03

### User Stories

#### P0-E07-S01: Real-time Category Suggestion
**As a** user  
**I want to** see AI-suggested categories as I type merchant names  
**So that** I can categorize transactions faster

**Acceptance Criteria:**
- [ ] Given I am on TXN-03, when I type merchant name, then AI suggestion appears below field within 500ms
- [ ] Given suggestion appears, when displayed, then confidence badge shows (high/medium/low)
- [ ] Given I tap suggestion, when tapped, then category field auto-fills
- [ ] Given I disagree, when I tap category field, then full category picker opens

**Story Points:** 8  
**Priority:** Must  
**Dependencies:** DeepInfra API integration  
**Sprint:** 3

---

#### P0-E07-S02: Offline Category Fallback
**As a** user  
**I want to** get category suggestions even when offline  
**So that** I can still log transactions quickly

**Acceptance Criteria:**
- [ ] Given I am offline, when I type merchant name, then keyword-based fallback suggests category
- [ ] Given fallback triggers, when displayed, then confidence badge shows "offline"
- [ ] Given I save transaction offline, when I reconnect, then AI re-categorizes and prompts if different

**Story Points:** 5  
**Priority:** Must  
**Dependencies:** P0-E07-S01  
**Sprint:** 4

---

#### P0-E07-S03: Category Learning
**As a** user  
**I want to** have my category corrections remembered  
**So that** AI improves over time

**Acceptance Criteria:**
- [ ] Given I override AI suggestion, when I save transaction, then merchant→category mapping stores locally
- [ ] Given I enter same merchant again, when typing, then my previous category shows first
- [ ] Given 3+ overrides for same merchant, when AI suggests, then my preference takes priority

**Story Points:** 5  
**Priority:** Should  
**Dependencies:** P0-E07-S01  
**Sprint:** 5

---

## Epic: P0-E08 — Settings & Infrastructure
**Description:** Core settings, offline support, and push notifications.
**Screens:** YOU-01, SET-01 to SET-04, SET-06, SET-09, SET-10

### User Stories

#### P0-E08-S01: Profile Settings
**As a** user  
**I want to** manage my profile  
**So that** my information stays current

**Acceptance Criteria:**
- [ ] Given I tap Settings on YOU-01, when I tap "Edit Profile", then SET-01 loads
- [ ] Given I am on SET-01, when I change display name, then name updates across app
- [ ] Given I am on SET-01, when I view email, then it shows as read-only

**Story Points:** 2  
**Priority:** Must  
**Dependencies:** P0-E01  
**Sprint:** 6

---

#### P0-E08-S02: Currency Settings
**As a** user  
**I want to** change my currency  
**So that** amounts display in my preferred currency

**Acceptance Criteria:**
- [ ] Given I am on SET-02, when I tap currency, then searchable currency list appears
- [ ] Given I select new currency, when confirmed, then all amounts in app convert and display in new currency
- [ ] Given currency changes, when I view transactions, then historical amounts show in new currency

**Story Points:** 3  
**Priority:** Must  
**Dependencies:** P0-E02  
**Sprint:** 6

---

#### P0-E08-S03: Notification Settings
**As a** user  
**I want to** control which notifications I receive  
**So that** I'm not overwhelmed

**Acceptance Criteria:**
- [ ] Given I am on SET-03, when I view toggles, then I see: daily reminder, budget alerts, goal reminders, weekly summary
- [ ] Given I toggle off a category, when saved, then those notifications stop
- [ ] Given I set reminder time, when saved, then daily reminder fires at that time

**Story Points:** 3  
**Priority:** Should  
**Dependencies:** P0-E08-S06 (Push)  
**Sprint:** 7

---

#### P0-E08-S04: Security Settings
**As a** user  
**I want to** configure app security  
**So that** my data is protected

**Acceptance Criteria:**
- [ ] Given I am on SET-04, when I view options, then I see: biometric toggle, timeout picker, encryption status
- [ ] Given I toggle biometric on, when system prompt appears, then I authenticate to confirm
- [ ] Given I select timeout, when saved, then app locks after that duration in background

**Story Points:** 3  
**Priority:** Must  
**Dependencies:** P0-E01-S05  
**Sprint:** 6

---

#### P0-E08-S05: Account Deletion
**As a** user  
**I want to** delete my account and all data  
**So that** I can exercise my data rights

**Acceptance Criteria:**
- [ ] Given I am on SET-06, when I tap "Delete My Account", then SET-09 Step 1 loads
- [ ] Given I read warning, when I tap "I Understand, Continue", then Step 2 loads
- [ ] Given I type "DELETE" exactly, when I tap "Permanently Delete", then all data wipes
- [ ] Given deletion completes, when app reloads, then AUTH-01 shows as fresh install

**Story Points:** 5  
**Priority:** Must  
**Dependencies:** P0-E01  
**Sprint:** 7

---

#### P0-E08-S06: Push Notifications
**As a** user  
**I want to** receive timely notifications  
**So that** I stay on top of my finances

**Acceptance Criteria:**
- [ ] Given I enable notifications in onboarding, when daily reminder time arrives, then push notification fires
- [ ] Given I have a budget alert, when triggered, then push notification delivers within 30 seconds
- [ ] Given I tap notification, when tapped, then app opens to relevant screen via deep link
- [ ] Given I am on Android, when notification arrives, then FCM delivers successfully

**Story Points:** 5  
**Priority:** Must  
**Dependencies:** Firebase Cloud Messaging setup  
**Sprint:** 6

---

#### P0-E08-S07: Offline Data Persistence
**As a** user  
**I want to** use the app fully offline  
**So that** I can track finances without internet

**Acceptance Criteria:**
- [ ] Given I am offline, when I add transaction, then it saves to SQLite immediately
- [ ] Given I am offline, when I view dashboard, then all data loads from local database
- [ ] Given I reconnect, when sync runs, then local changes push to Firestore
- [ ] Given sync conflict occurs, when resolved, then last-write-wins with server timestamp

**Story Points:** 8  
**Priority:** Must  
**Dependencies:** SQLite + Firestore setup  
**Sprint:** 2-3

---

#### P0-E08-S08: Data Encryption
**As a** user  
**I want to** have my local data encrypted  
**So that** my financial information is secure

**Acceptance Criteria:**
- [ ] Given app installs, when first launch, then SQLCipher encryption key generates
- [ ] Given key generates, when stored, then it saves to Expo Secure Store (Keychain/Keystore)
- [ ] Given database opens, when accessed, then SQLCipher decrypts transparently
- [ ] Given I view SET-04, when encryption status shows, then "Encrypted ✓" displays

**Story Points:** 5  
**Priority:** Must  
**Dependencies:** None  
**Sprint:** 2

---

## P0 Sprint Plan

| Sprint | Weeks | Focus | Stories |
|--------|-------|-------|---------|
| 1 | 1-2 | Auth foundation | P0-E01-S01, S02, S03 |
| 2 | 3-4 | Auth complete, Onboarding, Encryption | P0-E01-S04, S05, P0-E02-S01, S02, S03, P0-E08-S07, S08 |
| 3 | 5-6 | Transactions, AI Categorisation | P0-E04-S01, S02, S03, S04, P0-E07-S01 |
| 4 | 7-8 | Transactions complete, Goals, Manual Budget | P0-E04-S05, S06, P0-E06-S01, S02, S03, P0-E05-S02 |
| 5 | 9-10 | AI Budget, Budget Overview, Search | P0-E05-S01, S03, S04, P0-E04-S07, P0-E06-S04, P0-E07-S02, S03 |
| 6 | 11-12 | Dashboard, Notifications, Settings | P0-E03-S01, S02, S03, S04, S05, P0-E08-S01, S02, S04, S06 |
| 7 | 13-14 | Dashboard complete, Budget Alerts, Polish | P0-E03-S06, S07, P0-E05-S05, P0-E08-S03, S05 |
| 8 | 15-16 | QA, Bug fixes, Launch prep | Buffer sprint |

---

# P1: Core Expansion — Months 4–7

## Initiative: P1-INIT-01 — Deepen Engagement with Full AI Experience
**Goal:** Introduce full AI chat, bills management, gamification, and premium tier.

---

## Epic: P1-E01 — AI Chat Assistant
**Description:** Full conversational AI interface with ManjeCharacter.
**Screens:** AI-01 to AI-04

### User Stories

#### P1-E01-S01: AI Chat Home
**As a** user  
**I want to** access the AI assistant from a dedicated tab  
**So that** I can get financial guidance anytime

**Acceptance Criteria:**
- [ ] Given I tap Manje tab, when AI-01 loads, then ManjeCharacter hero displays with 4 quick action cards
- [ ] Given I tap a quick action card, when tapped, then relevant flow initiates
- [ ] Given I type a message, when sent, then I transition to AI-02 Active Chat

**Story Points:** 5  
**Priority:** Must  
**Dependencies:** P0 complete  
**Sprint:** P1-1

---

#### P1-E01-S02: Active Chat Conversation
**As a** user  
**I want to** have a natural conversation about my finances  
**So that** I get personalized advice

**Acceptance Criteria:**
- [ ] Given I send a message, when AI processes, then ManjeCharacter shows "thinking" mood
- [ ] Given AI responds, when displayed, then message bubble appears with ManjeMood badge
- [ ] Given AI suggests action, when displayed, then inline action button appears
- [ ] Given I tap action button, when tapped, then I navigate to relevant creation flow

**Story Points:** 13  
**Priority:** Must  
**Dependencies:** P1-E01-S01  
**Sprint:** P1-1, P1-2

---

#### P1-E01-S03: Chat Context & History
**As a** user  
**I want to** continue conversations across sessions  
**So that** AI remembers our previous discussions

**Acceptance Criteria:**
- [ ] Given I have previous chats, when I tap history icon, then AI-03 shows past sessions
- [ ] Given I tap a session, when loaded, then conversation resumes with context
- [ ] Given context window, when active, then AI holds last 30 messages

**Story Points:** 5  
**Priority:** Should  
**Dependencies:** P1-E01-S02  
**Sprint:** P1-2

---

#### P1-E01-S04: Full 8-Step AI Budget Creation
**As a** user  
**I want to** create a budget through detailed AI conversation  
**So that** I get a comprehensive spending plan

**Acceptance Criteria:**
- [ ] Given I start budget creation from AI, when AI-04 loads, then 8-step flow begins
- [ ] Given each step, when AI asks, then I respond naturally and AI adapts
- [ ] Given step 6 (Generate), when AI calculates, then budget preview card shows
- [ ] Given I request changes, when I say "less on dining", then AI adjusts conversationally

**Story Points:** 8  
**Priority:** Must  
**Dependencies:** P1-E01-S02  
**Sprint:** P1-2

---

#### P1-E01-S05: ManjeCharacter Full 8 Moods
**As a** user  
**I want to** see ManjeCharacter express all emotional states  
**So that** the app feels more alive and responsive

**Acceptance Criteria:**
- [ ] Given various contexts, when ManjeCharacter displays, then appropriate mood shows: wave, happy, thinking, concern, celebrate, encourage, sleep, error
- [ ] Given mood changes, when triggered, then Lottie animation plays smoothly
- [ ] Given contextual wardrobe, when special events, then ManjeCharacter wears relevant outfit

**Story Points:** 5  
**Priority:** Should  
**Dependencies:** P1-E01-S02  
**Sprint:** P1-3

---

## Epic: P1-E02 — Bills Management
**Description:** Recurring bill tracking and reminders.
**Screens:** BILL-01 to BILL-05

### User Stories

#### P1-E02-S01: Add Recurring Bill
**As a** user  
**I want to** track my recurring bills  
**So that** I never miss a payment

**Acceptance Criteria:**
- [ ] Given I tap + on BILL-01, when BILL-02 loads, then I see form: name, amount, due day, frequency, reminders
- [ ] Given I set variable amount, when toggled, then amount field shows "Varies"
- [ ] Given I save bill, when saved, then push notifications schedule for reminder days
- [ ] Given bill saves, when "Available to Spend" recalculates, then upcoming bills deduct

**Story Points:** 5  
**Priority:** Must  
**Dependencies:** P0 complete  
**Sprint:** P1-3

---

#### P1-E02-S02: Bills List & Calendar
**As a** user  
**I want to** see all my bills organized by due date  
**So that** I can plan my payments

**Acceptance Criteria:**
- [ ] Given I view BILL-01, when bills load, then sorted by next due date
- [ ] Given bill is due within 3 days, when displayed, then urgency colour is amber
- [ ] Given bill is overdue, when displayed, then urgency colour is red
- [ ] Given I tap "Paid" quick action, when tapped, then BILL-05 modal appears

**Story Points:** 5  
**Priority:** Must  
**Dependencies:** P1-E02-S01  
**Sprint:** P1-3

---

#### P1-E02-S03: Mark Bill Paid
**As a** user  
**I want to** record when I pay a bill  
**So that** my records stay accurate

**Acceptance Criteria:**
- [ ] Given I am on BILL-05 modal, when displayed, then bill name, amount (editable), date show
- [ ] Given I tap "Confirm Payment", when saved, then bill status → "Paid", next due advances
- [ ] Given bill is variable, when I edit amount, then actual amount records

**Story Points:** 3  
**Priority:** Must  
**Dependencies:** P1-E02-S02  
**Sprint:** P1-4

---

#### P1-E02-S04: Bill Reminders
**As a** user  
**I want to** receive reminders before bills are due  
**So that** I can prepare payment

**Acceptance Criteria:**
- [ ] Given bill has reminders set, when 3 days before due, then push notification fires
- [ ] Given I tap notification, when tapped, then I deep-link to BILL-01 with bill highlighted
- [ ] Given default reminders, when bill created, then 3-day, 1-day, day-of reminders set

**Story Points:** 3  
**Priority:** Must  
**Dependencies:** P1-E02-S01, P0-E08-S06  
**Sprint:** P1-4

---

## Epic: P1-E03 — Expanded Budget Features
**Description:** Multiple budgets, category detail, stored expenses.
**Screens:** BUD-05, BUD-07

### User Stories

#### P1-E03-S01: Budget Category Detail
**As a** user  
**I want to** drill into a specific budget category  
**So that** I can see what's driving my spending

**Acceptance Criteria:**
- [ ] Given I tap category on BUD-02, when BUD-05 loads, then I see: limit, spent, remaining, transactions
- [ ] Given I tap "Adjust Limit", when modal appears, then I can enter new limit
- [ ] Given I tap transaction, when tapped, then I navigate to TXN-02 to recategorize

**Story Points:** 5  
**Priority:** Must  
**Dependencies:** P0-E05  
**Sprint:** P1-4

---

#### P1-E03-S02: Multiple Budgets
**As a** user  
**I want to** create multiple budgets  
**So that** I can track different spending periods or scenarios

**Acceptance Criteria:**
- [ ] Given I have a budget, when I create another, then both appear in BUD-01
- [ ] Given multiple budgets exist, when I view BUD-01, then I can set one as primary
- [ ] Given primary budget, when DASH-01 calculates, then primary budget drives "Available to Spend"

**Story Points:** 5  
**Priority:** Should  
**Dependencies:** P0-E05  
**Sprint:** P1-5

---

#### P1-E03-S03: Stored Expenses
**As a** user  
**I want to** save recurring expense templates  
**So that** budget creation is faster

**Acceptance Criteria:**
- [ ] Given I am on BUD-07, when I view list, then saved recurring expenses show
- [ ] Given I add expense, when saved, then it appears in AI budget step 5 as quick-add
- [ ] Given I edit expense, when saved, then template updates for future budgets

**Story Points:** 3  
**Priority:** Could  
**Dependencies:** P1-E03-S01  
**Sprint:** P1-5

---

## Epic: P1-E04 — Multiple Goals & Milestones
**Description:** Goal carousel, milestone celebrations.
**Screens:** GOAL-01, GOAL-06

### User Stories

#### P1-E04-S01: Goals List
**As a** user  
**I want to** see all my goals in one place  
**So that** I can track multiple savings targets

**Acceptance Criteria:**
- [ ] Given I tap "View All Goals" on YOU-01, when GOAL-01 loads, then all goals display
- [ ] Given I have goals, when displayed, then summary stats show: total saved, active count
- [ ] Given I tap a goal, when tapped, then I navigate to GOAL-03

**Story Points:** 3  
**Priority:** Must  
**Dependencies:** P0-E06  
**Sprint:** P1-5

---

#### P1-E04-S02: Milestone Celebrations
**As a** user  
**I want to** celebrate when I hit goal milestones  
**So that** I stay motivated

**Acceptance Criteria:**
- [ ] Given contribution pushes goal to 25/50/75/100%, when saved, then GOAL-06 overlay fires
- [ ] Given GOAL-06 displays, when shown, then ManjeCharacter celebrate animation plays with confetti
- [ ] Given I tap "Keep Going!", when tapped, then overlay dismisses and I return to GOAL-03

**Story Points:** 5  
**Priority:** Should  
**Dependencies:** P1-E04-S01  
**Sprint:** P1-5

---

## Epic: P1-E05 — Gamification
**Description:** Daily logging streaks and achievements.

### User Stories

#### P1-E05-S01: Daily Logging Streak
**As a** user  
**I want to** see my transaction logging streak  
**So that** I'm motivated to log consistently

**Acceptance Criteria:**
- [ ] Given I log transaction today, when saved, then streak increments
- [ ] Given I miss a day, when next login, then streak resets to 0
- [ ] Given I view YOU-01, when streak displays, then badge shows current streak count

**Story Points:** 3  
**Priority:** Should  
**Dependencies:** P0-E04  
**Sprint:** P1-6

---

#### P1-E05-S02: Streak Milestones
**As a** user  
**I want to** earn badges for streak milestones  
**So that** I feel accomplished

**Acceptance Criteria:**
- [ ] Given I hit 7-day streak, when achieved, then celebration modal fires
- [ ] Given I hit 30-day streak, when achieved, then special badge unlocks
- [ ] Given I view profile, when badges display, then earned badges show with dates

**Story Points:** 3  
**Priority:** Could  
**Dependencies:** P1-E05-S01  
**Sprint:** P1-6

---

## Epic: P1-E06 — Analytics & Reports
**Description:** Weekly reports and spending trends.
**Screens:** RPT-01, RPT-02, RPT-04

### User Stories

#### P1-E06-S01: Weekly Financial Report
**As a** user  
**I want to** receive a weekly summary  
**So that** I can review my financial health

**Acceptance Criteria:**
- [ ] Given Sunday arrives, when report generates, then push notification fires
- [ ] Given I view RPT-01, when loaded, then I see: income/expenses, category breakdown, week-over-week comparison
- [ ] Given anomalies exist, when displayed, then highlighted with explanation
- [ ] Given I tap anomaly, when tapped, then I navigate to TXN-02 for that transaction

**Story Points:** 8  
**Priority:** Must  
**Dependencies:** P0-E04, P1-E01  
**Sprint:** P1-6

---

#### P1-E06-S02: Spending Trends
**As a** user  
**I want to** see my spending trends over time  
**So that** I can identify patterns

**Acceptance Criteria:**
- [ ] Given I view RPT-02, when loaded, then month-over-month trend charts display
- [ ] Given predictable spikes exist, when identified, then highlighted months show
- [ ] Given I tap a month, when tapped, then I see category breakdown for that month

**Story Points:** 5  
**Priority:** Should  
**Dependencies:** P1-E06-S01  
**Sprint:** P1-7

---

## Epic: P1-E07 — Education Hub
**Description:** Financial education content.
**Screens:** EDU-01, EDU-02

### User Stories

#### P1-E07-S01: Education Hub
**As a** user  
**I want to** access financial education content  
**So that** I can improve my money skills

**Acceptance Criteria:**
- [ ] Given I navigate to EDU-01, when loaded, then featured content displays
- [ ] Given content categories exist, when displayed, then I can filter by topic
- [ ] Given I tap content card, when tapped, then EDU-02 detail loads

**Story Points:** 5  
**Priority:** Should  
**Dependencies:** P1-E01  
**Sprint:** P1-7

---

#### P1-E07-S02: Content Detail
**As a** user  
**I want to** read full educational articles  
**So that** I can learn in depth

**Acceptance Criteria:**
- [ ] Given I am on EDU-02, when loaded, then full article displays with images
- [ ] Given external links exist, when tapped, then in-app browser opens
- [ ] Given I finish reading, when I tap back, then I return to EDU-01

**Story Points:** 3  
**Priority:** Should  
**Dependencies:** P1-E07-S01  
**Sprint:** P1-7

---

## Epic: P1-E08 — Premium Tier
**Description:** Subscription gating for advanced features.

### User Stories

#### P1-E08-S01: Premium Paywall
**As a** free user  
**I want to** see what premium offers  
**So that** I can decide whether to upgrade

**Acceptance Criteria:**
- [ ] Given I tap gated feature, when paywall displays, then I see premium benefits list
- [ ] Given I tap "Subscribe", when tapped, then native payment flow initiates
- [ ] Given I subscribe, when confirmed, then all premium features unlock

**Story Points:** 8  
**Priority:** Must  
**Dependencies:** P1-E01, P1-E06  
**Sprint:** P1-7

---

#### P1-E08-S02: Subscription Management
**As a** premium user  
**I want to** manage my subscription  
**So that** I can cancel or change plans

**Acceptance Criteria:**
- [ ] Given I am premium, when I view settings, then subscription status shows
- [ ] Given I tap "Manage Subscription", when tapped, then native subscription management opens
- [ ] Given I cancel, when effective, then features revert to free tier at period end

**Story Points:** 3  
**Priority:** Must  
**Dependencies:** P1-E08-S01  
**Sprint:** P1-8

---

## P1 Sprint Plan

| Sprint | Focus | Key Deliverables |
|--------|-------|------------------|
| P1-1 | AI Chat foundation | AI-01, AI-02 basic |
| P1-2 | AI Chat complete | AI-02 full, AI-03, AI-04 |
| P1-3 | Bills, ManjeCharacter moods | BILL-01, BILL-02, 8 moods |
| P1-4 | Bills complete, Budget detail | BILL-03-05, BUD-05 |
| P1-5 | Multiple budgets/goals, Milestones | BUD-07, GOAL-01, GOAL-06 |
| P1-6 | Gamification, Weekly report | Streaks, RPT-01 |
| P1-7 | Trends, Education, Premium | RPT-02, EDU-01-02, Paywall |
| P1-8 | Polish, Premium complete | Subscription management |

---

# P2: Social & Advanced — Months 8–14

## Initiative: P2-INIT-01 — Network Effects and Deeper Financial Tools
**Goal:** Village Savings, Debt tracking, Shared budgets, Web platform.

*(Epics and stories follow same format — abbreviated for document length)*

## Epics Overview

| Epic ID | Name | Stories | Key Screens |
|---------|------|---------|-------------|
| P2-E01 | Village Savings | 12 | VS-01 to VS-09 |
| P2-E02 | Debt & Loan Tracking | 8 | DEBT-01 to DEBT-06 |
| P2-E03 | Shared Budgets | 8 | SB-01 to SB-05, BUD-09, BUD-10 |
| P2-E04 | Monthly Summary & Export | 4 | RPT-03 |
| P2-E05 | Manje Web Platform | 10 | Web dashboard |
| P2-E06 | WhatsApp Integration | 4 | SET-08 |

---

# P3: Marketplace & Scale — Months 15+

## Initiative: P3-INIT-01 — Platform Expansion and New Revenue Streams
**Goal:** Human Financial Planner marketplace, Investment tracking, Multi-currency.

## Epics Overview

| Epic ID | Name | Stories | Key Screens |
|---------|------|---------|-------------|
| P3-E01 | Human Financial Planner | 12 | PL-01 to PL-08 |
| P3-E02 | Planner Portal (Web) | 6 | Planner dashboard |
| P3-E03 | Investment Tracker | 4 | EDU-03 to EDU-05 |
| P3-E04 | Multi-Currency & Advanced AI | 4 | Settings, AI |

---

## Screen-to-Phase Mapping Summary

| Phase | Screen Count | Screen IDs |
|-------|--------------|------------|
| **P0** | 32 | AUTH-01–06, OB-02, OB-03, OB-07, OB-08, DASH-01, ACT-01, NAV-01–03, TXN-01–04, BUD-01–04, BUD-06, GOAL-02–05, YOU-01, SET-01–04, SET-06, SET-09, SET-10 |
| **P1** | 22 | OB-01, OB-04–06, AI-01–04, BILL-01–05, BUD-05, BUD-07, GOAL-01, GOAL-06, RPT-01, RPT-02, RPT-04, EDU-01, EDU-02, EXP-01, EXP-02, SET-05, SET-07 |
| **P2** | 28 | TXN-05, TXN-06, BUD-08–10, GOAL-07, VS-01–09, DEBT-01–06, SB-01–05, RPT-03, EXP-03–05, SET-08 |
| **P3** | 13 | PL-01–08, EDU-03–05 |

---

## Appendix: Story Point Totals by Phase

| Phase | Total Story Points | Sprints | Velocity (avg) |
|-------|-------------------|---------|----------------|
| P0 | ~180 | 8 | 22-23 |
| P1 | ~140 | 8 | 17-18 |
| P2 | ~160 | 10 | 16 |
| P3 | ~100 | 8 | 12-13 |

---

*Document generated from Manje IA v2.0 and Refined PVD v2.0*
