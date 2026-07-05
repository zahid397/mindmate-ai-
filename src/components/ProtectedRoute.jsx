/**
 * ProtectedRoute
 * ─────────────────────────────────────────────────────────────────────
 * Guards private routes. SIMPLIFICATION vs. a network-backed auth version: since
 * useAuth's user state is now known synchronously on first render
 * (localStorage, not a network call), there is no "loading" phase to
 * render a spinner for anymore — the redirect-or-render decision can
 * happen immediately, every time.
 */
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
