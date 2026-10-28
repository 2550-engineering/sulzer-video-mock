import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import type { NavItem } from '../types'

type SectionHeadingProps = {
  title: string
  subtitle: string
  action?: NavItem
  tone?: 'light' | 'dark'
}

/** Section title, subline and an optional "see all" link on the right. */
export function SectionHeading({ title, subtitle, action, tone = 'light' }: SectionHeadingProps) {
  const dark = tone === 'dark'
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <h2
          className={`text-[2.5rem] leading-tight font-bold tracking-tight ${dark ? 'text-white' : 'text-heading'}`}
        >
          {title}
        </h2>
        <p className={`mt-3 max-w-2xl text-lg ${dark ? 'text-text-on-dark' : 'text-text-muted'}`}>
          {subtitle}
        </p>
      </div>
      {action && (
        <Link
          to={action.to}
          className="group inline-flex items-center gap-2 text-[15px] font-semibold text-primary transition-colors hover:text-primary-hover"
        >
          {action.label}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}
