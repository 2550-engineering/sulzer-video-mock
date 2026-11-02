import { Search, SearchX, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../auth/useAuth'
import { useAddToCart } from '../../cart/useAddToCart'
import { bom as copy } from '../../data/eshop'
import { sparePartGroups } from '../../data/spareParts'
import { partPrice } from '../../lib/pricing'
import { atPosition, bomFor, drawingFor } from '../../lib/spareParts'
import { useToast } from '../../toast/useToast'
import type { Asset, ProductModel, SparePart } from '../../types'
import { ChipGroup } from '../ChipGroup'
import { TabComingSoon } from '../TabComingSoon'
import { BomTable } from './BomTable'
import { PartsDrawing } from './PartsDrawing'

type SparePartsExplorerProps = {
  model: ProductModel
  /** The installed unit the list is for: cart lines remember it. */
  asset?: Asset
  /** Drawing position selected on arrival, e.g. the part an alert calls for. */
  initialPosition?: number
}

function matches(part: SparePart, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const number = q.replace(/\s+/g, '')
  return part.partNumber.includes(number) || part.name.toLowerCase().includes(q)
}

/**
 * Sectional drawing and parts list side by side, for one model. Hovering or selecting a
 * number on the drawing lights up its rows (and the kits that hold the part), and the
 * other way round. Filter by group, search by part number or name, and (signed in) see
 * your price and add to the cart. Product page, asset page and /spare-parts all use it.
 */
export function SparePartsExplorer({ model, asset, initialPosition }: SparePartsExplorerProps) {
  const { user, signIn } = useAuth()
  const addToCart = useAddToCart()
  const showToast = useToast()
  const [groups, setGroups] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [active, setActive] = useState<number | null>(initialPosition ?? null)
  const [hovered, setHovered] = useState<number | null>(null)
  // A position picked on the drawing narrows the list to its parts and kits.
  const [pinned, setPinned] = useState(false)
  // Bumped when the drawing selects a position, so the list scrolls to it.
  const [scrollRequest, setScrollRequest] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scrollRequest) return
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [scrollRequest])

  const parts = bomFor(model.id)
  const drawing = drawingFor(model.productId)
  if (parts.length === 0 || !drawing) return <TabComingSoon copy={copy.noParts} />

  const shown =
    pinned && active !== null
      ? parts.filter((part) => atPosition(part, active))
      : parts.filter(
          (part) => (groups.length === 0 || groups.includes(part.group)) && matches(part, query),
        )
  const groupOptions = sparePartGroups
    .map((group) => ({
      value: group,
      label: group,
      count: parts.filter((part) => part.group === group).length,
    }))
    .filter((option) => option.count > 0)

  function selectFromDrawing(position: number | null) {
    setActive(position)
    setPinned(position !== null)
    if (position === null) return
    setGroups([])
    setQuery('')
    setScrollRequest((n) => n + 1)
  }

  const main =
    active === null
      ? undefined
      : (parts.find((part) => part.position === active && !part.contains) ??
        parts.find((part) => atPosition(part, active)))

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="lg:sticky lg:top-[calc(var(--sz-header-height)+89px)]">
        <PartsDrawing
          drawing={drawing}
          positions={new Set(parts.flatMap((part) => part.position ?? []))}
          active={active}
          hovered={hovered}
          onSelect={selectFromDrawing}
          onHover={setHovered}
          onDownload={() =>
            showToast({ message: copy.drawing.downloaded(model.name), detail: 'PDF · 1.4 MB' })
          }
          selection={
            main && (
              <p className="truncate">
                <span className="font-bold text-primary tabular-nums">
                  {copy.drawing.selected(active!)}
                </span>
                <span className="mx-2 text-text-subtle">·</span>
                <span className="font-semibold text-navy-900">{main.name}</span>
              </p>
            )
          }
        />
      </div>

      <div ref={listRef} className="min-w-0 scroll-mt-[calc(var(--sz-header-height)+89px)]">
        <ChipGroup
          label={copy.groups}
          allLabel={copy.allGroups}
          options={groupOptions}
          // While pinned to a position, no group chip (not even "All parts") is on.
          selected={pinned ? [''] : groups}
          onToggle={(group) => {
            setPinned(false)
            setGroups((current) =>
              current.includes(group) ? current.filter((g) => g !== group) : [...current, group],
            )
          }}
          onClear={() => {
            setPinned(false)
            setGroups([])
          }}
        />

        <div className="mt-5 mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="relative w-full max-w-sm">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-text-subtle"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setPinned(false)
                setQuery(e.target.value)
              }}
              placeholder={copy.search}
              aria-label={copy.search}
              className="h-11 w-full rounded-pill border border-border-strong bg-white pr-4 pl-10 text-[15px] text-text transition-[border-color,box-shadow] placeholder:text-text-subtle focus:border-primary focus:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            {pinned && active !== null && (
              <button
                type="button"
                onClick={() => setPinned(false)}
                aria-label={copy.drawing.showAll(active)}
                className="inline-flex h-9 animate-fade-in items-center gap-2 rounded-pill bg-primary pr-3 pl-4 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                {copy.drawing.selected(active)}
                <X className="size-4" />
              </button>
            )}
            <p className="text-sm font-semibold text-navy-900 tabular-nums" aria-live="polite">
              {copy.count(shown.length, parts.length)}
            </p>
          </div>
        </div>

        {shown.length > 0 ? (
          <BomTable
            parts={shown}
            priceOf={(part) => partPrice(part, user)}
            signedIn={user !== null}
            onSignIn={() => signIn()}
            active={active}
            hovered={hovered}
            onHover={setHovered}
            onSelect={(position) => {
              setPinned(false)
              setActive(active === position ? null : position)
            }}
            onAdd={(part, quantity) => addToCart(part, quantity, asset?.id)}
            grouped={pinned || groups.length !== 1}
          />
        ) : (
          <div className="flex animate-fade-in flex-col items-center rounded-lg border border-border bg-white px-8 py-14 text-center">
            <SearchX aria-hidden className="size-10 text-text-subtle" strokeWidth={1.5} />
            <p className="mt-4 text-lg font-semibold text-navy-900">{copy.noResults.title}</p>
            <p className="mt-1 text-text-muted">{copy.noResults.text}</p>
            <button
              type="button"
              onClick={() => {
                setGroups([])
                setQuery('')
              }}
              className="mt-6 inline-flex h-10 items-center rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              {copy.noResults.action}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
