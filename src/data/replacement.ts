import { BadgeCheck, Gauge, Zap } from 'lucide-react'
import type { DutyPoint, ImageSource, NavItem } from '../types'

/*
 * Replacement of an installed pump (/products/replacement/existing-pump). Copy, and the duty points the
 * installed pumps really run at. Figures are invented: see docs/content-to-confirm.md.
 */

export const replacementPath = '/products/replacement/existing-pump'

/** How the finder starts: a serial number, a Sulzer type or another brand. Also the URL params. */
export type ReplacementMode = 'serial' | 'type' | 'other'

/**
 * Where installed pumps really run, measured by Sulzer Connect (12-month median). Units
 * without an entry are assumed to run at their model's rated point.
 * Riverside intake: demand has fallen since 2019, so the three pumps run far left of
 * their best-efficiency point, throttled to the 30 m the plant needs.
 */
export const measuredDuties: Record<string, DutyPoint> = {
  'rw-01': { flow: 150, head: 30, liquid: 'water', temperature: 8, frequency: 50 },
  'rw-02': { flow: 150, head: 30, liquid: 'water', temperature: 8, frequency: 50 },
  'rw-03': { flow: 150, head: 30, liquid: 'water', temperature: 8, frequency: 50 },
}

export const replacementPage = {
  title: 'Find a replacement for your pump',
  breadcrumbLabel: 'Product replacement',
  text: 'Tell us which pump you have today. We suggest the current Sulzer model for its duty point and show what you save on energy.',
  breadcrumb: [{ label: 'Products & services', to: '/products' }] satisfies NavItem[],
  hero: {
    src: '/images/replacement/replacement-hero.jpg',
    alt: 'Engineer next to a row of installed end-suction pumps in a bright pump station',
  } satisfies ImageSource,
  search: {
    title: 'Which pump do you want to replace?',
    modeLabel: 'Start with',
    modes: [
      { value: 'serial', label: 'Serial number' },
      { value: 'type', label: 'Sulzer type' },
      { value: 'other', label: 'Another brand' },
    ] satisfies { value: ReplacementMode; label: string }[],
    serial: {
      label: 'Serial number',
      placeholder: 'e.g. AH-1918-04512',
      hint: 'On the type plate of the pump, or under My assets.',
      notFound: (serial: string) =>
        `No installed pump with serial number ${serial}. Check the type plate, or start with the Sulzer type.`,
    },
    type: {
      label: 'Sulzer type designation',
      placeholder: 'Choose the type on the type plate',
    },
    other: {
      manufacturer: 'Manufacturer',
      manufacturerPlaceholder: 'e.g. the brand on the type plate',
      model: 'Type or model (optional)',
      modelPlaceholder: 'e.g. 150-315',
    },
    duty: 'Duty point',
    flow: 'Flow [m³/h]',
    head: 'Head [m]',
    submit: 'Find replacement',
  },
  benefits: [
    { icon: BadgeCheck, title: 'Current Sulzer models', text: 'Sized to your real duty point' },
    { icon: Zap, title: 'Energy saving', text: 'Per year, with the payback time' },
    { icon: Gauge, title: 'Ready to size', text: 'Continue in sizing or your project' },
  ],
  existing: {
    title: 'Your pump today',
    fromSerial: (serial: string) => `Serial no. ${serial}`,
    fromType: 'Sulzer type designation',
    otherBrand: 'Another brand',
    site: 'Site',
    installed: 'Installed',
    runHours: 'Run hours',
    dutyPoint: 'Duty point',
    dutyValue: (flow: string, head: string) => `${flow} m³/h at ${head} m`,
    dutySource: {
      measured: 'Measured by Sulzer Connect, 12-month median',
      rated: 'Rated point from the order data',
      entered: 'As entered',
    },
    pumpHead: 'Pump head at this flow',
    throttled: (lost: string) => `${lost} m lost across the throttle valve`,
    bep: 'Share of best-efficiency flow',
    efficiency: 'Pump efficiency (estimated)',
    power: 'Power input P1',
    energy: 'Energy per year',
    connections: 'Connections',
    connectionValue: (suction: number, discharge: number) => `DN ${suction} / DN ${discharge}`,
    motor: 'Motor',
    viewAsset: 'Open asset',
    change: 'Change pump',
  },
  options: {
    title: 'Suggested Sulzer replacement',
    titleMany: 'Suggested Sulzer replacements',
    fits: 'Fits the same foundation and pipework',
    lowestCost: 'Lowest life cycle cost',
    newPipework: (suction: number, discharge: number) =>
      `DN ${suction} / DN ${discharge}: needs new pipe connections`,
    productNumber: 'Product no.',
    onRequest: 'On request',
    efficiency: 'Efficiency',
    motor: 'Motor',
    power: 'Power input P1',
    listPrice: 'List price',
    netPrice: (discount: number) => `Your net price (−${discount}%)`,
    select: (name: string) => `Show ${name}`,
  },
  curve: {
    title: 'Curve comparison',
    today: 'Your pump today',
    duty: 'Duty point',
    note: 'Typical curves. Size the duty point for the exact curve of the suggested pump.',
  },
  savings: {
    title: 'What you save',
    perYear: 'Energy cost saved per year',
    less: 'less energy',
    payback: 'Payback time',
    years: (years: string) => `${years} years`,
    energySaved: (kwh: string) => `${kwh} kWh less per year`,
    noSaving: 'No energy saving at this duty point. A like-for-like replacement keeps it running.',
    assumptions: (hours: string, price: string) =>
      `Based on ${hours} running hours a year at ${price} per kWh, and the list price of the pump. Installation not included.`,
  },
  actions: {
    size: 'Size this pump',
    addToProject: 'Add to project',
    quote: 'Request quotation',
    tenderText: 'Tender text',
    quoteSent: 'Quotation requested',
    quoteDetail: (name: string) => `${name}. We send it within two working days.`,
    viewQuotations: 'View',
  },
  expert: {
    title: 'Our experts find your replacement',
    text: (name: string) =>
      `Online suggestions are available for end-suction pumps. For ${name}, a Sulzer application engineer suggests the right replacement and sends you a quotation.`,
  },
  quotationsPath: '/self-service/quotations',
}
