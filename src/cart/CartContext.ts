import { createContext } from 'react'
import type { CartLine } from '../types'

export type CartState = {
  /** Oldest first. The same part for two assets is two lines. */
  lines: CartLine[]
  /** Total quantity, for the header badge. */
  count: number
  /** Adds to the line for this part and asset, or adds a line. */
  add: (partId: string, quantity: number, assetId?: string) => void
  /** 0 removes the line. */
  setQuantity: (line: CartLine, quantity: number) => void
  remove: (line: CartLine) => void
  clear: () => void
  /** The cart drawer, opened from the header. */
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
}

export const CartContext = createContext<CartState | null>(null)
