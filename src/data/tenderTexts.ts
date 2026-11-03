import type { CasingMaterial, ShaftSeal } from '../types'

/*
 * Tender texts (Models tab, My projects, replacement finder). The wording, material
 * grades, seal details and standards are written for the mock-up: see
 * docs/content-to-confirm.md.
 */

/** Opening paragraph and standards per product. Products without an entry use the generic text. */
export const tenderProducts: Record<string, { description: string; standards: string[] }> = {
  ahlstar: {
    description:
      'Horizontal, single-stage end-suction centrifugal pump of back pull-out design, so the rotating unit can be removed without disturbing the pipework or the motor. Closed impeller with renewable wear rings, mounted on a common base frame with the motor and a flexible coupling.',
    standards: [
      'Dimensions and design to ISO 2858 and ISO 5199',
      'Flanges to EN 1092-2, PN 16',
      'Performance test to ISO 9906, grade 2B',
      'CE marked to the Machinery Directive 2006/42/EC',
      'Ecodesign Regulation (EU) 547/2012 for water pumps, MEI ≥ 0.4',
    ],
  },
  xfp: {
    description:
      'Submersible, non-clogging wastewater pump for wet-well installation on an auto-coupling duck foot. Contrablock wear plate and clog-resistant impeller, premium-efficiency motor cooled by the surrounding liquid, with moisture and temperature sensors.',
    standards: [
      'Discharge flange to EN 1092-2, PN 10',
      'Performance test to ISO 9906, grade 2B',
      'Motor to IEC 60034-30-1',
      'CE marked to the Machinery Directive 2006/42/EC',
      'Explosion-proof version to ATEX on request',
    ],
  },
}

export const genericTenderProduct = {
  description: 'Centrifugal pump unit, complete with motor, for the duty below.',
  standards: [
    'Performance test to ISO 9906, grade 2B',
    'CE marked to the Machinery Directive 2006/42/EC',
  ],
}

/** Materials of the wetted parts for each casing material on the Models tab. */
export const tenderMaterials: Record<
  CasingMaterial,
  { casing: string; impeller: string; shaft: string; wearRings: string }
> = {
  'Grey cast iron': {
    casing: 'Grey cast iron EN-GJL-250',
    impeller: 'Grey cast iron EN-GJL-250',
    shaft: 'Stainless steel EN 1.4021',
    wearRings: 'Grey cast iron EN-GJL-250',
  },
  'Ductile iron': {
    casing: 'Ductile iron EN-GJS-400-15',
    impeller: 'Ductile iron EN-GJS-400-15',
    shaft: 'Stainless steel EN 1.4462',
    wearRings: 'Stainless steel EN 1.4408',
  },
  'Duplex stainless steel': {
    casing: 'Duplex stainless steel EN 1.4470',
    impeller: 'Duplex stainless steel EN 1.4470',
    shaft: 'Duplex stainless steel EN 1.4462',
    wearRings: 'Duplex stainless steel EN 1.4470',
  },
}

/** Shaft seal details by type. */
export const tenderSeals: Record<ShaftSeal, string> = {
  Packing:
    'Gland packing, PTFE-impregnated aramid, 5 rings with lantern ring and external flushing connection',
  'Single mechanical seal':
    'Single mechanical seal to EN 12756, silicon carbide against carbon faces, EPDM elastomers',
  'Double mechanical seal':
    'Double mechanical seal in back-to-back arrangement, silicon carbide faces on both seals, FKM elastomers, with a barrier fluid connection',
}

export const tenderText = {
  open: 'Tender text',
  dialogTitle: (name: string) => `Tender text – ${name}`,
  close: 'Close',
  language: 'Language',
  languages: [
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch (coming soon)', disabled: true },
    { value: 'fr', label: 'Français (coming soon)', disabled: true },
    { value: 'sv', label: 'Svenska (coming soon)', disabled: true },
    { value: 'es', label: 'Español (coming soon)', disabled: true },
  ],
  copy: 'Copy',
  copied: 'Copied',
  download: 'Download .docx',
  downloadAll: 'Download all tender texts',
  downloadedAll: (count: number, project: string) =>
    `${count} tender ${count === 1 ? 'text' : 'texts'} for ${project} downloaded`,
  note: 'Generated from the product data. Check it against your project specification before you issue the tender.',
  heading: 'Specification',
  /** Line under the title. */
  reference: (productNumber: string | null) =>
    productNumber ? `Sulzer product no. ${productNumber}` : 'Sulzer product no. on request',
  position: (position: number, yours: string, quantity: number) =>
    `Item ${position}${yours ? ` · Your position ${yours}` : ''} · Quantity ${quantity}`,
  sections: {
    general: 'General',
    hydraulics: 'Hydraulic data',
    materials: 'Materials',
    seal: 'Shaft seal',
    motor: 'Motor',
    standards: 'Standards and testing',
    make: 'Make and type',
  },
  rows: {
    dutyFlow: 'Duty flow',
    dutyHead: 'Duty head',
    operatingPoint: 'Operating point',
    ratedFlow: 'Rated flow',
    ratedHead: 'Rated head',
    efficiency: 'Pump efficiency at duty point',
    ratedEfficiency: 'Pump efficiency at rated point',
    npshr: 'NPSH required',
    liquid: 'Liquid',
    speed: 'Speed',
    impeller: 'Impeller diameter',
    suction: 'Suction connection',
    discharge: 'Discharge connection',
    maxPressure: 'Max. operating pressure',
    weight: 'Weight, pump unit',
    casing: 'Pump casing',
    impellerMaterial: 'Impeller',
    shaft: 'Shaft',
    wearRings: 'Wear rings',
    seal: 'Type',
    coupling: 'Coupling',
    motorPower: 'Rated power',
    motorSpeed: 'Poles / speed',
    supply: 'Supply',
    efficiencyClass: 'Efficiency class',
    motorEfficiency: 'Motor efficiency',
    enclosure: 'Enclosure',
    insulation: 'Insulation',
    manufacturer: 'Manufacturer',
    type: 'Type',
    productNumber: 'Product no.',
  },
  motorDefaults: {
    efficiencyClass: 'IE3, IE4 on request',
    supply: (hz: number) => `400 V, 3~, ${hz} Hz`,
    enclosure: 'IP55',
    insulation: 'Class F, temperature rise class B',
  },
  manufacturer: 'Sulzer',
  orEqual: 'or approved equal.',
  /** File names. */
  fileName: (name: string) => `Tender text ${name}.rtf`,
  projectFileName: (project: string) => `Tender texts ${project}.rtf`,
}
