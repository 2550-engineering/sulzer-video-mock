import { createContext } from 'react'
import type { NavItem } from '../types'

export type ToastMessage = {
  message: string
  /** Second line, e.g. the item that was added. */
  detail?: string
  /** Link on the right, e.g. "View" → /my-projects. */
  action?: NavItem
}

export const ToastContext = createContext<((toast: ToastMessage) => void) | null>(null)
