# Project Report — MindMate AI

## 1. Problem statement

Students face rising stress, anxiety, and study pressure, yet early signs often go unnoticed until they escalate. Formal help can feel intimidating or hard to access, and many students simply lack a low-pressure way to check in on their own wellbeing. There is a gap between "I feel off" and "I should talk to someone."

## 2. Solution

MindMate AI offers a quick, confidential, judgment-free wellbeing check-in. In about five minutes a student answers ten questions, receives a clear score with an explanation, and gets practical suggestions tailored to their weakest areas — always alongside a reminder that real support is available and that this is not a diagnosis. Over time, a personal dashboard reveals trends, and institutions can view anonymous aggregate patterns to allocate support.

## 3. Objectives

- Make wellbeing self-reflection accessible and stigma-free.
- Provide transparent, explainable scoring (no black-box AI).
- Protect privacy rigorously (per-user data isolation; anonymous analytics).
- Be genuinely deployable, not a mockup.

## 4. Scope

**In scope:** auth, a 10-question screening, a rule-based scoring engine, personalized suggestions, saving and viewing history with a trend chart, and anonymous admin analytics.

**Out of scope:** any diagnosis, messaging/chat, clinician dashboards, integrations with health systems, and notifications.

## 5. System design (summary)

A Vite + React SPA with Tailwind, React Router v6, and Recharts — and nothing else. There is no backend, database, or external API of any kind. Auth, assessment storage, and admin analytics are all mock services (`src/services/mock*.js`) backed by the browser's `localStorage`, chosen deliberately for a hackathon demo: zero setup, zero cost, zero external dependency for a judge to configure. Screening logic is a set of pure JavaScript functions in `src/ai/`.

## 6. The scoring engine

Each of the 10 questions is answered on a 0–4 scale, worded so a higher number always means more concern (no inversion logic needed — "Excellent → Very poor" and "Never → Almost constantly" both run the same direction). The raw sum of all 10 answers (0 to 40) is linearly scaled onto a strict 0–100 integer: `score = round((rawSum / 40) * 100)`. Every question counts equally — there is no differential weighting to explain or get wrong.

| Factor | Scale | Example worst-case option |
|--------|:-----:|-----------|
| Sleep | 0–4 | "Very poor" |
| Stress | 0–4 | "Extreme" |
| Anxiety | 0–4 | "Almost constantly" |
| Mood | 0–4 | "Almost constantly" (down/discouraged) |
| Study pressure | 0–4 | "Crushing" |
| Social support | 0–4 | "Not at all" (supported) |
| Concentration | 0–4 | "Cannot focus" |
| Screen time | 0–4 | "Very high" |
| Physical activity | 0–4 | "Not active" |
| Overwhelmed | 0–4 | "Almost constantly" |

Bands: Low (0–30), Moderate (31–60), Stress (61–80), High (81–100). Suggestions target whichever factors scored closest to 4 (the most concerning), so advice is always personal — 2 suggestions for a Low result, scaling up to 4 for a High one.

**Calibration check:** all-0 answers score exactly 0, all-4 answers score exactly 100, and every value in between is a clean, verifiable integer — confirmed by automated tests (see section 8).

## 7. Security & privacy

There is no server, so there is no server-enforced access control (no RLS, no JWTs) — that's an explicit trade-off of the localStorage architecture, stated plainly rather than glossed over. What the app does guarantee: `getUserAssessments(userId)` always filters by the requesting user's id before returning anything, the admin view is computed by a function that only ever returns aggregate counts (never a raw row, name, or email), and passwords, while stored in plain text, never leave the browser. Anyone with physical/DevTools access to the browser can read all of localStorage — this is disclosed on the Register page and in the Health Policy, and is why the demo asks users not to enter real passwords or sensitive data.

## 8. Testing & verification

A 34-assertion integration suite exercises the real, unmodified service files end-to-end in a Node environment with a localStorage polyfill: seeding, registration (including duplicate-email and case-insensitive email handling), login/logout, the scoring engine's boundaries (all-0 → 0, all-4 → 100, every value strictly an integer), the save → dashboard-fetch round trip (the exact failure mode originally reported), an empty-history case, and the admin aggregate (confirmed to contain zero personal-data fields). The full app also passes a production build (`npm run build`) with no errors, and every route was smoke-tested over HTTP for a valid response.

## 9. Results

A complete, deployable platform that meets every functional requirement: sign-up/login, screening, explainable scoring, personalized suggestions, persisted history with a trend chart, and anonymous admin analytics — wrapped in an accessible, mobile-first UI with consistent disclaimers.

## 10. Future improvements

- Validated instruments (e.g., adapting recognized scales) with professional review.
- Localization and culturally adapted question sets.
- Optional reminders for regular check-ins.
- Resource directories tailored to the user's institution/region.
- Exportable personal reports to share with a counselor by choice.

## 11. Conclusion

MindMate AI shows that a small, well-architected tool can responsibly support student wellbeing: transparent where it matters, private by default, and clear about its limits. It is a starting point for reflection and connection — never a replacement for human care.
