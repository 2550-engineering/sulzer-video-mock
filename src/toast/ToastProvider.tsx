import { CircleCheck } from 'lucide-react'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { ToastContext, type ToastMessage } from './ToastContext'

/** How long a toast stays up. Fixed, so recordings are the same every time. */
const visibleMs = 3000

/**
 * Shows one toast at a time, top right under the sticky header and above dialogs. A new toast
 * replaces the current one and restarts the timer.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<(ToastMessage & { id: number }) | null>(null)
  const [open, setOpen] = useState(false)

  const show = useCallback((message: ToastMessage) => {
    setToast((current) => ({ ...message, id: (current?.id ?? 0) + 1 }))
    setOpen(true)
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setOpen(false), visibleMs)
    return () => clearTimeout(timer)
  }, [toast])

  return (
    <ToastContext value={show}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed top-[calc(var(--sz-header-height)+16px)] right-6 z-[80]"
      >
        {toast && (
          <div
            key={toast.id}
            inert={!open}
            className={`flex max-w-md min-w-80 items-center gap-3 rounded-lg bg-navy-900 py-3.5 pr-4 pl-4 text-white shadow-raised duration-200 ease-sz on-dark ${
              open
                ? 'pointer-events-auto translate-y-0 animate-fade-in opacity-100 transition-[opacity,translate]'
                : '-translate-y-1.5 opacity-0 transition-[opacity,translate]'
            }`}
          >
            <CircleCheck className="size-5 shrink-0 text-success" strokeWidth={2} />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold">{toast.message}</p>
              {toast.detail && <p className="text-sm text-text-on-dark-muted">{toast.detail}</p>}
            </div>
            {toast.action && (
              <Link
                to={toast.action.to}
                className="rounded-sm px-2 py-1 text-sm font-semibold text-primary-on-dark transition-colors hover:text-white"
              >
                {toast.action.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </ToastContext>
  )
}
