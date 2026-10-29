import { X } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useDismiss } from '../hooks/useDismiss'

type DrawerProps = {
  open: boolean
  title: string
  /** Small line under the title. */
  subtitle?: string
  closeLabel: string
  onClose: () => void
  children: ReactNode
}

/**
 * Panel that slides in from the right over a dimmed page. Rendered in <body>;
 * Esc, the close button and a click outside close it, and focus moves to the
 * close button on open and back afterwards.
 */
export function Drawer({ open, title, subtitle, closeLabel, onClose, children }: DrawerProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useDismiss(panelRef, open, onClose)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
      previous?.focus()
    }
  }, [open])

  return createPortal(
    <div inert={!open} className="fixed inset-0 z-[70]">
      <div
        aria-hidden
        className={`absolute inset-0 bg-navy-900/45 transition-opacity duration-250 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`absolute inset-y-0 right-0 flex w-full max-w-4xl flex-col bg-white shadow-[-24px_0_60px_-24px_rgba(12,28,46,0.4)] transition-transform duration-250 ease-sz ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between gap-6 border-b border-border px-8 py-5">
          <div className="min-w-0">
            <h2 id={titleId} className="text-xl font-bold tracking-tight text-brand">
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-sm text-text-muted tabular-nums">{subtitle}</p>}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-navy-900 transition-colors hover:bg-surface-muted"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-7">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
