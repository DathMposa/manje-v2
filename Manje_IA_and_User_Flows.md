**MANJE**

*Information Architecture & User Flows*

Design & Engineering Reference \| Version 2.0 \| April 2026

+-----------------------------------------------------------------------+
| **How to Use This Document**                                          |
+-----------------------------------------------------------------------+
| Designers: Sections 3 (Screen Inventory), 5-16 (Flow Groups), 17      |
| (Screen Cards), 18 (Modals), 19 (Empty States)                        |
|                                                                       |
| Engineers: Sections 2 (Navigation Model), 4 (IA Map), 5-16 (Flow      |
| Tables with all destinations)                                         |
|                                                                       |
| Product: Section 3 (Screen Inventory) and all Flow Groups for scope   |
| validation                                                            |
|                                                                       |
| Screens are tagged by release phase: \[P0\] MVP (Months 1--3),       |
| \[P1\] Core Expansion (4--7), \[P2\] Social & Advanced (8--14),      |
| \[P3\] Marketplace & Scale (15+). See Refined PVD Section 6.         |
+-----------------------------------------------------------------------+

**1. Navigation Model**

**1.1 Primary Navigation --- Bottom Tab Bar**

The app uses a persistent 5-element bottom navigation bar. The centre
element (＋) opens a Quick Add Modal rather than pushing a new screen.

+-------------+-------------+-------------+-------------+-------------+
| 🏠          | ⚡          | ＋          | ✦           | 👤          |
|             |             |             |             |             |
| **Home**    | Activity    | Add         | Manje       | You         |
+-------------+-------------+-------------+-------------+-------------+

  ------------ ------------------- ----------------------------------------
  **Tab**      **Navigates To**    **Purpose**

  **🏠 Home**  DASH-01 Dashboard   Primary financial health overview. Entry
                                   point for the daily check-in.

  **⚡         ACT-01 Activity     Chronological feed of all transactions
  Activity**   Feed                and bills. Primary place to review and
                                   manage activity.

  **＋ Add**   NAV-01 Quick Add    Bottom sheet with 4 quick actions.
               Modal               Intercepts tab press --- no new screen
                                   pushed.

  **✦ Manje**  AI-01 Manje Chat    AI financial assistant. Primary entry
               Home                for advice, budget creation, education.

  **👤 You**   YOU-01 You Tab      Personal hub: goals carousel, budget
                                   ring, streak, and settings.
  ------------ ------------------- ----------------------------------------

**1.2 Secondary Navigation Patterns**

-   Push Navigation --- Detail screens are pushed from their parent list
    (e.g., tapping a transaction row opens Transaction Detail).

-   Modal Bottom Sheets --- Quick creation, confirmation dialogs, and
    action menus. Dismissed by tapping the scrim or a close button.

-   Full-Screen Modals --- Multi-step creation flows (Create Budget,
    Create Goal, Onboarding). Presented over the tab bar. Require
    explicit dismiss/cancel.

-   Deep Links from Notifications --- Notifications navigate directly to
    the relevant screen, bypassing normal nav stack. Must handle
    cold-start gracefully (show sign-in first if not authenticated).

**1.3 Notification Deep Link Map**

  ------------------------ ------------------------- --------------------
  **Notification Type**    **Deep-Link Destination** **Fallback (not
                                                     logged in)**

  Budget alert (75% / 90%  BUD-05 Budget Category    Sign In →
  / 100%)                  Detail                    destination

  Bill due reminder        BILL-01 Bills List (bill  Sign In → Bills List
                           highlighted)              

  Transaction daily        TXN-03 Add Transaction    Sign In → Add
  reminder                                           Transaction

  Morning daily insight    DASH-01 Dashboard         Sign In → Dashboard

  Evening daily insight    ACT-01 Activity Feed      Sign In → Activity

  Goal milestone           GOAL-03 Goal Detail       Sign In → Goals List
  celebration                                        

  Streak at risk           DASH-01 Dashboard         Sign In → Dashboard

  Village savings due      VS-03 Group Detail        Sign In → Village
  \[P2\]                                             Savings Hub

  Planner message          PL-04 Planner Chat        Sign In → Planner
  \[P3\]                                             Chat

  Income confirmation      TXN-06 Income             Sign In → Dashboard
  prompt \[P2\]            Confirmation Modal        
  ------------------------ ------------------------- --------------------

**2. Full Screen Inventory**

Every screen in the Manje app is catalogued here, organized by domain.
Screen IDs are used consistently throughout all flow diagrams in this
document.

**Authentication (AUTH)** --- All \[P0\]

  ------------- --------------------- ----------------------------------------
  **ID**        **Screen Name**       **Purpose**

  **AUTH-01**   **Welcome Screen**    Branded entry. ManjeCharacter wave
                                      animation. \"New User\" and \"Have
                                      Account\" paths.

  **AUTH-02**   **Sign Up Screen**    Email, name, and password registration
                                      form. Firebase Auth account creation.

  **AUTH-03**   **Sign In Screen**    Email/password login + Google Sign-In
                                      option. Password autofill support.

  **AUTH-04**   **Forgot Password     Email input to trigger Firebase password
                Screen**              reset email.

  **AUTH-05**   **Reset Password      Browser page (manje-landing) ---
                (Web)**               completes password reset, deep-links
                                      back to app.

  **AUTH-06**   **Biometric Lock      Full-screen overlay prompting biometric
                Overlay**             auth after auto-lock timeout elapses.
  ------------- --------------------- ----------------------------------------

**Onboarding (OB)** --- \[P0\] OB-02, OB-03, OB-07, OB-08 \| \[P1\] OB-01, OB-04, OB-05, OB-06

  ----------- --------------------- ----------------------------------------
  **ID**      **Screen Name**       **Purpose**

  **OB-01**   **Brand Story         \[P1\] Narrative screen explaining
              Screen**              why Manje exists. Relatable, local
                                    context.

  **OB-02**   **Country Selection** Select home country. Auto-detects and
                                    shows default currency.

  **OB-03**   **Currency            Confirm or change currency. Searchable
              Selection**           list of 50+ currencies.

  **OB-04**   **Permissions Setup** \[P1\] Requests notification permissions.
                                    Plain-language explanation.

  **OB-05**   **Notification        \[P1\] Select notification types and
              Preferences**         preferred times.

  **OB-06**   **Goal Setting**      \[P1\] Set first financial goal --- type,
                                    target amount, optional deadline.

  **OB-07**   **Onboarding          ManjeCharacter celebration animation.
              Success**             \"Get Started\" CTA → Dashboard.

  **OB-08**   **Income Range        \[P0\] Optional income range input.
              Screen**              Used in P0 simplified onboarding flow.
                                    Skip option available.
  ----------- --------------------- ----------------------------------------

**Dashboard & Navigation (DASH / NAV / ACT)** --- All \[P0\]

  ------------- --------------------- ----------------------------------------
  **ID**        **Screen Name**       **Purpose**

  **DASH-01**   **Home Dashboard**    \"Available to Spend\" hero,
                                      ManjeCharacter mood, income/spent cards,
                                      AI insight, top categories, goal
                                      snippet, upcoming bills.

  **ACT-01**    **Activity Feed**     Unified chronological feed of
                                      transactions and bills. Filter pills:
                                      All / Expenses / Income / Bills.

  **NAV-01**    **Quick Add Modal**   Bottom sheet: Add Transaction \| Add
                                      Budget \| Add Goal \| Chat with Manje.

  **NAV-02**    **Notification        List of all recent app notifications
                Centre**              with deep-link tap behaviour.

  **NAV-03**    **Notification        Individual notification with action
                Detail**              buttons and contextual information.
  ------------- --------------------- ----------------------------------------

**Transactions (TXN)** --- \[P0\] TXN-01 to TXN-04 \| \[P1\] TXN-05 \| \[P2\] TXN-06

  ------------ --------------------- ----------------------------------------
  **ID**       **Screen Name**       **Purpose**

  **TXN-01**   **Transactions List** Full searchable, filterable transaction
                                     history. Accessed via deep links or
                                     Activity Feed.

  **TXN-02**   **Transaction         Full detail view of a single
               Detail**              transaction. Edit and delete actions.

  **TXN-03**   **Add Transaction**   Form: type (income/expense/transfer),
                                     amount, category, merchant, date, notes,
                                     account. AI category suggestion shown
                                     live.

  **TXN-04**   **Edit Transaction**  Pre-filled Add Transaction form. All
                                     fields editable.

  **TXN-05**   **Transaction         \[P1\] List of auto-flagged transactions
               Review**              awaiting user approval. Approve / edit /
                                     reject each.

  **TXN-06**   **Income Confirmation \[P2\] \"Has \[income source\]
               Modal**               arrived?\" prompt with Yes / Reschedule
                                     / Enter manually options.
  ------------ --------------------- ----------------------------------------

**Budget Management (BUD)** --- \[P0\] BUD-01 to BUD-04, BUD-06 \| \[P1\] BUD-05, BUD-07 \| \[P2\] BUD-08 to BUD-10

  ------------ --------------------- ----------------------------------------
  **ID**       **Screen Name**       **Purpose**

  **BUD-01**   **Budgets List**      All budgets with status. Primary
                                     highlighted. Sort and filter. Create
                                     budget button.

  **BUD-02**   **Budget Overview**   Single budget detail. Progress ring,
                                     per-category breakdown. Edit and delete
                                     actions.

  **BUD-03**   **AI Budget Chat**    Multi-step conversational budget
                                     creation (8 steps: Goals → Prioritize →
                                     Educate → Income → Expenses → Generate →
                                     Review → Save).

  **BUD-04**   **Budget Setup        Manual budget form for users who prefer
               (Manual)**            not to use the AI chat.

  **BUD-05**   **Budget Category     \[P1\] Single category drill-down: spend vs
               Detail**              limit, transactions in category, edit
                                     limit CTA. Deep-link target from budget
                                     alerts.

  **BUD-06**   **Edit Budget**       Pre-filled budget form. All fields
                                     editable.

  **BUD-07**   **Stored Expenses**   \[P1\] List of saved recurring
                                     expense templates. Add, edit, remove.

  **BUD-08**   **Budget Intelligence \[P2\] Trend charts.
               View**                Month-over-month comparisons.
                                     Predictable spike months highlighted.

  **BUD-09**   **Shared Budget       \[P2\] Create a shared budget ---
               Setup**               invite partner, set category structure.

  **BUD-10**   **Shared Budget       \[P2\] Shared budget overview
               View**                visible to both participants
                                     simultaneously.
  ------------ --------------------- ----------------------------------------

**Goals & Savings (GOAL)** --- \[P0\] GOAL-02 to GOAL-05 \| \[P1\] GOAL-01, GOAL-06 \| \[P2\] GOAL-07

  ------------- --------------------- ----------------------------------------
  **ID**        **Screen Name**       **Purpose**

  **GOAL-01**   **Goals List**        \[P1\] All active and completed goals. Summary
                                      stats. Create goal button.

  **GOAL-02**   **Create Goal**       Form: type, name, target amount,
                                      deadline, monthly contribution, icon,
                                      colour. Projected completion
                                      auto-calculated.

  **GOAL-03**   **Goal Detail**       Progress bar, amount saved vs target,
                                      projected date, contribution history,
                                      milestone badges. Deep-link target.

  **GOAL-04**   **Add Contribution    Quick bottom sheet: amount, source
                Modal**               account, note.

  **GOAL-05**   **Edit Goal**         Pre-filled Create Goal form. All fields
                                      editable.

  **GOAL-06**   **Milestone           \[P1\] Full-screen ManjeCharacter celebration
                Celebration**         overlay at 25%, 50%, 75%, 100%
                                      completion.

  **GOAL-07**   **Shared Goal Setup** \[P2\] Create a savings goal shared
                                      between two users. Per-contributor
                                      tracking.
  ------------- --------------------- ----------------------------------------

**Bills Management (BILL)** --- All \[P1\]

  ------------- --------------------- ----------------------------------------
  **ID**        **Screen Name**       **Purpose**

  **BILL-01**   **Bills List**        All bills sorted by next due date.
                                      Urgency colour coding. Mark as paid
                                      quick action. Create bill button.

  **BILL-02**   **Create Bill**       Form: name, amount (fixed/variable), due
                                      day, frequency, category, reminder days,
                                      icon, colour.

  **BILL-03**   **Bill Detail**       Full bill: amount, frequency, next due,
                                      payment history, reminder settings. Edit
                                      and delete.

  **BILL-04**   **Edit Bill**         Pre-filled Create Bill form.

  **BILL-05**   **Mark Bill Paid      Confirmation: amount paid (editable for
                Modal**               variable bills), date, source account.
  ------------- --------------------- ----------------------------------------

**Expenses & Income (EXP)** --- \[P1\] EXP-01, EXP-02 \| \[P2\] EXP-03 to EXP-05

  ------------ --------------------- ----------------------------------------
  **ID**       **Screen Name**       **Purpose**

  **EXP-01**   **Income Sources      \[P1\] List of all income sources
               Screen**              with add, edit, archive.

  **EXP-02**   **Add Income Source** \[P1\] Form: source name, type,
                                     expected amount, payment interval.

  **EXP-03**   **Bank Accounts       \[P2\] All bank and cash accounts
               Screen**              with current balances.

  **EXP-04**   **Add Bank Account**  \[P2\] Form: account name,
                                     institution, current balance.

  **EXP-05**   **Multi-Account       \[P2\] Aggregated balance view with
               Balance View**        upcoming deductions and shortfall
                                     warnings.
  ------------ --------------------- ----------------------------------------

**Debt & Loans (DEBT)** --- All \[P2\]

  ------------- --------------------- ----------------------------------------
  **ID**        **Screen Name**       **Purpose**

  **DEBT-01**   **Loans Overview**    \[P2\] Summary of all loans: total
                                      owed, monthly obligations, next payment.
                                      Add loan button.

  **DEBT-02**   **Add Loan**          \[P2\] Form: loan type, principal,
                                      interest, term, start date, repayment
                                      frequency. Auto-calculates schedule.

  **DEBT-03**   **Loan Detail**       \[P2\] Amortization table, paid vs
                                      remaining principal/interest, next
                                      payment, repayment history.

  **DEBT-04**   **Record Loan Payment \[P2\] Amount, date, source
                Modal**               account. Shows principal vs interest
                                      split.

  **DEBT-05**   **Multi-Loan          \[P2\] Side-by-side comparison of
                Summary**             all active loans with combined monthly
                                      obligation.

  **DEBT-06**   **Debt Transfer       \[P2\] Record fund transfers
                Screen**              between accounts for debt management.
  ------------- --------------------- ----------------------------------------

**Village Savings --- Chiperegani (VS)** --- All \[P2\]

  ----------- --------------------- ----------------------------------------
  **ID**      **Screen Name**       **Purpose**

  **VS-01**   **Village Savings     \[P2\] All group memberships,
              Hub**                 aggregated contribution summary,
                                    upcoming rotation indicator.

  **VS-02**   **Create / Join       \[P2\] Create a new group (manager)
              Group**               or join via invite code (member).

  **VS-03**   **Group Detail**      \[P2\] Contribution history, next
                                    due date, rotation schedule, loan
                                    section. Deep-link target.

  **VS-04**   **Record Contribution \[P2\] Confirm amount, date, source
              Modal**               account for current cycle.

  **VS-05**   **Rotation Schedule   \[P2\] Full rotation calendar ---
              View**                who receives each cycle and when.
                                    User\'s turn highlighted.

  **VS-06**   **Village Loan        \[P2\] Loan principal, interest,
              Detail**              repayment schedule, history, record
                                    payment button.

  **VS-07**   **Group Manager       \[P2\] Manager-only: full member
              Dashboard**           list, contribution status per member,
                                    mark payments, send reminders.

  **VS-08**   **Group Operational   \[P2\] Exportable PDF contribution
              Report**              and loan summary report.

  **VS-09**   **Aggregated Groups   \[P2\] Cross-group summary: total
              View**                contributed, loans, upcoming rotations
                                    across all memberships.
  ----------- --------------------- ----------------------------------------

**Shared Finance (SB)** --- All \[P2\]

  ----------- --------------------- ----------------------------------------
  **ID**      **Screen Name**       **Purpose**

  **SB-01**   **Shared Finance      \[P2\] All shared budgets and
              Hub**                 shared goals. Invite management.

  **SB-02**   **Shared Budget       \[P2\] Shared budget both
              Detail**              participants can view. Each person\'s
                                    spend shown separately.

  **SB-03**   **Group Budget        \[P2\] Multi-user budget for 3+
              Detail**              people sharing a joint goal.

  **SB-04**   **Send Invite         \[P2\] Generate/share invite link.
              Screen**              Or direct email input.

  **SB-05**   **Accept Invite       \[P2\] Review incoming invite.
              Screen**              Accept or decline.
  ----------- --------------------- ----------------------------------------

**AI Assistant (AI)** --- All \[P1\] (AI Categorisation is \[P0\]; full chat is \[P1\])

  ----------- --------------------- ----------------------------------------
  **ID**      **Screen Name**       **Purpose**

  **AI-01**   **Manje Chat Home**   Welcome state: ManjeCharacter hero and 4
                                    quick action cards. Transitions to chat
                                    on first message.

  **AI-02**   **Active Chat         Full chat UI: message bubbles, typing
              Screen**              indicator, suggestion chips, AI action
                                    buttons.

  **AI-03**   **Chat History**      List of past conversation sessions. Tap
                                    to resume or review.

  **AI-04**   **AI Budget Creation  Dedicated 8-step conversational budget
              Chat**                creation flow.
  ----------- --------------------- ----------------------------------------

**Human Financial Planner (PL)** --- All \[P3\]

  ----------- --------------------- ----------------------------------------
  **ID**      **Screen Name**       **Purpose**

  **PL-01**   **Planner Discovery** \[P3\] Browse planners with
                                    profiles, specialisations, ratings,
                                    availability.

  **PL-02**   **Planner Profile**   \[P3\] Full planner profile with
                                    Connect, Message, and Book actions.

  **PL-03**   **Data Permissions**  \[P3\] Granular controls: what data
                                    categories can this planner access? Most
                                    trust-critical screen.

  **PL-04**   **Planner Chat**      \[P3\] Secure in-app messaging
                                    between user and planner.

  **PL-05**   **Book Appointment**  \[P3\] Calendar-style booking.
                                    Select available slot, add note,
                                    confirm.

  **PL-06**   **Upcoming            \[P3\] List of scheduled
              Appointments**        appointments with status.

  **PL-07**   **Planner             \[P3\] Review planner-crafted
              Recommendations**     budget/goal modules. Accept / Modify /
                                    Decline.

  **PL-08**   **Monthly Review      \[P3\] Monthly accountability
              Screen**              check-in from planner. User reviews
                                    progress.
  ----------- --------------------- ----------------------------------------

**Financial Education (EDU)** --- \[P1\] EDU-01, EDU-02 \| \[P3\] EDU-03 to EDU-05

  ------------ --------------------- ----------------------------------------
  **ID**       **Screen Name**       **Purpose**

  **EDU-01**   **Education Hub**     \[P1\] Featured content,
                                     categories, investment awareness feed.

  **EDU-02**   **Content Detail**    \[P1\] Individual article/snippet
                                     with links to YouTube and blog.

  **EDU-03**   **Investment          \[P3\] Regularly updated cards on
               Awareness Feed**      treasury bills, shares, money market.

  **EDU-04**   **Investment          \[P3\] User-recorded investment
               Tracker**             holdings. Add holding button.

  **EDU-05**   **Add Investment      \[P3\] Investment type,
               Modal**               institution, amount, notes.
  ------------ --------------------- ----------------------------------------

**Analytics & Reports (RPT)** --- \[P1\] RPT-01, RPT-02, RPT-04 \| \[P2\] RPT-03

  ------------ --------------------- ----------------------------------------
  **ID**       **Screen Name**       **Purpose**

  **RPT-01**   **Weekly Report**     \[P1\] Weekly financial health report: category
                                     breakdown, anomalies, week-over-week
                                     comparison.

  **RPT-02**   **Spending Trends**   \[P1\] Month-over-month trend
                                     charts. Predictable spike
                                     identification.

  **RPT-03**   **Monthly Summary**   \[P2\] Full monthly overview with
                                     PDF export.

  **RPT-04**   **Financial Health    \[P1\] Score breakdown: budget adherence, goal
               Score**               progress, spending patterns. Improvement
                                     tips.
  ------------ --------------------- ----------------------------------------

**Profile, Settings & You (YOU / SET)** --- \[P0\] YOU-01, SET-01 to SET-04, SET-06, SET-09, SET-10 \| \[P1\] SET-05, SET-07 \| \[P2\] SET-08

  ------------ --------------------- ----------------------------------------
  **ID**       **Screen Name**       **Purpose**

  **YOU-01**   **You Tab Screen**    Profile section, goals carousel, budget
                                     ring, streak badge, full settings menu.

  **SET-01**   **Edit Profile**      Edit display name and avatar. Email
                                     shown as read-only.

  **SET-02**   **Currency Settings** Change primary currency. Searchable list
                                     with country flags.

  **SET-03**   **Notification        Toggle all notification types, times,
               Settings**            DND window, email digest toggle.

  **SET-04**   **Security Settings** Biometric lock toggle, auto-lock
                                     timeout, encryption status, security
                                     badge.

  **SET-05**   **Merchant Rules**    \[P1\] View and manage auto-categorization
                                     rules per merchant.

  **SET-06**   **Data & Privacy**    Plain-language data notice. Export data
                                     (CSV). Delete account entry point.

  **SET-07**   **Language Settings** \[P1\] Language preference:
                                     Chichewa / English.

  **SET-08**   **WhatsApp Settings** \[P2\] WhatsApp delivery opt-in/out. Phone
                                     number. Preferred delivery time.

  **SET-09**   **Account Deletion    Two-step: warning screen + type
               Confirmation**        \"DELETE\" confirmation. Wipes all data.

  **SET-10**   **Help & Support**    FAQ, contact support, feedback link.
  ------------ --------------------- ----------------------------------------

**3. Information Architecture Map**

The tree below shows the full navigational hierarchy. Indentation =
parent → child. Screen codes link back to the Screen Inventory.

  -----------------------------------------------------------------------
  \(M\) = Modal / Bottom Sheet (FS) = Full-Screen Modal
  \[DL\] = Deep-Link Target → = navigates to
  Phase tags: \[P0\] \[P1\] \[P2\] \[P3\] --- see Screen Inventory for full mapping

  -----------------------------------------------------------------------

  -----------------------------------------------------------------------
  **PRE-AUTHENTICATION**

  -----------------------------------------------------------------------

AUTH-01 Welcome Screen

├─ AUTH-02 Sign Up → OB-01 Onboarding Welcome

├─ AUTH-03 Sign In → DASH-01 Dashboard

│ └─ AUTH-04 Forgot Password → AUTH-05 Web Reset → deep-link back to
AUTH-03

└─ AUTH-06 Biometric Lock Overlay (over any screen, post-login, on
resume)

  -----------------------------------------------------------------------
  **ONBOARDING (FS --- linear)**
  **P0 flow: OB-02 → OB-03 → OB-08 → OB-07 (3 screens + success)**
  **Full flow (P1): adds OB-01, OB-04, OB-05, OB-06**

  -----------------------------------------------------------------------

OB-01 Brand Story \[P1\] → OB-02 Country Selection → OB-03 Currency
Selection

→ OB-04 Permissions Setup \[P1\] → OB-05 Notification Prefs \[P1\] → OB-06 Goal
Setting \[P1\]

→ OB-08 Income Range \[P0\] → OB-07 Success Screen → DASH-01 Dashboard

  -----------------------------------------------------------------------
  **MAIN APP --- TAB BAR**

  -----------------------------------------------------------------------

TAB 1 --- HOME ─────────────────────────────────────────────────────────

DASH-01 Home Dashboard \[DL\]

├─ BUD-05 Budget Category Detail (tap any spending category) \[P1\]

│ └─ TXN-02 Transaction Detail (tap transaction in list)

│ └─ TXN-04 Edit Transaction

├─ GOAL-03 Goal Detail (tap goal snippet) \[DL\]

│ ├─ GOAL-04 Add Contribution Modal (M)

│ ├─ GOAL-05 Edit Goal

│ └─ GOAL-06 Milestone Celebration Overlay

├─ BILL-01 Bills List (tap upcoming bills strip) \[DL\] \[P1\]

├─ AI-02 Manje Chat (tap \"Chat with Manje\" CTA) \[P1\]

├─ RPT-01 Weekly Report (tap insight card expand) \[P1\]

└─ NAV-02 Notification Centre (tap bell icon)

└─ NAV-03 Notification Detail

TAB 2 --- ACTIVITY
──────────────────────────────────────────────────────

ACT-01 Activity Feed \[DL\]

├─ TXN-02 Transaction Detail (tap transaction row)

│ └─ TXN-04 Edit Transaction

├─ BILL-03 Bill Detail (tap bill row) \[P1\]

│ ├─ BILL-04 Edit Bill \[P1\]

│ └─ BILL-05 Mark Bill Paid Modal (M) \[P1\]

└─ TXN-03 Add Transaction (FS) (tap + in header)

TAB 3 --- QUICK ADD (M) --- does not push a screen ─────────────────────

NAV-01 Quick Add Modal (M)

├─ TXN-03 Add Transaction (FS)

├─ BUD-03 AI Budget Chat (FS) or BUD-04 Manual Budget Setup (FS)

├─ GOAL-02 Create Goal (FS)

└─ AI-01/02 Manje Chat \[P1\]

TAB 4 --- MANJE AI \[P1\]
──────────────────────────────────────────────────────

AI-01 Manje Chat Home

└─ AI-02 Active Chat Screen

├─ AI-03 Chat History (tap history icon)

├─ AI-04 Budget Creation Chat (via AI action button)

├─ BUD-02 Budget Overview (via AI action button)

├─ GOAL-02 Create Goal (via AI action button)

├─ EDU-01 Education Hub \[P1\] (via Education quick action card)

│ ├─ EDU-02 Content Detail

│ ├─ EDU-03 Investment Awareness Feed

│ └─ EDU-04 Investment Tracker

│ └─ EDU-05 Add Investment Modal (M)

└─ RPT-02 Spending Trends \[P1\] (via action button)

TAB 5 --- YOU
───────────────────────────────────────────────────────────

YOU-01 You Tab

├─ GOAL-01 Goals List (tap \"View All Goals\")

│ ├─ GOAL-03 Goal Detail \[DL\]

│ └─ GOAL-02 Create Goal (FS)

├─ BUD-01 Budgets List (tap budget ring)

│ └─ BUD-02 Budget Overview

│ ├─ BUD-05 Category Detail \[DL\]

│ └─ BUD-06 Edit Budget

├─ SET-01 Edit Profile

├─ SET-02 Currency Settings

├─ SET-03 Notification Settings

├─ SET-04 Security Settings

├─ SET-05 Merchant Rules \[P1\]

├─ SET-06 Data & Privacy

│ └─ SET-09 Account Deletion Confirmation (FS)

├─ SET-07 Language Settings \[P1\]

├─ SET-08 WhatsApp Settings \[P2\]

└─ SET-10 Help & Support

  -----------------------------------------------------------------------
  **HIDDEN ROUTES (accessible via deep links, not in tab bar)**

  -----------------------------------------------------------------------

TXN-01 Transactions List → TXN-02 Detail → TXN-04 Edit

TXN-05 Transaction Review \[P1\] → TXN-04 Edit or approve/reject inline

RPT-01 Weekly Report \[DL\]

RPT-03 Monthly Summary \[P2\] → export share sheet

RPT-04 Financial Health Score

  -----------------------------------------------------------------------
  **FUTURE PHASE ROUTE TREES (P1--P3)**

  -----------------------------------------------------------------------

VS-01 Village Savings Hub \[P2\]

├─ VS-02 Create / Join Group → VS-03 Group Detail \[DL\]

│ ├─ VS-04 Record Contribution Modal (M)

│ ├─ VS-05 Rotation Schedule View

│ └─ VS-06 Village Loan Detail → DEBT-04 Record Payment Modal (M)

├─ VS-07 Manager Dashboard → VS-08 Operational Report

└─ VS-09 Aggregated Groups View

DEBT-01 Loans Overview \[P2\] → DEBT-02 Add Loan → DEBT-03 Loan Detail

└─ DEBT-04 Record Payment Modal (M) \| DEBT-05 Multi-Loan Summary

SB-01 Shared Finance Hub \[P2\]

├─ BUD-09 Shared Budget Setup → SB-04 Send Invite ← SB-05 Accept Invite

└─ SB-02 Shared Budget Detail \| SB-03 Group Budget Detail

PL-01 Planner Discovery \[P3\] → PL-02 Planner Profile → PL-03 Data Permissions

→ PL-04 Planner Chat \| PL-05 Book Appointment → PL-06 Upcoming Appts

\| PL-07 Recommendations \| PL-08 Monthly Review

EXP-01 Income Sources \[P1\] → EXP-02 Add Income Source

EXP-03 Bank Accounts \[P2\] → EXP-04 Add Account \| EXP-05 Multi-Account
Balance View

**4. Flow Group A --- Authentication & First Use \[P0\]**

Flows A1--A4 cover every user\'s first encounter with the app and
subsequent re-authentication. First impressions are made here --- these
flows must be fast, warm, and confidence-building.

**Flow A1 --- New User Registration & Onboarding \[P0\]**

  -----------------------------------------------------------------------
  Entry point: First ever app launch. Exit: Dashboard fully loaded after
  onboarding complete.

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **AUTH-01          User sees ManjeCharacter     → AUTH-02 Sign Up
           Welcome**          wave, tagline. Taps \"I\'m   
                              New --- Create Account.\"    

  **2**    **AUTH-02 Sign     User enters full name,       → OB-01 Brand Story
           Up**               email, password. Taps        \[P1\]
                              \"Create Account.\" Firebase 
                              creates account.             

  **3**    **OB-01 Brand      \"Ever wondered where your   → OB-02 Country
           Story**            money goes each month?\"     Selection
                              Short narrative. Taps        
                              \"Let\'s Fix That.\"         

  **4**    **OB-02 Country    User selects country.        → OB-03 Currency
           Selection**        Currency auto-detected and   
                              previewed. Taps \"Confirm.\" 

  **5**    **OB-03 Currency   User confirms or changes     → OB-04 Permissions
           Selection**        currency. Taps \"Use         
                              \[MWK\].\"                   

  **6**    **OB-04            App explains notification    → OB-05
           Permissions        value. User toggles on.      Notification Prefs
           Setup**            System permission dialog     
                              fires.                       

  **7**    **OB-05            User selects notification    → OB-06 Goal
           Notification       types and reminder times.    Setting
           Prefs**            Taps \"Set Up.\"             

  **8**    **OB-06 Goal       User picks goal type, enters → OB-07 Success
           Setting**          target amount and optional   
                              deadline. ManjeCharacter     
                              reacts to goal. Taps \"Set   
                              This Goal.\"                 

  **9**    **OB-07 Success    ManjeCharacter celebrate     → DASH-01 Dashboard
           Screen**           animation plays. Summary of  
                              what\'s set up. Taps         
                              \"Let\'s Go!\"               
  -------- ------------------ ---------------------------- -------------------

**Flow A2 --- Returning User Sign In \[P0\]**

  -----------------------------------------------------------------------
  Entry: App opened by existing user. Exit: Dashboard loaded.

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **AUTH-01          User taps \"I Have an        → AUTH-03 Sign In
           Welcome**          Account --- Sign In.\"       

  **2**    **AUTH-03 Sign     User enters email and        → DASH-01 Dashboard
           In**               password. Taps \"Sign In.\"  
                              Firebase validates.          

  **2a**   **AUTH-03 ---      User taps Google Sign-In     → DASH-01 Dashboard
           Google path**      button. OAuth flow           
                              completes.                   

  **2b**   **AUTH-03 ---      Inline error shown for wrong → Retry or AUTH-04
           Error state**      credentials. User corrects   
                              and retries or taps \"Forgot 
                              Password.\"                  
  -------- ------------------ ---------------------------- -------------------

**Flow A3 --- Password Reset \[P0\]**

  -----------------------------------------------------------------------
  Entry: \"Forgot Password\" link on AUTH-03.

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **AUTH-04 Forgot   User enters email. Taps      → AUTH-03 (with
           Password**         \"Send Reset Link.\" Toast:  toast)
                              \"Check your email.\"        

  **2**    **Email client     User opens Firebase password → AUTH-05 Web page
           (external)**       reset email. Taps reset      
                              link.                        

  **3**    **AUTH-05 Web      User enters and confirms new → Deep-link to
           Reset**            password. Taps \"Set         AUTH-03
                              Password.\"                  

  **4**    **AUTH-03 Sign     User signs in with new       → DASH-01 Dashboard
           In**               password.                    
  -------- ------------------ ---------------------------- -------------------

**Flow A4 --- Biometric Re-lock \[P0\]**

  -----------------------------------------------------------------------
  Entry: App resumes from background after auto-lock timeout (default
  30s).

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **AUTH-06          Full-screen overlay appears  → Biometric system
           Biometric Lock**   over whatever was last       dialog
                              shown. Biometric prompt      
                              fires immediately.           

  **2**    **Success**        Overlay dismisses. App       → Previous screen
                              resumes exactly where user   restored
                              left off.                    

  **2a**   **Fail × 3**       Device passcode/PIN prompt   → Device passcode
                              appears as fallback.         flow
  -------- ------------------ ---------------------------- -------------------

**5. Flow Group B --- Daily Core Flows**

These are the flows users run most often --- sometimes multiple times a
day. Speed, minimal taps, and clarity are the primary design goals.
Every interaction in this group should take under 30 seconds.

**Flow B1 --- Daily Check-In (Dashboard Review) \[P0\]**

  -----------------------------------------------------------------------
  Entry: Morning notification deep-link OR user opens app directly.
  Duration target: 30--60 seconds.

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **DASH-01 Home     User sees ManjeCharacter     Stay on DASH-01
           Dashboard**        mood and \"Available to      
                              Spend\" hero number at a     
                              glance.                      

  **2**    **DASH-01 ---      User reads AI insight.       → AI-02 (optional)
           Insight Card**     Optionally taps \"Chat with  
                              Manje\" if they want to      
                              discuss further.             

  **3**    **DASH-01 --- Top  User scans the 3 category    → BUD-05 Category
           Categories**       progress bars. Taps if any   Detail (optional)
                              looks unexpectedly high.     

  **4**    **DASH-01 --- Goal User glances at goal         Stay or → GOAL-03
           Snippet**          progress bar and projected   (optional)
                              date.                        

  **5**    **DASH-01 ---      User checks bills strip for  Stay or → BILL-01
           Upcoming Bills**   anything due today or        (optional)
                              tomorrow.                    
  -------- ------------------ ---------------------------- -------------------

**Flow B2 --- Add an Expense Transaction \[P0\]**

  -----------------------------------------------------------------------
  Entry: Tap ＋ tab (Quick Add Modal) OR tap + button in Activity Feed
  header. Most frequent flow in the app.

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **NAV-01 Quick Add Bottom sheet appears. User   → TXN-03 Add
           Modal**            taps \"Add Transaction.\"    Transaction (FS)

  **2**    **TXN-03 --- Type  \"Expense\" selected by      Stay on TXN-03
           & Amount**         default. User types amount   
                              on numeric keyboard.         

  **3**    **TXN-03 ---       User types merchant name. AI Stay on TXN-03
           Merchant**         category suggestion appears  
                              instantly below field.       

  **4**    **TXN-03 ---       AI suggestion shown in       Stay or tap picker
           Category**         category field with          
                              confidence badge. User taps  
                              to confirm or opens picker   
                              to change.                   

  **5**    **TXN-03 --- Date  Date defaults to today. User → Previous screen
           & Notes**          optionally adds note. Taps   
                              \"Save Transaction.\"        

  **5a**   **Budget alert     If save pushes a category    Toast on current
           triggered**        over 75%/90%/100%: in-app    screen
                              toast appears + push         
                              notification queued.         
  -------- ------------------ ---------------------------- -------------------

**Flow B3 --- Add an Income Transaction \[P0\]**

  -----------------------------------------------------------------------
  Entry: Same as B2 --- Quick Add Modal or + in Activity Feed.

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **NAV-01 Quick Add User taps \"Add              → TXN-03 Add
           Modal**            Transaction.\"               Transaction (FS)

  **2**    **TXN-03 --- Type  User taps \"Income\" type    Stay on TXN-03
           switch**           pill. Form updates ---       
                              merchant field becomes       
                              \"Source\" field.            

  **3**    **TXN-03 ---       User enters amount and       Stay on TXN-03
           Amount & Source**  income source name (or       
                              selects from saved sources   
                              \[P1\]).                

  **4**    **TXN-03 ---       Taps \"Save Transaction.\"   → Previous screen
           Save**             Income totals on DASH-01     
                              update immediately.          
  -------- ------------------ ---------------------------- -------------------

**Flow B4 --- Review & Edit a Transaction \[P0\]**

  -----------------------------------------------------------------------
  Entry: Tap any transaction row in ACT-01 Activity Feed.

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **ACT-01 Activity  User sees transaction in     → TXN-02
           Feed**             list. Taps the row.          Transaction Detail

  **2**    **TXN-02 Detail**  Full details shown. Edit     Stay or tap Edit /
                              button in top-right. Delete  Delete
                              (trash) icon also visible.   

  **3**    **TXN-04 Edit      Pre-filled form. User        → TXN-02
           Transaction**      changes any field. Taps      (refreshed)
                              \"Save Changes.\"            

  **4**    **TXN-02 ---       User taps delete icon.       → ACT-01 after
           Delete**           Confirmation modal: \"Delete deletion
                              this transaction? Cannot be  
                              undone.\" Cancel / Delete    
                              buttons.                     
  -------- ------------------ ---------------------------- -------------------

**Flow B5 --- Income Confirmation Prompt \[P2\]**

  -----------------------------------------------------------------------
  Entry: Background job detects a recurring income\'s expected date has
  passed without a matching credit transaction.

  -----------------------------------------------------------------------

  -------- -------------------- ---------------------------- -------------------
  **\#**   **Screen**           **What Happens / User        **Destination /
                                Action**                     Outcome**

  **1**    **Push               \"Has your Salary arrived    → TXN-06 on tap
           notification**       today?\" Timed to payment\'s 
                                expected date.               

  **2**    **TXN-06 Income      Modal shows income source,   Depends on action
           Confirmation**       expected amount (editable).  tapped
                                Three actions.               

  **2a**   **\"Yes,             Transaction auto-created     → Dismiss modal →
           received\"**         with expected amount and     DASH-01
                                today\'s date. Toast         
                                confirmation.                

  **2b**   **\"Reschedule\"**   Date picker appears. User    → Dismiss modal
                                selects new expected date.   
                                Reminder re-scheduled.       

  **2c**   **\"Enter            Opens TXN-03 pre-filled with → TXN-03
           manually\"**         income source and amount for 
                                user to review and save.     
  -------- -------------------- ---------------------------- -------------------

**6. Flow Group C --- Budget Management**

**Flow C1 --- Create Budget (AI-Assisted Path) \[P0\]**

  -----------------------------------------------------------------------
  Entry: Quick Add → \"Add Budget\" OR BUD-01 Budgets List → \"Create
  Budget.\" Recommended path for all new budgets.

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **NAV-01 Quick     User taps \"Add Budget.\"    → BUD-03 AI Budget
           Add**              App asks: \"AI-assisted or   Chat (FS)
                              manual?\" User picks AI.     

  **2**    **BUD-03 Step 1:   AI: \"What\'s your main      Stay in BUD-03
           Goals**            priority this month?\" User  
                              responds naturally.          

  **3**    **BUD-03 Step 2:   AI asks user to rank: saving Stay in BUD-03
           Prioritise**       / debt / essentials /        
                              lifestyle. Conversational.   

  **4**    **BUD-03 Step 3:   AI explains 50/30/20 rule    Stay in BUD-03
           Educate**          with a Malawian              
                              cost-of-living example. User 
                              taps \"Got it.\"             

  **5**    **BUD-03 Step 4:   AI: \"How much will you earn Stay in BUD-03
           Income**           this month?\" User types     
                              amount.                      

  **6**    **BUD-03 Step 5:   AI asks about known fixed    Stay in BUD-03
           Expenses**         costs --- rent, school fees, 
                              loan payments. User enters   
                              each (or picks from stored   
                              expenses \[P1\]).       

  **7**    **BUD-03 Step 6:   AI generates allocation.     Stay in BUD-03
           Generate**         ManjeCharacter \"thinking\"  
                              mood. Budget preview card    
                              shown.                       

  **8**    **BUD-03 Step 7:   User reviews allocations.    Stay in BUD-03
           Review**           Can say \"Less on dining\"   
                              --- AI adjusts               
                              conversationally.            

  **9**    **BUD-03 Step 8:   User taps \"Save This        → BUD-02 Budget
           Save**             Budget.\" Budget written to  Overview
                              SQLite. Set as primary if    
                              first.                       

  **10**   **BUD-02 Budget    New budget displayed with    ← Back → DASH-01
           Overview**         all categories. Toast:       
                              \"Budget created!\"          
                              Dashboard updates.           
  -------- ------------------ ---------------------------- -------------------

**Flow C2 --- Respond to a Budget Alert \[P0\]**

  -----------------------------------------------------------------------
  Entry: Push notification \"Dining budget 90% used\" --- user taps.

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **Push             \"Dining budget 90% used --- → BUD-05 Category
           notification       MWK 450 remaining.\" User    Detail
           \[DL\]**           taps notification.           

  **2**    **BUD-05 Category  Shows limit, amount spent, % Stay or take action
           Detail**           used, remaining, and list of 
                              transactions in category     
                              this period.                 

  **3a**   **Recategorize a   User taps a transaction they ← Back to BUD-05
           transaction**      think is miscategorized →    (updated)
                              TXN-04 Edit. Budget          
                              recalculates on return.      

  **3b**   **Adjust category  User taps \"Adjust Limit.\"  ← BUD-05 (updated)
           limit**            Inline or modal: new limit   
                              entry. Budget recalculates   
                              immediately.                 

  **3c**   **Chat with        User taps \"Chat with        → AI-02
           Manje**            Manje.\" AI gets full        
                              context of the overspend and 
                              suggests actions.            
  -------- ------------------ ---------------------------- -------------------

**Flow C3 --- Shared Budget Setup \[P2\]**

  -----------------------------------------------------------------------
  Entry: SB-01 Shared Finance Hub → \"Create Shared Budget.\"

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **SB-01 Shared     User taps \"Create Shared    → BUD-09 Shared
           Finance Hub**      Budget.\"                    Budget Setup (FS)

  **2**    **BUD-09 Setup**   User names budget, sets      → SB-04 Send Invite
                              combined income, assigns     
                              category limits. Taps        
                              \"Invite Partner.\"          

  **3**    **SB-04 Send       Invite link generated. User  → BUD-09 (pending
           Invite**           shares via WhatsApp or       partner)
                              enters partner email.        

  **4**    **SB-05 Accept     Partner opens link. Manje    → SB-02 Shared
           Invite (partner)** opens SB-05. Partner sees:   Budget (both)
                              who invited, budget name,    
                              structure. Taps \"Accept.\"  

  **5**    **SB-02 Shared     Both users now see the       Live shared view
           Budget Detail**    shared budget. Each user\'s  
                              transactions post to the     
                              shared feed.                 
  -------- ------------------ ---------------------------- -------------------

**7. Flow Group D --- Goals & Savings**

**Flow D1 --- Create a Savings Goal \[P0\]**

  -----------------------------------------------------------------------
  Entry: Quick Add → \"Add Goal\" OR GOAL-01 Goals List → \"+\" OR YOU-01
  goals section.

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **NAV-01 Quick     User taps \"Add Goal.\"      → GOAL-02 Create
           Add**                                           Goal (FS)

  **2**    **GOAL-02 --- Type User selects goal type       Stay on GOAL-02
           & Name**           (e.g., Emergency Fund).      
                              Types goal name.             
                              ManjeCharacter reacts to     
                              goal type.                   

  **3**    **GOAL-02 ---      User enters target amount.   Stay on GOAL-02
           Target &           Optional deadline. Required  
           Timeline**         monthly contribution         
                              auto-calculated and shown.   

  **4**    **GOAL-02 ---      User picks icon emoji and    Stay on GOAL-02
           Personalise**      colour theme.                

  **5**    **GOAL-02 ---      Taps \"Create Goal.\" Goal   → GOAL-03 Goal
           Save**             saved. Set as primary if     Detail
                              first goal.                  

  **6**    **GOAL-03 Goal     Goal shown at 0% with empty  Home base for this
           Detail**           contribution history. \"Add  goal
                              Contribution\" CTA           
                              prominent. Dashboard         
                              updates.                     
  -------- ------------------ ---------------------------- -------------------

**Flow D2 --- Add Contribution & Hit a Milestone \[P0\]** (milestone celebration \[P1\])

  -----------------------------------------------------------------------
  Entry: GOAL-03 → \"Add Contribution\" button OR notification deep-link
  to goal.

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **GOAL-03 Goal     User taps \"Add              → GOAL-04 Add
           Detail**           Contribution.\"              Contribution Modal
                                                           (M)

  **2**    **GOAL-04          User enters amount, optional → GOAL-03
           Contribution       note (\"August savings\").   (refreshed)
           Modal**            Taps \"Add.\"                

  **3**    **GOAL-03 ---      Progress bar animates to new Stay on GOAL-03
           Animated update**  percentage. Projected date   
                              updates.                     

  **4**    **Milestone        If contribution pushes goal  → GOAL-06
           check**            to 25%, 50%, 75%, or 100%:   Celebration Overlay
                              milestone overlay fires      
                              automatically.               

  **5**    **GOAL-06          ManjeCharacter celebration   → GOAL-03 or
           Milestone          animation, confetti,         DASH-01
           Celebration**      milestone message. Taps      
                              \"Keep Going!\" or \"View    
                              Goal.\"                      
  -------- ------------------ ---------------------------- -------------------

**8. Flow Group E --- Bills Management \[P1\]**

**Flow E1 --- Add a Recurring Bill \[P1\]**

  -----------------------------------------------------------------------
  Entry: BILL-01 Bills List → \"+\" OR Quick Add modal (after budget
  exists).

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **BILL-01 Bills    User taps \"+\" in header.   → BILL-02 Create
           List**                                          Bill (FS)

  **2**    **BILL-02 --- Name User enters bill name (e.g., Stay on BILL-02
           & Amount**         \"Electricity\"), amount.    
                              Toggles \"Variable amount\"  
                              if bill changes each month.  

  **3**    **BILL-02 ---      User sets due day of month   Stay on BILL-02
           Schedule**         (e.g., 15) and frequency     
                              (monthly).                   

  **4**    **BILL-02 ---      Default: 3-day, 1-day,       Stay on BILL-02
           Reminders**        day-of reminders. User can   
                              add or remove reminder days. 

  **5**    **BILL-02 ---      Taps \"Save Bill.\" Bill     → BILL-01 (updated)
           Save**             written. Push notifications  
                              scheduled. \"Available to    
                              Spend\" recalculates.        
  -------- ------------------ ---------------------------- -------------------

**Flow E2 --- Respond to Bill Reminder & Mark Paid \[P1\]**

  -----------------------------------------------------------------------
  Entry: Push notification \"Electricity due in 3 days\" --- user taps.

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **Push             \"Electricity bill due in 3  → BILL-01 (bill
           notification       days --- MWK 12,000.\" User  highlighted)
           \[DL\]**           taps.                        

  **2**    **BILL-01 Bills    Bill shown at top in         → BILL-05 Mark Paid
           List**             red/yellow with urgency      Modal (M)
                              indicator. Tap \"Paid\"      
                              quick-action button on the   
                              bill row.                    

  **3**    **BILL-05 Mark     Confirms: bill name, amount  → BILL-01 (updated)
           Paid Modal**       (editable for variable       
                              bills), date (defaults to    
                              today). Taps \"Confirm       
                              Payment.\"                   

  **4**    **BILL-01          Bill status → \"Paid.\"      Updated list view
           Updated**          Green checkmark. Next due    
                              date advances to next cycle. 
  -------- ------------------ ---------------------------- -------------------

**9. Flow Group F --- Village Savings (Chiperegani) \[P2\]**

All screens and flows in this group are P2 features. These flows
define the complete intended experience for village savings groups and
serve as the design brief for this feature area.

**Flow F1 --- Join a Village Savings Group (Member) \[P2\]**

  -----------------------------------------------------------------------
  Entry: VS-01 Village Savings Hub → \"Join a Group\" OR tap invite link
  shared by group manager.

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **VS-01 Village    User taps \"Join a Group.\"  → VS-02 Create/Join
           Savings Hub**                                   Screen

  **2**    **VS-02 --- Join   User enters invite code or   Stay on VS-02
           tab**              scans QR. Group summary      
                              shown: name, contribution    
                              amount, frequency, number of 
                              members.                     

  **3**    **VS-02 ---        User sees rotation position  → VS-03 Group
           Confirm join**     they\'ve been assigned. Taps Detail
                              \"Join Group.\"              

  **4**    **VS-03 Group      Empty contribution history.  Home base for this
           Detail**           Next due date shown          group
                              prominently. Rotation        
                              position shown.              
  -------- ------------------ ---------------------------- -------------------

**Flow F2 --- Record a Contribution (Member) \[P2\]**

  -----------------------------------------------------------------------
  Entry: Contribution reminder notification OR VS-03 → \"Record
  Contribution\" CTA.

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **Reminder         \"Your \[Group\]             → VS-03 Group
           notification**     contribution of MWK 5,000 is Detail
                              due tomorrow.\" User taps.   

  **2**    **VS-03 Group      Next contribution            → VS-04 Record
           Detail**           highlighted. User taps       Contribution Modal
                              \"Record Contribution.\"     (M)

  **3**    **VS-04 Modal**    Group name, expected amount  → VS-03 (updated)
                              (editable), date paid,       
                              source account. Taps         
                              \"Record.\"                  

  **4**    **VS-03 Updated**  Contribution added to        Updated view
                              history. Monthly budget      
                              updated --- contribution     
                              shown as fixed cost.         
  -------- ------------------ ---------------------------- -------------------

**Flow F3 --- Track Rotating Collection (Chilimba) \[P2\]**

  -----------------------------------------------------------------------
  Entry: VS-03 Group Detail → \"View Rotation Schedule.\"

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **VS-03 Group      \"Your rotation: Cycle 4 of  → VS-05 Rotation
           Detail**           8 --- receiving in 3         Schedule
                              cycles.\" User taps \"View   
                              Rotation Schedule.\"         

  **2**    **VS-05 Rotation   Full calendar: each cycle,   Read-only,
           Schedule**         recipient name, projected    informational
                              pool size. User\'s cycle     
                              highlighted prominently.     

  **3**    **Rotation receipt VS-03 surface shows: \"Your  Auto-updated on
           cycle arrives**    rotation payout of MWK       cycle date
                              40,000 is due this cycle.\"  
                              User\'s balance projection   
                              updated.                     
  -------- ------------------ ---------------------------- -------------------

**Flow F4 --- Group Manager Creates Group & Records Payments \[P2\]**

  -----------------------------------------------------------------------
  Entry: VS-01 Hub → \"Create a Group.\" This is the manager-side flow
  --- distinct from the member join flow.

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **VS-01 Village    User (manager) taps \"Create → VS-02 Create
           Savings Hub**      a Group.\"                   Group tab (FS)

  **2**    **VS-02 --- Create Manager enters: group name,  → VS-07 Manager
           tab**              contribution amount and      Dashboard
                              frequency, number of         
                              members, rotation schedule,  
                              loan interest rate. Taps     
                              \"Create Group.\"            

  **3**    **VS-07 Manager    Member list shown with all   Manager home base
           Dashboard**        members in \"Pending\"       
                              state. Invite link shown at  
                              top.                         

  **4**    **VS-07 --- Invite Manager taps \"Invite        Members join via
           members**          Members.\" Invite link and   VS-02 Join
                              QR code generated. Shares    
                              via WhatsApp.                

  **5**    **VS-07 --- Mark   Manager taps member row.     → VS-07 (member row
           payment received** Modal: \"Mark \[Name\] as    turns green)
                              paid --- MWK 5,000?\" Taps   
                              \"Confirm.\"                 

  **6**    **Member app       Real-time Firestore sync:    Member app updated
           auto-updates**     member\'s VS-03 updates      silently
                              automatically. Contribution  
                              shown as recorded without    
                              member doing anything.       

  **7**    **VS-08            Manager taps \"Export        → Device share
           Operational        Report.\" PDF generated: all sheet
           Report**           contributions and loan       
                              records for the cycle.       
  -------- ------------------ ---------------------------- -------------------

**10. Flow Group G --- Debt & Loan Management \[P2\]**

**Flow G1 --- Add a Loan \[P2\]**

  -----------------------------------------------------------------------
  Entry: DEBT-01 Loans Overview → \"Add Loan.\"

  -----------------------------------------------------------------------

  -------- --------------------- ---------------------------- -------------------
  **\#**   **Screen**            **What Happens / User        **Destination /
                                 Action**                     Outcome**

  **1**    **DEBT-01 Loans       User taps \"Add Loan.\"      → DEBT-02 Add Loan
           Overview**                                         (FS)

  **2**    **DEBT-02 --- Type    User picks loan type: Bank / Stay on DEBT-02
           selection**           Village Bank / Community /   
                                 Employer / Personal. Form    
                                 adapts to type.              

  **3a**   **DEBT-02 --- Bank    Principal, interest rate     Stay on DEBT-02
           loan fields**         (%), term in months, start   
                                 date, repayment frequency.   
                                 App calculates monthly       
                                 repayment and shows          
                                 amortization preview.        

  **3b**   **DEBT-02 ---         Flexible fields: custom      Stay on DEBT-02
           Village/community**   repayment amount per period, 
                                 interest amount (flat),      
                                 non-standard structures      
                                 supported.                   

  **4**    **DEBT-02 --- Save**  Taps \"Save Loan.\" Monthly  → DEBT-03 Loan
                                 repayment added as fixed     Detail
                                 cost to budget. \"Available  
                                 to Spend\" recalculates.     

  **5**    **DEBT-03 Loan        Amortization table shown.    Loan home screen
           Detail**              Progress bar: remaining      
                                 principal. Next payment      
                                 highlighted.                 
  -------- --------------------- ---------------------------- -------------------

**Flow G2 --- Record a Loan Repayment \[P2\]**

  -----------------------------------------------------------------------
  Entry: Monthly budget reminder OR DEBT-03 Loan Detail → \"Record
  Payment.\"

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **DEBT-03 Loan     User sees next payment due.  → DEBT-04 Record
           Detail**           Taps \"Record Payment.\"     Payment Modal (M)

  **2**    **DEBT-04 Modal**  Expected amount shown        → DEBT-03 (updated)
                              (editable).                  
                              Principal/interest split     
                              displayed (read-only). Date, 
                              source account. Taps         
                              \"Confirm.\"                 

  **3**    **DEBT-03          Remaining balance decreases. Updated view
           Updated**          Paid rows in amortization    
                              table marked. Running total  
                              updates.                     
  -------- ------------------ ---------------------------- -------------------

**11. Flow Group H --- AI Assistant (Manje Chat) \[P1\]**

**Flow H1 --- General Financial Conversation \[P1\]**

  -----------------------------------------------------------------------
  Entry: Manje tab (AI-01) OR \"Chat with Manje\" CTA on DASH-01.

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **AI-01 Manje Chat User sees ManjeCharacter     → AI-02 on first
           Home**             hero and 4 quick action      message
                              cards (Analyse Spending,     
                              Create Budget, Set Goal, Get 
                              Tips). Can tap card or type  
                              freely.                      

  **2**    **AI-02 Active     User types or taps a         Stay on AI-02
           Chat**             suggestion chip (\"How am I  
                              doing?\"). ManjeCharacter    
                              \"thinking\" mood during API 
                              call (typically 2--4         
                              seconds).                    

  **3**    **AI-02 --- AI     Response appears with        Stay or tap action
           Response**         ManjeMood badge. AI may      button
                              include action button if it  
                              suggests a next step.        

  **4**    **AI-02 --- Action User taps inline action      → BUD-03 or GOAL-02
           button**           button (e.g., \"Set Up       etc.
                              Budget\"). App navigates     
                              directly to the creation     
                              flow.                        

  **5**    **AI-02 ---        User follows up. AI holds    Ongoing on AI-02
           Continued convo**  context of last 30 messages  
                              across sessions.             
  -------- ------------------ ---------------------------- -------------------

**Flow H2 --- AI-Assisted Budget Creation (From Chat) \[P1\]**

  -----------------------------------------------------------------------
  Entry: AI-01 quick action card \"Create Budget\" OR user types \"Help
  me create a budget.\"

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **AI-02 Chat**     User taps \"Create Budget\"  → BUD-03 AI Budget
                              card or asks in natural      Chat (FS)
                              language.                    

  **2**    **BUD-03 Steps     Full 8-step conversational   → BUD-02 on
           1--8**             budget creation flow. (See   completion
                              Flow C1 for full detail.)    
  -------- ------------------ ---------------------------- -------------------

**12. Flow Group I --- Human Financial Planner \[P3\]**

All screens in this group are P3 features. These flows define the
end-to-end experience for both the user (client) side and the planner
side.

**Flow I1 --- Discover & Connect with a Planner \[P3\]**

  -----------------------------------------------------------------------
  Entry: You Tab → \"Work with a Planner\" menu item OR Education Hub
  CTA.

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **PL-01 Planner    User browses planner         → PL-02 Planner
           Discovery**        profiles. Can filter by goal Profile
                              type (debt, savings,         
                              investment). Taps a planner  
                              card.                        

  **2**    **PL-02 Planner    Full profile: credentials,   → PL-03 Data
           Profile**          approach, availability,      Permissions
                              pricing. Taps \"Connect with 
                              \[Name\].\"                  

  **3**    **PL-03 Data       TRUST-CRITICAL SCREEN. User  → PL-04 Planner
           Permissions**      sees data category toggles   Chat
                              with plain-language labels.  
                              Reads summary line. Taps     
                              \"Grant Access & Connect.\"  

  **4**    **PL-04 Planner    Planner receives             Ongoing messaging
           Chat**             notification of new          channel
                              connection. Sends welcome    
                              message. User can reply.     
  -------- ------------------ ---------------------------- -------------------

**Flow I2 --- Book an Appointment with a Planner \[P3\]**

  -----------------------------------------------------------------------
  Entry: PL-02 Planner Profile → \"Book Appointment\" OR PL-04 Chat →
  \"Schedule Meeting.\"

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **PL-05 Book       Calendar grid of planner\'s  Stay on PL-05
           Appointment**      available time slots. User   
                              taps preferred date and      
                              time.                        

  **2**    **PL-05 ---        User adds optional agenda    → PL-06 Upcoming
           Confirm**          note. Taps \"Confirm         Appointments
                              Booking.\"                   

  **3**    **PL-06            Appointment shown as         Live status updates
           Appointments**     \"Pending.\" Planner         
                              notified. On planner         
                              confirmation, status →       
                              \"Confirmed.\" Both receive  
                              reminders 24h and 1h before. 
  -------- ------------------ ---------------------------- -------------------

**Flow I3 --- Receive & Accept Planner Recommendations \[P3\]**

  -----------------------------------------------------------------------
  Entry: Push notification \"Your planner has sent you a new budget
  plan.\"

  -----------------------------------------------------------------------

  -------- ------------------- ---------------------------- -------------------
  **\#**   **Screen**          **What Happens / User        **Destination /
                               Action**                     Outcome**

  **1**    **Push notification \"\[Planner Name\] has       → PL-07
           \[DL\]**            prepared a custom budget     Recommendations
                               plan for you.\" User taps.   

  **2**    **PL-07             User reviews planner\'s      Depends on action
           Recommendations**   budget/goal module with      
                               planner notes. Three action  
                               buttons.                     

  **2a**   **\"Accept &        Budget/goal created from     → BUD-02 or GOAL-03
           Apply\"**           planner\'s template. Saved   
                               to user\'s account.          

  **2b**   **\"Modify\"**      Opens BUD-04 or GOAL-02      → Creation screen
                               pre-filled with planner      (pre-filled)
                               values. User adjusts before  
                               saving.                      

  **2c**   **\"Decline\"**     Confirmation modal. Planner  → PL-04 Planner
                               notified. User adds optional Chat
                               reason.                      
  -------- ------------------- ---------------------------- -------------------

**13. Flow Group J --- Analytics & Reporting**

**Flow J1 --- Weekly Financial Health Report \[P1\]**

  -----------------------------------------------------------------------
  Entry: Sunday push notification OR DASH-01 insight card → \"See Full
  Report.\"

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **Push             \"Your weekly financial      → RPT-01 Weekly
           notification       report is ready.\" User      Report
           \[DL\]**           taps.                        

  **2**    **RPT-01 Weekly    Full report: week\'s         Scroll-only ---
           Report**           income/expenses, category    read
                              breakdown, week-over-week    
                              comparison, anomalies, AI    
                              summary message,             
                              ManjeCharacter mood.         

  **3**    **RPT-01 ---       Anomalies listed with        → TXN-02
           Anomaly row**      explanation. Tap to see the  Transaction Detail
                              specific transaction.        

  **4**    **RPT-01 --- AI    Personalised weekly tip.     → AI-02 (optional)
           insight**          \"Chat with Manje\" button   
                              if user wants to discuss.    
  -------- ------------------ ---------------------------- -------------------

**Flow J2 --- Export Monthly Summary as PDF \[P2\]**

  -----------------------------------------------------------------------
  Entry: RPT-03 Monthly Summary → \"Export as PDF.\"

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **RPT-03 Monthly   User reviews the full month: Stay on RPT-03
           Summary**          income, spending by          
                              category, goal               
                              contributions, loan          
                              payments. All in MWK.        

  **2**    **RPT-03 ---       User taps \"Export as PDF.\" → Device share
           Export**           App generates branded PDF    sheet
                              summary.                     

  **3**    **Share sheet**    User shares via WhatsApp,    External --- flow
                              email, saves to files, or    complete
                              prints.                      
  -------- ------------------ ---------------------------- -------------------

**14. Flow Group K --- Settings & Account Management \[P0\]**

**Flow K1 --- Configure Notifications**

  -----------------------------------------------------------------------
  Entry: YOU-01 → Settings → Notifications.

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **YOU-01 You Tab** User taps \"Notifications\"  → SET-03
                              in settings section.         Notification
                                                           Settings

  **2**    **SET-03           Grouped toggles by           Stay --- toggle as
           Settings**         notification category. Time  needed
                              pickers for reminders. DND   
                              window setting.              

  **3**    **SET-03 ---       User taps \"Manage WhatsApp  → SET-08 WhatsApp
           WhatsApp link**    Delivery\" option.           Settings

  **4**    **SET-03 ---       Changes applied immediately. → YOU-01
           Save**             Notification schedule        
                              rebuilt in background. Toast 
                              confirmation.                
  -------- ------------------ ---------------------------- -------------------

**Flow K2 --- Enable Biometric Lock**

  -----------------------------------------------------------------------
  Entry: YOU-01 → Settings → Security.

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **YOU-01 You Tab** User taps \"Security.\"      → SET-04 Security
                                                           Settings

  **2**    **SET-04           Shows biometric toggle (with Stay --- configure
           Security**         capability label e.g.        as needed
                              \"Fingerprint Available\"),  
                              timeout picker, encryption   
                              status.                      

  **3**    **SET-04 ---       User toggles biometric on.   Confirmed on SET-04
           Enable biometric** System biometric prompt      
                              fires to confirm capability. 
                              On success: biometric lock   
                              active.                      

  **4**    **SET-04 --- Set   User selects timeout: 30s /  Applied immediately
           timeout**          1min / 5min / 15min / Never. 
  -------- ------------------ ---------------------------- -------------------

**Flow K3 --- Account Deletion (High Friction by Design)**

  -----------------------------------------------------------------------
  Entry: SET-06 Data & Privacy → \"Delete My Account.\" This is a
  destructive, irreversible action and must have strong friction.

  -----------------------------------------------------------------------

  -------- ------------------ ---------------------------- -------------------
  **\#**   **Screen**         **What Happens / User        **Destination /
                              Action**                     Outcome**

  **1**    **SET-06 Data &    User taps \"Delete My        → SET-09 Step 1
           Privacy**          Account\" --- shown in red   (FS)
                              at the very bottom of the    
                              screen.                      

  **2**    **SET-09 --- Step  Full list of what will be    → SET-09 Step 2
           1: Warning**       deleted (all transactions,   
                              budgets, goals, cloud data). 
                              \"This cannot be undone.\"   
                              Button: \"I Understand,      
                              Continue.\"                  

  **3**    **SET-09 --- Step  User must type the word      → Deletion in
           2: Confirm**       \"DELETE\" exactly in a text progress
                              field. \"Permanently         
                              Delete\" button stays        
                              disabled until match. Taps   
                              button.                      

  **4**    **Deletion         App wipes: local SQLite DB,  → AUTH-01 Welcome
           executes**         encryption keys, local       Screen
                              files, Firestore user data,  
                              Firebase Auth account.       
                              Progress indicator shown.    

  **5**    **AUTH-01          App appears as fresh         Clean state
           Welcome**          install. No data remains     
                              anywhere.                    
  -------- ------------------ ---------------------------- -------------------

**15. Key Screen Cards**

This section provides UI specifications for the most important screens.
Each card is a design brief: it defines required elements and the
interactions each element must support.

  -------------- ------------------------------ ------------------------------
  **DASH-01 Home                                
  Dashboard**                                   
  --- The most                                  
  important                                     
  screen ---                                    
  must answer 3                                 
  questions                                     
  instantly:                                    
  health?                                       
  obligations?                                  
  progress?                                     

                 **Key UI Elements**            **User Actions & Transitions**

  1              ManjeCharacter (size: lg ---   Tap ManjeCharacter → AI-02
                 mood driven by budget health)  

  2              \"Available to Spend\" large   Tap income/spent cards →
                 numeric display + colour-coded TXN-01 filtered by type
                 progress bar                   

  3              Income card: MTD amount +      \"Chat with Manje\" → AI-02
                 trend arrow (vs last period)   

  4              Spent card: MTD amount + trend Tap any spending category →
                 arrow (vs last period)         BUD-05 Category Detail

  5              Smart Insight Card: AI         Tap goal snippet → GOAL-03
                 message + ManjeMood badge +    
                 \"Chat with Manje\" CTA        

  6              Top 3 Spending Categories:     Tap upcoming bill → BILL-01
                 name, amount spent, progress   (highlighted)
                 bar, % of limit                

  7              Primary Goal Snippet: name,    Tap notification bell → NAV-02
                 progress bar, saved/target,    
                 projected date                 

  8              Upcoming Bills strip: next 3   Pull down to refresh →
                 bills, name, amount, days      re-fetch all data
                 remaining, urgency colour      

  9              Notification bell (top-right,  
                 badge count)                   
  -------------- ------------------------------ ------------------------------

  --------------- ------------------------------ ------------------------------
  **TXN-03 Add                                   
  Transaction**                                  
  --- Most                                       
  frequently used                                
  entry screen                                   
  --- must be                                    
  completable in                                 
  under 15                                       
  seconds for a                                  
  typical expense                                

                  **Key UI Elements**            **User Actions & Transitions**

  1               Type selector: 3 pills ---     Switch type pills → form
                  Expense \| Income \| Transfer  context changes (Income:
                                                 merchant → Source)

  2               Large amount input field       Type merchant name → AI
                  (numeric keyboard, MWK prefix) suggestion updates live

  3               Merchant/Payee text input (AI  Tap category → Category Picker
                  category suggestion shown      Bottom Sheet (M)
                  instantly below as user types) 

  4               Category selector field (shows Tap date → date picker modal
                  AI suggestion + confidence     
                  badge; tap to open full        
                  picker)                        

  5               Date field (defaults to today; Tap \"Save Transaction\" →
                  tap to open date picker)       save, return to previous
                                                 screen

  6               Notes input (optional, single  Tap back (if amount entered) →
                  line, keyboard type: text)     \"Discard changes?\"
                                                 confirmation modal

  7               Account selector (shown when   
                  multi-account active)
                  \[P2\]                    

  8               Recurring toggle               

  9               \"Save Transaction\" CTA ---   
                  full-width, disabled until     
                  amount is non-zero             
  --------------- ------------------------------ ------------------------------

  ------------- ------------------------------ ------------------------------
  **BUD-05                                     
  Budget                                       
  Category                                     
  Detail** ---                                 
  Deep-link                                    
  target from                                  
  budget alerts                                
  --- must                                     
  immediately                                  
  tell the user                                
  what went                                    
  wrong and how                                
  to fix it                                    

                **Key UI Elements**            **User Actions & Transitions**

  1             Category name, icon, budget    Tap transaction row → TXN-02
                limit for this period          Transaction Detail (to
                                               recategorize or edit)

  2             Large spend amount + \"of MWK  Tap \"Adjust Limit\" → inline
                X limit\" label                edit field or modal to enter
                                               new limit

  3             Colour-coded progress bar      \"Chat with Manje\" → AI-02
                (yellow/red depending on       (AI pre-loaded with category
                threshold crossed)             context)

  4             \"Amount remaining: MWK X\" or Swipe transaction left →
                \"Over by MWK X\" label        delete / recategorize quick
                                               actions

  5             Transactions list for this     Back → BUD-02 Budget Overview
                category this period (most     
                recent first)                  

  6             \"Adjust Limit\" text button   
                (inline)                       

  7             \"Chat with Manje\" CTA button 
                at bottom                      
  ------------- ------------------------------ ------------------------------

  ---------------- ------------------------------ ------------------------------
  **PL-03 Data                                    
  Permissions                                     
  \[PLANNED\]**                                   
  --- Most                                        
  trust-critical                                  
  screen in the                                   
  app --- the user                                
  must feel fully                                 
  in control of                                   
  what they share                                 

                   **Key UI Elements**            **User Actions & Transitions**

  1                Planner\'s name and photo at   Toggle any category → summary
                   top                            line updates in real-time

  2                Headline: \"Choose what        Tap \"Grant Access & Connect\"
                   \[Planner Name\] can see\"     → permissions saved, planner
                                                  notified, → PL-04

  3                Data category toggle rows      Tap \"Not Now\" → back to
                   (each with icon +              PL-02 (no connection made)
                   plain-language label + brief   
                   description):                  

  4                1\. Budget structure (your     Revoke access at any time →
                   spending limits and            SET-06 Data & Privacy
                   categories)                    

  5                2\. Spending summaries         
                   (category totals --- no        
                   individual transactions)       

  6                3\. Full transaction history   
                   (every individual expense and  
                   income)                        

  7                4\. Financial goals (targets   
                   and progress)                  

  8                5\. Loan and debt information  

  9                Dynamic summary: \"With these  
                   settings, \[Planner\] can see  
                   X, Y, and Z\"                  

  10               \"Grant Access & Connect\" CTA 
                   (full-width)                   

  11               \"Not Now\" secondary button   

  12               Link: \"Read our data sharing  
                   policy\"                       
  ---------------- ------------------------------ ------------------------------

  --------------- ------------------------------ ------------------------------
  **VS-03 Village                                
  Group Detail                                   
  \[PLANNED\]**                                  
  --- Central hub                                
  for one village                                
  savings group                                  
  --- must show                                  
  status and make                                
  the key action                                 
  obvious                                        

                  **Key UI Elements**            **User Actions & Transitions**

  1               Group name, avatar/colour,     Tap \"Record Contribution\" →
                  contribution amount and        VS-04 Modal
                  frequency                      

  2               Status card: \"Your \[Month\]  Tap \"View Rotation Schedule\"
                  contribution: PAID ✓ / DUE in  → VS-05
                  2 days / MISSED\"              

  3               \"Record Contribution\" CTA    Tap a loan card → VS-06 Loan
                  button (colour-coded: green if Detail
                  early, amber if due, red if    
                  late)                          

  4               Rotation card: \"You receive   \"Record Loan Payment\" →
                  in Cycle X --- \[projected     DEBT-04 Modal
                  date\] --- Projected: MWK      
                  \[amount\]\"                   

  5               Contribution history list:     Pull to refresh → Firestore
                  month / amount / status        sync (picks up manager-pushed
                  (paid/missed) per cycle        updates instantly)

  6               Loans section (if active):     
                  outstanding balance, next      
                  payment due, \"Record          
                  Payment\"                      

  7               \"View Rotation Schedule\" →   
                  VS-05                          

  8               \"View All Loans\" → VS-06     

  9               Group totals bar (total        
                  collected this cycle, member   
                  count)                         
  --------------- ------------------------------ ------------------------------

**16. Modal & Bottom Sheet Catalogue**

All modals use a consistent interaction pattern: dark scrim behind the
sheet, slide-up animation (300ms ease-out), dismiss by tapping the scrim
(except confirmation and mandatory modals). Confirmation modals require
an explicit button tap to dismiss.

  ------------- ------------------ ----------------------- ------------------
  **ID**        **Modal Name**     **Content & Purpose**   **Dismiss
                                                           Behaviour**

  **NAV-01**    Quick Add Modal    4 large action tiles    Tap scrim or drag
                                   with ManjeCharacter     down
                                   icons: Add Transaction, 
                                   Add Budget, Add Goal,   
                                   Chat with Manje.        

  **TXN-06      Income             Source name, expected   Only via action
  \[P2\]**      Confirmation       amount (editable),      button
                                   date. 3 action buttons. 
                                   Mandatory response.     

  **GOAL-04**   Add Contribution   Amount input, note      Tap scrim or
                                   field (optional),       Cancel
                                   account selector \[P2\]. 
                                   Add and Cancel buttons. 

  **BILL-05**   Mark Bill Paid     Bill name, amount       Tap scrim or
                                   (editable for           Cancel
                                   variable), date,        
                                   account. Confirm and    
                                   Cancel.                 

  **VS-04       Record             Group name, amount      Tap scrim or
  \[P2\]**      Contribution       (editable), date,       Cancel
                                   source account. Record  
                                   and Cancel.             

  **DEBT-04     Record Loan        Loan name, payment      Tap scrim or
  \[P2\]**      Payment            amount, P&I split       Cancel
                                   (read-only), date,      
                                   account. Confirm.       

  **EDU-05      Add Investment     Investment type,        Tap scrim or
  \[P3\]**                         institution, amount,    Cancel
                                   notes. Save and Cancel. 

  **SB-04       Send Invite        Generated invite link   Tap X or scrim
  \[P2\]**                         with copy and share     
                                   buttons. Close X.       

  **SB-05       Accept Invite      Inviter name, what is   Only via button
  \[P2\]**                         being shared, context.  
                                   Accept and Decline.     
                                   Mandatory.              

  **Confirm     Delete             \"Delete \[entity\]?    Cancel or scrim
  Delete**      Confirmation       This cannot be          closes
                                   undone.\" Cancel and    
                                   Delete (red).           

  **GOAL-06**   Milestone          Full-screen overlay.    Tap anywhere or
                Celebration        ManjeCharacter          button
                                   animation. Milestone    
                                   message. \"Keep         
                                   Going!\" button.        
  ------------- ------------------ ----------------------- ------------------

**17. Empty States & Error States**

**17.1 Empty States**

Every list screen must have a designed empty state. Empty states are not
\"no data\" messages --- they are guided first-time actions. Each must
include a ManjeCharacter mood, a relatable message, and a clear primary
CTA.

  ----------------- -------------------- -------------------- ----------------------
  **Screen**        **ManjeCharacter**   **Message**          **Primary CTA**

  **DASH-01 (no     encourage            \"Let\'s build your  \"Create My Budget\" →
  budget)**                              first budget         BUD-03
                                         together --- just a  
                                         few minutes.\"       

  **GOAL-01 (no     wave                 \"What are you       \"Add a Goal\" →
  goals)**                               saving for? Set your GOAL-02
                                         first goal and       
                                         let\'s track it.\"   

  **BILL-01 (no     happy                \"Add your recurring \"Add a Bill\" →
  bills)**                               payments so we never BILL-02
                                         let you get          
                                         surprised.\"         

  **ACT-01 (no      encourage            \"Your activity      \"Add Transaction\" →
  transactions)**                        shows up here. Start TXN-03
                                         with your first      
                                         transaction.\"       

  **VS-01 (no       wave                 \"Belong to a        \"Join a Group\" →
  groups) \[P2\]**                       village savings      VS-02
                                         group? Track         
                                         contributions and    
                                         rotation here.\"     

  **DEBT-01 (no     happy                \"No loans recorded. \"Add a Loan\" →
  loans) \[P2\]**                        Add any active       DEBT-02
                                         borrowings so Manje  
                                         can factor them into 
                                         your plan.\"         

  **AI-03 (no       thinking             \"We haven\'t        \"Start a
  history)**                             chatted yet. Ask me  Conversation\" → AI-02
                                         anything about your  
                                         money.\"             
  ----------------- -------------------- -------------------- ----------------------

**17.2 Error States**

+-----------------------------------------------------------------------+
| **Error State Patterns & Copy Guidelines**                            |
+-----------------------------------------------------------------------+
| Offline on app open: \"You\'re offline. Your data is safe here ---    |
| we\'ll sync when you reconnect.\" No blocking. Core features function |
| offline.                                                              |
|                                                                       |
| AI chat unavailable: \"Manje is thinking really hard right now ---    |
| try again in a moment.\" Retry button shown. Keyword fallback used    |
| for categorization.                                                   |
|                                                                       |
| Firestore sync failure (silent): Background retry. After 3            |
| consecutive failures, subtle banner: \"Sync delayed --- your data is  |
| safe on this device.\" No user action needed.                         |
|                                                                       |
| Biometric hardware unavailable: Graceful fallback to device           |
| PIN/passcode. Never breaks the auth flow.                             |
|                                                                       |
| Account creation: email already exists: Inline: \"This email is       |
| already linked to an account. Want to sign in instead?\" --- CTA      |
| button to Sign In.                                                    |
|                                                                       |
| Form validation errors: Always shown inline below the relevant field  |
| --- never as a blocking modal dialog. Red colour, specific message    |
| (never just \"Error\").                                               |
+-----------------------------------------------------------------------+

  -----------------------------------------------------------------------
  **End of Information Architecture & User Flows Document**

  -----------------------------------------------------------------------

No screen should enter the design or engineering pipeline without first
being listed and specified in this document. Propose additions by
presenting them in the next product planning session.
