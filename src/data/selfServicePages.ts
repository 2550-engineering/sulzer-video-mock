import { CircleCheck, FileClock, FileText, Package, PackageCheck, Truck } from 'lucide-react'
import { products } from '../config/demo'
import type { OrderStatus, QuotationStatus, ServiceRequestStatus } from '../types'

/* Copy for requests, orders and quotations ("/self-service/…"). */

const parents = [
  { label: 'mySulzer', to: '/my-sulzer' },
  { label: 'My Pages', to: '/my-pages' },
]

/** Pill colours, shared by the three pages. */
export type PillTone = 'neutral' | 'info' | 'progress' | 'success' | 'warning'

export const requestsPath = '/self-service/requests'
export const ordersPath = '/self-service/orders'
export const quotationsPath = '/self-service/quotations'

export const orderPath = (id: string) => `${ordersPath}/${id}`
export const quotationPath = (id: string) => `${quotationsPath}/${id}`

export const requestStatus: Record<ServiceRequestStatus, { label: string; tone: PillTone }> = {
  Received: { label: 'Received', tone: 'info' },
  Planned: { label: 'Planned', tone: 'progress' },
  'Technician assigned': { label: 'Technician assigned', tone: 'progress' },
  Done: { label: 'Done', tone: 'success' },
}

export const orderStatus: Record<OrderStatus, { label: string; tone: PillTone }> = {
  Confirmed: { label: 'Confirmed', tone: 'info' },
  Packed: { label: 'Packed', tone: 'progress' },
  Shipped: { label: 'In transit', tone: 'progress' },
  Delivered: { label: 'Delivered', tone: 'success' },
}

export const quotationStatus: Record<QuotationStatus, { label: string; tone: PillTone }> = {
  Draft: { label: 'Draft', tone: 'neutral' },
  Requested: { label: 'In preparation', tone: 'neutral' },
  Sent: { label: 'Open', tone: 'info' },
  Accepted: { label: 'Accepted', tone: 'success' },
  Expired: { label: 'Expired', tone: 'warning' },
}

export const requestsPage = {
  title: 'Service requests',
  breadcrumb: parents,
  description:
    'Follow every request from the moment we receive it until the work is done, with the service center and technician who handle it.',
  partnerDescription:
    'Service requests from your customers’ installed base, from the moment Sulzer receives them until the work is done.',
  open: 'Open requests',
  closed: 'Closed requests',
  noOpen: {
    title: 'No open requests',
    text: 'Request service from any asset, or straight from an alert in Sulzer Connect.',
    action: 'Go to My assets',
    to: '/assets',
  },
  steps: {
    Received: 'Received',
    Planned: 'Visit planned',
    'Technician assigned': 'Technician assigned',
    Done: 'Done',
  } satisfies Record<ServiceRequestStatus, string>,
  /** Under a step that hasn't been reached yet. */
  next: {
    Planned: 'We confirm the date within one working day',
    'Technician assigned': 'About a week before the visit',
    Done: 'After the visit, with the service report',
  } as Partial<Record<ServiceRequestStatus, string>>,
  fromAlert: `From ${products.connect} alert`,
  received: (time: string) => `Received ${time}`,
  fields: {
    asset: 'Asset',
    site: 'Site',
    serviceCenter: 'Service center',
    visit: 'Visit',
    technician: 'Technician',
    requestedBy: 'Requested by',
    customer: 'Customer',
    message: 'Your message',
    preferred: (date: string) => `Preferred date ${date}`,
  },
  toBePlanned: 'To be planned',
  assignedLater: 'Assigned when planned',
  viewAsset: 'View asset',
  openConnect: `Open in ${products.connect}`,
  table: {
    reference: 'Reference',
    service: 'Service',
    asset: 'Asset',
    customer: 'Customer',
    completed: 'Completed',
    technician: 'Technician',
    report: 'Service report',
  },
  reportDownloaded: (workOrder: string) => `Service report ${workOrder} downloaded`,
  serviceCenterCard: {
    title: 'Your service center',
    call: 'Call',
  },
  toast: {
    sent: (id: string) => `Service request ${id} sent`,
    view: 'View request',
  },
}

export const ordersPage = {
  title: 'Orders',
  breadcrumb: parents,
  description: 'Every order from confirmation to delivery, with track & trace for each shipment.',
  partnerDescription:
    'The orders you placed with Sulzer for your customers, with partner prices and track & trace.',
  summary: {
    label: 'Order summary',
    all: { label: 'orders', detail: 'Show all', icon: FileText },
    open: { label: 'open', detail: 'Not delivered yet', icon: Package },
    transit: { label: 'in transit', detail: 'Shipped, on the way', icon: Truck },
    delivered: { label: 'delivered', detail: 'Last 90 days', icon: PackageCheck },
  },
  search: 'Search by order, PO or part number',
  count: (shown: number, total: number) =>
    shown === total ? `${total} orders` : `${shown} of ${total} orders`,
  table: {
    order: 'Order',
    placed: 'Placed',
    items: 'Items',
    customer: 'Customer',
    status: 'Status',
    delivery: 'Delivery',
    total: 'Total',
  },
  more: (n: number) => `+ ${n} more`,
  expected: (date: string) => `Expected ${date}`,
  delivered: (date: string) => `Delivered ${date}`,
  noResults: {
    title: 'No orders match',
    text: 'Try another order, PO or part number.',
    action: 'Show all orders',
  },
}

export const orderPage = {
  eyebrow: 'Order',
  notFound: 'We couldn’t find that order.',
  placed: (date: string, by: string) => `Placed ${date} by ${by}`,
  po: 'Your PO',
  fromQuotation: 'From quotation',
  downloadConfirmation: 'Order confirmation',
  confirmationDownloaded: (id: string) => `Order confirmation ${id} downloaded`,
  tracking: {
    title: 'Track & trace',
    expected: 'Expected delivery',
    delivered: 'Delivered',
    carrier: 'Carrier',
    trackingNumber: 'Tracking number',
    copy: 'Copy tracking number',
    copied: 'Tracking number copied',
    packages: (n: number, weight: string) => `${n} ${n === 1 ? 'package' : 'packages'} · ${weight}`,
    notShipped: 'Tracking starts when your order ships.',
    history: 'Shipment history',
  },
  steps: {
    Confirmed: 'Order confirmed',
    Packed: 'Packed',
    Shipped: 'Shipped',
    Delivered: 'Delivered',
  } satisfies Record<OrderStatus, string>,
  lines: {
    title: 'Items',
    position: 'Pos.',
    partNumber: 'Part no.',
    description: 'Description',
    quantity: 'Qty',
    unitPrice: 'Unit price',
    amount: 'Amount',
    forAsset: 'For',
    subtotal: 'Subtotal, list price',
    discount: (percent: number, partner: boolean) =>
      partner ? `Partner discount ${percent}%` : `Agreement discount ${percent}%`,
    shipping: 'Shipping',
    freeShipping: 'Included',
    total: 'Total excl. VAT',
  },
  delivery: {
    title: 'Delivery',
    address: 'Delivery address',
    method: 'Delivery method',
  },
  details: {
    title: 'Order details',
    placedBy: 'Placed by',
    customer: 'Customer',
    placedOn: 'Order date',
  },
  help: {
    title: 'Questions about this order?',
    text: 'Sulzer customer service answers weekdays 08:00–17:00.',
    phone: '+46 21 400 18 10',
    email: 'orders.sweden@sulzer.example',
  },
}

export const quotationsPage = {
  title: 'Quotations',
  breadcrumb: parents,
  description: 'Every Sulzer quotation for your company, from request to order, ready to download.',
  partnerDescription:
    'The quotations you sent your customers, on your own letterhead, with your margin on Sulzer parts.',
  summary: {
    label: 'Quotation summary',
    all: { label: 'quotations', detail: 'Show all', icon: FileText },
    open: { label: 'open', detail: 'Waiting for a decision', icon: FileClock },
    accepted: { label: 'accepted', detail: 'Turned into orders', icon: CircleCheck },
    expired: { label: 'expired', detail: 'Ask for a new one', icon: FileText },
  },
  table: {
    quotation: 'Quotation',
    customer: 'Customer',
    issued: 'Issued',
    validUntil: 'Valid until',
    status: 'Status',
    total: 'Total net',
    updated: 'Latest update',
  },
  daysLeft: (days: number) => (days === 1 ? '1 day left' : `${days} days left`),
  notYet: 'Not issued yet',
}

export const quotationPage = {
  eyebrow: 'Quotation',
  notFound: 'We couldn’t find that quotation.',
  download: 'Download PDF',
  downloaded: (id: string) => `${id}.pdf downloaded`,
  fileDetail: 'PDF · 1 page · 186 KB',
  fileName: (id: string) => `${id}.pdf`,
  summary: {
    title: 'Summary',
    total: 'Total net, excl. VAT',
    validUntil: 'Valid until',
    issued: 'Issued',
    yourReference: 'Your reference',
    project: 'Project',
    order: 'Order',
    customer: 'Customer',
  },
  contact: 'Your contact',
  history: 'History',
  requested: 'Requested',
  createdStep: 'Created',
  issuedStep: 'Sent',
  send: (name: string) => `Send to ${name}`,
  sent: (id: string, name: string) => `Quotation ${id} sent to ${name}`,
  margin: {
    title: 'Your margin',
    note: 'Only you see this. It isn’t on the PDF.',
    list: 'Sulzer list price',
    cost: (discount: number) => `Your net price (−${discount}%)`,
    sell: 'Sold to customer',
    margin: 'Margin on Sulzer items',
    services: 'Your services',
  },
  preparing: {
    title: 'Your quotation is being prepared',
    text: (name: string, date: string) => `${name} expects to send it by ${date}.`,
  },
  document: {
    title: 'Quotation',
    number: 'Quotation no.',
    date: 'Date',
    validUntil: 'Valid until',
    customerNumber: 'Customer no.',
    yourReference: 'Your reference',
    ourContact: 'Our contact',
    to: 'To',
    attn: (name: string) => `Attn. ${name}`,
    subject: (title: string) => `Re: ${title}`,
    greeting: (name: string) => `Dear ${name},`,
    intro:
      'Thank you for your enquiry. We are pleased to quote as follows, subject to the terms below.',
    columns: {
      position: 'Pos.',
      item: 'Item',
      quantity: 'Qty',
      unitPrice: 'Unit price',
      discount: 'Disc.',
      amount: 'Net amount',
    },
    delivery: 'Delivery',
    units: { pcs: 'pcs', h: 'h', lot: 'lot' },
    totalList: 'Total list price',
    discount: (percent: number) => `Discount ${percent}%`,
    totalNet: 'Total net, excl. VAT',
    vat: 'VAT is added at the rate in force on the invoice date.',
    terms: 'Terms',
    deliveryTerms: 'Delivery terms',
    paymentTerms: 'Payment terms',
    validity: 'Validity',
    validityText: (date: string) => `This quotation is valid until ${date}.`,
    notes: 'Notes',
    closing: 'Kind regards,',
    partnerBadge: 'Authorised Sulzer distributor',
  },
}
