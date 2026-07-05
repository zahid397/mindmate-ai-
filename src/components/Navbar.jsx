/**
 * Navbar — top navigation for public/marketing pages.
 * Shows brand, anchor links, and auth-aware action (Login or Dashboard).
 */

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="" className="h-8 w-8" />
          <span className="text-lg font-bold text-slate-900">
            MindMate <span className="gradient-text">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          <Link to="/" className="hover:text-brand-700">Home</Link>
          <Link to="/demo" className="hover:text-brand-700">Free Demo</Link>
          <Link to="/about" className="hover:text-brand-700">About</Link>
          <Link to="/health-policy" className="hover:text-brand-700">Health Policy</Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/dashboard" className="btn-secondary">Dashboard</Link>
              <button onClick={handleLogout} className="btn-ghost">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/demo" className="btn-ghost">Try Free Demo</Link>
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/assessment" className="btn-primary">Start Assessment</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
