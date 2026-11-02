import type { CSSProperties, FocusEvent, KeyboardEvent, PointerEvent } from 'react'
import { hotspotBounds } from '../../lib/drawing'
import type { DrawingHotspot } from '../../types'
import { DrawingShapes } from './DrawingShapes'

export type PartState = 'idle' | 'hover' | 'selected' | 'dimmed'

const styles: Record<PartState, CSSProperties> = {
  idle: { '--pf': '#fff', '--ps': 'var(--sz-color-text)', '--sw': '1.25' } as CSSProperties,
  dimmed: { '--pf': '#fff', '--ps': 'var(--sz-color-text)', '--sw': '1.25' } as CSSProperties,
  hover: {
    '--pf': 'var(--sz-color-primary-tint)',
    '--ps': 'var(--sz-color-primary)',
    '--sw': '1.75',
  } as CSSProperties,
  selected: {
    '--pf': 'var(--sz-color-primary-tint-strong)',
    '--ps': 'var(--sz-color-primary)',
    '--sw': '2.25',
  } as CSSProperties,
}

type DrawingPartProps = {
  hotspot: DrawingHotspot
  /** Position number in the callout circle. */
  position: string
  /** Callout circle radius, in drawing units. */
  radius: number
  /** "501 Impeller", for the tooltip and screen readers. */
  label: string
  state: PartState
  onSelect: () => void
  /** Pointer or keyboard focus entered (with the element, to place the tooltip) or left. */
  onHover: (target: SVGGElement | null) => void
}

/** One part of the drawing: a generous hit area, its outlines and its position callout. */
export function DrawingPart({
  hotspot,
  position,
  radius: r,
  label,
  state,
  onSelect,
  onHover,
}: DrawingPartProps) {
  const bounds = hotspotBounds(hotspot)
  const [fx, fy] = hotspot.callout.from
  const [tx, ty] = hotspot.callout.to
  const active = state === 'selected' || state === 'hover'
  // The leader stops at the circle's edge.
  const angle = Math.atan2(fy - ty, fx - tx)

  function handleKey(event: KeyboardEvent<SVGGElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect()
    }
  }

  return (
    <g
      data-part={hotspot.id}
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={state === 'selected'}
      style={styles[state]}
      onClick={onSelect}
      onKeyDown={handleKey}
      onPointerEnter={(event: PointerEvent<SVGGElement>) => onHover(event.currentTarget)}
      onPointerLeave={() => onHover(null)}
      onFocus={(event: FocusEvent<SVGGElement>) => onHover(event.currentTarget)}
      onBlur={() => onHover(null)}
      className={`cursor-pointer transition-opacity duration-200 outline-none ${state === 'dimmed' ? 'opacity-30' : 'opacity-100'}`}
    >
      <rect
        x={bounds.x - 6}
        y={bounds.y - 6}
        width={bounds.w + 12}
        height={bounds.h + 12}
        fill="transparent"
      />
      <DrawingShapes shapes={hotspot.shapes} />

      <line
        x1={fx}
        y1={fy}
        x2={tx + Math.cos(angle) * r}
        y2={ty + Math.sin(angle) * r}
        className="stroke-(--ps) transition-[stroke] duration-150"
        strokeWidth={0.9}
      />
      <circle cx={fx} cy={fy} r={1.8} className="fill-(--ps) transition-[fill] duration-150" />
      <circle
        cx={tx}
        cy={ty}
        r={r}
        strokeWidth={state === 'selected' ? 0 : 1.1}
        className={`transition-[fill,stroke] duration-150 ${
          state === 'selected'
            ? 'fill-primary'
            : active
              ? 'fill-primary-tint stroke-primary'
              : 'fill-white stroke-text'
        }`}
      />
      <text
        x={tx}
        y={ty}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={r * (position.length > 3 ? 0.62 : 0.82)}
        fontWeight={700}
        className={`transition-[fill] duration-150 select-none ${
          state === 'selected' ? 'fill-white' : active ? 'fill-primary' : 'fill-text'
        }`}
      >
        {position}
      </text>
    </g>
  )
}
