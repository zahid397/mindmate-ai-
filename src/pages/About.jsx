/**
 * About (/about) — explains the tool, its limits, and support resources.
 * Reinforces the ethical framing: screening and support, never diagnosis.
 */

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import CrisisResources from "../components/CrisisResources";
import { DISCLAIMER } from "../ai/suggestions";

const FACTORS = [
  "Sleep quality", "Stress level", "Anxiety", "Mood", "Study pressure",
  "Social support", "Concentration", "Screen time", "Physical activity", "Feeling overwhelmed",
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/50 to-white">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="text-3xl font-extrabold text-slate-900">About MindMate AI</h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600">
          MindMate AI is an educational wellbeing screening tool for students. It asks a short
          set of questions about how you've been feeling and turns your answers into a clear
          wellbeing score with supportive, practical suggestions.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">How the score works</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Each of the 10 questions is answered on a simple 0–4 scale, where a higher number
            always means more concern. A transparent, rule-based engine adds up all 10 answers
            (0 to 40 total) and linearly scales that sum onto a strict 0–100 score — every
            question counts equally, with nothing hidden. That score maps to one of four bands:
            Low, Moderate, Stress, or High. There's no machine learning and no external API — the
            entire calculation is a few lines of code you could read and verify yourself.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {FACTORS.map((f) => (
              <span key={f} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-brand-700 shadow-card">
                {f}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">What this tool is not</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            MindMate AI does <b>not</b> diagnose any condition and is not a substitute for
            professional care. A screening score is a prompt for reflection and, where helpful,
            a nudge to reach out — not a clinical assessment.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">If you need support now</h2>
          <div className="mt-3">
            <CrisisResources />
          </div>
          <p className="mt-3 text-sm text-slate-500">
            See our <Link to="/health-policy" className="font-semibold text-brand-700 underline">full health policy</Link> for
            more on what this tool is, what it isn't, and how your data is handled.
          </p>
        </section>

        <div className="mt-10 flex items-start gap-3 rounded-2xl bg-rose-50/70 p-4 text-sm text-slate-600">
          <span className="text-lg">💛</span>
          <p><span className="font-semibold text-slate-700">Disclaimer:</span> {DISCLAIMER}</p>
        </div>

        <div className="mt-8 flex gap-3">
          <Link to="/demo" className="btn-primary">Try the free demo</Link>
          <Link to="/" className="btn-secondary">Back home</Link>
        </div>
      </div>
    </div>
  );
}

