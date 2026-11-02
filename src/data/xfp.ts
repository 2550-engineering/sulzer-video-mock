import { products as productNames } from '../config/demo'
import { discontinued, shipsIn, weeks } from '../lib/availability'
import type { ProductVariant, ReplacementInfo } from '../types'

/*
 * XFP configured variants: orderable articles with motor, voltage, cable and
 * approvals fixed. The product itself (page, images, Explore tab) is `xfp` in
 * products.ts; its sizes are in models/xfp.ts. Codes, numbers, figures and
 * prices are invented.
 *
 * Model code pattern: XFP <size> CB<hydraulic version> PE<P2 × 10>/<poles>-<supply> *<cable m>-<ST|EX>
 *   CB    closed two-channel impeller
 *   D01   400 V 50 Hz, direct on line · D02 690 V 50 Hz · D11 460 V 60 Hz
 *   ST    standard · EX explosion proof
 */

export const xfp = {
  productId: 'xfp',
  name: productNames.xfp,
  category: 'Submersible wastewater pump',
} as const

/** What every XFP variant shares. */
const common = {
  productId: xfp.productId,
  category: xfp.category,
  phase: 3,
  ipClass: 'IP68',
  housingMaterial: 'Grey cast iron EN-GJL-250',
  maxAmbientTemp: 40,
  applicationIds: ['wastewater-collection', 'stormwater-flood-control', 'wastewater-treatment'],
} satisfies Partial<ProductVariant>

const castIronImpeller = (diameter: number) => ({
  type: 'Closed two-channel',
  material: 'Grey cast iron EN-GJL-250',
  diameter,
})

export const xfpVariants: ProductVariant[] = [
  {
    ...common,
    id: '24140111',
    productNumber: '24140111',
    modelId: 'xfp-100-c',
    code: `${xfp.name} 100C CB1.5 PE75/4-D01 *10-ST`,
    frequency: 50,
    power: 7.5,
    speed: 1455,
    voltage: '400 V',
    impeller: castIronImpeller(245),
    connection: { inlet: 100, outlet: 100 },
    exApproved: false,
    cableLength: 10,
    weight: 210,
    listPrice: 7900,
    availability: weeks(2, 3),
  },
  {
    ...common,
    id: '24140112',
    productNumber: '24140112',
    modelId: 'xfp-100-c',
    code: `${xfp.name} 100C CB1.5 PE75/4-D01 *10-EX`,
    frequency: 50,
    power: 7.5,
    speed: 1455,
    voltage: '400 V',
    impeller: castIronImpeller(245),
    connection: { inlet: 100, outlet: 100 },
    exApproved: true,
    cableLength: 10,
    weight: 218,
    listPrice: 9150,
    availability: weeks(4, 6),
  },
  {
    ...common,
    id: '24140121',
    productNumber: '24140121',
    modelId: 'xfp-100-c',
    code: `${xfp.name} 100C CB1.5 PE90/4-D01 *20-ST`,
    frequency: 50,
    power: 9,
    speed: 1460,
    voltage: '400 V',
    impeller: castIronImpeller(260),
    connection: { inlet: 100, outlet: 100 },
    exApproved: false,
    cableLength: 20,
    weight: 228,
    listPrice: 8650,
    availability: weeks(2, 3),
  },
  {
    ...common,
    id: '24150211',
    productNumber: '24150211',
    modelId: 'xfp-150-e',
    code: `${xfp.name} 150E CB1.6 PE185/4-D01 *10-ST`,
    frequency: 50,
    power: 18.5,
    speed: 1470,
    voltage: '400 V',
    impeller: castIronImpeller(315),
    connection: { inlet: 150, outlet: 150 },
    exApproved: false,
    cableLength: 10,
    weight: 455,
    listPrice: 14900,
    availability: weeks(6, 8),
  },
  {
    // The demo pump (serviceProviderDemo.variantId); its BOM is in spareParts/xfp.ts.
    ...common,
    id: '24150231',
    productNumber: '24150231',
    modelId: 'xfp-150-e',
    code: `${xfp.name} 150E CB1.6 PE220/4-D01 *10-ST`,
    frequency: 50,
    power: 22,
    speed: 1470,
    voltage: '400 V',
    impeller: castIronImpeller(330),
    connection: { inlet: 150, outlet: 150 },
    exApproved: false,
    cableLength: 10,
    weight: 480,
    listPrice: 16400,
    availability: shipsIn(3),
  },
  {
    ...common,
    id: '24150232',
    productNumber: '24150232',
    modelId: 'xfp-150-e',
    code: `${xfp.name} 150E CB1.6 PE220/4-D01 *10-EX`,
    frequency: 50,
    power: 22,
    speed: 1470,
    voltage: '400 V',
    impeller: castIronImpeller(330),
    connection: { inlet: 150, outlet: 150 },
    exApproved: true,
    cableLength: 10,
    weight: 492,
    listPrice: 18900,
    availability: weeks(6, 8),
  },
  {
    ...common,
    id: '24150241',
    productNumber: '24150241',
    modelId: 'xfp-150-e',
    code: `${xfp.name} 150E CB1.6 PE300/4-D02 *20-ST`,
    frequency: 50,
    power: 30,
    speed: 1475,
    voltage: '690 V',
    impeller: {
      type: 'Closed two-channel',
      material: 'Duplex stainless steel 1.4470',
      diameter: 345,
    },
    connection: { inlet: 150, outlet: 150 },
    exApproved: false,
    cableLength: 20,
    weight: 545,
    listPrice: 19800,
    availability: weeks(8, 10),
  },
  {
    ...common,
    id: '24150261',
    productNumber: '24150261',
    modelId: 'xfp-150-e',
    code: `${xfp.name} 150E CB1.6 PE250/4-D11 *10-ST`,
    frequency: 60,
    power: 25,
    speed: 1770,
    voltage: '460 V',
    impeller: castIronImpeller(300),
    connection: { inlet: 150, outlet: 150 },
    exApproved: false,
    cableLength: 10,
    weight: 490,
    listPrice: 17300,
    availability: weeks(8, 10),
  },
  {
    // Built until 2017; replaced by the demo pump.
    ...common,
    id: '24130931',
    productNumber: '24130931',
    modelId: 'xfp-150-e',
    code: `${xfp.name} 150E CB1.6 PE200/4-D01 *10-ST`,
    frequency: 50,
    power: 20,
    speed: 1465,
    voltage: '400 V',
    impeller: castIronImpeller(325),
    connection: { inlet: 150, outlet: 150 },
    exApproved: false,
    cableLength: 10,
    weight: 470,
    listPrice: 15200,
    availability: discontinued,
    discontinued: { year: 2018, successorId: '24150231' },
  },
]

/** Spec values every XFP variant shares, for the Specifications tab. Invented. */
export const xfpDetails = {
  pumpedLiquids: 'Wastewater, stormwater, raw water',
  liquidTemperature: '0–40 °C',
  maxDensity: '1 100 kg/m³',
  ph: '6–11',
  /** Free passage through the impeller, mm, per model. */
  freePassage: { 'xfp-100-c': 76, 'xfp-150-e': 100 } as Record<string, number>,
  shaft: 'Stainless steel 1.4021',
  shaftSeals: 'SiC/SiC (liquid side), carbon/chrome steel (motor side)',
  oRings: 'NBR',
  fasteners: 'Stainless steel A4',
  installation: 'Wet well, on auto-coupling',
  maxImmersion: '20 m',
  insulationClass: 'H',
  dutyType: 'S1 continuous',
  motorProtection: 'PTC thermistors in the stator, moisture sensor in the seal chamber',
  /** Starting method per supply code in the model code. */
  starting: { D01: 'Direct on line', D02: 'Star-delta', D11: 'Direct on line' } as Record<
    string,
    string
  >,
}

/** Replacement details per discontinued variant id. Invented. */
export const xfpReplacements: Record<string, ReplacementInfo> = {
  '24130931': {
    adapterKit: {
      partNumber: '61599150',
      name: 'Adapter kit, auto-coupling claw DN 150 (built before 2018 to current)',
      listPrice: 286,
      availability: shipsIn(2),
    },
    notes: [
      {
        kind: 'warning',
        text: 'Needs adapter kit 61599150: the auto-coupling claw on pumps built before 2018 has a different bolt pattern.',
      },
      {
        kind: 'info',
        text: 'The new pump has a moisture sensor in the seal chamber. Connect it to the pump controller to get early seal warnings.',
      },
      {
        kind: 'ok',
        text: 'Same guide rails and base elbow: the existing auto-coupling in the sump stays.',
      },
    ],
  },
}
