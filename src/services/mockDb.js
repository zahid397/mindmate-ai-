/**
 * mockDb.js
 * ─────────────────────────────────────────────────────────────────────
 * The entire "backend" for this demo build is three localStorage keys.
 * This file is the ONLY place that touches `window.localStorage`
 * directly — every other mock service goes through the functions here.
 * That single choke point is what makes it safe to change the storage
 * mechanism later (e.g. swap in a real API) without touching any UI code.
 *
 * Storage keys:
 *   mindmate_users            -> Array<{ id, name, email, password, role }>
 *   mindmate_current_user     -> { id, name, email, role } | null
 *   mindmate_assessments      -> Array<{ id, userId, date, score, riskBand, answers, factors, suggestions }>
 *
 * NOTE ON SECURITY: this is a demo/hackathon mock, not a real backend.
 * Passwords are stored in plain text because there is no server to hash
 * them against, and hashing client-side would be security theater —
 * anyone with access to the browser can already read localStorage
 * directly in DevTools regardless of what's "hashed". Do not put real
 * passwords or sensitive personal data into this demo. See the Health
 * Policy page and README "Limitations" for the full disclosure.
 */

export const KEYS = {
  USERS: "mindmate_users",
  CURRENT_USER: "mindmate_current_user",
  ASSESSMENTS: "mindmate_assessments",
};

/** True if localStorage is actually usable (private/incognito mode in
 *  some browsers, or SSR, can make it throw on access). */
function storageAvailable() {
  try {
    const testKey = "__mindmate_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export const isStorageAvailable = storageAvailable();

/** Safe read + JSON parse. Never throws; returns `fallback` on any failure. */
export function getItem(key, fallback) {
  if (!isStorageAvailable) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    // A corrupted/partial JSON value should never crash the app — treat
    // it as "no data" and let the caller's normal empty-state handle it.
    console.warn(`[mockDb] Failed to read "${key}", using fallback.`, err);
    return fallback;
  }
}

/** Safe JSON stringify + write. Returns true on success, false on failure
 *  (e.g. quota exceeded) so callers can surface a friendly error instead
 *  of throwing mid-render. */
export function setItem(key, value) {
  if (!isStorageAvailable) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[mockDb] Failed to write "${key}".`, err);
    return false;
  }
}

export function removeItem(key) {
  if (!isStorageAvailable) return;
  try {
    window.localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[mockDb] Failed to remove "${key}".`, err);
  }
}

/** Generates a reasonably-unique id. Prefers the browser's native UUID;
 *  falls back to a timestamp+random string on older browsers or in a
 *  Node test environment where `crypto.randomUUID` may be unavailable. */
export function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

// ── Seed data ──────────────────────────────────────────────────────
// A ready-to-use demo account and admin account, plus two sample
// assessments so the demo user's dashboard isn't empty on first login.
const SEED_DEMO_USER_ID = "seed-demo-user";
const SEED_ADMIN_USER_ID = "seed-admin-user";

function buildSeedUsers() {
  return [
    {
      id: SEED_DEMO_USER_ID,
      name: "Demo Student",
      email: "demo@mindmate.ai",
      password: "demo123",
      role: "user",
    },
    {
      id: SEED_ADMIN_USER_ID,
      name: "Demo Admin",
      email: "admin@mindmate.ai",
      password: "admin123",
      role: "admin",
    },
  ];
}

function buildSeedAssessments() {
  const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
  return [
    {
      id: generateId(),
      userId: SEED_DEMO_USER_ID,
      date: daysAgo(9),
      score: 62,
      riskBand: "Stress Risk",
      answers: { sleep: 3, stress: 3, anxiety: 3, mood: 2, studyPressure: 3, socialSupport: 2, concentration: 2, screenTime: 3, physicalActivity: 2, overwhelmed: 3 },
      factors: {},
      suggestions: [],
    },
    {
      id: generateId(),
      userId: SEED_DEMO_USER_ID,
      date: daysAgo(2),
      score: 45,
      riskBand: "Moderate Risk",
      answers: { sleep: 2, stress: 2, anxiety: 2, mood: 2, studyPressure: 2, socialSupport: 1, concentration: 2, screenTime: 2, physicalActivity: 2, overwhelmed: 2 },
      factors: {},
      suggestions: [],
    },
  ];
}

/**
 * Seeds demo data ONLY if this is a first run (i.e. `mindmate_users`
 * doesn't exist yet). Safe to call on every app load — it never
 * overwrites real data a user has already created. Call this once from
 * `main.jsx` before the app renders.
 */
export function initMockDb() {
  if (!isStorageAvailable) return;
  const existingUsers = getItem(KEYS.USERS, null);
  if (existingUsers === null) {
    setItem(KEYS.USERS, buildSeedUsers());
    setItem(KEYS.ASSESSMENTS, buildSeedAssessments());
  }
}
