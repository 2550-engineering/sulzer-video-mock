import type { TenderLanguage, TenderSubject } from '../types'

/*
 * Wording of the generated tender texts (src/lib/tenderText.ts) and of the
 * tender text dialog. Clauses marked INVENTED are our own specification
 * style, not Sulzer text: see docs/content-to-confirm.md.
 */

const numberWords = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']

/** "Two (2)" for 1–9, otherwise the digits. */
export const quantityWords = (n: number) =>
  n >= 1 && n <= 9 ? `${numberWords[n]} (${n})` : String(n)

export const tenderCopy = {
  sections: {
    general: 'General description',
    duty: 'Application and duty point',
    hydraulic: 'Hydraulic data',
    design: 'Design',
    materials: 'Materials',
    seal: 'Shaft seal',
    motor: 'Motor',
    connections: 'Connections',
    accessories: 'Accessories',
    testing: 'Testing and standards',
    documentation: 'Documentation',
    manufacturer: 'Manufacturer',
  },

  general: {
    'end-suction': (quantity: number) =>
      `${quantityWords(quantity)} horizontal, single-stage, end-suction centrifugal ${quantity === 1 ? 'pump' : 'pumps'} with closed impeller, of back pull-out design, each complete with electric motor, flexible spacer coupling, coupling guard and common base plate.`,
    submersible: (quantity: number) =>
      `${quantityWords(quantity)} submersible wastewater ${quantity === 1 ? 'pump' : 'pumps'} for wet-well installation on an auto-coupling, with closed two-channel impeller, integrated motor and power cable.`,
  } satisfies Record<TenderSubject['kind'], (quantity: number) => string>,

  application: (application: string) => `Application: ${application.toLowerCase()}.`,
  dutyRows: {
    liquid: 'Liquid',
    temperature: 'Liquid temperature',
    flow: 'Required flow rate',
    head: 'Required total head',
  },
  ratedOnly: 'No duty point is given; the data below is the pump’s rated point.',

  hydraulicRows: {
    flow: 'Flow rate at operating point',
    head: 'Head at operating point',
    efficiency: 'Pump efficiency',
    npshr: 'NPSH required',
    speed: 'Speed',
    impeller: 'Impeller diameter',
  },
  // INVENTED clause.
  operatingRange:
    'The operating point shall lie between 70 % and 120 % of the best-efficiency flow of the selected impeller.',

  design: {
    // INVENTED clauses.
    'end-suction': [
      'Volute casing with integral feet and axial suction, radial top discharge.',
      'Back pull-out design: the rotating unit can be removed without disconnecting the suction and discharge pipework or moving the motor.',
      'Main dimensions to ISO 2858 / EN 22858 where the size is covered by the standard.',
      'Shaft supported by grease- or oil-lubricated rolling bearings rated for at least 25 000 hours (L10).',
    ],
    submersible: [
      'Suitable for continuous operation (S1) submerged and for intermittent operation with the motor partly exposed.',
      'Installed on guide rails with an auto-coupling, so the pump can be lifted out without entering the wet well.',
      'Motor cooled by the pumped liquid; cooling jacket where the motor is not submerged.',
    ],
  } satisfies Record<TenderSubject['kind'], string[]>,

  materialRows: {
    casing: 'Pump casing',
    impeller: 'Impeller',
    shaft: 'Shaft',
    wearParts: 'Wear rings / wear parts',
  },

  seals: {
    // INVENTED clauses.
    SD: 'Single mechanical seal, balanced, silicon carbide against carbon faces, EPDM elastomers, to EN 12756.',
    DD: 'Double mechanical seal with barrier fluid, silicon carbide faces on the product side, to EN 12756.',
    'Single mechanical seal': 'Single mechanical seal, balanced, to EN 12756.',
    'Double mechanical seal': 'Double mechanical seal with barrier fluid, to EN 12756.',
    Packing: 'Gland packing with lantern ring and flushing connection.',
    submersible:
      'Two independent mechanical seals in an oil-filled seal chamber, the liquid-side seal in silicon carbide; moisture sensor in the seal chamber.',
  } satisfies Record<TenderSubject['seal'], string>,

  motorRows: {
    power: 'Rated power P2',
    supply: 'Supply',
    poles: 'Poles / speed',
    efficiencyClass: 'Efficiency class',
    enclosure: 'Enclosure',
    insulation: 'Insulation class',
    protection: 'Motor protection',
    ex: 'Explosion protection',
  },
  // INVENTED values.
  insulation: 'F, temperature rise to class B',
  protection: {
    'end-suction': 'PTC thermistors in the stator winding',
    submersible: 'PTC thermistors in the stator, moisture sensor in the seal chamber',
  } satisfies Record<TenderSubject['kind'], string>,
  exYes: 'ATEX II 2G Ex db IIB T4 Gb',

  connectionRows: {
    suction: 'Suction',
    discharge: 'Discharge',
    flanges: 'Flanges',
  },
  // INVENTED: flange standard and pressure class.
  flanges: 'EN 1092-2, PN 16',

  accessories: {
    // INVENTED lists.
    'end-suction': [
      'Common base plate in welded steel, prepared for grouting',
      'Flexible spacer coupling',
      'Coupling guard to EN ISO 14120',
      'Foundation bolts',
    ],
    submersible: [
      'Auto-coupling base elbow with guide rail brackets',
      'Lifting chain in stainless steel',
    ],
  } satisfies Record<TenderSubject['kind'], string[]>,
  cable: (m: number) => `Power cable, ${m} m`,

  testing: [
    // INVENTED clauses.
    'Performance test at the manufacturer’s works to ISO 9906, grade 2B, with test certificate.',
    'Hydrostatic test of pressure-bearing parts at 1.5 × the maximum working pressure.',
    'Material certificates to EN 10204 3.1 for casing and impeller, on request.',
    'CE marking; declaration of conformity to the Machinery Directive 2006/42/EC.',
  ],

  documentation: [
    // INVENTED list.
    'Installation, operating and maintenance instructions',
    'Data sheet with performance curve at the operating point',
    'Dimensional drawing',
    'Spare parts list with recommended spare parts',
    'Declaration of conformity',
  ],

  manufacturer: (model: string, productNumber: string | null, orEqual: boolean) =>
    `Manufacturer: Sulzer, type ${model}${productNumber ? ` (product no. ${productNumber})` : ''}${orEqual ? ', or equal' : ''}.`,

  positionHeading: (position: number, tag: string, model: string) =>
    `Pos. ${position}${tag ? ` – ${tag}` : ''} – ${model}`,
}

/** Values the product data doesn't hold, used in every tender text. INVENTED. */
export const tenderDefaults = {
  shaft: 'Stainless steel 1.4021',
  wearParts: {
    'end-suction': 'Bronze CuSn10; duplex stainless steel for duplex pumps',
    submersible: 'Stainless steel 1.4460',
  } satisfies Record<TenderSubject['kind'], string>,
  /** Motor enclosure of sized and catalogue end-suction pumps. */
  enclosure: 'IP55',
  efficiencyClass: 'IE3',
}

/** The tender text dialog and its buttons. */
export const tenderDialog = {
  title: (subject: string) => `Tender text – ${subject}`,
  projectTitle: (project: string) => `Tender texts – ${project}`,
  documentTitle: (subject: string) => `Tender text: ${subject}`,
  close: 'Close',
  options: 'Options',
  language: 'Language',
  languages: {
    en: 'English',
    sv: 'Swedish',
    de: 'German',
  } satisfies Record<TenderLanguage, string>,
  detail: 'Detail level',
  short: 'Short',
  full: 'Full',
  includeDuty: 'Include duty point',
  orEqual: 'Include “or equal” clause',
  copy: 'Copy to clipboard',
  copied: 'Tender text copied',
  copiedDetail: 'Paste it into your tender document.',
  docx: 'Download .docx',
  downloaded: 'Tender text downloaded',
  pdf: 'Download PDF',
  pdfHint: 'Opens the print dialog; choose “Save as PDF”.',
  open: 'Tender text',
  openAll: 'Tender texts',
}
