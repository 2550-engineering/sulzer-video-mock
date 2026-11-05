import { partnerPricing } from '../config/demo'
import type { User } from '../types'
import { netPrice } from './selfService'

/*
 * Partner net prices. Every price a partner sees goes through here, so the partner
 * layer only has to change what `discountFor` returns. Other personas pay list.
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
