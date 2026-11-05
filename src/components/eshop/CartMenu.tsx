import { ArrowRight, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router'
import { useCart } from '../../cart/useCart'
import { eshopPages } from '../../data/eshopPages'
import { cartTotals } from '../../lib/cart'
import { formatPartPrice } from '../../lib/modelSpecs'
import { popoverClasses } from '../../lib/popover'
import { CartLineImage } from './CartLineImage'

const copy = eshopPages.menu
const shown = 4

type CartMenuProps = {
  open: boolean
  onToggle: () => void
  onClose: () => void
  buttonClassName: string
}

/** Header cart button with a count badge, and the mini-cart flyout under it. */
export function CartMenu({ open, onToggle, onClose, buttonClassName }: CartMenuProps) {
  const { items, count } = useCart()
  const { subtotal } = cartTotals(items)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="mini-cart"
        aria-label={copy.label(count)}
        className={`${buttonClassName} relative ${open ? 'bg-surface-muted text-primary' : ''}`}
      >
        <ShoppingCart className="size-[18px] text-primary" strokeWidth={1.75} />
        <span className="max-xl:sr-only">{copy.title}</span>
        {count > 0 && (
          <span
            key={count}
            aria-hidden
            className="absolute top-0.5 left-6 flex h-[18px] min-w-[18px] animate-fade-in items-center justify-center rounded-pill bg-accent-red px-1 text-[11px] font-bold text-white tabular-nums"
          >
            {count}
          </span>
        )}
      </button>

      <div
        id="mini-cart"
        inert={!open}
        className={`absolute top-[calc(100%+12px)] right-0 z-30 w-[22rem] rounded-lg bg-white text-left shadow-card ring-1 ring-navy-900/10 max-md:fixed max-md:inset-x-4 max-md:top-[calc(var(--sz-header-height)+8px)] max-md:w-auto ${popoverClasses(open)}`}
      >
        <p className="border-b border-border px-5 py-3.5 font-semibold text-navy-900">
          {copy.title} <span className="font-normal text-text-muted">({count})</span>
        </p>
        {items.length === 0 ? (
          <p className="px-5 py-6 text-sm text-text-muted">{copy.empty}</p>
        ) : (
          <>
            <ul className="divide-y divide-border px-5">
              {items.slice(0, shown).map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-3">
                  <CartLineImage item={item} size="size-11" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy-900">{item.name}</p>
                    <p className="text-xs text-text-muted tabular-nums">
                      {item.quantity} × {formatPartPrice(item.unitPrice)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-navy-900 tabular-nums">
                    {formatPartPrice(item.unitPrice * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            {items.length > shown && (
              <p className="px-5 pb-2 text-xs text-text-muted">{copy.more(items.length - shown)}</p>
            )}
            <div className="flex items-baseline justify-between border-t border-border px-5 pt-3.5 text-sm">
              <span className="text-text-muted">{copy.subtotal}</span>
              <span className="text-lg font-bold text-navy-900 tabular-nums">
                {formatPartPrice(subtotal)}
              </span>
            </div>
          </>
        )}
        <div className="p-4">
          <Link
            to="/eshop/cart"
            onClick={onClose}
            className="group flex h-11 w-full items-center justify-center gap-2 rounded-pill bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            {copy.goToCart}
            <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
