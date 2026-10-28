import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import type { ApplicationTeaser } from '../../types'
import { SmartImage } from '../SmartImage'

/** Image tile with caption for the Applications teaser grid. */
export function ApplicationTile({ item }: { item: ApplicationTeaser }) {
  return (
    <Link
      to={item.to}
      className="group relative block aspect-[16/10] overflow-hidden rounded-lg bg-navy-900"
    >
      <SmartImage
        src={item.image.src}
        alt={item.image.alt}
        className="transition-transform duration-[250ms] ease-sz group-hover:scale-[1.04]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-navy-900/90 via-navy-900/25 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white">{item.title}</h3>
          <p className="mt-1 text-sm text-text-on-dark">{item.caption}</p>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors duration-200 group-hover:bg-primary">
          <ArrowRight className="size-[18px]" />
        </span>
      </div>
    </Link>
  )
}
