/**
 * riskBands.js
 * ─────────────────────────────────────────────────────────────────────
 * Risk bands and their display metadata, defined exactly once and
 * reused by the scoring engine, RiskBadge, Result, Demo, and Dashboard.
 * (Renamed from the old `riskLevels.js` for consistent terminology — the
 * field is called `riskBand` everywhere now, with nothing left to
 * translate at a database boundary since there's no database anymore.)
 */

export const RISK_BANDS = [
  {
    id: "low",
    label: "Low Risk",
    min: 0,
    max: 30,
    badge: "bg-emerald-100 text-emerald-700",
    ring: "text-emerald-500",
    dot: "bg-emerald-500",
    blurb: "Your responses suggest you're managing well right now. Keep up the healthy habits.",
  },
  {
    id: "moderate",
    label: "Moderate Risk",
    min: 31,
    max: 60,
    badge: "bg-amber-100 text-amber-700",
    ring: "text-amber-500",
    dot: "bg-amber-500",
    blurb: "You may be experiencing some stress or emotional challenges that could benefit from attention and self-care.",
  },
  {
    id: "stress",
    label: "Stress Risk",
    min: 61,
    max: 80,
    badge: "bg-orange-100 text-orange-700",
    ring: "text-orange-500",
    dot: "bg-orange-500",
    blurb: "Several areas point to elevated stress. Consider reaching out for support and prioritizing recovery.",
  },
  {
    id: "high",
    label: "High Risk",
    min: 81,
    max: 100,
    badge: "bg-red-100 text-red-700",
    ring: "text-red-500",
    dot: "bg-red-500",
    blurb: "Your responses suggest you're under significant strain. Please consider speaking with a professional or a trusted person soon.",
  },
];

/** Return the full risk-band object for a numeric score (0–100). */
export function getRiskBand(score) {
  const s = Math.max(0, Math.min(100, Math.round(score)));
  return RISK_BANDS.find((b) => s >= b.min && s <= b.max) || RISK_BANDS[RISK_BANDS.length - 1];
}

/** Look up a risk band by its label (used when reading saved records). */
export function riskBandByLabel(label) {
  return RISK_BANDS.find((b) => b.label === label) || RISK_BANDS[0];
}
