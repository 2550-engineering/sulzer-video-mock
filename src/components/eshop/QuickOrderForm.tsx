import { CircleAlert, ShoppingCart } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useAddToCart } from '../../cart/useAddToCart'
import { eshopPage } from '../../data/eshop'
import { partByNumber } from '../../lib/spareParts'
import { QuantityStepper } from '../spareparts/QuantityStepper'

const copy = eshopPage.quickOrder

/** Part number and quantity straight into the cart. Unknown numbers get an inline message. */
export function QuickOrderForm() {
  const addToCart = useAddToCart()
  const [partNumber, setPartNumber] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [notFound, setNotFound] = useState<string>()

  function submit(event: FormEvent) {
    event.preventDefault()
    const number = partNumber.trim()
    if (!number) return
    const part = partByNumber(number)
    if (!part) {
      setNotFound(number)
      return
    }
    addToCart(part, quantity)
    setPartNumber('')
    setQuantity(1)
    setNotFound(undefined)
  }

  return (
    <form onSubmit={submit} aria-label={copy.title}>
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex min-w-56 flex-1 flex-col gap-1.5 text-sm">
          <span className="font-semibold text-navy-900">{copy.partNumber}</span>
          <input
            type="text"
            inputMode="numeric"
            value={partNumber}
            onChange={(e) => {
              setPartNumber(e.target.value)
              setNotFound(undefined)
            }}
            placeholder={copy.placeholder}
            aria-invalid={notFound !== undefined || undefined}
            className="h-12 rounded-md border border-border-strong bg-white px-4 text-[17px] text-text tabular-nums transition-[border-color,box-shadow] placeholder:text-text-subtle focus:border-primary focus:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none aria-invalid:border-danger"
          />
        </label>
        <div className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold text-navy-900">{copy.quantity}</span>
          <div className="flex h-12 items-center">
            <QuantityStepper value={quantity} onChange={setQuantity} label={copy.quantity} />
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex h-12 items-center gap-2 rounded-pill bg-primary px-6 text-[15px] font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          <ShoppingCart className="size-[18px]" strokeWidth={1.75} />
          {copy.add}
        </button>
      </div>
      {notFound && (
        <p
          role="alert"
          className="mt-3 flex animate-fade-in items-center gap-2 text-sm text-danger"
        >
          <CircleAlert className="size-4 shrink-0" />
          {copy.notFound(notFound)}
        </p>
      )}
    </form>
  )
}
