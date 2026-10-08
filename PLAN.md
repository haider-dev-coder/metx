# metx implementation plan

## Product brief

metx is a native iOS and Android social app for creators and their fans. It is
English-only at launch, targeted globally to users aged 13+, and uses a classic
Instagram-inspired, mobile-first interface. The primary success measure is a
healthy weekly social loop: returning users view a feed, follow, post, comment,
or message.

The app has four primary tabs:

1. **Home** — Stories, followed posts, recommendations, and an Activity bell.
2. **Messages** — direct and group conversations.
3. **Explore** — user search plus a public-post grid.
4. **Profile** — the current user's profile, posts, stories, and settings.

The initial stack is Expo SDK 57, Expo Router native tabs, NativeWind, Clerk,
Convex, Cloudinary, Expo Push, Sentry, PostHog, and EAS.

## Product decisions

### Identity and profiles

- Authenticate with Google and Apple through Clerk.
- On first sign-in require a unique handle and display name. Avatar and bio are
  optional and editable later.
- Public profile fields are avatar, handle, display name, and bio. Email stays
  private in Clerk.
- Accounts are public or private. Private profiles remain searchable and show
  their profile basics and a private badge, but posts and Stories are visible
  only after an approved follow request.
- Enforce a 13+ age gate at sign-up.
- Users can edit their profile and permanently delete their account.

### Social graph and safety

- A public-account follow succeeds immediately. A private-account follow
  creates a request that the target can approve or reject.
- Users can unfollow at any time.
- Blocking removes follow relationships, hides both profiles/posts/Stories from
  each other, and prevents new contact. Existing conversations stay read-only.
- There is no reporting workflow or automated content moderation in v1.

### Posts, feed, and Explore

- A post contains exactly one image or video and an optional caption.
- Post videos are limited to 60 seconds and 100 MB.
- Users choose media from their library or capture it in-app. Camera capture
  requires camera and microphone permission; library selection remains usable
  when camera access is denied.
- Posts and comments are immutable after publishing; their authors can delete
  them but cannot edit them.
- Comments are flat. A user can like a post once.
- Home is a scrollable card feed. Tapping a post opens a detail screen with
  comments and actions.
- Home combines followed posts with eligible public recommendations. The initial
  ranking is a transparent recency-and-engagement heuristic and excludes the
  viewer's own posts.
- New users enter Home immediately with recommendations rather than an empty
  feed or a forced follow-selection step.
- Explore has handle/name search and a grid of public recommended/latest posts.

### Stories

- A Story is a sequence of independently published photo or video segments.
- Photo segments and video segments up to 15 seconds expire after 24 hours.
- Story visibility follows account privacy.
- Authors can see a viewer list. Only mutual followers may reply; a reply opens
  or contributes to a direct conversation.
- Each user may publish at most 10 Story segments per day.
- Expired Stories and their Cloudinary media are permanently deleted. There is
  no archive, Highlights, or new-Story notification in v1.

### Messaging

- Support real-time one-to-one and group messages.
- Conversations support text and photos, not video, read receipts, typing
  indicators, presence, reactions, or message editing.
- Only mutual followers may create a direct conversation or invite someone to a
  group. This intentionally protects creators from unsolicited fan DMs.
- Group creators may promote/demote admins. Admins can invite members and remove
  non-admin members; the creator cannot be removed.
- Limit sent messages to 30 per minute per sender.

### Notifications, limits, and lifecycle

- Use an in-app Activity screen reached by the Home-header bell, plus push
  notifications for follow requests, follows, likes, comments, and messages.
- Ask for push permission after onboarding with a value explanation. Users can
  continue if they decline.
- Limit users to 10 published posts per day. Story limits are separate.
- Online-first behavior: show clear loading, error, empty, and retry states;
  do not implement an offline mutation queue or persistent upload drafts.
- On account deletion, immediately remove the profile, public social data,
  relationships, memberships, and hosted media. Preserve prior text messages in
  other participants' histories anonymously as `Deleted user`; remove media
  sent by the deleted account.

## Architecture

### Ownership boundaries

| System | Responsibility |
| --- | --- |
| Expo client | Screens, local UI state, media selection/capture, native permissions, navigation, and optimistic presentation where safe. |
| Clerk | Google/Apple identity, authenticated session, and private identity details. |
| Convex | Source of truth for application data, authorization, realtime queries, mutations, rate limits, notifications, and scheduled cleanup. |
| Cloudinary | Signed media uploads, transformations, thumbnails, CDN delivery, and deletion of user-owned assets. |
| Expo Push | Device tokens and cross-platform push delivery. |
| Sentry | Crash/error reporting with no sensitive message or credential content. |
| PostHog | Privacy-conscious product events and funnels. |
| EAS | Development, preview, and production builds plus compatible OTA updates. |

### Convex data model

Implement indexes and authorization checks alongside each collection.

| Entity | Key fields / relationships |
| --- | --- |
| `profiles` | Clerk user ID (unique), handle (case-insensitive unique), name, bio, avatar media reference, privacy, date-of-birth eligibility, creation/update timestamps. |
| `follows` | follower, followed, status (`accepted`/`requested`), timestamps; unique follower-followed pair. |
| `blocks` | blocker, blocked, timestamp; unique directed pair. |
| `posts` | author, media reference/type/dimensions/duration, caption, published timestamp, deleted state. |
| `likes` | post, user, timestamp; unique post-user pair. |
| `comments` | post, author, body, timestamp, deleted state. |
| `stories` | author, media reference/type/duration, published and expiration timestamps, deletion state. |
| `storyViews` | story, viewer, timestamp; unique story-viewer pair. |
| `conversations` | kind (`direct`/`group`), creator, title, last-message metadata, timestamps, closed/read-only state. |
| `conversationMembers` | conversation, profile, role (`creator`/`admin`/`member`), timestamps; unique pair. |
| `messages` | conversation, sender or deleted-sender marker, text/media reference, timestamp, deleted state. |
| `activity` | recipient, actor, type, target reference, read timestamp, timestamp. |
| `pushTokens` | owner, Expo token, platform, last-seen timestamp. |
| `rateLimits` | actor, action key, period start, counter. |

Do not trust client-provided ownership, media metadata, permissions, rate-limit
counters, or privacy state. Convex mutations resolve the Clerk identity and
validate every relationship server-side.

### Media flow

1. The client asks Convex for a short-lived, authenticated Cloudinary upload
   signature and upload policy.
2. The client uploads directly to Cloudinary with constrained resource type,
   size, and duration settings.
3. The client submits the resulting verified media identifier to a Convex
   mutation, which validates ownership and creates the post, Story, avatar, or
   message record.
4. Convex-authorized deletion removes application metadata and queues/delegates
   Cloudinary asset deletion.

Never embed Cloudinary API secrets in the mobile application.

## Implementation phases

### Phase 0 — service and release configuration

- Confirm Clerk application, Google/Apple OAuth credentials, Convex deployment,
  Cloudinary cloud/preset strategy, Expo project, Sentry project, and PostHog
  project.
- Add documented environment-variable placeholders only; keep secrets out of
  source control.
- Configure `app.json` through Expo config plugins for Clerk redirects, camera,
  microphone, media-library, and push permissions. Do not create `ios/` or
  `android/` directories manually.
- Add EAS development and production build profiles.
- Verify exact Expo SDK 57-compatible package versions and current official docs
  before adding every Expo/React Native integration.

### Phase 1 — app shell and design system

- Install/configure NativeWind and create semantic tokens for the classic
  Instagram-like light UI, spacing, typography, safe areas, states, and
  accessibility.
- Replace the starter route with guarded Expo Router groups: auth, onboarding,
  and authenticated app.
- Build the four native tabs plus stacks/modals for compose, post detail,
  activity, profile settings, conversations, group management, and Story viewer.
- Add reusable loading, empty, retry, destructive-action confirmation, and
  permission-denied components.

### Phase 2 — authentication and profiles

- Integrate Clerk with Google and Apple sign-in and secure token storage.
- Sync a minimal Clerk-linked profile to Convex on first session.
- Build required onboarding for date-of-birth eligibility, unique handle, and
  display name.
- Build profile display/editing, avatar upload, public/private toggle, and
  destructive account deletion.
- Enforce handle normalization and uniqueness on the server.

### Phase 3 — backend domain and social graph

- Define the Convex schema, indexes, typed queries/mutations/actions, and
  authorization helpers for profiles, follows, blocks, activity, and limits.
- Implement public/private visibility and follow-request lifecycle.
- Implement server-side block checks in every profile, feed, search, post,
  Story, and messaging query/mutation.
- Create activity records for allowed social interactions and unread indicators.

### Phase 4 — media, posts, feed, and Explore

- Implement signed Cloudinary uploads and safe cleanup paths.
- Add media-library and in-app camera capture flows with platform-specific
  permission handling and validation before upload.
- Build the post composer, post deletion, likes, flat comments, and post detail.
- Build paginated following/recommendation feed queries with a recency/engagement
  scoring function and clear empty/error states.
- Build Explore account search and public-post grid.
- Enforce post size/duration and daily-post quotas in Convex, not just the UI.

### Phase 5 — Stories

- Add Story composer, segment validation, publishing quota, Home story rail,
  full-screen sequential viewer, viewer records, and mutual-only reply action.
- Add scheduled expiration cleanup for Story records and Cloudinary assets.
- Ensure Story queries honor private-account approval and blocks.

### Phase 6 — real-time messaging

- Implement conversation creation only for eligible mutual followers.
- Build direct conversation list, live conversation view, text/photo sending,
  group creation, membership administration, and 30-message-per-minute limit.
- Make existing conversations read-only for blocked users and safely anonymize
  deleted users while retaining other members' text history.
- Keep message payloads free of analytics-sensitive content.

### Phase 7 — notifications, observability, and privacy

- Add Expo push-token registration after the onboarding education screen and
  handle foreground/background/deep-link notification behavior.
- Send push and create Activity items for follows/requests, likes, comments,
  and messages; never send new-Story alerts.
- Add Sentry error boundaries and scrub personal/message data from reports.
- Add PostHog events for onboarding completion, follow, post, Story, engagement,
  message, and weekly-active funnel analysis; do not record media URLs, message
  text, or other sensitive content.
- Add privacy/terms screens and implement/export the data needed for account
  deletion and future GDPR access requests. Obtain legal review before launch.

### Phase 8 — quality and release

- Add core-flow end-to-end coverage for sign-in/onboarding, profile privacy,
  follow requests, blocks, posting, comments/likes, Stories, direct/group
  messaging, and account deletion.
- Run `npx expo lint` and `npx tsc --noEmit` before each release candidate.
- Perform manual smoke tests on physical iOS and Android devices, including
  permissions, camera, media upload, push, deep links, slow network, denied
  permissions, private visibility, and accessibility settings.
- Ship development builds first, then EAS production builds. Use OTA updates
  only when the native runtime remains compatible.

## Acceptance checklist

- A new eligible user can sign in with Google or Apple, complete onboarding, and
  see Home recommendations.
- Private posts/Stories are never visible to unapproved viewers, including
  through feed, search, media URLs, notifications, or direct routes.
- Blocked users cannot discover, follow, message, or view one another.
- All content mutations reject unauthenticated, unauthorized, over-quota, or
  invalid requests at the backend.
- Upload failures leave no orphaned visible records; cleanup is retryable.
- Story expiration and account deletion remove Cloudinary media reliably.
- Group permissions, deleted-user message anonymization, and mutual-DM policy
  behave consistently in realtime updates.
- VoiceOver/TalkBack labels, dynamic text, contrast, touch targets, and reduced
  motion are verified for the main flows.
- Typecheck, lint, automated critical-flow tests, and physical-device smoke
  tests pass before production release.

## Known risks and follow-ups

- A public global social product without reporting or moderation is a substantial
  user-safety and app-store risk; add reporting/review tooling before scaling.
- Global availability requires legal review of GDPR and other regional privacy,
  youth-safety, terms, and data-subject obligations.
- Cloudinary, push, analytics, and video consumption need budget monitoring;
  exact paid-tier thresholds remain to be set.
- No offline mutation queue means users can lose an in-progress composition on a
  network failure; the UI must make retry behavior explicit.
- Creator/fan messaging is deliberately restrictive: creators must follow back
  before a fan can start a DM.
