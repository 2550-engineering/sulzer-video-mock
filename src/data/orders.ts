import { demoUser, partnerPricing } from '../config/demo'
import type { SalesOrder, OrderLine, TrackingEvent } from '../types'
import { customers } from './assets'
import { issuers } from './quotations'
import { catalogueItem as partOfKind, type CatalogueItem } from '../lib/catalogParts'

/*
 * Orders with track & trace ("/self-service/orders"). End users see their own direct
 * orders; the channel partner sees the orders they placed for their customers, at
 * partner prices. Checkout adds new orders through the self-service context. Order
 * numbers, addresses, carriers and dates are invented: see docs/content-to-confirm.md.
 */

/** Where Sulzer ships spare parts from, and how. */
export const shipping = {
  from: 'Sulzer distribution center, Norrköping',
  carrier: 'Sulzer Logistics road freight',
  method: 'Standard road freight, 2–3 days',
}

/** Nordvatten's goods reception: seed orders and the default checkout address. */
export const nordvattenAddress = [
  demoUser.company,
  'Goods reception, Norra water treatment plant',
  'Verksvägen 21',
  '721 34 Västerås',
  'Sweden',
]

/** Partner orders go to the customer, care of the partner's contact there. */
function customerAddress(customerId: string, street: string, postcode: string) {
  const customer = customers.find((c) => c.id === customerId)
  return [
    customer?.name ?? '',
    `Attn. ${customer?.contact.name ?? ''}`,
    street,
    `${postcode} ${customer?.city ?? ''}`,
    'Sweden',
  ]
}

function line(
  position: number,
  part: Pick<CatalogueItem, 'partNumber' | 'name' | 'listPrice'>,
  quantity: number,
  assetId?: string,
): OrderLine {
  const { partNumber, name, listPrice } = part
  return {
    position,
    partNumber,
    description: name,
    quantity,
    listPrice,
    ...(assetId ? { assetId } : {}),
  }
}

/** When an eShop order placed in the demo is confirmed, on `demoClock.today`. */
export const checkoutTime = '09:48'

/** How an eShop order ships, as the order page shows it. */
export const eshopDeliveryMethods = {
  complete: 'Complete delivery, standard freight',
  partial: 'Partial deliveries as items are ready, standard freight',
}

/** XFP 100C has no online parts list yet, so its past order keeps the part as ordered. */
const xfp100BottomPlate = {
  partNumber: '71540101',
  name: 'Contrablock bottom plate, adjustable, grey cast iron',
  listPrice: 410,
}

/** The track & trace steps an order went through, oldest first. */
function events(steps: {
  confirmed: string
  packed?: string
  shipped?: string
  terminal?: [string, string]
  outForDelivery?: string
  delivered?: string
  city: string
}): TrackingEvent[] {
  const list: TrackingEvent[] = [
    {
      at: steps.confirmed,
      text: 'Order confirmed',
      location: 'Sulzer customer service',
      status: 'Confirmed',
    },
  ]
  if (steps.packed)
    list.push({
      at: steps.packed,
      text: 'Picked and packed',
      location: shipping.from,
      status: 'Packed',
    })
  if (steps.shipped)
    list.push({
      at: steps.shipped,
      text: 'Handed to carrier',
      location: shipping.from,
      status: 'Shipped',
    })
  if (steps.terminal)
    list.push({ at: steps.terminal[0], text: 'Arrived at terminal', location: steps.terminal[1] })
  if (steps.outForDelivery)
    list.push({ at: steps.outForDelivery, text: 'Out for delivery', location: steps.city })
  if (steps.delivered)
    list.push({ at: steps.delivered, text: 'Delivered', location: steps.city, status: 'Delivered' })
  return list
}

const nordvatten = demoUser.customerId
/** Models of the units the seed orders are for: RW-01/02/03 and BW-01. */
const rw = 'ahlstar-150-125-315'
const bw01 = 'ahlstar-200-150-400'
const direct = {
  customerId: nordvatten,
  channel: 'direct',
  placedBy: demoUser.name,
  discount: 0,
} as const
const partner = (customerId: string) =>
  ({
    customerId,
    channel: 'partner',
    placedBy: issuers.partner.name,
    discount: partnerPricing.discount,
  }) as const

const parcel = (trackingNumber: string, packages: number, weight: string) => ({
  carrier: shipping.carrier,
  trackingNumber,
  packages,
  weight,
})

export const orderSeeds: SalesOrder[] = [
  // ── Nordvatten's own orders ─────────────────────────────────────────────────
  {
    id: 'SO-104388',
    ...direct,
    placedAt: '2026-10-26T11:02',
    poNumber: 'PO 2026-1187',
    status: 'Confirmed',
    expectedDelivery: '2026-11-06',
    deliveryAddress: nordvattenAddress,
    deliveryMethod: shipping.method,
    events: events({ confirmed: '2026-10-26T11:40', city: 'Västerås' }),
    shippingCost: 45,
    lines: [
      line(10, partOfKind(bw01, 'seal-kit'), 1, 'bw-01'),
      line(20, partOfKind(bw01, 'bearing-kit'), 1, 'bw-01'),
    ],
  },
  {
    id: 'SO-104386',
    ...direct,
    placedAt: '2026-10-23T09:30',
    poNumber: 'PO 2026-1172',
    status: 'Shipped',
    expectedDelivery: '2026-10-29',
    deliveryAddress: nordvattenAddress,
    deliveryMethod: shipping.method,
    shipment: parcel('SZL 3740 1179 2281', 1, '6.4 kg'),
    events: events({
      confirmed: '2026-10-23T09:48',
      packed: '2026-10-26T10:15',
      shipped: '2026-10-26T15:45',
      terminal: ['2026-10-28T05:55', 'Västerås terminal'],
      city: 'Västerås',
    }),
    shippingCost: 45,
    lines: [line(10, partOfKind(rw, 'seal'), 2)],
  },
  {
    id: 'SO-104382',
    ...direct,
    placedAt: '2026-10-21T10:05',
    poNumber: 'WO 2026-311 Hamnen',
    quotationId: 'Q-10198',
    status: 'Shipped',
    expectedDelivery: '2026-10-30',
    deliveryAddress: nordvattenAddress,
    deliveryMethod: shipping.method,
    shipment: parcel('SZL 3740 1182 6629', 2, '18.2 kg'),
    events: events({
      confirmed: '2026-10-21T10:20',
      packed: '2026-10-24T14:20',
      shipped: '2026-10-27T16:20',
      terminal: ['2026-10-28T06:40', 'Örebro terminal'],
      city: 'Västerås',
    }),
    // The quotation's 12% agreement discount, as list prices on the order.
    discount: 12,
    shippingCost: 0,
    lines: [
      line(10, partOfKind('xfp-150-e', 'seal-kit'), 1, 'p-210'),
      line(20, partOfKind('xfp-150-e', 'seal-kit'), 1, 'p-211'),
      line(30, partOfKind('xfp-150-e', 'seal-kit'), 1, 'p-212'),
      line(40, partOfKind('xfp-150-e', 'bottom-plate'), 3),
    ],
  },
  {
    id: 'SO-104301',
    ...direct,
    placedAt: '2026-09-22T14:18',
    poNumber: 'PO 2026-1034',
    status: 'Delivered',
    expectedDelivery: '2026-10-02',
    deliveryAddress: nordvattenAddress,
    deliveryMethod: shipping.method,
    shipment: parcel('SZL 3740 0964 1170', 1, '21.5 kg'),
    events: events({
      confirmed: '2026-09-22T14:30',
      packed: '2026-09-29T09:40',
      shipped: '2026-09-29T15:10',
      outForDelivery: '2026-10-02T07:25',
      delivered: '2026-10-02T10:48',
      city: 'Västerås',
    }),
    shippingCost: 45,
    lines: [line(10, partOfKind(rw, 'impeller'), 1, 'rw-01')],
  },
  {
    id: 'SO-104255',
    ...direct,
    placedAt: '2026-08-28T08:50',
    poNumber: 'PO 2026-0952',
    status: 'Delivered',
    expectedDelivery: '2026-09-09',
    deliveryAddress: nordvattenAddress,
    deliveryMethod: shipping.method,
    shipment: parcel('SZL 3740 0811 5023', 1, '9.6 kg'),
    events: events({
      confirmed: '2026-08-28T09:05',
      packed: '2026-09-04T11:30',
      shipped: '2026-09-04T16:00',
      outForDelivery: '2026-09-09T07:10',
      delivered: '2026-09-09T09:32',
      city: 'Västerås',
    }),
    shippingCost: 45,
    lines: [
      line(10, xfp100BottomPlate, 1, 'p-102'),
      line(20, xfp100BottomPlate, 1, 'p-103'),
      line(30, xfp100BottomPlate, 1, 'p-104'),
    ],
  },

  // ── Aqua Pumpteknik's orders for their customers ────────────────────────────
  {
    id: 'SO-104389',
    ...partner('vastmalm-energi'),
    placedAt: '2026-10-27T13:15',
    poNumber: 'AP-PO 26-0733',
    status: 'Confirmed',
    expectedDelivery: '2026-11-17',
    deliveryAddress: customerAddress('vastmalm-energi', 'Kraftvärmevägen 4', '733 36'),
    deliveryMethod: shipping.method,
    events: events({ confirmed: '2026-10-27T13:40', city: 'Sala' }),
    shippingCost: 45,
    lines: [line(10, partOfKind(rw, 'impeller'), 1), line(20, partOfKind(rw, 'bearing-kit'), 2)],
  },
  {
    id: 'SO-104387',
    ...partner('malarbruk'),
    placedAt: '2026-10-22T09:12',
    poNumber: 'AP-PO 26-0721',
    quotationId: 'AQ-26-0409',
    status: 'Shipped',
    expectedDelivery: '2026-10-29',
    deliveryAddress: customerAddress('malarbruk', 'Bruksgatan 1, gate 3', '731 36'),
    deliveryMethod: shipping.method,
    shipment: parcel('SZL 3740 1180 4417', 1, '11.8 kg'),
    events: events({
      confirmed: '2026-10-22T09:30',
      packed: '2026-10-26T13:05',
      shipped: '2026-10-26T16:40',
      terminal: ['2026-10-28T06:10', 'Västerås terminal'],
      city: 'Köping',
    }),
    shippingCost: 45,
    lines: [line(10, partOfKind('ahlstar-80-65-160', 'seal'), 4)],
  },
  {
    id: 'SO-104368',
    ...partner('sorby-livsmedel'),
    placedAt: '2026-10-07T15:20',
    poNumber: 'AP-PO 26-0698',
    status: 'Delivered',
    expectedDelivery: '2026-10-14',
    deliveryAddress: customerAddress('sorby-livsmedel', 'Mejerivägen 12', '632 20'),
    deliveryMethod: shipping.method,
    shipment: parcel('SZL 3740 1043 9958', 1, '4.1 kg'),
    events: events({
      confirmed: '2026-10-07T15:35',
      packed: '2026-10-12T10:20',
      shipped: '2026-10-12T15:30',
      outForDelivery: '2026-10-14T07:45',
      delivered: '2026-10-14T11:05',
      city: 'Eskilstuna',
    }),
    shippingCost: 45,
    lines: [line(10, partOfKind('ahlstar-50-32-200', 'seal'), 2)],
  },
]
