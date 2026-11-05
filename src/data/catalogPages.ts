import { market } from '../config/demo'
import type { NavItem, ProductTabSet, SearchScope, TabDef } from '../types'

/* Copy for the application, product and product search templates. */

export const applicationPage = {
  tabs: [
    { id: 'explore', label: 'Explore' },
    { id: 'products', label: 'Products & solutions' },
    { id: 'learn', label: 'Learn' },
  ] satisfies TabDef[],
  sizeLabel: 'Size application',
  /** First breadcrumb level after Home on every application page. */
  breadcrumbParent: { label: 'Products & services', to: '/products' } satisfies NavItem,
  overview: {
    title: 'Select your area of interest or application',
    /** Sub-applications listed on a card before "Show all". */
    maxLinks: 6,
    showAllLabel: 'Show all',
  },
  productsCallout: {
    title: (name: string) => `Products & solutions for ${name.toLowerCase()}`,
    text: (count: number) =>
      `${count} Sulzer ${count === 1 ? 'product matches' : 'products match'} this application.`,
    actionLabel: 'See products & solutions',
  },
  knowledge: {
    title: 'Want to know more about this application?',
    text: 'Engineering manuals, expert videos and customer stories that help you plan, size and run your system with confidence.',
  },
  help: {
    title: 'How can we help you?',
    text: 'Whether you are ready to buy, prefer to order online or need help with equipment you already run, our team is here for you.',
  },
  learn: {
    eyebrow: 'Sulzer Academy',
    back: { label: 'Visit Sulzer Academy', to: '/learn' } satisfies NavItem,
  },
}

/** "Show more" toggle on Explore tabs. */
export const exploreIntroBand = {
  showMore: 'Show more',
  showLess: 'Show less',
}

export const productPage = {
  /** Each product names its set in `tabSet` (data/products.ts). */
  tabSets: {
    pump: [
      { id: 'explore', label: 'Explore' },
      { id: 'models', label: 'Models' },
      { id: 'documentation', label: 'Documentation' },
      { id: 'bim', label: 'BIM' },
      { id: 'spare-parts', label: 'Spare parts' },
      { id: 'services', label: 'Services' },
    ],
    digital: [
      { id: 'explore', label: 'Explore' },
      { id: 'variants', label: 'Variants' },
      { id: 'documentation', label: 'Documentation' },
      { id: 'learn', label: 'Learn' },
    ],
  } satisfies Record<ProductTabSet, TabDef[]>,
  breadcrumb: [
    { label: 'Products & services', to: '/products' },
    { label: 'Products A–Z', to: '/products' },
  ] satisfies NavItem[],
  suitableForLabel: 'Suitable for:',
  /** "Suitable for" links shown before "View more". */
  suitableForMax: 3,
  viewMoreLabel: 'View more',
  viewLessLabel: 'View less',
  documentationLink: 'Product documentation',
  /** The buy box under the key specs, for products sold as models. */
  buy: {
    priceFrom: 'Price from',
    exclVat: `${market.currency}, excl. VAT · list price`,
    models: (count: number) => `${count} models, from stock or made to order`,
    choose: 'Choose model and buy',
    requestQuote: 'Request quotation',
    quoteLink: (productId: string) => `/contact/quote?product=${productId}`,
    whereToBuy: 'Where to buy',
    signIn: 'Sign in to see prices and buy',
    signedOut: 'Prices and ordering for your company’s account',
  },
  stories: {
    title: 'See how customers benefit',
    text: 'Plants around the world run on Sulzer pumps every day. Here is what that means for them.',
    label: 'Case',
  },
  sizeLabel: 'Size product',
  save: {
    add: 'Save to My saved items',
    remove: 'Remove from My saved items',
    added: 'Saved to My saved items',
    removed: 'Removed from My saved items',
    view: 'View',
  },
  howItWorksStep: (n: number) => `Step ${n}`,
  storyLabel: 'Customer story',
  storyLink: 'Read the story',
  variants: {
    everythingIn: (name: string) => `Everything in ${name}, plus:`,
    action: 'Request a quote',
    actionTo: '/contact/quote',
    priceNote:
      'Priced per connected asset. Your Sulzer sales contact sends a quote within two working days.',
    compareTitle: 'Compare packages',
    feature: 'Feature',
    included: 'Included',
    notIncluded: 'Not included',
  },
  learn: {
    title: (product: string) => `Learn more about ${product}`,
    text: 'Manuals, expert videos and handbooks from Sulzer specialists, to help you get the most out of it.',
  },
  keySpecLabels: {
    liquidTemp: 'Liquid temperature',
    maxFlow: 'Max. flow',
    maxHead: 'Max. head',
    maxPressure: 'Max. pressure',
  },
  models: {
    addToCart: 'Add to cart',
    addToCartFor: (name: string) => `Add ${name} to cart`,
    quantityFor: (name: string) => `Quantity of ${name}`,
    order: 'Order',
    openModel: (name: string) => `Open the ${name} page`,
    title: 'Models',
    count: (shown: number, total: number) =>
      shown === total ? `${total} models` : `${shown} of ${total} models`,
    filters: {
      frequency: 'Frequency',
      power: 'Motor power',
      allPower: 'All motor powers',
      connection: 'Discharge size',
      allConnections: 'All sizes',
      reset: 'Reset',
    },
    columns: {
      compare: 'Compare',
      name: 'Model',
      productNumber: 'Product no.',
      flow: 'Rated flow',
      head: 'Rated head',
      power: 'Motor power',
      speed: 'Speed',
      listPrice: 'List price',
      discount: 'Your discount',
      netPrice: 'Net price',
      availability: 'Availability',
    },
    units: { flow: 'm³/h', head: 'm', power: 'kW', speed: 'rpm' },
    signInForPrices: 'Sign in to see prices',
    spareParts: 'Spare parts',
    sparePartsFor: (model: string) => `Spare parts for ${model}`,
    priceNote: 'List prices excl. VAT',
    partnerPriceNote: (discount: number) =>
      `List and net prices excl. VAT · Partner discount ${discount}% on list price`,
    inStock: 'In stock',
    showDetails: (name: string) => `Show details for ${name}`,
    discontinued: 'Discontinued',
    replacedBy: 'Replaced by',
    noLongerAvailable: 'No longer available',
    compareLimit: 'Compare up to 3 models',
    noMatches: {
      title: 'No models match these filters',
      action: 'Reset filters',
    },
    detail: {
      curveTitle: 'Performance curve',
      curveNote: 'Typical curve at rated speed. Size your duty point for exact figures.',
      ratedPoint: 'Rated point',
      flowAxis: 'Flow Q [m³/h]',
      headAxis: 'Head H [m]',
      efficiencyAxis: 'Efficiency η [%]',
      dimensionsTitle: 'Dimensions',
      size: 'Size this model',
      addToProject: 'Add to project',
      compare: 'Add to compare',
      comparing: 'Remove from compare',
    },
    dimensions: {
      suction: 'Suction',
      discharge: 'Discharge',
      impeller: 'Impeller Ø',
      length: 'Overall length',
      width: 'Width',
      height: 'Height',
      weight: 'Weight',
    },
    compare: {
      bar: (count: number) => `${count} of 3 selected for comparison`,
      remove: (name: string) => `Remove ${name} from comparison`,
      clear: 'Clear',
      open: (count: number) => `Compare (${count})`,
      needTwo: 'Select at least 2 models',
      panelTitle: 'Compare models',
      close: 'Close comparison',
      curves: 'Performance curves',
      rows: {
        productNumber: 'Product no.',
        frequency: 'Frequency',
        flow: 'Rated flow',
        head: 'Rated head',
        power: 'Motor power',
        speed: 'Speed',
        efficiency: 'Efficiency',
        connection: 'Connection',
        casingMaterial: 'Casing',
        impellerMaterial: 'Impeller material',
        shaftSeal: 'Shaft seal',
        solidsSize: 'Max. solids size',
        maxSubmergence: 'Max. submergence',
        maxPressure: 'Max. pressure',
        weight: 'Weight',
        listPrice: 'List price',
        netPrice: (discount: number) => `Your net price (−${discount}%)`,
        availability: 'Availability',
      },
    },
  },
  documentationTitle: 'Documentation',
  documentation: {
    filters: {
      type: 'Document type',
      allTypes: 'All types',
      language: 'Language',
      allLanguages: 'All languages',
    },
    count: (count: number) => `${count} ${count === 1 ? 'document' : 'documents'}`,
    selectAll: 'Select all',
    selected: (count: number) => `${count} selected`,
    select: (title: string) => `Select ${title}`,
    downloadSelected: (count: number) => `Download selected (${count})`,
    preparingZip: 'Preparing ZIP…',
    zipName: (product: string) => `${product.replaceAll(' ', '_')}_documents.zip`,
    zipDetail: (count: number) => `${count} documents`,
    downloadStarted: (name: string) => `Download started: ${name}`,
    preview: 'Preview',
    download: 'Download',
    moreLanguages: (count: number) => `+${count}`,
    noMatches: {
      title: 'No documents match these filters',
      action: 'Show all documents',
    },
    previewDialog: {
      close: 'Close preview',
      revision: (rev: string) => `Rev. ${rev}`,
      languages: 'Available in',
      placeholderNote: 'This is a preview. Download the document to read it in full.',
    },
    cover: { languages: 'Languages' },
  },
  bim: {
    title: 'Download BIM & CAD models',
    intro: 'Pick a model and a format. We generate the file for that exact configuration.',
    step: (n: number) => `Step ${n}`,
    chooseModel: 'Choose a model',
    model: 'Model',
    modelOption: (name: string, hz: number) => `${name} · ${hz} Hz`,
    chooseFormat: 'Choose a format',
    generateStep: 'Generate your file',
    generate: 'Generate file',
    generating: (percent: number) => `Generating file… ${percent} %`,
    ready: 'Your file is ready',
    download: 'Download',
    downloadStarted: (name: string) => `Download started: ${name}`,
    previewLabel: '3D preview',
    previewHint: 'Hover to tilt',
    info: {
      title: 'Model information',
      productNumber: 'Product no.',
      frequency: 'Frequency',
      connection: 'Connection',
      impeller: 'Impeller Ø',
      weight: 'Weight',
      format: 'Format',
      lod: 'Level of detail',
      size: 'Approx. file size',
    },
  },
  /** Band under the header on products with configured variants (XFP). */
  configured: {
    eyebrow: 'Configured products',
    title: (product: string) => `Know your exact ${product} pump?`,
    text: 'Open its page for spare parts on the exploded drawing, curves, drawings, price and lead time.',
    demo: (code: string) => `Open ${code}`,
    all: (count: number) => `All ${count} variants`,
  },
  /** Spare parts tab on products with configured variants: parts depend on the exact pump. */
  variantSpareParts: {
    title: 'Spare parts depend on the exact pump',
    text: (code: string) =>
      `Each configured pump has its own parts list and exploded drawing. ${code} has them online now.`,
    action: 'Show its spare parts',
  },
  services: {
    title: 'Services',
    intro: (product: string) =>
      `Keep your ${product} running at its best, with services from the people who designed it.`,
    learnMore: 'Learn more',
    band: {
      title: (product: string) => `Need help with your ${product}?`,
      text: 'Tell us what you need and when. A Sulzer service coordinator confirms the visit within one working day.',
      action: 'Request service',
    },
    request: {
      title: (product: string) => `Request service for ${product}`,
      close: 'Close',
      serviceType: 'Service type',
      otherService: 'Other or not sure',
      date: 'Preferred date',
      site: 'Site',
      sitePlaceholder: 'Plant or pump station, city',
      name: 'Your name',
      company: 'Company',
      message: 'Message',
      messagePlaceholder: 'Describe the issue or what you would like us to do',
      prefilled: 'We filled in your details from your mySulzer account.',
      cancel: 'Cancel',
      submit: 'Send request',
      sentTitle: 'Request sent',
      sentText: 'A Sulzer service coordinator will confirm the date within one working day.',
      reference: 'Reference',
      viewRequests: 'View my requests',
      requestsTo: '/self-service/requests',
      done: 'Done',
      noDate: 'As soon as possible',
    },
  },
}

/** /products: search results, or every product (Products A–Z) without a query. */
export const searchPage = {
  breadcrumb: [{ label: 'Products & services', to: '/products' }] satisfies NavItem[],
  searchCrumb: 'Search',
  allCrumb: 'Products A–Z',
  searchLabel: 'Search products, applications and documents',
  searchButtonLabel: 'Search',
  resultsTitle: (count: number, term: string) =>
    count === 0
      ? `No results for ‘${term}’`
      : `${count} ${count === 1 ? 'result' : 'results'} for ‘${term}’`,
  allTitle: 'Products A–Z',
  allText: (count: number) =>
    `All ${count} Sulzer products, from pumps to digital solutions. Filter by category, application or performance.`,
  tabs: {
    all: 'All',
    products: 'Products',
    documentation: 'Documentation',
    support: 'Support & learn',
    pages: 'Pages',
  },
  tabLabel: (label: string, count: number) => `${label} (${count})`,
  /** Sections of the All tab; each shows its first few hits and links to its tab. */
  all: {
    preview: 3,
    /** Spare parts have no tab of their own, so the All tab lists more of them. */
    partsPreview: 10,
    sections: {
      products: 'Products',
      parts: 'Spare parts',
      documentation: 'Documentation',
      support: 'Support & learn',
      pages: 'Pages',
    },
    showAll: (count: number) => `Show all ${count}`,
  },
  support: { services: 'Services', knowledge: 'Learn' },
  /** Variant mode of the Products tab: configured products with their own filter list. */
  variants: {
    filterTitle: 'Filter list',
    /** Heading over the list, e.g. "9 variants of XFP" or "3 of 14 variants of AHLSTAR". */
    heading: (shown: number, total: number, product: string | null) => {
      const count = shown === total ? `${total}` : `${shown} of ${total}`
      const noun = total === 1 ? 'variant' : 'variants'
      return product ? `${count} ${noun} of ${product}` : `${count} ${noun}`
    },
    range: (from: number, to: number, total: number) => `Showing ${from}–${to} of ${total}`,
    pagination: {
      label: 'Result pages',
      previous: 'Previous page',
      next: 'Next page',
      page: (n: number) => `Page ${n}`,
    },
    perPage: 10,
    showCurve: 'Show curve',
    hideCurve: 'Hide curve',
    groups: {
      range: 'Product range',
      discontinued: 'Discontinued products',
      frequency: 'Frequency',
      phase: 'Phase',
      power: 'P2',
      ip: 'IP class',
      housing: 'Pump housing',
      inlet: 'Pump inlet',
      outlet: 'Pump outlet',
      impeller: 'Impeller type',
      ex: 'Ex approval',
    },
    status: { current: 'Current products', discontinued: 'Discontinued products' },
    /** P2 filter, by motor power. */
    powerBuckets: [
      { value: 'up-to-10', label: 'Up to 10 kW', upTo: 10 },
      { value: '10-30', label: '10–30 kW', above: 10, upTo: 30 },
      { value: '30-100', label: '30–100 kW', above: 30, upTo: 100 },
      { value: 'above-100', label: 'Above 100 kW', above: 100 },
    ] as { value: string; label: string; above?: number; upTo?: number }[],
    yesNo: { yes: 'Yes', no: 'No' },
    productNumber: 'Product no.',
    number: 'No.',
    discontinued: 'Discontinued',
    replacedBy: 'Replaced by',
    specs: {
      frequency: 'Frequency',
      phase: 'Phase',
      power: 'P2',
      speed: 'Rated speed',
      voltage: 'Voltage',
      ipClass: 'IP class',
      housing: 'Pump housing',
      impeller: 'Impeller',
      inlet: 'Pump inlet',
      outlet: 'Pump outlet',
      ambient: 'Max. ambient temperature',
      ex: 'Ex approval',
      maxFlow: 'Max. flow',
      maxHead: 'Max. head',
      cable: 'Cable length',
      weight: 'Weight',
    },
  },
  part: {
    detail: (partNumber: string, position: string) => `Part no. ${partNumber} · Pos. ${position}`,
    forProduct: (code: string) => `Spare part for ${code}`,
  },
  filters: {
    title: 'Filter',
    reset: 'Reset',
    showMore: (count: number) => `Show ${count} more`,
    showLess: 'Show less',
    /** Phones and tablets: the filter list is folded away behind this toggle. */
    show: (active: number) => (active > 0 ? `Show filters (${active})` : 'Show filters'),
    hide: 'Hide filters',
    groups: {
      category: 'Category',
      application: 'Application',
      temp: 'Liquid temperature',
      flow: 'Max. flow',
    },
    /** Pumps are bucketed by the top of their range. */
    tempBuckets: [
      { value: 'up-to-60', label: 'Up to 60 °C', upTo: 60 },
      { value: '60-120', label: '60–120 °C', above: 60, upTo: 120 },
      { value: 'above-120', label: 'Above 120 °C', above: 120 },
    ],
    flowBuckets: [
      { value: 'up-to-1000', label: 'Up to 1 000 m³/h', upTo: 1000 },
      { value: '1000-5000', label: '1 000–5 000 m³/h', above: 1000, upTo: 5000 },
      { value: 'above-5000', label: 'Above 5 000 m³/h', above: 5000 },
    ],
  },
  productCount: (shown: number, total: number) =>
    shown === total
      ? `${total} ${total === 1 ? 'product' : 'products'}`
      : `${shown} of ${total} products`,
  sortLabel: 'Sort by',
  sort: {
    relevance: 'Relevance',
    name: 'Name A–Z',
    power: 'P2',
    flow: 'Max. flow',
    head: 'Max. head',
    price: 'Price',
  },
  noFilterMatches: {
    title: 'No products match these filters',
    text: 'Remove a filter, or reset them all to see every match again.',
    action: 'Reset filters',
  },
  emptyTab: (kind: string, term: string) => `No ${kind} match ‘${term}’.`,
  emptyTabHint: 'There are matches on these tabs:',
  noResults: {
    title: 'Try another search',
    text: 'Check the spelling, use fewer or more general words, or start from one of these:',
    browseAll: 'Browse all products',
  },
}

/** Scope dropdown of the home hero and header search fields. */
export const searchScopes = [
  { id: 'products', label: 'Products' },
  { id: 'parts', label: 'Part numbers', placeholder: 'Enter a part number or part name' },
  { id: 'documents', label: 'Documents', placeholder: 'Search documents by title or number' },
] satisfies { id: SearchScope; label: string; placeholder?: string }[]

/** Suggestion panel under the header and home hero search fields. */
export const searchSuggestions = {
  label: 'Search suggestions',
  groups: {
    product: 'Products',
    application: 'Applications',
    document: 'Documents',
    part: 'Spare parts',
  },
  productNumber: (number: string) => `Product no. ${number}`,
  discontinued: 'Discontinued',
  partDetail: (partNumber: string, position: string, code: string) =>
    `Part no. ${partNumber} · Pos. ${position} · ${code}`,
  seeAll: (term: string) => `See all results for ‘${term}’`,
  noMatches: (term: string) => `No suggestions for ‘${term}’. Search anyway:`,
}

/** Buttons on product and service rows (Products & solutions tab, /products results). */
export const catalogList = {
  viewLabel: 'View',
  sizeRangeLabel: 'Size range',
}
