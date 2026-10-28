import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { catalogList as copy } from '../../data/catalogPages'
import type { ImageSource } from '../../types'
import { SmartImage } from '../SmartImage'

type CatalogListRowProps = {
  image: ImageSource
  /** `contain` for product cut-outs, `cover` for photos. */
  imageFit: 'contain' | 'cover'
  name: string
  text: string
  /** Where the name and "View" go. */
  to: string
  /** Small grey tag above the name. */
  badge?: string
  /** Middle column, e.g. a spec table. */
  details?: ReactNode
  /** Adds the "Size range" button. */
  sizeTo?: string
}

const outlinedButton =
  'inline-flex h-9 w-36 items-center justify-center rounded-pill border border-primary text-sm font-semibold text-primary transition-colors duration-150'

/** Bordered row: thumbnail, badge, name and description, optional details, then View / Size range. */
export function CatalogListRow({
  image,
  imageFit,
  name,
  text,
  to,
  badge,
  details,
  sizeTo,
}: CatalogListRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-5 rounded-md border border-border bg-surface px-6 py-5 transition-colors duration-200 hover:border-primary lg:flex-nowrap">
      <div className="flex min-w-0 flex-1 basis-[28rem] items-center gap-6">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-sm bg-surface-muted">
          <SmartImage src={image.src} alt={image.alt} fit={imageFit} />
        </div>
        <div className="min-w-0">
          {badge && (
            <span className="inline-block rounded-sm bg-surface-sunken px-2 py-0.5 text-[11px] font-semibold text-navy-700">
              {badge}
            </span>
          )}
          <h3 className={badge ? 'mt-1.5' : ''}>
            <Link
              to={to}
              className="text-lg font-bold tracking-tight text-brand underline-offset-4 hover:text-primary hover:underline"
            >
              {name}
            </Link>
          </h3>
          <p className="mt-1 line-clamp-2 max-w-2xl text-sm leading-relaxed text-text-muted">
            {text}
          </p>
        </div>
      </div>

      {details && <div className="shrink-0">{details}</div>}

      <div className="flex shrink-0 flex-col gap-2 lg:ml-4">
        <Link to={to} className={`${outlinedButton} hover:bg-primary hover:text-white`}>
          {copy.viewLabel}
        </Link>
        {sizeTo && (
          <Link to={sizeTo} className={`${outlinedButton} hover:bg-primary-tint`}>
            {copy.sizeRangeLabel}
          </Link>
        )}
      </div>
    </div>
  )
}
