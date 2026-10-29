import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { Link } from 'react-router'
import { sizingResultsPage as copy } from '../../data/sizingPages'
import { groupThousands } from '../../lib/format'
import { formatPrice } from '../../lib/modelSpecs'
import type { SizingSort, SizingSortKey } from '../../lib/sizingFilters'
import type { DutyPoint, SizingResult } from '../../types'
import { AvailabilityBadge } from '../product/AvailabilityBadge'
import { CurveThumbnail } from './CurveThumbnail'
import { KeyFiguresPopover } from './KeyFiguresPopover'

type SizingResultsTableProps = {
  rows: SizingResult[]
  duty: DutyPoint
  signedIn: boolean
  sort: SizingSort
  onSort: (key: SizingSortKey) => void
  selectedIds: string[]
  onToggle: (id: string) => void
  onOpen: (result: SizingResult) => void
}

const cell = 'border-b border-border px-4 py-3'
const head = 'sticky top-0 z-10 border-b border-border bg-surface-sunken px-4 py-3 font-semibold'
/** The checkbox and curve columns stay put while the extra columns scroll sideways. */
const stickyLeft = ['left-0 w-12', 'left-12 w-[7.5rem]']

/**
 * Sizing results table: checkbox, curve thumbnail, product no., system, key
 * figures, name, life cycle cost, then efficiency, P2, NPSHr and, signed in,
 * price and lead time. Scrolls inside its own box, with a sticky header and
 * sticky first columns.
 */
export function SizingResultsTable({
  rows,
  duty,
  signedIn,
  sort,
  onSort,
  selectedIds,
  onToggle,
  onOpen,
}: SizingResultsTableProps) {
  const sortHeader = (key: SizingSortKey, label: string, unit?: string) => {
    const active = sort.key === key
    const Icon = !active ? ArrowUpDown : sort.direction === 'asc' ? ArrowUp : ArrowDown
    return (
      <th
        scope="col"
        aria-sort={active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
        className={`${head} text-right`}
      >
        <button
          type="button"
          onClick={() => onSort(key)}
          className={`group ml-auto inline-flex flex-row-reverse items-center gap-1.5 transition-colors hover:text-primary ${
            active ? 'text-primary' : ''
          }`}
        >
          <span className="text-right whitespace-nowrap">
            {label}
            {unit && <span className="block text-xs font-normal text-text-muted">[{unit}]</span>}
          </span>
          <Icon
            aria-hidden
            className={`size-3.5 shrink-0 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`}
          />
        </button>
      </th>
    )
  }

  return (
    <div className="max-h-[calc(100vh-var(--sz-header-height)-7rem)] overflow-auto rounded-b-lg border border-border bg-white">
      <table className="w-full min-w-[68rem] border-separate border-spacing-0 text-left text-[15px]">
        <thead className="text-sm text-navy-900">
          <tr>
            <th scope="col" className={`${head} ${stickyLeft[0]} z-20`}>
              <span className="sr-only">{copy.toolbar.selectAll}</span>
            </th>
            <th scope="col" className={`${head} ${stickyLeft[1]} z-20`}>
              {copy.columns.curve}
            </th>
            <th scope="col" className={head}>
              {copy.columns.productNumber}
            </th>
            <th scope="col" className={`${head} text-center`}>
              {copy.columns.system}
            </th>
            <th scope="col" className={head}>
              <span className="sr-only">{copy.columns.info}</span>
            </th>
            <th scope="col" className={head}>
              {copy.columns.name}
            </th>
            {sortHeader('lcc', copy.columns.lcc, copy.columns.lccUnit)}
            {sortHeader('efficiency', copy.columns.efficiency, '%')}
            {sortHeader('p2', copy.columns.p2, 'kW')}
            {sortHeader('npshr', copy.columns.npshr, 'm')}
            {signedIn && sortHeader('price', copy.columns.price, 'EUR')}
            {signedIn && sortHeader('lead', copy.columns.leadTime)}
          </tr>
        </thead>
        <tbody>
          {rows.map((result, index) => {
            const { variant } = result
            const checked = selectedIds.includes(variant.id)
            const tone = checked
              ? 'bg-primary-tint'
              : index % 2 === 1
                ? 'bg-surface-subtle hover:bg-primary-tint/60'
                : 'bg-white hover:bg-primary-tint/60'
            return (
              <tr key={variant.id} className={`transition-colors duration-150 ${tone}`}>
                {/* Sticky cells need an opaque background: they take the row's. */}
                <td className={`${cell} sticky ${stickyLeft[0]} z-[5] bg-inherit`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(variant.id)}
                    aria-label={copy.columns.select(variant.name)}
                    className="size-[18px] cursor-pointer accent-primary"
                  />
                </td>
                <td className={`${cell} sticky ${stickyLeft[1]} z-[5] bg-inherit py-2`}>
                  <button
                    type="button"
                    onClick={() => onOpen(result)}
                    aria-label={copy.openCurve(variant.name)}
                    className="block rounded-sm transition-shadow hover:shadow-[0_0_0_2px_var(--sz-color-primary)]"
                  >
                    <CurveThumbnail result={result} duty={duty} />
                  </button>
                </td>
                <td className={`${cell} whitespace-nowrap`}>
                  {variant.productNumber ? (
                    <Link
                      to={`/products/${variant.productId}#models`}
                      className="font-semibold text-primary tabular-nums underline-offset-4 hover:underline"
                    >
                      {variant.productNumber}
                    </Link>
                  ) : (
                    <Link
                      to={copy.quoteLink(variant.id)}
                      className="font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      {copy.onRequest}
                    </Link>
                  )}
                </td>
                <td className={`${cell} text-center text-text-muted`} title={copy.systemHint}>
                  {copy.systemValue}
                </td>
                <td className={`${cell} px-1`}>
                  <KeyFiguresPopover result={result} />
                </td>
                <td className={cell}>
                  <button
                    type="button"
                    onClick={() => onOpen(result)}
                    className="text-left font-semibold whitespace-nowrap text-navy-900 underline-offset-4 transition-colors hover:text-primary hover:underline"
                  >
                    {variant.name}
                  </button>
                </td>
                <td className={`${cell} text-right font-semibold text-navy-900 tabular-nums`}>
                  {groupThousands(result.lifeCycleCost)}
                </td>
                <td className={`${cell} text-right tabular-nums`}>
                  {result.efficiency.toFixed(1)}
                </td>
                <td className={`${cell} text-right tabular-nums`}>{result.p2.toFixed(1)}</td>
                <td className={`${cell} text-right tabular-nums`}>{result.npshr.toFixed(1)}</td>
                {signedIn && (
                  <td className={`${cell} text-right tabular-nums`}>
                    {formatPrice(result.purchasePrice)}
                  </td>
                )}
                {signedIn && (
                  <td className={`${cell} text-right`}>
                    <AvailabilityBadge model={variant} />
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
