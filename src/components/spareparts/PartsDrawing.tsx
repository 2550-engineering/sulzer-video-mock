import { Download, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { bom as copy } from '../../data/eshop'
import type { SectionalDrawing } from '../../types'
import { SmartImage } from '../SmartImage'
import { DrawingHotspot } from './DrawingHotspot'
import { XfpSectionDrawing } from './XfpSectionDrawing'

type PartsDrawingProps = {
  drawing: SectionalDrawing
  /** Positions in the current parts list: only these get a hotspot. */
  positions: Set<number>
  active: number | null
  hovered: number | null
  onSelect: (position: number | null) => void
  onHover: (position: number | null) => void
  /** What is selected, under the drawing. Without it, the hint and the PDF download. */
  selection?: ReactNode
  onDownload: () => void
}

/** Width / height of an aspect like "845 / 929". */
const ratio = (aspect: string) => {
  const [w, h] = aspect.split('/').map(Number)
  return w / h
}

/**
 * The sectional drawing with a numbered hotspot per part. Sticks beside the parts list
 * and shrinks to fit the window, so every hotspot stays in view while the list scrolls.
 */
export function PartsDrawing({
  drawing,
  positions,
  active,
  hovered,
  onSelect,
  onHover,
  selection,
  onDownload,
}: PartsDrawingProps) {
  const hotspots = drawing.hotspots.filter((h) => positions.has(h.position))

  return (
    <figure className="overflow-hidden rounded-lg border border-border bg-linear-to-b from-white to-surface-muted">
      <figcaption className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
        <span className="text-sm font-semibold tracking-[0.08em] text-text-muted uppercase">
          {copy.drawing.label}
        </span>
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex h-8 items-center gap-1.5 rounded-pill px-3 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint"
        >
          <Download className="size-4" />
          {copy.drawing.download}
        </button>
      </figcaption>

      <div className="px-6 py-6">
        <div
          className="relative mx-auto"
          style={{
            aspectRatio: drawing.aspect,
            // Fit the window height under the sticky header, tab bar and caption.
            width: `min(100%, calc((100svh - var(--sz-header-height) - 260px) * ${ratio(drawing.aspect)}))`,
          }}
        >
          {drawing.kind === 'image' ? (
            <SmartImage src={drawing.image.src} alt={drawing.image.alt} fit="contain" />
          ) : (
            <XfpSectionDrawing title={drawing.title} />
          )}
          {hotspots.map((hotspot) => (
            <DrawingHotspot
              key={hotspot.position}
              hotspot={hotspot}
              active={active === hotspot.position}
              highlighted={hovered === hotspot.position}
              dimmed={active !== null && active !== hotspot.position}
              onSelect={() => onSelect(active === hotspot.position ? null : hotspot.position)}
              onHover={(hovering) => onHover(hovering ? hotspot.position : null)}
            />
          ))}
        </div>
      </div>

      <div className="flex min-h-14 items-center gap-3 border-t border-border bg-white px-5 py-3 text-[15px]">
        {selection ? (
          <>
            <div className="min-w-0 flex-1 animate-fade-in">{selection}</div>
            <button
              type="button"
              onClick={() => onSelect(null)}
              aria-label={copy.drawing.clear}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-muted hover:text-navy-900"
            >
              <X className="size-4" />
            </button>
          </>
        ) : (
          <p className="text-text-muted">{copy.drawing.hint}</p>
        )}
      </div>
    </figure>
  )
}
