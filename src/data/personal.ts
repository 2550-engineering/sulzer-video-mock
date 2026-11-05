import { market, type PersonaId } from '../config/demo'
import { defaultPreferences } from '../lib/personal'
import type { NavItem, PersonalData } from '../types'

/*
 * Personal toolbar (slide 12) and the My saved items and Recently viewed pages.
 * Saved items, recently viewed and preferences are kept per persona in
 * localStorage; "Reset demo" returns them to these seeds.
 */

/** What each persona has saved and viewed before the demo starts. Personas without a seed start empty. */
export const personalSeeds: Partial<Record<PersonaId, PersonalData>> = {
  endUser: {
    saved: [
      { kind: 'product', id: 'ahlstar' },
      { kind: 'document', id: 'doc-ahlstar-iom' },
      { kind: 'document', id: 'doc-ahlstar-datasheet' },
      { kind: 'product', id: 'xfp' },
      { kind: 'document', id: 'doc-xfp-iom' },
      { kind: 'product', id: 'sjt' },
    ],
    recent: ['ahlstar', 'xfp', 'sns', 'smd'],
    preferences: defaultPreferences,
  },
  channelPartner: {
    saved: [
      { kind: 'product', id: 'ahlstar' },
      { kind: 'product', id: 'afp' },
      { kind: 'product', id: 'j-dewatering' },
      { kind: 'document', id: 'doc-water-brochure' },
    ],
    recent: ['ahlstar', 'afp', 'xfp'],
    preferences: defaultPreferences,
  },
}

export const emptyPersonal: PersonalData = {
  saved: [],
  recent: [],
  preferences: defaultPreferences,
}

/** Pages that show the personal toolbar (signed in): product, application and search pages. */
export const toolbarPaths = [/^\/products(\/|$)/, /^\/applications(\/|$)/]

const myPages: NavItem = { label: 'My Pages', to: '/my-pages' }
const mySulzer: NavItem = { label: 'mySulzer', to: '/my-sulzer' }

export const personalToolbar = {
  label: 'Personal toolbar',
  close: 'Close',
  compare: {
    label: 'Compare',
    title: 'Compare models',
    subtitle: (count: number, max: number) => `${count} of ${max} models selected`,
    empty: {
      title: 'Nothing to compare yet',
      text: 'Tick “Compare” on up to three models on a product’s Models tab, and they collect here.',
    },
    open: 'Compare now',
    needTwo: 'Select at least 2 models to compare',
    clear: 'Clear selection',
    remove: (name: string) => `Remove ${name} from comparison`,
  },
  saved: {
    label: 'Saved items',
    title: 'Saved items',
    subtitle: (count: number) => `${count} ${count === 1 ? 'item' : 'items'}`,
    empty: {
      title: 'No saved items yet',
      text: 'Use the bookmark on a product page to keep products here for later.',
    },
    viewAll: 'View all saved items',
    to: '/my-pages/saved',
  },
  sizing: {
    label: 'Sizing',
    title: 'Sizing',
    subtitle: 'Find the right pump for your duty point',
    sizeThis: (name: string) => `Size ${name}`,
    start: 'Start a new sizing',
    recentTitle: 'Your saved sizings',
    inProject: (project: string) => `In ${project}`,
    empty: 'Sizings you save to a project show up here.',
    to: '/sizing',
  },
  projects: {
    label: 'My projects',
    title: 'My projects',
    subtitle: (count: number) => `${count} ${count === 1 ? 'project' : 'projects'}`,
    items: (count: number) => `${count} ${count === 1 ? 'product' : 'products'}`,
    modified: (when: string) => `Changed ${when.toLowerCase()}`,
    viewAll: 'View all projects',
    to: '/my-projects',
  },
  recent: {
    label: 'Recently viewed',
    title: 'Recently viewed',
    subtitle: 'Products you looked at last',
    empty: {
      title: 'Nothing viewed yet',
      text: 'Products you open show up here, so you can pick up where you left off.',
    },
    /** Products listed in the panel; the page lists them all. */
    max: 5,
    viewAll: 'View all recently viewed',
    to: '/my-pages/recently-viewed',
  },
  units: {
    label: 'Units & market',
    /** Two lines under the gear: market and mains frequency. */
    caption: (hz: number) => [market.country, `${hz} Hz`],
    title: 'Units & market',
    subtitle: 'Applies to prices, data sheets and sizing',
    marketTitle: 'Your market',
    rows: [
      { label: 'Country', value: market.country },
      { label: 'Language', value: market.language },
      { label: 'Currency', value: market.currency },
    ],
    marketNote:
      'Your market is set by your mySulzer account. Contact your Sulzer team to change it.',
    unitsLabel: 'Units',
    units: { metric: 'Metric (SI)', us: 'US customary' },
    frequencyLabel: 'Mains frequency',
    frequencyNote: 'Model lists open on this frequency.',
    saved: 'Preferences saved',
  },
}

export const savedPage = {
  title: 'My saved items',
  description: 'Products and documents you have bookmarked, in one place.',
  breadcrumb: [mySulzer, myPages],
  filters: { all: 'All', product: 'Products', document: 'Documents' },
  count: (count: number) => `${count} saved ${count === 1 ? 'item' : 'items'}`,
  kind: { product: 'Product', document: 'Document' },
  open: 'Open',
  download: 'Download',
  remove: (name: string) => `Remove ${name} from saved items`,
  removed: 'Removed from My saved items',
  empty: {
    title: 'Nothing saved here yet',
    text: 'Use the bookmark on any product page to keep it here, ready for later.',
    action: { label: 'Browse products', to: '/products' } satisfies NavItem,
  },
}

export const recentPage = {
  title: 'Recently viewed products',
  description: 'Pick up where you left off.',
  breadcrumb: [mySulzer, myPages],
  count: (count: number) => `${count} ${count === 1 ? 'product' : 'products'}`,
  latest: 'Last viewed',
  clear: 'Clear history',
  cleared: 'Recently viewed cleared',
  view: 'View product',
  empty: {
    title: 'No recently viewed products',
    text: 'Products you open while signed in show up here.',
    action: { label: 'Browse products', to: '/products' } satisfies NavItem,
  },
}
