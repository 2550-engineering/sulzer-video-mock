import { FileQuestion, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router'
import { useCart } from '../../cart/useCart'
import { eshopPages } from '../../data/eshopPages'
import { sizingResultsPage } from '../../data/sizingPages'
import { cartArticleFor } from '../../lib/cartArticles'

const copy = eshopPages.buy

const looks = {
  /** Small pill, for table rows. */
  compact: 'h-8 px-3 text-xs',
  /** Full-width pill, for compare columns. */
  block: 'h-9 w-full px-4 text-sm',
  /** Text link, for a row of links. */
  link: 'text-sm',
} as const

type BuyActionProps = {
  /** Sized pump, variant or model id. */
  id: string
  name: string
  quantity?: number
  look?: keyof typeof looks
}

/**
 * "Add to cart" for standard pumps (with a product number), or "Request
 * quotation" for configured ones, which can't be bought directly; a tooltip
 * says why.
 */
export function BuyAction({ id, name, quantity = 1, look = 'compact' }: BuyActionProps) {
  const cart = useCart()
  const article = cartArticleFor(id)
  const size = looks[look]
  const isLink = look === 'link'

  if (article)
    return (
      <button
        type="button"
        onClick={() => cart.add(article, quantity)}
        aria-label={copy.addToCartFor(name)}
        className={
          isLink
            ? 'inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline'
            : `inline-flex shrink-0 items-center justify-center gap-1.5 rounded-pill bg-primary font-semibold whitespace-nowrap text-white transition-colors hover:bg-primary-hover ${size}`
        }
      >
        <ShoppingCart aria-hidden className="size-3.5" />
        {copy.addToCart}
      </button>
    )

  return (
    <span className="group relative inline-flex">
      <Link
        to={sizingResultsPage.quoteLink(id)}
        aria-label={copy.requestQuoteFor(name)}
        aria-describedby={`buy-hint-${id}`}
        className={
          isLink
            ? 'inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline'
            : `inline-flex shrink-0 items-center justify-center gap-1.5 rounded-pill border border-primary font-semibold whitespace-nowrap text-primary transition-colors hover:bg-primary-tint ${size}`
        }
      >
        <FileQuestion aria-hidden className="size-3.5" />
        {copy.requestQuote}
      </Link>
      <span
        id={`buy-hint-${id}`}
        role="tooltip"
        className={`pointer-events-none absolute z-30 w-60 rounded-sm max-md:hidden ${
          look === 'compact'
            ? // Table rows sit in scroll boxes: show it to the left, inside the box.
              'top-1/2 right-full mr-2 -translate-y-1/2'
            : 'bottom-full left-1/2 mb-2 -translate-x-1/2'
        } bg-navy-900 px-3 py-2 text-left text-xs font-normal whitespace-normal text-white opacity-0 shadow-card transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100`}
      >
        {copy.quoteHint}
      </span>
    </span>
  )
}
