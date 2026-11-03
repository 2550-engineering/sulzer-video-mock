import { LogIn, ShoppingCart } from 'lucide-react'
import { useAuth } from '../../auth/useAuth'
import { eshopPages } from '../../data/eshopPages'

const copy = eshopPages.signIn

/** Cart and checkout when signed out: what an account gives, and Sign in. */
export function SignInRequired() {
  const { signIn } = useAuth()
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center rounded-lg border border-border bg-white px-8 py-14 text-center">
      <ShoppingCart aria-hidden className="size-10 text-primary" strokeWidth={1.5} />
      <h2 className="mt-4 text-xl font-bold text-navy-900">{copy.pageTitle}</h2>
      <p className="mt-2 text-text-muted">{copy.pageText}</p>
      <button
        type="button"
        onClick={() => signIn()}
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
      >
        <LogIn className="size-4" />
        {copy.pageAction}
      </button>
    </div>
  )
}
