/** A centered brand-colored spinner used for loading states. */
export default function LoadingSpinner({ label = "Loading…", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}>
      <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-brand-200 border-t-brand-600" />
      {label && <p className="text-sm text-slate-500">{label}</p>}
    </div>
  );
}
