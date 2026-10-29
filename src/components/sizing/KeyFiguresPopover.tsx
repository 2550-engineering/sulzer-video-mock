import { Info } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { sizingResultsPage as copy } from '../../data/sizingPages'
import type { SizingResult } from '../../types'
import { KeyFigures } from './KeyFigures'

const tooltipWidth = 300
const tooltipHeight = 190

/**
 * Info icon that shows the key figures on hover or focus. The tooltip is
 * rendered in <body> at a fixed position, so the table's scroll box can't
 * clip it; it opens above the icon when there is no room below.
 */
export function KeyFiguresPopover({ result }: { result: SizingResult }) {
  const [anchor, setAnchor] = useState<DOMRect | null>(null)
  const show = (el: HTMLElement) => setAnchor(el.getBoundingClientRect())
  const hide = () => setAnchor(null)

  const below = anchor && anchor.bottom + 8 + tooltipHeight < window.innerHeight
  const style = anchor && {
    width: tooltipWidth,
    left: Math.min(anchor.left - 16, window.innerWidth - tooltipWidth - 16),
    top: below ? anchor.bottom + 8 : anchor.top - 8 - tooltipHeight,
  }

  return (
    <>
      <button
        type="button"
        aria-label={`${copy.columns.info}: ${result.variant.name}`}
        onMouseEnter={(e) => show(e.currentTarget)}
        onMouseLeave={hide}
        onFocus={(e) => show(e.currentTarget)}
        onBlur={hide}
        className="flex size-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-primary-tint hover:text-primary"
      >
        <Info className="size-[18px]" strokeWidth={1.75} />
      </button>
      {anchor &&
        style &&
        createPortal(
          <div
            role="tooltip"
            style={style}
            className="pointer-events-none fixed z-[80] animate-fade-in rounded-md bg-navy-900 px-4 py-3 shadow-raised"
          >
            <p className="mb-2 text-xs font-semibold tracking-wide text-primary-on-dark uppercase">
              {copy.keyFigures.title}
            </p>
            <KeyFigures result={result} compact />
          </div>,
          document.body,
        )}
    </>
  )
}
