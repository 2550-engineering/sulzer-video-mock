import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import type { HelpCard } from '../types'

type HelpSectionProps = {
  title: string
  text: string
  cards: HelpCard[]
}

/** Centred heading, then columns with a large line icon, title, text and a pill button. */
export function HelpSection({ title, text, cards }: HelpSectionProps) {
  return (
    <section className="border-t border-border py-16 lg:py-24">
      <div className="site-container text-center">
        <h2 className="text-[2rem] leading-tight font-bold tracking-tight text-brand">{title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-text-muted">{text}</p>

        <ul className="mx-auto mt-14 grid max-w-5xl gap-x-12 gap-y-14 md:grid-cols-3">
          {cards.map(({ title, text, icon: Icon, actionLabel, to }) => (
            <li key={title} className="flex flex-col items-center">
              <Icon aria-hidden className="size-16 text-primary" strokeWidth={1.1} />
              <h3 className="mt-6 text-xl font-bold tracking-tight text-navy-900">{title}</h3>
              <p className="mt-2 mb-7 max-w-xs text-[15px] leading-relaxed text-text-muted">
                {text}
              </p>
              <Link
                to={to}
                className="group mt-auto inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
              >
                {actionLabel}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
