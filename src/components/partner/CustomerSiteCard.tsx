import { MapPin } from 'lucide-react'
import { customerPage } from '../../data/partner'
import type { Site } from '../../types'
import { SmartImage } from '../SmartImage'

const copy = customerPage.sites

type CustomerSiteCardProps = {
  site: Site
  assets: number
  attention: number
  selected: boolean
  onSelect: () => void
}

/** A customer's site: photo, type, name and counts. Selecting it filters the installed base. */
export function CustomerSiteCard({
  site,
  assets,
  attention,
  selected,
  onSelect,
}: CustomerSiteCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={copy.filter(site.name)}
      className={`group relative isolate flex aspect-[16/10] w-full flex-col justify-end overflow-hidden rounded-lg p-4 text-left text-white transition-[box-shadow,translate] duration-200 hover:-translate-y-0.5 ${
        selected
          ? 'shadow-[0_0_0_3px_var(--sz-color-primary)]'
          : 'shadow-card ring-1 ring-navy-900/5'
      }`}
    >
      <div className="absolute inset-0 -z-10 transition-transform duration-500 group-hover:scale-[1.03]">
        <SmartImage src={site.image.src} alt={site.image.alt} />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-navy-900/90 via-navy-900/35 to-transparent"
        />
      </div>
      <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-white/80 uppercase">
        <MapPin className="size-3.5" />
        {site.type}
      </p>
      <p className="mt-1 text-lg leading-snug font-bold tracking-tight">{site.name}</p>
      <p className="mt-1 flex flex-wrap items-center gap-x-2.5 text-sm text-white/85">
        <span>{copy.assets(assets)}</span>
        <span aria-hidden className="text-white/40">
          |
        </span>
        <span className={attention ? 'font-semibold text-accent-yellow' : ''}>
          {attention ? copy.attention(attention) : copy.allNormal}
        </span>
      </p>
    </button>
  )
}
