import { Check } from 'lucide-react'

export type ProgressStep = {
  label: string
  /** When it was reached, e.g. "Today, 09:26". */
  time?: string
  /** Under a step not reached yet, e.g. what happens next. */
  note?: string
}

type ProgressStepsProps = {
  label: string
  steps: ProgressStep[]
  /** Index of the latest step reached. */
  current: number
}

/**
 * Horizontal status timeline: done steps ticked, the current one ringed, later
 * ones hollow with a note on what comes next. The bar fills to the current step.
 */
export function ProgressSteps({ label, steps, current }: ProgressStepsProps) {
  const last = current >= steps.length - 1
  return (
    <ol
      aria-label={label}
      className="grid gap-y-4"
      style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
    >
      {steps.map((step, i) => {
        const done = i < current || (i === current && last)
        const active = i === current && !last
        return (
          <li
            key={step.label}
            aria-current={i === current ? 'step' : undefined}
            className="relative pr-4"
          >
            {i < steps.length - 1 && (
              <span aria-hidden className="absolute top-3 right-0 left-6 h-0.5 bg-border">
                {i < current && (
                  <span
                    className="absolute inset-0 origin-left animate-bar bg-primary"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                )}
              </span>
            )}
            <span
              aria-hidden
              className={`relative flex size-6 items-center justify-center rounded-full ${
                done
                  ? 'bg-primary text-white'
                  : active
                    ? 'bg-white ring-[3px] ring-primary'
                    : 'bg-white ring-2 ring-border-strong'
              }`}
            >
              {done && <Check className="size-3.5" strokeWidth={3} />}
              {active && <span className="size-2 rounded-full bg-primary" />}
            </span>
            <p
              className={`mt-3 text-sm font-semibold ${i <= current ? 'text-navy-900' : 'text-text-muted'}`}
            >
              {step.label}
            </p>
            {i <= current
              ? step.time && (
                  <p className="mt-0.5 text-sm text-text-muted tabular-nums">{step.time}</p>
                )
              : step.note && <p className="mt-0.5 text-sm text-text-subtle">{step.note}</p>}
          </li>
        )
      })}
    </ol>
  )
}
