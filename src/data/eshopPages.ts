import { demoUser, eshop, market } from '../config/demo'
import type { NavItem } from '../types'

/* Copy for the cart, checkout and order confirmation (/eshop). */

const currency = market.currency

export const eshopPages = {
  breadcrumb: [{ label: 'eShop', to: '/eshop/cart' }] satisfies NavItem[],

  toasts: {
    added: 'Added to cart',
    addedDetail: (quantity: number, name: string) => `${quantity} × ${name}`,
    viewCart: { label: 'View cart', to: '/eshop/cart' } satisfies NavItem,
    quotation: (id: string) => `Quotation ${id} saved`,
    quotationDetail: 'A Sulzer sales engineer confirms prices and dates within one working day.',
    quotations: { label: 'View quotations', to: '/self-service/quotations' } satisfies NavItem,
  },

  signIn: {
    title: 'Sign in to order',
    text: 'Your account shows your own prices and lead times, and orders go on your company’s account.',
    action: 'Sign in and add to cart',
    cancel: 'Cancel',
    close: 'Close',
    pageTitle: 'Sign in to see your cart',
    pageText: 'Prices, lead times and ordering are available with your mySulzer account.',
    pageAction: 'Sign in',
  },

  menu: {
    label: (count: number) => `Cart, ${count} ${count === 1 ? 'item' : 'items'}`,
    title: 'Cart',
    empty: 'Your cart is empty.',
    more: (count: number) => `+ ${count} more`,
    subtotal: 'Subtotal',
    goToCart: 'Go to cart',
  },

  cart: {
    title: 'Cart',
    count: (count: number) => `${count} ${count === 1 ? 'item' : 'items'}`,
    columns: {
      item: 'Item',
      quantity: 'Quantity',
      unitPrice: 'Unit price',
      leadTime: 'Lead time',
      total: 'Total',
    },
    partNumber: 'Part no.',
    productNumber: 'Product no.',
    remove: (name: string) => `Remove ${name}`,
    quantity: (name: string) => `Quantity of ${name}`,
    kit: 'Service kit',
    product: 'Pump',
    forProduct: 'Parts for',
    reference: 'Your reference / PO number',
    referencePlaceholder: 'e.g. PO-88412',
    saveQuotation: 'Save as quotation',
    checkout: 'Proceed to checkout',
    continue: 'Continue shopping',
    empty: {
      title: 'Your cart is empty',
      text: 'Find spare parts on the exploded drawing of your pump, or search by part number.',
      action: 'Find a product',
    },
  },

  summary: {
    title: 'Order summary',
    subtotal: 'Subtotal',
    freight: 'Freight',
    freeFreight: 'Free',
    freeFrom: `Free freight from ${currency} ${eshop.freight.freeFrom.toLocaleString('en-GB')}`,
    vat: `VAT ${eshop.vatRate} %`,
    total: 'Total',
    delivery: 'Expected delivery',
    between: (from: string, to: string) => `${from} – ${to}`,
    deliveryNote: 'From the lead times of the items, plus transport.',
  },

  checkout: {
    title: 'Checkout',
    steps: { delivery: 'Delivery', payment: 'Payment', review: 'Review' },
    address: 'Delivery address',
    deliveryDate: 'Delivery date',
    partial: (date: string) => `As soon as possible – first items from ${date}`,
    partialHint: 'Items ship as they become available.',
    complete: (date: string) => `All together on ${date}`,
    completeHint: 'One delivery when the last item is ready.',
    payment: eshop.paymentTerms,
    paymentHint: (customerNumber: string) =>
      `Charged to customer account ${customerNumber}. Other payment methods are not available for this account.`,
    reference: 'Your reference / PO number',
    orderedBy: 'Ordered by',
    deliverTo: 'Deliver to',
    edit: 'Edit cart',
    terms: 'By placing the order you accept the',
    termsLink: 'terms of sale',
    place: 'Place order',
    placing: 'Placing order…',
  },

  confirmation: {
    title: 'Thank you, your order is confirmed',
    text: `We have sent the order confirmation to ${demoUser.email}.`,
    orderNumber: 'Order number',
    expected: 'Expected delivery',
    deliverTo: 'Delivery address',
    reference: 'Your reference',
    items: 'Items',
    track: 'Track order',
    trackTo: '/self-service/orders',
    continue: 'Continue shopping',
  },
}
