import { LogIn } from 'lucide-react'
import { useAuth } from '../../auth/useAuth'
import { priceCopy } from '../../data/pricing'
import { sparePartsTab } from '../../data/sparePartsPage'
import { formatPartPrice } from '../../lib/modelSpecs'
import { priceFor } from '../../lib/pricing'
import type { Availability } from '../../types'
import { StockIndicator } from '../variant/StockIndicator'

const copy = sparePartsTab.detail

type PriceLinesProps = {
  price: number
  /** e.g. "each, EUR excl. VAT". */
  unit: string
  availability: Availability
}

/**
 * Signed in: price, stock dot and lead time; partners see their net price with the
 * list price and their discount. Signed out: the sign-in prompt.
 */
export function PriceLines({ price, unit, availability }: PriceLinesProps) {
  const { user, signIn } = useAuth()
  if (!user) {
    return (
      <button
        type="button"
        onClick={() => signIn()}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
      >
        <LogIn className="size-4" />
        {copy.signIn}
      </button>
    )
  }
  const partner = priceFor(price, user)!
  const discounted = partner.discount > 0
  return (
    <div className="animate-fade-in">
      <p className="text-xs font-semibold text-text-muted">
        {discounted ? priceCopy.netPrice : copy.price}
      </p>
      <p className="text-2xl leading-tight font-bold tracking-tight text-navy-900 tabular-nums">
        {formatPartPrice(partner.net)}
      </p>
      <p className="text-xs text-text-muted">{unit}</p>
      {discounted && (
        <p className="mt-1 text-xs whitespace-nowrap text-text-muted tabular-nums">
          <span className="line-through">{priceCopy.listPrice(formatPartPrice(partner.list))}</span>
          <span className="block font-semibold text-success-strong">
            {priceCopy.discount(partner.discount)}
          </span>
        </p>
      )}
      <p className="mt-2 text-sm font-semibold text-navy-900">
        <StockIndicator status={availability.status} />
      </p>
      <p className="text-sm text-text-muted">{availability.leadTime}</p>
    </div>
  )
}
