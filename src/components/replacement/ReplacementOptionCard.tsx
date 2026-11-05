import { BadgeCheck, CircleDollarSign, Info } from 'lucide-react'
import { useAuth } from '../../auth/useAuth'
import { replacementPage } from '../../data/replacement'
import { groupThousands } from '../../lib/format'
import { formatPrice } from '../../lib/modelSpecs'
import { priceFor } from '../../lib/pricing'
import type { ReplacementOption } from '../../lib/pumpReplacement'
import { AvailabilityBadge } from '../product/AvailabilityBadge'

const copy = replacementPage.options

type ReplacementOptionCardProps = {
  option: ReplacementOption
  selected: boolean
  /** Prices and lead times are for signed-in users only. */
  signedIn: boolean
  onSelect: () => void
}

/** A suggested pump: badges, key figures and (signed in) price. Selecting it drives the curve and savings. */
export function ReplacementOptionCard({
  option,
  selected,
  signedIn,
  onSelect,
}: ReplacementOptionCardProps) {
  const { user } = useAuth()
  const { result, fits, lowestCost } = option
  const { variant } = result
  const price = signedIn ? priceFor(result.purchasePrice, user) : null
  const figures: [string, string][] = [
    [copy.efficiency, `${groupThousands(result.efficiency, 1)} %`],
    [copy.motor, `${variant.motorPower} kW ${variant.motorClass}`],
    [copy.power, `${groupThousands(result.p1, 1)} kW`],
    ...(price ? [[copy.listPrice, formatPrice(price.list)] as [string, string]] : []),
    // Partners also see their net price.
    ...(price && price.discount > 0
      ? [[copy.netPrice(price.discount), formatPrice(price.net)] as [string, string]]
      : []),
  ]

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={copy.select(variant.name)}
      onClick={onSelect}
      className={`w-full rounded-lg border bg-white px-5 py-4 text-left transition-[border-color,box-shadow] duration-200 ${
        selected
          ? 'border-primary shadow-[0_0_0_3px_var(--sz-color-primary-tint-strong)]'
          : 'border-border hover:border-primary-border'
      }`}
    >
      <span className="flex flex-wrap gap-2">
        {fits && (
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-success-tint px-2.5 py-1 text-xs font-semibold text-success">
            <BadgeCheck className="size-3.5" />
            {copy.fits}
          </span>
        )}
        {lowestCost && (
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-primary-tint px-2.5 py-1 text-xs font-semibold text-primary">
            <CircleDollarSign className="size-3.5" />
            {copy.lowestCost}
          </span>
        )}
        {!fits && (
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-surface-muted px-2.5 py-1 text-xs font-semibold text-text-muted">
            <Info className="size-3.5" />
            {copy.newPipework(variant.connection.suction, variant.connection.discharge)}
          </span>
        )}
      </span>

      <span className="mt-3 flex items-start gap-3">
        <span
          aria-hidden
          className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            selected ? 'border-primary' : 'border-border-strong'
          }`}
        >
          {selected && <span className="size-2.5 rounded-full bg-primary" />}
        </span>
        <span className="min-w-0">
          <span className="block text-lg leading-snug font-bold text-navy-900">{variant.name}</span>
          <span className="mt-0.5 flex flex-wrap gap-x-3 text-sm text-text-muted tabular-nums">
            <span>
              {copy.productNumber} {variant.productNumber ?? copy.onRequest}
            </span>
            {signedIn && <AvailabilityBadge model={variant} />}
          </span>
        </span>
      </span>

      <span className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-border pt-3 text-sm sm:grid-cols-4">
        {figures.map(([label, value]) => (
          <span key={label}>
            <span className="block text-text-muted">{label}</span>
            <span className="block font-semibold text-navy-900 tabular-nums">{value}</span>
          </span>
        ))}
      </span>
    </button>
  )
}
