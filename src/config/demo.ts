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
} as const

export const products = {
  // Sulzer product names — confirm the exact names and that each fits its application with Sulzer.
  ahlstar: 'AHLSTAR',
  sns: 'SNS',
  smd: 'SMD',
  sjt: 'SJT',
  xfp: 'XFP',
  connect: 'Sulzer Connect',
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
 * Show the expected file name on image placeholders, so missing images are easy to spot.
 * Set to false before recording.
 */
export const showPlaceholderLabels = true
