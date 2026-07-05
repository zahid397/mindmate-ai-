/**
 * useAuth.jsx
 * ─────────────────────────────────────────────────────────────────────
 * Auth context + hook, now backed by mockAuthService (localStorage)
 * instead of a real backend service.
 *
 * SIMPLIFICATION vs. a network-backed auth version: a localStorage read is
 * synchronous, so there is no `getSession()` round-trip, no
 * `onAuthStateChange` subscription, and no "loading" flicker while
 * waiting for a network response. The current user is known
 * IMMEDIATELY on first render. This also removes an entire class of
 * bug from the previous version — the duplicate-AuthProvider-per-route
 * race and the profile-fetch race simply cannot occur anymore, because
 * there is no async gap for them to occur in.
 */
import { createContext, useContext, useState, useCallback } from "react";
import * as mockAuthService from "../services/mockAuthService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Synchronous initial read — no loading state needed at all.
  const [user, setUser] = useState(() => mockAuthService.getCurrentUserSync());

  const login = useCallback(async (credentials) => {
    const res = await mockAuthService.login(credentials);
    if (res.data?.user) setUser(res.data.user);
    return res;
  }, []);

  const register = useCallback(async (details) => {
    const res = await mockAuthService.register(details);
    if (res.data?.user) setUser(res.data.user);
    return res;
  }, []);

  const logout = useCallback(async () => {
    const res = await mockAuthService.logout();
    setUser(null);
    return res;
  }, []);

  const value = {
    user,
    loading: false, // kept for API compatibility with ProtectedRoute; always false now
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Access auth state anywhere inside <AuthProvider>. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
