import { Link } from 'react-router'
import type { KnowledgeItem } from '../types'
import { SmartImage } from './SmartImage'

/** Image with a type badge, then title and teaser. The whole card links to the item. */
export function KnowledgeCard({ item }: { item: KnowledgeItem }) {
  return (
    <Link to={item.to} className="group block">
      <div className="relative overflow-hidden rounded-md bg-navy-900">
        <SmartImage
          src={item.image.src}
          alt=""
          aspect="3 / 2"
          className="transition-transform duration-200 ease-sz group-hover:scale-[1.03]"
        />
        <span className="absolute bottom-3 left-3 rounded-sm bg-navy-900/85 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {item.type}
        </span>
      </div>
      <h3 className="mt-4 text-lg leading-snug font-bold tracking-tight text-brand decoration-2 underline-offset-4 group-hover:underline">
        {item.title}
      </h3>
      <p className="mt-1.5 text-[15px] leading-relaxed text-text-muted">{item.teaser}</p>
    </Link>
  )
}
