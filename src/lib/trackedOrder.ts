import { demoClock } from '../config/demo'
import { checkoutTime, eshopDeliveryMethods } from '../data/orders'
import type { Order, SalesOrder, User } from '../types'
import { discountFor } from './pricing'

/**
 * An eShop order as a tracked order in /self-service/orders: confirmed now,
 * for the user's account or, for a partner, the customer it was placed for.
 */
export function trackedOrder(order: Order, user: User, address: string[]): SalesOrder {
  const placedAt = `${demoClock.today}T${checkoutTime}`
  return {
    id: order.id,
    customerId: order.customer?.id ?? user.customerId ?? '',
    channel: user.kind === 'partner' ? 'partner' : 'direct',
    placedAt,
    placedBy: order.placedBy,
    poNumber: order.reference,
    status: 'Confirmed',
    expectedDelivery: order.latestDelivery,
    deliveryAddress: address,
    deliveryMethod: eshopDeliveryMethods[order.delivery],
    events: [
      {
        at: placedAt,
        text: 'Order confirmed',
        location: 'Sulzer customer service',
        status: 'Confirmed',
      },
    ],
    discount: discountFor(user),
    shippingCost: order.freight,
    lines: order.lines.map((item, i) => ({
      position: (i + 1) * 10,
      partNumber: item.partNumber,
      description: item.name,
      quantity: item.quantity,
      listPrice: item.listPrice ?? item.unitPrice,
    })),
  }
}
