# Manje Mobile App

AI-powered personal finance app for Malawi and Southern Africa.

## Current Status

- Expo Router app on Expo SDK 55
- Shared theme/contracts reconciled and `npm run typecheck` passes
- Local persisted stores now back auth profile state, transactions, goals, and budgets
- Core P0 flow now supports real quick-add, dashboard/activity rendering, transaction detail/edit/delete, and goal create/contribute/edit
- Firebase email/password auth and native Google sign-in are now wired in the client
- Firebase project credentials, Google service files, and production observability still need environment-specific setup

## Tech Stack

- **Framework:** React Native with Expo SDK 55
- **Navigation:** Expo Router (file-based routing)
- **State Management:** Zustand
- **Animations:** React Native Reanimated
- **Styling:** Custom theme system with Claymorphism design

## Project Structure

```
manje-mobile/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication screens
│   │   ├── welcome.tsx    # AUTH-01: Welcome screen
│   │   ├── signup.tsx     # AUTH-02: Sign up
│   │   └── signin.tsx     # Sign in
│   ├── (onboarding)/      # Onboarding flow
│   │   ├── country.tsx    # OB-02: Country selection
│   │   ├── currency.tsx   # OB-03: Currency selection
│   │   ├── income.tsx     # OB-08: Income range
│   │   └── success.tsx    # OB-07: Success celebration
│   ├── (tabs)/            # Main app tabs
│   │   ├── index.tsx      # DASH-01: Dashboard
│   │   ├── activity.tsx   # ACT-01: Transaction history
│   │   ├── quick-add.tsx  # TXN-03: Add transaction
│   │   ├── budgets.tsx    # Budget management
│   │   └── profile.tsx    # User profile & settings
│   └── _layout.tsx        # Root layout with providers
├── src/
│   ├── components/        # Reusable components
│   │   ├── common/        # ClayCard, Button, Input, etc.
│   │   └── character/     # ManjeCharacter mascot
│   ├── hooks/             # Custom hooks (useTheme)
│   ├── stores/            # Zustand stores (authStore)
│   └── theme/             # Design tokens
│       ├── colors.ts      # Color palette & semantic tokens
│       ├── typography.ts  # Font families & type scale
│       ├── spacing.ts     # Spacing, radius, layout
│       ├── gradients.ts   # Premium gradient definitions
│       ├── shadows.ts     # Shadow system
│       └── animations.ts  # Animation configs
└── assets/
    └── fonts/             # Custom fonts (Comfortaa, Inter)
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your device (for testing)

### Installation

```bash
cd manje-mobile
npm install
```

### Running the App

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run on web
npm run web

# Validate types
npm run typecheck
```

## Design System

The app uses a **Hybrid Premium** design system that combines:

- **Claymorphism:** Soft, clay-like UI elements with inner highlights and shadows
- **Premium Polish:** Revolut-inspired gradients, glass effects, and micro-interactions
- **ManjeCharacter:** A living brand mascot with mood states and animations

### Theme Tokens

All design values are defined in `src/theme/`:

- **Colors:** Light/dark mode semantic tokens
- **Typography:** Comfortaa (display) + Inter (body/UI)
- **Spacing:** 4px base unit system
- **Gradients:** Hero, accent, and button gradients
- **Shadows:** Layered shadow system with color tints
- **Animations:** Spring configs for 60fps animations

## Screens Implemented

| Screen ID | Name | Description |
|-----------|------|-------------|
| AUTH-01 | Welcome | Branded entry with ManjeCharacter wave |
| AUTH-02 | Sign Up | Email/password registration |
| OB-02 | Country | Country selection with search |
| OB-03 | Currency | Currency selection |
| OB-08 | Income Range | Optional income input |
| OB-07 | Success | Celebration & transition |
| DASH-01 | Dashboard | Balance, transactions, quick actions |
| NAV-01 | Tab Bar | Bottom navigation with quick add |
| TXN-03 | Quick Add | Add transaction modal |
| ACT-01 | Activity | Transaction history with filters |

## Adding Custom Fonts

1. Download Comfortaa and Inter from Google Fonts
2. Place `.ttf` files in `assets/fonts/`
3. Uncomment the font requires in `src/theme/typography.ts`
4. Rebuild the app

## Environment Setup

Copy `.env.example` to `.env` and fill in:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
- `DEEPINFRA_API_KEY`
- `SENTRY_DSN`

## Firebase & Google Sign-In Setup

1. Create Android and iOS apps in your Firebase project.
2. In Firebase Authentication, enable:
   - Email/Password
   - Google
3. Download `google-services.json` and place it at the project root: `manje-mobile/google-services.json`.
4. Download `GoogleService-Info.plist` and place it at the project root: `manje-mobile/GoogleService-Info.plist`.
5. For Android, register the SHA-1 and SHA-256 fingerprints for:
   - your development build key
   - your EAS/release signing key
6. Use the Web OAuth client ID from Firebase/Google Cloud as `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.
7. Build the app with a development build or EAS build. Google sign-in does not work in Expo Go.

## Release Gaps

- [ ] Add Firebase project credentials and native Google service files for each environment
- [ ] Add SQLite + migrations if we move beyond the current persisted Zustand foundation
- [ ] Wire notifications, crash reporting, analytics, and AI services
- [ ] Add automated tests beyond typecheck

## License

Proprietary - Manje Technologies
