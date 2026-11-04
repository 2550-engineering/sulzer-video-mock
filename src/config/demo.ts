/*
 * Demo content used across the mock-up. Change it here, not in components.
 *
 * PLACEHOLDERS: every value below is a stand-in until confirmed with Sulzer
 * (persona, customer company, market and product names).
 */

import type { PersonaId, User } from '../types'

export type { PersonaId }

/**
 * Who can sign in. "Sign in" logs in `defaultPersona`; the Shift+D panel offers each
 * one. To add a persona, add its id to `PersonaId` in types.ts and an entry here.
 */
export const personas = {
  endUser: {
    kind: 'customer',
    label: 'End user',
    // Placeholder persona — confirm name/role with Sulzer.
    firstName: 'Emma',
    name: 'Emma Lindqvist',
    initials: 'EL',
    // Placeholder customer company — confirm with Sulzer (fictional, not a real customer).
    company: 'Nordvatten Utilities AB',
    role: 'Maintenance Manager',
    // Placeholder address on a reserved example domain.
    email: 'emma.lindqvist@nordvatten.example',
    customerId: 'nordvatten',
  },
  channelPartner: {
    kind: 'partner',
    label: 'Channel partner',
    // Placeholder persona and partner company (fictional) — confirm with Sulzer.
    firstName: 'Lars',
    name: 'Lars Ek',
    initials: 'LE',
    company: 'Aqua Pumpteknik AB',
    role: 'Sales Engineer',
    email: 'lars.ek@aquapumpteknik.example',
    partner: { type: 'Authorised Sulzer distributor', region: 'Region Mälardalen' },
  },
  /**
   * The consultant persona (deck slide "Consultant"): sizes pumps early in
   * projects, writes tenders and works with the project team.
   * PLACEHOLDER — fictional person and company; confirm with Sulzer.
   */
  consultant: {
    kind: 'consultant',
    label: 'Consultant',
    firstName: 'Anna',
    name: 'Anna Berg',
    initials: 'AB',
    company: 'Nordic Water Consulting AB',
    role: 'Senior Consulting Engineer',
    email: 'anna.berg@nordicwater.example',
  },
} as const satisfies Record<PersonaId, User>

export const defaultPersona: PersonaId = 'endUser'

/** The end user. Kept for data that is always Emma's (projects, My Pages copy). */
export const demoUser = personas.endUser

/**
 * Partner net prices: the channel partner pays list price less this discount on
 * models, sizing results, project items, spare parts, kits and the cart (lib/pricing.ts).
 * Lead times are the same for everyone. PLACEHOLDERS — confirm with Sulzer.
 */
export const partnerPricing = {
  /** % off list price. */
  discount: 32,
} as const

/** The consultant (Fredrik's persona, slide 10). */
export const consultantUser = personas.consultant

export const market = {
  // Placeholder market — confirm with Sulzer.
  country: 'Sweden',
  language: 'English',
  languageCode: 'EN',
  // Placeholder — list prices on the Models tab are in this currency, excl. VAT.
  currency: 'EUR',
} as const

// One name for the IoT offering and its app — confirm with Sulzer.
const sulzerConnect = 'Sulzer Connect'

export const products = {
  // Sulzer product names — confirm the exact names and that each fits its application with Sulzer.
  ahlstar: 'AHLSTAR',
  sns: 'SNS',
  smd: 'SMD',
  sjt: 'SJT',
  sjm: 'SJM',
  xfp: 'XFP',
  afp: 'AFP',
  // Placeholder — confirm the name of Sulzer's submersible dewatering pump range.
  jDewatering: 'J dewatering pump',
  connect: sulzerConnect,
  // Placeholder — confirm the pump controller's name.
  pumpController: 'PC 441 pump controller',
  blueBox: 'BLUE BOX',
  // Placeholder — confirm whether Sulzer sells a motor protection relay and what it is called.
  motorProtectionRelay: 'Motor protection relay',
  // Same as `connect` on purpose — confirm with Sulzer.
  iotOffering: sulzerConnect,
} as const

export const productSeries = {
  // Placeholder model-name prefixes, e.g. "AHLSTAR 150-125-315" — confirm with Sulzer.
  ahlstar: 'AHLSTAR',
  xfp: 'XFP',
} as const

/**
 * Sizing defaults and life cycle cost assumptions.
 * PLACEHOLDERS — confirm with Sulzer: the duty point is a plausible raw water lift
 * for the recording (covered by eight AHLSTAR sizes), and the energy price and
 * running hours are typical values, not Sulzer figures.
 */
export const sizingDemo = {
  productId: 'ahlstar',
  /** m³/h. */
  flow: 150,
  /** m. */
  head: 30,
  liquid: 'water',
  /** °C. */
  temperature: 20,
  frequency: 50,
  /** EUR per kWh. */
  electricityPrice: 0.12,
  /** Hours per year. */
  operatingHours: 6000,
  /** Life cycle cost period, years. */
  lifeCycleYears: 15,
  /** "18 best matches": the result list is capped at this many. */
  maxResults: 18,
} as const

/**
 * Replacement of an installed pump (/products/replacement/existing-pump): how the existing pump's energy use is
 * estimated. Running hours and energy price come from `sizingDemo`.
 * PLACEHOLDERS — confirm with Sulzer; typical values, not Sulzer figures.
 */
export const replacementDemo = {
  /** Pump efficiency points lost to wear per 10 000 run hours (worn wear rings, impeller). */
  wearPerTenThousandHours: 1,
  /** Never more than this many points of wear. */
  maxWear: 5,
  /** Motor efficiency of an installed pump, % (an IE2-class motor). */
  existingMotorEfficiency: 93,
  /** Another brand: estimated pump efficiency at the duty point, %. */
  otherBrandEfficiency: 60,
} as const

/**
 * The demo's "today". Condition data runs hourly up to the last full hour before
 * `lastSync`, and "service due" counts from `today`. Wall-clock time, no time zone.
 */
export const demoClock = {
  today: '2026-10-28',
  /** Last Sulzer Connect sync, shown as "Updated today, 08:42". */
  lastSync: '08:42',
} as const

/**
 * Condition limits. PLACEHOLDERS — confirm with Sulzer. Vibration uses ISO 10816-3-style
 * zones A/B/C/D (mm/s RMS): `zones` are the A/B, B/C and C/D boundaries.
 */
export const conditionLimits = {
  vibration: { zones: [2.8, 4.5, 7.1], warning: 7.1, alarm: 11 },
  bearingTemperature: { warning: 85, alarm: 95 },
  motorTemperature: { warning: 105, alarm: 115 },
} as const

/**
 * Service Provider Workshop persona.
 * PLACEHOLDERS — confirm with Sulzer: the demo pump and the customer's account terms.
 */
export const serviceProviderDemo = {
  /** The configured XFP the presenter finds, opens and orders parts for. */
  variantId: '24150231',
  /** The AHLSTAR model the Spare parts tab opens on, and whose part numbers search finds first. */
  ahlstarModelId: 'ahlstar-100-80-250',
} as const

/** Reference shown after "Request quotation" is sent. Fixed, so every recording shows the same one. */
export const quotationReference = 'Q-10242'

/**
 * "Where to buy" on configured products. FICTIONAL — not a real Sulzer site.
 * The phone number is in the range Sweden reserves for fiction (070-174 06 xx).
 */
export const serviceCentre = {
  name: 'Sulzer Service Centre Mälardalen',
  address: ['Verkstadsgatan 8', '721 30 Västerås', 'Sweden'],
  phone: '+46 70 174 06 42',
  email: 'service.malardalen@sulzer.example',
  hours: 'Mon–Fri 07:00–16:00',
  distance: '14 km',
  services: ['Spare parts from stock', 'Workshop repairs and overhauls', 'Field service'],
} as const

/**
 * eShop settings for the Service Provider Workshop.
 * PLACEHOLDERS — confirm with Sulzer: freight, VAT, delivery addresses and numbering.
 */
export const eshop = {
  /** "Today" for delivery dates, fixed so every recording shows the same dates. */
  today: '2026-11-03',
  /** Working days from dispatch to the customer's door. */
  transitDays: 2,
  /** % on top of the excl. VAT total (Sweden). */
  vatRate: 25,
  freight: { standard: 45, freeFrom: 2500 },
  paymentTerms: 'Invoice on account, 30 days net',
  /** The first order is SO-104390, the next SO-104391 … */
  firstOrderNumber: 104390,
  /** The first saved quotation is Q-10243 (Q-10242 is the variant page's quotation request). */
  firstQuotationNumber: 10243,
  /** Fictional addresses of the demo company. */
  deliveryAddresses: [
    {
      id: 'workshop',
      name: 'Central workshop',
      lines: ['Nordvatten Utilities AB', 'Verkstadsvägen 12', '652 21 Karlstad', 'Sweden'],
    },
    {
      id: 'riverside',
      name: 'Riverside intake pumping station',
      lines: ['Nordvatten Utilities AB', 'Älvkanten 3', '653 40 Karlstad', 'Sweden'],
    },
  ],
} as const

export const customerAccount = {
  // Placeholder account terms for the demo company.
  customerNumber: '104572',
  discountGroup: 'SP',
  /** % off list price on spare parts and service kits. */
  partsDiscount: 18,
} as const

/** Reference shown after "Request service" is sent. Fixed, so every recording shows the same one. */
export const serviceRequestReference = 'SR-2026-0142'

/**
 * Show the expected file name on image placeholders, so missing images are easy to spot.
 * Set to false before recording.
 */
export const showPlaceholderLabels = true

/** Base of the project share link in the Share dialog. Placeholder — confirm the mySulzer URL with Sulzer. */
export const shareLinkBase = 'https://my.sulzer.com/projects/'

/** Shown wherever a page, tab or option is not part of the demo. No contact button. */
export const demoNotice = {
  title: 'This is a live demo',
  text: 'We currently do not offer this service.',
  /** Badge on an option that can't be picked, e.g. a tender text language. */
  badge: 'not offered in this demo',
}
