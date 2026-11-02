import { ShoppingCart } from 'lucide-react'
import { useCart } from '../../cart/useCart'
import { cartCopy as copy } from '../../data/eshop'

/** Header cart button with a count badge. Opens the cart drawer. */
export function CartButton({ className }: { className: string }) {
  const { count, drawerOpen, setDrawerOpen } = useCart()
  return (
    <button
      type="button"
      onClick={() => setDrawerOpen(true)}
      aria-label={copy.open(count)}
      aria-expanded={drawerOpen}
      className={`${className} relative`}
    >
      <span className="relative mr-1.5">
        <ShoppingCart className="size-5 text-primary" strokeWidth={1.75} />
        {count > 0 && (
          <span
            key={count}
            data-testid="cart-count"
            className="absolute -top-2 -right-2.5 flex h-[18px] min-w-[18px] animate-pop items-center justify-center rounded-pill bg-accent-red px-1 text-[11px] leading-none font-bold text-white tabular-nums ring-2 ring-white"
          >
            {count}
          </span>
        )}
      </span>
      {copy.title}
    </button>
  )
}
