/**
 * mockAuthService.js
 * ─────────────────────────────────────────────────────────────────────
 * A fake auth server that lives entirely in localStorage. No network
 * call, no email verification, no password reset — every function is
 * synchronous under the hood but returns a Promise so calling code
 * (written for a "real" async backend) doesn't need to change shape if
 * this is ever swapped for a real API later.
 *
 * Every function returns { data, error } for consistency with the rest
 * of the app's service layer.
 */
import { KEYS, getItem, setItem, removeItem, generateId } from "./mockDb";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

/** Strip the password before handing a user object back to the UI. */
function toPublicUser(user) {
  if (!user) return null;
  const { password, ...publicUser } = user;
  return publicUser;
}

/**
 * Register a new user.
 * Unlike a real backend with email verification: no email confirmation step exists here
 * at all, so registration always auto-logs-in immediately — there is no
 * "check your email" limbo state to design around.
 */
export async function register({ fullName, email, password }) {
  try {
    const users = getItem(KEYS.USERS, []);
    const normalizedEmail = normalizeEmail(email);

    if (users.some((u) => normalizeEmail(u.email) === normalizedEmail)) {
      return { data: null, error: new Error("An account with this email already exists.") };
    }

    const newUser = {
      id: generateId(),
      name: String(fullName || "").trim(),
      email: normalizedEmail,
      password: String(password || ""),
      role: "user",
    };

    setItem(KEYS.USERS, [...users, newUser]);
    setItem(KEYS.CURRENT_USER, toPublicUser(newUser));

    return { data: { user: toPublicUser(newUser) }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/** Email + password login against the localStorage user list. */
export async function login({ email, password }) {
  try {
    const users = getItem(KEYS.USERS, []);
    const normalizedEmail = normalizeEmail(email);

    const match = users.find(
      (u) => normalizeEmail(u.email) === normalizedEmail && u.password === String(password || "")
    );

    if (!match) {
      return { data: null, error: new Error("Incorrect email or password.") };
    }

    setItem(KEYS.CURRENT_USER, toPublicUser(match));
    return { data: { user: toPublicUser(match) }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/** Clears the current session. */
export async function logout() {
  try {
    removeItem(KEYS.CURRENT_USER);
    return { data: true, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Synchronous current-user read, exposed as an async function for API
 * consistency with the rest of the service layer (and so it's a drop-in
 * shape if this is ever replaced with a real backend call).
 */
export async function getCurrentUser() {
  try {
    return { data: getItem(KEYS.CURRENT_USER, null), error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/** Synchronous variant — used by useAuth's initial state so there is no
 *  loading flicker on first render (a real network call can't avoid an
 *  async gap; a localStorage read doesn't need one). */
export function getCurrentUserSync() {
  return getItem(KEYS.CURRENT_USER, null);
}
