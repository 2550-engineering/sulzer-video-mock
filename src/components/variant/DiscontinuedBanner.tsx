import { ArrowRight, TriangleAlert, Wrench } from 'lucide-react'
import { Link } from 'react-router'
import { variantPage } from '../../data/variantPages'
import { articleById } from '../../lib/articles'
import type { ResultArticle } from '../../types'

const copy = variantPage.discontinued

type DiscontinuedBannerProps = {
  article: ResultArticle
  /** Opens the Spare parts tab. */
  onViewSpareParts?: () => void
}

/**
 * Amber banner on a discontinued variant or model: spare parts are still
 * available; "Find replacement" (the replacement page) and "View spare parts".
 */
export function DiscontinuedBanner({ article, onViewSpareParts }: DiscontinuedBannerProps) {
  if (!article.discontinued) return null
  const successor = articleById(article.discontinued.successorId)
  return (
    <div
      role="status"
      className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border border-warning bg-warning-tint px-5 py-4"
    >
      <TriangleAlert aria-hidden className="size-6 shrink-0 text-warning-strong" strokeWidth={2} />
      <div className="min-w-0 flex-1">
        <p className="font-bold text-navy-900">{copy.title}</p>
        {successor && (
          <p className="mt-0.5 text-sm text-text">
            {copy.text(article.discontinued.year, successor.code)}
          </p>
        )}
      </div>
      {onViewSpareParts && (
        <button
          type="button"
          onClick={onViewSpareParts}
          className="inline-flex h-10 items-center gap-2 rounded-pill border-2 border-navy-900 px-5 text-sm font-semibold text-navy-900 transition-colors hover:bg-white"
        >
          <Wrench className="size-4" />
          {copy.spareParts}
        </button>
      )}
      {successor && (
        <Link
          to={`/products/replacement?from=${article.id}`}
          className="group inline-flex h-10 items-center gap-2 rounded-pill bg-navy-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
        >
          {copy.action}
          <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}
