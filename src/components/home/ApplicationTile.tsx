import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import type { ApplicationTeaser } from '../../types'
import { ImageSlot } from '../ImageSlot'

/** Teaser for the Applications grid: image, then title, caption and an arrow. */
export function ApplicationTile({ item }: { item: ApplicationTeaser }) {
  return (
    <Link
      to={item.to}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-[border-color,box-shadow] duration-200 hover:border-primary-border hover:shadow-card"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <ImageSlot
          image={item.image}
          className="transition-transform duration-[250ms] ease-sz group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 items-start justify-between gap-4 px-6 pt-5 pb-6">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-heading group-hover:text-primary">
            {item.title}
          </h3>
          <p className="mt-1.5 text-[15px] leading-relaxed text-text-muted">{item.caption}</p>
        </div>
        <ArrowRight className="mt-1 size-5 shrink-0 text-primary transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
