/**
 * mockAdminService.js
 * ─────────────────────────────────────────────────────────────────────
 * Aggregate, anonymous analytics for the admin view. There is no RLS or
 * server here to enforce "admins only see aggregates" the way the
 * a server-enforced version would — that boundary is now purely a UI-layer
 * decision (see ProtectedRoute's adminOnly check in App.jsx). What this
 * file guarantees on its own is narrower but still meaningful: the
 * function below NEVER returns a per-user row, name, or email — only
 * counts and averages — so even if someone reused this function
 * elsewhere, it couldn't leak individual data by accident.
 */
import { getAllAssessmentsRaw } from "./mockAssessmentService";
import { RISK_BANDS } from "../ai/riskBands";

export async function getAdminStats() {
  try {
    const all = getAllAssessmentsRaw();
    const total = all.length;

    const avgScore = total > 0 ? Math.round(all.reduce((sum, a) => sum + (a.score || 0), 0) / total) : 0;

    const byRisk = {};
    for (const band of RISK_BANDS) byRisk[band.label] = 0;
    for (const a of all) {
      if (byRisk[a.riskBand] !== undefined) byRisk[a.riskBand] += 1;
    }

    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = all.filter((a) => new Date(a.date).getTime() >= weekAgo).length;

    return { data: { total, avgScore, byRisk, recent }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
