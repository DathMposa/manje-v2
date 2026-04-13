# Manje — Refined Product Vision Document
**Version:** 2.0 | **Date:** July 2025 | **Supersedes:** `Manje_Product_Vision_Document.md` v1.0  
**Status:** Draft for team review  
**Purpose:** Single source of truth for product vision, incorporating competitive analysis findings and concept critique recommendations.

> **What changed from v1.0:** This refined version adds competitive positioning, a monetisation framework, phased MVP definition, user validation requirements, risk mitigations, and a sharpened scope. The original PVD's vision, brand identity, and design principles remain intact — this document narrows the "what" and sequences the "when."

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Vision & Mission (Unchanged)](#2-vision--mission)
3. [Market Context & Competitive Position (NEW)](#3-market-context--competitive-position)
4. [Target Audience (Refined)](#4-target-audience)
5. [Product Surfaces (Refined)](#5-product-surfaces)
6. [Feature Architecture — Phased (Refined)](#6-feature-architecture--phased)
7. [Monetisation Framework (NEW)](#7-monetisation-framework)
8. [Data Architecture (Unchanged)](#8-data-architecture)
9. [Technology Stack (Unchanged)](#9-technology-stack)
10. [Integrations (Unchanged)](#10-integrations)
11. [Brand Identity (Unchanged)](#11-brand-identity)
12. [Privacy & Data Principles (Unchanged)](#12-privacy--data-principles)
13. [Success Metrics — Phased (Refined)](#13-success-metrics--phased)
14. [Product Roadmap — Phased (Refined)](#14-product-roadmap--phased)
15. [Risk Register (NEW)](#15-risk-register)
16. [User Validation Plan (NEW)](#16-user-validation-plan)
17. [Open Questions (Updated)](#17-open-questions)
18. [Constraints (Updated)](#18-constraints)
19. [Document Governance](#19-document-governance)

---

## 1. Executive Summary

Manje is an intelligent personal finance management application built specifically for the Malawian market and the broader Southern and Eastern African context. The name "Manje" — meaning "now" in Chichewa — reflects the product's core promise: give users an immediate, clear, and honest picture of their financial life with minimal friction.

**What's new in v2.0:**
- **Competitive validation:** Analysis of 12 competitor apps (6 African, 6 global) confirms Manje occupies a genuine whitespace — no product combines AI budgeting + offline-first + VSLA + cultural financial education.
- **Phased scope:** Features are now organised into P0 (MVP), P1, P2, and P3 with clear launch criteria.
- **Monetisation:** Freemium model defined with MWK-calibrated pricing.
- **Risk register:** Top 10 risks identified with mitigations.
- **Validation plan:** User research requirements before and during development.

> **The Manje Promise** (Unchanged)  
> "Know where your money is going. Know what to do next. Feel in control — right now."  
> Manje is not just a budgeting tool. It is a financial companion — built for how people in Malawi and the region actually live, earn, save, and borrow.

---

## 2. Vision & Mission

**Vision:** Every person in Malawi and Southern Africa has a clear, honest, and actionable understanding of their financial life — accessible anytime, anywhere, even offline.

**Mission:** Build the most culturally intelligent, privacy-respecting, and accessible personal finance platform for emerging markets, starting with Malawi.

*(No changes from v1.0 — the vision remains correct and validated by competitive analysis.)*

---

## 3. Market Context & Competitive Position (NEW)

### 3.1 Competitive Landscape Summary

| Category | Key Players | Manje's Advantage |
|----------|------------|-------------------|
| African mobile money | M-Pesa, MTN MoMo, Airtel Money | Manje is the intelligence layer on top — budgeting, goals, insights |
| African neobanks | Kuda, FairMoney, Chipper Cash | Deeper budgeting, AI assistant, offline-first, VSLA |
| African savings/investment | Cowrywise, PiggyVest, Risevest | Holistic PFM (not just savings); culturally grounded education |
| VSLA platforms | Ensibuuko (B2B), Mudzi Wathu | B2C consumer app; VSLA integrated into personal finance |
| Global budgeting leaders | YNAB, Monarch Money | Offline-first; MWK-native; VSLA; no Open Banking needed |
| Global AI finance | Cleo, PocketGuard | Visual character UX; deeper cultural localisation; offline |
| Global manual-entry budgeting | Goodbudget, BudgetBakers | AI-assisted categorisation; modern UI; African context |

### 3.2 Manje's Unique Position
**The only consumer app that combines:**
1. AI-driven financial companion (conversational + reactive character)
2. Offline-first architecture (works with no internet)
3. Village Savings (VSLA) management integrated into personal budgets
4. Culturally grounded financial education for Malawi/Southern Africa
5. Human financial planner marketplace (planned)

### 3.3 Key Competitive Insight
> African fintech apps focus on **transactions** (payments, transfers, loans). Global budgeting apps focus on **planning** (budgets, goals, tracking). **No app bridges both for emerging markets.** Manje bridges this gap with manual transaction logging + AI-powered financial planning + cultural context.

---

## 4. Target Audience

### 4.1 Primary Persona — "Thandi" (Unchanged)
- **Age:** 22–35
- **Location:** Urban Malawi (Lilongwe, Blantyre, Mzuzu)
- **Income:** MWK 80,000–250,000/month (mixed formal/informal)
- **Smartphone:** Android (80%+ market share), intermittent data
- **Financial behaviour:** Uses mobile money (Airtel/TNM), participates in a village savings group, has at least one recurring bill (ESCOM, rent), saves informally
- **Pain points:** No visibility into where money goes; surprised by bills; no budget system; feels guilt about spending; wants to save but doesn't know how

### 4.2 Secondary Persona — "Chimwemwe" (Village Savings Manager)
- **Age:** 30–50
- **Role:** Secretary or chairperson of a VSLA group (10–30 members)
- **Pain points:** Paper ledgers are error-prone; members dispute contributions; difficult to track who paid; rotation schedule confusion
- **Need:** Digital record that all members can see; reduces disputes; builds trust

### 4.3 Tertiary Persona — "Daniel" (Aspirational Saver)
- **Age:** 25–40
- **Income:** MWK 150,000–500,000/month (formal employment)
- **Need:** Wants to build financial discipline, save for specific goals (house, car, education), understand debt
- **Current tools:** Spreadsheets or nothing

### 4.4 User Validation Required (NEW)
Before P0 launch, the following must be validated with 10–15 interviews per persona:
- [ ] Transaction logging frequency willingness (daily? weekly?)
- [ ] AI assistant value perception (would they chat about money?)
- [ ] Willingness to pay for premium features (at MWK 1,500 and 2,500 price points)
- [ ] ManjeCharacter perception (trustworthy? childish? engaging?)
- [ ] VSLA digital adoption barriers for group managers

---

## 5. Product Surfaces (Refined)

| Surface | Phase | Stack | Purpose |
|---------|-------|-------|---------|
| **Manje Mobile** | P0 (MVP) | React Native + Expo SDK | Primary product. Android-first. |
| **Manje Landing** | P0 (MVP) | Next.js static | Waitlist, marketing, app store redirect |
| **Manje Web** | P2 | Next.js | Dashboard companion for desktop users |
| **Manje Planner Portal** | P3 | Next.js | Planner-facing tool for managing clients |

**Change from v1.0:** Web platform deferred from Baseline to P2. Planner portal added as P3.  
**Rationale:** Achieve product-market fit on mobile before investing in multi-surface. Landing page is sufficient for web presence during P0/P1.

---

## 6. Feature Architecture — Phased (Refined)

### 6.1 Phase P0: MVP — Target 3–4 Months
**Goal:** Validate core value proposition — "Can users consistently log transactions and benefit from AI-powered budget insights?"

| # | Feature | Scope |
|---|---------|-------|
| 1 | **Authentication** | Email/password + Google OAuth. Biometric lock (device-level). |
| 2 | **Onboarding** | 3-screen flow: welcome → currency selection (MWK default) → income range (optional). Skip option. |
| 3 | **Dashboard (DASH-01)** | "Available to Spend" hero metric, ManjeCharacter (3 moods: `wave`, `happy`, `concern`), top spending categories, AI insight card (1 canned insight daily). |
| 4 | **Transaction Entry (TXN-03)** | Expense / Income / Transfer. Manual entry with amount, merchant, category (AI-suggested), date, notes. Target: <15 seconds per transaction. |
| 5 | **Activity Feed (ACT-01)** | Chronological transaction list with search/filter by category and date. Swipe to edit/delete. |
| 6 | **Budget Creation** | Single budget with AI-assisted flow (simplified 4-step: income → fixed costs → savings target → discretionary split). Also support manual creation. |
| 7 | **Budget Overview (BUD-02)** | Category list with progress bars, spent/limit, health colours. Tap for category detail. |
| 8 | **AI Categorisation** | On transaction save: send merchant name to AI, receive category suggestion with confidence score. Keyword fallback when offline. |
| 9 | **One Savings Goal** | Name, target amount, deadline, manual contributions, progress bar. |
| 10 | **Basic Settings** | Profile, currency, notification preferences, biometric toggle, theme (light/dark), logout, account deletion. |
| 11 | **Offline Support** | All features except AI chat work fully offline. SQLite-first. Sync on reconnect. |
| 12 | **Push Notifications** | Daily reminder to log transactions; weekly budget summary notification. |

**Explicitly excluded from P0:**
- AI Chat (full conversational assistant)
- Bill management
- Village Savings
- Debt/Loan tracking
- Human Financial Planner
- Shared/Household budgets
- Education Hub
- Gamification/Streaks
- Analytics reports (weekly/monthly)
- WhatsApp integration
- Apple Sign-In
- Web platform

### 6.2 Phase P1: Core Expansion — Months 4–7
**Goal:** Deepen engagement and introduce the full AI experience.

| # | Feature |
|---|---------|
| 1 | **AI Chat Assistant (AI-01, AI-02)** — Full conversational interface with ManjeCharacter. All 8 moods. Context window of 30 messages. |
| 2 | **Bill Management (BILL-01 to BILL-05)** — Add recurring bills, due date reminders, mark paid, bill calendar. |
| 3 | **Expanded Budget Features** — Multiple budgets, AI-assisted creation (full 8-step flow), budget rollover, category detail (BUD-05). |
| 4 | **Multiple Savings Goals** — Goal carousel on You tab, milestone celebrations. |
| 5 | **Gamification** — Daily logging streak, streak milestones, ManjeCharacter celebrate mood. |
| 6 | **Weekly Analytics Report (RPT-01)** — Auto-generated weekly summary with AI insights. |
| 7 | **Education Hub (EDU-01, EDU-02)** — Curated Malawi-specific financial education content (articles, tips). |
| 8 | **ManjeCharacter Full Moods** — All 8 moods with contextual wardrobe, Lottie animations. |
| 9 | **Premium Tier Launch** — Introduce paid subscription gating AI chat, advanced analytics, multiple goals. |

### 6.3 Phase P2: Social & Advanced — Months 8–14
**Goal:** Network effects and deeper financial tools.

| # | Feature |
|---|---------|
| 1 | **Village Savings (VS-01 to VS-08)** — Group creation, join via invite, contribution tracking, rotation schedule, manager dashboard, Firestore real-time sync. |
| 2 | **Debt & Loan Tracking (DEBT-01 to DEBT-04)** — Add loans (bank/village/personal), amortisation, repayment recording. |
| 3 | **Shared Budgets (SB-01 to SB-05)** — Household budget sharing, invite/accept, permission controls. |
| 4 | **Monthly Summary Report (RPT-03)** — Full monthly report with PDF export. |
| 5 | **Manje Web Platform** — Next.js web app with dashboard, transactions, budgets, reports. |
| 6 | **WhatsApp Notification Delivery** — Bill reminders and budget alerts via WhatsApp. |
| 7 | **Income Confirmation Modal (TXN-06)** — Detect and confirm expected income. |

### 6.4 Phase P3: Marketplace & Scale — Months 15+
**Goal:** Platform expansion and new revenue streams.

| # | Feature |
|---|---------|
| 1 | **Human Financial Planner (PL-01 to PL-07)** — Discovery, profiles, data permissions, chat, appointment booking, recommendations. |
| 2 | **Planner Portal** — Web dashboard for planners to manage clients. |
| 3 | **Investment Tracker (EDU-05)** — Manual investment logging and performance tracking. |
| 4 | **Multi-Currency Support** — USD, ZMW, MZN alongside MWK. |
| 5 | **Advanced AI Features** — Predictive cash flow, anomaly detection, proactive budget adjustment suggestions. |
| 6 | **B2B Channel** — Employer/institutional licensing for employee financial wellness. |

---

## 7. Monetisation Framework (NEW)

### 7.1 Model: Freemium with Premium Subscription

| Tier | Price (MWK/month) | Price (USD equiv.) | Included |
|------|-------------------|-------------------|----------|
| **Free** | 0 | $0 | Transaction logging, 1 budget, 1 goal, dashboard, ManjeCharacter (3 moods), basic notifications, offline support |
| **Manje Premium** | 1,500–2,500 | ~$0.85–1.40 | AI chat assistant, unlimited budgets & goals, weekly/monthly reports, bill management, advanced analytics, all 8 ManjeCharacter moods, education hub full access |
| **Manje Premium (Annual)** | 15,000–25,000/year | ~$8.50–14.00 | Same as monthly, 2 months free |

### 7.2 Future Revenue Streams (P3+)
- **Planner Marketplace:** 15–20% commission on per-session fees (MWK 5,000–10,000/session)
- **B2B Licensing:** Employer/MFI bulk subscriptions at discounted per-seat rate
- **Anonymised Insights:** Aggregated, anonymised spending trend data for financial institutions and NGOs (with explicit user consent and opt-in)

### 7.3 Pricing Validation Required
- [ ] Test MWK 1,500 vs. 2,500 monthly price points in user interviews
- [ ] Measure conversion from free to premium in first 90 days post-launch
- [ ] Compare annual vs. monthly payment preference

---

## 8. Data Architecture

*(No changes from v1.0. The per-user encrypted SQLite + Firebase Firestore sync architecture is validated by the competitive analysis as the correct approach for offline-first emerging market deployment.)*

**Key architecture decisions confirmed:**
- SQLite with SQLCipher for local encrypted storage
- Firebase Firestore for cloud sync and real-time features (VSLA)
- Firebase Auth for identity management
- Per-user database isolation (no cross-user data leakage risk)
- Sync conflict resolution: last-write-wins with server timestamp

---

## 9. Technology Stack

*(No changes from v1.0. Stack choices are validated.)*

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Mobile framework | React Native + Expo SDK | Cross-platform, single codebase, EAS Build |
| Language | TypeScript | Type safety, developer experience |
| State management | Zustand | Lightweight, minimal boilerplate |
| Local database | SQLite + SQLCipher | Offline-first, encrypted, performant |
| Cloud database | Firebase Firestore | Real-time sync, serverless, scales |
| Authentication | Firebase Auth | Email, Google, Apple, phone (future) |
| AI API | DeepInfra (Meta Llama 3.3 70B) | Cost-effective, open-source model, good multilingual capability |
| Push notifications | Firebase Cloud Messaging (FCM) | Standard, reliable, free |
| Analytics | Firebase Analytics | Integrated with auth/Firestore |
| Testing | Jest + React Native Testing Library | Standard, well-documented |
| Build | EAS Build (Expo Application Services) | OTA updates, managed builds |

**Architecture recommendation added (from critique):**
- Abstract AI provider behind an interface for multi-provider flexibility
- Monitor per-request AI costs from day one
- Explore on-device inference (Gemma 2B / Phi-3-mini) for offline AI fallback in P1

---

## 10. Integrations

*(No changes from v1.0.)*

| Integration | Purpose | Phase |
|------------|---------|-------|
| DeepInfra API | AI assistant, categorisation, insights | P0 (categorisation), P1 (chat) |
| Firebase Auth | User authentication | P0 |
| Firebase Firestore | Cloud sync, real-time VSLA | P0 (sync), P2 (VSLA) |
| Firebase Cloud Messaging | Push notifications | P0 |
| Expo Local Authentication | Biometric lock | P0 |
| Expo Secure Store | Encryption key storage | P0 |
| WhatsApp Business API | Notification delivery, group invites | P2 |

---

## 11. Brand Identity

*(No changes from v1.0. Refer to `Manje_Design_System.md` for the canonical brand guide.)*

**Confirmed strengths from competitive analysis:**
- ManjeCharacter is more sophisticated than any competitor's personality feature
- Claymorphism visual language is distinctive and warm
- Brand voice ("never shame, always encourage") is perfectly calibrated for the market
- "Available to Spend" as hero metric is validated by PocketGuard's success

---

## 12. Privacy & Data Principles

*(No changes from v1.0.)*

1. **Your data is yours.** Users own their financial data. Full export and deletion at any time.
2. **Encrypted at rest.** SQLCipher encryption on device. Firestore security rules isolate user data.
3. **Minimal collection.** Only collect what's needed for features the user has opted into.
4. **Transparent sharing.** Data shared with planners is explicitly controlled by the user via toggle UI (PL-03).
5. **No selling.** User data is never sold to third parties.
6. **Accountable deletion.** Account deletion wipes local DB, cloud data, and auth records completely.

---

## 13. Success Metrics — Phased (Refined)

### P0 Metrics (MVP — First 90 Days Post-Launch)
| Metric | Target | Measurement |
|--------|--------|-------------|
| App installs | 1,000 | Play Store analytics |
| DAU / MAU ratio | > 25% | Firebase Analytics |
| Transactions logged per active user per week | ≥ 5 | App analytics |
| Budget creation rate (% of users who create a budget within 7 days) | > 40% | Funnel analytics |
| Retention: Day 7 | > 30% | Firebase Analytics |
| Retention: Day 30 | > 15% | Firebase Analytics |
| App crash rate | < 1% | EAS/Sentry |
| NPS (Net Promoter Score) | > 30 | In-app survey at Day 14 |

### P1 Metrics (Months 4–7)
| Metric | Target |
|--------|--------|
| Free → Premium conversion rate | > 5% |
| AI chat sessions per premium user per week | ≥ 2 |
| Bill reminders: on-time payment rate | > 70% |
| Streak: % of users with 7+ day streak | > 20% |
| Education content engagement | > 1 article read per user per month |

### P2 Metrics (Months 8–14)
| Metric | Target |
|--------|--------|
| VSLA groups created | 50+ |
| Average group size | 10+ members |
| VSLA member retention (30-day) | > 60% |
| Shared budgets created | 100+ |
| Web platform DAU | > 10% of mobile DAU |

---

## 14. Product Roadmap — Phased (Refined)

```
P0: MVP Launch                          [Month 0–4]
├── Auth (email + Google + biometric)
├── 3-screen onboarding
├── Dashboard + ManjeCharacter (3 moods)
├── Transaction entry + AI categorisation
├── Activity feed
├── Single budget (AI-assisted + manual)
├── One savings goal
├── Basic settings
├── Offline support (full)
├── Push notifications
└── Landing page (waitlist → app store)

P1: Core Expansion                      [Month 4–7]
├── AI Chat Assistant (full)
├── Bill management
├── Expanded budgets (multiple, rollover)
├── Multiple savings goals + milestones
├── Gamification (streaks)
├── Weekly analytics report
├── Education Hub
├── ManjeCharacter all 8 moods + Lottie
└── Premium tier launch

P2: Social & Advanced                   [Month 8–14]
├── Village Savings (VSLA)
├── Debt & loan tracking
├── Shared budgets
├── Monthly report + PDF export
├── Manje Web Platform
├── WhatsApp notifications
└── Income confirmation

P3: Marketplace & Scale                 [Month 15+]
├── Human Financial Planner marketplace
├── Planner portal (web)
├── Investment tracker
├── Multi-currency
├── Advanced AI (predictive cash flow)
└── B2B channel
```

---

## 15. Risk Register (NEW)

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| R1 | Scope creep delays MVP launch | High | Critical | Strict P0 feature freeze; PRD is the contract |
| R2 | AI categorisation inaccurate for MWK transactions | Medium | High | Build merchant → category training set from day one; allow user corrections that feed back |
| R3 | Low user retention after initial download | Medium | High | Onboarding optimisation; streak system in P1; push notification strategy |
| R4 | AI API costs exceed budget at scale | Medium | Medium | Per-request cost monitoring; caching; prompt optimisation; multi-provider abstraction |
| R5 | ManjeCharacter execution quality falls short | Medium | High | Commission professional illustrator early; test with focus group before engineering |
| R6 | VSLA adoption requires group-level onboarding | High | Medium | Defer to P2; seed with 5–10 beta VSLA groups; manager-first onboarding |
| R7 | Regulatory requirements (RBM) emerge | Low | High | Legal review before launch; design for KYC-readiness; data localisation compliance |
| R8 | DeepInfra service disruption | Low | High | Multi-provider AI abstraction; cached responses; offline keyword categorisation |
| R9 | Low willingness to pay for premium | Medium | High | Validate pricing pre-launch; generous free tier; demonstrate clear premium value |
| R10 | Android fragmentation causes UI/UX issues | Medium | Medium | Test on 5 most common Malawian Android devices; Expo manages most fragmentation |

---

## 16. User Validation Plan (NEW)

### Pre-Development (Before P0 Engineering)
| Activity | Participants | Goal |
|----------|-------------|------|
| User interviews | 15 target users (Lilongwe/Blantyre) | Validate pain points, feature priorities, willingness to pay |
| Concept test | Show PVD summary + ManjeCharacter concepts | Gauge emotional response, trust, appeal |
| Competitor awareness | Ask about current financial tools used | Understand baseline behaviour |

### During P0 Development
| Activity | Timing | Goal |
|----------|--------|------|
| Figma prototype test | Week 2–3 | Validate dashboard layout, transaction entry flow, onboarding |
| ManjeCharacter focus group | Week 4 | Test character illustrations and mood appropriateness |
| Pricing survey | Week 6 | Test MWK 1,500 vs 2,500 monthly price points |

### Post-P0 Launch
| Activity | Timing | Goal |
|----------|--------|------|
| In-app NPS survey | Day 14 post-install | Measure satisfaction |
| User interviews (power users) | Month 2 | Understand what drives engagement |
| Churn interviews | Month 2–3 | Understand why users leave |
| VSLA manager interviews | Month 3 | Validate VSLA feature design before P2 build |

---

## 17. Open Questions (Updated)

### From v1.0 (Still Open)
1. **Shared Budgets:** What happens when two users log the same shared expense? (→ resolve before P2)
2. **Village Bank Loan Rules:** Who sets interest rates in a VSLA — the group or individual terms? (→ resolve before P2)
3. **Planner Matching:** How do we vet and onboard financial planners? (→ resolve before P3)
4. **Income Confirmation:** Should the system auto-detect income patterns, or is it always manual? (→ resolve before P2)
5. **Language Scope:** Chichewa support — when and how? Full app translation or AI responses only? (→ resolve before P1)
6. **Group Budget Data Permissions:** Can all shared budget members see all transactions? (→ resolve before P2)
7. **Investment Tracker Automation:** Manual entry or integration with Malawian investment platforms? (→ resolve before P3)

### New Questions (from Critique)
8. **Revenue model validation:** What's the willingness-to-pay ceiling in MWK? (→ resolve before P1 premium launch)
9. **Offline AI fallback:** Can we run a small on-device model for basic categorisation without internet? (→ investigate during P0)
10. **VSLA adoption strategy:** How do we onboard the first 10 VSLA groups? Manager-first or member-first? (→ resolve before P2)
11. **Data localisation:** Does RBM require financial data to be stored within Malawi? (→ legal review before launch)
12. **App size budget:** What's the max acceptable APK size for target devices with limited storage? (→ target < 50MB)

---

## 18. Constraints (Updated)

### From v1.0 (Confirmed)
- **No SMS auto-detection:** Android restrictions prevent reliable SMS parsing for mobile money transactions. All transactions are manual entry.
- **AI requires internet:** The AI assistant (chat and categorisation) requires a network connection. Offline fallback uses keyword matching.
- **App size limit:** Target < 50MB APK to accommodate low-storage devices.
- **Battery optimisation:** Background sync must be minimal and respect Android battery restrictions.
- **Regulatory compliance:** Must comply with Malawi's Communications Regulatory Authority (MACRA) and Reserve Bank of Malawi (RBM) guidelines.

### New Constraints (from Analysis)
- **No bank sync / Open Banking:** Malawi has no Open Banking APIs. All data is user-entered. This is a constraint but also a privacy advantage.
- **Android-first:** ~80% of Malawian smartphone users are on Android. iOS is secondary market.
- **MWK currency formatting:** All financial displays use MWK with Malawian number formatting conventions.
- **Internet cost awareness:** API calls (especially AI) consume user data. Minimise payload sizes and cache aggressively.
- **Device diversity:** Must test on low-end Android devices (2GB RAM, Android 10+) common in the market.

---

## 19. Document Governance

| Aspect | Detail |
|--------|--------|
| **Owner** | Product Lead |
| **Update frequency** | At each phase transition and after major user research findings |
| **Review board** | Product Lead, Tech Lead, Design Lead |
| **Conflict resolution** | This document wins over any other documentation when conflicts arise |
| **Related documents** | `Manje_IA_and_User_Flows.md` (screen specs), `Manje_Design_System.md` (design tokens), `01_Competitive_Analysis_Report.md` (market research), `02_Concept_Critique.md` (analysis), `04_Technical_PRD.md` (engineering requirements) |

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Pre-July 2025 | Initial product vision document |
| 2.0 | July 2025 | Added competitive positioning, phased scope, monetisation framework, risk register, user validation plan. Deferred web platform to P2, planner to P3. Refined roadmap timeline. |

---

*End of Refined Product Vision Document v2.0*
