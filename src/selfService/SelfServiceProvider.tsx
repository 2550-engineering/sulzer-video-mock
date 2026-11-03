import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { orderSeeds } from '../data/orders'
import { quotations as quotationSeeds } from '../data/quotations'
import { serviceRequestSeeds } from '../data/serviceRequests'
import { mergeById, upsert } from '../lib/selfService'
import type { Order, Quotation, ServiceRequest } from '../types'
import { SelfServiceContext, type SelfServiceState } from './SelfServiceContext'

// Versioned. Shared by every persona: a request Emma sends shows up for her partner too.
const storageKey = 'sz-demo-self-service-v1'

type Added = { requests: ServiceRequest[]; orders: Order[]; quotations: Quotation[] }

const empty: Added = { requests: [], orders: [], quotations: [] }

const hasIds = (value: unknown): value is { id: string }[] =>
  Array.isArray(value) && value.every((item) => typeof item?.id === 'string')

function readAdded(): Added {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    return {
      requests: hasIds(stored?.requests) ? (stored.requests as ServiceRequest[]) : [],
      orders: hasIds(stored?.orders) ? (stored.orders as Order[]) : [],
      quotations: hasIds(stored?.quotations) ? (stored.quotations as Quotation[]) : [],
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
 * Service requests, orders and quotations added during the demo (sent requests,
 * checkout orders, quotations made from a project),
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
      quotations: mergeById(state.added.quotations, quotationSeeds),
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
      saveQuotation: (quotation) =>
        setState(({ added }) => ({
          added: { ...added, quotations: upsert(added.quotations, quotation) },
          changed: true,
        })),
    }),
    [state.added],
  )

  return <SelfServiceContext value={value}>{children}</SelfServiceContext>
}
