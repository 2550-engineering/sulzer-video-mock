import { ArrowRight, ChevronLeft, ChevronRight, Package } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router'
import { variantPage } from '../../data/variantPages'
import { getDrawing } from '../../lib/catalog'
import type { DrawingHotspot, SparePartCatalogue } from '../../types'
import { PartThumbnail } from '../spareparts/PartThumbnail'

const copy = variantPage.recommended

type Card = {
  key: string
  name: string
  number: string
  hotspot: DrawingHotspot | undefined
  query: Record<string, string>
}

type RecommendedPartsProps = {
  catalogue: SparePartCatalogue
  /** Link to the Spare parts tab with a part (?part=) or kit (?kit=) selected. */
  partLink: (query: Record<string, string>) => string
  /** Called when a link is followed, e.g. to scroll the tab bar into view. */
  onOpen: () => void
}

/**
 * "Recommended spare parts": a row of square cards (picture cut from the
 * exploded drawing, name, part number) with arrows. A card opens the Spare
 * parts tab with that part or kit selected on the drawing.
 */
export function RecommendedParts({ catalogue, partLink, onOpen }: RecommendedPartsProps) {
  const rowRef = useRef<HTMLUListElement>(null)
  const drawing = getDrawing(catalogue.drawingId)
  const hotspot = (partId: string | undefined) => {
    const part = catalogue.parts.find((p) => p.id === partId)
    return part && drawing?.hotspots.find((h) => h.id === part.hotspot)
  }
  const cards = catalogue.featured.flatMap((ref): Card[] => {
    if (ref.kind === 'part') {
      const part = catalogue.parts.find((p) => p.id === ref.id)
      return part
        ? [
            {
              key: part.id,
              name: part.name.split(',')[0],
              number: part.partNumber,
              hotspot: hotspot(part.id),
              query: { part: part.id },
            },
          ]
        : []
    }
    const kit = catalogue.kits.find((k) => k.id === ref.id)
    return kit
      ? [
          {
            key: kit.id,
            name: kit.name,
            number: kit.partNumber,
            hotspot: hotspot(kit.items[0]?.partId),
            query: { kit: kit.id },
          },
        ]
      : []
  })
  if (cards.length === 0) return null

  const scroll = (direction: 1 | -1) =>
    rowRef.current?.scrollBy({
      left: direction * rowRef.current.clientWidth * 0.8,
      behavior: 'smooth',
    })
  const arrow =
    'flex size-10 items-center justify-center rounded-full border border-border bg-white text-primary shadow-card transition-colors hover:border-primary'

  return (
    <section className="border-t border-border bg-white">
      <div className="site-container py-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight text-brand">{copy.title}</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label={copy.previous}
              className={arrow}
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label={copy.next}
              className={arrow}
            >
              <ChevronRight className="size-5" />
            </button>
            <Link
              to={partLink({})}
              onClick={onOpen}
              aria-label={copy.all}
              title={copy.all}
              className="ml-2 flex size-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary-tint"
            >
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>

        <ul
          ref={rowRef}
          className="mt-6 flex snap-x snap-mandatory [scrollbar-width:none] gap-5 overflow-x-auto scroll-smooth pb-2"
        >
          {cards.map((card) => (
            <li key={card.key} className="w-56 shrink-0 snap-start">
              <Link
                to={partLink(card.query)}
                onClick={onOpen}
                aria-label={copy.open(card.name)}
                className="group flex aspect-square flex-col items-center justify-between rounded-md border border-border bg-white px-4 pt-5 pb-4 text-center transition-[border-color,box-shadow] duration-200 hover:border-primary hover:shadow-card"
              >
                <span className="block text-lg leading-tight font-bold text-navy-900">
                  {card.name}
                </span>
                <span className="block text-sm font-semibold text-primary tabular-nums group-hover:underline">
                  {card.number}
                </span>
                {card.hotspot ? (
                  <PartThumbnail hotspot={card.hotspot} className="size-24 border-0" />
                ) : (
                  <span className="flex size-24 items-center justify-center rounded-md bg-surface-muted text-text-subtle">
                    <Package className="size-10" strokeWidth={1.25} />
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
