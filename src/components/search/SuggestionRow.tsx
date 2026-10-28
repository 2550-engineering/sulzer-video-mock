import { ArrowRight, Factory, FileText, Search } from 'lucide-react'
import type { MouseEvent } from 'react'
import { Link } from 'react-router'
import { searchSuggestions as copy } from '../../data/catalogPages'
import type { SuggestOption } from '../../hooks/useSearchSuggest'
import { getApplication } from '../../lib/catalog'
import { SmartImage } from '../SmartImage'
import { Highlight } from './Highlight'

type SuggestionRowProps = {
  option: SuggestOption
  id: string
  active: boolean
  query: string
  onHighlight: () => void
  onPick: () => void
}

const iconBox =
  'flex size-10 shrink-0 items-center justify-center rounded-sm bg-primary-tint text-primary'

/** One option in the suggestion panel: thumbnail or icon, name with the match in bold, one detail line. */
export function SuggestionRow({
  option,
  id,
  active,
  query,
  onHighlight,
  onPick,
}: SuggestionRowProps) {
  function handleClick(event: MouseEvent) {
    event.preventDefault()
    onPick()
  }

  const shared = {
    id,
    to: option.to,
    role: 'option',
    'aria-selected': active,
    tabIndex: -1,
    onMouseMove: active ? undefined : onHighlight,
    onClick: handleClick,
  }

  if (option.kind === 'all') {
    return (
      <Link
        {...shared}
        className={`group flex items-center gap-3 border-t border-border px-5 py-3.5 text-[15px] font-semibold text-primary transition-colors duration-150 ${
          active ? 'bg-primary-tint' : ''
        }`}
      >
        <Search className="size-4" strokeWidth={2.25} />
        {copy.seeAll(query.trim())}
        <ArrowRight
          className={`ml-auto size-4 transition-transform duration-150 ${active ? 'translate-x-1' : ''}`}
        />
      </Link>
    )
  }

  const { title, detail, visual } = describe(option)
  return (
    <Link
      {...shared}
      className={`flex items-center gap-3.5 rounded-md px-3 py-2 transition-colors duration-150 ${
        active ? 'bg-primary-tint' : ''
      }`}
    >
      {visual}
      <span className="min-w-0">
        <span className="block truncate text-[15px] text-text">
          <Highlight text={title} query={query} />
        </span>
        <span className="mt-0.5 block truncate text-[13px] text-text-muted">
          <Highlight text={detail} query={query} />
        </span>
      </span>
    </Link>
  )
}

function describe(option: Exclude<SuggestOption, { kind: 'all' }>) {
  switch (option.kind) {
    case 'product': {
      const image = option.product.images[0]
      return {
        title: option.product.name,
        detail: option.product.family,
        visual: (
          <span className="relative size-12 shrink-0 overflow-hidden rounded-sm bg-surface-muted">
            <SmartImage src={image.src} alt="" fit="contain" />
          </span>
        ),
      }
    }
    case 'application': {
      const parent = option.application.parentId && getApplication(option.application.parentId)
      return {
        title: option.application.name,
        detail: parent && parent.parentId ? parent.name : option.application.summary,
        visual: (
          <span className={iconBox}>
            <Factory className="size-5" strokeWidth={1.75} />
          </span>
        ),
      }
    }
    case 'document':
      return {
        title: option.document.title,
        detail: [option.products.map((p) => p.name).join(', '), option.document.type]
          .filter(Boolean)
          .join(' · '),
        visual: (
          <span className={iconBox}>
            <FileText className="size-5" strokeWidth={1.75} />
          </span>
        ),
      }
  }
}
