import { Lock } from 'lucide-react'
import { bom as copy } from '../../data/eshop'
import type { Price } from '../../lib/pricing'
import { atPosition } from '../../lib/spareParts'
import type { SparePart } from '../../types'
import { BomRow } from './BomRow'

type BomTableProps = {
  parts: SparePart[]
  priceOf: (part: SparePart) => Price | null
  signedIn: boolean
  onSignIn: () => void
  active: number | null
  hovered: number | null
  onHover: (position: number | null) => void
  onSelect: (position: number) => void
  onAdd: (part: SparePart, quantity: number) => void
  /** Group headings between the rows, when the list shows every group. */
  grouped: boolean
}

const head = 'border-b border-border bg-surface-sunken px-4 py-3.5 font-semibold'

/**
 * The parts list: position, part, lead time and (signed in) price, quantity and Add to
 * cart. Rows at the selected or hovered drawing position light up.
 */
export function BomTable({
  parts,
  priceOf,
  signedIn,
  onSignIn,
  active,
  hovered,
  onHover,
  onSelect,
  onAdd,
  grouped,
}: BomTableProps) {
  const columns = signedIn ? 5 : 4
  // Partners see their net price, with list price and discount under it.
  const discounted = parts.some((part) => (priceOf(part)?.discount ?? 0) > 0)

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      <table className="w-full border-collapse text-left text-[15px]">
        <thead className="text-sm text-navy-900">
          <tr>
            <th scope="col" className={head}>
              {copy.columns.position}
            </th>
            <th scope="col" className={head}>
              {copy.columns.part}
            </th>
            <th scope="col" className={head}>
              {copy.columns.leadTime}
            </th>
            {signedIn ? (
              <>
                <th scope="col" className={`${head} text-right`}>
                  {discounted ? copy.columns.netPrice : copy.columns.price}
                </th>
                <th scope="col" className={`${head} text-right`}>
                  <span className="sr-only">{copy.columns.order}</span>
                </th>
              </>
            ) : (
              <th scope="col" className={`${head} text-right`}>
                <button
                  type="button"
                  onClick={onSignIn}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap text-primary underline-offset-4 hover:underline"
                >
                  <Lock className="size-3.5" />
                  {copy.signInForPrices}
                </button>
              </th>
            )}
          </tr>
        </thead>
        {parts.map((part, i) => {
          const heading = grouped && part.group !== parts[i - 1]?.group
          return [
            heading && (
              <tbody key={`group-${part.group}`}>
                <tr>
                  <th
                    scope="colgroup"
                    colSpan={columns}
                    className="border-t border-border bg-surface-muted px-4 pt-4 pb-2 text-left text-xs font-bold tracking-[0.1em] text-text-muted uppercase"
                  >
                    {part.group}
                  </th>
                </tr>
              </tbody>
            ),
            <BomRow
              key={part.id}
              part={part}
              price={priceOf(part)}
              columns={columns}
              active={active !== null && atPosition(part, active)}
              highlighted={hovered !== null && part.position === hovered}
              onHover={onHover}
              onSelect={onSelect}
              onAdd={(quantity) => onAdd(part, quantity)}
            />,
          ]
        })}
      </table>
    </div>
  )
}
