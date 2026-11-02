import { leadTime } from '../../lib/pricing'
import type { ModelAvailability } from '../../types'

const dots = { success: 'bg-success', warning: 'bg-warning' }

/** Dot, "In stock" and "ships in 2 days", stacked or on one line. */
export function LeadTime({
  availability,
  inline = false,
}: {
  availability: ModelAvailability
  inline?: boolean
}) {
  const { label, detail, tone } = leadTime(availability)
  return (
    <span className="inline-flex items-start gap-2">
      <span aria-hidden className={`mt-[7px] size-2 shrink-0 rounded-full ${dots[tone]}`} />
      <span className={inline ? 'whitespace-nowrap' : 'leading-snug'}>
        <span className="font-medium text-navy-900">{label}</span>
        {inline ? ' – ' : <br />}
        <span className="text-sm text-text-muted">{detail}</span>
      </span>
    </span>
  )
}
