import { useAuth } from '../auth/useAuth'
import { cartTotals, discountFor, partPrice, type Price } from '../lib/pricing'
import { getPart } from '../lib/spareParts'
import type { CartLine, SparePart } from '../types'
import { useCart } from './useCart'

export type CartItem = { line: CartLine; part: SparePart; price: Price }

/**
 * The cart lines with their parts and the signed-in user's prices, and the totals.
 * Signed out there are no prices, so no items.
 */
export function useCartItems() {
  const { user } = useAuth()
  const cart = useCart()
  const items: CartItem[] = cart.lines.flatMap((line) => {
    const part = getPart(line.partId)
    const price = part && partPrice(part, user)
    return part && price ? [{ line, part, price }] : []
  })
  const totals = cartTotals(
    items.map((item) => item.line),
    getPart,
    user ? discountFor(user) : 0,
  )
  return { ...cart, items, totals }
}
