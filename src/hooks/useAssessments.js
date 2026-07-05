/**
 * useAssessments.js
 * ─────────────────────────────────────────────────────────────────────
 * Loads the current user's assessment history and derives dashboard
 * stats (latest, total, average, trend). Exposes loading/error/empty
 * states and a refetch function.
 */

import { useCallback, useEffect, useState } from "react";
import { getUserAssessments } from "../services/mockAssessmentService";
import { averageScore, recentDelta, toTrendSeries } from "../utils/calculateTrend";

export function useAssessments(userId) {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!userId) {
      setAssessments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error } = await getUserAssessments(userId);
    if (error) {
      setError(error);
      setAssessments([]);
    } else {
      setAssessments(data);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derived dashboard values (memo-free; cheap to compute).
  const latest = assessments[0] || null;
  const stats = {
    latest,
    total: assessments.length,
    average: averageScore(assessments),
    delta: recentDelta(assessments),
    trend: toTrendSeries(assessments),
  };

  return {
    assessments,
    stats,
    loading,
    error,
    isEmpty: !loading && !error && assessments.length === 0,
    refetch: fetchData,
  };
}
