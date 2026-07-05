# Interview Questions & Answers — MindMate AI

A practice set covering the project, the stack, and the concepts. Answers are concise and explainable.

---

**1. Explain your project.**
MindMate AI is a student wellbeing screening platform. A student signs up, completes a short 10-question check-in, and receives a transparent score (0–100) with a risk band and personalized suggestions. Results are saved so they can track trends on a dashboard, and admins can see anonymous aggregate analytics. It's explicitly an educational screening tool, not a diagnostic one.

**2. What problem does it solve?**
Students often notice they "feel off" but lack a low-pressure, private way to reflect on their wellbeing before things escalate. MindMate bridges the gap between that vague feeling and reaching out for help, by offering a quick check-in and pointing toward real support.

**3. Why does this app have no backend at all?**
It's a deliberate choice for a hackathon demo: judges need to evaluate the app with zero setup, and a real backend (even a managed one) brings friction — email confirmation steps, free-tier limits, environment variables to configure. Auth, assessment storage, and admin analytics are mock services backed by the browser's `localStorage`, which behave identically from the UI's point of view but need nothing to be configured or provisioned.

**4. How does your AI scoring algorithm work?**
Each of 10 questions is answered on a 0–4 scale, worded so a higher number always means more concern. The raw sum of all 10 answers (0 to 40) is linearly scaled onto a strict 0–100 score: `round((rawSum / 40) * 100)`. That score maps to one of four bands, and I surface suggestions for whichever factors scored closest to 4 (the most concerning).

**5. Why does every question count equally instead of using different weights?**
Simplicity and explainability. A differential weighting scheme (e.g. "stress counts for 20%, screen time for 4%") requires justifying every number and is one more thing to get subtly wrong. An equal-weight linear sum is trivial to verify — anyone can add up 10 numbers by hand and check the math — which matters more for a transparency-first tool than a marginal gain in "realism" from hand-tuned weights I can't actually validate.

**6. Why is it rule-based instead of machine learning?**
Transparency and trust. Anyone can read the code and explain exactly why a score came out the way it did — important for a wellbeing tool. It also needs no training data, no external API, and runs instantly with zero cost.

**7. What is authentication, and how does it work here?**
Verifying *who* a user is. `mockAuthService.js` checks an email/password pair against a `mindmate_users` array in localStorage and, on success, writes a `mindmate_current_user` record. It's a real, working login flow — there's just no server issuing a cryptographic token behind it, which is disclosed openly rather than dressed up to look more secure than it is.

**8. What is authorization, and how does it work here?**
Deciding *what* an authenticated user is allowed to do. `getUserAssessments(userId)` always filters by the requesting user's id, and `/admin` is gated by a `role === 'admin'` check in `ProtectedRoute`. I'm explicit that this is a UI-layer convenience, not a security boundary — anyone with DevTools access could edit their own `mindmate_current_user.role`. There's no way around that with a client-only architecture, so the honest answer is "this is a demo, not a production auth system," not a false claim of real enforcement.

**9. Why localStorage instead of IndexedDB or sessionStorage?**
localStorage is synchronous, has broad, simple browser support, and persists across tabs and reloads (unlike sessionStorage, which clears per-tab). IndexedDB would be more capable but is overkill for three small JSON arrays — added complexity with no real benefit at this scale.

**10. How do you protect user data in this build?**
Realistically: the app never displays another user's data (fetches are always filtered by id), the admin aggregate function only ever returns counts, and there's no network transmission at all, so there's nothing to intercept in transit. What it can't protect against is local device access — that trade-off is stated plainly in the Health Policy page, not hidden.

**11. Why React?**
The UI is stateful and component-driven — forms, dashboards, reusable cards. React's component model and hooks make that state manageable and the pieces reusable.

**12. Why Vite?**
Fast dev server with instant hot-module reload and a quick, modern production build. It ships as static files, which is exactly what this project needs — no server runtime required at all.

**13. What "database" does this project use?**
None, technically — `localStorage` is just browser key-value storage. The app treats three keys (`mindmate_users`, `mindmate_current_user`, `mindmate_assessments`) as if they were tables, with `mockDb.js` as the single module that actually touches `window.localStorage`. That single choke point is what would make swapping in a real backend later a contained change, not a rewrite.

**14. What is CRUD?**
Create, Read, Update, Delete — the basic data operations. This app creates assessments and user accounts, reads history and the current user, and intentionally allows no update/delete on assessments so history stays trustworthy.

**15. What is async/await?**
Syntax for handling asynchronous operations in a readable, sequential style. Every mock service function is declared `async` and returns a `{ data, error }` object, even though the underlying localStorage calls are synchronous — that keeps the same shape a real network-backed service would have, so swapping the backend later wouldn't change how any page calls it.

**16. Is there an API in this project?**
No external one. The "API" is just a set of plain JavaScript functions (`register`, `login`, `saveAssessment`, `getAdminStats`, ...) that read and write localStorage directly. There's no HTTP request anywhere in the app.

**17. Difference between frontend and backend, and where does this project sit?**
The frontend is what runs in the browser; the backend is server-side logic and storage. This project has no backend at all — everything, including what would normally be backend logic (auth checks, aggregation), runs client-side. That's the central architectural trade-off of this build and is called out explicitly rather than implied away.

**18. What are the limitations of this project?**
It relies on self-report, the scoring is rule-based but not a validated clinical scale, there's no clinician in the loop, a single screening is only a snapshot, and — specific to this build — all data lives only in one browser's localStorage with no encryption and no backup. It's for awareness and demonstration, not measurement or production use. (See `ethics-and-limitations.md`.)

**19. Why is this not a medical diagnosis tool?**
Because it doesn't identify or rule out any condition, isn't validated clinically, and has no professional oversight. It screens and supports — diagnosis requires a qualified professional. Disclaimers make this explicit on every results view and on the dedicated Health Policy page.

**20. What future improvements would you add?**
A real backend (even a lightweight one) so data survives across devices and browser resets, adapting validated instruments with professional review, localization, optional check-in reminders, and letting users export a report to share with a counselor by choice.

**21. How do you handle errors and loading states?**
Services return `{ data, error }`; hooks expose `loading`, `error`, and `isEmpty`, and the Dashboard/AdminDashboard render distinct UI for each — a spinner while loading, a friendly retry message on a genuine error, and a "take your first assessment" empty state when there's simply no data yet, never conflating the two.

**22. How does the protected-route logic work?**
A `ProtectedRoute` component reads `useAuth`. Because `localStorage` reads are synchronous, the current user is known immediately on first render — there's no "loading" phase to guard against here at all, unlike a network-backed auth flow. If there's no user it redirects to `/login` (remembering where they were headed); the admin route additionally checks `role === 'admin'`.

**23. How does a user account get created?**
`mockAuthService.register()` checks the `mindmate_users` array for a case-insensitive email collision, then appends a new `{ id, name, email, password, role: 'user' }` record and immediately writes it as the current user — no confirmation step exists, so registration and login happen in the same action.

**24. How would you scale this project toward something real?**
Swap the four `mock*Service.js` files for real API calls — because every function already returns the same `{ data, error }` shape a real backend would, no page component needs to change. Add a real backend (e.g. a managed Auth+DB platform, or a small Node/Express + Postgres API) behind that same interface, then layer in real password hashing, session tokens, and server-enforced authorization — none of which is meaningful to fake in a client-only demo.
