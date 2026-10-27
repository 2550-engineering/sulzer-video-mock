import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { assetsCard } from '../../data/myPages'
import type { StatusTone } from '../../types'
import { DashboardPanel } from './DashboardPanel'

const tones: Record<StatusTone, { icon: string; value: string }> = {
  neutral: { icon: 'bg-surface-sunken text-navy-700', value: 'text-navy-900' },
  info: { icon: 'bg-primary-tint text-primary', value: 'text-primary' },
  warning: { icon: 'bg-warning-tint text-warning', value: 'text-warning-strong' },
}

/** "My assets" card: three headline stats on the installed base and a link to the asset list. */
export function AssetsCard() {
  const { title, subtitle, icon, badge, stats, source, link } = assetsCard

  return (
    <DashboardPanel title={title} subtitle={subtitle} icon={icon} badge={badge}>
      <div className="flex flex-1 flex-col p-7">
        <ul className="grid gap-4 sm:grid-cols-3">
          {stats.map(({ value, label, detail, tone, icon: Icon }) => (
            <li key={label}>
              <Link
                to={link.to}
                className="group block h-full rounded-md border border-border bg-surface-subtle p-5 transition-[border-color,background-color,box-shadow] duration-200 hover:border-primary-border hover:bg-surface hover:shadow-card"
              >
                <span
                  className={`flex size-9 items-center justify-center rounded-full ${tones[tone].icon}`}
                >
                  <Icon className="size-[18px]" strokeWidth={1.75} />
                </span>
                <p className="mt-4 flex items-baseline gap-2">
                  <span
                    className={`text-4xl leading-none font-bold tracking-tight tabular-nums ${tones[tone].value}`}
                  >
                    {value}
                  </span>
                  <span className="text-[15px] font-semibold text-navy-900">{label}</span>
                </p>
                <p className="mt-2 text-sm text-text-muted">{detail}</p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
          <p className="flex items-center gap-2 text-sm text-text-muted">
            <span aria-hidden className="size-2 rounded-full bg-success ring-4 ring-success-tint" />
            {source}
          </p>
          <Link
            to={link.to}
            className="group inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            {link.label}
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </DashboardPanel>
  )
}
