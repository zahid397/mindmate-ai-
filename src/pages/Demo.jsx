/**
 * Demo (/demo) — PUBLIC, no-login wellbeing screening.
 * ─────────────────────────────────────────────────────────────────────
 * This is the route judges use to evaluate the product without any
 * setup: no account, no localStorage write, no session. It reuses the
 * exact same QUESTIONS and scoreEngine as the authenticated /assessment
 * flow, so what a judge sees here is a truthful preview of the real
 * product — not a separate, prettier mock.
 *
 * Nothing typed here is ever saved anywhere (not even to localStorage).
 * That's a deliberate design choice: a public, no-login endpoint is the
 * wrong place to persist anyone's wellbeing answers under someone
 * else's account, or to pollute the demo user's real history.
 */

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { QUESTIONS } from "../ai/questions";
import { runScreening } from "../ai/scoreEngine";
import { riskBandByLabel } from "../ai/riskBands";
import { DISCLAIMER } from "../ai/suggestions";
import { validateAnswers } from "../utils/validators";
import Navbar from "../components/Navbar";
import QuestionCard from "../components/QuestionCard";
import ResultCard from "../components/ResultCard";
import SuggestionBox from "../components/SuggestionBox";
import CrisisResources from "../components/CrisisResources";

const PER_STEP = 3;

export default function Demo() {
  const [phase, setPhase] = useState("intro"); // intro | taking | result
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const totalSteps = Math.ceil(QUESTIONS.length / PER_STEP);
  const pageQuestions = QUESTIONS.slice(step * PER_STEP, step * PER_STEP + PER_STEP);

  const answeredCount = useMemo(
    () => QUESTIONS.filter((q) => answers[q.key] !== undefined).length,
    [answers]
  );
  const progress = Math.round((answeredCount / QUESTIONS.length) * 100);
  const pageAnswered = pageQuestions.every((q) => answers[q.key] !== undefined);

  const setAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const handleNext = () => {
    if (!pageAnswered) {
      setError("Please answer every question on this step to continue.");
      return;
    }
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const { valid } = validateAnswers(answers);
    if (!valid) {
      setError("Please make sure all questions are answered.");
      return;
    }
    // Scored 100% in the browser — nothing is saved anywhere.
    setResult(runScreening(answers));
    setPhase("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setError("");
    setResult(null);
    setPhase("intro");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Always-visible banner: sets expectations honestly */}
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-xs font-medium text-amber-800">
        🔎 Free demo — no account needed. Nothing you enter here is saved anywhere.
      </div>

      {phase === "intro" && <DemoIntro onStart={() => setPhase("taking")} />}

      {phase === "taking" && (
        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Free Demo Screening</h1>
              <p className="text-sm text-slate-500">
                The same 10 questions as the full assessment.
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Step {step + 1} of {totalSteps}</p>
              <p className="text-sm font-semibold text-brand-700">{progress}%</p>
            </div>
          </div>

          <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full gradient-brand transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="space-y-4">
            {pageQuestions.map((q) => (
              <QuestionCard key={q.key} question={q} value={answers[q.key]} onChange={setAnswer} />
            ))}
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <div className="mt-6 flex items-center justify-between">
            <button onClick={handleBack} disabled={step === 0} className="btn-ghost">
              ← Previous
            </button>
            <button onClick={handleNext} className="btn-primary">
              {step < totalSteps - 1 ? "Next →" : "See my results →"}
            </button>
          </div>
        </div>
      )}

      {phase === "result" && result && (
        <DemoResult result={result} onRestart={restart} />
      )}
    </div>
  );
}

function DemoIntro({ onStart }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl gradient-brand text-3xl">
        🧠
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900">Try MindMate AI — no sign-up</h1>
      <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-slate-500">
        Answer 10 quick questions and see your wellbeing score, risk band, and
        personalized suggestions instantly — the exact same rule-based engine
        used in the full product. Takes about 3 minutes. Nothing is saved.
      </p>
      <button onClick={onStart} className="btn-primary mt-7">
        Start the free demo →
      </button>
      <p className="mt-4 text-xs text-slate-400">
        Want to track your results over time instead?{" "}
        <Link to="/register" className="font-semibold text-brand-700 hover:underline">
          Create a free account
        </Link>
      </p>
    </div>
  );
}

function DemoResult({ result, onRestart }) {
  const { score, riskBand, suggestions } = result;
  const meta = riskBandByLabel(riskBand);
  const emphasized = meta.id === "stress" || meta.id === "high";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Your demo results</h1>
        <p className="text-sm text-slate-500">
          This is a live preview — sign up to save results like this over time.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <ResultCard score={score} riskBand={riskBand} />
        <div className="card p-6">
          <h3 className="text-base font-semibold text-slate-800">What does this mean?</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">{meta.blurb}</p>
          <div className={`mt-4 rounded-xl p-3 text-sm ${meta.badge}`}>
            Your screening places you in the <b>{meta.label}</b> range ({score}/100).
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="mb-1 text-base font-semibold text-slate-800">Personalized suggestions</h3>
        <p className="mb-4 text-sm text-slate-500">Based on your responses, we recommend:</p>
        <SuggestionBox suggestions={suggestions} />
      </div>

      <div className="mt-8">
        <CrisisResources emphasized={emphasized} />
      </div>

      <div className="mt-8 flex items-start gap-3 rounded-2xl bg-rose-50/70 p-4 text-sm text-slate-600">
        <span className="text-lg">💛</span>
        <p>
          <span className="font-semibold text-slate-700">Disclaimer:</span> {DISCLAIMER}{" "}
          <Link to="/health-policy" className="font-semibold underline">Read our full health policy</Link>.
        </p>
      </div>

      {/* Sample dashboard preview — a static, clearly-labeled illustration
          of what tracking history over time looks like. Deliberately
          plain CSS bars (no recharts import) so the public /demo bundle
          stays light; the REAL trend chart only loads after login. */}
      <DashboardPreview />

      {/* Conversion CTA — clearly secondary to the results themselves */}
      <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h4 className="text-base font-semibold text-slate-800">Like what you see?</h4>
          <p className="mt-1 text-sm text-slate-500">
            Create a free account to save your history and track your trend over time.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button onClick={onRestart} className="btn-ghost">Try again</button>
          <Link to="/register" className="btn-primary">Create free account</Link>
        </div>
      </div>
    </div>
  );
}

// Illustrative-only example values — NOT derived from the demo taker's
// own single result, since one screening has no history to trend.
const EXAMPLE_TREND = [58, 62, 54, 49, 45, 40, 38];

function DashboardPreview() {
  const max = Math.max(...EXAMPLE_TREND);
  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-800">
          Preview: your Dashboard after a few check-ins
        </h3>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Example data
        </span>
      </div>
      <div className="card p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium text-slate-500">Latest score</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">38<span className="text-sm font-medium text-slate-400">/100</span></p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Average score</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">49<span className="text-sm font-medium text-slate-400">/100</span></p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total check-ins</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">7</p>
          </div>
        </div>
        <div className="mt-5 flex h-16 items-end gap-1.5">
          {EXAMPLE_TREND.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-gradient-to-t from-primary/70 to-accent/70 gradient-brand"
              style={{ height: `${(v / max) * 100}%` }}
              aria-hidden="true"
            />
          ))}
        </div>
        <p className="mt-2 text-center text-xs text-slate-400">
          Illustrative trend — your real dashboard fills in as you check in over time.
        </p>
      </div>
    </div>
  );
}
