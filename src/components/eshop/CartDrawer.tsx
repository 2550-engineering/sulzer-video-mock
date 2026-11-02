import { ArrowRight, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router'
import { useCartItems } from '../../cart/useCartItems'
import { cartCopy as copy, cartPath, checkoutPath, sparePartsPath } from '../../data/eshop'
import { Drawer } from '../Drawer'
import { CartLineItem } from './CartLineItem'
import { CartSummary } from './CartSummary'

const primary =
  'group inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-primary px-6 text-[15px] font-semibold text-white transition-colors hover:bg-primary-hover'
const secondary =
  'inline-flex h-11 items-center justify-center rounded-pill border border-border-strong px-6 text-sm font-semibold text-navy-900 transition-colors hover:border-primary hover:text-primary'

/** The cart, sliding in from the header: lines, totals, checkout. */
export function CartDrawer() {
  const { items, totals, drawerOpen, setDrawerOpen, setQuantity, remove } = useCartItems()
  const close = () => setDrawerOpen(false)

  return (
    <Drawer
      open={drawerOpen}
      title={copy.drawerTitle}
      subtitle={items.length ? copy.items(totals.items) : undefined}
      closeLabel={copy.close}
      onClose={close}
      size="sm"
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center px-4 py-16 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-primary-tint text-primary">
            <ShoppingCart className="size-7" strokeWidth={1.5} />
          </span>
          <p className="mt-5 text-lg font-semibold text-navy-900">{copy.empty.title}</p>
          <p className="mt-1 text-text-muted">{copy.empty.text}</p>
          <Link to={sparePartsPath} onClick={close} className={`mt-6 ${secondary}`}>
            {copy.empty.action}
          </Link>
        </div>
      ) : (
        <>
          <ul className="-mt-5 divide-y divide-border">
            {items.map(({ line, part, price }) => (
              <li key={`${line.partId}-${line.assetId ?? ''}`}>
                <CartLineItem
                  line={line}
                  part={part}
                  price={price}
                  onQuantity={(quantity) => setQuantity(line, quantity)}
                  onRemove={() => remove(line)}
                  compact
                />
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <CartSummary totals={totals} shipping={null}>
              <Link to={checkoutPath} onClick={close} className={primary}>
                {copy.checkout}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link to={cartPath} onClick={close} className={secondary}>
                {copy.view}
              </Link>
            </CartSummary>
          </div>
        </>
      )}
    </Drawer>
  )
}
