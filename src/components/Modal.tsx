import { X } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useDismiss } from '../hooks/useDismiss'

type ModalProps = {
  open: boolean
  title: string
  closeLabel: string
  onClose: () => void
  /** Tailwind max-width class for the dialog, e.g. "max-w-4xl". */
  width?: string
  children: ReactNode
}

/**
 * Centred dialog over a dimmed page. Rendered in <body>, so transformed
 * ancestors (like a fading tab panel) can't move it. Esc, the close button
 * and a click outside close it; focus moves to the close button on open.
 */
export function Modal({
  open,
  title,
  closeLabel,
  onClose,
  width = 'max-w-4xl',
  children,
}: ModalProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useDismiss(dialogRef, open, onClose)

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
    <div inert={!open} className="fixed inset-0 z-[70] flex items-center justify-center p-6">
      <div
        aria-hidden
        className={`absolute inset-0 bg-navy-900/55 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative flex max-h-full w-full ${width} flex-col overflow-hidden rounded-lg bg-white shadow-[0_32px_80px_-24px_rgba(12,28,46,0.55)] transition-[opacity,scale] duration-200 ease-sz ${
          open ? 'scale-100 opacity-100' : 'pointer-events-none scale-[0.97] opacity-0'
        }`}
      >
        <div className="flex items-center justify-between gap-6 border-b border-border px-7 py-4">
          <h2 id={titleId} className="truncate text-lg font-bold tracking-tight text-navy-900">
            {title}
          </h2>
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
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
