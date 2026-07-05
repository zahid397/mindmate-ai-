/**
 * QuestionCard
 * ─────────────────────────────────────────────────────────────────────
 * Renders one screening question with its 5 labeled options (0-4 scale).
 * REBUILT from the old 1-10 number-grid version: since each question
 * now needs a meaningful label per option (not just a bare number), a
 * vertical list of full-width option buttons reads far more clearly
 * than trying to cram 5 text labels into a dense grid. Same visual
 * language as before — same card, same brand-gradient selected state,
 * same hover treatment — just a layout that fits labeled options.
 */

export default function QuestionCard({ question, value, onChange }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5 transition hover:border-brand-200">
      <p className="mb-4 text-sm font-semibold text-slate-800">{question.label}</p>

      <div className="space-y-2">
        {question.options.map((optionLabel, optionValue) => {
          const selected = value === optionValue;
          return (
            <button
              key={optionValue}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(question.key, optionValue)}
              className={[
                "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all",
                selected
                  ? "gradient-brand text-white shadow-soft"
                  : "bg-slate-100 text-slate-600 hover:bg-brand-100 hover:text-brand-700",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  selected ? "bg-white/25 text-white" : "bg-white text-slate-400",
                ].join(" ")}
              >
                {optionValue}
              </span>
              {optionLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
