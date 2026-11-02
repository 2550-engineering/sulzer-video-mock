import { Check } from 'lucide-react'
import type { Product } from '../../types'
import { SmartImage } from '../SmartImage'

type ProductChoiceCardProps = {
  product: Product
  /** e.g. "14 models with parts lists". */
  detail: string
  selected: boolean
  onSelect: () => void
}

/** Product photo, family and name as a selectable card. */
export function ProductChoiceCard({ product, detail, selected, onSelect }: ProductChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative flex w-full items-center gap-5 rounded-lg border bg-white px-5 py-4 text-left transition-[border-color,box-shadow] duration-200 ${
        selected
          ? 'border-primary shadow-[0_0_0_1px_var(--sz-color-primary)]'
          : 'border-border hover:border-primary-border hover:shadow-card'
      }`}
    >
      <span className="relative size-20 shrink-0 overflow-hidden rounded-md bg-surface-muted">
        <SmartImage src={product.images[0].src} alt="" fit="contain" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold tracking-[0.1em] text-primary uppercase">
          {product.family}
        </span>
        <span className="mt-0.5 block text-xl font-bold tracking-tight text-navy-900">
          {product.name}
        </span>
        <span className="mt-0.5 block text-sm text-text-muted">{detail}</span>
      </span>
      <span
        aria-hidden
        className={`flex size-7 shrink-0 items-center justify-center rounded-full transition-colors ${
          selected ? 'bg-primary text-white' : 'border border-border-strong text-transparent'
        }`}
      >
        <Check className="size-4" strokeWidth={2.5} />
      </span>
    </button>
  )
}
