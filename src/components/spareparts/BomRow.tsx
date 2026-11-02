import { ChevronDown, ShoppingCart } from 'lucide-react'
import { useId, useState, type MouseEvent } from 'react'
import { bom as copy } from '../../data/eshop'
import type { Price } from '../../lib/pricing'
import { formatMoney } from '../../lib/selfService'
import { kitContents } from '../../lib/spareParts'
import type { SparePart } from '../../types'
import { LeadTime } from './LeadTime'
import { PartPrice } from './PartPrice'
import { QuantityStepper } from './QuantityStepper'

type BomRowProps = {
  part: SparePart
  /** Null when signed out. */
  price: Price | null
  columns: number
  /** At the selected drawing position (or a kit holding it). */
  active: boolean
  /** At the hovered drawing position. */
  highlighted: boolean
  onHover: (position: number | null) => void
  onSelect: (position: number) => void
  onAdd: (quantity: number) => void
}

const cell = 'px-4 py-4 align-top'

/** One part in the parts list; kits open to show what is in them. */
export function BomRow({
  part,
  price,
  columns,
  active,
  highlighted,
  onHover,
  onSelect,
  onAdd,
}: BomRowProps) {
  const [quantity, setQuantity] = useState(1)
  const [open, setOpen] = useState(false)
  const contentsId = useId()
  const contents = kitContents(part)
  const saving =
    price && contents.length
      ? contents.reduce((sum, item) => sum + item.part.listPrice * item.quantity, 0) -
        part.listPrice
      : 0

  function selectRow(event: MouseEvent) {
    if ((event.target as HTMLElement).closest('button, input, a')) return
    if (part.position !== undefined) onSelect(part.position)
  }

  return (
    <tbody
      data-part={part.partNumber}
      data-active={active || undefined}
      onMouseEnter={() => onHover(part.position ?? null)}
      onMouseLeave={() => onHover(null)}
      onClick={selectRow}
      className={`scroll-mt-[calc(var(--sz-header-height)+96px)] border-t border-border transition-colors duration-150 ${
        part.position !== undefined ? 'cursor-pointer' : ''
      } ${active ? 'bg-primary-tint' : highlighted ? 'bg-primary-tint/60' : 'hover:bg-surface-muted'}`}
    >
      <tr>
        <td className={`${cell} relative w-16 text-text-muted tabular-nums`}>
          {/* Selected rows get a blue edge, like the active tab. */}
          <span
            aria-hidden
            className={`absolute inset-y-0 left-0 w-[3px] bg-primary transition-opacity duration-150 ${
              active ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <span className={active ? 'font-bold text-primary' : ''}>{part.position ?? '–'}</span>
        </td>
        <th scope="row" className={`${cell} text-left font-normal`}>
          <span className="block font-semibold text-navy-900">{part.name}</span>
          <span className="mt-0.5 block text-sm text-text-muted tabular-nums">
            {part.partNumber}
            {part.quantity > 1 && ` · ${part.quantity} per pump`}
            {part.interval && ` · ${part.interval}`}
          </span>
          {contents.length > 0 && (
            <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls={contentsId}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                {open ? copy.kit.hide : copy.kit.show(contents.length)}
                <ChevronDown
                  className={`size-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
              </button>
              {saving > 0 && (
                <span className="rounded-sm bg-success-tint px-1.5 py-0.5 text-xs font-semibold text-success-strong">
                  {copy.kit.saving(formatMoney(saving * (1 - (price?.discount ?? 0) / 100)))}
                </span>
              )}
            </span>
          )}
        </th>
        <td className={`${cell} w-36`}>
          <LeadTime availability={part.availability} />
        </td>
        {price ? (
          <>
            <td className={`${cell} w-32 text-right`}>
              <PartPrice price={price} />
            </td>
            <td className={`${cell} w-[13.5rem]`}>
              <div className="flex items-center justify-end gap-2">
                <QuantityStepper
                  value={quantity}
                  onChange={setQuantity}
                  label={`${copy.quantity}, ${part.name}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    onAdd(quantity)
                    setQuantity(1)
                  }}
                  aria-label={copy.addPart(part.name)}
                  title={copy.add}
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-hover"
                >
                  <ShoppingCart className="size-[18px]" strokeWidth={1.75} />
                </button>
              </div>
            </td>
          </>
        ) : (
          <td className={cell} />
        )}
      </tr>
      {open && (
        <tr id={contentsId}>
          <td />
          <td colSpan={columns - 1} className="px-4 pb-4">
            <ul className="animate-fade-in divide-y divide-border rounded-md border border-border bg-white text-sm">
              {contents.map(({ part: item, quantity: count }) => (
                <li key={item.id} className="flex items-baseline gap-4 px-4 py-2.5">
                  <span className="w-10 shrink-0 text-text-muted tabular-nums">
                    {item.position ?? '–'}
                  </span>
                  <span className="min-w-0 flex-1 text-navy-900">{item.name}</span>
                  <span className="text-text-muted tabular-nums">{item.partNumber}</span>
                  <span className="w-10 text-right font-semibold text-navy-900 tabular-nums">
                    {count}×
                  </span>
                </li>
              ))}
            </ul>
          </td>
        </tr>
      )}
    </tbody>
  )
}
