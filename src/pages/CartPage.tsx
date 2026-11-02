import { ArrowRight, ShoppingCart } from 'lucide-react'
import { Link, Navigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { useCartItems } from '../cart/useCartItems'
import { CartLineItem } from '../components/eshop/CartLineItem'
import { CartSummary } from '../components/eshop/CartSummary'
import { SelfServicePageHeader } from '../components/selfservice/SelfServicePageHeader'
import { cartCopy as copy, checkoutPath, eshopPath, sparePartsPath } from '../data/eshop'
import { signedOutRedirect } from '../data/myPages'

/** /eshop/cart. Signed-in only: every line with quantity and total, and the summary. */
export function CartPage() {
  const { user } = useAuth()
  const { items, totals, setQuantity, remove } = useCartItems()
  if (!user) return <Navigate to={signedOutRedirect} replace />

  return (
    <div className="bg-surface-muted">
      <title>{`${copy.title} | eShop | Sulzer`}</title>
      <SelfServicePageHeader
        breadcrumb={[...copy.breadcrumb, { label: copy.title }]}
        eyebrow={user.company}
        title={copy.title}
        description={items.length ? copy.items(totals.items) : undefined}
      />

      <div className="site-container pt-10 pb-24">
        {items.length === 0 ? (
          <div className="flex animate-fade-in flex-col items-center rounded-lg border border-border bg-white px-8 py-20 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-primary-tint text-primary">
              <ShoppingCart className="size-7" strokeWidth={1.5} />
            </span>
            <p className="mt-5 text-xl font-semibold text-navy-900">{copy.empty.title}</p>
            <p className="mt-1 text-text-muted">{copy.empty.text}</p>
            <Link
              to={sparePartsPath}
              className="mt-7 inline-flex h-11 items-center rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              {copy.empty.action}
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
            <ul className="divide-y divide-border rounded-lg border border-border bg-white px-6">
              {items.map(({ line, part, price }) => (
                <li key={`${line.partId}-${line.assetId ?? ''}`}>
                  <CartLineItem
                    line={line}
                    part={part}
                    price={price}
                    onQuantity={(quantity) => setQuantity(line, quantity)}
                    onRemove={() => remove(line)}
                  />
                </li>
              ))}
            </ul>
            <div className="lg:sticky lg:top-[calc(var(--sz-header-height)+24px)]">
              <CartSummary totals={totals} shipping={null}>
                <Link
                  to={checkoutPath}
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-primary px-6 text-[15px] font-semibold text-white transition-colors hover:bg-primary-hover"
                >
                  {copy.checkout}
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  to={eshopPath}
                  className="inline-flex h-11 items-center justify-center rounded-pill px-6 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint"
                >
                  {copy.continue}
                </Link>
              </CartSummary>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
