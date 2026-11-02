import { Boxes, ChartSpline, Gauge, Search } from 'lucide-react'
import { products } from '../config/demo'
import type { CtaBandContent, ImageSource, LinkCard, NavItem } from '../types'

/* /digital-solutions: landing page for Sulzer's digital products and tools. */

export const digitalSolutionsPage = {
  title: 'Digital solutions',
  text: 'Connected sensors, smart control and analytics that keep your pumps and plants running at their best, and show you where to save.',
  breadcrumb: [{ label: 'Products & services', to: '/products' }] satisfies NavItem[],
  hero: {
    src: '/images/digital-solutions/digital-solutions-hero.jpg',
    alt: 'Engineer with a tablet checking live data in front of a row of pumps in a modern pump hall',
  } satisfies ImageSource,
  portfolio: {
    title: 'Our digital portfolio',
    text: 'From one sensor on a critical pump to analytics for the whole plant. Start where it pays off most, and grow from there.',
    productIds: ['sulzer-connect', 'blue-box', 'pump-controller', 'motor-protection-relay'],
    explore: 'Explore',
  },
  tools: {
    title: 'Digital tools in mySulzer',
    text: 'Free with your mySulzer account: find, size and look after the right equipment.',
    cards: [
      {
        title: 'Product Finder',
        text: 'Search every Sulzer product, model and document.',
        linkLabel: 'Find products',
        to: '/products',
        icon: Search,
      },
      {
        title: 'Sizing',
        text: 'Size a pump on your duty point and compare life cycle costs.',
        linkLabel: 'Start sizing',
        to: '/sizing',
        icon: ChartSpline,
      },
      {
        title: 'CAD and BIM',
        text: 'Download BIM objects, 3D models and drawings for any model.',
        linkLabel: 'Download files',
        to: '/products/ahlstar#bim',
        icon: Boxes,
      },
      {
        title: 'My assets',
        text: 'Your installed base, its documents, service history and condition.',
        linkLabel: 'View my assets',
        to: '/assets',
        icon: Gauge,
      },
    ] satisfies LinkCard[],
  },
  cta: {
    title: 'Not sure where to start?',
    text: `A Sulzer digital specialist can look at your sites with you and recommend the right first step, from ${products.connect} on a few critical pumps to plant-wide analytics.`,
    actions: [
      { label: 'Talk to an expert', to: '/contact' },
      { label: 'Request a quote', to: '/contact/quote' },
    ],
  } satisfies CtaBandContent,
}
