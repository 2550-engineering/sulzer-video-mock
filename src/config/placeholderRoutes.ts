import type { NavItem, PlaceholderRoute } from '../types'

/*
 * Every route that nav, footer, quick links or chat can reach but that has no
 * real page yet. Each renders the "Coming soon" page inside the site layout.
 * Remove an entry once its real page exists.
 */
export const placeholderRoutes: PlaceholderRoute[] = [
  {
    path: '/products/replacement',
    title: 'Product replacement',
    description: 'Find the right Sulzer replacement for your existing pump in a few steps.',
    parent: '/products',
  },
  {
    path: '/spare-parts',
    title: 'Spare parts',
    description: 'Identify, price and order genuine Sulzer spare parts.',
  },
  {
    path: '/digital-solutions',
    title: 'Digital solutions',
    description: 'Connected services that keep your equipment running at its best.',
  },
  {
    path: '/eshop',
    title: 'eShop',
    description: 'Order products and spare parts online with your account pricing.',
  },
  {
    path: '/my-pages/saved',
    title: 'My saved items',
    description: 'Products, documents and drawings you have bookmarked.',
    parent: '/my-pages',
  },
  {
    path: '/my-pages/recently-viewed',
    title: 'Recently viewed products',
    description: 'Pick up where you left off.',
    parent: '/my-pages',
  },
  {
    path: '/settings',
    title: 'Account settings',
    description: 'Your profile, company details, notifications and team members.',
    parent: '/my-pages',
  },
  {
    path: '/self-service/list-price',
    title: 'List price & availability',
    description: 'Check your prices, stock levels and delivery times for any Sulzer product.',
    parent: '/my-sulzer',
  },
  {
    path: '/self-service/export',
    title: 'Export information',
    description: 'Download product, price and order data for your own systems.',
    parent: '/my-sulzer',
  },
  {
    path: '/self-service/quotations',
    title: 'Quotations',
    description: 'Request, follow and download your Sulzer quotations.',
    parent: '/my-sulzer',
  },
  {
    path: '/self-service/requests',
    title: 'Requests',
    description: 'Follow your service, support and return requests.',
    parent: '/my-sulzer',
  },
  {
    path: '/self-service/orders',
    title: 'Order status',
    description: 'Follow every order from confirmation to delivery with track & trace.',
    parent: '/my-sulzer',
  },
  {
    path: '/register',
    title: 'Create a Sulzer account',
    description: 'Get personal prices, saved products, shared projects and more.',
    parent: '/my-sulzer',
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
    path: '/support/service-portal',
    title: 'Service portal',
    description: 'Book service visits and follow repairs on your equipment.',
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
    path: '/learn/completed',
    title: 'My completed courses',
    description: 'Every Sulzer Academy course you have finished.',
    parent: '/learn',
  },
  {
    path: '/learn/in-progress',
    title: 'My courses in progress',
    description: 'Continue the courses you have started.',
    parent: '/learn',
  },
  {
    path: '/learn/certificates',
    title: 'My certificates',
    description: 'Download and share your Sulzer Academy certificates.',
    parent: '/learn',
  },
  {
    path: '/learn/bookmarks',
    title: 'My bookmarks',
    description: 'Courses, webinars and articles you have saved for later.',
    parent: '/learn',
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

/** Real (built) pages that placeholder routes can name as their parent. */
const builtPages: Pick<PlaceholderRoute, 'path' | 'title' | 'parent'>[] = [
  { path: '/products', title: 'Products & services' },
  { path: '/applications', title: 'Applications' },
  { path: '/my-sulzer', title: 'mySulzer' },
  { path: '/my-pages', title: 'My Pages', parent: '/my-sulzer' },
]

/** Ancestor pages of a placeholder route, outermost first (Home is added by the Breadcrumb). */
export function getParentTrail(route: PlaceholderRoute): NavItem[] {
  const pages = [...placeholderRoutes, ...builtPages]
  const trail: NavItem[] = []
  let parent = pages.find((r) => r.path === route.parent)
  while (parent) {
    trail.unshift({ label: parent.title, to: parent.path })
    const next = parent.parent
    parent = pages.find((r) => r.path === next)
  }
  return trail
}
