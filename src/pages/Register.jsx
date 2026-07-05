/**
 * Register (/register) — create an account via mockAuthService
 * (localStorage). There is no email verification step at all in this
 * demo build, so registration always auto-logs-in immediately — unlike
 * a server-backed version, there is no "check your email" limbo state
 * to design around.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AuthShell } from "./Login";
import { isValidEmail, isValidPassword, isNonEmpty } from "../utils/validators";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isNonEmpty(fullName)) return setError("Please enter your full name.");
    if (!isValidEmail(email)) return setError("Please enter a valid email address.");
    if (!isValidPassword(password)) return setError("Password must be at least 6 characters.");

    setSubmitting(true);
    const { error } = await register({ fullName, email, password });
    setSubmitting(false);

    if (error) {
      setError(error.message || "Could not create your account. Please try again.");
      return;
    }

    // No email confirmation in this build — registration always
    // succeeds with an immediate session, so we can navigate right away.
    navigate("/dashboard", { replace: true });
  };

  return (
    <AuthShell title="Create your account" subtitle="Start your confidential wellbeing check-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="fullName">Full name</label>
          <input id="fullName" type="text" className="input" value={fullName}
            onChange={(e) => setFullName(e.target.value)} placeholder="Aarav Sharma" autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" className="input" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu" autoComplete="email" />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" className="input" value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete="new-password" />
        </div>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-slate-400">
        Demo note: accounts are stored only in your browser (localStorage), not on
        a server. Please don't use a real password you use elsewhere.
      </p>

      <p className="mt-4 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brand-700 hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}
