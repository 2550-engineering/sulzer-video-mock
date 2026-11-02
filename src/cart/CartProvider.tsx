import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartLine } from '../types'
import { CartContext, type CartState } from './CartContext'

// Versioned, so a change to the CartLine shape starts from an empty cart.
const STORAGE_KEY = 'sz-demo-cart-v1'

const isLine = (value: unknown): value is CartLine =>
  typeof (value as CartLine)?.partId === 'string' &&
  typeof (value as CartLine)?.quantity === 'number'

function readLines(): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    return Array.isArray(parsed) ? parsed.filter(isLine) : []
  } catch {
    return []
  }
}

function writeLines(lines: CartLine[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  } catch {
    // Storage unavailable (private mode etc.): keep the in-memory state only.
  }
}

const sameLine = (a: CartLine, b: Pick<CartLine, 'partId' | 'assetId'>) =>
  a.partId === b.partId && a.assetId === b.assetId

/** Up to 99 of one line, like most shops. */
const clamp = (quantity: number) => Math.min(99, Math.max(0, Math.round(quantity)))

/**
 * The eShop cart, shared by every persona and kept in localStorage, so it survives a
 * reload. "Reset demo" clears it. Checkout turns it into an order (lib/eshop.ts).
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState(readLines)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => writeLines(lines), [lines])

  const value = useMemo<CartState>(
    () => ({
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      add(partId, quantity, assetId) {
        setLines((current) => {
          const existing = current.find((line) => sameLine(line, { partId, assetId }))
          if (!existing) {
            return [
              ...current,
              { partId, quantity: clamp(quantity), ...(assetId ? { assetId } : {}) },
            ]
          }
          return current.map((line) =>
            line === existing ? { ...line, quantity: clamp(line.quantity + quantity) } : line,
          )
        })
      },
      setQuantity(target, quantity) {
        setLines((current) =>
          current
            .map((line) => (sameLine(line, target) ? { ...line, quantity: clamp(quantity) } : line))
            .filter((line) => line.quantity > 0),
        )
      },
      remove(target) {
        setLines((current) => current.filter((line) => !sameLine(line, target)))
      },
      clear: () => setLines([]),
      drawerOpen,
      setDrawerOpen,
    }),
    [lines, drawerOpen],
  )

  return <CartContext value={value}>{children}</CartContext>
}
