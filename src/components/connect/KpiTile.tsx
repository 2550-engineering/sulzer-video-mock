import { statusTonesOnDark } from '../../lib/statusTones'
import type { AssetStatus } from '../../types'
import { ConnectStatusDot } from './ConnectStatusDot'

type KpiTileProps = {
  label: string
  value: string
  unit: string
  status?: AssetStatus
  /** Small line under the value, e.g. the warning limit. */
  note: string
  /** Change over the last week, e.g. "+4.6 mm/s in 7 days". */
  change?: { text: string; worse: boolean }
}

/** Headline reading on the condition page: value, status, limit and the change over a week. */
export function KpiTile({ label, value, unit, status, note, change }: KpiTileProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-navy-900/70 px-5 py-4">
      <p className="flex items-center justify-between gap-3 text-[13px] font-medium text-text-on-dark-muted">
        {label}
        {status && <ConnectStatusDot status={status} />}
      </p>
      <p
        className={`mt-2 text-[2rem] leading-none font-bold tracking-tight tabular-nums ${
          status ? statusTonesOnDark[status].text : 'text-white'
        }`}
      >
        {value}
        <span className="ml-1.5 text-sm font-semibold text-text-on-dark-muted">{unit}</span>
      </p>
      <p className="mt-2 flex flex-wrap items-center gap-x-2 text-xs text-text-on-dark-muted tabular-nums">
        {note}
        {change && (
          <span
            className={
              change.worse ? 'font-semibold text-warning-on-dark' : 'text-text-on-dark-muted'
            }
          >
            · {change.text}
          </span>
        )}
      </p>
    </div>
  )
}
