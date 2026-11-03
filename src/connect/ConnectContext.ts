import { createContext } from 'react'
import type { ConnectAlert } from '../lib/connect'
import type { Asset } from '../types'

export type ConnectState = {
  /** The signed-in persona's assets, connected or not. */
  assets: Asset[]
  /** Every alert on those assets, newest first. */
  alerts: ConnectAlert[]
  /** Active alerts nobody has acknowledged yet. */
  open: ConnectAlert[]
  /** Who acknowledged an alert, by alert id. Local state only: resets on reload. */
  acknowledgedBy: Record<string, string>
  acknowledge: (alertId: string) => void
}

export const ConnectContext = createContext<ConnectState | null>(null)
