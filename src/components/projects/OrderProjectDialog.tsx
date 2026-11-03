import { CircleCheck, FileQuestion, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router'
import { useCart } from '../../cart/useCart'
import { myProjectsPage } from '../../data/projectPages'
import { sizingResultsPage } from '../../data/sizingPages'
import { articleById } from '../../lib/articles'
import { cartArticleFor } from '../../lib/cartArticles'
import { formatPrice } from '../../lib/modelSpecs'
import { chosenItems } from '../../lib/projects'
import { getVariant } from '../../lib/variants'
import type { Project } from '../../types'
import { Modal } from '../Modal'

const copy = myProjectsPage.order

type OrderProjectDialogProps = {
  open: boolean
  project: Project
  onClose: () => void
}

/**
 * "Order project items": every chosen product with its quantity, either ready
 * for the cart (standard pumps) or "needs quotation" (configured ones). "Add
 * to cart" adds all orderable lines at once.
 */
export function OrderProjectDialog({ open, project, onClose }: OrderProjectDialogProps) {
  const cart = useCart()
  const rows = chosenItems(project.items).map((item) => ({
    item,
    article: cartArticleFor(item.variantId),
    name: getVariant(item.variantId)?.name ?? articleById(item.variantId)?.code ?? item.variantId,
  }))
  const orderable = rows.filter((row) => row.article)
  const quoted = rows.filter((row) => !row.article)
  const total = orderable.reduce((sum, row) => sum + row.article!.unitPrice * row.item.quantity, 0)

  function addToCart() {
    cart.addAll(
      orderable.map((row) => ({ article: row.article!, quantity: row.item.quantity })),
      quoted.length
        ? copy.needsQuoteDetail(quoted.map((row) => `Pos. ${row.item.position}`).join(', '))
        : undefined,
    )
    onClose()
  }

  return (
    <Modal
      open={open}
      title={copy.title}
      closeLabel={copy.close}
      onClose={onClose}
      width="max-w-2xl"
    >
      <div className="overflow-y-auto px-7 py-6">
        <p className="text-text-muted">{copy.intro}</p>
        <ul className="mt-5 divide-y divide-border rounded-lg border border-border">
          {rows.map(({ item, article, name }) => (
            <li key={item.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
              <span className="w-14 shrink-0 text-sm text-text-muted tabular-nums">
                {copy.position(item.position)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-navy-900">{name}</span>
                <span className="block text-sm text-text-muted tabular-nums">
                  {copy.quantity(item.quantity)}
                  {article && ` · ${article.availability.leadTime}`}
                </span>
              </span>
              {article ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-success-strong">
                  <CircleCheck aria-hidden className="size-4" />
                  {formatPrice(article.unitPrice * item.quantity)}
                </span>
              ) : (
                <Link
                  to={sizingResultsPage.quoteLink(item.variantId)}
                  className="inline-flex items-center gap-1.5 rounded-pill bg-warning-tint px-2.5 py-1 text-sm font-semibold text-warning-strong underline-offset-4 hover:underline"
                >
                  <FileQuestion aria-hidden className="size-4" />
                  {copy.needsQuote}
                </Link>
              )}
            </li>
          ))}
        </ul>
        {quoted.length > 0 && <p className="mt-3 text-sm text-text-muted">{copy.quoteNote}</p>}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm font-semibold text-navy-900 tabular-nums">
            {copy.summary(orderable.length, formatPrice(total))}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center rounded-pill border border-border-strong px-5 font-semibold text-navy-900 transition-colors hover:border-primary hover:text-primary"
            >
              {copy.cancel}
            </button>
            <button
              type="button"
              onClick={addToCart}
              disabled={orderable.length === 0}
              className="inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-border-strong disabled:shadow-none"
            >
              <ShoppingCart className="size-[18px]" />
              {copy.addToCart}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
