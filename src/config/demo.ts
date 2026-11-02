/*
 * Demo content used across the mock-up. Change it here, not in components.
 *
 * PLACEHOLDERS: every value below is a stand-in until confirmed with Sulzer
 * (persona, customer company, market and product names).
 */

import type { ModelAvailability, User } from '../types'

/**
 * Who can sign in. "Sign in" logs in `defaultPersona`; the Shift+D panel offers each
 * one. To add a persona (service provider, consultant …), add an entry here.
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
} as const satisfies Record<string, User>

export type PersonaId = keyof typeof personas

export const defaultPersona: PersonaId = 'endUser'

/** The end user. Kept for data that is always Emma's (projects, My Pages copy). */
export const demoUser = personas.endUser

/**
 * Partner net prices and lead times, for spare parts and partner prices only
 * (the Models tab keeps its own lead times). PLACEHOLDERS — confirm with Sulzer.
 */
export const partnerPricing = {
  /** % off list price. */
  discount: 32,
  leadTimes: {
    'In stock': 'In stock – ships in 2 days',
    'Fast delivery': 'Fast delivery – 1 week',
    'Made to order': 'Made to order – 3 weeks',
  } satisfies Record<ModelAvailability, string>,
} as const

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

/** Reference shown after "Request service" is sent. Fixed, so every recording shows the same one. */
export const serviceRequestReference = 'SR-2026-0142'

/**
 * Show the expected file name on image placeholders, so missing images are easy to spot.
 * Set to false before recording.
 */
export const showPlaceholderLabels = true
