import {
  Building2,
  CircleAlert,
  FileText,
  FolderKanban,
  GraduationCap,
  Plug,
  Tags,
  TriangleAlert,
  Truck,
  Wrench,
} from 'lucide-react'
import { demoClock, partnerPricing, personas, products } from '../config/demo'
import type { ActivityItem, DashboardCard, NavItem, PartnerAccount } from '../types'
import { customers } from './assets'
import { nordvattenAddress } from './orders'
import {
  orderPath,
  ordersPath,
  quotationPath,
  quotationsPath,
  requestsPath,
} from './selfServicePages'

/*
 * The channel partner layer (slide 13): Partner My Pages, the customer accounts
 * ("/partner/customers") and the partner's side of each account. Aqua Pumpteknik and
 * its customers are fictional; names, people, addresses and logos are invented for the
 * demo: see docs/content-to-confirm.md.
 */

const partner = personas.channelPartner

export const partnerCustomersPath = '/partner/customers'
export const partnerCustomerPath = (customerId: string) => `${partnerCustomersPath}/${customerId}`

const customer = (id: string) => customers.find((c) => c.id === id)!

/** The customer's own contact first, from data/assets.ts. */
const mainContact = (id: string, phone: string) => ({ ...customer(id).contact, phone })

export const partnerAccounts: Record<string, PartnerAccount> = {
  nordvatten: {
    customerId: 'nordvatten',
    accountManager: partner.name,
    customerSince: 2016,
    quotationDiscount: 8,
    contacts: [
      mainContact('nordvatten', '+46 21 39 10 42'),
      {
        name: 'Johan Berg',
        role: 'Process engineer',
        email: 'johan.berg@nordvatten.example',
        phone: '+46 21 39 10 57',
      },
      {
        name: 'Sara Nyström',
        role: 'Purchasing',
        email: 'sara.nystrom@nordvatten.example',
        phone: '+46 21 39 10 18',
      },
    ],
    deliveryAddresses: [
      { id: 'goods-reception', label: nordvattenAddress[1], lines: nordvattenAddress },
      {
        id: 'riverside-intake',
        label: 'Riverside intake',
        lines: [
          customer('nordvatten').name,
          'Riverside intake pump house',
          'Strandvägen 4',
          '721 30 Västerås',
          'Sweden',
        ],
      },
    ],
    logo: {
      mark: 'wave',
      color: '#1d5c96',
      accent: '#3b8fc9',
      name: 'NORDVATTEN',
      tagline: 'UTILITIES',
    },
  },
  malarbruk: {
    customerId: 'malarbruk',
    accountManager: 'Karin Sjöberg',
    customerSince: 2012,
    quotationDiscount: 6,
    contacts: [
      mainContact('malarbruk', '+46 221 72 40 15'),
      {
        name: 'Erik Lindgren',
        role: 'Maintenance Manager',
        email: 'erik.lindgren@malarbruk.example',
        phone: '+46 221 72 40 02',
      },
    ],
    deliveryAddresses: [
      {
        id: 'mill-stores',
        label: 'Mill stores, gate 3',
        lines: [
          customer('malarbruk').name,
          'Mill stores, gate 3',
          'Bruksgatan 1',
          '731 36 Köping',
          'Sweden',
        ],
      },
    ],
    logo: {
      mark: 'sheets',
      color: '#5b4a3a',
      accent: '#a07a4a',
      name: 'MÄLARBRUK',
      tagline: 'PAPER',
    },
  },
  'sorby-livsmedel': {
    customerId: 'sorby-livsmedel',
    accountManager: partner.name,
    customerSince: 2021,
    quotationDiscount: 5,
    contacts: [mainContact('sorby-livsmedel', '+46 16 54 22 30')],
    deliveryAddresses: [
      {
        id: 'goods-reception',
        label: 'Goods reception',
        lines: [
          customer('sorby-livsmedel').name,
          'Goods reception',
          'Mejerivägen 12',
          '632 20 Eskilstuna',
          'Sweden',
        ],
      },
    ],
    logo: {
      mark: 'leaf',
      color: '#2f6b3a',
      accent: '#6f9a3e',
      name: 'SÖRBY',
      tagline: 'LIVSMEDEL',
    },
  },
  'vastmalm-energi': {
    customerId: 'vastmalm-energi',
    accountManager: 'Henrik Dahl',
    customerSince: 2018,
    quotationDiscount: 5,
    contacts: [
      mainContact('vastmalm-energi', '+46 224 38 60 11'),
      {
        name: 'Mats Öberg',
        role: 'Shift supervisor, Sala CHP',
        email: 'mats.oberg@vastmalmenergi.example',
        phone: '+46 224 38 60 24',
      },
    ],
    deliveryAddresses: [
      {
        id: 'sala-chp',
        label: 'Sala CHP plant',
        lines: [
          customer('vastmalm-energi').name,
          'Sala CHP plant',
          'Kraftvärmevägen 4',
          '733 36 Sala',
          'Sweden',
        ],
      },
      {
        id: 'heby-dh',
        label: 'Heby district heating station',
        lines: [
          customer('vastmalm-energi').name,
          'Heby district heating station',
          'Värmeverksgatan 2',
          '744 31 Heby',
          'Sweden',
        ],
      },
    ],
    logo: {
      mark: 'flame',
      color: '#b8461b',
      accent: '#e08a2c',
      name: 'VÄSTMALM',
      tagline: 'ENERGI',
    },
  },
}

/** "Nordvatten Utilities", without the company form. */
export const shortName = (name: string) => name.replace(/ AB$/, '')

const myPages: NavItem = { label: 'My Pages', to: '/my-pages' }
const parents: NavItem[] = [{ label: 'mySulzer', to: '/my-sulzer' }, myPages]

/* ── Partner My Pages ──────────────────────────────────────────────────────── */

export const partnerDashboard = {
  subtitle: 'Your customers, quotations and Sulzer tools in one place',
  badge: 'Partner',
  identity: `${partner.partner.type} · ${partner.partner.region}`,
  customers: {
    title: 'My customers',
    subtitle: 'Your customers’ installed base at a glance',
    icon: Building2,
    customers: (sites: number, assets: number) => `${sites} sites · ${assets} assets`,
    attention: (names: string[], alarms: number, warnings: number) =>
      names.length === 0
        ? 'All customers running normally'
        : `${names.join(', ')} · ${alarms} alarm${alarms === 1 ? '' : 's'} · ${warnings} warning${warnings === 1 ? '' : 's'}`,
    requests: 'Across your customers',
    source: `Live from ${products.connect} · Updated today, ${demoClock.lastSync}`,
    link: { label: 'View all customers', to: partnerCustomersPath } satisfies NavItem,
  },
  /** Badges for live counts, matched on the link's `to` (MyPagesPage). */
  badges: {
    open: (n: number) => `${n} open`,
    inTransit: (n: number) => `${n} in transit`,
    count: (n: number) => String(n),
  },
  cards: {
    quotations: {
      title: 'Quotations',
      subtitle: 'Quote your customers on your own letterhead',
      icon: FileText,
      links: [
        { label: 'Open quotations', to: `${quotationsPath}?status=open` },
        { label: 'Accepted quotations', to: `${quotationsPath}?status=accepted` },
        { label: 'Create a quotation from a project', to: '/my-projects' },
        { label: 'All quotations', to: quotationsPath },
      ],
    },
    orders: {
      title: 'Orders',
      subtitle: 'Order Sulzer parts for your customers',
      icon: Truck,
      links: [
        { label: 'Order status incl. track & trace', to: ordersPath },
        { label: 'Quick order in the eShop', to: '/eshop' },
        { label: 'Service requests', to: requestsPath },
        { label: 'Export order history', to: '/self-service/export' },
      ],
    },
    prices: {
      title: 'Partner prices & availability',
      subtitle: `Your net prices and lead times, ${partnerPricing.discount}% off list`,
      icon: Tags,
      links: [
        {
          label: 'Spare parts: net price & lead time',
          to: '/spare-parts',
          badge: { label: `−${partnerPricing.discount}%`, tone: 'info' },
        },
        { label: 'Pump models: net price & lead time', to: '/products/ahlstar#models' },
        { label: 'Replacement finder', to: '/products/replacement/existing-pump' },
        { label: 'Download your price list', to: '/self-service/export' },
      ],
    },
    projects: {
      title: 'Projects',
      subtitle: 'Size, configure and share with your customers',
      icon: FolderKanban,
      links: [
        { label: 'My projects', to: '/my-projects' },
        { label: 'Shared with customers', to: '/my-projects?shared=1' },
        { label: 'Size a pump', to: '/sizing' },
        { label: 'Find a replacement', to: '/products/replacement/existing-pump' },
      ],
    },
    academy: {
      title: 'Partner Academy & sales material',
      subtitle: 'Training, certificates and sales tools',
      icon: GraduationCap,
      links: [
        {
          label: 'Partner Academy courses',
          to: '/learn/in-progress',
          badge: { label: '2 in progress', tone: 'info' },
        },
        { label: 'My certificates', to: '/learn/certificates', badge: { label: '4' } },
        { label: 'Sales presentations & brochures', to: '/partner/sales-material' },
        { label: 'Logos & partner branding', to: '/partner/brand' },
      ],
    },
  } satisfies Record<string, DashboardCard>,
  activity: [
    {
      subject: 'Quotation AQ-26-0418',
      text: 'sent to Emma Lindqvist, Nordvatten Utilities',
      time: 'Today, 08:50',
      to: quotationPath('AQ-26-0418'),
      icon: FileText,
    },
    {
      subject: 'Nordvatten Utilities – RW-02',
      text: 'vibration above warning limit',
      time: 'Today, 03:12',
      to: '/assets/rw-02',
      icon: TriangleAlert,
      tone: 'warning',
    },
    {
      subject: 'Order SO-104387',
      text: 'arrived at Västerås terminal – for Mälarbruk Paper',
      time: 'Today, 06:10',
      to: orderPath('SO-104387'),
      icon: Truck,
    },
    {
      subject: 'Project ‘Riverside intake upgrade’',
      text: 'sizing checked by Mikael Ahonen, Sulzer',
      time: 'Yesterday, 15:40',
      to: '/my-projects/riverside-intake-upgrade',
      icon: FolderKanban,
    },
    {
      subject: 'Course “AHLSTAR sizing for partners”',
      text: '60% complete',
      time: '24 Oct',
      to: '/learn/in-progress',
      icon: GraduationCap,
    },
  ] satisfies ActivityItem[],
}

/* ── My customers ("/partner/customers") ───────────────────────────────────── */

export const customersPage = {
  title: 'My customers',
  breadcrumb: parents,
  description:
    'The customers you serve as an authorised Sulzer distributor: their sites, installed base, alerts and open requests.',
  summary: {
    label: 'Customer summary',
    customers: {
      label: 'customers',
      detail: (sites: number, assets: number) => `${sites} sites · ${assets} assets`,
      icon: Building2,
    },
    connected: { label: `on ${products.connect}`, detail: 'Live condition data', icon: Plug },
    attention: {
      label: (n: number) => (n === 1 ? 'needs attention' : 'need attention'),
      detail: 'Customers with alerts',
      icon: CircleAlert,
    },
    requests: {
      label: (n: number) => (n === 1 ? 'open request' : 'open requests'),
      detail: 'Service in progress',
      icon: Wrench,
    },
  },
  /** URL `status` values: what each summary tile filters on. */
  filters: ['connected', 'attention', 'requests'] as const,
  search: 'Search customers',
  count: (shown: number, total: number) =>
    shown === total ? `${total} customers` : `${shown} of ${total} customers`,
  columns: {
    customer: 'Customer',
    sites: 'Sites',
    assets: 'Assets',
    alerts: 'Open alerts',
    requests: 'Open requests',
    manager: 'Account manager',
  },
  connected: (n: number) => `${n} connected`,
  notConnected: `Not on ${products.connect}`,
  noAlerts: 'None',
  alerts: (alarms: number, warnings: number) =>
    [
      alarms && `${alarms} alarm${alarms === 1 ? '' : 's'}`,
      warnings && `${warnings} warning${warnings === 1 ? '' : 's'}`,
    ]
      .filter(Boolean)
      .join(' · '),
  you: 'You',
  open: (name: string) => `Open ${name}`,
  noResults: {
    title: 'No customers match your search',
    action: 'Show all customers',
  },
}

/* ── One customer ("/partner/customers/:id") ───────────────────────────────── */

export const customerPage = {
  eyebrow: (number: string, industry: string) => `Customer no. ${number} · ${industry}`,
  facts: {
    city: 'Location',
    since: 'Customer since',
    manager: 'Account manager',
    discount: 'Quotation discount',
    connectUsers: `${products.connect} users`,
    none: 'Not invited yet',
  },
  actions: {
    connect: `Open in ${products.connect}`,
    connectTo: '/connect/assets',
    parts: 'Order spare parts',
    partsTo: '/spare-parts',
    email: (name: string) => `Email ${name.split(' ')[0]}`,
  },
  attention: {
    title: (n: number) => `${n} asset${n === 1 ? '' : 's'} need${n === 1 ? 's' : ''} attention`,
    view: 'View',
  },
  sites: {
    title: 'Sites',
    assets: (n: number) => `${n} asset${n === 1 ? '' : 's'}`,
    filter: (name: string) => `Show the assets at ${name}`,
    allNormal: 'All normal',
    attention: (n: number) => `${n} need${n === 1 ? 's' : ''} attention`,
  },
  installedBase: {
    title: 'Installed base',
    showAll: 'Show all',
    filteredBy: (site: string) => `At ${site}`,
  },
  requests: {
    title: 'Open service requests',
    all: 'All requests',
    empty: 'No open requests. Everything this customer asked for is done.',
  },
  contacts: {
    title: 'Contacts',
    main: 'Main contact',
  },
  projects: {
    title: 'Projects',
    shared: 'Shared with customer',
    notShared: 'Not shared yet',
    products: (n: number) => `${n} product${n === 1 ? '' : 's'}`,
    empty: 'No projects for this customer yet.',
    size: 'Size a pump',
  },
  quotations: {
    title: 'Quotations',
    empty: 'No quotations for this customer yet.',
    all: 'All quotations',
  },
}

/** Asset page breadcrumb for the partner: through the customer, not "My assets". */
export const partnerAssetBreadcrumb = (customerId: string): NavItem[] => [
  ...parents,
  { label: customersPage.title, to: partnerCustomersPath },
  { label: shortName(customer(customerId).name), to: partnerCustomerPath(customerId) },
]

/* ── Quotations from a project ─────────────────────────────────────────────── */

/** A partner quotation made from a project ("Create quotation"). Fixed times, so every take is the same. */
export const projectQuotation = {
  createdAt: '10:24',
  sentAt: '10:31',
  validDays: 30,
  created: (project: string) => `created from project ‘${project}’`,
  sent: (name: string) => `sent to ${name}`,
  notes: (discount: number) => [
    `Prices include your agreed discount of ${discount}%.`,
    'Genuine Sulzer pumps, tested to ISO 9906 grade 2B before dispatch.',
    'Delivery times are confirmed by Sulzer when you order.',
  ],
}

/** eShop checkout for partners: ordering on behalf of a customer. */
export const partnerCheckout = {
  title: 'Order on behalf of customer',
  hint: 'The order shows up under this customer, at your partner prices.',
  number: (customerNumber: string, city: string) => `Customer no. ${customerNumber} · ${city}`,
  orderedFor: 'Ordered for',
  warehouse: (company: string) => `${company} warehouse`,
}
