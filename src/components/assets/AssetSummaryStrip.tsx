import type { LucideIcon } from 'lucide-react'
import type { StatusTone } from '../../types'

export type SummaryTile = {
  id: string
  value: number
  label: string
  detail: string
  tone: StatusTone
  icon: LucideIcon
  active: boolean
  onSelect: () => void
}

const tones: Record<StatusTone, { icon: string; value: string }> = {
  neutral: { icon: 'bg-surface-sunken text-navy-700', value: 'text-navy-900' },
  info: { icon: 'bg-primary-tint text-primary', value: 'text-primary' },
  warning: { icon: 'bg-warning-tint text-warning', value: 'text-warning-strong' },
}

/** Headline numbers on the installed base. Each tile is a filter; the active one is outlined. */
export function AssetSummaryStrip({ label, tiles }: { label: string; tiles: SummaryTile[] }) {
  return (
    <ul aria-label={label} className="grid gap-4 sm:grid-cols-3 xl:grid-cols-5">
      {tiles.map(({ id, value, label: tileLabel, detail, tone, icon: Icon, active, onSelect }) => (
        <li key={id}>
          <button
            type="button"
            aria-pressed={active}
            onClick={onSelect}
            className={`group flex h-full w-full items-center gap-4 rounded-lg border bg-white px-5 py-4 text-left transition-[border-color,background-color,box-shadow] duration-200 ${
              active
                ? 'border-primary shadow-[0_0_0_3px_var(--sz-color-primary-tint-strong)]'
                : 'border-border hover:border-primary-border hover:shadow-card'
            }`}
          >
            <span
              className={`flex size-11 shrink-0 items-center justify-center rounded-full ${tones[tone].icon}`}
            >
              <Icon className="size-5" strokeWidth={1.75} />
            </span>
            <span className="min-w-0">
              <span className="flex items-baseline gap-2">
                <span
                  className={`text-[2rem] leading-none font-bold tracking-tight tabular-nums ${tones[tone].value}`}
                >
                  {value}
                </span>
                <span className="text-[15px] font-semibold text-navy-900">{tileLabel}</span>
              </span>
              <span
                className={`mt-1.5 block truncate text-sm transition-colors ${
                  active ? 'text-primary' : 'text-text-muted group-hover:text-primary'
                }`}
              >
                {detail}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
