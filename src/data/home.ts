import {
  ChartSpline,
  CircleUserRound,
  Factory,
  LifeBuoy,
  MessageSquareText,
  Search,
} from 'lucide-react'
import { market, products } from '../config/demo'
import { applicationTeaser, childApplications, rootApplication } from '../lib/catalog'
import type { AssetReadout, ImageSource, LinkCard, NavItem } from '../types'

/*
 * Copy and image references for the home page ("/").
 * Images are in public/images/home (application tiles take theirs from data/applications.ts).
 */

export const hero = {
  image: {
    src: '/images/home/home-hero.jpg',
    alt: 'Sulzer engineers beside high-pressure pumps in a desalination plant',
  } satisfies ImageSource,
  eyebrow: 'Sulzer self-service',
  title: 'Everything you need, whenever you need it',
  subtitle:
    'Find products, size solutions, order spare parts and follow your installed base – all in one place, around the clock.',
  searchLabel: 'Find a Sulzer product',
  searchButtonLabel: 'Search',
  /**
   * Scope options for the hero search. With `resultsTab`, a term opens that tab
   * of the search results; without one it goes to `to?q=<term>`. An empty
   * search goes to `to`.
   */
  searchScopes: [
    { label: 'Products', to: '/products', resultsTab: 'products' },
    { label: 'Applications', to: '/applications', resultsTab: 'applications' },
    { label: 'Spare parts', to: '/spare-parts' },
    { label: 'Documentation', to: '/support/documentation', resultsTab: 'documents' },
  ] satisfies (NavItem & { resultsTab?: 'products' | 'applications' | 'documents' })[],
  popularLabel: 'Popular',
  // Each one finds something; check before changing (a chip that ends on "No results" looks broken).
  popularSearches: [products.ahlstar, 'Submersible pumps', 'Raw water', 'Wastewater'],
}

export const finderSection = {
  title: 'Find what you need',
  subtitle: 'Start where it suits you – by application, by product or by your own requirements.',
  cards: [
    {
      title: 'Application finder',
      text: 'Explore proven Sulzer solutions for your industry and process.',
      linkLabel: 'Find your application',
      to: '/applications',
      icon: Factory,
    },
    {
      title: 'Product finder',
      text: 'Search the full range by product name, model or article number.',
      linkLabel: 'Find a product',
      to: '/products',
      icon: Search,
    },
    {
      title: 'Sizing',
      text: 'Enter your duty point and get the right pump in minutes.',
      linkLabel: 'Start sizing',
      to: '/sizing',
      icon: ChartSpline,
    },
    {
      title: 'mySulzer',
      text: 'Your products, projects, orders and documents in one place.',
      linkLabel: 'Go to mySulzer',
      to: '/my-sulzer',
      icon: CircleUserRound,
    },
  ] satisfies LinkCard[],
}

export const applicationsSection = {
  title: 'Applications',
  subtitle: "Solutions engineered for the world's most demanding fluid processes.",
  linkLabel: 'Explore all applications',
  to: '/applications',
  // Two rows of three on the home page; the Applications page lists them all.
  items: childApplications(rootApplication).slice(0, 6).map(applicationTeaser),
}

export const connectPromo = {
  eyebrow: 'Sulzer Connect',
  title: 'Predict issues & protect assets with remote monitoring',
  text: 'Sensors on your pumps and mixers stream condition data to the cloud, so you see problems coming and plan service before anything stops.',
  features: [
    'Round-the-clock monitoring of vibration, temperature and power',
    'Early warnings before small issues become downtime',
    'Service planned on real data from your assets',
  ],
  cta: { label: 'Discover Sulzer Connect', to: '/connect' } satisfies NavItem,
  image: {
    src: '/images/home/connect-promo.jpg',
    alt: 'Pumps in a plant linked by a wireless monitoring network',
  } satisfies ImageSource,
  readouts: [
    { label: 'Lift station P-104', value: 'Running normally', status: 'ok' },
    {
      label: 'Bearing vibration',
      value: '2.1 mm/s',
      status: 'ok',
      trend: [42, 46, 40, 44, 38, 41, 36, 39, 35, 37, 33, 34],
    },
  ] satisfies AssetReadout[],
}

export const supportSection = {
  title: 'Support',
  subtitle: "Expert help through every stage of your equipment's life.",
  cards: [
    {
      title: 'Go to support',
      text: 'Service requests, repairs, documentation and technical help from Sulzer specialists.',
      linkLabel: 'Go to support',
      to: '/support',
      icon: LifeBuoy,
    },
    {
      title: 'Contact us',
      text: `Talk to your local Sulzer sales and service team in ${market.country}.`,
      linkLabel: 'Contact us',
      to: '/contact',
      icon: MessageSquareText,
    },
  ] satisfies LinkCard[],
}
