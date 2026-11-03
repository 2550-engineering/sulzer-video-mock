import { eshop } from '../config/demo'
import type { CartItem, PartOwner } from '../types'
import { ownerProductNumber, partOwner } from './catalog'
import { addWorkingDays } from './dates'
import { getVariant } from './variants'

/* Cart arithmetic: totals, delivery dates and the bill-of-material grouping. */

const cents = (amount: number) => Math.round(amount * 100) / 100

export function cartTotals(items: CartItem[]) {
  const subtotal = cents(items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0))
  const freight =
    items.length === 0 || subtotal >= eshop.freight.freeFrom ? 0 : eshop.freight.standard
  const vat = cents(((subtotal + freight) * eshop.vatRate) / 100)
  return { subtotal, freight, vat, total: cents(subtotal + freight + vat) }
}

/**
 * Delivery window from the lead times: the first line can arrive after the
 * shortest lead time plus transit, everything after the longest.
 */
export function deliveryWindow(items: CartItem[]) {
  const days = items.map((item) => item.availability.leadTimeDays)
  const at = (leadDays: number) => addWorkingDays(eshop.today, leadDays + eshop.transitDays)
  return {
    earliest: at(days.length ? Math.min(...days) : 0),
    latest: at(days.length ? Math.max(...days) : 0),
  }
}

/** When a line is expected: its lead time plus transit, in working days from today. */
export const lineDelivery = (item: CartItem) =>
  addWorkingDays(eshop.today, item.availability.leadTimeDays + eshop.transitDays)

/** Lines grouped by the variant or model they are for, in the order first added. */
export function groupByProduct(items: CartItem[]) {
  const groups: {
    variantId: string
    owner: PartOwner | undefined
    title: string
    productNumber: string
    items: CartItem[]
  }[] = []
  for (const item of items) {
    let group = groups.find((g) => g.variantId === item.variantId)
    if (!group) {
      const owner = partOwner(item.variantId)
      // A sized pump (from sizing or a project) has no product page of its own.
      const sized = owner ? undefined : getVariant(item.variantId)
      group = {
        variantId: item.variantId,
        owner,
        title: owner?.name ?? sized?.name ?? item.name,
        productNumber: owner ? ownerProductNumber(owner) : (sized?.productNumber ?? ''),
        items: [],
      }
      groups.push(group)
    }
    group.items.push(item)
  }
  return groups
}
