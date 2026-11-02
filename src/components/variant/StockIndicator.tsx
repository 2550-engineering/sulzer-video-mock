import { variantPage } from '../../data/variantPages'
import type { StockStatus } from '../../types'

const dot: Record<StockStatus, string> = {
  'in-stock': 'bg-success',
  'lead-time': 'bg-primary',
  'made-to-order': 'bg-warning',
  discontinued: 'bg-danger',
}

/** Coloured dot and stock label, e.g. "● In stock". */
export function StockIndicator({ status }: { status: StockStatus }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden className={`size-2.5 shrink-0 rounded-full ${dot[status]}`} />
      {variantPage.stock[status]}
    </span>
  )
}
