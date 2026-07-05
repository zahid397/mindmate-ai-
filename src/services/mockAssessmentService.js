/**
 * mockAssessmentService.js
 * ─────────────────────────────────────────────────────────────────────
 * Save and fetch wellbeing assessments, backed by the single
 * `mindmate_assessments` array in localStorage. Every function returns
 * { data, error } — the same contract a real backend would, so the
 * pages consuming this needed no shape changes, only an import swap.
 */
import { KEYS, getItem, setItem, generateId } from "./mockDb";

/**
 * Persist a completed screening for a logged-in user.
 * @param {Object} params
 * @param {string} params.userId
 * @param {number} params.score       0-100 integer
 * @param {string} params.riskBand    e.g. "Moderate Risk"
 * @param {Object} params.answers     raw { key: 0-4 } answers
 * @param {Object} params.factors     per-factor breakdown from the scoring engine
 * @param {Array}  params.suggestions [{ title, text }]
 */
export async function saveAssessment({ userId, score, riskBand, answers, factors, suggestions }) {
  try {
    if (!userId) {
      return { data: null, error: new Error("Cannot save an assessment without a logged-in user.") };
    }

    const assessments = getItem(KEYS.ASSESSMENTS, []);
    const record = {
      id: generateId(),
      userId,
      date: new Date().toISOString(),
      score: Math.round(Number(score)) || 0, // defensive: always a clean integer, never a float
      riskBand,
      answers,
      factors: factors || {},
      suggestions: suggestions || [],
    };

    const ok = setItem(KEYS.ASSESSMENTS, [...assessments, record]);
    if (!ok) {
      return { data: null, error: new Error("Couldn't save — your browser's local storage may be full or disabled.") };
    }

    return { data: record, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/** All assessments for one user, newest first. */
export async function getUserAssessments(userId) {
  try {
    if (!userId) return { data: [], error: null };
    const all = getItem(KEYS.ASSESSMENTS, []);
    const mine = all
      .filter((a) => a.userId === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    return { data: mine, error: null };
  } catch (error) {
    return { data: [], error };
  }
}

/** Every assessment across all users — used only by the admin aggregate,
 *  never rendered directly (see mockAdminService.js). */
export function getAllAssessmentsRaw() {
  return getItem(KEYS.ASSESSMENTS, []);
}
