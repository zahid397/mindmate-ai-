/**
 * AdminDashboard (/admin)
 * ─────────────────────────────────────────────────────────────────────
 * Anonymous, aggregate analytics only — no individual student data or
 * emails. Guarded by ProtectedRoute (adminOnly). Backed by
 * mockAdminService, which computes aggregates straight from the
 * localStorage assessments array (no server round-trip needed).
 */

import { useEffect, useState } from "react";
import { getAdminStats } from "../services/mockAdminService";
import { RISK_BANDS } from "../ai/riskBands";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await getAdminStats();
      if (error) setError(true);
      else setStats(data);
      setLoading(false);
    })();
  }, []);

  // Largest bucket count → used to scale the distribution bars.
  const maxBar = stats?.byRisk ? Math.max(1, ...Object.values(stats.byRisk)) : 1;

  return (
    <DashboardLayout active="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin analytics</h1>
        <p className="text-sm text-slate-500">Anonymous, aggregate insights. No individual data is shown.</p>
      </div>

      {loading && <LoadingSpinner label="Crunching anonymous stats…" />}

      {error && !loading && (
        <div className="card p-8 text-center">
          <p className="text-sm text-red-500">Couldn't load analytics. Please refresh and try again.</p>
        </div>
      )}

      {!loading && !error && stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total assessments" value={stats.total} accent="#7c3aed" sub="all time" />
            {/* FIX: this used to show avgScore/10 (e.g. "6.2") — same
                out-of-100-vs-out-of-10 bug class fixed elsewhere in the
                app. Shows the plain integer with an accurate label now. */}
            <StatCard label="Average score" value={stats.avgScore} accent="#0f766e" sub="out of 100" />
            <StatCard label="Last 7 days" value={stats.recent} accent="#d97706" sub="recent check-ins" />
            <StatCard
              label="At-risk share"
              value={`${pctAtRisk(stats)}%`}
              accent="#dc2626"
              sub="Stress + High"
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Risk distribution */}
            <div className="card p-6">
              <h3 className="mb-4 text-base font-semibold text-slate-800">Risk distribution</h3>
              <div className="space-y-3">
                {RISK_BANDS.map((band) => {
                  const count = stats.byRisk[band.label] || 0;
                  const pct = Math.round((count / maxBar) * 100);
                  return (
                    <div key={band.id}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-slate-600">
                          <span className={`h-2.5 w-2.5 rounded-full ${band.dot}`} />
                          {band.label}
                        </span>
                        <span className="font-semibold text-slate-700">{count}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full ${band.dot}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Share breakdown */}
            <div className="card p-6">
              <h3 className="mb-4 text-base font-semibold text-slate-800">Share by band</h3>
              <div className="grid grid-cols-2 gap-3">
                {RISK_BANDS.map((band) => {
                  const count = stats.byRisk[band.label] || 0;
                  const share = stats.total ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={band.id} className="rounded-xl border border-slate-100 p-4">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${band.dot}`} />
                        <span className="text-xs text-slate-500">{band.label}</span>
                      </div>
                      <p className="mt-1 text-2xl font-bold text-slate-900">{share}%</p>
                      <p className="text-xs text-slate-400">{count} total</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Privacy by design: this view reads only aggregate counts, never names or emails.
          </p>
        </>
      )}
    </DashboardLayout>
  );
}

function pctAtRisk(stats) {
  if (!stats?.total) return 0;
  const atRisk = (stats.byRisk["Stress Risk"] || 0) + (stats.byRisk["High Risk"] || 0);
  return Math.round((atRisk / stats.total) * 100);
}
