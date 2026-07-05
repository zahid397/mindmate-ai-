/**
 * Login (/login) — email + password sign-in against the localStorage
 * mock user list (mockAuthService). Redirects to the page the user
 * originally wanted, or /dashboard.
 */

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { isValidEmail, isNonEmpty } from "../utils/validators";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) return setError("Please enter a valid email address.");
    if (!isNonEmpty(password)) return setError("Please enter your password.");

    setSubmitting(true);
    const { error } = await login({ email, password });
    setSubmitting(false);

    if (error) {
      setError(error.message || "Could not sign you in. Check your details and try again.");
      return;
    }
    navigate(from, { replace: true });
  };

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue your wellbeing journey">
      <DemoAccountsHint onFill={fillDemo} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" className="input" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu" autoComplete="email" />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" className="input" value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
        </div>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{" "}
        <Link to="/register" className="font-semibold text-brand-700 hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

/** One-click fill for the two seeded demo accounts — saves a judge from
 *  having to type/remember credentials from the README. */
function DemoAccountsHint({ onFill }) {
  return (
    <div className="mb-5 rounded-xl border border-brand-100 bg-brand-50/60 p-3 text-sm text-slate-600">
      <p className="font-semibold text-slate-700">Try it instantly — demo accounts:</p>
      <div className="mt-2 flex flex-col gap-1.5 sm:flex-row">
        <button
          type="button"
          onClick={() => onFill("demo@mindmate.ai", "demo123")}
          className="rounded-lg border border-brand-200 bg-white px-2.5 py-1.5 text-left text-xs font-medium text-brand-700 hover:bg-brand-100"
        >
          Student — demo@mindmate.ai / demo123
        </button>
        <button
          type="button"
          onClick={() => onFill("admin@mindmate.ai", "admin123")}
          className="rounded-lg border border-brand-200 bg-white px-2.5 py-1.5 text-left text-xs font-medium text-brand-700 hover:bg-brand-100"
        >
          Admin — admin@mindmate.ai / admin123
        </button>
      </div>
    </div>
  );
}

// ── Shared auth page shell ─────────────────────────────────────────
export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-50/60 to-white px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <img src="/logo.svg" alt="" className="h-9 w-9" />
          <span className="text-xl font-bold text-slate-900">
            MindMate <span className="gradient-text">AI</span>
          </span>
        </Link>
        <div className="card p-8">
          <h1 className="text-center text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 mb-6 text-center text-sm text-slate-500">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
