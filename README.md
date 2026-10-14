# Metx

A social media application built with Expo, React Native, Convex, and Clerk. Share posts and stories, explore content, message other members, and build your profile.

<p align="center">
  <img src="assets/images/logo.png" alt="Metx logo" width="120" height="120" />
</p>

<p align="center">
  <a href="https://expo.dev"><img src="https://img.shields.io/badge/Expo-57-000020?logo=expo" alt="Expo 57" /></a>
  <a href="https://reactnative.dev"><img src="https://img.shields.io/badge/React_Native-0.86-61DAFB?logo=react" alt="React Native 0.86" /></a>
  <a href="https://convex.dev"><img src="https://img.shields.io/badge/Convex-Backend-FFC400?logo=convex" alt="Convex" /></a>
  <a href="https://clerk.com"><img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk" alt="Clerk" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript" alt="TypeScript" /></a>
</p>

## App Preview

For Both Android And IOS 
<img src="docs/screenshots/android_ios.png" alt="Explore screen on Android and iOS" width="320" />

## Key Features

- **Posts & Stories** — Share photos (up to 10 MB) and videos (up to 30 seconds, 50 MB). Stories expire after 24 hours.
- **Home Feed** — Chronological feed of posts from followed accounts with infinite scroll.
- **Explore** — Search posts and people, filter by topics (Travel, Nature, Pets, Food, Design, Lifestyle).
- **Direct Messages** — Private conversations with real-time messaging and optimistic UI.
- **Profiles** — Editable profile with avatar, bio, website, location, follower/following counts, post/video/saved galleries.
- **Social Interactions** — Follow/unfollow, like posts, comment, delete own content.
- **Authentication** — Clerk-powered sign-up/sign-in with email, OAuth, and passkeys. Onboarding flow for new users.
- **Media Uploads** — Resumable uploads to Convex storage with progress tracking and automatic cleanup of expired uploads.
- **Error Monitoring** — Sentry integration with user feedback and crash reporting.
- **Cross-Platform** — Native iOS and Android via Expo Router (file-based routing, native tabs).

## Technology Stack

| Category | Technologies |
|---|---|
| **Framework** | Expo 57 (React Native 0.86, React 19), Expo Router v57 |
| **Language** | TypeScript 6.0 (strict mode) |
| **Backend** | Convex (real-time database, server functions, file storage, scheduling) |
| **Authentication** | Clerk (Expo SDK) — email/password, OAuth, passkeys, JWT templates for Convex |
| **State/Context** | React Context + Convex reactive queries |
| **Media** | Expo Image Picker, Expo Video, Expo Image, direct upload to Convex storage |
| **Styling** | React Native StyleSheet, Expo Linear Gradient, Expo Glass Effect, Expo Symbols |
| **Navigation** | Expo Router (file-based, typed routes, native stack + tabs) |
| **Error Tracking** | Sentry React Native (source maps, user feedback, session replay disabled) |
| **Testing** | Vitest + convex-test (unit/integration tests for Convex functions) |
| **Code Quality** | ESLint (Expo config), TypeScript type-checking |
| **Build/Deploy** | EAS Build (development client), EAS Update |

## Getting Started

### Prerequisites

- Node.js 20+ and npm 10+
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- iOS development: Xcode 15+ (macOS only)
- Android development: Android Studio with SDK 34+
- Convex account and CLI: `npm install -g convex`
- Clerk account for authentication

### Installation

```bash
# Clone the repository
git clone https://github.com/haiderfareed2323/metx.git
cd metx

# Install dependencies
npm install

# Set up Convex (creates convex/_generated)
npx convex dev
```

### Environment Configuration

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description | Source |
|---|---|---|
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (client-safe) | Clerk Dashboard → API Keys |
| `EXPO_PUBLIC_CONVEX_URL` | Convex deployment URL | Convex Dashboard → Settings |
| `EXPO_PUBLIC_CONVEX_SITE_URL` | Convex site URL for media | Convex Dashboard → Settings |
| `CONVEX_DEPLOYMENT` | Convex deployment name (e.g., `dev:your-deployment`) | `npx convex dev` output |
| `SENTRY_AUTH_TOKEN` | Sentry auth token for source map uploads | Sentry → Settings → Auth Tokens |

**Clerk + Convex Integration:** Enable the Convex integration in Clerk Dashboard → Integrations → Convex. Set `CLERK_JWT_ISSUER_DOMAIN` as a Convex environment variable (not `EXPO_PUBLIC_*`).

### Running the App

```bash
# Start Expo development server
npm start

# Open on specific platforms
npm run ios       # iOS Simulator (requires macOS)
npm run android   # Android Emulator
npm run web       # Web browser (limited native features)

# Development client (required for native modules like Clerk, Sentry)
npm run start:dev
```

**Note:** This app uses native modules (Clerk, Sentry, secure store, image picker, video) and requires a development client. It does **not** run in Expo Go.

### Development Builds

```bash
# Build development client for iOS
npm run build:dev:ios

# Build development client for Android
npm run build:dev:android
```

These create installable `.app` (iOS simulator) and `.apk` (Android) files via EAS Build.

## Project Structure

```
metx/
├── app/                          # Expo Router pages (file-based routing)
│   ├── _layout.tsx               # Root layout: providers, auth, Sentry
│   ├── (tabs)/                   # Tab navigator screens
│   │   ├── _layout.tsx           # Tab bar configuration
│   │   ├── home.tsx              # LiveHome (feed)
│   │   ├── explore.tsx           # LiveExplore
│   │   ├── messages.tsx          # MessagesTab (inbox)
│   │   └── profile.tsx           # OwnProfile
│   ├── compose.tsx               # Post composer (modal)
│   ├── story-compose.tsx         # Story composer (modal)
│   ├── post/[id].tsx             # Post detail view
│   ├── chat/[id].tsx             # Chat screen
│   ├── member/[id].tsx           # Other user's profile
│   ├── sso-callback.tsx          # Clerk SSO callback
│   └── design-preview/           # Design preview screens (dev only)
├── components/
│   ├── app-tabs.tsx              # Tab navigator with Ionicons
│   ├── social/                   # Social feature components
│   │   ├── feed.tsx              # LiveHome feed
│   │   ├── explore.tsx           # LiveExplore
│   │   ├── profile.tsx           # MemberProfile, OwnProfile
│   │   ├── composer.tsx          # Composer (posts + stories)
│   │   ├── messages.tsx          # LiveChat, NewConversation
│   │   ├── stories.tsx           # Stories carousel + viewer
│   │   ├── post-card.tsx         # PostCard, FollowButton
│   │   ├── media.tsx             # Avatar, PostMedia, useMediaSource
│   │   ├── ui.tsx                # Shared UI primitives
│   │   ├── post-detail-actions.tsx
│   │   ├── profile-layout.tsx
│   │   └── edit-profile-screen.tsx
│   ├── chat-screen.tsx           # Shared chat UI
│   ├── explore-layout.tsx        # Explore screen layout
│   ├── feed-icon.tsx             # Icon wrapper
│   └── tab-screens.tsx           # MessagesTab (preview + live)
├── context/
│   ├── social-context.tsx        # ProfileGate, useProfile, useBackendToken
│   └── messages-context.tsx      # Optimistic messaging outbox
├── lib/
│   ├── social.ts                 # Convex API, types, error handling
│   └── upload.ts                 # Resumable upload to Convex storage
├── convex/                       # Convex backend
│   ├── schema.ts                 # Database schema
│   ├── auth.config.ts            # Clerk JWT configuration
│   ├── lib/
│   │   ├── auth.ts               # requireProfile helper
│   │   └── views.ts              # Public document projections
│   ├── posts.ts                  # Posts CRUD, feed queries
│   ├── stories.ts                # Stories CRUD, expiration
│   ├── social.ts                 # Likes, follows, comments, connections
│   ├── messaging.ts              # Conversations, messages, inbox
│   ├── profiles.ts               # Profile CRUD, onboarding, search
│   ├── accounts.ts               # Account deletion workflow
│   ├── uploads.ts                # Upload lifecycle (begin, finish, expire)
│   └── http.ts                   # HTTP endpoints for media serving
├── scripts/
│   ├── reset-project.js          # Reset to blank app
│   └── seed-demo.mjs             # Seed demo data
├── assets/images/                # App icons, splash, logos
├── docs/screenshots/             # README screenshots
├── .env.example                  # Environment template
├── app.json                      # Expo config
├── eas.json                      # EAS Build profiles
└── package.json
```

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start Expo dev server |
| `npm run ios` | Run on iOS Simulator (dev client) |
| `npm run android` | Run on Android Emulator (dev client) |
| `npm run web` | Run in web browser |
| `npm run start:dev` | Start with dev client |
| `npm run build:dev:ios` | Build iOS dev client via EAS |
| `npm run build:dev:android` | Build Android dev client (APK) via EAS |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript compiler check |
| `npm run test` | Run Vitest tests |
| `npm run seed` | Seed demo data to Convex |
| `npm run reset-project` | Reset app directory to blank template |

## Backend & Services

### Convex (Database + Functions)

- **Real-time queries** — Home feed, explore, messages, stories update reactively
- **Server functions** — Mutations for posts, stories, likes, follows, comments, messaging
- **File storage** — Images and videos stored in Convex storage, served via HTTP endpoints
- **Scheduled functions** — Automatic story expiration (24h), upload cleanup (1h)
- **Indexes** — Optimized for feed pagination, search, inbox ordering
- **Full-text search** — Profile search via Convex search index

### Clerk (Authentication)

- **Providers** — Email/password, OAuth (Google, Apple), passkeys
- **Session management** — JWT templates for Convex integration
- **Token caching** — Secure token storage via `@clerk/expo/token-cache`
- **Onboarding** — Username + display name collection after first sign-in

### Sentry (Error Tracking)

- **DSN** — Configured in `src/app/_layout.tsx`
- **Source maps** — Uploaded via EAS Build with `@sentry/react-native/expo` plugin
- **User feedback** — In-app feedback form (iOS only in current config)
- **Test page** — Settings → Diagnostics → Sentry test (dev builds)

## Development Status

| Feature | Status |
|---|---|
| Posts (photos/videos) | ✅ Implemented |
| Stories (24h expiry) | ✅ Implemented |
| Home feed (following) | ✅ Implemented |
| Explore (search, topics, people) | ✅ Implemented |
| Direct messages | ✅ Implemented |
| Profiles (edit, avatar, stats) | ✅ Implemented |
| Follow/unfollow | ✅ Implemented |
| Likes & comments | ✅ Implemented |
| Account deletion | ✅ Implemented |
| Onboarding flow | ✅ Implemented |
| Sentry error tracking | ✅ Implemented |
| Demo data seeding | ✅ Implemented |
| Unit/integration tests | ✅ Implemented (Vitest + convex-test) |
| Push notifications | ❌ Not implemented |
| Group messaging | ❌ Not implemented (UI placeholder only) |
| Saved posts gallery | ❌ UI only, backend missing |
| Tagged posts | ❌ UI only, backend missing |
| Web support | ⚠️ Partial (limited native modules) |

### Known Limitations

- **No Expo Go** — Requires development client due to native modules (Clerk, Sentry, secure store, video, image picker).
- **iOS-only feedback** — Sentry user feedback form currently only enabled on iOS.
- **Demo profiles** — Seeded fictional profiles cannot sign in or reply to messages.
- **Video compression** — Client-side validation only; no server-side transcoding.
- **Convex HTTP endpoints** — Media served via internal queries with token verification.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes with tests where applicable
4. Run checks: `npm run lint && npm run typecheck && npm run test`
5. Submit a pull request

Please follow the existing code style (TypeScript strict, functional components, Convex patterns).



## Author

**Burak Orkmез** — [GitHub](https://github.com/haiderfareed2323)

## Links

- **Convex Dashboard** — https://dashboard.convex.dev
- **Clerk Dashboard** — https://dashboard.clerk.com
- **Sentry Project** — https://codesistency-gs.sentry.io/issues/?project=4512078093942864
- **Expo Project** — https://expo.dev/accounts/haiderfareed2323/projects/metx
- **EAS Build** — https://expo.dev/accounts/haiderfareed2323/projects/metx/builds