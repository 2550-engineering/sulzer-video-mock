import { createContext } from 'react'
import type { Order, ServiceRequest } from '../types'

export type SelfServiceState = {
  /** Every service request: sent in this demo first, then the seeds. Filter with `requestsFor`. */
  requests: ServiceRequest[]
  /** Every order: placed in this demo first, then the seeds. Filter with `ordersFor`. */
  orders: Order[]
  /** Adds a request at the top, replacing one with the same id (the reference is fixed). */
  addServiceRequest: (request: ServiceRequest) => void
  /** Adds an order at the top, e.g. from checkout. */
  addOrder: (order: Order) => void
}

export const SelfServiceContext = createContext<SelfServiceState | null>(null)
