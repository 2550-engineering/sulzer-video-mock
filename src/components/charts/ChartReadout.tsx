import { chartReadout as copy } from '../../data/chartReadout'

export type ReadoutItem = { label?: string; value: string; color?: string }

type ChartReadoutProps = {
  /** The reading, e.g. [{ label: 'Q', value: '157 m³/h' }, { label: 'Alt. A', value: '30.5 m', color }]. */
  items: ReadoutItem[] | null
  dark?: boolean
  className?: string
}

/**
 * Phones (< 768px): the chart's values in a fixed bar next to the chart
 * instead of a tooltip that follows the finger. Shows a hint until the chart
 * is tapped. Hidden from 768px, where the floating tooltip is used.
 */
export function ChartReadout({ items, dark = false, className = '' }: ChartReadoutProps) {
  return (
    <div
      role="status"
      className={`flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 rounded-md px-3 py-2 text-[13px] tabular-nums md:hidden ${
        dark ? 'bg-white/[0.06] text-white' : 'bg-surface-muted text-navy-900'
      } ${className}`}
    >
      {items ? (
        items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 whitespace-nowrap">
            {i > 0 && (
              <span aria-hidden className={dark ? 'text-white/40' : 'text-text-subtle'}>
                ·
              </span>
            )}
            {item.color && (
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-full"
                style={{ background: item.color }}
              />
            )}
            {item.label && (
              <span className={dark ? 'text-text-on-dark-muted' : 'text-text-muted'}>
                {item.label}
              </span>
            )}
            <span className="font-semibold">{item.value}</span>
          </span>
        ))
      ) : (
        <span className={dark ? 'text-text-on-dark-muted' : 'text-text-muted'}>{copy.hint}</span>
      )}
    </div>
  )
}
