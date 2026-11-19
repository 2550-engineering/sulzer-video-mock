import type { MouseEvent } from 'react'
import { replacementGuidePage } from '../../data/replacementGuidePage'
import { articleById } from '../../lib/articles'
import { getProduct } from '../../lib/catalog'
import { findGuidePump, type GuideSuggestion } from '../../lib/replacementGuide'
import { Highlight } from '../search/Highlight'
import { GuidePumpPhoto } from './GuidePumpPhoto'

const copy = replacementGuidePage

type GuideSuggestionRowProps = {
  suggestion: GuideSuggestion
  id: string
  active: boolean
  query: string
  onHighlight: () => void
  onPick: () => void
}

/** Photo of the pump a suggestion points at: the competitor pump, or the Sulzer product. */
function photoOf({ target }: GuideSuggestion) {
  if (target.kind === 'competitor') return findGuidePump(target.brand, target.model)?.image
  const article = articleById(target.articleId)
  return article && getProduct(article.productId)?.images[0]
}

/**
 * One installed pump in the replacement guide's suggestion list: photo, name and
 * part / RSK line with the match in bold, and the Sulzer pump that replaces it.
 * Looks like the header search's SuggestionRow.
 */
export function GuideSuggestionRow({
  suggestion,
  id,
  active,
  query,
  onHighlight,
  onPick,
}: GuideSuggestionRowProps) {
  function handleClick(event: MouseEvent) {
    event.preventDefault()
    onPick()
  }

  return (
    <div
      id={id}
      role="option"
      aria-selected={active}
      onMouseMove={active ? undefined : onHighlight}
      onClick={handleClick}
      className={`flex cursor-pointer items-center gap-3.5 rounded-md px-3 py-2 transition-colors duration-150 ${
        active ? 'bg-primary-tint' : ''
      }`}
    >
      <GuidePumpPhoto image={photoOf(suggestion)} className="size-12" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] text-text">
          <Highlight text={suggestion.label} query={query} />
        </span>
        <span className="mt-0.5 block truncate text-[13px] text-text-muted tabular-nums">
          <Highlight text={suggestion.line} query={query} />
        </span>
      </span>
      {suggestion.replacement && (
        <span className="shrink-0 text-right max-sm:hidden">
          <span className="block text-[13px] font-semibold text-primary">
            {copy.search.replacedBy(suggestion.replacement)}
          </span>
          <span className="mt-0.5 flex items-center justify-end gap-1.5 text-xs text-text-muted">
            <span
              aria-hidden
              className={`size-1.5 rounded-full ${
                suggestion.fit === 'drop-in' ? 'bg-success' : 'bg-warning'
              }`}
            />
            {copy.fit[suggestion.fit].label}
          </span>
        </span>
      )}
    </div>
  )
}
