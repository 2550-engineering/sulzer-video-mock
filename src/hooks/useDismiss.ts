import { useEffect, type RefObject } from 'react'

/** Calls `onDismiss` on a pointer press outside `ref` or on Escape, while `active`. */
export function useDismiss(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onDismiss: () => void,
) {
  useEffect(() => {
    if (!active) return

    function handlePointerDown(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) onDismiss()
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onDismiss()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [ref, active, onDismiss])
}
