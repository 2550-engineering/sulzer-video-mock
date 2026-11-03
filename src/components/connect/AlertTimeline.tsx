import { CircleAlert, Info, TriangleAlert } from 'lucide-react'
import { alertsPage, conditionPage } from '../../data/connect'
import { alertTime, type AlertSeverity, type ConnectAlert } from '../../lib/connect'

const icons = {
  alarm: { icon: CircleAlert, className: 'bg-danger-on-dark text-navy-900' },
  warning: { icon: TriangleAlert, className: 'bg-warning-on-dark text-navy-900' },
  info: { icon: Info, className: 'bg-white/15 text-white' },
} satisfies Record<AlertSeverity, unknown>

/** One asset's alerts as a vertical timeline, newest first. */
export function AlertTimeline({
  alerts,
  acknowledgedBy,
}: {
  alerts: ConnectAlert[]
  acknowledgedBy: Record<string, string>
}) {
  if (alerts.length === 0) {
    return <p className="text-sm text-text-on-dark-muted">{conditionPage.timeline.none}</p>
  }
  return (
    <ol>
      {alerts.map((alert, i) => {
        const { icon: Icon, className } = icons[alert.severity]
        const by = acknowledgedBy[alert.id]
        return (
          <li key={alert.id} className="relative flex gap-4 pb-6 last:pb-0">
            {i < alerts.length - 1 && (
              <span aria-hidden className="absolute top-8 bottom-0 left-[13px] w-px bg-white/10" />
            )}
            <span
              className={`relative flex size-7 shrink-0 items-center justify-center rounded-full ${className} ${
                alert.active && !by ? 'ring-4 ring-white/5' : 'opacity-80'
              }`}
            >
              <Icon className="size-3.5" strokeWidth={2.5} />
            </span>
            <div className="min-w-0 pt-0.5">
              <p
                className={`text-sm leading-snug font-semibold ${alert.active ? 'text-white' : 'text-text-on-dark'}`}
              >
                {alert.title}
              </p>
              <p className="mt-1 text-xs text-text-on-dark-muted tabular-nums">
                {alertTime(alert.time)}
                {alert.active && !by && (
                  <span className="ml-2 font-semibold text-warning-on-dark">
                    {alertsPage.severity[alert.severity]} · {alertsPage.active}
                  </span>
                )}
                {by && <span className="ml-2">{alertsPage.acknowledged(by)}</span>}
                {alert.resolved && <span className="ml-2">{alert.resolved}</span>}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
