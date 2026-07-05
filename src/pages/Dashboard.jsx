/**
 * Dashboard (/dashboard) — student view.
 * Stat tiles, a score-trend chart, and previous assessments. Handles
 * loading, empty, and error states. Backed by localStorage via
 * mockAssessmentService (no more "Couldn't load your data" — reads are
 * synchronous and either return an array or a genuine error, never an
 * ambiguous in-between state).
 */

import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAssessments } from "../hooks/useAssessments";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import RiskBadge from "../components/RiskBadge";
import MoodChart from "../components/MoodChart";
import LoadingSpinner from "../components/LoadingSpinner";
import { formatDate } from "../utils/formatDate";

export default function Dashboard() {
  const { user } = useAuth();
  const { assessments, stats, loading, error, isEmpty } = useAssessments(user?.id);

  // No more separate "profile" object — the mock user record IS the
  // profile ({ id, name, email, role }), so this reads directly.
  const firstName = (user?.name || "there").split(" ")[0];

  return (
    <DashboardLayout active="dashboard">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Welcome back, {firstName}! Take care, you matter. 💜</p>
      </div>

      {loading && <LoadingSpinner label="Loading your dashboard…" />}

      {error && !loading && (
        <div className="card p-8 text-center">
          <p className="text-sm text-red-500">We couldn't load your data. Please refresh and try again.</p>
        </div>
      )}

      {isEmpty && (
        <div className="card p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-2xl">🌱</div>
          <h3 className="text-lg font-semibold text-slate-800">No check-ins yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
            Take your first wellbeing assessment to see your score, trend, and personalized suggestions here.
          </p>
          <Link to="/assessment" className="btn-primary mt-6 inline-flex">Take assessment</Link>
        </div>
      )}

      {!loading && !error && !isEmpty && (
        <>
          {/* Stat tiles */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Average score" value={stats.average} accent="#7c3aed"
              sub="out of 100 · all time" delta={stats.delta}
            />
            <StatCard label="Total assessments" value={stats.total} accent="#0f766e" sub="all time" />
            <StatCard
              label="Latest score" value={stats.latest.score} accent="#7c3aed"
              sub={formatDate(stats.latest.date)}
            />
            <div className="card p-5">
              <p className="text-xs font-medium text-slate-500">Risk band</p>
              <div className="mt-2"><RiskBadge band={stats.latest.riskBand} size="lg" /></div>
              <p className="mt-2 text-xs text-slate-400">Keep improving 💜</p>
            </div>
          </div>

          {/* Trend + previous */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="card p-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-800">Score trend</h3>
                <span className="text-xs text-slate-400">All assessments</span>
              </div>
              <MoodChart data={stats.trend} />
              <p className="mt-2 text-center text-xs text-slate-400">Lower scores indicate better wellbeing.</p>
            </div>

            <div className="card p-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-800">Previous assessments</h3>
              </div>
              <div className="space-y-2">
                {assessments.slice(0, 6).map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5">
                    <span className="text-sm text-slate-500">{formatDate(a.date)}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-slate-700">{a.score}/100</span>
                      <RiskBadge band={a.riskBand} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Encouragement / CTA strip */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="card flex items-center justify-between p-6">
              <div>
                <h4 className="text-base font-semibold text-slate-800">Track your wellbeing</h4>
                <p className="mt-1 max-w-xs text-sm text-slate-500">Regular check-ins help you understand your patterns and grow stronger.</p>
                <Link to="/assessment" className="btn-primary mt-4 inline-flex">Take assessment</Link>
              </div>
              <span className="hidden text-5xl sm:block">📈</span>
            </div>
            <div className="card flex items-center justify-between p-6">
              <div>
                <h4 className="text-base font-semibold text-slate-800">Need to talk?</h4>
                <p className="mt-1 max-w-xs text-sm text-slate-500">Confidential support is available. You're not alone.</p>
                <Link to="/about" className="btn-secondary mt-4 inline-flex">Explore resources</Link>
              </div>
              <span className="hidden text-5xl sm:block">🤝</span>
            </div>
          </div>
        </>
      )}

      {/* Small footer disclaimer note, per health-policy requirements */}
      <p className="mt-8 text-center text-xs text-slate-400">
        MindMate AI is a wellbeing awareness tool, not a diagnosis. Data in this
        demo is stored only in your browser.{" "}
        <Link to="/health-policy" className="underline hover:text-slate-500">
          Read the full health policy
        </Link>
        .
      </p>
    </DashboardLayout>
  );
}
