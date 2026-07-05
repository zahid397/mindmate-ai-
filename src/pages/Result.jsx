/**
 * Result (/assessment-result)
 * ─────────────────────────────────────────────────────────────────────
 * Shows the score gauge, "what this means", personalized suggestions,
 * and the disclaimer. Saves the result to localStorage — once,
 * automatically — via mockAssessmentService, and lets the user retry if
 * saving fails (e.g. storage full/disabled) or jump to the dashboard.
 * If the page is opened directly without state, it redirects to the
 * assessment.
 */

import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { saveAssessment } from "../services/mockAssessmentService";
import { riskBandByLabel } from "../ai/riskBands";
import { DISCLAIMER } from "../ai/suggestions";
import ResultCard from "../components/ResultCard";
import SuggestionBox from "../components/SuggestionBox";
import CrisisResources from "../components/CrisisResources";

export default function Result() {
  const location = useLocation();
  const { user } = useAuth();
  const state = location.state;

  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const savedOnce = useRef(false);

  // Persist the result exactly once when the page mounts with valid state.
  useEffect(() => {
    if (!state || !user || savedOnce.current) return;
    savedOnce.current = true;

    (async () => {
      setSaveState("saving");
      const { error } = await saveAssessment({
        userId: user.id,
        answers: state.answers,
        score: state.score,
        riskBand: state.riskBand,
        factors: state.factors,
        suggestions: state.suggestions,
      });
      setSaveState(error ? "error" : "saved");
    })();
  }, [state, user]);

  const retrySave = async () => {
    setSaveState("saving");
    const { error } = await saveAssessment({
      userId: user.id,
      answers: state.answers,
      score: state.score,
      riskBand: state.riskBand,
      factors: state.factors,
      suggestions: state.suggestions,
    });
    setSaveState(error ? "error" : "saved");
  };

  // Guard: no result data → send them to take the assessment.
  if (!state) return <Navigate to="/assessment" replace />;

  const meta = riskBandByLabel(state.riskBand);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="" className="h-7 w-7" />
          <span className="font-bold text-slate-900">MindMate AI</span>
        </Link>
        <SaveIndicator state={saveState} onRetry={retrySave} />
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Your results</h1>
          <p className="text-sm text-slate-500">Here's your wellbeing overview.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <ResultCard score={state.score} riskBand={state.riskBand} />

          <div className="card p-6">
            <h3 className="text-base font-semibold text-slate-800">What does this mean?</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{meta.blurb}</p>
            <div className={`mt-4 rounded-xl p-3 text-sm ${meta.badge}`}>
              Your screening places you in the <b>{meta.label}</b> range
              ({state.score}/100).
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="mt-8">
          <h3 className="mb-1 text-base font-semibold text-slate-800">Personalized suggestions</h3>
          <p className="mb-4 text-sm text-slate-500">Based on your responses, we recommend the following:</p>
          <SuggestionBox suggestions={state.suggestions} />
        </div>

        {/* Crisis resources — always shown, regardless of score */}
        <div className="mt-8">
          <CrisisResources emphasized={meta.id === "stress" || meta.id === "high"} />
        </div>

        {/* Disclaimer */}
        <div className="mt-8 flex items-start gap-3 rounded-2xl bg-rose-50/70 p-4 text-sm text-slate-600">
          <span className="text-lg">💛</span>
          <p>
            <span className="font-semibold text-slate-700">Disclaimer:</span> {DISCLAIMER}{" "}
            <Link to="/health-policy" className="font-semibold underline">Read our full health policy</Link>.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Link to="/about" className="btn-secondary">More support resources</Link>
          <Link to="/dashboard" className="btn-primary">Go to dashboard →</Link>
        </div>
      </div>
    </div>
  );
}

function SaveIndicator({ state, onRetry }) {
  if (state === "saving")
    return <span className="text-sm text-slate-400">Saving your result…</span>;
  if (state === "saved")
    return <span className="flex items-center gap-1.5 text-sm text-emerald-600">
      <span className="h-2 w-2 rounded-full bg-emerald-500" /> Saved to your history
    </span>;
  if (state === "error")
    return (
      <span className="flex items-center gap-2 text-sm text-red-500">
        Couldn't save.
        <button onClick={onRetry} className="font-semibold text-brand-700 hover:underline">Retry</button>
      </span>
    );
  return null;
}
