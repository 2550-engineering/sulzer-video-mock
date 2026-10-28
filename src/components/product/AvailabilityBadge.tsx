import { availabilityLabel } from '../../lib/modelSpecs'
import type { ProductModel } from '../../types'

const dots = { success: 'bg-success', warning: 'bg-warning' }

/** Green dot and "In stock", or an amber dot and the lead time. */
export function AvailabilityBadge({ model }: { model: ProductModel }) {
  const { label, tone } = availabilityLabel(model)
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span aria-hidden className={`size-2 rounded-full ${dots[tone]}`} />
      {label}
    </span>
  )
}
