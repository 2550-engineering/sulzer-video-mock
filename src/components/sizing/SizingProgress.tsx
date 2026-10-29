import { Gauge } from 'lucide-react'
import { sizingResultsPage as copy } from '../../data/sizingPages'
import { groupThousands } from '../../lib/format'

type SizingProgressProps = {
  progress: number
  /** How many variants are checked. */
  total: number
  productName: string
}

/** The short "Sizing … variants" state before the results appear. */
export function SizingProgress({ progress, total, productName }: SizingProgressProps) {
  const checked = Math.round((progress / 100) * total)
  return (
    <div className="flex min-h-[560px] items-start justify-center pt-24">
      <div className="w-full max-w-md text-center" aria-live="polite">
        <Gauge aria-hidden className="mx-auto size-10 text-primary" strokeWidth={1.5} />
        <p className="mt-5 text-xl font-bold tracking-tight text-navy-900">
          {copy.calculating.title(groupThousands(total))}
        </p>
        <p className="mt-1.5 text-text-muted">{copy.calculating.text(productName)}</p>
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-7 h-2 overflow-hidden rounded-pill bg-surface-sunken"
        >
          <div
            className="h-full rounded-pill bg-linear-to-r from-primary to-accent-cyan transition-[width] duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2.5 text-sm text-text-muted tabular-nums">
          {copy.calculating.detail(groupThousands(checked), groupThousands(total))}
        </p>
      </div>
    </div>
  )
}
