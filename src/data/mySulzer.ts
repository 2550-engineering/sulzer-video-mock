import {
  Bookmark,
  ClipboardCheck,
  FileDown,
  FileText,
  FolderKanban,
  GraduationCap,
  History,
  Package,
  Replace,
  Tag,
  Truck,
  Users,
  Wrench,
} from 'lucide-react'
import { demoUser, products } from '../config/demo'
import type { IconItem, ImageRef, LinkCard, NavItem } from '../types'
import { supportSection } from './home'

/* Copy and demo data for the public mySulzer landing page ("/my-sulzer"). */

export const intro = {
  // Non-breaking hyphen (U+2011) so the heading never wraps as "self- / service".
  title: 'mySulzer – your 24/7 self‑service',
  text: 'One login for everything you do with Sulzer. Check prices, find spare parts and replacement pumps, and follow your orders and requests – whenever it suits you.',
  benefits: [
    'Prices & availability',
    'Replacement pumps',
    'Spare parts',
    'Order track & trace',
    'Quotations',
    'Request status',
  ],
  signInLabel: 'Sign in to mySulzer',
  signedInLabel: 'Go to My Pages',
  signedInNote: `Signed in as ${demoUser.name} · ${demoUser.company}`,
  createAccountLabel: 'Create an account',
  /** Where "Sign in" and "Go to My Pages" lead. */
  myPagesPath: '/my-pages',
  image: { file: 'mysulzer-intro.jpg', alt: '', tone: 'ocean' } satisfies ImageRef,
}

/** Mock portal snippets floating over the intro image. Deterministic demo values. */
export const portalPreview = {
  price: {
    label: 'List price & availability',
    product: products.xfp,
    value: 'SEK 48 900',
    stock: 'In stock · ships in 2 days',
  },
  order: {
    label: 'Order SO-104382',
    status: 'Shipped',
    eta: 'Expected 30 Oct',
    steps: ['Confirmed', 'Shipped', 'Delivered'],
    /** Index of the last completed step. */
    current: 1,
  },
  request: { label: 'Service request #4471', status: 'In progress' },
}

export const tailoredSection = {
  title: 'mySulzer is tailored to you',
  subtitle:
    'Everything is shown with your company’s prices, your installed base and your own history – so you get straight to the answer.',
  personal: {
    title: 'Your personal pages',
    items: [
      {
        label: 'Saved products',
        text: 'Keep the products you use most close at hand.',
        icon: Bookmark,
      },
      {
        label: 'My projects',
        text: 'Collect products and documents per project.',
        icon: FolderKanban,
      },
      { label: 'Quotations', text: 'See and download every quotation.', icon: FileText },
      { label: 'Orders', text: 'Your full order history in one list.', icon: Package },
      {
        label: 'Training & certificates',
        text: 'Courses completed and in progress.',
        icon: GraduationCap,
      },
      { label: 'Recently viewed', text: 'Pick up where you left off.', icon: History },
    ] satisfies IconItem[],
  },
  tools: {
    title: 'Self-service tools',
    items: [
      {
        label: 'List price & availability',
        text: 'Your prices and stock levels, in real time.',
        icon: Tag,
        to: '/self-service/list-price',
      },
      {
        label: 'Spare part finder',
        text: 'Find the right part from a drawing or part list.',
        icon: Wrench,
        to: '/spare-parts',
      },
      {
        label: 'Replacement pump finder',
        text: 'Get a Sulzer match for your existing pump.',
        icon: Replace,
        to: '/products/replacement',
      },
      {
        label: 'Export information',
        text: 'Download product and order data for your systems.',
        icon: FileDown,
        to: '/self-service/export',
      },
      {
        label: 'Order status with track & trace',
        text: 'Follow every delivery from order to site.',
        icon: Truck,
        to: '/self-service/orders',
      },
    ] satisfies IconItem[],
  },
}

export const exploreSection = {
  title: 'Explore more self-service options',
  subtitle: 'Try some of the most used mySulzer tools.',
  cards: [
    {
      title: 'List price & availability',
      text: 'Look up your price, stock and delivery time for any product in seconds.',
      linkLabel: 'Try it',
      to: '/self-service/list-price',
      icon: Tag,
    },
    {
      title: 'Replacement pump finder',
      text: 'Enter the brand and model you have today and get the right Sulzer replacement.',
      linkLabel: 'Try it',
      to: '/products/replacement',
      icon: Replace,
    },
    {
      title: 'Track & trace',
      text: 'See where your order is and when it will arrive – without picking up the phone.',
      linkLabel: 'Try it',
      to: '/self-service/orders',
      icon: Truck,
    },
  ] satisfies LinkCard[],
}

export const accountSection = {
  eyebrow: 'New to mySulzer?',
  title: 'Create a Sulzer account',
  text: 'Register once and get a workspace that remembers your products, your projects and your team.',
  benefits: [
    { label: 'Save products', text: 'Bookmark products and compare them later.', icon: Bookmark },
    {
      label: 'Share projects',
      text: 'Work on projects together with your colleagues.',
      icon: Users,
    },
    { label: 'Quotations', text: 'Request, track and download quotations.', icon: ClipboardCheck },
    {
      label: 'Training records',
      text: 'Keep your Sulzer Academy courses and certificates.',
      icon: GraduationCap,
    },
  ] satisfies IconItem[],
  cta: { label: 'Create an account', to: '/register' } satisfies NavItem,
}

export const questionsSection = {
  title: 'Have a question?',
  subtitle: 'Our specialists are ready to help with anything about mySulzer or your equipment.',
  cards: supportSection.cards,
}
