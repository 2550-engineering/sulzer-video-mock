import { ArrowRight, CircleCheck } from 'lucide-react'
import { Link } from 'react-router'
import { sulzerReplacementCopy as copy } from '../../data/replacementGuidePage'
import { comparisonRows, fitNotes, replacementInfo } from '../../lib/replacement'
import type { ResultArticle } from '../../types'
import { FitNotes } from './FitNotes'
import { OldProductCard } from './OldProductCard'
import { ReplacementCard } from './ReplacementCard'
import { SpecComparison } from './SpecComparison'

type SulzerReplacementResultProps = {
  article: ResultArticle
  /** Missing when the article is still available. */
  successor: ResultArticle | undefined
}

/**
 * A Sulzer product in the replacement guide: the discontinued product, its successor,
 * whether it fits and how the key specs compare; or "still available".
 */
export function SulzerReplacementResult({ article, successor }: SulzerReplacementResultProps) {
  if (!successor) {
    return (
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 rounded-lg border border-success bg-success-tint px-6 py-5">
        <CircleCheck aria-hidden className="size-8 shrink-0 text-success" strokeWidth={1.75} />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-navy-900">{copy.stillAvailable.title(article.code)}</p>
          <p className="mt-0.5 text-sm text-text">{copy.stillAvailable.text}</p>
        </div>
        <Link
          to={article.to}
          className="inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          {copy.stillAvailable.action}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div className="grid items-stretch gap-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <OldProductCard article={article} />
        <div className="flex items-center justify-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-navy-900 text-white shadow-raised max-md:rotate-90">
            <ArrowRight aria-hidden className="size-5" />
          </span>
        </div>
        <ReplacementCard article={successor} info={replacementInfo(article)} />
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <FitNotes notes={fitNotes(article, successor)} />
        <SpecComparison rows={comparisonRows(article, successor)} />
      </div>
    </div>
  )
}
