<div align="center">

# 🧠 MindMate AI

### Student Wellbeing Screening Platform

*A transparent, rule-based check-in tool that helps students reflect on their wellbeing — instantly, privately, with zero setup.*

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-mindmate--ai--blush.vercel.app-7c3aed?style=for-the-badge)](https://mindmate-ai-blush.vercel.app/)

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![No Backend](https://img.shields.io/badge/Backend-None_needed-16a34a?style=flat-square)](#3-the-mock-backend-localstorage)
[![Zero Setup](https://img.shields.io/badge/Setup_time-0_minutes-16a34a?style=flat-square)](#7-setup-instructions)

**SciBlitz AI Challenge 2026 · Track A — Health & Society**
*Not a diagnostic or medical service.*

</div>

---

<div align="center">

| 🚀 Zero Setup | 🔍 100% Explainable | 🔐 Privacy-First | 💛 Ethically Designed |
|:--:|:--:|:--:|:--:|
| Try it in 10 seconds — no account, no API keys | Every score traceable by hand, in ~80 lines of code | Admin sees only aggregates, never individual data | Crisis resources on every result, no exceptions |

</div>

---

## 🎯 For Judges — the 30-second version

> **[👉 Open the live app — no login required](https://mindmate-ai-blush.vercel.app/)**, then click **Try Free Demo** on the homepage.
>
> Want the full experience with a saved history and dashboard? Sign in with:
>
> | Role | Email | Password |
> |:--|:--|:--|
> | 🧑‍🎓 Student | `demo@mindmate.ai` | `demo123` |
> | 🛠️ Admin | `admin@mindmate.ai` | `admin123` |
>
> Both are one-tap "quick-fill" buttons right on the login screen. **Nothing to install, no API keys, no waiting on email confirmation.**

---

## 📋 Table of Contents

1. [Track Fit & Problem Statement](#1-track-fit--problem-statement-health--society)
2. [Why No Backend?](#2-why-no-backend-an-explicit-architecture-decision)
3. [The Mock Backend](#3-the-mock-backend-localstorage)
4. [Public No-Login Demo](#4-public-no-login-demo-demo)
5. [AI Engine](#5-ai-engine--rule-based-transparent-explainable)
6. [Tech Stack](#6-tech-stack)
7. [Setup Instructions](#7-setup-instructions)
8. [Vercel Deployment](#8-vercel-deployment-one-click)
9. [Limitations](#9-limitations)
10. [Future Improvements](#10-future-improvements)
11. [Ethical Disclaimer](#11-ethical-disclaimer)

---

## 1. Track Fit & Problem Statement (Health & Society)

Student mental wellbeing is under-monitored, especially where counseling staff-to-student ratios are low and stigma discourages students from asking for help directly. Most students never get a simple, private, judgment-free way to check in with themselves regularly.

**MindMate AI** addresses this with a confidential, self-serve screening tool that:

- 💬 Gives *individual students* a private, judgment-free wellbeing check-in with actionable, personalized suggestions.
- 📊 Gives *institutions* an anonymous, aggregate pulse on student wellbeing trends — without ever exposing who said what.
- 🎯 Is explicitly, consistently honest about its limits: a reflection and awareness tool, never a diagnosis.

---

## 2. Why No Backend? (An Explicit Architecture Decision)

An earlier version of this project used a managed Auth + Database + Row-Level-Security backend. It was removed **intentionally** for this submission:

| Problem with a real backend, for a hackathon | This build's answer |
|---|---|
| Judges need zero-setup access | No signup, no API keys, no project to provision — just open the link |
| Email confirmation blocks instant testing | Mock auth logs you in immediately, no confirmation step |
| Free-tier limits / project sleep / misconfiguration | No external service exists to misconfigure or hit a limit on |
| Environment variables to get right | **Zero required** |

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

Every service function returns `{ data, error }` — the exact shape a real network-backed service would return — so swapping this for a real API later ([see §10](#10-future-improvements)) is a contained change to 4 files, not a rewrite of every page.

⚠️ **Security note, stated plainly:** passwords are stored in plain text in `localStorage`. This is not an oversight — hashing them client-side would be security theater, since anyone with DevTools access can already read localStorage directly regardless of what's "hashed." Please don't enter a real password you use elsewhere.

---

## 4. Public No-Login Demo (`/demo`)

Required by the hackathon rules and built as a first-class route:

- ✅ The exact same 10 questions and scoring engine as the authenticated `/assessment` flow — a truthful preview, not a separate mock.
- ✅ **Nothing is saved anywhere** — not even to localStorage — by design: a public, no-login endpoint shouldn't write into anyone's account.
- ✅ Includes a static, clearly-labeled **"Preview: your Dashboard after a few check-ins"** section so judges get a feel for the tracked-over-time experience without registering.
- ✅ Linked prominently from the navbar and the homepage hero, logged in or out.

---

## 5. AI Engine — Rule-Based, Transparent, Explainable

No machine learning, no external API — every point can be traced to a rule. Full implementation: [`src/ai/scoreEngine.js`](src/ai/scoreEngine.js) (~80 lines).

```
10 questions (0-4 each, higher = more concern)
        │
        ▼
   raw sum (0-40)
        │
        ▼  linear scale:  round((rawSum / 40) × 100)
   score (0-100, strict integer)
        │
        ▼
   risk band  +  factor breakdown  +  personalized suggestions
```

1. **10 questions**, each answered on a **0–4 scale** ([`questions.js`](src/ai/questions.js)), worded so a **higher number always means more concern** — e.g. sleep runs `Excellent(0) → Very poor(4)`, social support runs `Very supported(0) → Not at all(4)`. One consistent rule, nothing left to get backwards.
2. **Raw sum** of all 10 answers → range 0 to 40.
3. **Linear transformation** to 0–100, clamped and guaranteed to be a strict integer. Every question counts equally — no hidden weighting to justify or get wrong.
4. **Risk bands** ([`riskBands.js`](src/ai/riskBands.js)):

   | Score | Band |
   |:--:|:--|
   | 0–30 | 🟢 Low Risk |
   | 31–60 | 🟡 Moderate Risk |
   | 61–80 | 🟠 Stress Risk |
   | 81–100 | 🔴 High Risk |

5. **Factor breakdown**: every result stores a per-question `{ label, value, riskPercent }` object — full explainability, not just a final number.
6. **Personalized suggestions**: factors are ranked by how concerning their answer was; the 2–4 worst get a targeted, supportive tip. A positive note leads when someone is doing well overall.
7. **Disclaimer**, shown on every result view: *"This is not a diagnostic tool. Please consult a professional for personal concerns."*

---

## 6. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Language | JSX |
| Styling | Tailwind CSS v3 (violet/purple brand palette, indigo accents) |
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
npm run dev        # → http://localhost:5173
```

**No `.env` file is required.** `.env.example` exists only to document that explicitly.

```bash
npm run build       # production build to dist/
npm run preview     # serve the production build locally
```

---

## 8. Vercel Deployment (One-Click)

Already live at **[mindmate-ai-blush.vercel.app](https://mindmate-ai-blush.vercel.app/)** — to deploy your own:

1. Push this repo to GitHub.
2. [vercel.com/new](https://vercel.com/new) → **Import** the repo. Framework preset **Vite** is auto-detected.
3. **No environment variables to add.**
4. Deploy. [`vercel.json`](vercel.json) already includes the SPA rewrite so client-side routes work on direct load/refresh:
   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
   ```
5. Done — a static site with nothing else to provision.

---

## 9. Limitations

- **No real backend** — an explicit, disclosed trade-off (§2), not an oversight. Data lives in one browser only.
- **Not encrypted, not backed up** — clearing browser data or switching devices/browsers loses everything, including accounts.
- **Client-only "security"** — role checks happen in the UI, not on a server; there's no way to make that a real security boundary without a real backend.
- **Self-report bias** — a single check-in reflects a moment, not a full picture.
- **Not clinically validated** — the scale is reasoned and explainable, not derived from a validated psychometric instrument.
- **English-only, general-audience questions.**
- **No professional-in-the-loop escalation.**

## 10. Future Improvements

- Swap the 4 mock service files for real API calls — every function already returns `{ data, error }`, so no page component would need to change.
- Reintroduce a real backend (managed Auth+DB platform, or a small Node/Express + Postgres API) for real persistence, real password hashing, and real server-enforced authorization.
- Multilingual support and culturally-adapted question sets.
- Optional check-in reminders and exportable reports to share with a counselor by choice.

---

## 11. Ethical Disclaimer

MindMate AI is a **wellbeing support and awareness tool**, not a diagnostic or clinical instrument. It does not diagnose, label, or rule out any mental health condition; its scoring is rule-based and explainable, not a validated psychometric instrument; it has no professional oversight in the loop; and it **cannot** detect or respond to a real crisis.

> If you or someone you know is in immediate danger, contact local emergency services or a crisis line right away — see the **"Need to talk to someone now?"** panel shown on every result view, and the full in-app **[Health Policy page](src/pages/HealthPolicy.jsx)** for details.

---

<div align="center">

*Built for SciBlitz AI Challenge 2026, Track A — Health & Society.*
*Not a substitute for professional mental health care.*

**[🚀 Try MindMate AI](https://mindmate-ai-blush.vercel.app/)**

</div>
