import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import type { CtaBandContent } from '../types'

const buttons = [
  'bg-white text-brand hover:bg-primary-tint',
  'border border-white/50 text-white hover:border-white hover:bg-white/10',
]

/** Sulzer blue closing band: headline and text on the left, buttons on the right (the first is primary). */
export function CtaBand({ cta }: { cta: CtaBandContent }) {
  return (
    <section className="bg-brand text-white on-dark">
      <div className="site-container flex flex-wrap items-center justify-between gap-x-16 gap-y-8 py-16 lg:py-20">
        <div className="max-w-2xl">
          <h2 className="text-[2.25rem] leading-tight font-bold tracking-tight">{cta.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-white/80">{cta.text}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {cta.actions.map((action, i) => (
            <Link
              key={action.label}
              to={action.to}
              className={`group inline-flex h-12 items-center gap-2 rounded-pill px-7 text-[15px] font-semibold transition-colors ${buttons[Math.min(i, 1)]}`}
            >
              {action.label}
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
