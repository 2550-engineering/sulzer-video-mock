import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useAuth } from '../../auth/useAuth'
import { priceCopy } from '../../data/pricing'
import { sparePartsTab } from '../../data/sparePartsPage'
import { kitsOf, sortBom, type BomSort, type BomSortKey } from '../../lib/bom'
import { formatPartPrice } from '../../lib/modelSpecs'
import { priceFor } from '../../lib/pricing'
import type { ServiceKit, SparePart } from '../../types'
import { StockIndicator } from '../variant/StockIndicator'
import { PartPrice } from './PartPrice'

const copy = sparePartsTab.bom

type BomTableProps = {
  parts: SparePart[]
  kits: ServiceKit[]
  selectedPartId: string | null
  selectedKitId: string | null
  /** Filters the rows by name, position or part number. */
  query: string
  onSelectPart: (partId: string) => void
  /** Bumped when the selection came from elsewhere (the drawing): scroll to its row. */
  reveal: number
}

const head =
  'sticky top-0 z-10 border-b border-border bg-surface-sunken px-3 py-2.5 text-left font-semibold whitespace-nowrap'
const cell = 'border-b border-border px-3 py-2 align-top'

/**
 * Bill of material: every position with part number, quantity, material,
 * service sets and (signed in) price and lead time. Sortable by column; a
 * row selects the part, like the tree.
 */
export function BomTable({
  parts,
  kits,
  selectedPartId,
  selectedKitId,
  query,
  onSelectPart,
  reveal,
}: BomTableProps) {
  const { user } = useAuth()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [sort, setSort] = useState<BomSort>({ key: 'position', direction: 'asc' })

  const q = query.trim().toLowerCase()
  const shown = sortBom(
    parts.filter(
      (part) =>
        !q ||
        part.name.toLowerCase().includes(q) ||
        part.position.includes(q) ||
        part.partNumber.includes(q),
    ),
    sort,
  )
  const kit = kits.find((k) => k.id === selectedKitId)

  useEffect(() => {
    if (reveal === 0) return
    const container = scrollRef.current
    const row = container?.querySelector<HTMLElement>('[data-anchor]')
    if (!container || !row) return
    const box = container.getBoundingClientRect()
    const r = row.getBoundingClientRect()
    // Under the sticky header row counts as hidden.
    if (r.top >= box.top + 44 && r.bottom <= box.bottom - 8) return
    container.scrollTo({
      top: container.scrollTop + r.top - box.top - box.height / 3,
      behavior: 'smooth',
    })
  }, [reveal])

  function sortButton(key: BomSortKey, label: string, align: 'left' | 'right' = 'left') {
    const active = sort.key === key
    const Icon = !active ? ArrowUpDown : sort.direction === 'asc' ? ArrowUp : ArrowDown
    return (
      <th
        scope="col"
        aria-sort={active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
        className={`${head} ${align === 'right' ? 'text-right' : ''}`}
      >
        <button
          type="button"
          onClick={() =>
            setSort({
              key,
              direction: active && sort.direction === 'asc' ? 'desc' : 'asc',
            })
          }
          aria-label={copy.sortBy(label)}
          className={`inline-flex items-center gap-1 transition-colors hover:text-primary ${active ? 'text-primary' : ''}`}
        >
          {label}
          <Icon className={`size-3.5 ${active ? '' : 'text-text-subtle'}`} />
        </button>
      </th>
    )
  }

  function handleKey(event: KeyboardEvent<HTMLTableRowElement>, partId: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelectPart(partId)
    }
  }

  const c = copy.columns
  return (
    <div
      ref={scrollRef}
      className="min-h-0 flex-1 overflow-auto overscroll-contain max-md:overflow-visible"
    >
      <p className="px-5 pt-3 pb-2 text-xs text-text-muted" aria-live="polite">
        {copy.count(shown.length, parts.length)}
      </p>
      <table className="table-cards w-full min-w-[40rem] border-separate border-spacing-0 text-[13px]">
        <thead className="text-navy-900">
          <tr>
            {sortButton('position', c.position)}
            {sortButton('name', c.name)}
            {sortButton('partNumber', c.partNumber)}
            {sortButton('quantity', c.quantity, 'right')}
            {sortButton('material', c.material)}
            <th scope="col" className={head}>
              {c.kits}
            </th>
            {user &&
              sortButton(
                'price',
                priceFor(1, user)!.discount > 0 ? priceCopy.netPrice : c.price,
                'right',
              )}
            {user && sortButton('leadTime', c.leadTime)}
          </tr>
        </thead>
        <tbody>
          {shown.map((part) => {
            const selected = part.id === selectedPartId
            const inKit = kit?.items.some((item) => item.partId === part.id)
            return (
              <tr
                key={part.id}
                data-anchor={selected || undefined}
                tabIndex={0}
                aria-selected={selected}
                onClick={() => onSelectPart(part.id)}
                onKeyDown={(event) => handleKey(event, part.id)}
                className={`cursor-pointer transition-colors duration-150 outline-none focus-visible:bg-primary-tint ${
                  selected
                    ? 'bg-primary-tint shadow-[inset_3px_0_0_var(--sz-color-primary)]'
                    : inKit
                      ? 'bg-primary-tint/50'
                      : 'hover:bg-surface-subtle'
                }`}
              >
                <td
                  className={`${cell} font-semibold tabular-nums ${selected ? 'text-primary' : 'text-text-muted'}`}
                >
                  {part.position}
                </td>
                <td className={`${cell} font-medium text-navy-900`}>{part.name}</td>
                <td className={`${cell} whitespace-nowrap tabular-nums`}>{part.partNumber}</td>
                <td className={`${cell} text-right tabular-nums`}>{part.quantity}</td>
                <td className={`${cell} text-text-muted`}>{part.material}</td>
                <td className={cell}>
                  <span className="flex flex-wrap gap-1">
                    {kitsOf(part, kits).map((label) => (
                      <span
                        key={label}
                        className="rounded-pill bg-primary-tint px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-primary"
                      >
                        {label}
                      </span>
                    ))}
                  </span>
                </td>
                {user && (
                  <td
                    className={`${cell} text-right font-semibold whitespace-nowrap text-navy-900 tabular-nums`}
                  >
                    {priceFor(part.listPrice, user)!.discount > 0 ? (
                      <PartPrice
                        price={priceFor(part.listPrice, user)!}
                        format={formatPartPrice}
                        compact
                      />
                    ) : (
                      formatPartPrice(part.listPrice)
                    )}
                  </td>
                )}
                {user && (
                  <td className={`${cell} whitespace-nowrap`}>
                    <StockIndicator status={part.availability.status} />
                    <span className="block text-text-muted">{part.availability.leadTime}</span>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
