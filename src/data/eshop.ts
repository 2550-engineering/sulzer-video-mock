import { BadgeCheck, FileText, Hash, PackageSearch, Tags, Truck } from 'lucide-react'
import type { DeliveryOption, ImageSource, LinkCard, NavItem } from '../types'

/*
 * Spare parts (parts list + drawing, /spare-parts) and the eShop (/eshop, cart, checkout).
 * Copy only: parts are in data/spareParts.ts, prices and lead times in lib/pricing.ts.
 * Delivery options, prices and times are invented: see docs/content-to-confirm.md.
 */

export const eshopPath = '/eshop'
export const cartPath = '/eshop/cart'
export const checkoutPath = '/eshop/checkout'
export const confirmationPath = (orderId: string) => `/eshop/confirmation/${orderId}`
export const sparePartsPath = '/spare-parts'

const productsCrumb: NavItem = { label: 'Products & services', to: '/products' }
const eshopCrumb: NavItem = { label: 'eShop', to: eshopPath }

/** The parts list with its sectional drawing: product page, asset page and /spare-parts. */
export const bom = {
  title: 'Spare parts',
  intro: (model: string) =>
    `Genuine Sulzer parts for ${model}. Select a number on the drawing to find the part, or search the list.`,
  introForUnit: (model: string, serial: string) =>
    `Genuine Sulzer parts that fit ${model}, serial no. ${serial}. Select a number on the drawing to find the part.`,
  model: 'Model',
  drawing: {
    label: 'Sectional drawing',
    hint: 'Select a number to find the part',
    hotspot: (position: number) => `Position ${position}`,
    selected: (position: number) => `Pos. ${position}`,
    showAll: (position: number) => `Position ${position}: show all parts`,
    clear: 'Clear selection',
    download: 'Drawing (PDF)',
    downloaded: (model: string) => `Sectional drawing ${model}.pdf downloaded`,
  },
  search: 'Search part number or name',
  groups: 'Part groups',
  allGroups: 'All parts',
  count: (shown: number, total: number) =>
    shown === total ? `${total} parts` : `${shown} of ${total} parts`,
  columns: {
    position: 'Pos.',
    part: 'Part',
    quantity: 'Per pump',
    price: 'Your price',
    leadTime: 'Lead time',
    order: 'Order',
  },
  signInForPrices: 'Sign in to see your prices',
  listPrice: (price: string) => `List ${price}`,
  discount: (percent: number) => `−${percent}%`,
  kit: {
    show: (n: number) => `${n} parts in this kit`,
    hide: 'Hide kit contents',
    saving: (amount: string) => `Save ${amount} on the parts`,
  },
  quantity: 'Quantity',
  add: 'Add to cart',
  addPart: (name: string) => `Add ${name} to cart`,
  noResults: {
    title: 'No parts match',
    text: 'Try another part number, or show every group.',
    action: 'Show all parts',
  },
  noParts: {
    title: 'Parts list on request',
    text: 'We are adding the parts list for this product. Tell us the serial number and we will send it within one working day.',
  },
}

/** The toast after "Add to cart", anywhere. */
export const addedToCart = {
  message: 'Added to cart',
  detail: (quantity: number, name: string) => `${quantity} × ${name}`,
  action: 'View cart',
}

export const sparePartsPage = {
  title: 'Spare parts',
  breadcrumb: [productsCrumb] satisfies NavItem[],
  description:
    'Find genuine Sulzer parts on the sectional drawing, check your price and lead time, and order online.',
  modes: {
    label: 'Find parts',
    product: 'By product',
    part: 'By part number',
    serial: 'By serial number',
  },
  product: {
    choose: 'Choose a product',
    models: (n: number) => `${n} models with parts lists`,
    model: 'Model',
  },
  part: {
    label: 'Part number or name',
    placeholder: 'e.g. 62016308 or bearing kit',
    search: 'Search',
    results: (n: number) => `${n} ${n === 1 ? 'part' : 'parts'} found`,
    fits: 'Fits',
    showOnDrawing: 'Show on drawing',
    start: {
      title: 'Search by part number',
      text: 'Type at least three digits of the number on the part, the parts list or an old invoice. Names work too.',
    },
    none: {
      title: 'No parts found',
      text: 'Check the number, or find the part on the sectional drawing instead.',
      action: 'Find by product',
    },
  },
  serial: {
    label: 'Pump serial number',
    placeholder: 'e.g. AH-1918-04512',
    find: 'Find',
    yourUnits: 'Your units',
    typePlate: 'The serial number is on the type plate on the pump.',
    unit: {
      eyebrow: 'Installed unit',
      serial: 'Serial no.',
      site: 'Site',
      installed: 'Installed',
      open: 'Open asset',
    },
    notFound: {
      title: 'We couldn’t find that serial number',
      text: 'Check the type plate on the pump, or contact us and we will identify the unit for you.',
      action: 'Contact us',
    },
  },
}

export const eshopPage = {
  title: 'eShop',
  text: 'Genuine Sulzer spare parts and service kits at your prices, shipped from our distribution center in Norrköping.',
  breadcrumb: [productsCrumb] satisfies NavItem[],
  hero: {
    src: '/images/eshop/eshop-hero.jpg',
    alt: 'Rows of genuine Sulzer spare parts on shelves in a bright distribution warehouse',
  } satisfies ImageSource,
  quickOrder: {
    title: 'Quick order',
    text: 'Know the part number? Add it straight to your cart.',
    partNumber: 'Part number',
    placeholder: 'e.g. 62016308',
    quantity: 'Qty',
    add: 'Add to cart',
    notFound: (partNumber: string) =>
      `No part with number ${partNumber}. Check the number on the parts list or drawing.`,
  },
  signedOut: {
    text: 'Sign in to see your prices and lead times, and to order online.',
    action: 'Sign in',
  },
  benefits: [
    { icon: BadgeCheck, title: 'Genuine Sulzer parts', text: 'Made to the original drawings' },
    { icon: Tags, title: 'Your prices', text: 'Agreements and discounts applied' },
    { icon: Truck, title: 'Track & trace', text: 'On every order, to your door' },
  ],
  shortcuts: {
    title: 'Find the right part',
    cards: [
      {
        title: 'Sectional drawings',
        text: 'Pick the part on the drawing of your pump model.',
        linkLabel: 'Find by product',
        to: sparePartsPath,
        icon: PackageSearch,
      },
      {
        title: 'Serial number',
        text: 'Get the exact parts list for one installed unit.',
        linkLabel: 'Find by serial number',
        to: `${sparePartsPath}?by=serial`,
        icon: Hash,
      },
      {
        title: 'Your orders',
        text: 'Follow every order with track & trace.',
        linkLabel: 'Track orders',
        to: '/self-service/orders',
        icon: Truck,
      },
      {
        title: 'Quotations',
        text: 'Larger repairs or a list of parts? Ask for a quotation.',
        linkLabel: 'Request a quotation',
        to: '/contact/quote',
        icon: FileText,
      },
    ] satisfies LinkCard[],
  },
  recent: {
    title: 'Ordered recently',
    text: 'Order the same parts again in one click.',
    lastOrdered: (date: string, orderId: string) => `Last ordered ${date} · ${orderId}`,
    action: 'Order again',
  },
  kits: {
    title: 'Service kits for your pumps',
    titleSignedOut: 'Service kits',
    text: 'Everything for a scheduled service in one box, for less than the parts one by one.',
    forUnits: (tags: string) => `For ${tags}`,
    fits: (model: string) => `Fits ${model}`,
    parts: (n: number) => `${n} parts`,
    action: 'Add to cart',
  },
}

export const cartCopy = {
  title: 'Cart',
  drawerTitle: 'Your cart',
  close: 'Close cart',
  open: (count: number) => (count ? `Cart, ${count} items` : 'Cart'),
  items: (n: number) => `${n} ${n === 1 ? 'item' : 'items'}`,
  breadcrumb: [productsCrumb, eshopCrumb] satisfies NavItem[],
  forAsset: (tag: string) => `For ${tag}`,
  partNumber: (number: string) => `Part no. ${number}`,
  remove: 'Remove',
  removeLine: (name: string) => `Remove ${name}`,
  each: (price: string) => `${price} each`,
  empty: {
    title: 'Your cart is empty',
    text: 'Find genuine parts on the sectional drawing, or by part or serial number.',
    action: 'Find spare parts',
  },
  summary: {
    title: 'Order summary',
    list: 'Subtotal, list price',
    discount: (percent: number) => `Partner discount ${percent}%`,
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    shippingLater: 'At checkout',
    free: 'Free',
    total: 'Total excl. VAT',
    vat: 'VAT is added to the invoice.',
  },
  checkout: 'Go to checkout',
  view: 'View cart',
  continue: 'Continue shopping',
}

export const checkoutCopy = {
  title: 'Checkout',
  breadcrumb: [...cartCopy.breadcrumb, { label: cartCopy.title, to: cartPath }] satisfies NavItem[],
  intro: 'Check the delivery and add your reference. You can follow the order under Orders.',
  orderedBy: (name: string, company: string) => `Ordering as ${name}, ${company}`,
  address: {
    title: 'Delivery address',
    fromAccount: 'From your mySulzer account',
  },
  delivery: {
    title: 'Delivery',
    expected: (date: string) => `Expected ${date}`,
    free: 'Free',
  },
  reference: {
    title: 'Your reference',
    po: 'Purchase order number',
    poPlaceholder: 'e.g. PO 2026-1203',
    poHint: 'Shown on the order confirmation and the invoice.',
    fallback: 'Web order',
  },
  summary: {
    expected: 'Expected delivery',
    place: 'Place order',
    terms: 'By placing the order you accept the Sulzer terms of sale.',
    termsLink: { label: 'Terms of sale', to: '/terms-of-sale' } satisfies NavItem,
  },
}

export const confirmationCopy = {
  title: 'Order confirmed',
  thanks: (firstName: string) => `Thank you, ${firstName}`,
  text: (orderId: string, email: string) =>
    `Your order ${orderId} is confirmed. The order confirmation is on its way to ${email}.`,
  details: {
    order: 'Order',
    po: 'Your PO',
    expected: 'Expected delivery',
    delivery: 'Delivery',
    address: 'Delivery address',
    total: 'Total excl. VAT',
  },
  progress: 'Order status',
  steps: {
    Confirmed: 'Confirmed',
    Packed: 'Packed',
    Shipped: 'Shipped',
    Delivered: 'Delivered',
  },
  nextStep: {
    Packed: 'In 1–2 working days',
    Shipped: 'Tracking number by e-mail',
  },
  track: 'Track order',
  orders: 'All orders',
  continue: 'Back to eShop',
  notFound: 'We couldn’t find that order.',
}

/**
 * How checkout orders ship, from the Norrköping distribution center. `days` are working
 * days after the parts are ready. PLACEHOLDERS — confirm with Sulzer.
 */
export const deliveryOptions: DeliveryOption[] = [
  {
    id: 'standard',
    label: 'Standard road freight',
    detail: '2–3 working days after dispatch',
    price: 45,
    days: 3,
  },
  {
    id: 'express',
    label: 'Express',
    detail: 'Next working day after dispatch, before 12:00',
    price: 120,
    days: 1,
  },
  {
    id: 'collect',
    label: 'Collect at Sulzer service center Västerås',
    detail: 'Kopparlundsvägen 7, weekdays 07:00–16:00',
    price: 0,
    days: 0,
  },
]

/** Time on new checkout orders, on the demo's today. Fixed, so every take shows the same. */
export const checkoutTime = '09:48'
