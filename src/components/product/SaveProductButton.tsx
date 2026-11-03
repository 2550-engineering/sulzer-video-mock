import { Bookmark } from 'lucide-react'
import { productPage } from '../../data/catalogPages'
import { personalToolbar } from '../../data/personal'
import { usePersonal } from '../../personal/usePersonal'
import { useToast } from '../../toast/useToast'
import type { Product } from '../../types'

const copy = productPage.save

/** Round bookmark button on the product header: adds the product to Saved items, or takes it out. */
export function SaveProductButton({ product }: { product: Product }) {
  const { isSaved, toggleSaved } = usePersonal()
  const showToast = useToast()
  const item = { kind: 'product', id: product.id } as const
  const saved = isSaved(item)

  function toggle() {
    const added = toggleSaved(item)
    showToast({
      message: added ? copy.added : copy.removed,
      detail: product.name,
      action: added ? { label: copy.view, to: personalToolbar.saved.to } : undefined,
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? copy.remove : copy.add}
      title={saved ? copy.remove : copy.add}
      className={`flex size-12 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color,scale] duration-200 active:scale-95 ${
        saved
          ? 'border-primary bg-primary-tint text-primary'
          : 'border-border-strong text-navy-900 hover:border-primary hover:text-primary'
      }`}
    >
      <Bookmark className="size-5" strokeWidth={1.75} fill={saved ? 'currentColor' : 'none'} />
    </button>
  )
}
