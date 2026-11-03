import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from '../auth/useAuth'
import { eshop, personas } from '../config/demo'
import { eshopPages } from '../data/eshopPages'
import { cartTotals, deliveryWindow } from '../lib/cart'
import { useToast } from '../toast/useToast'
import type { CartItem, Order, Quotation } from '../types'
import { SignInToOrderDialog } from '../components/eshop/SignInToOrderDialog'
import { CartContext, type CartArticle, type CartState } from './CartContext'

const CART_KEY = 'sz-demo-cart-v1'
const ORDERS_KEY = 'sz-demo-orders-v1'
const QUOTATIONS_KEY = 'sz-demo-quotations-v1'

function read<T>(key: string, fallback: T, valid: (value: unknown) => boolean): T {
  try {
    const stored = localStorage.getItem(key)
    const parsed: unknown = stored ? JSON.parse(stored) : null
    return valid(parsed) ? (parsed as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage unavailable (private mode etc.): keep the in-memory state only.
  }
}

type Basket = { items: CartItem[]; reference: string }
const emptyBasket: Basket = { items: [], reference: '' }
const isBasket = (value: unknown) =>
  typeof value === 'object' && value !== null && Array.isArray((value as Basket).items)

/**
 * Cart, orders and saved quotations, kept in localStorage ("Reset demo"
 * clears them). Adding while signed out opens a sign-in step that then adds
 * the article. Order and quotation numbers count up from fixed numbers.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const { user, signIn } = useAuth()
  const showToast = useToast()
  const [basket, setBasket] = useState<Basket>(() => read(CART_KEY, emptyBasket, isBasket))
  const [orders, setOrders] = useState<Order[]>(() => read(ORDERS_KEY, [], Array.isArray))
  const [quotations, setQuotations] = useState<Quotation[]>(() =>
    read(QUOTATIONS_KEY, [], Array.isArray),
  )
  const [pending, setPending] = useState<{ article: CartArticle; quantity: number } | null>(null)

  useEffect(() => write(CART_KEY, basket), [basket])
  useEffect(() => write(ORDERS_KEY, orders), [orders])
  useEffect(() => write(QUOTATIONS_KEY, quotations), [quotations])

  /** Adds lines to the basket; the same article again raises its quantity. */
  const merge = useCallback((lines: { article: CartArticle; quantity: number }[]) => {
    setBasket((current) => {
      let items = current.items
      for (const { article, quantity } of lines) {
        const id = `${article.kind}:${article.refId}`
        items = items.some((item) => item.id === id)
          ? items.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity + quantity } : item,
            )
          : [...items, { ...article, id, quantity }]
      }
      return { ...current, items }
    })
  }, [])

  const put = useCallback(
    (article: CartArticle, quantity: number) => {
      merge([{ article, quantity }])
      showToast({
        message: eshopPages.toasts.added,
        detail: eshopPages.toasts.addedDetail(quantity, article.name),
        action: eshopPages.toasts.viewCart,
      })
    },
    [showToast, merge],
  )

  const value = useMemo<CartState>(() => {
    return {
      items: basket.items,
      count: basket.items.reduce((sum, item) => sum + item.quantity, 0),
      reference: basket.reference,
      setReference: (reference) => setBasket((current) => ({ ...current, reference })),
      add: (article, quantity) =>
        user ? put(article, quantity) : setPending({ article, quantity }),
      addAll: (lines, detail) => {
        if (lines.length === 0) return
        merge(lines)
        const pieces = lines.reduce((sum, line) => sum + line.quantity, 0)
        showToast({
          message: eshopPages.toasts.addedMany(pieces),
          detail,
          action: eshopPages.toasts.viewCart,
        })
      },
      setQuantity: (id, quantity) =>
        setBasket((current) => ({
          ...current,
          items: current.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, Math.min(99, quantity)) } : item,
          ),
        })),
      remove: (id) =>
        setBasket((current) => ({
          ...current,
          items: current.items.filter((item) => item.id !== id),
        })),
      orders,
      placeOrder: ({ deliveryAddressId, delivery }) => {
        const id = `SO-${eshop.firstOrderNumber + orders.length}`
        const dates = deliveryWindow(basket.items)
        const order: Order = {
          id,
          placedBy: (user ?? personas.endUser).name,
          company: (user ?? personas.endUser).company,
          lines: basket.items,
          reference: basket.reference,
          deliveryAddressId,
          delivery,
          ...cartTotals(basket.items),
          earliestDelivery: delivery === 'partial' ? dates.earliest : dates.latest,
          latestDelivery: dates.latest,
        }
        setOrders((current) => [...current, order])
        setBasket(emptyBasket)
        return id
      },
      saveQuotation: () => {
        const quotation: Quotation = {
          id: `Q-${eshop.firstQuotationNumber + quotations.length}`,
          reference: basket.reference,
          lines: basket.items,
          total: cartTotals(basket.items).total,
        }
        setQuotations((current) => [...current, quotation])
        return quotation
      },
    }
  }, [basket, orders, quotations, user, put, merge, showToast])

  return (
    <CartContext.Provider value={value}>
      {children}
      <SignInToOrderDialog
        open={pending !== null}
        onClose={() => setPending(null)}
        onConfirm={() => {
          signIn()
          if (pending) put(pending.article, pending.quantity)
          setPending(null)
        }}
      />
    </CartContext.Provider>
  )
}
