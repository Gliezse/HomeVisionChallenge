type SpinnerProps = {
  /** Tailwind size classes, e.g. h-8 w-8 */
  className?: string;
  label?: string;
};

export function Spinner({
  className = "h-8 w-8",
  label = "Loading",
}: SpinnerProps) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-slate-300 border-t-slate-700 ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-label={label}
    />
  );
}
