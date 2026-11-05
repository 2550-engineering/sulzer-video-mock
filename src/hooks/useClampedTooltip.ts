import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { belowDesktop, useMediaQuery } from './useMediaQuery'

const gap = 12
const edge = 8

/**
 * Below 1280px: a position for a chart tooltip that keeps it fully inside its
 * container. Right of and above the point by default; flipped to the left near
 * the right edge and below the point near the top; otherwise clamped 8px from
 * the edges. Returns null on desktop (and before the first measurement), so the
 * chart keeps its own tooltip style there. Attach the returned ref to the tooltip.
 */
export function useClampedTooltip(
  container: { current: HTMLElement | null },
  anchor: { x: number; y: number } | null,
) {
  const ref = useRef<HTMLDivElement>(null)
  const active = useMediaQuery(belowDesktop)
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null)

  const anchorX = anchor?.x
  const anchorY = anchor?.y
  useLayoutEffect(() => {
    const tooltip = ref.current
    const box = container.current
    if (!active || anchorX === undefined || anchorY === undefined || !tooltip || !box) return
    const w = tooltip.offsetWidth
    const h = tooltip.offsetHeight
    const maxLeft = Math.max(edge, box.clientWidth - w - edge)
    const maxTop = Math.max(edge, box.clientHeight - h - edge)
    let left = anchorX + gap
    if (left + w > box.clientWidth - edge) left = anchorX - gap - w
    let top = anchorY - gap - h
    if (top < edge) top = anchorY + gap
    const next = {
      left: Math.round(Math.min(Math.max(left, edge), maxLeft)),
      top: Math.round(Math.min(Math.max(top, edge), maxTop)),
    }
    setPosition((current) =>
      current?.left === next.left && current.top === next.top ? current : next,
    )
  }, [active, anchorX, anchorY, container])

  const style: CSSProperties | null =
    active && anchor && position
      ? { left: position.left, top: position.top, right: 'auto', bottom: 'auto', transform: 'none' }
      : null
  return [ref, style] as const
}
