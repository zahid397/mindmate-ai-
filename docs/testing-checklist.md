# Testing Checklist — MindMate AI (localStorage build)

Unlike the earlier server-backed version, everything in this build runs
entirely client-side — so almost all of this checklist can be run
immediately after `npm install && npm run dev`, with zero external setup.

## ✅ Automated & already verified in this environment

- [x] `npm install` completes cleanly (170 packages — down from 180 before
      the external backend SDK was removed).
- [x] `npm run build` completes with **zero errors** across all 867 modules.
- [x] Production bundle inspected: main chunk dropped from 465kB → **256kB**
      just from removing the external backend SDK, on top of the existing
      `Dashboard`/`AdminDashboard` code-splitting.
- [x] **34 automated integration tests**, run against the real, unmodified
      `src/services/mock*.js` and `src/ai/*.js` files in Node with a
      localStorage polyfill — not mocks of the real code, the real code:
  - `initMockDb()` seeds exactly 2 users + 2 sample assessments, and is
    idempotent (calling it twice never duplicates data).
  - Registration: succeeds, auto-logs-in with no confirmation step, never
    leaks the password field back to the UI, and rejects a case-insensitive
    duplicate email.
  - Login: rejects a wrong password, accepts the seeded demo credentials,
    and is case-insensitive on email.
  - Scoring: all-0 answers → exactly 0; all-4 answers → exactly 100; every
    score is a strict integer; all 10 questions have exactly 5 options.
  - `runScreening()` returns `score` / `riskBand` / `factors` / `suggestions`
    with the correct shape, and suggestions are always non-empty.
  - `validateAnswers()` correctly rejects incomplete and out-of-range input.
  - **Save → dashboard fetch round trip** (the exact bug class originally
    reported): saving succeeds with no error, the saved score is a clean
    integer, and fetching immediately returns the new record plus the
    seeded ones, sorted newest-first.
  - Fetching a user with zero assessments returns an empty array, never an
    error — this is what drives the dashboard's proper empty state instead
    of a false "couldn't load" message.
  - Admin aggregate stats return no error, correct totals, all 4 risk-band
    keys present, and — checked programmatically — contain **no** `userId`,
    `name`, or `email` field anywhere in the response.
- [x] Every route smoke-tested over HTTP against the production build
      (`vite preview`): `/`, `/demo`, `/about`, `/health-policy`, `/login`,
      `/register`, `/dashboard`, `/admin`, `/assessment`,
      `/assessment-result`, and an arbitrary unknown path — all return
      `200` with the app shell intact (confirming the SPA fallback that
      `vercel.json`'s rewrite replicates in production).
- [x] Full repo swept for stray references to the old backend, old field names
      (`riskLevel`, `wellbeingFactors`, `created_at`, `full_name`), and
      broken imports — clean.

## 📋 Manual click-through (2 minutes, no setup needed)

- [ ] `npm install && npm run dev`, open the printed local URL.
- [ ] Click **Try Free Demo** on the homepage → complete the 10 questions
      → confirm a score, risk band, personalized suggestions, crisis
      resources, and disclaimer all appear, plus the "Preview: your
      Dashboard" example section.
- [ ] From `/login`, tap the **Student** demo-account quick-fill button →
      Sign in → confirm you land on `/dashboard` with 2 pre-seeded
      assessments already visible (not an empty state).
- [ ] Take a real assessment while logged in → confirm you land on
      `/assessment-result` with **"Saved to your history"** in the header
      (not "Couldn't save").
- [ ] Return to `/dashboard` → confirm the new assessment appears in the
      trend chart and history list with the correct score and risk band.
- [ ] Log out, register a **new** account → confirm you're logged in
      immediately with no confirmation step, landing on an **empty**
      dashboard ("Take your first assessment...").
- [ ] Log out, log back in as **Admin** (quick-fill button) → confirm
      `/admin` is reachable from the sidebar and shows aggregate-only
      stats (no names/emails anywhere on the page).
- [ ] While logged in as the regular Student account, try navigating
      directly to `/admin` → confirm it redirects to `/dashboard`.
- [ ] Log out → try `/dashboard` directly → confirm redirect to `/login`.
- [ ] Open DevTools → Application → Local Storage → confirm the three keys
      (`mindmate_users`, `mindmate_current_user`, `mindmate_assessments`)
      are present and readable as plain JSON.
- [ ] Refresh the page while on `/demo` or `/dashboard` directly (not via
      in-app navigation) — after deploying to Vercel, confirms
      `vercel.json`'s SPA rewrite is working (locally, `vite preview`
      handles this slightly differently).

## Known, disclosed trade-off

There is no "requires a live external project" section in this checklist
anymore — that's the point of going backend-free for the demo. The
trade-off is disclosed instead of hidden: data lives only in one browser,
isn't encrypted, and doesn't survive clearing site data. See
`ethics-and-limitations.md` and the in-app Health Policy page.
