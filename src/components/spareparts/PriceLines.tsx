import { LogIn } from 'lucide-react'
import { useAuth } from '../../auth/useAuth'
import { sparePartsTab } from '../../data/sparePartsPage'
import { formatPartPrice } from '../../lib/modelSpecs'
import type { Availability } from '../../types'
import { StockIndicator } from '../variant/StockIndicator'

const copy = sparePartsTab.detail

type PriceLinesProps = {
  price: number
  /** e.g. "each, EUR excl. VAT". */
  unit: string
  availability: Availability
}

/** Signed in: price, stock dot and lead time. Signed out: the sign-in prompt. */
export function PriceLines({ price, unit, availability }: PriceLinesProps) {
  const { user, signIn } = useAuth()
  if (!user) {
    return (
      <button
        type="button"
        onClick={signIn}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
      >
        <LogIn className="size-4" />
        {copy.signIn}
      </button>
    )
  }
  return (
    <div className="animate-fade-in">
      <p className="text-xs font-semibold text-text-muted">{copy.price}</p>
      <p className="text-2xl leading-tight font-bold tracking-tight text-navy-900 tabular-nums">
        {formatPartPrice(price)}
      </p>
      <p className="text-xs text-text-muted">{unit}</p>
      <p className="mt-2 text-sm font-semibold text-navy-900">
        <StockIndicator status={availability.status} />
      </p>
      <p className="text-sm text-text-muted">{availability.leadTime}</p>
    </div>
  )
}
