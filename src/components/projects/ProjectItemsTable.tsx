import { Link2, Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { myProjectsPage } from '../../data/projectPages'
import { sizingResultsPage } from '../../data/sizingPages'
import { groupThousands } from '../../lib/format'
import { formatPrice } from '../../lib/modelSpecs'
import { evaluateVariant } from '../../lib/sizing'
import { getVariant } from '../../lib/variants'
import type { ProjectItem, SizingRecord } from '../../types'
import { CurveThumbnail } from '../sizing/CurveThumbnail'

const copy = myProjectsPage.items

type ProjectItemsTableProps = {
  items: ProjectItem[]
  /** Item ids to highlight for a moment (just added). */
  highlightIds: string[]
  signedIn: boolean
  /** The project's sizings, to link products to the sizing they came from. */
  sizings: SizingRecord[]
  onChange: (
    itemId: string,
    patch: Partial<Pick<ProjectItem, 'customerPosition' | 'quantity'>>,
  ) => void
}

const cell = 'border-b border-border px-3 py-3'
const head = 'border-b border-border bg-surface-sunken px-3 py-3 text-left font-semibold'

/**
 * "Sulzer products" table: checkbox, position, editable "Your position",
 * curve thumbnail, product (name, number link, duty point), quantity stepper
 * and, signed in, the price. Each item is re-evaluated from its variant id and
 * duty point, so curve and price always match the sizing data.
 */
export function ProjectItemsTable({
  items,
  highlightIds,
  signedIn,
  sizings,
  onChange,
}: ProjectItemsTableProps) {
  const [selected, setSelected] = useState<string[]>([])
  const rows = items.map((item) => {
    const variant = getVariant(item.variantId)
    return { item, variant, result: variant && evaluateVariant(variant, item.dutyPoint) }
  })
  const allSelected = items.length > 0 && items.every((item) => selected.includes(item.id))
  const total = rows.reduce(
    (sum, { item, result }) => sum + (result?.purchasePrice ?? 0) * item.quantity,
    0,
  )

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-white">
      <table className="w-full min-w-[44rem] border-separate border-spacing-0 text-[15px]">
        <thead className="text-sm text-navy-900">
          <tr>
            <th scope="col" className={`${head} w-10`}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => setSelected(allSelected ? [] : items.map((item) => item.id))}
                aria-label={copy.selectAll}
                className="size-[18px] cursor-pointer accent-primary"
              />
            </th>
            <th scope="col" className={head}>
              {copy.position}
            </th>
            <th scope="col" className={head}>
              {copy.yourPosition}
            </th>
            <th scope="col" className={head}>
              {copy.curve}
            </th>
            <th scope="col" className={head}>
              {copy.product}
            </th>
            <th scope="col" className={`${head} text-center`}>
              {copy.quantity}
            </th>
            {signedIn && (
              <th scope="col" className={`${head} text-right`}>
                {copy.price}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ item, variant, result }, index) => {
            const name = variant?.name ?? item.variantId
            const sizing = sizings.find((s) => s.id === item.sizingId)
            const checked = selected.includes(item.id)
            return (
              <tr
                key={item.id}
                className={`transition-colors duration-150 ${
                  highlightIds.includes(item.id) ? 'animate-highlight' : ''
                } ${checked ? 'bg-primary-tint' : index % 2 ? 'bg-surface-subtle' : 'bg-white'}`}
              >
                <td className={cell}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setSelected((ids) =>
                        ids.includes(item.id)
                          ? ids.filter((id) => id !== item.id)
                          : [...ids, item.id],
                      )
                    }
                    aria-label={copy.select(name)}
                    className="size-[18px] cursor-pointer accent-primary"
                  />
                </td>
                <td className={`${cell} text-text-muted tabular-nums`}>{item.position}</td>
                <td className={cell}>
                  <input
                    value={item.customerPosition}
                    onChange={(e) => onChange(item.id, { customerPosition: e.target.value })}
                    aria-label={copy.yourPositionLabel(item.position)}
                    className="h-9 w-24 rounded-md border border-border-strong bg-white px-2.5 text-sm text-navy-900 transition-[border-color,box-shadow] focus:border-primary focus:shadow-[0_0_0_3px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none"
                  />
                </td>
                <td className={`${cell} py-2`}>
                  {result && <CurveThumbnail result={result} duty={item.dutyPoint} />}
                </td>
                <td className={cell}>
                  <p className="flex items-center gap-1.5 font-semibold whitespace-nowrap text-navy-900">
                    {name}
                    {sizing && (
                      <a
                        href={`#sizing-${sizing.id}`}
                        title={myProjectsPage.sizings.fromSizing(sizing.name)}
                        aria-label={myProjectsPage.sizings.fromSizing(sizing.name)}
                        className="text-primary transition-colors hover:text-primary-hover"
                      >
                        <Link2 className="size-3.5" />
                      </a>
                    )}
                  </p>
                  <p className="mt-0.5 flex flex-wrap gap-x-3 text-sm">
                    {variant?.productNumber ? (
                      <Link
                        to={`/products/${variant.productId}#models`}
                        className="font-semibold text-primary tabular-nums underline-offset-4 hover:underline"
                      >
                        {variant.productNumber}
                      </Link>
                    ) : (
                      <Link
                        to={sizingResultsPage.quoteLink(item.variantId)}
                        className="font-semibold text-primary underline-offset-4 hover:underline"
                      >
                        {copy.onRequest}
                      </Link>
                    )}
                    <span className="text-text-muted tabular-nums">
                      {copy.dutyPoint(
                        groupThousands(item.dutyPoint.flow),
                        groupThousands(item.dutyPoint.head),
                      )}
                    </span>
                  </p>
                </td>
                <td className={cell}>
                  <div className="mx-auto flex w-fit items-center rounded-md border border-border-strong bg-white">
                    <button
                      type="button"
                      onClick={() =>
                        onChange(item.id, { quantity: Math.max(1, item.quantity - 1) })
                      }
                      disabled={item.quantity <= 1}
                      aria-label={`${copy.quantityLabel(name)} −1`}
                      className="flex size-8 items-center justify-center text-navy-900 transition-colors hover:text-primary disabled:text-text-subtle"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span
                      aria-label={copy.quantityLabel(name)}
                      className="w-8 text-center font-semibold tabular-nums"
                    >
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onChange(item.id, { quantity: item.quantity + 1 })}
                      aria-label={`${copy.quantityLabel(name)} +1`}
                      className="flex size-8 items-center justify-center text-navy-900 transition-colors hover:text-primary"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                </td>
                {signedIn && (
                  <td
                    className={`${cell} text-right font-semibold whitespace-nowrap text-navy-900 tabular-nums`}
                  >
                    {result ? formatPrice(result.purchasePrice * item.quantity) : '–'}
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
        {signedIn && (
          <tfoot>
            <tr>
              <td
                colSpan={6}
                className="px-3 py-3 text-right text-sm font-semibold text-text-muted"
              >
                {copy.total}
              </td>
              <td className="px-3 py-3 text-right text-lg font-bold whitespace-nowrap text-navy-900 tabular-nums">
                {formatPrice(total)}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}
