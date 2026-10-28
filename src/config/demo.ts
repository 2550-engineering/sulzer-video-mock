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
} as const

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

/** Reference shown after "Request service" is sent. Fixed, so every recording shows the same one. */
export const serviceRequestReference = 'SR-2026-0142'

/**
 * Show the expected file name on image placeholders, so missing images are easy to spot.
 * Set to false before recording.
 */
export const showPlaceholderLabels = true
