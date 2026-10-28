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
    { label: 'Products A–Z', to: '/products/a-z' },
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
  modelsTitle: (count: number) => `${count} models`,
  documentationTitle: 'Documentation',
  bimTitle: 'BIM & CAD downloads',
  sparePartsTitle: 'Genuine spare parts',
  sparePartsLink: { label: 'Open spare parts finder', to: '/spare-parts' } satisfies NavItem,
  servicesTitle: 'Services for this product',
  tabEmpty: {
    title: 'Content for this tab is on its way',
    text: 'Contact your local Sulzer team for anything you need about this product.',
  } satisfies TabComingSoonCopy,
}

export const productSearchPage = {
  title: 'Product Center',
  subtitle: 'Search the full Sulzer range by product name, model or application.',
  searchLabel: 'Find a Sulzer product',
  searchButtonLabel: 'Search',
  allProductsTitle: 'All products',
  resultsTitle: (count: number, query: string) =>
    `${count} ${count === 1 ? 'result' : 'results'} for “${query}”`,
  noResultsTitle: (query: string) => `No products match “${query}”`,
  noResultsText: 'Check the spelling or try a broader term. Here are our most popular products.',
}

/** Buttons on product and service rows (Products & solutions tab, Product Center results). */
export const catalogList = {
  viewLabel: 'View',
  sizeRangeLabel: 'Size range',
}

/** Copy for feature pages that aren't built yet. */
export const comingSoon = {
  sizing: {
    title: 'Sizing & configuration',
    description: 'Enter your duty point and get matching Sulzer pumps, curves and energy data.',
    panelTitle: 'Size and configure in minutes',
    panelText:
      'Our new sizing tool takes you from duty point to a fully configured pump – with curves, energy data and drawings – and saves the result straight to your project.',
    features: [
      'Flow and head entry with live performance curves',
      'Ranked matches by efficiency and lifetime cost',
      'Configure motor, materials and accessories',
      'Add the result to My projects with one click',
    ],
  },
  myProjects: {
    title: 'My projects',
    description: 'Collect products, sizing results and documents per project and share them.',
    panelTitle: 'Your projects, all in one place',
    panelText:
      'Keep every product, sizing result, drawing and quotation for a project together – and work on it with your colleagues and Sulzer.',
    features: [
      'Products and sizing results per project',
      'Drawings, BIM files and tender texts',
      'Share with colleagues and your Sulzer contact',
      'Request a quotation for the whole project',
    ],
  },
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
