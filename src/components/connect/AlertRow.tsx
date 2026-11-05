import { Check, CircleAlert, Info, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router'
import { alertsPage as copy } from '../../data/connect'
import { siteById } from '../../data/assets'
import { alertAsset, alertTime, type AlertSeverity, type ConnectAlert } from '../../lib/connect'

const severity = {
  alarm: { icon: CircleAlert, className: 'bg-danger-on-dark/15 text-danger-on-dark' },
  warning: { icon: TriangleAlert, className: 'bg-warning-on-dark/15 text-warning-on-dark' },
  info: { icon: Info, className: 'bg-white/10 text-text-on-dark' },
} satisfies Record<AlertSeverity, unknown>

type AlertRowProps = {
  alert: ConnectAlert
  acknowledgedBy?: string
  /** Shows "Acknowledge" on active alerts nobody has acknowledged. */
  onAcknowledge?: () => void
}

/** One alert: severity, what happened, which asset and site, when, and its state. Opens the asset. */
export function AlertRow({ alert, acknowledgedBy, onAcknowledge }: AlertRowProps) {
  const asset = alertAsset(alert)
  const site = siteById(asset.siteId)
  const { icon: Icon, className } = severity[alert.severity]

  return (
    <li className="group relative flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.03] max-md:flex-wrap max-md:items-start max-md:gap-x-3 max-md:gap-y-2 max-md:px-4">
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-md ${className}`}>
        <Icon className="size-5" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1 max-md:basis-[calc(100%-3.25rem)]">
        <Link
          to={`/connect/assets/${asset.id}`}
          className="font-semibold text-white transition-colors group-hover:text-primary-on-dark after:absolute after:inset-0"
        >
          {alert.title}
        </Link>
        <p className="mt-0.5 truncate text-[13px] text-text-on-dark-muted max-md:whitespace-normal">
          <span className="font-semibold text-text-on-dark">{asset.tag}</span>{' '}
          {asset.name.replace(` ${asset.tag}`, '')} · {site?.name}
        </p>
      </div>
      <div className="shrink-0 text-right text-[13px] tabular-nums max-md:ml-[3.25rem] max-md:min-w-0 max-md:flex-1 max-md:self-center max-md:text-left">
        <p className="text-text-on-dark">{alertTime(alert.time)}</p>
        <p className="mt-0.5 text-text-on-dark-muted">
          {acknowledgedBy
            ? copy.acknowledged(acknowledgedBy)
            : alert.active
              ? copy.severity[alert.severity]
              : alert.resolved}
        </p>
      </div>
      {onAcknowledge && alert.active && !acknowledgedBy && (
        <button
          type="button"
          onClick={onAcknowledge}
          className="relative z-10 inline-flex h-9 shrink-0 items-center gap-1.5 rounded-pill border border-white/20 px-4 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10 max-md:self-center"
        >
          <Check className="size-4" />
          {copy.acknowledge}
        </button>
      )}
    </li>
  )
}
