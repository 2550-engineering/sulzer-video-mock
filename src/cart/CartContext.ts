import { createContext } from 'react'
import type { CartItem, Order, Quotation } from '../types'

/** What "Add to cart" passes: the line without its id and quantity. */
export type CartArticle = Omit<CartItem, 'id' | 'quantity'>

export type CartState = {
  items: CartItem[]
  /** Pieces in the cart, for the header badge. */
  count: number
  /** "Your reference / PO number". */
  reference: string
  setReference: (reference: string) => void
  /** Signed in: adds and confirms with a toast. Signed out: asks to sign in first. */
  add: (article: CartArticle, quantity: number) => void
  /** Adds several lines at once, confirmed with one toast (signed in only). */
  addAll: (lines: { article: CartArticle; quantity: number }[], detail?: string) => void
  setQuantity: (id: string, quantity: number) => void
  remove: (id: string) => void
  orders: Order[]
  /** Turns the cart into an order, empties it and returns the order id. */
  placeOrder: (
    details: Pick<Order, 'deliveryAddressId' | 'delivery' | 'deliveryAddress' | 'customer'>,
  ) => string
  /** Saves the cart as a quotation request (the cart stays) and returns it. */
  saveQuotation: () => Quotation
}

export const CartContext = createContext<CartState | null>(null)
