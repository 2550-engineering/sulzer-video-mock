import { GitCompareArrows, Share2 } from 'lucide-react'
import { variantPage } from '../../data/variantPages'
import { useToast } from '../../toast/useToast'
import { IconButton } from '../IconButton'

const copy = variantPage.toolbar
const toasts = variantPage.toasts

/** Icon row under the product image: Compare and Share, each confirmed with a toast. */
export function VariantToolbar() {
  const showToast = useToast()
  return (
    <div role="toolbar" aria-label={copy.label} className="flex items-center justify-center gap-1">
      <IconButton
        icon={GitCompareArrows}
        label={copy.compare}
        onClick={() => showToast({ message: toasts.compare, detail: toasts.compareDetail })}
      />
      <IconButton
        icon={Share2}
        label={copy.share}
        onClick={() => showToast({ message: toasts.share, detail: toasts.shareDetail })}
      />
    </div>
  )
}
