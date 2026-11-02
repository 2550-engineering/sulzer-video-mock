import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { orderSeeds } from '../data/orders'
import { serviceRequestSeeds } from '../data/serviceRequests'
import { mergeById, upsert } from '../lib/selfService'
import type { Order, ServiceRequest } from '../types'
import { SelfServiceContext, type SelfServiceState } from './SelfServiceContext'

// Versioned. Shared by every persona: a request Emma sends shows up for her partner too.
const storageKey = 'sz-demo-self-service-v1'

type Added = { requests: ServiceRequest[]; orders: Order[] }

const empty: Added = { requests: [], orders: [] }

const hasIds = (value: unknown): value is { id: string }[] =>
  Array.isArray(value) && value.every((item) => typeof item?.id === 'string')

function readAdded(): Added {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    return {
      requests: hasIds(stored?.requests) ? (stored.requests as ServiceRequest[]) : [],
      orders: hasIds(stored?.orders) ? (stored.orders as Order[]) : [],
    }
  } catch {
    return empty
  }
}

function writeAdded(added: Added) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(added))
  } catch {
    // Storage unavailable (private mode etc.): keep the in-memory state only.
  }
}

/**
 * Service requests and orders added during the demo (sent requests, checkout orders),
 * on top of the seeds in data/. Kept in localStorage, so "Reset demo" clears them.
 */
export function SelfServiceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(() => ({ added: readAdded(), changed: false }))

  // Only changes made in this session are written back.
  useEffect(() => {
    if (state.changed) writeAdded(state.added)
  }, [state])

  const value = useMemo<SelfServiceState>(
    () => ({
      requests: mergeById(state.added.requests, serviceRequestSeeds),
      orders: mergeById(state.added.orders, orderSeeds),
      addServiceRequest: (request) =>
        setState(({ added }) => ({
          added: { ...added, requests: upsert(added.requests, request) },
          changed: true,
        })),
      addOrder: (order) =>
        setState(({ added }) => ({
          added: { ...added, orders: upsert(added.orders, order) },
          changed: true,
        })),
    }),
    [state.added],
  )

  return <SelfServiceContext value={value}>{children}</SelfServiceContext>
}
