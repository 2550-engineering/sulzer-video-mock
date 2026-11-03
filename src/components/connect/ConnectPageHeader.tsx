import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import type { NavItem } from '../../types'

type ConnectPageHeaderProps = {
  title: ReactNode
  subtitle?: ReactNode
  back?: NavItem
  /** Right-hand side, e.g. a search field or a button. */
  actions?: ReactNode
}

/** Title row of a Sulzer Connect page, with an optional back link above it. */
export function ConnectPageHeader({ title, subtitle, back, actions }: ConnectPageHeaderProps) {
  return (
    <header className="animate-fade-in">
      {back && (
        <Link
          to={back.to}
          className="group mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-on-dark transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="min-w-0">
          <h1 className="text-[1.75rem] leading-tight font-bold tracking-tight text-white">
            {title}
          </h1>
          {subtitle && <div className="mt-1.5 text-[15px] text-text-on-dark-muted">{subtitle}</div>}
        </div>
        {actions}
      </div>
    </header>
  )
}
