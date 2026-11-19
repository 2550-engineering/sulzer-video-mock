import heroImage from '../assets/images/sulzer-dynamical-still.jpg'
import type { GuideExistingPump, GuideFit, GuideReplacement, ImageSource, NavItem } from '../types'

/*
 * Copy for the pump replacement guide. Wording from the standalone guide
 * (_reference/sulzer-guide/index.html).
 */

/** Spec rows of the existing pump card, in order. "Manufacturer" is the brand. */
const existingSpecs = [
  ['brand', 'Manufacturer'],
  ['model', 'Model'],
  ['discharge', 'Discharge connection'],
  ['power', 'Motor power'],
  ['voltage', 'Supply'],
  ['maxHead', 'Max head'],
  ['maxFlow', 'Max flow'],
] as const satisfies readonly (readonly [keyof GuideExistingPump, string])[]

/** Spec rows of the Sulzer replacement card, after "Manufacturer: Sulzer". */
const replacementSpecs = [
  ['range', 'Range'],
  ['model', 'Model'],
  ['article', 'Article number'],
  ['material', 'Material number'],
  ['discharge', 'Discharge connection'],
  ['power', 'Motor power'],
  ['voltage', 'Supply'],
  ['impeller', 'Impeller'],
  ['maxHead', 'Max head'],
  ['maxFlow', 'Max flow'],
  ['solids', 'Solids passage'],
  ['efficiency', 'Efficiency'],
  ['protection', 'Protection'],
  ['temp', 'Fluid temperature'],
  ['weight', 'Weight'],
] as const satisfies readonly (readonly [keyof GuideReplacement, string])[]

export const replacementGuidePage = {
  title: 'Pump Replacement Guide',
  /** Breadcrumb label and browser tab title of /products/replacement. */
  crumb: 'Replacement Guide',
  breadcrumb: [{ label: 'Products & services', to: '/products' }] satisfies NavItem[],
  hero: {
    title: 'Find your Sulzer replacement',
    text: 'Match any installed pump to a Premium-Efficiency Sulzer replacement',
    image: {
      src: heroImage,
      alt: 'Sulzer pump impeller in motion, a still from the Sulzer homepage video',
    } satisfies ImageSource,
  },
  search: {
    label: 'Search by part number or RSK number',
    placeholder: 'e.g. 581 30 22 or 98044186',
    button: 'Find replacement',
    examplesLabel: 'Try a sample:',
    /** `query` is what the chip searches for. */
    examples: [
      { label: 'RSK 581 30 22', query: '581 30 22' },
      { label: 'Part 98044186', query: '98044186' },
      { label: 'RSK 581 41 25', query: '581 41 25' },
      { label: 'KTZ 411', query: 'KTZ411' },
      { label: 'Sulzer 24130931', query: '24130931' },
    ],
    found: (existing: string, replacement: string) => `Matched ${existing}  →  ${replacement}`,
    notFound: (query: string) =>
      `No catalog match for “${query}”. Try the brand / model lists below.`,
    /** Sub-line of a suggestion for an installed competitor pump. */
    competitorLine: (partNo: string, rsk: string) => `Part ${partNo} · RSK ${rsk}`,
    /** Sub-line of a suggestion for a discontinued Sulzer product. */
    sulzerLine: (productNumber: string, year: number) =>
      `Product no. ${productNumber} · Discontinued ${year}`,
    browseDivider: 'or browse by brand',
    brand: 'Installed pump — brand',
    model: 'Installed pump — model',
    recommended: 'Recommended replacement',
    /** Accessible name of the suggestion list. */
    suggestions: 'Matching pumps',
    /** Right-hand side of a suggestion row. */
    replacedBy: (name: string) => `→ ${name}`,
    noMatches: (query: string) => `No pumps match “${query}”. Press Enter to search anyway.`,
  },
  /** The brand under which discontinued Sulzer products are listed and suggested. */
  discontinuedBrand: 'Sulzer (discontinued)',
  fit: {
    'drop-in': {
      label: 'Drop-in fit',
      text: 'Mounts directly on the existing guide-rail base.',
    },
    adapter: {
      label: 'Fits with adapter kit',
      text: 'Requires a Sulzer guide-rail adapter claw.',
    },
  } satisfies Record<GuideFit, { label: string; text: string }>,
  existing: {
    label: 'Your existing pump',
    mobileLabel: 'Existing',
    photo: (brand: string) => `${brand} photo`,
  },
  replacement: {
    label: (tier: string) => `Sulzer replacement · ${tier}`,
    mobileLabel: (tier: string) => `Sulzer · ${tier}`,
    photo: (range: string) => `${range} photo`,
    manufacturer: 'Sulzer',
    comments: 'Comments',
    productSheet: 'Product sheet',
    /** Shown after the Sulzer logo. */
    webstore: 'webstore',
    webstoreLabel: 'Sulzer webstore',
    partner: 'GC Gruppe',
    /** Same links as the standalone guide; they open in a new tab. */
    links: {
      productSheet:
        'https://www.sulzer.com/-/media/files/products/pumps/submersible-pumps/brochures/xfp_submersiblepumps_e10238.pdf',
      webstore: 'https://sense.sulzer.com/sulzer/en/USD/login',
      partner: 'https://www.gc-gruppe.de/',
    },
  },
  specs: {
    manufacturer: 'Manufacturer',
    photo: 'Photo',
    existing: existingSpecs,
    replacement: replacementSpecs,
  },
  calculator: {
    title: 'Energy savings calculator',
    text: 'Premium-Efficiency IE3 motors cut running cost against your installed pump.',
    hours: 'Operating hours / year',
    /** `symbol` is the market currency's, e.g. "€". */
    rate: (symbol: string) => `Electricity rate (${symbol} / kWh)`,
    energy: { label: 'Energy saved / yr', unit: 'kWh' },
    cost: { label: 'Cost saved / yr' },
    tenYears: { label: 'Saved over 10 yr' },
    co2: { label: 'CO₂ avoided / yr', unit: 'kg' },
  },
  report: {
    title: 'Pump Replacement Report — Wastewater & Sewage',
    footer: 'Generated by Sulzer Pump Replacement Guide',
  },
  disclaimer:
    'Indicative data for selection guidance. Confirm duty point with Sulzer ABSEL before ordering.',
}

/**
 * Copy for the result of a discontinued Sulzer product (?from=<product number or id>):
 * the old product, its successor, whether it fits and how the key specs compare.
 */
export const sulzerReplacementCopy = {
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
