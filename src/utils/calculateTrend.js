/**
 * calculateTrend.js — derive simple trend stats from assessment history.
 */
import { formatShortDate } from "./formatDate";

/**
 * Build chart-ready points (oldest → newest) from assessment records.
 * @param {Array} assessments records with { score, date }
 * @returns {Array<{ date, score, fullDate }>}
 */
export function toTrendSeries(assessments = []) {
  return [...assessments]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((a) => ({
      date: formatShortDate(a.date),
      fullDate: a.date,
      score: a.score,
    }));
}

/** Average score across all assessments (rounded), or 0 if none. */
export function averageScore(assessments = []) {
  if (!assessments.length) return 0;
  const sum = assessments.reduce((acc, a) => acc + (a.score || 0), 0);
  return Math.round(sum / assessments.length);
}

/**
 * Direction of change between the two most recent scores.
 * @returns {{ delta:number, direction:'up'|'down'|'flat' }}
 */
export function recentDelta(assessments = []) {
  if (assessments.length < 2) return { delta: 0, direction: "flat" };
  // assessments come newest-first from the service
  const [latest, previous] = assessments;
  const delta = (latest.score || 0) - (previous.score || 0);
  const direction = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  return { delta: Math.abs(delta), direction };
}
