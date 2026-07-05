/**
 * validators.js — lightweight form validation (no dependencies).
 */
import { QUESTION_KEYS } from "../ai/questions";

/** Basic email shape check. */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

/** Password must be at least 6 characters — a reasonable minimum for a
 *  demo account with no real backend enforcing anything stronger. */
export function isValidPassword(password) {
  return String(password || "").length >= 6;
}

/** Non-empty trimmed string. */
export function isNonEmpty(value) {
  return String(value || "").trim().length > 0;
}

/**
 * Ensure every screening question has a valid answer in the 0-4 range.
 * Returns { valid, missing: [keys] }.
 */
export function validateAnswers(answers) {
  const missing = QUESTION_KEYS.filter((key) => {
    const v = answers?.[key];
    if (v === undefined || v === null) return true;
    const n = Number(v);
    return Number.isNaN(n) || n < 0 || n > 4;
  });
  return { valid: missing.length === 0, missing };
}
