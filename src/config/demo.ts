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
  // Placeholder product names — confirm exact product names and models with Sulzer.
  mainEndSuctionPump: 'Sulzer End Suction Pump',
  submersiblePump: 'Sulzer Submersible Wastewater Pump',
  grinderPump: 'Sulzer Submersible Grinder Pump',
  highCapacityPump: 'Sulzer High-Capacity Submersible Pump',
  iotOffering: 'Sulzer Smart Monitoring',
} as const

export const productSeries = {
  // Placeholder model-name prefixes, e.g. "SES 150-125-315" — confirm with Sulzer.
  mainEndSuctionPump: 'SES',
  submersiblePump: 'SWP',
  grinderPump: 'SGP',
  highCapacityPump: 'SHC',
} as const
