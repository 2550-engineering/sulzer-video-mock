import { useContext } from 'react'
import { ToastContext } from './ToastContext'

/** Returns `show(toast)`, which shows a short confirmation under the header. */
export function useToast() {
  const show = useContext(ToastContext)
  if (!show) throw new Error('useToast must be used inside <ToastProvider>')
  return show
}
