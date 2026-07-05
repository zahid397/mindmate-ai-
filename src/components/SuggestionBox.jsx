/**
 * SuggestionBox
 * Renders the personalized suggestion cards (title + supportive text).
 * Mirrors the mockup's 2×2 grid of soft cards with small icon chips.
 */

const ICONS = ["🌱", "💬", "🧘", "🛡️", "☀️", "📵", "🚶", "📓", "🎯", "💜"];

export default function SuggestionBox({ suggestions = [] }) {
  if (!suggestions.length) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {suggestions.map((s, i) => (
        <div
          key={s.title || i}
          className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition hover:shadow-soft"
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-base">
              {ICONS[i % ICONS.length]}
            </span>
            <h4 className="text-sm font-semibold text-slate-800">{s.title}</h4>
          </div>
          <p className="text-sm leading-relaxed text-slate-500">{s.text}</p>
        </div>
      ))}
    </div>
  );
}
