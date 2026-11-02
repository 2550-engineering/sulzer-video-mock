import { ArrowRight, Bookmark } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

type PersonalItemCardProps = {
  /** Fills the grey picture area at the top. */
  media: ReactNode
  /** Small tag above the title, e.g. "Product". */
  badge: string
  /** Blue tag on the picture, e.g. "Last viewed". */
  flag?: string
  title: string
  meta: string
  to: string
  actionLabel: string
  /** Filled bookmark in the corner that takes the item out of Saved items. */
  remove?: { label: string; onClick: () => void }
}

/** Card on My saved items and Recently viewed: picture, tag, title, line under it and a link. */
export function PersonalItemCard({
  media,
  badge,
  flag,
  title,
  meta,
  to,
  actionLabel,
  remove,
}: PersonalItemCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-card ring-1 ring-navy-900/5 transition-shadow hover:shadow-[0_2px_4px_rgba(12,28,46,0.06),0_16px_32px_-12px_rgba(12,28,46,0.25)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-sunken">
        {media}
        {flag && (
          <span className="absolute top-4 left-4 rounded-pill bg-primary px-3 py-1 text-xs font-semibold text-white">
            {flag}
          </span>
        )}
      </div>
      {remove && (
        <button
          type="button"
          onClick={remove.onClick}
          aria-label={remove.label}
          title={remove.label}
          className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full bg-white text-primary shadow-card transition-[scale,background-color] hover:bg-primary-tint active:scale-95"
        >
          <Bookmark className="size-[18px]" fill="currentColor" strokeWidth={1.75} />
        </button>
      )}
      <div className="flex flex-1 flex-col p-6">
        <span className="self-start rounded-sm bg-surface-sunken px-2 py-0.5 text-xs font-semibold text-navy-700">
          {badge}
        </span>
        <h2 className="mt-3 text-lg leading-snug font-bold tracking-tight text-brand">{title}</h2>
        <p className="mt-1 line-clamp-3 text-[15px] text-text-muted">{meta}</p>
        <Link
          to={to}
          className="mt-auto inline-flex items-center gap-2 self-start pt-5 text-[15px] font-semibold text-primary transition-colors after:absolute after:inset-0 hover:text-primary-hover"
        >
          {actionLabel}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}
