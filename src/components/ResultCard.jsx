/**
 * ResultCard
 * ─────────────────────────────────────────────────────────────────────
 * The hero result panel: a large 0-100 score, a risk badge, and a
 * gradient low→high meter with a marker.
 */

import { riskBandByLabel } from "../ai/riskBands";

export default function ResultCard({ score, riskBand }) {
  const meta = riskBandByLabel(riskBand);

  // Defensive re-round even though scoreEngine.js already guarantees an
  // integer — a display component should never assume every future
  // caller will hand it a clean value.
  const displayScore = Math.round(Number(score) || 0);

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Your Risk Score</p>
          <div className="mt-1 flex items-end gap-1">
            <span className="text-5xl font-extrabold gradient-text leading-none">{displayScore}</span>
            <span className="mb-1 text-lg font-medium text-slate-400">/100</span>
          </div>
        </div>
        <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${meta.badge}`}>
          {meta.label}
        </span>
      </div>

      {/* Gradient meter */}
      <div className="mt-6">
        <div className="relative h-2.5 w-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500">
          <div
            className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border-[3px] border-white bg-slate-800 shadow"
            style={{ left: `${Math.max(2, Math.min(98, displayScore))}%` }}
            aria-hidden="true"
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-slate-400">
          <span>Low</span>
          <span>Moderate</span>
          <span>High</span>
          <span>Severe</span>
        </div>
      </div>
    </div>
  );
}
