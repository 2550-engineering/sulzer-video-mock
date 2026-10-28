import {
  Activity,
  CircleUserRound,
  Factory,
  FolderKanban,
  Gauge,
  GraduationCap,
  Headset,
  LayoutDashboard,
  Ruler,
  Search,
  Settings,
  ShoppingCart,
  Wrench,
} from 'lucide-react'
import { applicationPath, childApplications, rootApplication } from '../lib/catalog'
import type { FooterColumn, IconLink, MegaMenuItem, NavItem } from '../types'

/** Main nav items after the "Products & services" mega menu trigger. */
export const mainNav: NavItem[] = [
  { label: 'Applications', to: '/applications' },
  { label: 'Support', to: '/support' },
  { label: 'Learn', to: '/learn' },
  { label: 'About us', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const categories = [
  'Submersible pumps',
  'End suction pumps',
  'Axial and mixed flow pumps',
  'Multistage pumps',
  'Dewatering pumps',
  'Mixers and agitators',
  'Aeration systems',
  'Turbocompressors',
]

export const megaMenu: MegaMenuItem[] = [
  {
    label: 'Categories',
    to: '/products/categories',
    // Each category opens the Product Center search for it.
    children: categories.map((label) => ({
      label,
      to: `/products?q=${encodeURIComponent(label)}`,
    })),
  },
  {
    label: 'Applications',
    to: applicationPath(rootApplication),
    children: childApplications(rootApplication).map((app) => ({
      label: app.name,
      to: applicationPath(app),
    })),
  },
  { label: 'Products A–Z', to: '/products/a-z' },
  { label: 'Product replacement', to: '/products/replacement' },
  { label: 'Spare parts', to: '/spare-parts' },
  { label: 'Sizing', to: '/sizing' },
  {
    label: 'Digital solutions',
    to: '/digital-solutions',
    children: [
      { label: 'Sulzer Connect', to: '/connect' },
      { label: 'Condition monitoring', to: '/assets' },
      { label: 'Sizing and selection', to: '/sizing' },
      { label: 'CAD and BIM downloads', to: '/digital-solutions' },
    ],
  },
]

export const quickLinks: IconLink[] = [
  { label: 'Product Center', to: '/products', icon: Search },
  { label: 'Applications', to: '/applications', icon: Factory },
  { label: 'Sizing', to: '/sizing', icon: Ruler },
  { label: 'eShop', to: '/eshop', icon: ShoppingCart },
  { label: 'Sulzer Academy', to: '/learn', icon: GraduationCap },
  { label: 'mySulzer', to: '/my-sulzer', icon: CircleUserRound },
]

export const digitalOfferings: IconLink[] = [
  { label: 'Sulzer Connect', to: '/connect', icon: Activity },
  { label: 'My assets', to: '/assets', icon: Gauge },
]

export const popularSearches = [
  'Submersible pumps',
  'Spare parts',
  'Mixers',
  'Condition monitoring',
  'Pump sizing',
]

/** Links in the signed-in account menu, above "Sign out". */
export const accountMenuLinks: IconLink[] = [
  { label: 'My Pages', to: '/my-pages', icon: LayoutDashboard },
  { label: 'My projects', to: '/my-projects', icon: FolderKanban },
  { label: 'Settings', to: '/settings', icon: Settings },
]

/** Canned options in the floating chat card. */
export const chatOptions: IconLink[] = [
  { label: 'Find spare parts', to: '/spare-parts', icon: Wrench },
  { label: 'Size a pump', to: '/sizing', icon: Ruler },
  { label: 'Talk to a service expert', to: '/contact', icon: Headset },
]

export const footerColumns: FooterColumn[] = [
  {
    title: 'Products & services',
    links: [
      { label: 'Product Center', to: '/products' },
      { label: 'Applications', to: '/applications' },
      { label: 'Spare parts', to: '/spare-parts' },
      { label: 'Sizing', to: '/sizing' },
      { label: 'Digital solutions', to: '/digital-solutions' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Customer support', to: '/support' },
      { label: 'Service centers', to: '/support/service-centers' },
      { label: 'Documentation', to: '/support/documentation' },
      { label: 'Sulzer Academy', to: '/learn' },
      { label: 'mySulzer', to: '/my-sulzer' },
    ],
  },
  {
    title: 'About Sulzer',
    links: [
      { label: 'About us', to: '/about' },
      { label: 'Sustainability', to: '/about/sustainability' },
      { label: 'News', to: '/about/news' },
      { label: 'Careers', to: '/about/careers' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'Contact us', to: '/contact' },
      { label: 'Find a local office', to: '/contact/locations' },
      { label: 'Request a quote', to: '/contact/quote' },
    ],
  },
]

export const legalLinks: NavItem[] = [
  { label: 'Legal notice', to: '/legal-notice' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Cookies', to: '/cookies' },
  { label: 'Terms of sale', to: '/terms-of-sale' },
]
