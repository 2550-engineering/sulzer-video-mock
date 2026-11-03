import { useMemo, useState, type ReactNode } from 'react'
import { alertsFor, assetsFor } from '../lib/connect'
import type { User } from '../types'
import { ConnectContext, type ConnectState } from './ConnectContext'

/** Sulzer Connect state for the signed-in user: their assets, alerts and which alerts are acknowledged. */
export function ConnectProvider({ user, children }: { user: User; children: ReactNode }) {
  const [acknowledgedBy, setAcknowledgedBy] = useState<Record<string, string>>({})

  const value = useMemo<ConnectState>(() => {
    const assets = assetsFor(user)
    const alerts = alertsFor(assets.filter((asset) => asset.connected))
    return {
      assets,
      alerts,
      open: alerts.filter((alert) => alert.active && !acknowledgedBy[alert.id]),
      acknowledgedBy,
      acknowledge: (alertId) =>
        setAcknowledgedBy((current) => ({ ...current, [alertId]: user.name })),
    }
  }, [user, acknowledgedBy])

  return <ConnectContext value={value}>{children}</ConnectContext>
}
