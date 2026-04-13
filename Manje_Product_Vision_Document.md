**MANJE**

*Your Personal Finance Companion*

  -----------------------------------------------------------------------

  -----------------------------------------------------------------------

**PRODUCT VISION DOCUMENT**

  ----------------------------------- -----------------------------------
  **Version:**                        2.0 --- Product Bible

  **Status:**                         Living Document --- Canonical
                                      Reference

  **Date:**                           March 2026

  **Audience:**                       Engineering, Design, Product,
                                      Stakeholders
  ----------------------------------- -----------------------------------

**How to Use This Document**

This Product Vision Document is the single source of truth for the Manje
product. It serves as the blueprint from which all engineering
architecture decisions, UI/UX designs, and feature prioritization flow.
Every team member building, designing, or contributing to Manje should
treat this document as the canonical product bible.

+-----------------------------------------------------------------------+
| **Document Purpose by Discipline**                                    |
+-----------------------------------------------------------------------+
| Architects & Engineers --- Use Sections 4--8 to understand data       |
| flows, integration requirements, and feature contracts.               |
|                                                                       |
| UI/UX Designers --- Use Sections 3, 5, 9, and 10 to understand user   |
| personas, feature details, brand language, and the design system.     |
|                                                                       |
| Product Managers --- Use Sections 1--4 and 11--12 to align roadmap    |
| and prioritization decisions.                                         |
|                                                                       |
| Stakeholders --- Use Sections 1--3 and 12 for product direction and   |
| business model understanding.                                         |
+-----------------------------------------------------------------------+

When any conflict arises between this document and any other reference
material, this document takes precedence. As the product evolves, this
document must be updated before implementation begins on any new major
feature area.

**1. Executive Summary**

Manje is an intelligent personal finance management application built
specifically for the Malawian market and the broader Southern and
Eastern African context. The name \"Manje\" --- meaning \"now\" in
Chichewa --- reflects the product\'s core promise: give users an
immediate, clear, and honest picture of their financial life with
minimal friction.

The product bridges the gap between financial awareness and financial
action. Most people know they should budget, but they lack the time,
tools, and guidance to do so consistently. Manje removes those barriers
by combining zero-effort transaction tracking, AI-powered insights,
culturally-relevant financial education, and a warm, approachable brand
personality into a single mobile-first product.

Manje operates across three digital surfaces: a mobile app (primary), a
web platform, and a public marketing and waitlist site. The mobile app
is the richest product surface and the primary vehicle for delivering
value to end users.

+-----------------------------------------------------------------------+
| **The Manje Promise**                                                 |
+-----------------------------------------------------------------------+
| \"Know where your money is going. Know what to do next. Feel in       |
| control --- right now.\"                                              |
|                                                                       |
| Manje is not just a budgeting tool. It is a financial companion ---   |
| built for how people in Malawi and the region actually live, earn,    |
| save, and borrow.                                                     |
+-----------------------------------------------------------------------+

**2. Product Vision & Mission**

**2.1 Vision Statement**

To become the most trusted and effortlessly effective personal finance
companion for individuals and households across Africa --- helping
people achieve financial clarity, build wealth, and support each other
through intelligent automation, culturally-grounded design, and genuine
human connection.

**2.2 Mission Statement**

Manje\'s mission is to democratize financial management for working
Malawians and the broader African market by making it as easy to manage
money as it is to spend it --- through smart technology, empathetic
design, and a product that understands the way people here actually
earn, save, borrow, and invest.

**2.3 Core Philosophy**

The Manje product is built on five foundational philosophy pillars:

  -----------------------------------------------------------------------
  **Pillar**              **Description**
  ----------------------- -----------------------------------------------
  Zero-Effort Tracking    Users should not have to work hard to
                          understand their money. Every feature is
                          designed to minimize manual input while
                          maximizing insight.

  Contextual Intelligence Financial advice and nudges must be grounded in
                          the user\'s actual behaviour --- not
                          theoretical budgets. The product learns and
                          adapts to the individual.

  Cultural Relevance      Village savings groups, mobile money, informal
                          lending, multiple income streams --- these are
                          not edge cases in Manje\'s world. They are
                          first-class features.

  Privacy First           User financial data is among the most sensitive
                          data that exists. Manje operates with a
                          privacy-by-design approach --- encrypting data
                          at rest and in transit, and never selling user
                          data.

  Empathetic Design       Manje does not shame users for overspending. It
                          encourages, coaches, and celebrates. The
                          product speaks like a trusted friend, not an
                          auditor.
  -----------------------------------------------------------------------

**3. Market Context & Target Audience**

**3.1 Market Context**

Malawi, like much of sub-Saharan Africa, has a significant financial
management gap. Mobile money penetration is high (Airtel Money, TNM
Mpamba), yet personal financial literacy and formal budgeting adoption
remain low. Most working adults track expenses mentally or in physical
notebooks. Village savings groups (\"village banks\") are a mainstream
financial vehicle. Multiple income streams --- salary plus side
businesses --- are common. These realities create both the problem Manje
solves and the opportunity it captures.

The regional fintech landscape is growing, but most tools are either too
generic (built for Western markets), too complex (full banking apps), or
too narrow (payment-only). Manje occupies a deliberate gap: a personal
finance assistant that is smart, warm, offline-capable, and built
specifically for how African households manage money.

**3.2 Primary Target Audience**

Manje is built for working adults in Malawi aged 22--45. The primary
audience includes:

-   Young Professionals (22--35): Salaried workers with growing
    expenses, beginning to save, managing their first loans and
    financial obligations.

-   Household Financial Managers: Individuals (often couples) who manage
    shared household finances and want to coordinate better.

-   Entrepreneurs & Informal Workers: People with irregular or multiple
    income streams who need flexible tracking tools.

-   Village Savings Group Members: Individuals participating in one or
    more informal savings and credit groups.

**3.3 User Personas**

**Persona 1 --- \"The Busy Professional\" (Chisomo, 28)**

  -----------------------------------------------------------------------
  **Attribute**           **Detail**
  ----------------------- -----------------------------------------------
  Occupation              Marketing Officer at a private company in
                          Lilongwe

  Income                  Fixed monthly salary, occasional freelance work

  Pain Point              Knows she should budget but money always seems
                          to run out before month-end --- she cannot
                          identify why

  Goal                    Understand her spending patterns without
                          manually tracking every expense

  Motivation              Saving for a car and building a three-month
                          emergency fund

  Key Feature Need        Automated expense capture, budget intelligence,
                          savings goals, daily insights
  -----------------------------------------------------------------------

**Persona 2 --- \"The Household Manager\" (Tadala & Kondwani, 32 & 35)**

  -----------------------------------------------------------------------
  **Attribute**           **Detail**
  ----------------------- -----------------------------------------------
  Occupation              Nurse (Tadala) and Small Business Owner
                          (Kondwani)

  Income                  Two irregular income streams with different pay
                          cycles

  Pain Point              They argue about spending because neither knows
                          what the other has spent from shared funds

  Goal                    Have a single shared budget view so they can
                          coordinate household finances without conflict

  Motivation              Planning for their children\'s school fees and
                          home improvements

  Key Feature Need        Shared budgets, multi-income support, bills
                          management, shared goal tracking
  -----------------------------------------------------------------------

**Persona 3 --- \"The Village Savings Member\" (Limbani, 40)**

  -----------------------------------------------------------------------
  **Attribute**           **Detail**
  ----------------------- -----------------------------------------------
  Occupation              Teacher and small-scale farmer

  Income                  Salary plus seasonal farming income; belongs to
                          two village savings groups

  Pain Point              Loses track of contributions, borrowings, and
                          rotation schedules across two groups ---
                          everything is on paper

  Goal                    Track all village savings activity digitally so
                          he can plan cash flows around contribution
                          dates and loans

  Motivation              Better cash flow planning; avoid missing
                          contribution deadlines

  Key Feature Need        Village savings tracking, rotating collection
                          module, loan tracking, contribution reminders
  -----------------------------------------------------------------------

**Persona 4 --- \"The Aspiring Investor\" (Mphatso, 26)**

  -----------------------------------------------------------------------
  **Attribute**           **Detail**
  ----------------------- -----------------------------------------------
  Occupation              Software developer

  Income                  Fixed salary; wants to start investing but does
                          not know where to start

  Pain Point              Curious about treasury bills and shares but
                          overwhelmed by jargon and uncertainty

  Goal                    Get simple, regular updates about investment
                          opportunities and track what he has invested

  Motivation              Building long-term wealth beyond savings

  Key Feature Need        Investment awareness content, investment
                          tracker, financial education section
  -----------------------------------------------------------------------

**4. Product Surfaces**

Manje is a multi-surface product. Each surface has a distinct purpose
and audience. The mobile app is the primary product surface and receives
the most investment.

  -----------------------------------------------------------------------
  **Surface**             **Purpose**
  ----------------------- -----------------------------------------------
  Mobile App (manje/)     The primary user-facing product. An Expo/React
                          Native application delivering the full personal
                          finance experience. Source of truth for user
                          financial data. Offline-capable with background
                          sync.

  Web Platform            An authenticated browser experience mirroring
  (manje-web/)            core mobile features. Serves users who prefer
                          desktop access and hosts the internal admin
                          tooling for the Manje team.

  Landing Site            A public Next.js marketing site handling
  (manje-landing/)        product storytelling, waitlist capture,
                          feedback collection, business inquiries, and
                          mobile authentication support flows.
  -----------------------------------------------------------------------

  -----------------------------------------------------------------------
  **Implementation Priority Note**

  The mobile app is always the primary surface. Features should be
  designed, validated, and implemented on mobile first. Web parity
  follows. The landing site is an acquisition and marketing tool, not a
  product surface.
  -----------------------------------------------------------------------

**5. Feature Architecture**

Manje\'s feature set is organized into domains. Each domain represents a
coherent area of user need. Features within a domain share data models
and often share UI surfaces.

**5.1 Authentication & Security**

Security is foundational to Manje. Every architectural and UX decision
must treat user financial data as the most sensitive category of
personal data. The security model is privacy-by-design: data is isolated
per user, encrypted locally and in the cloud, and never shared with
third parties.

  -----------------------------------------------------------------------
  **Feature**         **Description**                 **Status**
  ------------------- ------------------------------- -------------------
  Email/Password Auth Sign up and sign in via         **Implemented**
                      Firebase Authentication with    
                      email and password. Includes    
                      password reset via email.       

  Google Sign-In      OAuth credential exchange for   **Implemented**
                      one-tap Google sign-in on       
                      mobile.                         

  Biometric Lock      Fingerprint, Face ID, or Iris   **Implemented**
                      recognition via                 
                      expo-local-authentication.      
                      Configurable auto-lock timeout  
                      (default 30 seconds). Falls     
                      back to device passcode.        

  Per-User DB         Each user gets an isolated      **Implemented**
  Isolation           SQLite database file            
                      (manje\_{userId}.db). Databases 
                      switch automatically on         
                      login/logout. Prevents any      
                      cross-user data leakage.        

  256-bit AES         SQLCipher encryption for the    **Implemented**
  Encryption          entire local SQLite database.   
                      Encryption keys stored in       
                      device Keychain/Keystore via    
                      expo-secure-store.              

  Field-Level Cloud   Sensitive Firestore fields      **Implemented**
  Encryption          (amounts, merchants, notes) are 
                      encrypted before upload using   
                      XOR encryption with IV. Keys    
                      never leave the device.         

  Data Retention      Automatic purge of SMS activity **Implemented**
  Policies            logs after 90 days and AI chat  
                      messages after 180 days.        

  Secure Account      Wipes local database,           **Implemented**
  Deletion            encryption keys, and Firebase   
                      account on deletion. No data    
                      orphaning.                      

  Security UI         Visible security badge on the   **Planned**
  Indicators          profile screen showing          
                      encryption and backup status to 
                      reassure users.                 
  -----------------------------------------------------------------------

**5.2 Onboarding**

Onboarding is the user\'s first experience of Manje as a brand, not just
as an app. It must tell the \"why\" story before the \"how\" story,
establish trust, and deliver value within the first three minutes. The
onboarding flow should be warm, clear, and celebratory --- setting the
tone for the entire product relationship.

The onboarding sequence:

1.  Welcome Screen --- Brand introduction with ManjeCharacter animation
    and value proposition. \"I\'m New\" and \"I Have an Account\" paths.

2.  Why Manje Exists --- Short storytelling moment grounded in the
    familiar experience of money disappearing without explanation.
    (Script to be authored by founding team.)

3.  Country & Currency Selection --- Choose country for localization.
    Currency auto-detected. Supports 50+ currencies including MWK.

4.  Notification Setup --- Configure notification preferences and
    request permission. Explain value clearly.

5.  Initial Goal Setting --- Set one primary financial goal to anchor
    the experience.

6.  Success Celebration --- ManjeCharacter celebration animation.
    Summary of setup. Transition to dashboard.

  -----------------------------------------------------------------------
  **Feature**         **Description**                 **Status**
  ------------------- ------------------------------- -------------------
  Welcome Screen      Branded intro with              **Implemented**
                      ManjeCharacter wave animation,  
                      tagline, and dual entry paths   
                      (new vs returning user).        

  Country Selection   Select country for currency and **Implemented**
                      localization context.           
                      Auto-detects currency from      
                      country.                        

  Currency Selection  Searchable list of 50+          **Implemented**
                      currencies with symbol and code 
                      display.                        

  Permission Request  Request notification            **Implemented**
                      permissions with clear          
                      plain-language explanation of   
                      each permission\'s value.       

  Notification        Configure reminder types and    **Implemented**
  Preferences         times during onboarding.        

  Goal Setting        Set primary financial goal      **Implemented**
                      (type, target amount, optional  
                      deadline) during onboarding.    

  Success Screen      Completion celebration with     **Implemented**
                      ManjeCharacter animation and    
                      \"Get Started\" button.         

  Brand Storytelling  Short narrative explaining why  **Planned**
  Screen              Manje exists using relatable    
                      local context. Script to be     
                      authored.                       
  -----------------------------------------------------------------------

**5.3 Dashboard & Home**

The dashboard is the most important screen in the app. It must answer
three questions at a glance: How am I doing today? What do I need to pay
soon? Am I on track with my goals? The ManjeCharacter\'s mood on the
dashboard must reflect the user\'s financial health status --- creating
an emotional, intuitive signal.

  -----------------------------------------------------------------------
  **Feature**         **Description**                 **Status**
  ------------------- ------------------------------- -------------------
  Available to Spend  Primary metric: budget          **Implemented**
  Hero Card           remaining minus upcoming bills. 
                      ManjeCharacter mood reflects    
                      health. Color-coded progress    
                      bar (green/yellow/red).         

  Income & Spent      Side-by-side cards showing      **Implemented**
  Metrics             month-to-date income and        
                      spending with trend indicators  
                      vs previous period.             

  Smart Insight Card  AI-generated context-aware      **Implemented**
                      insight with action button.     
                      Types: tip, warning, alert,     
                      celebrate. Shows ManjeMood      
                      badge.                          

  Top Spending        Visual breakdown of top 3       **Implemented**
  Categories          spending categories with        
                      progress bars and budget vs     
                      actual amounts.                 

  Primary Goal        Compact display of the primary  **Implemented**
  Snippet             goal with progress bar, saved   
                      amount vs target, and projected 
                      completion date.                

  Upcoming Bills      Shows bills due within the next **Implemented**
  Widget              7 days with urgency color       
                      coding.                         

  Activity Feed       Unified chronological feed of   **Implemented**
                      transactions and bills with     
                      filter pills (All, Expenses,    
                      Income, Bills).                 
  -----------------------------------------------------------------------

**5.4 Transaction Management**

Transaction management is the foundational data layer of Manje. Every
financial insight, budget calculation, and goal projection depends on
the quality and completeness of transaction data. The primary input
method is manual entry, supported by AI categorization to reduce effort.

  -----------------------------------------------------------------------
  **Architecture Note --- SMS Auto-Detection Removed**

  The automatic SMS transaction detection feature has been removed from
  the product. This feature required READ_SMS permissions which do not
  comply with Apple App Store guidelines and create friction on Android.
  Manual entry, AI-assisted categorization, and WhatsApp delivery remain
  the primary data input channels. Bank API integration is a future
  consideration.
  -----------------------------------------------------------------------

  -----------------------------------------------------------------------
  **Feature**         **Description**                 **Status**
  ------------------- ------------------------------- -------------------
  Manual Transaction  Add income/expense/transfer     **Implemented**
  Entry               with category, amount,          
                      merchant, date, notes, and      
                      account assignment. 15+         
                      categories supported.           

  AI-Powered          Automatic category suggestion   **Implemented**
  Categorization      based on merchant name using    
                      DeepInfra AI. Includes          
                      confidence scoring. Falls back  
                      to keyword-based rules.         

  Merchant Learning   Remembers user category         **Implemented**
                      corrections and builds a        
                      personal merchant rules         
                      database. Applied to future     
                      transactions from the same      
                      merchant.                       

  Transaction Review  Approve, reject, or edit        **Implemented**
  System              transactions that require       
                      review. Batch approval          
                      supported.                      

  Recurring Detection Identifies and flags recurring  **Implemented**
                      transactions and bills from     
                      transaction patterns.           

  Transaction History Searchable, filterable list     **Implemented**
                      with date range selection. Sort 
                      by date, amount, category.      

  Transaction         Modify any transaction detail.  **Implemented**
  Edit/Delete         Soft-delete with recovery       
                      option.                         

  Multi-Currency      50+ currencies with proper      **Implemented**
  Support             symbol display and formatting.  

  Income Confirmation For expected recurring income,  **Planned**
  Prompts             the app prompts: \"Has your     
                      salary arrived?\" --- allowing  
                      confirmation, rescheduling, or  
                      manual entry if not received.   

  Bank API            Direct connection to Malawian   **Future**
  Integration         bank APIs for automatic         
                      transaction import (subject to  
                      API availability).              
  -----------------------------------------------------------------------

**5.5 Budget Management**

Budgets are the primary financial planning tool in Manje. The budget
creation experience should feel like a conversation, not a form. The
AI-assisted budget creation flow guides users through a natural
conversation to create a realistic, personalised budget. Manje should
always encourage users to start somewhere --- an imperfect budget is
better than no budget.

  -----------------------------------------------------------------------
  **Feature**         **Description**                 **Status**
  ------------------- ------------------------------- -------------------
  AI-Assisted Budget  Multi-step conversational AI    **Implemented**
  Creation            flow. Steps: Goals → Prioritize 
                      → Education → Income → Expenses 
                      → Generate → Review → Save.     
                      Generates budget allocations    
                      respecting the 50/30/20 rule    
                      with local adjustments.         

  Multi-Budget        Create and manage multiple      **Implemented**
  Support             budgets. Mark one as primary    
                      for dashboard display. Supports 
                      monthly and weekly periods.     

  Category Budget     Set spending limits for 15+     **Implemented**
  Limits              categories. Each category       
                      tracks real-time progress.      

  Budget Progress     Color-coded progress bars       **Implemented**
  Tracking            (green \<75%, yellow 75--90%,   
                      red \>90%). Real-time           
                      percentage and remaining amount 
                      display.                        

  Budget Alerts       Push notifications at 75%, 90%, **Implemented**
                      and 100% of category budget     
                      limits with category-specific   
                      messaging.                      

  Budget Rollover     Optional rollover of unused     **Implemented**
                      budget amounts to the next      
                      period on a per-category basis. 

  Budget Templates    50/30/20 rule template and      **Implemented**
                      custom allocation templates for 
                      quick setup.                    

  Stored Fixed        Save recurring fixed expenses   **Planned**
  Expenses            (rent, school fees,             
                      subscriptions) so users can     
                      select stored amounts rather    
                      than re-entering each month.    
                      Edit stored values when they    
                      change.                         

  Shared Budgets      A shared budget that two users  **Planned**
  (Couples)           (e.g., spouses) can both view   
                      and post transactions against.  
                      Transactions tied to the shared 
                      budget appear in both users\'   
                      feeds.                          

  Group Budgets       Extend shared budgets to small  **Planned**
  (Friends/Goals)     groups for joint goals ---      
                      e.g., four friends saving for a 
                      shared trip. Includes           
                      accountability notifications    
                      when a member is falling        
                      behind.                         

  Budget Intelligence Charts and trend analysis       **Planned**
  Visualization       showing why spending changed    
                      month-over-month. Highlights    
                      predictable high-expense months 
                      (school fees season, etc.).     
  -----------------------------------------------------------------------

**5.6 Expenses & Income Management**

Manje must accommodate the realities of how people in the target market
earn: fixed salaries are common but so are irregular side-business
income, stipends, and seasonal farming income. The product must support
multiple income sources with flexible payment intervals and help users
anticipate when money is expected to arrive.

  -----------------------------------------------------------------------
  **Feature**         **Description**                 **Status**
  ------------------- ------------------------------- -------------------
  Multiple Income     Record and label multiple       **Planned**
  Sources             income streams (salary,         
                      freelance, business, farming,   
                      etc.) each with its own         
                      expected payment interval       
                      (weekly, biweekly, monthly,     
                      irregular).                     

  Income Interval     Set expected payment frequency  **Planned**
  Settings            per income source. System uses  
                      this to calculate expected      
                      monthly income and to trigger   
                      confirmation prompts.           

  Fixed Expense       Store and reuse common          **Planned**
  Storage             recurring expenses. Edit        
                      amounts when they change.       
                      Select from stored list when    
                      creating transactions.          

  Variable Expense    Mark bills or expenses as       **Implemented
  Flagging            variable amount so the system   (Bills)**
                      prompts for the actual amount   
                      each period rather than         
                      assuming a fixed value.         

  Multi-Account       Record balances across multiple **Planned**
  Balance Tracking    bank accounts and cash          
                      holdings. Show combined         
                      balance. Warn when upcoming     
                      repayments would exceed         
                      available funds.                

  Account Deduction   Record which account or cash    **Planned**
  Tracking            source a specific payment was   
                      deducted from to maintain       
                      accurate per-account balance    
                      records.                        
  -----------------------------------------------------------------------

**5.7 Bills Management**

Bills represent the most predictable and highest-stakes category of
financial obligation. Missing a bill payment causes stress, late fees,
and sometimes service interruption. Manje\'s bills management feature
must ensure that no bill catches a user by surprise.

  -----------------------------------------------------------------------
  **Feature**         **Description**                 **Status**
  ------------------- ------------------------------- -------------------
  Bill Creation       Add recurring bills with name,  **Implemented**
                      amount (fixed or variable), due 
                      day of month, frequency,        
                      category, icon, color, and      
                      reminder settings.              

  Bill Frequencies    Weekly, biweekly, monthly,      **Implemented**
                      quarterly, and yearly frequency 
                      support.                        

  Payment Status      Track each bill as pending,     **Implemented**
  Tracking            paid, or overdue. Payment       
                      confirmation prompts.           

  Multi-Tier          Default reminders at 3 days, 1  **Implemented**
  Reminders           day, and day-of. Customizable   
                      reminder days per bill.         

  Urgency Color       Green (7+ days), yellow (3--6   **Implemented**
  Coding              days), red (0--2 days), dark    
                      red (overdue).                  

  Available to Spend  \"Available to Spend\" hero     **Implemented**
  Impact              metric reserves upcoming bill   
                      amounts from the available      
                      balance.                        

  Bill Amount         Detect when a recurring bill    **Planned**
  Variation Alerts    amount changes significantly    
                      and alert the user to review.   
  -----------------------------------------------------------------------

**5.8 Goals & Savings**

Financial goals transform abstract financial ambitions into trackable,
celebratable achievements. Every Manje user should feel the positive
momentum of progress toward their goals. The goals feature must be
motivating, not guilt-inducing --- celebrating movement forward
regardless of pace.

  -----------------------------------------------------------------------
  **Feature**         **Description**                 **Status**
  ------------------- ------------------------------- -------------------
  Goal Creation       Create goals with name,         **Implemented**
                      description, target amount,     
                      deadline (optional), icon,      
                      color, and monthly contribution 
                      amount.                         

  Goal Types          Emergency Fund, Major Purchase, **Implemented**
                      Vacation/Travel, Debt           
                      Elimination, Investment Start,  
                      Custom.                         

  Progress Tracking   Visual progress bar, percentage **Implemented**
                      completion, amount remaining,   
                      projected completion date based 
                      on contributions.               

  Contribution        Add contributions with notes    **Implemented**
  History             and timestamps. Full            
                      contribution history per goal.  

  Goal Milestones     Celebrations at 25%, 50%, 75%,  **Implemented**
                      and 100% completion.            

  Primary Goal        Mark one goal as primary to     **Implemented**
  Display             appear on the dashboard         
                      snippet.                        

  Emergency Fund      Dedicated emergency fund goal   **Implemented**
  Tracker             type with nudges to create and  
                      maintain. Treats emergency fund 
                      balance as part of aggregate    
                      user balance.                   

  Savings Goal        Persistent notifications and    **Implemented**
  Notifications       nudges before spending          
                      decisions to prevent impulse    
                      spending that would compromise  
                      a savings goal.                 

  Group/Shared Goals  Create shared savings goals     **Planned**
                      with another user or a group    
                      (e.g., couple saving for a      
                      vacation). Contributions from   
                      both parties tracked separately 
                      and aggregated.                 
  -----------------------------------------------------------------------

**5.9 Debt & Loan Management**

Debt is a reality for most working adults in the target market. Beyond
formal bank loans, informal credit through village banks, employer
loans, and personal lending between friends and family are common. Manje
must provide a flexible debt tracking system that handles both formal
amortizing loans and informal community loan structures.

All loan repayments must be surfaced as fixed costs in the monthly
budget to ensure they are factored into the \"Available to Spend\"
calculation.

  -----------------------------------------------------------------------
  **Feature**         **Description**                 **Status**
  ------------------- ------------------------------- -------------------
  Standard Loan       Record bank loans with          **Planned**
  Tracking            principal, interest rate, term, 
                      and repayment frequency.        
                      Calculate and display           
                      amortization schedule showing   
                      paid vs remaining principal and 
                      interest.                       

  Community/Village   Flexible loan configuration for **Planned**
  Loan Tracking       village bank and circle lending 
                      products which have             
                      non-standard allocation rules   
                      between principal and interest. 

  Running Balance     Show current outstanding        **Planned**
  Display             balance after each payment.     
                      Distinguish between interest    
                      paid and principal paid to      
                      prevent confusion.              

  Multi-Loan Summary  View all active loans side by   **Planned**
                      side. Compare total monthly     
                      obligations. See combined debt  
                      exposure.                       

  Repayment as Fixed  Loan repayments automatically   **Planned**
  Costs               appear as fixed costs in        
                      monthly budget summaries and    
                      deduct from \"Available to      
                      Spend.\"                        

  Multi-Account       Compare upcoming repayment      **Planned**
  Shortfall Warning   obligations against combined    
                      available balances across all   
                      accounts and cash. Warn when    
                      shortfall is projected.         

  Debt Transfer       Record fund transfers between   **Planned**
  Widget              accounts for debt management    
                      purposes. Track which account a 
                      payment was deducted from.      
  -----------------------------------------------------------------------

**5.10 Village Savings (Chiperegani)**

Village savings groups --- known locally as \"chiperegani,\" \"village
banks,\" or \"chilimba\" --- are a cornerstone of informal financial
life in Malawi. These groups pool contributions, rotate lump sums among
members, and extend loans to members. For many users, their village
savings group is their primary savings vehicle and credit source.

This feature area is a first-class, culturally-essential part of the
Manje product. It must be designed with a deep understanding of how
these groups actually operate --- with their own rules, rotating
schedules, and informal governance structures.

+-----------------------------------------------------------------------+
| **Definition: Village Savings Group Types**                           |
+-----------------------------------------------------------------------+
| Chiperegani / Village Bank: Members make regular contributions. Funds |
| are pooled and rotated to one member per cycle (rotating collection / |
| chilimba). Group also extends loans to members at agreed interest.    |
|                                                                       |
| Chilimba (Rotating Credit): Pure rotating savings --- members each    |
| receive the full pool once per rotation cycle on a pre-agreed         |
| schedule.                                                             |
|                                                                       |
| Group Savings: Members save toward a collective goal (e.g., a group   |
| investment) rather than rotating.                                     |
+-----------------------------------------------------------------------+

  -----------------------------------------------------------------------
  **Feature**         **Description**                 **Status**
  ------------------- ------------------------------- -------------------
  Group Membership    Record membership in one or     **Planned**
  Tracking            more village savings groups.    
                      Track contribution amounts,     
                      frequency, and history per      
                      group.                          

  Contribution        Record individual deposits made **Planned**
  History             per cycle. Show paid vs missed  
                      contributions. Calculate        
                      outstanding balances.           

  Missed Contribution Alert members before            **Planned**
  Reminders           contribution due dates. Flag    
                      missed contributions in the     
                      record.                         

  Optional Meeting    Set recurring reminders for     **Planned**
  Reminders           group meeting dates.            

  Multiple Group      Support membership in multiple  **Planned**
  Support             simultaneous village savings    
                      groups. Each group tracked      
                      separately.                     

  Aggregated Group    Show total contributions,       **Planned**
  View                loans, and expected receipts    
                      across all groups in a single   
                      summary view.                   

  Rotating Collection Record the rotation schedule    **Planned**
  Module              --- who receives the pooled     
                      funds each cycle. Show when the 
                      current user is due to receive. 
                      Project incoming balance at     
                      rotation receipt and update the 
                      user\'s balance automatically.  

  Loan Tracking       Record loans received from the  **Planned**
                      group with principal, agreed    
                      interest rate, and repayment    
                      schedule. Show loan summary     
                      with remaining balance and next 
                      payment due.                    

  Loan Repayment as   Village bank loan repayments    **Planned**
  Fixed Cost          automatically appear in the     
                      monthly budget as fixed costs.  

  Group Manager Flow  A group leader (manager) can    **Planned**
                      create a group within Manje,    
                      add members, and mark           
                      contributions as received.      
                      Payments marked as received     
                      push real-time updates to each  
                      member\'s individual Manje app  
                      --- eliminating the need for    
                      paper or Excel records.         

  Group-Level         Group members can view          **Planned**
  Visibility          aggregated group health (total  
                      collected, total owed) without  
                      seeing individual member        
                      personal data beyond            
                      contribution status.            

  Operational Reports Group managers can export       **Planned**
                      contribution and loan records   
                      as reports.                     
  -----------------------------------------------------------------------

**5.11 AI Assistant (Manje Chat)**

The AI assistant is Manje\'s most distinctive feature. It transforms the
app from a passive tracker into an active financial coach. The assistant
must feel warm, encouraging, and knowledgeable --- like a brilliant,
financially-savvy friend who knows your exact financial situation and
speaks plainly.

The AI is powered by Meta Llama 3.3 70B via DeepInfra, with direct
app-to-API integration. All AI features require an active internet
connection. The assistant has access to the user\'s live financial
context --- current budget status, spending patterns, goal progress, and
upcoming bills.

  -----------------------------------------------------------------------
  **Feature**         **Description**                 **Status**
  ------------------- ------------------------------- -------------------
  General Financial   Conversational AI for any       **Implemented**
  Chat                financial question.             
                      Context-aware --- injects live  
                      budget, spending, goals, bills, 
                      and streak data. Warm,          
                      encouraging personality.        
                      Currency-aware.                 

  Conversation Memory Remembers the last 30 messages  **Implemented**
                      across sessions. Provides       
                      continuity across               
                      conversations.                  

  Quick Action        AI can suggest in-chat action   **Implemented**
  Buttons             buttons (Set Up Budget, Create  
                      Goal, Add Bill) that navigate   
                      directly to relevant screens.   

  Quick Suggestion    Pre-defined question chips for  **Implemented**
  Chips               common queries: \"How am I      
                      doing?\", \"Where\'s my money   
                      going?\", \"Help me save.\"     

  AI Budget Creation  Multi-step conversational flow  **Implemented**
                      to create a personalized        
                      budget. Guides users through    
                      goals, income, and expenses in  
                      natural language.               

  AI Categorization   Automatic transaction category  **Implemented**
                      suggestion based on merchant    
                      name. Batch categorization      
                      support.                        

  Anomaly Detection   Detects unusual spending (2x+   **Implemented**
                      category average, 2.5x+         
                      merchant average). Surfaces     
                      warnings with explanation.      

  Daily Insights      Morning insight (7:30 AM):      **Implemented**
                      daily allowance, MTD budget     
                      usage, spending plan. Evening   
                      insight (8:30 PM): today\'s     
                      recap, top category, over/under 
                      target.                         

  Financial Education AI provides educational content **Implemented**
  in Chat             contextually during budget      
                      setup and in response to        
                      questions.                      

  Planner-Crafted     Human financial planners can    **Planned**
  Budget Modules      create customized budget and    
                      goal modules and deliver them   
                      to clients through the app. See 
                      Section 5.12.                   
  -----------------------------------------------------------------------

**5.12 Human Financial Planner**

While AI provides accessibility and immediacy, some users want or need
the guidance of a real human financial professional. The human planner
feature introduces a marketplace/matchmaking layer connecting Manje
users with vetted financial planners operating within the app.

This is a premium feature. The planner model respects strict data
privacy --- planners only see data that the user explicitly grants them
access to. There is no default data sharing with any planner.

  -----------------------------------------------------------------------
  **Feature**         **Description**                 **Status**
  ------------------- ------------------------------- -------------------
  Planner Discovery & Users can browse or be matched  **Planned**
  Matching            with available financial        
                      planners. At scale, a matching  
                      algorithm pairs users with      
                      appropriate planners based on   
                      goals and financial profile.    

  Planner Invitation  Planners can send invitation    **Planned**
  & Onboarding        links to clients. Invited users 
                      follow an onboarding flow that  
                      connects them to their planner  
                      within the app.                 

  Tiered Data         Users control exactly what data **Planned**
  Permissions         their planner can see --- e.g., 
                      budget only, or budget plus     
                      transactions, or full profile.  
                      Permissions can be revoked at   
                      any time.                       

  Planner Dashboard   A dedicated planner-facing      **Planned**
                      dashboard showing all shared    
                      client data with messaging and  
                      scheduling capabilities.        

  In-App Messaging    Secure messaging between        **Planned**
                      planner and client within the   
                      app.                            

  Appointment         Clients book in-app             **Planned**
  Scheduling          appointments with planners.     
                      Planners can accept, postpone,  
                      or reschedule. Calendar         
                      integration.                    

  Customized          Planners craft personalized     **Planned**
  Budget/Goal Modules budget and goal plans for       
                      clients and push them into the  
                      client\'s app as a starting     
                      point.                          

  Monthly             Planner sends monthly review    **Planned**
  Accountability      prompts and reminders to        
  Reviews             clients. Tracks client progress 
                      against agreed goals.           

  PDF Client Reports  Planners can generate and       **Planned**
                      export PDF financial reports    
                      for their clients.              

  Premium Access      Human planner access is a       **Planned**
  Model               premium feature. Initial free   
                      trial period of 15--30 days.    
                      Tiered pricing thereafter.      
  -----------------------------------------------------------------------

**5.13 Financial Education**

Financial literacy is a prerequisite to financial action. Manje has a
responsibility to educate its users --- not with lengthy articles, but
with bite-sized, engaging content delivered at moments when it is most
relevant. Education content must be grounded in the Malawian financial
context: local investment products, local banks, local savings
mechanisms.

  -----------------------------------------------------------------------
  **Feature**         **Description**                 **Status**
  ------------------- ------------------------------- -------------------
  In-App Education    Short, digestible financial     **Planned**
  Snippets            tips and explainers surfaced    
                      contextually within the app --- 
                      e.g., when a user creates their 
                      first budget, a snippet on the  
                      50/30/20 rule appears.          

  Investment          Regularly updated content       **Planned**
  Awareness Section   covering local investment       
                      products: treasury bills,       
                      shares, money market funds.     
                      Concise, actionable summaries   
                      with links to longer-form       
                      content.                        

  YouTube Integration Short in-app content links to   **Planned**
                      longer illustrated YouTube      
                      explainer videos (no on-screen  
                      presenter ---                   
                      illustration-driven). Boosts    
                      product visibility and SEO.     

  Blog Integration    In-app content links to blog    **Planned**
                      posts for deeper reading.       
                      Supports SEO.                   

  Manje Avatar        The Manje avatar/character      **Planned**
  Content Host        hosts education content as a    
                      recognizable, recurring brand   
                      presence across formats.        

  Content Map         A structured content map guides **Planned**
                      production of educational       
                      material --- ensuring coverage  
                      of all key topics               
                      systematically.                 

  Investment Tracker  A lightweight investment        **Planned**
                      account view allowing users to  
                      record investment holdings,     
                      notes, and approximate values.  
                      Supports manual updates rather  
                      than real-time price feeds      
                      initially.                      

  Podcast Channel     Manje-branded podcast content   **Future**
  (Future)            as a future channel for         
                      financial education and         
                      community building.             
  -----------------------------------------------------------------------

**5.14 Notifications & Engagement**

Notifications are Manje\'s primary engagement mechanism. They must be
timely, relevant, and non-intrusive. The notification strategy is
grounded in behavioural science --- reminders are sent at times most
likely to prompt positive financial behaviour, not at arbitrary
intervals.

  -----------------------------------------------------------------------
  **Feature**         **Description**                 **Status**
  ------------------- ------------------------------- -------------------
  Daily Transaction   6 behaviorally-timed daily      **Implemented**
  Reminders           reminders (8AM, 10:30AM,        
                      12:30PM, 3PM, 6:30PM, 9PM). 36  
                      unique contextual message       
                      templates. Friendly,            
                      encouraging tone.               

  Morning Daily       7:30 AM daily allowance,        **Implemented**
  Insight             month-to-date usage, and        
                      spending plan.                  

  Evening Daily       8:30 PM spending recap,         **Implemented**
  Insight             comparison to daily target,     
                      follow-up recommendations.      

  Budget Alerts       At 75%, 90%, and 100% of        **Implemented**
                      category budget limits.         

  Bill Due Reminders  Customizable multi-tier         **Implemented**
                      reminders before bill due       
                      dates.                          

  Goal Milestone      Push notifications celebrating  **Implemented**
  Celebrations        25%, 50%, 75%, 100% goal        
                      completion.                     

  Streak At-Risk      Notify when a usage streak is   **Implemented**
  Alert               about to break.                 

  Do Not Disturb      Configurable quiet hours per    **Implemented**
                      user preference.                

  Granular            Per-type enable/disable for all **Implemented**
  Notification        notification categories.        
  Preferences                                         

  WhatsApp Daily      Opt-in daily financial summary  **Implemented**
  Reports             delivered via WhatsApp.         
                      Scheduled delivery, opt-in      
                      preference management, delivery 
                      logging.                        

  Village Savings     Contribution due date reminders **Planned**
  Reminders           and missed contribution alerts  
                      for village savings groups.     

  Accountability      In shared budgets and group     **Planned**
  Notifications       savings, notify group members   
  (Groups)            when someone is not following   
                      their budget or has missed a    
                      contribution.                   
  -----------------------------------------------------------------------

**5.15 Analytics & Insights**

  -----------------------------------------------------------------------
  **Feature**         **Description**                 **Status**
  ------------------- ------------------------------- -------------------
  Spending Analysis   Category breakdown with         **Implemented**
                      transaction count, percentage   
                      of total, and visual progress   
                      bars.                           

  Month-over-Month    Compare current month spending  **Implemented**
  Comparison          to the previous month by        
                      category.                       

  Weekly Health       Comprehensive weekly financial  **Implemented**
  Reports             health report with trends and   
                      anomaly highlights.             

  Financial Health    Overall financial health        **Implemented**
  Score               indicator based on budget       
                      adherence, goal progress, and   
                      spending patterns.              

  Subscription        Identify recurring charges that **Implemented**
  Detection           may be unused subscriptions.    

  AI-Generated        Personalized tips and           **Implemented**
  Insights            recommendations using AI based  
                      on actual spending behaviour.   

  Trend Analysis &    Visual trend charts answering   **Planned**
  Quick Snapshots     \"why did spending change?\"    
                      Highlights months with          
                      predictable high expenses       
                      (school fees season, December,  
                      etc.).                          

  Monthly Summaries & Exportable monthly financial    **Planned**
  Reports             summaries (PDF format) for      
                      users who prefer a readable     
                      overview.                       
  -----------------------------------------------------------------------

**5.16 Gamification & Engagement**

Manje uses game mechanics not as gimmicks but as genuine behavioural
reinforcement tools. Streaks and challenges reward consistency --- the
most important predictor of long-term financial health improvement.

  -----------------------------------------------------------------------
  **Feature**         **Description**                 **Status**
  ------------------- ------------------------------- -------------------
  Streak Tracking     Track consecutive days of app   **Implemented**
                      activity. Milestones at 3, 7,   
                      14, 30, 60, 90, 180, and 365    
                      days.                           

  Milestone           Character animations and push   **Implemented**
  Celebrations        notifications celebrating       
                      streak milestones.              

  Weekly Challenges   Micro-goals for weekly          **Implemented**
                      engagement (spending reduction, 
                      savings increase, transaction   
                      logging). Status: active,       
                      completed, failed, skipped.     

  Achievement System  Track total active days and     **Implemented**
                      longest streak.                 
  -----------------------------------------------------------------------

**5.17 Settings & Profile**

  -----------------------------------------------------------------------
  **Feature**         **Description**                 **Status**
  ------------------- ------------------------------- -------------------
  Profile Management  Edit display name, email (view  **Implemented**
                      only), and avatar/profile       
                      picture.                        

  Currency Settings   Change primary currency from    **Implemented**
                      50+ options. Country flag       
                      display.                        

  Notification        Configure all notification      **Implemented**
  Settings            types, times, thresholds, and   
                      Do Not Disturb hours.           

  Security Settings   Enable/disable biometric lock,  **Implemented**
                      configure auto-lock timeout,    
                      view encryption status.         

  Merchant Rules      View, edit, and delete learned  **Implemented**
                      auto-categorization rules.      

  Data Export         Export financial data to CSV    **Planned**
                      and PDF formats.                

  Theme Settings      Light/dark mode toggle.         **Planned**

  Language Settings   Support for Chichewa and        **Planned**
                      English. English as selectable  
                      language for business-context   
                      users.                          

  Plain-Language      Clear, concise in-app data      **Planned**
  Privacy Notices     notices explaining what data is 
                      collected, where stored, who    
                      can see it, and how it is       
                      protected. No legal jargon.     
  -----------------------------------------------------------------------

**6. Data Architecture**

Manje follows an offline-first architecture. The mobile app\'s SQLite
database is the source of truth for all user data. Cloud sync via
Firebase Firestore provides backup, multi-device access, and (in the
future) cross-user features such as shared budgets.

**6.1 Storage Architecture**

**Mobile --- SQLite (Primary)**

The canonical mobile schema is defined in
manje/src/services/database/schema.ts. Each user gets an isolated
per-user database file, preventing any cross-user data access.

  --------------------------------------------------------------------------
  **Table**                  **Purpose**
  -------------------------- -----------------------------------------------
  transactions               All income and expense records. Source of all
                             analytics and budget calculations.

  budgets                    Budget headers including income totals, period,
                             status, and sync metadata.

  category_budgets           Per-category spending allocations within a
                             budget.

  goals                      Financial goal definitions and progress fields.

  goal_contributions         Individual contribution records per goal.

  bills                      Recurring bill definitions with due-day,
                             frequency, and reminder metadata.

  merchant_rules             Learned auto-categorization rules per merchant.

  sync_queue                 Pending Firestore sync operations
                             (insert/update/delete).

  notification_preferences   User notification scheduling and type
                             preferences.

  ai_chat_messages           Persisted AI conversation history (180-day
                             auto-purge).

  daily_insights             Cached morning and evening AI insight content.

  user_streaks               Streak counts and milestone tracking.

  weekly_challenges          Engagement challenge definitions and progress.

  whatsapp_preferences       WhatsApp opt-in state, phone details, delivery
                             timing.

  whatsapp_delivery_log      WhatsApp delivery audit trail.

  whatsapp_opt_events        Opt-in/opt-out event history.

  village_savings_groups     Village savings group definitions and
                             membership records. \[PLANNED\]

  village_contributions      Individual contribution records per village
                             savings cycle. \[PLANNED\]

  village_loans              Village savings loan records with principal,
                             interest, and repayment schedule. \[PLANNED\]

  rotation_schedule          Rotating collection schedule per group.
                             \[PLANNED\]

  shared_budgets             Shared budget definitions linking two or more
                             user accounts. \[PLANNED\]

  income_sources             Multiple income source definitions per user
                             with interval settings. \[PLANNED\]

  bank_accounts              User bank and cash account records for
                             multi-account balance tracking. \[PLANNED\]

  loans                      Formal loan records with amortization schedule
                             data. \[PLANNED\]
  --------------------------------------------------------------------------

**Cloud --- Firebase Firestore (Sync Target)**

Firestore stores user-scoped data under users/{userId}/\... as a sync
target and multi-device access layer. Sensitive fields are encrypted
before upload. The client never stores unencrypted financial data in
Firestore.

**Admin & Acquisition Collections**

Top-level Firestore collections handle the business operations layer:
waitlist, leads, feedback, campaigns. These are managed through the
admin dashboard in manje-web.

**6.2 Sync Architecture**

The sync model is SQLite-first with queue-based Firestore sync:

7.  All writes go to SQLite first (optimistic local update).

8.  Each write registers a sync operation in the sync_queue table.

9.  processSyncQueue pushes pending items to Firestore.

10. pullFromFirestore backfills data from cloud into SQLite on new
    device login.

11. Background sync runs every 15 minutes. Quick sync on app resume.

12. Conflict resolution: higher sync_version wins.

  -----------------------------------------------------------------------
  **Offline Behaviour**

  All core features work offline. AI assistant features require an active
  internet connection. Data syncs automatically when the device
  reconnects --- no manual user action required. Users are not aware of
  sync operations under normal conditions.
  -----------------------------------------------------------------------

**7. Integrations**

  ---------------------------------------------------------------------------
  **Integration**             **Purpose & Scope**
  --------------------------- -----------------------------------------------
  Firebase Auth               Authentication for all surfaces. Email/password
                              and Google OAuth. Password reset flow. Per-user
                              data isolation.

  Firebase Firestore          Cloud sync target for user data (mobile).
                              Browser CRUD backend (web). Public collections
                              for admin/acquisition (landing/admin).

  Firebase Analytics          Event tracking and user analytics on mobile.

  DeepInfra --- Meta Llama    AI assistant, transaction categorization, batch
  3.3 70B                     categorization, anomaly detection, and insight
                              generation. Direct app-to-API integration from
                              mobile.

  Mixpanel                    Advanced user analytics, funnel analysis, and
                              event tracking on mobile.

  Resend                      Email delivery for waitlist confirmation,
                              welcome emails, campaigns, and business inquiry
                              handling via Next.js API routes.

  WhatsApp Cloud API          Opt-in daily financial summary delivery via
                              WhatsApp. Webhook processing for delivery
                              status updates.

  Expo Notifications          Push notification scheduling and delivery on
                              mobile. Deep-link navigation from
                              notifications.

  expo-local-authentication   Biometric authentication (Face ID, fingerprint,
                              iris) on mobile.

  expo-secure-store           Secure storage of encryption keys in device
                              Keychain/Keystore.

  EAS Build                   Production build pipeline for iOS and Android.
  ---------------------------------------------------------------------------

**8. Technology Stack**

**8.1 Mobile App**

  -----------------------------------------------------------------------
  **Layer**               **Technology**
  ----------------------- -----------------------------------------------
  Framework               React Native 0.81.5 + Expo SDK 54

  Language                TypeScript 5.9.2 (strict mode)

  Navigation              Expo Router 6.0 (file-based routing) + React
                          Navigation 7.1

  State Management        Zustand 5.0 with SQLite persistence

  Local Database          expo-sqlite 16.0 + SQLCipher encryption

  Cloud Backend           Firebase Auth + Firestore + Firebase Analytics

  AI                      DeepInfra API ---
                          meta-llama/Llama-3.3-70B-Instruct

  Analytics               Firebase Analytics + Mixpanel

  Notifications           expo-notifications

  Testing                 Jest 29.7 + jest-expo

  Code Quality            ESLint 9.25

  Build                   EAS Build
  -----------------------------------------------------------------------

**8.2 Web Platform**

  -----------------------------------------------------------------------
  **Layer**               **Technology**
  ----------------------- -----------------------------------------------
  Framework               Next.js 16 + React 19

  Auth                    Firebase Auth (browser)

  Database                Firebase Firestore (direct client access)

  Email                   Resend API (server routes)

  Notifications           Browser Notifications API + setTimeout
                          scheduling (no service worker)

  Deployment              Separate domain from landing site (see
                          docs/web_split_deployment.md)
  -----------------------------------------------------------------------

**8.3 Landing Site**

  -----------------------------------------------------------------------
  **Layer**               **Technology**
  ----------------------- -----------------------------------------------
  Framework               Next.js 16 + React 19

  Database                Firebase Firestore (direct client writes for
                          public capture flows)

  Email                   Resend API (server routes)

  Deployment              Public root domain
  -----------------------------------------------------------------------

**9. Brand Identity & Design System**

**9.1 Brand Personality**

Manje is not an impersonal financial tool. It is a distinct personality
--- a trusted, knowledgeable, warm, and culturally-grounded financial
companion. Every word, animation, and visual choice must reinforce this
personality.

  -----------------------------------------------------------------------
  **Trait**               **Expression**
  ----------------------- -----------------------------------------------
  Knowledgeable           Manje knows its stuff --- but it explains
                          things simply, without jargon or condescension.

  Encouraging             Manje never shames. It celebrates progress,
                          however small. It reframes challenges as
                          opportunities.

  Relatable               Manje speaks like a friend who happens to be
                          great with money. Not like a bank. Not like a
                          textbook.

  Culturally Grounded     Manje understands the Malawian financial
                          context --- village savings, mobile money,
                          informal lending. It never treats these as edge
                          cases.

  Trustworthy             Manje is transparent about data, security, and
                          its own limitations. It earns trust through
                          honesty.
  -----------------------------------------------------------------------

**9.2 The Manje Avatar (ManjeCharacter)**

The ManjeCharacter is the face and embodiment of the Manje brand. It is
not a decorative element --- it is a storytelling tool, an emotional
signal, and a brand anchor across all touchpoints.

**Avatar Specifications**

  -----------------------------------------------------------------------
  **Attribute**           **Specification**
  ----------------------- -----------------------------------------------
  Identity                Black male, human face, age range 25--35

  Style                   \"Cool geek\" aesthetic --- glasses, balancing
                          formality with approachability. Formal enough
                          to convey trust; warm enough to feel
                          accessible.

  Wardrobe                Contextual outfits per app feature area ---
                          e.g., business casual for planning screens,
                          casual wear for celebration screens.

  Assets                  Full-body version for hero/celebration screens.
                          Half-body version for conversational contexts.
                          Face/mood badge (ManjeMood) for inline
                          contextual use.

  Moods (8)               wave (greeting), happy (positive), thinking
                          (loading/processing), celebrate (achievement),
                          concern (warning), encourage (motivation),
                          sleep (inactivity), surprise (unexpected)

  Sizes                   sm: 60px, md: 100px, lg: 150px, xl: 200px

  Animation               Subtle idle float animation. Respects device
                          accessibility reduced-motion settings.
  -----------------------------------------------------------------------

The avatar must grow into a recognizable brand character across all
Manje surfaces and content formats --- app, YouTube, blog, social media,
and eventually podcast.

**9.3 Design System --- Claymorphism**

Manje uses a Claymorphism design language --- characterized by soft,
three-dimensional \"clay-like\" cards with layered shadows and
highlights. This aesthetic was chosen because it feels warm, modern, and
approachable --- the opposite of the cold, sterile feel of traditional
banking interfaces.

  -----------------------------------------------------------------------
  **Element**             **Specification**
  ----------------------- -----------------------------------------------
  Card Style              Outer shadow for depth. Inner highlight overlay
                          (top-left, white). Inner shadow overlay
                          (bottom-right, dark). Border radius: 24px.

  Press Interaction       Scale 0.97 on press for tactile feedback.

  Primary Color           #1A6B4A --- Deep Manje Green

  Accent Color            #2ECC71 --- Manje Accent Green

  Health: Green           0--75% budget used

  Health: Yellow          75--90% budget used

  Health: Red             90%+ budget used

  Bill Urgency: Green     7+ days remaining

  Bill Urgency: Yellow    3--6 days remaining

  Bill Urgency: Red       0--2 days remaining

  Typography              Clean, readable --- minimum 14px body text.
                          System-compatible fonts.

  Icons                   Feather Icons (consistent 300+ icon set via
                          \@expo/vector-icons)

  Accessibility           WCAG 2.1 AA minimum contrast ratios. Screen
                          reader labeling. Reduced motion support.
                          Dynamic type support.
  -----------------------------------------------------------------------

**9.4 Language & Tone Guidelines**

Manje\'s language must always be plain, warm, and empowering. Financial
jargon should be replaced with accessible language at every opportunity.

  -----------------------------------------------------------------------
  **Avoid**               **Use Instead**
  ----------------------- -----------------------------------------------
  Use instead of          \"How your loan repayments are structured\"
  \"Amortization\"        

  Use instead of          \"Amount you still owe (not including
  \"Principal Balance\"   interest)\"

  Use instead of \"Budget \"How much you\'re over or under budget\"
  Variance\"              

  Use instead of          \"How much cash you have available right now\"
  \"Liquidity\"           

  Tone for overspending   \"You\'ve gone a bit over this month --- let\'s
                          see what we can do.\" Never: \"You have
                          exceeded your budget.\"

  Tone for goal progress  \"You\'re 45% of the way there --- great
                          progress!\" Never: \"Goal completion: 45%.\"
  -----------------------------------------------------------------------

**10. Privacy & Data Security**

**10.1 Privacy Principles**

Manje is a privacy-first product. Financial data is among the most
sensitive personal data that exists. The following principles are
non-negotiable:

-   User financial data is never sold to third parties.

-   Data is encrypted at rest (local SQLite) and in transit (field-level
    encryption before cloud sync).

-   Encryption keys never leave the user\'s device.

-   Each user\'s data is isolated --- no cross-user access is possible
    by design.

-   Users can delete all their data at any time, including cloud data.

-   Data retention policies automatically purge sensitive logs (SMS: 90
    days, chat: 180 days).

**10.2 User-Facing Privacy Communication**

Privacy notices must be plain-language, concise, and surfaced at the
right moments --- not buried in a 40-page policy document. Every privacy
notice must communicate:

13. What data is collected in this context.

14. Where that data is stored (on-device / cloud).

15. Who can see it (only the user / planner with permission / Manje team
    with anonymized analytics).

16. How it is protected (encryption, isolation).

**10.3 Planner Data Access Controls**

When a user engages with a human financial planner, a tiered data
permission system governs what the planner can access:

17. Level 1 --- Budget Only: Planner sees the user\'s current budget
    structure and goal targets but no individual transactions.

18. Level 2 --- Budget + Category Summaries: Planner sees spending by
    category (totals only, no individual transactions).

19. Level 3 --- Full Profile: Planner sees all shared data including
    transaction history, goals, and loans.

Users can revoke planner access at any time. Revocation immediately ends
the planner\'s data visibility.

**11. Success Metrics & KPIs**

**11.1 Acquisition Metrics**

  -----------------------------------------------------------------------
  **Metric**          **Definition**                  **Target**
  ------------------- ------------------------------- -------------------
  Monthly Downloads   New app installs per month.     **Track from day
                                                      1**

  Onboarding          Percentage of users who         **Target: \>75%**
  Completion Rate     complete full onboarding.       

  Time to First Value Time from install to first      **Target: \<3
                      meaningful insight (first       minutes**
                      budget or first transaction     
                      logged).                        
  -----------------------------------------------------------------------

**11.2 Engagement Metrics**

  -----------------------------------------------------------------------
  **Metric**          **Definition**                  **Target**
  ------------------- ------------------------------- -------------------
  Daily Active Users  Unique users who open the app   **Target: 70% of
  (DAU)               each day.                       MAU**

  30-Day Retention    Users who return after 30 days. **Target: \>60%**

  Average Session     Mean time spent per app         **Target: 2--5
  Duration            session.                        minutes**

  Sessions Per Week   Mean sessions per active user   **Target: 5--7**
                      per week.                       

  Streak Adoption     Percentage of active users with **Track from day
                      a current streak.               1**

  AI Chat Usage       Percentage of active users who  **Track from day
                      use Manje Chat monthly.         1**
  -----------------------------------------------------------------------

**11.3 Financial Impact Metrics**

  -----------------------------------------------------------------------
  **Metric**          **Definition**                  **Target**
  ------------------- ------------------------------- -------------------
  Budget Adherence    Percentage of users staying     **Target:
  Rate                within their budget in a given  increasing MoM**
                      month.                          

  Goals Created Per   Average number of active goals  **Target: \>1.5**
  User                per user.                       

  Goal Completion     Percentage of goals that reach  **Track from day
  Rate                100%.                           1**

  User-Reported       Survey-based: percentage of     **Target: \>20%**
  Savings Improvement users reporting improved        
                      savings within 3 months.        

  Net Promoter Score  Would you recommend Manje to a  **Target: \>50**
  (NPS)               friend?                         
  -----------------------------------------------------------------------

**12. Product Roadmap**

The Manje roadmap is organized into three phases. Phase 1 covers the
current production baseline. Phase 2 covers the near-term feature
expansion emerging from the March 2026 product planning sessions. Phase
3 covers longer-term strategic features.

**Phase 1 --- Current Production Baseline (Live)**

The following feature domains are fully implemented and live in the
current production mobile app:

-   Authentication & Security (Firebase Auth, biometric lock, per-user
    encryption)

-   Transaction Management (manual entry, AI categorization, merchant
    learning)

-   Budget Management (AI-assisted creation, multi-budget, category
    tracking, alerts)

-   Goals & Savings (creation, contributions, milestones, progress
    tracking)

-   Bills Management (creation, payment tracking, multi-tier reminders)

-   AI Assistant (general chat, context-aware responses, quick actions,
    memory)

-   Notifications & Reminders (6 daily reminders, morning/evening
    insights, budget alerts)

-   Cloud Sync (offline-first SQLite, Firestore bidirectional sync,
    encryption)

-   Analytics & Insights (spending analysis, weekly reports, anomaly
    detection, health score)

-   Gamification (streaks, milestones, weekly challenges)

-   Onboarding (welcome, country/currency, permissions, goal setting,
    success)

-   Dashboard & Navigation (home, activity feed, Manje tab, You tab,
    quick add)

-   WhatsApp Delivery (opt-in daily reports via WhatsApp)

-   Web Platform (authenticated dashboard, admin tools, landing site)

**Phase 2 --- Near-Term Expansion (Next 6--12 Months)**

Priority features identified in March 2026 product planning sessions:

**2a --- Financial Foundation (High Priority)**

-   Multiple income source support with flexible payment intervals

-   Stored fixed expense templates for recurring charges

-   Multi-account balance tracking (multiple banks + cash)

-   Income confirmation prompts for expected payments

-   Budget intelligence visualization (trend analysis, spending change
    explanations)

-   Monthly summaries and PDF reports

**2b --- Shared Finance (High Priority)**

-   Shared budgets for two users (couple/household view)

-   Group budgets for small groups with shared goals

-   Accountability notifications for group budget adherence

-   Shared savings goals between users

**2c --- Village Savings (Chiperegani) (High Priority ---
Malawi-Critical)**

-   Village savings group membership and contribution tracking

-   Missed contribution reminders and meeting reminders

-   Multiple group support with aggregated cross-group view

-   Rotating collection (chilimba) module

-   Village savings loan tracking with repayment scheduling

-   Group manager flow for leader-driven contribution tracking

-   Operational reports for group managers

**2d --- Debt & Loan Management (Medium Priority)**

-   Standard bank loan tracking with amortization schedules

-   Community/village loan tracking with flexible repayment models

-   Multi-loan summary view

-   Debt transfer tracking widget

**2e --- Financial Education (Medium Priority)**

-   In-app education snippets with contextual surfacing

-   Investment awareness content section (treasury bills, shares, money
    market)

-   YouTube and blog content integration

-   Investment tracker (lightweight manual holdings record)

-   Content map and Manje avatar content hosting

**2f --- Human Financial Planner (Medium Priority --- Premium)**

-   Planner matching and discovery

-   Tiered data permission controls

-   Planner dashboard with messaging and scheduling

-   Customized budget/goal modules from planners

-   Monthly accountability review system

-   PDF client reports

-   Premium access model with free trial

**2g --- UI/UX & Product Polish (Ongoing)**

-   Brand storytelling onboarding screen (script to be authored)

-   Plain-language privacy notices throughout the app

-   Security badge on profile screen

-   Plain-language financial term rewrites across all screens

-   Light/dark mode toggle

-   Language selection (English/Chichewa)

**Phase 3 --- Strategic Future (12+ Months)**

-   Bank API integration for automatic transaction import (subject to
    Malawian bank API availability)

-   Receipt scanning via OCR

-   Investment portfolio tracking (real-time pricing integration)

-   Debt payoff calculator with optimization strategies

-   Tax estimation and deductible expense organization

-   Multi-user account aggregation (household finance overview)

-   Planner matching at scale (algorithmic matching)

-   Manje-branded podcast channel

-   Business account features (for small business owners)

-   Regional expansion (Zambia, Zimbabwe, Tanzania)

**13. Open Questions & Decisions Required**

The following questions require decisions before the relevant features
can be designed and built. Each question should be assigned an owner and
a target resolution date.

  -----------------------------------------------------------------------
  **Question**            **Detail**
  ----------------------- -----------------------------------------------
  Shared Budget Technical How are shared budget transactions synchronized
  Model                   between two distinct user accounts in real
                          time? What is the conflict resolution model
                          when both users post transactions
                          simultaneously?

  Village Bank Loan Rules What are the exact eligibility and operating
                          rules for village bank loans in the Malawian
                          context? These must be documented before the
                          loan module is designed to ensure the flexible
                          model covers real-world cases.

  Planner Matching at     What is the matching algorithm for connecting
  Scale                   users to planners as the user base grows?
                          Manual matching is acceptable for early beta
                          but needs a scalable model.

  Planner Pricing Tiers   What is the pricing structure for human planner
                          access after the free trial? How many tiers?
                          What features per tier?

  Income Automation vs    Should recurring income be auto-posted or
  Confirmation            should the app always prompt for user
                          confirmation? The team has a preference for
                          confirmation prompts --- this needs to be
                          finalized and documented.

  Language Implementation What is the full scope of Chichewa support?
  Scope                   Full translation or key screens only? AI
                          translation accuracy concerns need to be
                          resolved before committing to full translation.

  Group Budget Data       In shared/group budgets, what exactly can each
  Permissions             participant see about other participants\'
                          individual transactions? Shared budget
                          visibility vs individual privacy must be
                          defined.

  Investment Tracker      In Phase 2, the investment tracker is manual
  Automation              (notes + self-reported values). When and how
                          does it evolve to automated price feeds? What
                          APIs exist for Malawi Securities Exchange?
  -----------------------------------------------------------------------

**14. Constraints & Assumptions**

**14.1 Technical Constraints**

-   No SMS auto-detection. The product does not use READ_SMS or
    RECEIVE_SMS permissions. All transaction data is manually entered or
    imported via Bank API (future).

-   AI features require internet connectivity. Core budgeting,
    transaction management, and offline features function without
    internet.

-   App size must remain under 50MB for initial download to remain
    competitive in markets with limited data plans.

-   Battery usage optimization is required --- background sync must not
    materially drain device battery.

**14.2 Market Assumptions**

-   Primary market is Malawi. Regional expansion (Zambia, Zimbabwe,
    Tanzania) is planned but not the initial focus.

-   Target users have Android-first devices. iOS support is maintained
    but secondary.

-   Mobile money (Airtel Money, TNM Mpamba) is more prevalent than
    formal bank transactions in the target market.

-   Many target users have intermittent internet connectivity ---
    offline-first is a genuine requirement, not just a nice-to-have.

**14.3 Regulatory Assumptions**

-   The product must comply with Malawian data protection regulations
    and applicable regional privacy laws.

-   Financial advice features must be framed as
    educational/informational rather than regulated financial advice.

-   The human financial planner feature requires compliance with any
    professional financial planning regulations applicable in Malawi.
    Legal review is required before launch of the planner marketplace.

**15. Document Governance**

This Product Vision Document is a living document. It must be updated
before any major feature area begins implementation. The following rules
govern how this document is maintained:

-   Any new feature area that reaches the design stage must be
    documented in this PVD before design begins.

-   If a feature is de-prioritized or removed from scope, it must be
    moved to a \"Deferred\" section rather than deleted --- to preserve
    institutional knowledge.

-   Open Questions (Section 13) must be reviewed at every product
    planning session. Resolved questions must be moved to the relevant
    feature section as decisions.

-   The Roadmap (Section 12) must be reviewed quarterly.

-   This document does not replace detailed feature specifications. Each
    major feature in Phase 2 and Phase 3 should have its own detailed
    feature specification document before engineering begins.

  -----------------------------------------------------------------------
  **Document Owner**

  This document is owned by the Manje product team. All structural
  changes require review by the founding team. All engineers, designers,
  and contributors are expected to read this document in full before
  contributing to the Manje codebase or design system.
  -----------------------------------------------------------------------
