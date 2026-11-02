import { demoUser, market } from '../config/demo'
import type { NavItem, StockStatus, TabDef } from '../types'

/* Copy for the configured product page, /products/<productId>/<variantId>. */

export const variantPage = {
  tabs: [
    { id: 'variants', label: 'Variants' },
    { id: 'quotation', label: 'Quotation' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'curves', label: 'Curves' },
    { id: 'spare-parts', label: 'Spare parts' },
    { id: 'cad', label: 'CAD' },
    { id: 'drawings', label: 'Drawings' },
    { id: 'documentation', label: 'Documentation' },
    { id: 'services', label: 'Services' },
  ] satisfies TabDef[],
  breadcrumb: [
    { label: 'Products & services', to: '/products' },
    { label: 'Products A–Z', to: '/products' },
  ] satisfies NavItem[],
  productNumber: (number: string) => `No. ${number}`,
  suitableFor: 'Suitable for',
  viewMore: 'View more',
  viewLess: 'View less',

  toolbar: {
    label: 'Product actions',
    bookmark: 'Bookmark',
    removeBookmark: 'Remove bookmark',
    addToProject: 'Add to project',
    compare: 'Compare',
    curve: 'Show curve',
    share: 'Share',
  },
  toasts: {
    bookmarked: 'Bookmarked',
    unbookmarked: 'Bookmark removed',
    savedItems: { label: 'My saved items', to: '/my-pages/saved' } satisfies NavItem,
    compare: 'Added to compare',
    compareDetail: 'Open another product and add it to compare them side by side.',
    share: 'Link copied',
    shareDetail: 'Colleagues with a mySulzer account can open it.',
    documentation: 'Download started',
    documentationDetail: (code: string) =>
      `Documentation package for ${code} (ZIP, 14.2 MB, 9 files)`,
    exported: (format: string) => `Exported as ${format}`,
  },

  actions: {
    print: 'Print / PDF',
    download: 'Download documentation',
    exportAs: 'Export as',
    formats: [
      { id: 'xlsx', label: 'Excel' },
      { id: 'pdf', label: 'PDF' },
      { id: 'csv', label: 'CSV' },
    ],
  },

  price: {
    title: 'Price',
    unavailable: 'Price unavailable',
    signInHint: 'Sign in to see your price',
    status: {
      inStock: 'In stock',
      leadTime: (time: string) => `Lead time ${time}`,
      confirm: 'To be confirmed in sales order',
    },
    discountGroup: (code: string) => `Discount group: ${code}`,
    signIn: 'Sign in',
    exclVat: `${market.currency}, excl. VAT`,
    listPrice: 'List price',
    availability: 'Availability',
    leadTime: 'Lead time',
    whereToBuy: 'Where to buy',
    addToCart: 'Add to cart',
  },
  stock: {
    'in-stock': 'In stock',
    'lead-time': 'Short lead time',
    'made-to-order': 'Made to order',
    discontinued: 'Discontinued',
  } satisfies Record<StockStatus, string>,

  discontinued: {
    title: 'This product is discontinued',
    text: (year: number, successor: string) =>
      `It was built until ${year}. ${successor} replaces it and fits the same installation.`,
    action: 'Find replacement',
  },

  whereToBuy: {
    title: 'Where to buy',
    close: 'Close',
    intro: `Your nearest Sulzer service centre in ${market.country}:`,
    distance: (km: string) => `${km} from ${demoUser.company}`,
    phone: 'Phone',
    email: 'Email',
    hours: 'Opening hours',
    offers: 'They can help with',
    contact: 'Request a quotation',
  },

  variants: {
    title: 'Variants',
    intro: (count: number, product: string) =>
      `All ${count} ${product} variants. Select a row to open it.`,
    current: 'Current',
    columns: {
      code: 'Model code',
      number: 'Product no.',
      power: 'P2',
      frequency: 'Frequency',
      outlet: 'Outlet',
      maxFlow: 'Max. flow',
      maxHead: 'Max. head',
      availability: 'Availability',
      price: 'List price',
    },
  },

  recommended: {
    title: 'Recommended spare parts',
    all: 'All spare parts',
    previous: 'Previous spare parts',
    next: 'Next spare parts',
    open: (name: string) => `${name}: show on the drawing`,
  },

  quotation: {
    title: 'Request quotation',
    intro:
      'Tell us how many you need and when. A Sulzer sales engineer sends a quotation within one working day.',
    prefilled: 'Filled in from your mySulzer account.',
    product: 'Product',
    fields: {
      name: 'Name',
      company: 'Company',
      email: 'Email',
      quantity: 'Quantity',
      delivery: 'Requested delivery',
      message: 'Message (optional)',
    },
    deliveryOptions: [
      'As soon as possible',
      'Within 4 weeks',
      'Within 3 months',
      'Not decided yet',
    ],
    messagePlaceholder: 'e.g. replacing two pumps in our main lift station',
    send: 'Send request',
    sentTitle: 'Thank you, your request is on its way',
    sentText: (email: string) =>
      `We have sent a confirmation to ${email}. A Sulzer sales engineer will reply within one working day.`,
    reference: 'Your reference',
    another: 'Send another request',
  },

  specifications: {
    title: 'Specifications',
    groups: {
      liquid: 'Liquid',
      technical: 'Technical',
      materials: 'Materials',
      installation: 'Installation',
      electrical: 'Electrical data',
    },
    labels: {
      pumpedLiquids: 'Pumped liquids',
      liquidTemperature: 'Liquid temperature',
      maxDensity: 'Max. density',
      ph: 'pH range',
      ratedFlow: 'Rated flow',
      ratedHead: 'Rated head',
      efficiency: 'Efficiency at rated point',
      impellerType: 'Impeller type',
      impellerDiameter: 'Impeller diameter',
      freePassage: 'Free passage',
      impellerMaterial: 'Impeller',
      shaft: 'Shaft',
      shaftSeals: 'Shaft seals',
      oRings: 'O-rings',
      fasteners: 'Fasteners',
      installation: 'Installation',
      maxImmersion: 'Max. immersion depth',
      ratedPower: 'Rated power P2',
      starting: 'Starting method',
      insulationClass: 'Insulation class',
      dutyType: 'Duty type',
      motorProtection: 'Motor protection',
      maxPressure: 'Max. operating pressure',
      maxFlow: 'Max. flow',
      maxHead: 'Max. head',
      shaftSealType: 'Shaft seal',
      mounting: 'Mounting',
      supply: 'Supply',
      poles: 'Poles',
      efficiencyClass: 'Motor efficiency class',
    },
  },

  curves: {
    title: 'Performance',
    download: 'Download curves (SVG)',
    downloaded: 'Curves downloaded',
    unit: 'Flow unit',
    settings: 'Settings',
    fullscreen: 'Full screen',
    exitFullscreen: 'Exit full screen',
    sections: {
      operatingPoint: 'Operating point',
      fluid: 'Fluid',
      curveTypes: 'Curve types',
      layout: 'Hydraulic layout',
    },
    duty: {
      label: 'Duty point',
      none: 'Do not show duty point',
      show: 'Show duty point',
      enter: 'Enter duty point',
      flow: 'Flow Q',
      head: 'Head H',
      values: 'At the operating point',
    },
    fluid: { liquid: 'Liquid', temperature: 'Temperature' },
    types: {
      qh: 'Q-H',
      eta: 'Efficiency',
      p1: 'P1',
      p2: 'P2',
      npsh: 'NPSH',
      system: 'System curve',
    },
    layouts: { single: 'Single pump', parallel: '2 pumps in parallel' },
    advanced: {
      show: 'Show advanced options',
      hide: 'Hide advanced options',
      speed: 'Speed',
      impeller: 'Impeller diameter',
    },
    chart: {
      label: (code: string) => `Performance curves of ${code}`,
      etaPump: 'eta pump',
      etaTotal: 'eta total',
      parallel: '2 pumps in parallel',
      atTop: (q: string, unit: string, h: string, eta: string) =>
        `Q ${q} ${unit} · H ${h} m · eta ${eta} %`,
      atBottom: (p1: string, p2: string, npsh: string) =>
        `P1 ${p1} kW · P2 ${p2} kW · NPSH ${npsh} m`,
      note: (temperature: string, liquid: string) =>
        `Liquid temperature during operation = ${temperature} °C · ${liquid}`,
    },
    values: {
      flow: 'Flow',
      head: 'Head',
      etaPump: 'Pump efficiency',
      etaTotal: 'Total efficiency',
      p1: 'P1',
      p2: 'P2',
      npsh: 'NPSH required',
    },
  },

  drawings: { title: 'Drawings' },

  print: {
    back: 'Back to product',
    print: 'Print or save as PDF',
    printed: 'Product data sheet',
    footer: 'Figures are typical and subject to change without notice.',
  },
}
