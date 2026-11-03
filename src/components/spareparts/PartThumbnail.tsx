import type { CSSProperties } from 'react'
import { hotspotBounds } from '../../lib/drawing'
import type { DrawingHotspot } from '../../types'
import { DrawingShapes } from './DrawingShapes'

const style = {
  '--pf': 'var(--sz-color-primary-tint)',
  '--ps': 'var(--sz-color-navy-900)',
  '--sw': '1.25',
} as CSSProperties

/** The part's own outlines, cut from the drawing and scaled to fit a square. */
export function PartThumbnail({
  hotspot,
  className = 'size-24',
}: {
  hotspot: DrawingHotspot
  className?: string
}) {
  const b = hotspotBounds(hotspot)
  const side = Math.max(b.w, b.h) * 1.25
  const x = b.x + b.w / 2 - side / 2
  const y = b.y + b.h / 2 - side / 2
  return (
    <svg
      viewBox={`${x} ${y} ${side} ${side}`}
      aria-hidden
      style={style}
      className={`shrink-0 rounded-md border border-border bg-white ${className}`}
    >
      <DrawingShapes shapes={hotspot.shapes} />
    </svg>
  )
}
