/**
 * CrisisResources
 * ─────────────────────────────────────────────────────────────────────
 * A small, always-honest set of "talk to a real person" options.
 *
 * Why this exists: a rule-based quiz cannot reliably detect an actual
 * crisis — it only measures self-reported patterns across ten general
 * wellbeing questions. Rather than pretend otherwise, this component is
 * shown on every result view (Demo, Result, Dashboard), independent of
 * score. `emphasized` just changes the visual weight for higher-risk
 * bands — it never hides the panel for lower ones.
 */

const RESOURCES = [
  {
    title: "Someone you trust",
    text: "A friend, family member, teacher, or mentor. You don't have to carry this alone.",
  },
  {
    title: "Campus / school counseling",
    text: "Most schools and universities offer free, confidential counseling — check your student services portal.",
  },
  {
    title: "988 Suicide & Crisis Lifeline (US)",
    text: "Call or text 988, available 24/7.",
  },
  {
    title: "Crisis Text Line",
    text: "Text HOME to 741741 (US, UK, Canada).",
  },
  {
    title: "Befrienders Worldwide",
    text: "befrienders.org — a directory of crisis helplines by country.",
  },
  {
    title: "Kaan Pete Roi (Bangladesh)",
    text: "A confidential emotional support helpline — kaanpeteroi.org.",
  },
];

export default function CrisisResources({ emphasized = false }) {
  return (
    <div
      className={[
        "rounded-2xl p-5",
        emphasized
          ? "border-2 border-red-200 bg-red-50/60"
          : "border border-slate-100 bg-white",
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden="true">
          🤝
        </span>
        <h3 className="text-base font-semibold text-slate-800">
          Need to talk to someone now?
        </h3>
      </div>
      <p className="mt-1.5 text-sm text-slate-500">
        This tool can't tell whether you're in crisis — only a person can help with
        that. These options are always here, whatever your score says.
      </p>

      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {RESOURCES.map((r) => (
          <li
            key={r.title}
            className="rounded-xl border border-slate-100 bg-slate-50/70 p-3"
          >
            <p className="text-sm font-semibold text-slate-800">{r.title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{r.text}</p>
          </li>
        ))}
      </ul>

      <p className="mt-3.5 text-xs font-medium text-red-600">
        If you or someone else is in immediate danger, contact local emergency
        services right away.
      </p>
    </div>
  );
}
