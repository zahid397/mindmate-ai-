/**
 * StatCard — a labeled metric tile used on dashboards.
 * Props: label, value, sub (small caption), accent (hex), delta {direction,delta}
 */
export default function StatCard({ label, value, sub, accent = "#7c3aed", delta }) {
  const deltaColor =
    delta?.direction === "down"
      ? "text-emerald-600"
      : delta?.direction === "up"
      ? "text-red-500"
      : "text-slate-400";
  const arrow = delta?.direction === "down" ? "↓" : delta?.direction === "up" ? "↑" : "→";

  return (
    <div className="card p-5">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-900" style={{ color: accent }}>
          {value}
        </span>
      </div>
      {(sub || delta) && (
        <p className={`mt-1 text-xs ${delta ? deltaColor : "text-slate-400"}`}>
          {delta ? `${arrow} ${delta.delta} ` : ""}
          {sub}
        </p>
      )}
    </div>
  );
}
