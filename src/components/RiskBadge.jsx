import { riskBandByLabel } from "../ai/riskBands";

/** Colored pill showing a risk band. Pass `band` (the label string, e.g.
 *  "Moderate Risk") and it resolves styling from riskBands.js. */
export default function RiskBadge({ band, size = "md" }) {
  const meta = riskBandByLabel(band);
  const sizing = size === "lg" ? "px-4 py-1.5 text-sm" : "px-3 py-1 text-xs";
  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${meta.badge} ${sizing}`}>
      {meta.label}
    </span>
  );
}
