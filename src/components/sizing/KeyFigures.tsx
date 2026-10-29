import { keyFigureRows } from '../../lib/keyFigures'
import type { SizingResult } from '../../types'

/** Key figures of a result at the duty point. `compact` is the short list for the info tooltip. */
export function KeyFigures({
  result,
  compact = false,
}: {
  result: SizingResult
  compact?: boolean
}) {
  return (
    <dl className={compact ? 'space-y-1 text-[13px]' : 'divide-y divide-border text-[15px]'}>
      {keyFigureRows(result, compact).map(([label, value]) => (
        <div key={label} className={`flex justify-between gap-6 ${compact ? '' : 'py-2'}`}>
          <dt className={compact ? 'text-text-on-dark-muted' : 'text-text-muted'}>{label}</dt>
          <dd
            className={`text-right font-semibold tabular-nums ${compact ? 'text-white' : 'text-navy-900'}`}
          >
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
