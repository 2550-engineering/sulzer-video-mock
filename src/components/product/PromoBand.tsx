import { Download } from 'lucide-react'
import { Link } from 'react-router'
import type { ProductPromo } from '../../types'
import { PromoBadgeGraphic } from './PromoBadgeGraphic'

/** Headline, paragraph and button on the left; a round SVG badge on the right. */
export function PromoBand({ promo }: { promo: ProductPromo }) {
  return (
    <section className="border-y border-border bg-surface-subtle">
      <div className="site-container grid items-center gap-x-16 gap-y-10 py-16 lg:grid-cols-[1fr_auto] lg:py-20">
        <div className="max-w-2xl">
          <h2 className="text-[2rem] leading-tight font-bold tracking-tight text-brand">
            {promo.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-text-muted">{promo.text}</p>
          <Link
            to={promo.to}
            className="group mt-8 inline-flex h-12 items-center gap-2 rounded-pill bg-primary px-7 font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
          >
            <Download className="size-[18px]" />
            {promo.actionLabel}
          </Link>
        </div>
        <div className="mx-auto size-60 lg:mr-12 lg:size-64">
          <PromoBadgeGraphic badge={promo.badge} />
        </div>
      </div>
    </section>
  )
}
