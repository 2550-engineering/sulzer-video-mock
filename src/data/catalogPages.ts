import type { ComingSoonContent, NavItem, TabComingSoonCopy, TabDef } from '../types'

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
  productsEmpty: {
    title: 'Solutions for this application are on their way',
    text: 'Our application specialists can recommend the right Sulzer products for your process today.',
  } satisfies TabComingSoonCopy,
  exploreEmpty: {
    title: 'Application guide coming soon',
    text: 'We are writing an in-depth guide for this application. In the meantime, see the products and solutions that fit.',
  } satisfies TabComingSoonCopy,
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
    title: 'Learning for this application is on its way',
    text: 'Soon you will find courses, webinars and in-depth guides for this application here, created by Sulzer application engineers.',
    features: [
      'Self-paced courses with certificates',
      'Live and on-demand webinars',
      'Design guides and best practices',
    ],
    back: { label: 'Visit Sulzer Academy', to: '/learn' } satisfies NavItem,
  },
}

/** "Show more" toggle on Explore tabs. */
export const exploreIntroBand = {
  showMore: 'Show more',
  showLess: 'Show less',
}

export const productPage = {
  tabs: [
    { id: 'explore', label: 'Explore' },
    { id: 'models', label: 'Models' },
    { id: 'documentation', label: 'Documentation' },
    { id: 'bim', label: 'BIM' },
    { id: 'spare-parts', label: 'Spare parts' },
    { id: 'services', label: 'Services' },
  ] satisfies TabDef[],
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
  stories: {
    title: 'See how customers benefit',
    text: 'Plants around the world run on Sulzer pumps every day. Here is what that means for them.',
    label: 'Case',
  },
  sizeLabel: 'Size product',
  keySpecLabels: {
    liquidTemp: 'Liquid temperature',
    maxFlow: 'Max. flow',
    maxHead: 'Max. head',
    maxPressure: 'Max. pressure',
  },
  models: {
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
      availability: 'Availability',
    },
    units: { flow: 'm³/h', head: 'm', power: 'kW', speed: 'rpm' },
    signInForPrices: 'Sign in to see prices',
    priceNote: 'List prices excl. VAT',
    inStock: 'In stock',
    showDetails: (name: string) => `Show details for ${name}`,
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
      addedToProject: 'Added to My projects',
      viewProjects: 'View',
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
        shaftSeal: 'Shaft seal',
        maxPressure: 'Max. pressure',
        weight: 'Weight',
        listPrice: 'List price',
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
  spareParts: {
    title: 'Spare parts for this product are coming to mySulzer',
    text: 'Soon you can find genuine parts on the sectional drawing, check prices and stock, and order online. Until then, your local Sulzer team is happy to help.',
  } satisfies TabComingSoonCopy,
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
  tabEmpty: {
    title: 'Content for this tab is on its way',
    text: 'Contact your local Sulzer team for anything you need about this product.',
  } satisfies TabComingSoonCopy,
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
    products: 'Products',
    applications: 'Applications',
    documents: 'Documents',
  },
  tabLabel: (label: string, count: number) => `${label} (${count})`,
  filters: {
    title: 'Filter',
    reset: 'Reset',
    showMore: (count: number) => `Show ${count} more`,
    showLess: 'Show less',
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
  sort: { relevance: 'Relevance', name: 'Name A–Z' },
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

/** Suggestion panel under the header and home hero search fields. */
export const searchSuggestions = {
  label: 'Search suggestions',
  groups: {
    product: 'Products',
    application: 'Applications',
    document: 'Documents',
  },
  seeAll: (term: string) => `See all results for ‘${term}’`,
  noMatches: (term: string) => `No suggestions for ‘${term}’. Search anyway:`,
}

/** Buttons on product and service rows (Products & solutions tab, /products results). */
export const catalogList = {
  viewLabel: 'View',
  sizeRangeLabel: 'Size range',
}

/** Copy for feature pages that aren't built yet. */
export const comingSoon = {
  assets: {
    title: 'My assets',
    description: 'Your installed base with live condition, alerts and service history.',
    panelTitle: 'Your installed base, live',
    panelText:
      'See the condition of every Sulzer pump and mixer you own, get alerts before problems turn into downtime and plan service on real data.',
    features: [
      'Live status and readings for every asset',
      'Alerts when vibration or temperature drifts',
      'Service history and spare parts per asset',
      'Book service straight from an alert',
    ],
  },
} satisfies Record<string, ComingSoonContent>
