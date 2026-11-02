import { LogIn, ShoppingCart } from 'lucide-react'
import { eshopPages } from '../../data/eshopPages'
import { Modal } from '../Modal'

const copy = eshopPages.signIn

type SignInToOrderDialogProps = {
  open: boolean
  onClose: () => void
  /** Signs in and adds the article that was waiting. */
  onConfirm: () => void
}

/** "Add to cart" while signed out: sign in first, then the article is added. */
export function SignInToOrderDialog({ open, onClose, onConfirm }: SignInToOrderDialogProps) {
  return (
    <Modal
      open={open}
      title={copy.title}
      closeLabel={copy.close}
      onClose={onClose}
      width="max-w-md"
    >
      <div className="flex flex-col items-center px-8 py-9 text-center">
        <ShoppingCart aria-hidden className="size-10 text-primary" strokeWidth={1.5} />
        <p className="mt-4 max-w-sm text-text-muted">{copy.text}</p>
        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center rounded-pill px-5 text-sm font-semibold text-navy-900 transition-colors hover:bg-surface-muted"
          >
            {copy.cancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <LogIn className="size-4" />
            {copy.action}
          </button>
        </div>
      </div>
    </Modal>
  )
}
