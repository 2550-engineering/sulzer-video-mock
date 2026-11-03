import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../../cart/useCart'
import { sparePartsTab } from '../../data/sparePartsPage'
import type { Availability, ServiceKit, SparePart } from '../../types'
import { PriceLines } from './PriceLines'
import { QuantityStepper } from './QuantityStepper'

const copy = sparePartsTab.detail

type KitDetailCardProps = {
  kit: ServiceKit
  /** The parts of the shown production version, by id. */
  parts: Map<string, SparePart>
  onSelectPart: (partId: string) => void
  /** The variant or model whose parts list this is, for the cart. */
  ownerId: string
}

/**
 * A recommended set: every part with its quantity, the set's price (sum of
 * its parts in this version) and slowest lead time, and "Add kit to cart".
 */
export function KitDetailCard({ kit, parts, onSelectPart, ownerId }: KitDetailCardProps) {
  const cart = useCart()
  const [quantity, setQuantity] = useState(1)
  const items = kit.items
    .map((item) => ({ part: parts.get(item.partId)!, quantity: item.quantity }))
    .filter(({ part }) => part)
  const price =
    Math.round(items.reduce((sum, { part, quantity: q }) => sum + part.listPrice * q, 0) * 100) /
    100
  const availability = items.reduce<Availability>(
    (slowest, { part }) =>
      part.availability.leadTimeDays > slowest.leadTimeDays ? part.availability : slowest,
    items[0].part.availability,
  )

  return (
    <div className="grid animate-fade-in gap-x-6 gap-y-5 sm:grid-cols-[minmax(0,1fr)_13rem]">
      <div className="min-w-0">
        <h3 className="text-lg font-bold tracking-tight text-navy-900">{kit.name}</h3>
        <p className="mt-0.5 text-sm text-text-muted">
          {copy.partNumber}{' '}
          <span className="font-semibold text-navy-900 tabular-nums">{kit.partNumber}</span>
          {' · '}
          {copy.kitParts(items.length)}
        </p>
        <ul className="mt-3 grid gap-x-6 text-sm sm:grid-cols-2">
          {items.map(({ part, quantity: q }) => (
            <li key={part.id}>
              <button
                type="button"
                onClick={() => onSelectPart(part.id)}
                className="flex w-full items-baseline gap-2.5 border-b border-border py-1.5 text-left transition-colors hover:text-primary"
              >
                <span className="w-8 shrink-0 text-text-muted tabular-nums">{part.position}</span>
                <span className="min-w-0 flex-1 truncate">{part.name}</span>
                <span className="shrink-0 text-xs text-text-subtle tabular-nums">
                  {sparePartsTab.pieces(q)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4 sm:border-l sm:border-border sm:pl-6">
        <PriceLines price={price} unit={copy.total} availability={availability} />
        <div className="mt-auto flex flex-wrap items-center gap-2">
          <QuantityStepper value={quantity} onChange={setQuantity} label={copy.order} />
          <button
            type="button"
            onClick={() =>
              cart.add(
                {
                  kind: 'kit',
                  refId: kit.id,
                  partNumber: kit.partNumber,
                  name: kit.name,
                  variantId: ownerId,
                  unitPrice: price,
                  availability,
                },
                quantity,
              )
            }
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-pill bg-primary px-4 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-primary-hover"
          >
            <ShoppingCart className="size-4" />
            {copy.addKit}
          </button>
        </div>
      </div>
    </div>
  )
}
