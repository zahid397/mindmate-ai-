# 🧠 MindMate AI — Student Wellbeing Screening Platform

> **SciBlitz AI Challenge 2026 — Track A: Health & Society**
> A fully static, frontend-only wellbeing screening app. **No backend. No database. No external API. Zero setup.**
> **This is not a diagnostic or medical service.**

MindMate AI lets students complete a short, confidential wellbeing check-in and get a transparent, rule-based score, a risk band, and personalized suggestions — instantly, with a **free no-login demo** for anyone to try. Registered users get a private dashboard with history and trends; admins get anonymous, aggregate-only analytics. Everything runs in the browser against `localStorage` — clone it, `npm install`, `npm run dev`, and it works. No environment variables, no accounts to provision, nothing to configure.

**🔗 Try it with zero setup:** `/demo` — the public route judges can open directly, no account required.

---

## 1. Track A Fit & Problem Statement (Health & Society)

Student mental wellbeing is under-monitored, especially where counseling staff-to-student ratios are low and stigma discourages students from asking for help directly. Most students never get a simple, private, judgment-free way to check in with themselves regularly.

MindMate AI addresses this with a **confidential, self-serve screening tool** that:
- Gives *individual students* a private, judgment-free wellbeing check-in with actionable, personalized suggestions.
- Gives *institutions* an anonymous, aggregate pulse on student wellbeing trends — without ever exposing who said what.
- Is explicitly, consistently honest about its limits: a reflection and awareness tool, never a diagnosis.

---

## 2. Why No Backend? (An Explicit Architecture Decision)

An earlier version of this project used a managed Auth + Database + Row-Level-Security backend. That was removed intentionally for this submission:

| Problem with a real backend, for a hackathon | This build's answer |
|---|---|
| Judges need zero-setup access | No signup, no API keys, no project to provision — just `npm run dev` |
| Email confirmation blocks instant testing | Mock auth logs you in immediately, no confirmation step |
| Free-tier limits / project sleep / RLS misconfiguration | No external service exists to misconfigure or hit a limit on |
| Environment variables to get right | **Zero required** — `.env.example` documents that explicitly |

The trade-off is disclosed, not hidden: data lives only in the current browser's `localStorage`, isn't encrypted, and doesn't survive clearing site data or switching devices. See [Limitations](#9-limitations) and the in-app **Health Policy** page.

---

## 3. The Mock Backend (localStorage)

Four small service files stand in for a real backend, all in `src/services/`:

| File | Responsibility |
|---|---|
| `mockDb.js` | The **only** file that touches `window.localStorage` directly — safe JSON read/write, id generation, and seeding demo data on first run. |
| `mockAuthService.js` | `register`, `login`, `logout`, `getCurrentUser` — no email verification, no password reset, no server. |
| `mockAssessmentService.js` | `saveAssessment`, `getUserAssessments` — filtered by user id, sorted newest-first. |
| `mockAdminService.js` | `getAdminStats()` — aggregate-only counts computed from the same array; contains no name/email/userId field, ever (verified by an automated test). |

**Storage keys:**
```
mindmate_users          → [{ id, name, email, password, role }]
mindmate_current_user   → { id, name, email, role } | null
mindmate_assessments    → [{ id, userId, date, score, riskBand, answers, factors, suggestions }]
```

Every service function returns `{ data, error }` — the exact same shape a real network-backed service would return — so swapping this for a real API later (see [Future Improvements](#10-future-improvements)) is a contained change to 4 files, not a rewrite of every page.

**Seeded on first load** (`initMockDb()`, called once from `main.jsx`, idempotent — never overwrites real data on a later visit):

| Account | Email | Password | Role |
|---|---|---|---|
| Student | `demo@mindmate.ai` | `demo123` | `user` |
| Admin | `admin@mindmate.ai` | `admin123` | `admin` |

The demo student account also gets 2 sample assessments pre-loaded, so the dashboard isn't empty on first login. Both credentials are also available as one-tap quick-fill buttons directly on the `/login` page.

⚠️ **Security note, stated plainly:** passwords are stored in plain text in `localStorage`. This is not a bug — hashing them client-side would be security theater, since anyone with DevTools access can already read localStorage directly regardless of what's "hashed." Do not enter a real password you use elsewhere.

---

## 4. Public No-Login Demo (`/demo`)

Required by the hackathon rules and built as a first-class route:

- The exact same 10 questions and scoring engine as the authenticated `/assessment` flow.
- **Nothing is saved anywhere** — not even to localStorage — by design: a public, no-login endpoint shouldn't write into anyone's account or pollute the seeded demo user's real history.
- Includes a static, clearly-labeled **"Preview: your Dashboard after a few check-ins"** section so judges get a feel for the tracked-over-time experience without needing to register.
- Linked prominently from the navbar and the homepage hero, logged in or out.

---

## 5. AI Engine — Rule-Based, Transparent, Explainable

No machine learning, no external API — every point can be traced to a rule. Full implementation: `src/ai/scoreEngine.js` (~80 lines).

1. **10 questions**, each answered on a **0–4 scale** (`src/ai/questions.js`), worded so a **higher number always means more concern**, regardless of topic — e.g. sleep runs `Excellent(0) → Very poor(4)`, social support runs `Very supported(0) → Not at all(4)`. This single rule replaces any per-question "direction" flag: there's nothing left to get backwards.
2. **Raw sum** = sum of all 10 answers → range 0 to 40.
3. **Linear transformation** to 0–100: `score = round((rawSum / 40) * 100)`, clamped and guaranteed to be a strict integer. Every question counts equally — no hidden weighting to justify or get wrong.
4. **Risk bands** (`src/ai/riskBands.js`):

   | Score | Band |
   |---|---|
   | 0–30 | 🟢 Low Risk |
   | 31–60 | 🟡 Moderate Risk |
   | 61–80 | 🟠 Stress Risk |
   | 81–100 | 🔴 High Risk |

5. **Factor breakdown** (`buildFactorBreakdown`): every result stores a per-question `{ label, value, riskPercent }` object (the `factors` field) — full explainability, not just a final number.
6. **Personalized suggestions**: factors are ranked by how concerning their answer was; the 2–4 worst get a targeted, supportive suggestion (`src/ai/suggestions.js`). A positive note leads when someone is doing well overall.
7. **Disclaimer**, shown on every result view: *"This is not a diagnostic tool. Please consult a professional for personal concerns."*

---

## 6. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Language | JSX (not TypeScript, per project requirements) |
| Styling | Tailwind CSS v3 |
| Routing | React Router DOM v6, code-split with `React.lazy` |
| Charts | Recharts (dashboard trend chart) |
| "Backend" | None — `localStorage` via the mock services above |
| AI / Scoring | Pure JavaScript, rule-based — no external API |
| Deployment | Vercel (static site) |

---

## 7. Setup Instructions

```bash
git clone <your-repo-url>
cd mindmate-ai
npm install
npm run dev        # http://localhost:5173
```

**No `.env` file is required.** `.env.example` exists only to document that explicitly.

```bash
npm run build       # production build to dist/
npm run preview     # serve the production build locally
```

---

## 8. Vercel Deployment (One-Click)

1. Push this repo to GitHub.
2. [vercel.com/new](https://vercel.com/new) → **Import** the repo. Framework preset **Vite** is auto-detected.
3. **No environment variables to add.**
4. Deploy. `vercel.json` already includes the SPA rewrite so client-side routes work on direct load/refresh, not just client-side navigation:
   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
   ```
5. Done — the app is a static site with nothing else to provision.

---

## 9. Limitations

- **No real backend** — this is an explicit, disclosed trade-off (see §2), not an oversight. Data lives in one browser only.
- **Not encrypted, not backed up** — clearing browser data or switching devices/browsers loses everything, including accounts.
- **Client-only "security"** — role checks happen in the UI, not on a server; there is no way to make that a real security boundary without a real backend.
- **Self-report bias** — a single check-in reflects a moment, not a full picture.
- **Not clinically validated** — the scale is reasoned and explainable, not derived from a validated psychometric instrument.
- **English-only, general-audience questions.**
- **No professional-in-the-loop escalation.**

## 10. Future Improvements

- Swap the 4 mock service files for real API calls — every function already returns `{ data, error }`, so no page component would need to change.
- Reintroduce a real backend (a managed Auth+DB platform, or a small Node/Express + Postgres API) for real persistence, real password hashing, and real server-enforced authorization.
- Multilingual support and culturally-adapted question sets.
- Optional check-in reminders and exportable reports to share with a counselor by choice.

---

## 11. Ethical Disclaimer

MindMate AI is a **wellbeing support and awareness tool**, not a diagnostic or clinical instrument. It does not diagnose, label, or rule out any mental health condition; its scoring is rule-based and explainable, not a validated psychometric instrument; it has no professional oversight in the loop; and it **cannot** detect or respond to a real crisis. If you or someone you know is in immediate danger, contact local emergency services or a crisis line right away — see the in-app "Need to talk to someone now?" panel (shown on every result view) and the full [Health Policy page](src/pages/HealthPolicy.jsx) for details.

---

*Built for SciBlitz AI Challenge 2026, Track A — Health & Society. Not a substitute for professional mental health care.*
