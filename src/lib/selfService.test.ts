import { describe, expect, it } from 'vitest'
import { personas } from '../config/demo'
import { orderSeeds } from '../data/orders'
import { quotations } from '../data/quotations'
import { recentActivity } from '../data/myPages'
import { serviceRequestSeeds } from '../data/serviceRequests'
import { partOfKind } from '../data/spareParts'
import {
  isInTransit,
  isOpenRequest,
  mergeById,
  orderTotals,
  ordersFor,
  partnerMargin,
  quotationTotals,
  quotationsFor,
  requestsFor,
  upsert,
} from './selfService'

const { endUser, channelPartner } = personas

describe('who sees what', () => {
  it('shows the end user their direct orders and Sulzer quotations only', () => {
    expect(ordersFor(endUser, orderSeeds).every((o) => o.channel === 'direct')).toBe(true)
    expect(quotationsFor(endUser).every((q) => q.issuer === 'sulzer')).toBe(true)
  })

  it('shows the partner their own orders and quotations, for several customers', () => {
    const orders = ordersFor(channelPartner, orderSeeds)
    expect(orders.every((o) => o.channel === 'partner')).toBe(true)
    expect(new Set(orders.map((o) => o.customerId)).size).toBeGreaterThan(1)
    expect(quotationsFor(channelPartner).every((q) => q.issuer === 'partner')).toBe(true)
  })

  it('shows requests on assets the persona sees', () => {
    expect(requestsFor(endUser, serviceRequestSeeds)).toHaveLength(serviceRequestSeeds.length)
    expect(requestsFor(channelPartner, serviceRequestSeeds)).toHaveLength(
      serviceRequestSeeds.length,
    )
  })
})

describe('My Pages', () => {
  it('links its activity to orders and quotations that exist', () => {
    const ids = [...orderSeeds, ...quotations].map((item) => item.id)
    const linked = recentActivity.items
      .map((item) => item.to.match(/\/self-service\/\w+\/(.+)$/)?.[1])
      .filter((id) => id !== undefined)
    expect(linked).toEqual(['Q-10234', 'SO-104382'])
    for (const id of linked) expect(ids).toContain(id)
  })

  it('has two orders in transit and one open request before the demo sends one', () => {
    expect(
      ordersFor(endUser, orderSeeds)
        .filter(isInTransit)
        .map((o) => o.id),
    ).toEqual(['SO-104390', 'SO-104382'])
    expect(serviceRequestSeeds.filter(isOpenRequest)).toHaveLength(1)
  })
})

describe('totals', () => {
  it('nets list prices by the order discount and adds shipping', () => {
    const order = orderSeeds.find((o) => o.id === 'SO-104382')!
    const totals = orderTotals(order)
    // Three XFP 150E seal kits and three bottom plates.
    const seal = partOfKind('xfp-150-e', 'seal-kit').listPrice
    const plate = partOfKind('xfp-150-e', 'bottom-plate').listPrice
    expect(totals.list).toBe(3 * seal + 3 * plate)
    expect(totals.net).toBeCloseTo(totals.list * 0.88, 2)
    expect(totals.total).toBe(totals.net + order.shippingCost)
  })

  it('matches the quotation an order came from', () => {
    const order = orderSeeds.find((o) => o.id === 'SO-104382')!
    const quotation = quotations.find((q) => q.id === order.quotationId)!
    expect(quotation.orderId).toBe(order.id)
    expect(orderTotals(order).net).toBe(quotationTotals(quotation).net)
  })

  it('gives the partner a margin on Sulzer lines only', () => {
    const quotation = quotations.find((q) => q.id === 'AQ-26-0418')!
    const { cost, margin, services } = partnerMargin(quotation)
    expect(services).toBeGreaterThan(0)
    expect(margin).toBeGreaterThan(0)
    expect(cost + margin + services).toBeCloseTo(quotationTotals(quotation).net, 2)
  })
})

describe('added items', () => {
  it('puts added items first and replaces seeds with the same id', () => {
    const seeds = [{ id: 'a' }, { id: 'b' }]
    expect(mergeById([{ id: 'b' }, { id: 'c' }], seeds).map((x) => x.id)).toEqual(['b', 'c', 'a'])
    expect(upsert([{ id: 'a' }, { id: 'b' }], { id: 'b' }).map((x) => x.id)).toEqual(['b', 'a'])
  })
})
