import { ArrowRight, Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import brandImage from '../assets/images/sulzer-dynamical-still.jpg'
import type { NavItem } from '../types'

type ComingSoonPanelProps = {
  eyebrow: string
  title: string
  children: ReactNode
  /** What the finished page will offer, shown as a checklist under the text. */
  features?: string[]
  /** Secondary button. Defaults to "Back to home". */
  back?: NavItem
}

/** Card with copy, two actions and Sulzer brand imagery, for pages that aren't built yet. */
export function ComingSoonPanel({
  eyebrow,
  title,
  children,
  features,
  back = { label: 'Back to home', to: '/' },
}: ComingSoonPanelProps) {
  return (
    <div className="grid overflow-hidden rounded-lg border border-border bg-surface shadow-card lg:grid-cols-[1.15fr_1fr]">
      <div className="px-8 py-12 sm:px-14 sm:py-16">
        <span className="inline-flex items-center gap-2 rounded-pill bg-primary-tint px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
          <span className="size-1.5 rounded-full bg-primary" aria-hidden />
          {eyebrow}
        </span>
        <h2 className="mt-5 max-w-lg text-3xl font-bold tracking-tight text-navy-900">{title}</h2>
        <div className="mt-4 max-w-lg text-base leading-relaxed text-text-muted">{children}</div>
        {features && (
          <ul className="mt-7 grid max-w-xl gap-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-[15px] text-text">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success-tint text-success-strong">
                  <Check className="size-3.5" strokeWidth={2.5} />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            to="/contact"
            className="inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Contact us
            <ArrowRight className="size-4" />
          </Link>
          <Link
            to={back.to}
            className="inline-flex h-11 items-center rounded-pill border border-border-strong px-6 text-sm font-semibold text-navy-900 transition-colors hover:border-primary hover:text-primary"
          >
            {back.label}
          </Link>
        </div>
      </div>
      <div className="relative min-h-64">
        <img
          src={brandImage}
          alt=""
          className="absolute inset-0 size-full object-cover"
          draggable={false}
        />
      </div>
    </div>
  )
}
