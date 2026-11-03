/** Thin progress bar in the Sulzer blue-to-cyan gradient; `value` is 0–100. */
export function ProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2 overflow-hidden rounded-pill bg-surface-sunken"
    >
      <div
        className="h-full rounded-pill bg-linear-to-r from-primary to-accent-cyan transition-[width] duration-100 ease-linear"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
