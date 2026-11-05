import { market, partnerPricing } from '../config/demo'
import { quotations } from '../data/quotations'
import type {
  SalesOrder,
  OrderStatus,
  SalesQuotation,
  ServiceRequest,
  ServiceRequestStatus,
  User,
} from '../types'
import { assetsFor } from './connect'

/* Pure helpers behind requests, orders and quotations (self-service/SelfServiceProvider.tsx). */

export const requestSteps: ServiceRequestStatus[] = [
  'Received',
  'Planned',
  'Technician assigned',
  'Done',
]

export const orderSteps: OrderStatus[] = ['Confirmed', 'Packed', 'Shipped', 'Delivered']

/** Items added in this session first (newest first), then the seeds, one per id. */
export function mergeById<T extends { id: string }>(added: T[], seeds: T[]) {
  const ids = new Set(added.map((item) => item.id))
  return [...added, ...seeds.filter((item) => !ids.has(item.id))]
}

/** Adds the item at the top, replacing an earlier one with the same id. */
export function upsert<T extends { id: string }>(items: T[], item: T) {
  return [item, ...items.filter((existing) => existing.id !== item.id)]
}

/* ── Who sees what ─────────────────────────────────────────────────────────── */

/** Requests on the assets the persona sees: their own, or every customer's for a partner. */
export function requestsFor(user: User, requests: ServiceRequest[]) {
  const assetIds = new Set(assetsFor(user).map((asset) => asset.id))
  return requests.filter((request) => assetIds.has(request.assetId))
}

/** A customer's direct orders, or the orders a partner placed for their customers. */
export function ordersFor(user: User, orders: SalesOrder[]) {
  return orders.filter((order) =>
    user.kind === 'partner'
      ? order.channel === 'partner'
      : order.channel === 'direct' && order.customerId === user.customerId,
  )
}

/**
 * Sulzer's quotations to a customer, or a partner's own quotations to their customers
 * (drafts included: only the partner sees those).
 */
export function quotationsFor(user: User, all: SalesQuotation[] = quotations) {
  return all.filter((quotation) =>
    user.kind === 'partner'
      ? quotation.issuer === 'partner'
      : quotation.issuer === 'sulzer' && quotation.customerId === user.customerId,
  )
}

/* ── Status ────────────────────────────────────────────────────────────────── */

export const isOpenRequest = (request: ServiceRequest) => request.status !== 'Done'

export const isInTransit = (order: SalesOrder) => order.status === 'Shipped'

export const isOpenOrder = (order: SalesOrder) => order.status !== 'Delivered'

/** When each order step was reached, from its track & trace events. */
export function orderStepTimes(order: SalesOrder) {
  return Object.fromEntries(
    order.events.flatMap((event) => (event.status ? [[event.status, event.at]] : [])),
  ) as Partial<Record<OrderStatus, string>>
}

/* ── Money ─────────────────────────────────────────────────────────────────── */

const moneyFormat = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: market.currency,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** "€1,420.00": quotations and orders show cents. */
export const formatMoney = (amount: number) => moneyFormat.format(amount)

const cents = (amount: number) => Math.round(amount * 100) / 100

/** Net price per unit after a % discount, to the cent. */
export const netPrice = (listPrice: number, discount: number) =>
  cents(listPrice * (1 - discount / 100))

export function orderTotals(order: SalesOrder) {
  const list = cents(order.lines.reduce((sum, l) => sum + l.listPrice * l.quantity, 0))
  const net = cents(
    order.lines.reduce((sum, l) => sum + netPrice(l.listPrice, order.discount) * l.quantity, 0),
  )
  return {
    list,
    discount: cents(list - net),
    net,
    shipping: order.shippingCost,
    total: cents(net + order.shippingCost),
    items: order.lines.reduce((sum, l) => sum + l.quantity, 0),
  }
}

export function quotationTotals(quotation: SalesQuotation) {
  const list = cents(quotation.lines.reduce((sum, l) => sum + l.listPrice * l.quantity, 0))
  const net = cents(
    quotation.lines.reduce(
      (sum, l) => sum + netPrice(l.listPrice, quotation.discount) * l.quantity,
      0,
    ),
  )
  return { list, discount: cents(list - net), net }
}

/**
 * The partner's view of their own quotation: what the Sulzer lines cost them at the
 * partner discount, and the margin on those lines. Services are their own work.
 */
export function partnerMargin(quotation: SalesQuotation) {
  const sulzerLines = quotation.lines.filter((l) => l.kind === 'sulzer')
  const list = cents(sulzerLines.reduce((sum, l) => sum + l.listPrice * l.quantity, 0))
  const sell = cents(
    sulzerLines.reduce((sum, l) => sum + netPrice(l.listPrice, quotation.discount) * l.quantity, 0),
  )
  const cost = cents(
    sulzerLines.reduce(
      (sum, l) => sum + netPrice(l.listPrice, partnerPricing.discount) * l.quantity,
      0,
    ),
  )
  const services = cents(quotationTotals(quotation).net - sell)
  return {
    list,
    cost,
    margin: cents(sell - cost),
    marginPercent: sell > 0 ? Math.round(((sell - cost) / sell) * 1000) / 10 : 0,
    services,
  }
}
