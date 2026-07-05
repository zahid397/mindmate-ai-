/**
 * formatDate.js — small date helpers used across the dashboard.
 */

/** "May 20, 2025" */
export function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return String(iso);
  }
}

/** "May 20" — compact form for chart axes */
export function formatShortDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return String(iso);
  }
}
