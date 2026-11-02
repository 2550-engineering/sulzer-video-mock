import { demoClock } from '../config/demo'
import { customers } from '../data/assets'
import { checkoutTime } from '../data/eshop'
import { nordvattenAddress } from '../data/orders'
import { issuers } from '../data/quotations'
import type { CartLine, DeliveryOption, Order, OrderLine, SparePart, User } from '../types'
import { discountFor, leadTime } from './pricing'

/* Checkout: delivery addresses, delivery dates and the order a cart becomes. */

export type DeliveryAddress = { id: string; label: string; lines: string[] }

/** The addresses on the user's account. Partners get their own warehouse. */
export function deliveryAddressesFor(user: User): DeliveryAddress[] {
  if (user.kind === 'partner') {
    return [
      {
        id: 'warehouse',
        label: `${user.company} warehouse`,
        lines: [user.company, 'Goods reception', ...issuers.partner.address],
      },
    ]
  }
  return [
    { id: 'goods-reception', label: nordvattenAddress[1], lines: nordvattenAddress },
    {
      id: 'riverside-intake',
      label: 'Riverside intake',
      lines: [
        user.company,
        'Riverside intake pump house',
        'Strandvägen 4',
        '721 30 Västerås',
        'Sweden',
      ],
    },
  ]
}

/** The ISO date `days` working days (Mon–Fri) after `iso`. */
export function addWorkingDays(iso: string, days: number) {
  const date = new Date(`${iso}T00:00:00Z`)
  let left = days
  while (left > 0) {
    date.setUTCDate(date.getUTCDate() + 1)
    const weekday = date.getUTCDay()
    if (weekday !== 0 && weekday !== 6) left -= 1
  }
  return date.toISOString().slice(0, 10)
}

/** When the order arrives: the slowest part ships, then the delivery takes its days. */
export function expectedDelivery(parts: SparePart[], option: DeliveryOption) {
  const dispatch = Math.max(0, ...parts.map((part) => leadTime(part.availability).dispatchDays))
  return addWorkingDays(demoClock.today, dispatch + option.days)
}

/** The next free order number after every order so far. */
export function nextOrderId(orders: Order[]) {
  const numbers = orders.map((order) => Number(order.id.replace(/\D/g, ''))).filter(Boolean)
  return `SO-${Math.max(104399, ...numbers) + 1}`
}

type NewOrder = {
  user: User
  /** Cart lines with their parts looked up. */
  lines: { line: CartLine; part: SparePart }[]
  option: DeliveryOption
  address: DeliveryAddress
  poNumber: string
  /** Every order so far, for the next number. */
  orders: Order[]
}

/**
 * The order a checkout places: confirmed now, at the user's discount. Partners order for
 * their customer; until the partner layer adds a customer choice, that is the first one.
 */
export function buildOrder({ user, lines, option, address, poNumber, orders }: NewOrder): Order {
  const placedAt = `${demoClock.today}T${checkoutTime}`
  const orderLines: OrderLine[] = lines.map(({ line, part }, i) => ({
    position: (i + 1) * 10,
    partNumber: part.partNumber,
    description: part.name,
    quantity: line.quantity,
    listPrice: part.listPrice,
    ...(line.assetId ? { assetId: line.assetId } : {}),
  }))
  return {
    id: nextOrderId(orders),
    customerId: user.customerId ?? customers[0].id,
    channel: user.kind === 'partner' ? 'partner' : 'direct',
    placedAt,
    placedBy: user.name,
    poNumber,
    status: 'Confirmed',
    expectedDelivery: expectedDelivery(
      lines.map(({ part }) => part),
      option,
    ),
    deliveryAddress: address.lines,
    deliveryMethod: `${option.label}, ${option.detail.charAt(0).toLowerCase()}${option.detail.slice(1)}`,
    events: [
      {
        at: placedAt,
        text: 'Order confirmed',
        location: 'Sulzer customer service',
        status: 'Confirmed',
      },
    ],
    discount: discountFor(user),
    shippingCost: option.price,
    lines: orderLines,
  }
}
