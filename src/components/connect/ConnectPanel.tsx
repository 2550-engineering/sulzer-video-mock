import type { ReactNode } from 'react'

type ConnectPanelProps = {
  title?: string
  subtitle?: string
  /** Shown on the right of the title row, e.g. a link or a toggle. */
  actions?: ReactNode
  /** No inner padding: the content brings its own, e.g. a table. */
  flush?: boolean
  className?: string
  children: ReactNode
}

/** Dark card used throughout Sulzer Connect, with an optional title row. */
export function ConnectPanel({
  title,
  subtitle,
  actions,
  flush = false,
  className = '',
  children,
}: ConnectPanelProps) {
  return (
    <section
      className={`rounded-lg border border-white/10 bg-navy-900/70 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.8)] max-xl:min-w-0 ${className}`}
    >
      {(title || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 px-6 pt-5 max-md:px-4">
          <div>
            {title && <h2 className="text-[15px] font-semibold text-white">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-[13px] text-text-on-dark-muted">{subtitle}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className={flush ? '' : 'p-6 max-md:p-4'}>{children}</div>
    </section>
  )
}
