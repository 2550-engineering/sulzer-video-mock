import { partnerPricing, sparePartLeadTimes } from '../config/demo'
import type { CartLine, ModelAvailability, SparePart, User } from '../types'
import { netPrice } from './selfService'

/*
 * Prices and lead times for spare parts, cart and checkout. Every price goes through
 * here, so the partner layer only has to change what `discountFor` returns.
 */

export type Price = {
  /** Per unit, excl. VAT. */
  list: number
  /** % off list. */
  discount: number
  /** What the user pays per unit. */
  net: number
}

/** % off list for the signed-in user: the partner discount, or none. */
export const discountFor = (user: User) => (user.kind === 'partner' ? partnerPricing.discount : 0)

/** The user's price per unit. Null when signed out: prices are for signed-in users only. */
export function priceFor(listPrice: number, user: User | null): Price | null {
  if (!user) return null
  const discount = discountFor(user)
  return { list: listPrice, discount, net: netPrice(listPrice, discount) }
}

export const partPrice = (part: SparePart, user: User | null) => priceFor(part.listPrice, user)

/** "In stock", "ships in 2 days", the dot colour and the working days until it ships. */
export function leadTime(availability: ModelAvailability) {
  const { label, detail, dispatchDays } = sparePartLeadTimes[availability]
  const tone = availability === 'Made to order' ? ('warning' as const) : ('success' as const)
  return { label, detail, dispatchDays, tone }
}

const cents = (amount: number) => Math.round(amount * 100) / 100

/** Cart or checkout totals at a % discount. Lines whose part is gone are skipped. */
export function cartTotals(
  lines: CartLine[],
  partById: (id: string) => SparePart | undefined,
  discount: number,
) {
  let list = 0
  let net = 0
  let items = 0
  for (const line of lines) {
    const part = partById(line.partId)
    if (!part) continue
    list += part.listPrice * line.quantity
    net += netPrice(part.listPrice, discount) * line.quantity
    items += line.quantity
  }
  return {
    items,
    list: cents(list),
    discountPercent: discount,
    discount: cents(list - net),
    net: cents(net),
  }
}
