import { ShoppingCart } from 'lucide-react'
import type { Price } from '../../lib/pricing'
import type { SparePart } from '../../types'
import { SmartImage } from '../SmartImage'
import { LeadTime } from '../spareparts/LeadTime'
import { PartPrice } from '../spareparts/PartPrice'

type PartCardProps = {
  part: SparePart
  /** Small line above the name, e.g. the group or "2-year service kit". */
  eyebrow: string
  /** Lines under the part number, e.g. what it fits or when it was last ordered. */
  meta: string[]
  /** Null when signed out: no price, no button. */
  price: Price | null
  actionLabel: string
  onAdd: () => void
}

/** A part as a card: photo, name, number, lead time, and (signed in) price and Add to cart. */
export function PartCard({ part, eyebrow, meta, price, actionLabel, onAdd }: PartCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-white shadow-card">
      <div className="relative bg-surface-muted">
        <SmartImage src={part.image.src} alt={part.image.alt} aspect="4 / 3" fit="contain" />
      </div>
      <div className="flex flex-1 flex-col px-6 py-5">
        <p className="text-xs font-bold tracking-[0.1em] text-primary uppercase">{eyebrow}</p>
        <h3 className="mt-1.5 text-lg leading-snug font-bold tracking-tight text-navy-900">
          {part.name}
        </h3>
        <p className="mt-1 text-sm text-text-muted tabular-nums">{part.partNumber}</p>
        {meta.map((line) => (
          <p key={line} className="mt-0.5 text-sm text-text-muted">
            {line}
          </p>
        ))}
        <p className="mt-3 text-sm">
          <LeadTime availability={part.availability} inline />
        </p>
        {price && (
          <div className="mt-auto flex items-end justify-between gap-4 pt-5">
            <PartPrice price={price} align="left" />
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex h-10 items-center gap-2 rounded-pill bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              <ShoppingCart className="size-4" strokeWidth={1.75} />
              {actionLabel}
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
