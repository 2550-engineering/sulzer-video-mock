import type { NavItem, PlaceholderRoute } from '../types'

/*
 * Every route that nav, footer, quick links or chat can reach but that has no
 * real page yet. Each renders the "Coming soon" page inside the site layout.
 * Remove an entry once its real page exists.
 */
export const placeholderRoutes: PlaceholderRoute[] = [
  {
    path: '/products',
    title: 'Product Center',
    description: 'Search the full Sulzer range by product name, application or part number.',
  },
  {
    path: '/products/categories',
    title: 'Product categories',
    description: 'Browse pumps, mixers, aerators and compressors by product family.',
    parent: '/products',
  },
  {
    path: '/products/a-z',
    title: 'Products A–Z',
    description: 'Every Sulzer product in one alphabetical list.',
    parent: '/products',
  },
  {
    path: '/products/replacement',
    title: 'Product replacement',
    description: 'Find the right Sulzer replacement for your existing pump in a few steps.',
    parent: '/products',
  },
  {
    path: '/applications',
    title: 'Applications',
    description: 'Solutions for water, wastewater and industrial processes.',
  },
  {
    path: '/spare-parts',
    title: 'Spare parts',
    description: 'Identify, price and order genuine Sulzer spare parts.',
  },
  {
    path: '/sizing',
    title: 'Sizing & configuration',
    description: 'Enter your duty point and get matching Sulzer pumps, curves and energy data.',
  },
  {
    path: '/digital-solutions',
    title: 'Digital solutions',
    description: 'Connected services that keep your equipment running at its best.',
  },
  {
    path: '/connect',
    title: 'Sulzer Connect',
    description: 'Monitor the condition and performance of your assets in real time.',
    parent: '/digital-solutions',
  },
  {
    path: '/eshop',
    title: 'eShop',
    description: 'Order products and spare parts online with your account pricing.',
  },
  {
    path: '/my-sulzer',
    title: 'mySulzer',
    description: 'Your products, projects, orders and learning in one place.',
  },
  {
    path: '/support',
    title: 'Support',
    description: 'Service, repairs and technical support from Sulzer experts.',
  },
  {
    path: '/support/service-centers',
    title: 'Service centers',
    description: 'Find a Sulzer service center near you.',
    parent: '/support',
  },
  {
    path: '/support/documentation',
    title: 'Documentation',
    description: 'Manuals, datasheets, certificates and drawings.',
    parent: '/support',
  },
  {
    path: '/learn',
    title: 'Sulzer Academy',
    description: 'Courses, webinars and certifications for pump professionals.',
  },
  {
    path: '/about',
    title: 'About us',
    description: 'Sulzer is a global leader in fluid engineering.',
  },
  {
    path: '/about/sustainability',
    title: 'Sustainability',
    description: 'How we help customers use less energy and water.',
    parent: '/about',
  },
  {
    path: '/about/news',
    title: 'News',
    description: 'The latest news and stories from Sulzer.',
    parent: '/about',
  },
  {
    path: '/about/careers',
    title: 'Careers',
    description: 'Join the people who keep the world flowing.',
    parent: '/about',
  },
  {
    path: '/contact',
    title: 'Contact',
    description: 'Talk to Sulzer sales, service or support in your market.',
  },
  {
    path: '/contact/locations',
    title: 'Local offices',
    description: 'Sulzer sales and service locations in your country.',
    parent: '/contact',
  },
  {
    path: '/contact/quote',
    title: 'Request a quote',
    description: 'Tell us what you need and a Sulzer specialist will get back to you.',
    parent: '/contact',
  },
  {
    path: '/legal-notice',
    title: 'Legal notice',
    description: 'Company information and terms of use for this website.',
  },
  {
    path: '/privacy',
    title: 'Privacy',
    description: 'How Sulzer collects, uses and protects your personal data.',
  },
  {
    path: '/cookies',
    title: 'Cookies',
    description: 'How this website uses cookies.',
  },
  {
    path: '/terms-of-sale',
    title: 'Terms of sale',
    description: 'General terms and conditions for Sulzer products and services.',
  },
]

/** Ancestor pages of a placeholder route, outermost first (Home is added by the Breadcrumb). */
export function getParentTrail(route: PlaceholderRoute): NavItem[] {
  const trail: NavItem[] = []
  let parent = placeholderRoutes.find((r) => r.path === route.parent)
  while (parent) {
    trail.unshift({ label: parent.title, to: parent.path })
    const next = parent.parent
    parent = placeholderRoutes.find((r) => r.path === next)
  }
  return trail
}
