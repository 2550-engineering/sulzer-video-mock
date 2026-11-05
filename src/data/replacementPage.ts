import type { NavItem } from '../types'

/* Copy for /products/replacement. */

export const replacementPage = {
  breadcrumb: [{ label: 'Products & services', to: '/products' }] satisfies NavItem[],
  crumb: 'Product replacement',
  title: 'Product replacement',
  description:
    'Enter the product number from the rating plate of your old pump to find the Sulzer product that replaces it, and what it takes to fit.',
  search: {
    label: 'Product number of your old pump',
    placeholder: 'e.g. 24130931',
    button: 'Find replacement',
  },
  pick: {
    title: 'Recently discontinued products',
    discontinued: (year: number) => `Discontinued ${year}`,
    replacedBy: (code: string) => `Replaced by ${code}`,
  },
  notFound: (query: string) =>
    `We could not find product number ‘${query}’. Check the number on the rating plate, or contact your Sulzer service centre.`,
  stillAvailable: {
    title: (code: string) => `${code} is still available`,
    text: 'There is no need to replace it with another product. You can order it, or spare parts for it, as usual.',
    action: 'View product',
  },
  old: {
    label: 'Your product',
    discontinued: (year: number) => `Discontinued ${year}`,
  },
  next: {
    label: 'Recommended replacement',
    view: 'View product',
    addToCart: 'Add to cart',
    addToProject: 'Add to project',
    adapter: (name: string) => `Include ${name}`,
  },
  productNumber: (number: string) => `No. ${number}`,
  fit: { title: 'Will it fit?' },
  notes: {
    sameOutlet: (dn: number) => `Same discharge connection (DN ${dn})`,
    otherOutlet: (from: number, to: number) =>
      `Different discharge connection: DN ${from} on the old pump, DN ${to} on the new one`,
    sameInlet: (dn: number) => `Same pump inlet (DN ${dn})`,
    sameSupply: (supply: string) => `Same supply: ${supply}`,
    otherSupply: (from: string, to: string) =>
      `Different supply: ${from} on the old pump, ${to} on the new one`,
    morePower: (from: string, to: string) =>
      `More motor power: ${to} instead of ${from}. Check the starter, cable and fuses.`,
    samePower: (kW: string) => `Same motor power (${kW})`,
    sameCable: (m: number) => `Same cable length (${m} m)`,
    heavier: (kg: number) => `${kg} kg heavier: check the lifting equipment`,
    exLost: 'The replacement is not explosion proof. Do not use it in an Ex zone.',
  },
  compare: {
    title: 'Compare key specifications',
    spec: 'Specification',
    old: 'Your product',
    next: 'Replacement',
    changed: 'Changed',
    legend: 'Rows marked in yellow differ.',
    ratedPoint: 'Rated point',
    ratedValue: (flow: string, head: string) => `${flow} m³/h at ${head} m`,
  },
}
