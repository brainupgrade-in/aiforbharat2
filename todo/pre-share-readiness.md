# Pre-Share Readiness — Action Items

**Created:** 2026-05-01
**Trigger:** Owner asked for an audit before sharing the live app with their close network.
**Live URL:** https://nazarai.gheware-ai.com/

Audit covered: feature flow, intuitive UI, honesty of displayed data, error states, persistence, missing affordances. All public health endpoints (`/auth/health`, `/api/chat/health`, `/api/scan/health`) are 200 OK; issues found are all UX / feature-honesty.

---

## 🔴 BLOCKERS — fix before sharing

### 1. Home page shows hardcoded fake data as user's data
- **Where:** `src/pages/NazarHome.jsx` lines 6-14, 51-54
- **What:** `lastScanDate = '28 Feb 2026'`, `lastScanResult = 0`, `streakDays = 14`, `communityCount = 2847`, weekly sparkline `sugarData[]` — all hardcoded literals
- **Why critical:** A first-time user sees "Last scan: 28 Feb 2026 — No DR" and assumes the app is showing them data they didn't enter. Damages trust immediately.
- **Fix:** Replace with `useQuery` against `glucose_reading` and `retina_scan`; show empty states ("No scans yet — tap 'Scan Now' to start") when no data exists.

### 2. Community page is essentially fictional
- **Where:** `src/pages/NazarCommunity.jsx`
- **What:**
  - `totalScans = 284720` — animated counter on a made-up number
  - `stateData[]` — fabricated 10-state scan-count leaderboard
  - `stories[]` — three fictional patient testimonials (Ramesh Kumar, Lakshmi Devi, Suresh Patel) with fake quotes
  - `getLocalStats(locationName)` (line 67) — deterministically derived from `locationName.length`, looks like real village data
  - "Across 28 states" claim (line 147) — false
- **Why critical:** Health-app users expect honesty. Sharing fictional retina-scan testimonials with diabetic friends is the single most reputationally risky thing in this app.
- **Fix options:**
  - (Recommended) Hide the tab from bottom nav until real community data exists
  - (Alternative) Rename "Community" → "Roadmap" and reframe numbers as Year-1 targets; remove fake testimonials

### 3. No profile setup; no UI for name / diabetes type / target glucose
- **Where:** `user_profile` table exists in Postgres, has Hasura RLS perms, **zero UI references**
- **What:** New user has nowhere to enter name, age, diabetes type, target glucose, language. Scan asks for "Patient ID" as free-text every time.
- **Fix:** First-login onboarding screen → write to `user_profile`. Small "Profile" affordance to edit later.

### 4. Chat history thrown away on refresh / tab switch
- **Where:** `src/pages/NazarChat.jsx` keeps messages in `useState` only
- **What:** `chat_message` table + `INSERT_CHAT_MESSAGE` / `LIST_CHAT_MESSAGES` are wired in `src/lib/queries.js` but the page **never calls them**. Refresh or tab switch loses the entire conversation.
- **Fix:** Wire `useQuery(LIST_CHAT_MESSAGES, {sessionId})` on mount and `useMutation(INSERT_CHAT_MESSAGE)` after each user/assistant turn.

### 5. Doctor-mode buttons are dead, visible to everyone
- **Where:** `src/pages/NazarResult.jsx` lines 192-208
- **What:** `Refer`, `Review later`, `Mark normal`, `Export EHR` — no `onClick`, decoration only. Doctor-mode toggle has no role gating.
- **Fix:** Hide doctor mode behind a role flag, OR wire up Export EHR (signed PDF/JSON of scan + image) and remove the other three. Patient-mode-only is the simplest cut.

---

## 🟡 ROUGH EDGES — share-acceptable but expected reports

### 6. No "Resend OTP" button
- **Where:** `src/components/OtpLoginForm.jsx`
- **What:** If the OTP email doesn't arrive, user clicks "Use a different email", retypes same address. Should be a "Resend code" button with 60s cooldown.

### 7. Token expiry has no recovery UX
- **Where:** `src/lib/apollo.js` (no error link)
- **What:** JWT lifetime is 7 days. After expiry, every API call returns 401 with opaque errors. Need an Apollo `errorLink` that detects 401 → calls `signOut()` and surfaces "Your session has expired" message.

### 8. Glucose entries are immutable
- **Where:** `src/pages/NazarGlucose.jsx`
- **What:** No edit/delete UI. Typo `1500` instead of `150` is stuck forever.
- **Fix:** Tap-to-edit + swipe-to-delete or trash icon per row. `DELETE_GLUCOSE_READING` mutation needs to be added to `queries.js`.

### 9. Language preference doesn't persist
- **Where:** `src/pages/NazarApp.jsx` line 65 — `useState('hi')` every session
- **Fix:** Save selected language to `user_profile.language` (column exists) and read on login. Fall back to `localStorage`.

### 10. Photo quality check is fake-permissive
- **Where:** `src/pages/NazarScan.jsx` after Phase 3 rewrite — any decodable image is `'good'`
- **Fix:** At minimum reject if image dimensions < 224×224. Better: client-side Laplacian-variance blur check.

### 11. Long upload has no progress UI
- **Where:** `src/pages/NazarScan.jsx` step 2
- **What:** 5 MB phone image on 4G takes 15-30s. "Analyzing…" screen shows nothing during upload phase.
- **Fix:** XMLHttpRequest with upload progress event, or fetch streams + a progress bar.

### 12. No scan history view
- **Where:** Past `retina_scan` rows are persisted but unreadable from UI
- **Fix:** List view on Home or in a new tab; tap a row → see the result page again.

---

## 🟢 NICE-TO-HAVES — don't block share

- Email OTP template has no branding (whatever SES default is)
- Suggested chat questions could vary by recent glucose / scan
- 4-digit OTP + voice readout for low-literacy users
- Dark mode
- Pull-to-refresh on Glucose tab

---

## Recommended sequence

**Block 1 — 2-3 hours, fixes the four most embarrassing issues**
- [x] §4 wire chat history (sessionId in localStorage, `useQuery`/`useMutation` against `chat_message`, sign-out clears session)
- [x] §1 replace Home's hardcoded data with `useQuery` + empty states (real `LIST_RETINA_SCANS` + `LIST_GLUCOSE_READINGS`, dropped fake streak/community counter)
- [x] §2 hide Community tab from bottom nav (and dropped the import so it tree-shakes out of the bundle)
- [x] §5 doctor-mode toggle removed entirely along with the four dead buttons (Refer / Review later / Mark normal / Export EHR)

**Block 2 — adds another half day, removes most "expected reports"**
- [x] §3 onboarding profile screen + edit affordance (`ProfileForm` shared between fullscreen onboarding and modal edit; gated via `ProfileGate` in `App.jsx`; user is bounced to onboarding until `name` is set)
- [x] §6 Resend OTP + 60-sec cooldown (countdown + "New code sent" toast)
- [x] §9 language persists to `user_profile.language` AND `localStorage`; on login `ProfileGate` syncs `lang` from server

**Block 3 — polish (partial)**
- [x] §7 401 → re-login UX (Apollo `errorLink` dispatches `nazarai:session-expired` → `AuthProvider` listens and forces signOut)
- [x] §10 photo quality minimum (image dimensions ≥ 224×224 enforced on both file upload and camera capture paths)
- [x] §8 delete glucose readings (trash icon per row, `window.confirm`, `DELETE_GLUCOSE_READING` mutation)
- [ ] §11 upload progress UI — deferred
- [ ] §12 scan history — deferred

---

**Status:** Block 1 ✅ · Block 2 ✅ · Block 3 partial (3/5). The two deferred items don't block share — current build is share-ready.

**Deferred follow-ups (not blocking share):**
- §11 upload progress UI for slow connections (Analyzing… screen currently shows nothing during the 5-15s upload phase on 4G)
- §12 scan history list view
- Edit-mode for individual glucose readings (delete works; in-place value edit is still missing)
- Server-side rate limit on `/auth/request-login` (client cooldown is honest-user only)
- Lang-aware OTP screen (currently English-only; Auth screen i18n is a separate piece of work)
