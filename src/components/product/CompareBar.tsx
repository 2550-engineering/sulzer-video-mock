import { X } from 'lucide-react'
import { productPage } from '../../data/catalogPages'
import { compareColors } from '../../lib/modelSpecs'
import type { ProductModel } from '../../types'

const copy = productPage.models.compare

type CompareBarProps = {
  models: ProductModel[]
  onRemove: (id: string) => void
  onClear: () => void
  onOpen: () => void
}

/** Bar that slides up from the bottom while models are selected for comparison. */
export function CompareBar({ models, onRemove, onClear, onOpen }: CompareBarProps) {
  const open = models.length > 0
  return (
    <div
      inert={!open}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 shadow-[0_-12px_32px_-16px_rgba(12,28,46,0.25)] backdrop-blur-sm transition-transform duration-250 ease-sz ${
        open ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* Right padding keeps the buttons clear of the chat button at 1440 px. */}
      <div className="site-container flex flex-wrap items-center gap-x-6 gap-y-3 py-4 lg:pr-24">
        <p className="text-sm font-semibold text-navy-900">{copy.bar(models.length)}</p>
        <ul className="flex flex-wrap gap-2">
          {models.map((model, i) => (
            <li
              key={model.id}
              className="inline-flex animate-fade-in items-center gap-2 rounded-pill border border-border bg-surface-muted py-1 pr-1 pl-3 text-sm font-medium text-navy-900"
            >
              <span
                aria-hidden
                className="size-2.5 rounded-full"
                style={{ background: compareColors[i] }}
              />
              {model.name} · {model.frequency} Hz
              <button
                type="button"
                onClick={() => onRemove(model.id)}
                aria-label={copy.remove(model.name)}
                className="flex size-6 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-white hover:text-navy-900"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex items-center gap-4">
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            {copy.clear}
          </button>
          <button
            type="button"
            onClick={onOpen}
            disabled={models.length < 2}
            title={models.length < 2 ? copy.needTwo : undefined}
            className="inline-flex h-11 items-center rounded-pill bg-primary px-6 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-border-strong disabled:shadow-none"
          >
            {copy.open(models.length)}
          </button>
        </div>
      </div>
    </div>
  )
}
