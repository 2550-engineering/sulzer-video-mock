import { Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import { useCart } from '../../cart/useCart'
import { eshopPages } from '../../data/eshopPages'
import { groupByProduct, lineDelivery } from '../../lib/cart'
import { formatDate } from '../../lib/dates'
import { ownerPath } from '../../lib/catalog'
import { formatPartPrice } from '../../lib/modelSpecs'
import type { CartItem } from '../../types'
import { QuantityStepper } from '../spareparts/QuantityStepper'
import { StockIndicator } from '../variant/StockIndicator'
import { CartLineImage } from './CartLineImage'

const copy = eshopPages.cart

const head =
  'border-b border-border bg-surface-sunken px-4 py-3 text-left font-semibold whitespace-nowrap'
const cell = 'border-b border-border px-4 py-3 align-middle'

/** What kind of line it is, under the name. */
function kindLabel(item: CartItem) {
  if (item.kind === 'kit') return `${copy.kit} · ${copy.partNumber} ${item.partNumber}`
  if (item.kind === 'product') return `${copy.product} · ${copy.productNumber} ${item.partNumber}`
  return `${copy.partNumber} ${item.partNumber}`
}

/**
 * The cart as a bill of material: lines grouped by pump (the pump itself and
 * its parts),
 * each with picture, name, part number, quantity, unit price, lead time, line
 * total and remove. `readOnly` drops the stepper and remove (checkout review).
 */
export function CartLines({ items, readOnly = false }: { items: CartItem[]; readOnly?: boolean }) {
  const cart = useCart()
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-white">
      <table className="w-full min-w-[48rem] border-separate border-spacing-0 text-[15px]">
        <thead className="text-sm text-navy-900">
          <tr>
            <th scope="col" className={head}>
              {copy.columns.item}
            </th>
            <th scope="col" className={`${head} text-center`}>
              {copy.columns.quantity}
            </th>
            <th scope="col" className={`${head} text-right`}>
              {copy.columns.unitPrice}
            </th>
            <th scope="col" className={head}>
              {copy.columns.leadTime}
            </th>
            <th scope="col" className={`${head} text-right`}>
              {copy.columns.total}
            </th>
            {!readOnly && (
              <th scope="col" className={`${head} w-12`}>
                <span className="sr-only">{copy.remove('')}</span>
              </th>
            )}
          </tr>
        </thead>
        {groupByProduct(items).map((group) => {
          return (
            <tbody key={group.variantId}>
              <tr>
                <th
                  scope="colgroup"
                  colSpan={readOnly ? 5 : 6}
                  className="border-b border-border bg-surface-subtle px-4 py-2.5 text-left text-sm font-semibold text-navy-900"
                >
                  <span className="text-text-muted">
                    {group.items.some((item) => item.kind === 'product')
                      ? group.items.every((item) => item.kind === 'product')
                        ? copy.pump
                        : copy.pumpAndParts
                      : copy.forProduct}{' '}
                  </span>
                  {group.owner ? (
                    <Link
                      to={ownerPath(group.owner)}
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {group.title}
                    </Link>
                  ) : (
                    group.title
                  )}
                  {group.productNumber && (
                    <span className="ml-2 font-normal text-text-muted tabular-nums">
                      {copy.productNumber} {group.productNumber}
                    </span>
                  )}
                </th>
              </tr>
              {group.items.map((item) => (
                <tr key={item.id} className="animate-fade-in">
                  <td className={cell}>
                    <div className="flex items-center gap-4">
                      <CartLineImage item={item} />
                      <div className="min-w-0">
                        <p className="font-semibold text-navy-900">
                          {item.position && (
                            <span className="mr-1.5 text-text-muted tabular-nums">
                              {item.position}
                            </span>
                          )}
                          {item.name}
                        </p>
                        <p className="text-sm text-text-muted tabular-nums">{kindLabel(item)}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`${cell} text-center`}>
                    {readOnly ? (
                      <span className="font-semibold tabular-nums">{item.quantity}</span>
                    ) : (
                      <div className="flex justify-center">
                        <QuantityStepper
                          value={item.quantity}
                          onChange={(quantity) => cart.setQuantity(item.id, quantity)}
                          label={copy.quantity(item.name)}
                        />
                      </div>
                    )}
                  </td>
                  <td className={`${cell} text-right whitespace-nowrap tabular-nums`}>
                    {formatPartPrice(item.unitPrice)}
                    {item.listPrice !== undefined && (
                      <span className="block text-xs text-text-muted line-through">
                        {formatPartPrice(item.listPrice)}
                      </span>
                    )}
                  </td>
                  <td className={`${cell} text-sm`}>
                    <span className="font-semibold text-navy-900">
                      <StockIndicator status={item.availability.status} />
                    </span>
                    <span className="block text-text-muted">{item.availability.leadTime}</span>
                    <span className="block text-xs whitespace-nowrap text-text-muted tabular-nums">
                      {copy.expected(formatDate(lineDelivery(item)))}
                    </span>
                  </td>
                  <td
                    className={`${cell} text-right font-semibold whitespace-nowrap text-navy-900 tabular-nums`}
                  >
                    {formatPartPrice(item.unitPrice * item.quantity)}
                  </td>
                  {!readOnly && (
                    <td className={cell}>
                      <button
                        type="button"
                        onClick={() => cart.remove(item.id)}
                        aria-label={copy.remove(item.name)}
                        title={copy.remove(item.name)}
                        className="flex size-9 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-muted hover:text-danger"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          )
        })}
      </table>
    </div>
  )
}
