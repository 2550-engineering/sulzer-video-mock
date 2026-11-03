import type { PersonaId, User } from '../types'

/*
 * Demo content used across the mock-up. Change it here, not in components.
 *
 * PLACEHOLDERS: every value below is a stand-in until confirmed with Sulzer
 * (persona, customer company, market and product names).
 */

export const demoUser = {
  // Placeholder persona — confirm name/role with Sulzer.
  firstName: 'Emma',
  name: 'Emma Lindqvist',
  initials: 'EL',
  // Placeholder customer company — confirm with Sulzer (fictional, not a real customer).
  company: 'Nordvatten Utilities AB',
  role: 'Maintenance Manager',
  // Placeholder address on a reserved example domain.
  email: 'emma.lindqvist@nordvatten.example',
} as const

/**
 * The consultant persona (deck slide "Consultant"): sizes pumps early in
 * projects, writes tenders and works with the project team.
 * PLACEHOLDER — fictional person and company; confirm with Sulzer.
 */
export const consultantUser = {
  firstName: 'Anna',
  name: 'Anna Berg',
  initials: 'AB',
  company: 'Nordic Water Consulting AB',
  role: 'Senior Consulting Engineer',
  email: 'anna.berg@nordicwater.example',
} as const

/** Who "Sign in" signs in as, per persona. The end user is the default everywhere. */
export const personas = {
  endUser: demoUser,
  consultant: consultantUser,
} as const satisfies Record<PersonaId, User>

export const market = {
  // Placeholder market — confirm with Sulzer.
  country: 'Sweden',
  language: 'English',
  languageCode: 'EN',
  // Placeholder — list prices on the Models tab are in this currency, excl. VAT.
  currency: 'EUR',
} as const

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
  connect: 'Sulzer Connect',
  // Placeholder — confirm the pump controller's name.
  pumpController: 'PC 441 pump controller',
  blueBox: 'BLUE BOX',
  // Placeholder — confirm whether Sulzer sells a motor protection relay and what it is called.
  motorProtectionRelay: 'Motor protection relay',
  iotOffering: 'Sulzer Smart Monitoring',
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
