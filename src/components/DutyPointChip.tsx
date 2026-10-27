/** Small glass "duty point" readout over the feature image. */
export function DutyPointChip() {
  return (
    <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-md bg-white/85 px-3.5 py-2.5 shadow-card backdrop-blur-sm">
      <svg viewBox="0 0 64 36" className="h-9 w-16" aria-hidden>
        <path d="M2 34V2M2 34h60" className="stroke-border-strong" strokeWidth="1.5" fill="none" />
        <path
          d="M4 8C20 9 36 13 60 30"
          className="stroke-primary"
          strokeWidth="2.25"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="34" cy="14.6" r="3.25" className="fill-accent-red" />
      </svg>
      <div className="text-xs leading-snug">
        <p className="font-semibold text-navy-900">Duty point</p>
        <p className="text-text-muted">120 m³/h · 18 m</p>
      </div>
    </div>
  )
}
