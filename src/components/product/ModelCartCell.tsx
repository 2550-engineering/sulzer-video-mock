import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../../cart/useCart'
import { productPage } from '../../data/catalogPages'
import type { CartArticle } from '../../cart/CartContext'
import { QuantityStepper } from '../spareparts/QuantityStepper'

const copy = productPage.models

/** Quantity and "Add to cart" in a Models tab row. */
export function ModelCartCell({ article }: { article: CartArticle }) {
  const cart = useCart()
  const [quantity, setQuantity] = useState(1)
  return (
    <div className="flex items-center justify-end gap-2">
      <QuantityStepper
        size="sm"
        value={quantity}
        onChange={setQuantity}
        label={copy.quantityFor(article.name)}
      />
      <button
        type="button"
        onClick={() => cart.add(article, quantity)}
        aria-label={copy.addToCartFor(article.name)}
        title={copy.addToCart}
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-hover"
      >
        <ShoppingCart className="size-4" />
      </button>
    </div>
  )
}
