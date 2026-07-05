/**
 * Assessment (/assessment)
 * ─────────────────────────────────────────────────────────────────────
 * Paginated screening (3 questions per step) with the left step-rail and
 * top progress bar from mockup panel 2. On finish it runs the scoring
 * engine and navigates to /assessment-result with the answers + result
 * in router state.
 */

import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QUESTIONS } from "../ai/questions";
import { runScreening } from "../ai/scoreEngine";
import { validateAnswers } from "../utils/validators";
import QuestionCard from "../components/QuestionCard";

const PER_STEP = 3;

// Left rail steps (mirrors the mockup: Welcome → Assessment → Results → Resources)
const RAIL = [
  { id: "welcome", label: "Welcome" },
  { id: "assessment", label: "Assessment" },
  { id: "results", label: "Results" },
  { id: "resources", label: "Support Resources" },
];

export default function Assessment() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

  const totalSteps = Math.ceil(QUESTIONS.length / PER_STEP);
  const pageQuestions = QUESTIONS.slice(step * PER_STEP, step * PER_STEP + PER_STEP);

  // Progress reflects how many questions have been answered.
  const answeredCount = useMemo(
    () => QUESTIONS.filter((q) => answers[q.key] !== undefined).length,
    [answers]
  );
  const progress = Math.round((answeredCount / QUESTIONS.length) * 100);

  const setAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const pageAnswered = pageQuestions.every((q) => answers[q.key] !== undefined);

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
    // Final step → validate everything, score, and go to results.
    const { valid } = validateAnswers(answers);
    if (!valid) {
      setError("Please make sure all questions are answered.");
      return;
    }
    const result = runScreening(answers);
    navigate("/assessment-result", { state: { answers, ...result } });
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="" className="h-7 w-7" />
          <span className="font-bold text-slate-900">MindMate AI</span>
        </Link>
        <div className="flex items-center gap-2 text-sm text-emerald-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Secure &amp; Confidential
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 md:grid-cols-[220px_1fr]">
        {/* Step rail */}
        <aside className="hidden md:block">
          <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-700">
            ← Back
          </Link>
          <ol className="space-y-3">
            {RAIL.map((r, i) => {
              const isActive = r.id === "assessment";
              const isDone = i === 0;
              return (
                <li key={r.id} className="flex items-center gap-3">
                  <span
                    className={[
                      "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                      isDone ? "bg-emerald-100 text-emerald-600"
                        : isActive ? "gradient-brand text-white"
                        : "bg-slate-100 text-slate-400",
                    ].join(" ")}
                  >
                    {isDone ? "✓" : i + 1}
                  </span>
                  <span className={`text-sm ${isActive ? "font-semibold text-slate-800" : "text-slate-500"}`}>
                    {r.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </aside>

        {/* Form */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Assessment</h1>
              <p className="text-sm text-slate-500">Please answer the following questions honestly.</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Step {step + 1} of {totalSteps}</p>
              <p className="text-sm font-semibold text-brand-700">{progress}%</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full gradient-brand transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>

          <div className="space-y-4">
            {pageQuestions.map((q) => (
              <QuestionCard key={q.key} question={q} value={answers[q.key]} onChange={setAnswer} />
            ))}
          </div>

          {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <div className="mt-6 flex items-center justify-between">
            <button onClick={handleBack} disabled={step === 0} className="btn-ghost">
              ← Previous
            </button>
            <button onClick={handleNext} className="btn-primary">
              {step < totalSteps - 1 ? "Next →" : "See my results →"}
            </button>
          </div>

          <p className="mt-6 flex items-center gap-2 text-xs text-slate-400">
            🔒 Your responses are private and secure.
          </p>
        </div>
      </div>
    </div>
  );
}
