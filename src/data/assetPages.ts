import { CalendarClock, CircleAlert, MapPin, Plug, Server } from 'lucide-react'
import { demoClock, products } from '../config/demo'
import { serviceDueWithinDays } from '../lib/assetSummary'
import type { AssetStatus, ConditionChannel, DocumentType, ServiceKind, TabDef } from '../types'

/* Copy for My assets ("/assets") and the asset page ("/assets/:id"). */

const parents = [
  { label: 'mySulzer', to: '/my-sulzer' },
  { label: 'My Pages', to: '/my-pages' },
]

export const statusLabels: Record<AssetStatus, string> = {
  ok: 'Normal',
  warning: 'Warning',
  alarm: 'Alarm',
}

export const channels: Record<ConditionChannel, { label: string; unit: string; decimals: number }> =
  {
    vibration: { label: 'Vibration', unit: 'mm/s', decimals: 1 },
    bearingTemperature: { label: 'Bearing temperature', unit: '°C', decimals: 0 },
    motorTemperature: { label: 'Motor temperature', unit: '°C', decimals: 0 },
  }

/** Where "Open in Sulzer Connect" goes. */
export const connectAssetPath = (assetId: string) => `/connect/assets/${assetId}`

export const syncLabel = `${products.connect} · Updated today, ${demoClock.lastSync}`

export const assetListPage = {
  title: 'My assets',
  breadcrumb: parents,
  description: (sites: number) =>
    `Every Sulzer pump you run, across your ${sites} sites: live condition, service and documentation in one place.`,
  openConnect: `Open ${products.connect}`,
  connectTo: '/connect/dashboard',
  summary: {
    label: 'Installed base summary',
    all: { label: 'assets', detail: 'Show all', icon: Server },
    sites: { label: 'sites', detail: 'Group by site', icon: MapPin },
    connected: { label: 'connected', detail: `Live in ${products.connect}`, icon: Plug },
    attention: {
      label: 'need attention',
      detail: (alarms: number, warnings: number) =>
        `${alarms} alarm${alarms === 1 ? '' : 's'} · ${warnings} warning${warnings === 1 ? '' : 's'}`,
      icon: CircleAlert,
    },
    service: {
      label: 'service due',
      detail: `Within ${serviceDueWithinDays} days`,
      icon: CalendarClock,
    },
  },
  filters: {
    title: 'Filter',
    site: 'Site',
    product: 'Product',
    status: 'Status',
    connected: `${products.connect}`,
    connectedYes: 'Connected',
    connectedNo: 'Not connected',
    service: 'Next service',
    serviceDue: `Due within ${serviceDueWithinDays} days`,
    active: 'Filtered by',
    remove: (label: string) => `Remove filter ${label}`,
    reset: 'Reset all',
  },
  search: 'Search by tag or serial number',
  count: (shown: number, total: number) =>
    shown === total ? `${total} assets` : `${shown} of ${total} assets`,
  view: { label: 'View', list: 'List', sites: 'By site' },
  sort: {
    label: 'Sort by',
    options: {
      attention: 'Needs attention first',
      tag: 'Tag (A–Z)',
      service: 'Next service',
    },
  },
  columns: {
    asset: 'Asset',
    product: 'Product and model',
    site: 'Site',
    reading: 'Last reading',
    service: 'Next service',
  },
  notConnected: 'Not connected',
  stopped: (time: string) => `Stopped · last ran ${time}`,
  running: (time: string) => `Running · ${time}`,
  inDays: (days: number) =>
    days < 0 ? `${-days} days overdue` : days === 0 ? 'Today' : `In ${days} days`,
  siteAssets: (count: number) => `${count} asset${count === 1 ? '' : 's'}`,
  siteAttention: (count: number) => `${count} need${count === 1 ? 's' : ''} attention`,
  siteAllNormal: 'All normal',
  noResults: {
    title: 'No assets match your filters',
    text: 'Try another tag or serial number, or reset the filters.',
    action: 'Reset filters',
  },
}

export const assetPage = {
  breadcrumbParents: [...parents, { label: 'My assets', to: '/assets' }],
  /** Partner mode: the chip above the tag. */
  customer: 'Customer',
  serial: 'Serial no.',
  viewProduct: 'View product',
  actions: {
    requestService: 'Request service',
    orderParts: 'Order spare parts',
    findReplacement: 'Find replacement',
    replacementTo: (serial: string) => `/products/replacement?serial=${serial}`,
    openConnect: `Open in ${products.connect}`,
  },
  facts: {
    serial: 'Serial number',
    installed: 'Installed',
    warranty: 'Warranty until',
    warrantyExpired: 'Expired',
    warrantyActive: 'Active',
    runHours: 'Run hours',
    lastService: 'Last service',
    nextService: 'Next service',
  },
  /** Service type the request form starts on: with an active alert, and without. In order of preference. */
  requestServices: {
    alert: ['inspection', 'vibration-analysis', 'repair-overhaul'],
    routine: ['service-agreements', 'inspection', 'repair-overhaul'],
  },
  alert: {
    title: (channel: string, level: AssetStatus) => `${channel} above ${level} limit`,
    since: (when: string) => `since ${when}`,
    now: (value: string, limit: string) => `Now ${value} · limit ${limit}`,
    recommended: 'Recommended action',
    viewCondition: 'View condition',
  },
  today: (time: string) => `today ${time}`,
  tabs: [
    { id: 'overview', label: 'Overview' },
    { id: 'condition', label: 'Condition' },
    { id: 'documents', label: 'Documents' },
    { id: 'spare-parts', label: 'Spare parts' },
    { id: 'service-history', label: 'Service history' },
  ] satisfies TabDef[],
  overview: {
    facts: 'Key facts',
    product: 'Product',
    model: 'Model',
    productNumber: 'Product no.',
    rated: 'Rated duty',
    ratedValue: (flow: number, head: number) => `${flow} m³/h at ${head} m`,
    power: 'Motor power',
    site: 'Site',
    customer: 'Owner',
    readings: 'Latest readings',
    readingsNote: (time: string) => `Hourly from ${products.connect} · last ${time}`,
    trendLabel: 'Last 7 days',
    trendHours: 7 * 24,
    limit: (value: string) => `Warning at ${value}`,
    nextService: 'Next service',
    serviceType: 'Annual service',
    serviceBy: 'Sulzer Service Center Västerås',
    lastService: (date: string) => `Last serviced ${date}`,
    book: 'Book now',
    reschedule: 'Change date',
  },
  condition: {
    title: 'Condition',
    intro: (connect: string) => `Last 30 days, hourly data from ${connect}.`,
    stats: { now: 'Now', min: 'Min', avg: 'Avg', max: 'Max' },
    warning: 'Warning',
    alarm: 'Alarm',
    runTime: 'Run time',
    runTimeValue: (hours: number, percent: number) => `${hours} h · ${percent}% of the time`,
    starts: 'Starts',
    healthy: 'All readings within limits',
    band: {
      title: 'See the full picture in Sulzer Connect',
      text: 'Zoom into any hour, compare assets and get alerts on your phone.',
      action: `Open full monitoring in ${products.connect}`,
    },
  },
  upsell: {
    badge: products.connect,
    title: 'Connect this asset',
    text: 'Fit a Sulzer Connect sensor and see vibration, temperature and run time live, with alerts before a fault stops the pump.',
    points: ['Retrofit in under an hour', 'No changes to the pump', 'Alerts by e-mail and app'],
    action: 'Get it connected',
    actionTo: '/products/sulzer-connect',
    learnMore: 'How it works',
    learnMoreTo: '/products/sulzer-connect',
  },
  documents: {
    title: 'Documents',
    forSerial: (serial: string) => `For serial no. ${serial}`,
    /** Not specific to one unit, so not labelled with its serial number. */
    genericTypes: ['Brochure'] as DocumentType[],
    intro: (model: string, serial: string) =>
      `Manuals, data sheets and certificates for ${model}, serial no. ${serial}.`,
    empty: {
      title: 'Documents on request',
      text: 'We are adding the documentation for this unit. Ask us and we will send it within one working day.',
    },
  },
  spareParts: {
    title: 'Spare parts',
    intro: (model: string, serial: string) =>
      `Genuine Sulzer parts that fit ${model}, serial no. ${serial}. Select a number on the drawing to find the part.`,
    recommended: 'Recommended for the current alert',
    addRecommended: 'Add to cart',
    quote: 'Request a quotation',
    quoteTo: '/contact/quote',
    empty: {
      title: 'Parts list on request',
      text: 'Tell us the serial number and we will send the parts list for this unit.',
    },
  },
  history: {
    title: 'Service history',
    intro: (count: number) => `${count} visits since installation.`,
    technician: 'Technician',
    report: 'Service report',
    reportDownloaded: (reference: string) => `Service report ${reference}.pdf downloaded`,
    kinds: {
      Service: 'bg-primary-tint text-primary',
      Repair: 'bg-warning-tint text-warning-strong',
      Inspection: 'bg-surface-sunken text-navy-700',
      Upgrade: 'bg-success-tint text-success-strong',
      Commissioning: 'bg-surface-sunken text-navy-700',
    } satisfies Record<ServiceKind, string>,
  },
}
