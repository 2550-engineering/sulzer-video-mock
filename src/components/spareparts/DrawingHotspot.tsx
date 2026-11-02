import { bom as copy } from '../../data/eshop'
import type { DrawingHotspot as Hotspot } from '../../types'

type DrawingHotspotProps = {
  hotspot: Hotspot
  /** Selected: filled, with a soft pulse. */
  active: boolean
  /** Hovered here or on its row in the parts list. */
  highlighted: boolean
  /** Another position is selected: this one steps back a little. */
  dimmed: boolean
  onSelect: () => void
  onHover: (hovering: boolean) => void
}

/** Numbered marker on the sectional drawing, centred on its part. */
export function DrawingHotspot({
  hotspot,
  active,
  highlighted,
  dimmed,
  onSelect,
  onHover,
}: DrawingHotspotProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      aria-pressed={active}
      aria-label={copy.drawing.hotspot(hotspot.position)}
      data-position={hotspot.position}
      className={`group absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-pill transition-[opacity,scale] duration-200 ease-sz ${
        active ? 'z-20 scale-110' : highlighted ? 'z-20 scale-105' : dimmed ? 'opacity-80' : ''
      }`}
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
    >
      {active && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-pill bg-primary/40 motion-safe:animate-ping"
        />
      )}
      <span
        className={`relative flex h-7 min-w-11 items-center justify-center rounded-pill px-2 text-xs font-bold tabular-nums shadow-[0_2px_8px_rgba(12,28,46,0.25)] ring-2 transition-colors duration-150 ${
          active
            ? 'bg-primary text-white ring-white'
            : highlighted
              ? 'bg-primary-tint text-primary ring-primary'
              : 'bg-white text-primary ring-primary/70 group-hover:bg-primary-tint group-hover:ring-primary'
        }`}
      >
        {hotspot.position}
      </span>
    </button>
  )
}
