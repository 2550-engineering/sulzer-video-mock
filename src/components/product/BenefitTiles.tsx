import type { BenefitStat } from '../../types'

type BenefitTilesProps = {
  title: string
  text: string
  stats: BenefitStat[]
}

/** Grey band with a heading and a row of white tiles, each led by a big figure. */
export function BenefitTiles({ title, text, stats }: BenefitTilesProps) {
  return (
    <section className="border-y border-border bg-surface-muted">
      <div className="site-container py-20 lg:py-24">
        <div className="max-w-3xl">
          <h2 className="text-[2rem] leading-tight font-bold tracking-tight text-brand">{title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-text-muted">{text}</p>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ value, label, text: statText }) => (
            <li
              key={label}
              className="relative overflow-hidden rounded-lg bg-white p-8 shadow-card ring-1 ring-navy-900/5"
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-primary" />
              <p className="text-[3.25rem] leading-none font-bold tracking-tight text-primary tabular-nums">
                {value}
              </p>
              <p className="mt-4 text-lg font-bold tracking-tight text-navy-900">{label}</p>
              {statText && (
                <p className="mt-2 text-[15px] leading-relaxed text-text-muted">{statText}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
