import {
  Activity,
  CircleUserRound,
  GraduationCap,
  Headset,
  Ruler,
  Search,
  ShoppingCart,
  Wrench,
} from 'lucide-react'
import type { FooterColumn, IconLink, MegaMenuItem, NavItem } from '../types'

/** Main nav items after the "Products & services" mega menu trigger. */
export const mainNav: NavItem[] = [
  { label: 'Applications', to: '/applications' },
  { label: 'Support', to: '/support' },
  { label: 'Learn', to: '/learn' },
  { label: 'About us', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export const megaMenu: MegaMenuItem[] = [
  {
    label: 'Categories',
    to: '/products/categories',
    children: [
      { label: 'Submersible pumps', to: '/products/categories' },
      { label: 'End suction pumps', to: '/products/categories' },
      { label: 'Axial and mixed flow pumps', to: '/products/categories' },
      { label: 'Multistage pumps', to: '/products/categories' },
      { label: 'Dewatering pumps', to: '/products/categories' },
      { label: 'Mixers and agitators', to: '/products/categories' },
      { label: 'Aeration systems', to: '/products/categories' },
      { label: 'Turbocompressors', to: '/products/categories' },
    ],
  },
  {
    label: 'Applications',
    to: '/applications',
    children: [
      { label: 'Wastewater collection', to: '/applications' },
      { label: 'Wastewater treatment', to: '/applications' },
      { label: 'Clean water supply', to: '/applications' },
      { label: 'Industrial process water', to: '/applications' },
      { label: 'Pulp, paper and board', to: '/applications' },
      { label: 'Mining and minerals', to: '/applications' },
      { label: 'Food and beverage', to: '/applications' },
      { label: 'Power generation', to: '/applications' },
    ],
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
      { label: 'Condition monitoring', to: '/connect' },
      { label: 'Sizing and selection', to: '/sizing' },
      { label: 'CAD and BIM downloads', to: '/digital-solutions' },
    ],
  },
]

export const quickLinks: IconLink[] = [
  { label: 'Product Center', to: '/products', icon: Search },
  { label: 'eShop', to: '/eshop', icon: ShoppingCart },
  { label: 'Sulzer Academy', to: '/learn', icon: GraduationCap },
  { label: 'mySulzer', to: '/my-sulzer', icon: CircleUserRound },
]

export const digitalOfferings: IconLink[] = [
  { label: 'Sulzer Connect', to: '/connect', icon: Activity },
]

export const popularSearches = [
  'Submersible pumps',
  'Spare parts',
  'Mixers',
  'Condition monitoring',
  'Pump sizing',
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
