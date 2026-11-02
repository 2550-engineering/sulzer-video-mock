import { addedToCart, cartPath } from '../data/eshop'
import { useToast } from '../toast/useToast'
import type { SparePart } from '../types'
import { useCart } from './useCart'

/** Adds a part to the cart and confirms it with a toast that links to the cart. */
export function useAddToCart() {
  const { add } = useCart()
  const showToast = useToast()
  return (part: SparePart, quantity: number, assetId?: string) => {
    add(part.id, quantity, assetId)
    showToast({
      message: addedToCart.message,
      detail: addedToCart.detail(quantity, part.name),
      action: { label: addedToCart.action, to: cartPath },
    })
  }
}
