/**
 * scoreEngine.js
 * ─────────────────────────────────────────────────────────────────────
 * A transparent, rule-based scoring engine. No machine learning, no
 * external API — every number can be explained line by line.
 *
 * The model (deliberately simple and explainable):
 *   1. Each of the 10 questions is answered on a 0-4 scale, where a
 *      HIGHER number always means MORE concern (see questions.js).
 *   2. rawScore = sum of all 10 answers  →  range 0 to 40.
 *   3. score = round( (rawScore / 40) * 100 )  →  a linear transform
 *      onto a strict 0-100 scale. Every question contributes equally;
 *      there is no hidden per-question weighting to explain away.
 *   4. The score maps to one of four risk bands (riskBands.js).
 *   5. Suggestions target whichever factors scored worst (closest to 4).
 */
import { QUESTIONS, MAX_RAW_SCORE } from "./questions";
import { getRiskBand } from "./riskBands";
import { SUGGESTION_LIBRARY, POSITIVE_NOTE, DISCLAIMER } from "./suggestions";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/** Reads one answer defensively: missing/non-numeric answers count as 0
 *  (best case) rather than crashing or silently becoming NaN. Actual
 *  completeness is enforced separately by validateAnswers() before this
 *  ever runs — this is just a safety net, not the validation gate. */
function readAnswer(answers, key) {
  const raw = Number(answers?.[key]);
  return Number.isFinite(raw) ? clamp(raw, 0, 4) : 0;
}

/**
 * calculateScore(answers)
 * ─────────────────────────────────────────────────────────────────────
 * @param {Object} answers  e.g. { sleep: 3, stress: 2, ... } each 0-4
 * @returns {number} a STRICT integer 0-100 (guaranteed by Math.round +
 *   clamp — the single source of truth for this invariant; every
 *   caller downstream can trust the result is always a clean int).
 */
export function calculateScore(answers) {
  const rawScore = QUESTIONS.reduce((sum, q) => sum + readAnswer(answers, q.key), 0);
  const score = clamp(Math.round((rawScore / MAX_RAW_SCORE) * 100), 0, 100);

  if (import.meta.env.DEV && !Number.isInteger(score)) {
    // Should be unreachable — if this ever fires, fix it here, not by
    // adding another round() call somewhere downstream.
    console.error("[scoreEngine] calculateScore produced a non-integer:", score);
  }

  return score;
}

/**
 * buildFactorBreakdown(answers)
 * ─────────────────────────────────────────────────────────────────────
 * The explainability layer: one entry per question showing exactly how
 * much that factor contributed. This is what gets stored in each
 * assessment's `factors` field and is also used internally to rank
 * which factors are weakest (worst) for personalizing suggestions.
 *
 * @returns {Object<string, {label:string, value:number, riskPercent:number}>}
 */
export function buildFactorBreakdown(answers) {
  const factors = {};
  for (const q of QUESTIONS) {
    const value = readAnswer(answers, q.key);
    factors[q.key] = {
      label: q.label,
      value,
      riskPercent: Math.round((value / 4) * 100),
    };
  }
  return factors;
}

/**
 * generateSuggestions(factors, score)
 * ─────────────────────────────────────────────────────────────────────
 * Ranks factors by their raw value (highest = most concerning = the
 * "weakest" factor) and surfaces advice for the top 2-4, scaling with
 * severity. A positive note leads when the person is doing well overall.
 * Always returns a non-empty array.
 */
export function generateSuggestions(factors, score) {
  const ranked = Object.entries(factors)
    .map(([key, f]) => ({ key, value: f.value }))
    .sort((a, b) => b.value - a.value);

  const meaningful = ranked.filter((f) => f.value >= 2); // "some concern" or worse
  const suggestions = [];

  if (score <= 30 || meaningful.length === 0) {
    suggestions.push(POSITIVE_NOTE);
  }

  const count = score <= 30 ? 2 : score <= 60 ? 3 : 4;
  for (const factor of meaningful.slice(0, count)) {
    const tip = SUGGESTION_LIBRARY[factor.key];
    if (tip && !suggestions.some((s) => s.title === tip.title)) {
      suggestions.push(tip);
    }
  }

  if (suggestions.length === 0) suggestions.push(POSITIVE_NOTE);
  return suggestions;
}

/**
 * Convenience: run the whole pipeline at once.
 * @returns {{ score:number, riskBand:string, factors:Object, suggestions:Array }}
 */
export function runScreening(answers) {
  const score = calculateScore(answers);
  const riskBand = getRiskBand(score).label;
  const factors = buildFactorBreakdown(answers);
  const suggestions = generateSuggestions(factors, score);
  return { score, riskBand, factors, suggestions };
}

export { DISCLAIMER };
