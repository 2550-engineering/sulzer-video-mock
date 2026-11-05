import { partnerDashboard } from '../data/partner'

/** Small yellow "Partner" pill next to a channel partner's name. */
export function PartnerBadge({ className }: { className?: string }) {
  return (
    <span
      className={`rounded-pill bg-accent-yellow px-2 py-0.5 text-[11px] leading-none font-bold tracking-wider text-navy-900 uppercase${className ? ` ${className}` : ''}`}
    >
      {partnerDashboard.badge}
    </span>
  )
}
