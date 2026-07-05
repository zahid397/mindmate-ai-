/**
 * DashboardLayout
 * ─────────────────────────────────────────────────────────────────────
 * The dark-indigo sidebar shell used by the Dashboard and Admin pages,
 * matching mockup panels 3 & 4: brand at top, nav items with icons, a
 * user chip in the header, and a logout action pinned to the bottom.
 *
 * Icons are inline SVGs (no icon dependency) to keep the build clean.
 */

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// ── Inline icon set ──────────────────────────────────────────────────
const Icon = {
  grid: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  list: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="3.5" cy="6" r="1" /><circle cx="3.5" cy="12" r="1" /><circle cx="3.5" cy="18" r="1" />
    </svg>
  ),
  trend: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <polyline points="3 17 9 11 13 15 21 7" /><polyline points="15 7 21 7 21 13" />
    </svg>
  ),
  shield: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
    </svg>
  ),
  logout: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

export default function DashboardLayout({ children, active = "dashboard" }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const nav = [
    { id: "dashboard", label: "Dashboard", to: "/dashboard", icon: Icon.grid },
    { id: "assessment", label: "New Assessment", to: "/assessment", icon: Icon.list },
    { id: "about", label: "Resources", to: "/about", icon: Icon.trend },
  ];
  if (isAdmin) {
    nav.push({ id: "admin", label: "Admin Analytics", to: "/admin", icon: Icon.shield });
  }

  const initial = (user?.name || "S").trim().charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-ink p-4 md:flex">
        <Link to="/" className="mb-8 flex items-center gap-2 px-2 pt-2">
          <img src="/logo.svg" alt="" className="h-8 w-8" />
          <span className="text-base font-bold text-white">
            MindMate <span className="text-brand-300">AI</span>
          </span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((item) => {
            const isActive = active === item.id || location.pathname === item.to;
            const IconCmp = item.icon;
            return (
              <Link
                key={item.id}
                to={item.to}
                className={`nav-item ${isActive ? "nav-item-active" : ""}`}
              >
                <IconCmp className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button onClick={handleLogout} className="nav-item mt-2">
          <Icon.logout className="h-5 w-5" />
          Logout
        </button>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-6">
          {/* Mobile brand (sidebar hidden on small screens) */}
          <Link to="/" className="flex items-center gap-2 md:hidden">
            <img src="/logo.svg" alt="" className="h-7 w-7" />
            <span className="font-bold text-slate-900">MindMate AI</span>
          </Link>
          <div className="hidden items-center gap-2 text-sm text-emerald-600 md:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Secure &amp; Confidential
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">
                {user?.name || "Student"}
              </p>
              <p className="text-xs text-slate-400">{isAdmin ? "Admin" : "Student"}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-brand text-sm font-semibold text-white">
              {initial}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
