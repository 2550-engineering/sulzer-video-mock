import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, Lock } from 'lucide-react'
import { Fragment, type ReactNode } from 'react'
import { productPage } from '../../data/catalogPages'
import { formatPrice, type ModelSort, type ModelSortKey } from '../../lib/modelSpecs'
import type { ProductModel } from '../../types'
import { AvailabilityBadge } from './AvailabilityBadge'

const copy = productPage.models

type Column = {
  key: ModelSortKey
  label: string
  unit?: string
  numeric: boolean
  /** Signed-in users only. */
  priced?: boolean
  render: (model: ProductModel) => ReactNode
}

const columns: Column[] = [
  { key: 'name', label: copy.columns.name, numeric: false, render: (m) => m.name },
  {
    key: 'productNumber',
    label: copy.columns.productNumber,
    numeric: false,
    render: (m) => m.productNumber,
  },
  {
    key: 'flow',
    label: copy.columns.flow,
    unit: copy.units.flow,
    numeric: true,
    render: (m) => m.flow,
  },
  {
    key: 'head',
    label: copy.columns.head,
    unit: copy.units.head,
    numeric: true,
    render: (m) => m.head,
  },
  {
    key: 'power',
    label: copy.columns.power,
    unit: copy.units.power,
    numeric: true,
    render: (m) => m.power,
  },
  {
    key: 'speed',
    label: copy.columns.speed,
    unit: copy.units.speed,
    numeric: true,
    render: (m) => m.speed,
  },
  {
    key: 'listPrice',
    label: copy.columns.listPrice,
    numeric: true,
    priced: true,
    render: (m) => formatPrice(m.listPrice),
  },
  {
    key: 'availability',
    label: copy.columns.availability,
    numeric: false,
    priced: true,
    render: (m) => <AvailabilityBadge model={m} />,
  },
]

type ModelsTableProps = {
  models: ProductModel[]
  signedIn: boolean
  onSignIn: () => void
  sort: ModelSort | null
  onSort: (key: ModelSortKey) => void
  expandedId: string | null
  onToggleExpand: (id: string) => void
  compareIds: string[]
  onToggleCompare: (id: string) => void
  /** The expanded row's panel. */
  detail: (model: ProductModel) => ReactNode
}

/** The header sticks under the site header and the product tab bar (h-16 plus its 1 px border). */
const stickyHeader = 'sticky top-[calc(var(--sz-header-height)+65px)] z-10 bg-surface-sunken'
const cell = 'px-4 py-3.5'

/**
 * Models tab table: sortable columns, zebra rows, a compare checkbox per row,
 * and a row that expands into its detail panel when clicked.
 */
export function ModelsTable({
  models,
  signedIn,
  onSignIn,
  sort,
  onSort,
  expandedId,
  onToggleExpand,
  compareIds,
  onToggleCompare,
  detail,
}: ModelsTableProps) {
  const visible = columns.filter((col) => signedIn || !col.priced)
  // Compare checkbox + columns (+ the sign-in column when signed out).
  const columnCount = 1 + visible.length + (signedIn ? 0 : 1)
  const compareFull = compareIds.length >= 3

  return (
    // overflow-clip rounds the corners without becoming a scroll container, so the header can stick.
    <div className="overflow-clip rounded-lg border border-border bg-white">
      <table className="w-full border-separate border-spacing-0 text-left text-[15px]">
        <thead className="text-sm text-navy-900">
          <tr>
            <th scope="col" className={`${stickyHeader} w-14 ${cell} border-b border-border`}>
              <span className="sr-only">{copy.columns.compare}</span>
            </th>
            {visible.map((col) => {
              const active = sort?.key === col.key
              const SortIcon = !active
                ? ArrowUpDown
                : sort.direction === 'asc'
                  ? ArrowUp
                  : ArrowDown
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={
                    active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined
                  }
                  className={`${stickyHeader} border-b border-border ${cell} font-semibold ${
                    col.numeric ? 'text-right' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSort(col.key)}
                    className={`group inline-flex items-center gap-1.5 transition-colors hover:text-primary ${
                      col.numeric ? 'flex-row-reverse' : ''
                    } ${active ? 'text-primary' : ''}`}
                  >
                    <span className="text-left">
                      {col.label}
                      {col.unit && (
                        <span className="block text-xs font-normal text-text-muted">
                          [{col.unit}]
                        </span>
                      )}
                    </span>
                    <SortIcon
                      aria-hidden
                      className={`size-3.5 shrink-0 transition-opacity ${
                        active ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                      }`}
                    />
                  </button>
                </th>
              )
            })}
            {!signedIn && (
              <th
                scope="col"
                className={`${stickyHeader} border-b border-border ${cell} text-right`}
              >
                <button
                  type="button"
                  onClick={onSignIn}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                >
                  <Lock className="size-3.5" />
                  {copy.signInForPrices}
                </button>
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {models.map((model, index) => {
            const expanded = model.id === expandedId
            const comparing = compareIds.includes(model.id)
            const detailId = `model-detail-${model.id}`
            const rowTone = expanded
              ? 'bg-primary-tint'
              : index % 2 === 1
                ? 'bg-surface-subtle hover:bg-primary-tint/60'
                : 'bg-white hover:bg-primary-tint/60'
            return (
              <Fragment key={model.id}>
                <tr
                  onClick={() => onToggleExpand(model.id)}
                  className={`cursor-pointer transition-colors duration-150 ${rowTone}`}
                >
                  <td
                    className={`${cell} border-b border-border`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={comparing}
                      disabled={!comparing && compareFull}
                      onChange={() => onToggleCompare(model.id)}
                      aria-label={`${copy.columns.compare} ${model.name}`}
                      title={copy.compareLimit}
                      className="size-[18px] cursor-pointer accent-primary disabled:cursor-not-allowed"
                    />
                  </td>
                  {visible.map((col) => (
                    <td
                      key={col.key}
                      className={`${cell} border-b border-border ${
                        col.numeric ? 'text-right tabular-nums' : ''
                      } ${col.key === 'productNumber' ? 'text-text-muted tabular-nums' : 'text-text'}`}
                    >
                      {col.key === 'name' ? (
                        // The click bubbles to the row, which toggles the panel.
                        <button
                          type="button"
                          aria-expanded={expanded}
                          aria-controls={expanded ? detailId : undefined}
                          aria-label={copy.showDetails(model.name)}
                          className="inline-flex items-center gap-2 font-semibold whitespace-nowrap text-primary"
                        >
                          <ChevronDown
                            aria-hidden
                            className={`size-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                          />
                          {model.name}
                        </button>
                      ) : (
                        col.render(model)
                      )}
                    </td>
                  ))}
                  {!signedIn && (
                    <td className={`${cell} border-b border-border text-right text-text-subtle`}>
                      —
                    </td>
                  )}
                </tr>
                {expanded && (
                  <tr id={detailId}>
                    <td colSpan={columnCount} className="border-b border-border bg-white p-0">
                      {detail(model)}
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
