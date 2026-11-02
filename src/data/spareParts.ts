import type {
  CasingMaterial,
  KitItem,
  ModelAvailability,
  ProductModel,
  SparePart,
  SparePartGroup,
} from '../types'
import { productModels } from './productModels'

/*
 * Genuine spare parts: one parts list (BOM) per model, built from a template per product.
 * Parts that only depend on the bearing unit (shaft, seal, bearings …) are shared by every
 * size on that unit and have one part number, like AHLSTAR's real interchangeability.
 * Positions match the sectional drawing (data/sectionalDrawings.ts). Part numbers,
 * names, prices and lead times are invented: see docs/content-to-confirm.md.
 */

/** BOM order. */
export const sparePartGroups: SparePartGroup[] = [
  'Casing & hydraulics',
  'Shaft & seal',
  'Bearings',
  'Gaskets & O-rings',
  'Motor & cable',
  'Drive',
  'Service kits',
]

type Template = {
  /** Kits name their contents by kind. */
  kind: string
  /** First 5 digits of the part number; the last 3 come from `code`. */
  stem: string
  /** Kits without one sit at their first item's position, or nowhere with `position: null`. */
  position?: number | null
  group: SparePartGroup
  quantity?: number
  /** Models with the same key share the part. Null: the model has no such part. */
  key: (model: ProductModel) => string | null
  /** 3 digits. Default: the end of the first fitting model's product number. */
  code?: (model: ProductModel) => string
  name: (model: ProductModel) => string
  /** Single parts only; kits cost their contents less `kitSaving`. */
  price?: (model: ProductModel) => number
  availability: ModelAvailability | ((model: ProductModel) => ModelAvailability)
  /** File in /images/spare-parts/parts/, and what the photo should show. */
  image: [file: string, shows: string]
  /** Kits: item kinds ("a|b": whichever the model has) and quantities. */
  kit?: { contains: [kinds: string, quantity: number][]; interval?: string }
}

/** Kits cost this much less than their parts bought one by one. */
const kitSaving = 0.12

/** €38, €715, €1,480: small parts to the euro, others to 5 or 10. */
function round(price: number) {
  if (price < 100) return Math.round(price)
  if (price < 1000) return Math.round(price / 5) * 5
  return Math.round(price / 10) * 10
}

/* ── AHLSTAR ──────────────────────────────────────────────────────────────── */

/** AHLSTAR bearing units: which sizes share shaft, seal and bearings. */
const bearingUnits = [
  { unit: 1, maxImpeller: 200, shaft: 35, bearing: '06', code: '306', factor: 0.75 },
  { unit: 2, maxImpeller: 315, shaft: 45, bearing: '08', code: '308', factor: 1 },
  { unit: 3, maxImpeller: Infinity, shaft: 60, bearing: '12', code: '312', factor: 1.7 },
]
const unitOf = (m: ProductModel) => bearingUnits.find((u) => m.impeller <= u.maxImpeller)!

const materialFactor: Record<CasingMaterial, number> = {
  'Grey cast iron': 1,
  'Ductile iron': 1.2,
  'Duplex stainless steel': 1.9,
}
const material = (m: ProductModel) => m.casingMaterial.toLowerCase()
/** Price scale of the wetted parts: by impeller size and casing material. */
const wetted = (m: ProductModel) => (m.impeller / 315) ** 1.5 * materialFactor[m.casingMaterial]
const size = (m: ProductModel) => `${m.connection.suction}-${m.connection.discharge}-${m.impeller}`
const dn = (m: ProductModel) => `DN${m.connection.suction}/${m.connection.discharge}`
const castOrMade = (m: ProductModel): ModelAvailability =>
  m.casingMaterial === 'Grey cast iron' ? 'Fast delivery' : 'Made to order'

/** One part per size and casing material (50 and 60 Hz sizes share them). */
const bySize = (m: ProductModel) => `${size(m)} ${m.casingMaterial}`
const byUnit = (m: ProductModel) => `unit ${unitOf(m).unit}`
const unitCode = (m: ProductModel) => unitOf(m).code
const withSeal = (seal: ProductModel['shaftSeal']) => (m: ProductModel) =>
  m.shaftSeal === seal ? `${byUnit(m)} ${seal}` : null

const ahlstarTemplates: Template[] = [
  // Casing & hydraulics: one per size
  {
    kind: 'casing',
    stem: '62001',
    position: 102,
    group: 'Casing & hydraulics',
    key: bySize,
    name: (m) => `Volute casing, ${dn(m)}, ${material(m)}`,
    price: (m) => 3400 * wetted(m),
    availability: castOrMade,
    image: ['ahlstar-casing.jpg', 'Machined AHLSTAR volute casing, flange up'],
  },
  {
    kind: 'side-plate',
    stem: '62002',
    position: 135,
    group: 'Casing & hydraulics',
    key: bySize,
    name: (m) => `Side plate, externally adjustable, DN${m.connection.suction}, ${material(m)}`,
    price: (m) => 720 * wetted(m),
    availability: (m) => (m.casingMaterial === 'Grey cast iron' ? 'In stock' : 'Fast delivery'),
    image: ['ahlstar-side-plate.jpg', 'Round AHLSTAR side plate (suction cover) with its bolts'],
  },
  {
    kind: 'casing-cover',
    stem: '62003',
    position: 161,
    group: 'Casing & hydraulics',
    key: bySize,
    name: (m) => `Casing cover, ${size(m)}, ${material(m)}`,
    price: (m) => 1650 * wetted(m),
    availability: castOrMade,
    image: ['ahlstar-casing-cover.jpg', 'AHLSTAR casing cover, seal chamber side'],
  },
  {
    kind: 'impeller',
    stem: '62010',
    position: 230,
    group: 'Casing & hydraulics',
    key: bySize,
    name: (m) =>
      `Impeller, Ø${m.impeller} mm, ${m.casingMaterial === 'Duplex stainless steel' ? 'duplex' : 'stainless'} steel`,
    price: (m) =>
      2600 * (m.impeller / 315) ** 1.5 * (m.casingMaterial === 'Grey cast iron' ? 1 : 1.5),
    availability: (m) => (m.impeller <= 315 ? 'Fast delivery' : 'Made to order'),
    image: ['ahlstar-impeller.jpg', 'Closed AHLSTAR impeller, stainless steel'],
  },
  {
    kind: 'wear-ring',
    stem: '62005',
    position: 502,
    group: 'Casing & hydraulics',
    key: bySize,
    name: (m) => `Casing wear ring, Ø${Math.round(m.impeller * 0.46)} mm, ${material(m)}`,
    price: (m) => 260 * wetted(m),
    availability: 'In stock',
    image: ['ahlstar-wear-ring.jpg', 'Machined casing wear ring'],
  },
  {
    kind: 'support-foot',
    stem: '62020',
    position: 183,
    group: 'Casing & hydraulics',
    key: byUnit,
    code: unitCode,
    name: (m) => `Support foot, bearing unit ${unitOf(m).unit}`,
    price: (m) => 280 * unitOf(m).factor,
    availability: 'Fast delivery',
    image: ['ahlstar-support-foot.jpg', 'Cast AHLSTAR support foot for the bearing unit'],
  },

  // Shaft & seal: one per bearing unit (and seal type)
  {
    kind: 'shaft',
    stem: '62021',
    position: 210,
    group: 'Shaft & seal',
    key: byUnit,
    code: unitCode,
    name: (m) =>
      `Shaft, bearing unit ${unitOf(m).unit}, Ø${unitOf(m).shaft} mm, duplex stainless steel`,
    price: (m) => 1180 * unitOf(m).factor,
    availability: 'Fast delivery',
    image: ['ahlstar-shaft.jpg', 'Long stainless pump shaft with keyways, lying horizontally'],
  },
  {
    kind: 'sleeve',
    stem: '62022',
    position: 524,
    group: 'Shaft & seal',
    key: byUnit,
    code: unitCode,
    name: (m) => `Shaft sleeve, Ø${unitOf(m).shaft} mm, duplex stainless steel`,
    price: (m) => 340 * unitOf(m).factor,
    availability: 'In stock',
    image: ['ahlstar-shaft-sleeve.jpg', 'Polished stainless shaft sleeve'],
  },
  {
    kind: 'seal',
    stem: '62014',
    position: 433,
    group: 'Shaft & seal',
    key: withSeal('Single mechanical seal'),
    code: unitCode,
    name: (m) => `Mechanical seal, single, Ø${unitOf(m).shaft} mm, SiC/SiC, EPDM`,
    price: (m) => 1420 * unitOf(m).factor,
    availability: 'In stock',
    image: ['ahlstar-mechanical-seal.jpg', 'Single mechanical seal with silicon carbide faces'],
  },
  {
    kind: 'seal-double',
    stem: '62015',
    position: 433,
    group: 'Shaft & seal',
    key: withSeal('Double mechanical seal'),
    code: unitCode,
    name: (m) => `Mechanical seal cartridge, double, Ø${unitOf(m).shaft} mm, SiC/SiC`,
    price: (m) => 3150 * unitOf(m).factor,
    availability: 'Fast delivery',
    image: [
      'ahlstar-seal-cartridge.jpg',
      'Double mechanical seal cartridge with flush connections',
    ],
  },
  {
    kind: 'packing',
    stem: '62013',
    position: 461,
    group: 'Shaft & seal',
    key: withSeal('Packing'),
    code: unitCode,
    name: (m) => `Gland packing set, Ø${unitOf(m).shaft} mm, PTFE, 5 rings`,
    price: (m) => 160 * unitOf(m).factor,
    availability: 'In stock',
    image: ['gland-packing.jpg', 'Five braided PTFE gland packing rings'],
  },
  {
    kind: 'rotokey',
    stem: '62023',
    position: 922,
    group: 'Shaft & seal',
    key: byUnit,
    code: unitCode,
    name: (m) => `Rotokey impeller fastening set, bearing unit ${unitOf(m).unit}`,
    price: (m) => 165 * unitOf(m).factor,
    availability: 'In stock',
    image: ['ahlstar-rotokey.jpg', 'Impeller fastening nut, key and washer laid out'],
  },

  // Bearings: one per bearing unit
  {
    kind: 'bearing-housing',
    stem: '62030',
    position: 330,
    group: 'Bearings',
    key: byUnit,
    code: unitCode,
    name: (m) => `Bearing housing, bearing unit ${unitOf(m).unit}, grey cast iron`,
    price: (m) => 1850 * unitOf(m).factor,
    availability: 'Made to order',
    image: ['ahlstar-bearing-housing.jpg', 'AHLSTAR bearing unit housing, painted'],
  },
  {
    kind: 'ball-bearing',
    stem: '62031',
    position: 321,
    group: 'Bearings',
    key: byUnit,
    code: unitCode,
    name: (m) => `Angular contact ball bearing pair 73${unitOf(m).bearing}, drive end`,
    price: (m) => 240 * unitOf(m).factor,
    availability: 'In stock',
    image: ['ball-bearing.jpg', 'Pair of angular contact ball bearings'],
  },
  {
    kind: 'roller-bearing',
    stem: '62032',
    position: 322,
    group: 'Bearings',
    key: byUnit,
    code: unitCode,
    name: (m) => `Cylindrical roller bearing NU ${unitOf(m).bearing.replace(/^0/, '2')}, pump end`,
    price: (m) => 160 * unitOf(m).factor,
    availability: 'In stock',
    image: ['roller-bearing.jpg', 'Cylindrical roller bearing'],
  },
  {
    kind: 'bearing-cover',
    stem: '62033',
    position: 360,
    group: 'Bearings',
    key: byUnit,
    code: unitCode,
    name: (m) => `Bearing cover, drive end, bearing unit ${unitOf(m).unit}`,
    price: (m) => 230 * unitOf(m).factor,
    availability: 'Fast delivery',
    image: ['ahlstar-bearing-cover.jpg', 'Round cast bearing end cover'],
  },
  {
    kind: 'isolator',
    stem: '62034',
    position: 421,
    group: 'Bearings',
    quantity: 2,
    key: byUnit,
    code: unitCode,
    name: (m) => `Bearing isolator, labyrinth type, Ø${unitOf(m).shaft} mm`,
    price: (m) => 135 * unitOf(m).factor,
    availability: 'In stock',
    image: ['bearing-isolator.jpg', 'Labyrinth bearing isolator ring'],
  },

  // Gaskets & O-rings
  {
    kind: 'casing-gasket',
    stem: '62040',
    position: 400,
    group: 'Gaskets & O-rings',
    key: bySize,
    name: (m) => `Casing gasket, ${size(m)}, aramid fibre`,
    price: (m) => 46 * (m.impeller / 315),
    availability: 'In stock',
    image: ['flat-gasket.jpg', 'Flat round casing gasket'],
  },
  {
    kind: 'o-rings',
    stem: '62041',
    position: 412,
    group: 'Gaskets & O-rings',
    key: byUnit,
    code: unitCode,
    name: (m) => `O-ring set, EPDM, bearing unit ${unitOf(m).unit}`,
    price: (m) => 58 * unitOf(m).factor,
    availability: 'In stock',
    image: ['o-ring-set.jpg', 'Set of black O-rings of different sizes'],
  },

  // Drive: not on the drawing
  {
    kind: 'coupling',
    stem: '62050',
    position: 840,
    group: 'Drive',
    key: byUnit,
    code: unitCode,
    name: (m) => `Flexible spacer coupling, bearing unit ${unitOf(m).unit}`,
    price: (m) => 720 * unitOf(m).factor,
    availability: 'Fast delivery',
    image: ['spacer-coupling.jpg', 'Flexible spacer coupling, two hubs and spacer'],
  },
  {
    kind: 'coupling-guard',
    stem: '62051',
    position: 681,
    group: 'Drive',
    key: byUnit,
    code: unitCode,
    name: (m) => `Coupling guard, EN ISO 14120, bearing unit ${unitOf(m).unit}`,
    price: (m) => 260 * unitOf(m).factor,
    availability: 'Fast delivery',
    image: ['ahlstar-coupling-guard.jpg', 'Perforated steel coupling guard'],
  },

  // Service kits
  {
    kind: 'bearing-kit',
    stem: '62016',
    group: 'Service kits',
    key: byUnit,
    code: unitCode,
    name: (m) => `Bearing kit, bearing unit ${unitOf(m).unit}, drive end and pump end`,
    availability: 'In stock',
    image: ['ahlstar-bearing-kit.jpg', 'Bearing kit laid out: bearings, isolators and O-rings'],
    kit: {
      contains: [
        ['ball-bearing', 1],
        ['roller-bearing', 1],
        ['isolator', 2],
        ['o-rings', 1],
      ],
    },
  },
  {
    kind: 'seal-kit',
    stem: '62017',
    group: 'Service kits',
    key: (m) => `${byUnit(m)} ${m.shaftSeal}`,
    code: (m) =>
      `${unitOf(m).unit}${['Packing', 'Single mechanical seal'].indexOf(m.shaftSeal) + 1}0`,
    name: (m) =>
      m.shaftSeal === 'Packing'
        ? `Gland packing kit, Ø${unitOf(m).shaft} mm, with shaft sleeve`
        : `${m.shaftSeal === 'Double mechanical seal' ? 'Double seal' : 'Mechanical seal'} kit, Ø${unitOf(m).shaft} mm, with shaft sleeve`,
    availability: (m) => (m.shaftSeal === 'Double mechanical seal' ? 'Fast delivery' : 'In stock'),
    image: ['ahlstar-seal-kit.jpg', 'Mechanical seal kit: seal, shaft sleeve and O-rings'],
    kit: {
      contains: [
        ['seal|seal-double|packing', 1],
        ['sleeve', 1],
        ['o-rings', 1],
      ],
    },
  },
  {
    kind: 'wear-kit',
    stem: '62018',
    group: 'Service kits',
    key: bySize,
    name: (m) => `Wear parts kit, ${size(m)}`,
    availability: (m) => (m.casingMaterial === 'Grey cast iron' ? 'In stock' : 'Fast delivery'),
    image: ['ahlstar-wear-parts-kit.jpg', 'Side plate, wear ring and casing gasket laid out'],
    kit: {
      contains: [
        ['side-plate', 1],
        ['wear-ring', 1],
        ['casing-gasket', 1],
      ],
    },
  },
  {
    kind: 'service-kit',
    stem: '62060',
    position: null,
    group: 'Service kits',
    key: bySize,
    name: (m) => `2-year service kit, ${size(m)}`,
    availability: 'In stock',
    image: ['ahlstar-service-kit.jpg', 'Sulzer service kit box with bearings and gaskets'],
    kit: {
      interval: 'Every 2 years or 16 000 h',
      contains: [
        ['ball-bearing', 1],
        ['roller-bearing', 1],
        ['isolator', 2],
        ['o-rings', 1],
        ['casing-gasket', 1],
      ],
    },
  },
  {
    kind: 'overhaul-kit',
    stem: '62061',
    position: null,
    group: 'Service kits',
    key: (m) => `${bySize(m)} ${m.shaftSeal}`,
    name: (m) => `5-year overhaul kit, ${size(m)}`,
    availability: (m) =>
      m.casingMaterial === 'Grey cast iron' ? 'Fast delivery' : 'Made to order',
    image: ['ahlstar-overhaul-kit.jpg', 'Complete overhaul kit laid out on a workbench'],
    kit: {
      interval: 'Every 5 years or 40 000 h',
      contains: [
        ['ball-bearing', 1],
        ['roller-bearing', 1],
        ['isolator', 2],
        ['seal|seal-double|packing', 1],
        ['sleeve', 1],
        ['side-plate', 1],
        ['wear-ring', 1],
        ['rotokey', 1],
        ['casing-gasket', 1],
        ['o-rings', 1],
      ],
    },
  },
]

/* ── XFP ──────────────────────────────────────────────────────────────────── */

/** Price scale of XFP hydraulic and motor parts. */
const xfpHydraulic = (m: ProductModel) => (m.impeller / 330) ** 1.5
const xfpMotor = (m: ProductModel) => (m.power / 22) ** 0.7
/** Seal and bearing size by motor frame. */
const xfpShaft = (m: ProductModel) => (m.power > 10 ? 50 : 35)
const byModel = (m: ProductModel) => m.id

const xfpTemplates: Template[] = [
  {
    kind: 'casing',
    stem: '71501',
    position: 102,
    group: 'Casing & hydraulics',
    key: byModel,
    name: (m) => `Volute, DN${m.connection.discharge}, grey cast iron`,
    price: (m) => 2900 * xfpHydraulic(m),
    availability: 'Fast delivery',
    image: ['xfp-volute.jpg', 'XFP volute casing with discharge flange'],
  },
  {
    kind: 'bottom-plate',
    stem: '71540',
    position: 135,
    group: 'Casing & hydraulics',
    key: byModel,
    name: () => 'Contrablock bottom plate, adjustable, grey cast iron',
    price: (m) => 640 * xfpHydraulic(m),
    availability: 'In stock',
    image: ['xfp-bottom-plate.jpg', 'XFP Contrablock bottom plate with its spiral groove'],
  },
  {
    kind: 'impeller',
    stem: '71510',
    position: 230,
    group: 'Casing & hydraulics',
    key: byModel,
    name: (m) =>
      `Impeller, ${m.impeller < 300 ? 'two' : 'three'}-channel, Ø${m.impeller} mm, grey cast iron`,
    price: (m) => 1850 * xfpHydraulic(m),
    availability: 'Fast delivery',
    image: ['xfp-impeller.jpg', 'XFP closed channel impeller'],
  },
  {
    kind: 'lifting-hoop',
    stem: '71528',
    position: 571,
    group: 'Casing & hydraulics',
    key: byModel,
    name: (m) => `Lifting hoop, stainless steel, for ${m.weight} kg`,
    price: (m) => 190 * xfpMotor(m) ** 0.5,
    availability: 'In stock',
    image: ['xfp-lifting-hoop.jpg', 'Stainless steel lifting hoop'],
  },
  {
    kind: 'lower-seal',
    stem: '71542',
    position: 433,
    group: 'Shaft & seal',
    key: byModel,
    name: (m) => `Mechanical seal, lower, SiC/SiC, Ø${xfpShaft(m)} mm`,
    price: (m) => 620 * xfpMotor(m) ** 0.5,
    availability: 'In stock',
    image: ['xfp-mechanical-seal.jpg', 'Mechanical seal with silicon carbide faces'],
  },
  {
    kind: 'upper-seal',
    stem: '71543',
    position: 434,
    group: 'Shaft & seal',
    key: byModel,
    name: (m) => `Mechanical seal, upper, carbon/SiC, Ø${xfpShaft(m)} mm`,
    price: (m) => 480 * xfpMotor(m) ** 0.5,
    availability: 'In stock',
    image: ['xfp-upper-seal.jpg', 'Small mechanical seal with a carbon face'],
  },
  {
    kind: 'impeller-screw',
    stem: '71523',
    position: 922,
    group: 'Shaft & seal',
    key: byModel,
    name: () => 'Impeller screw set with washer, stainless steel',
    price: () => 48,
    availability: 'In stock',
    image: ['impeller-screw-set.jpg', 'Stainless impeller screw and washer'],
  },
  {
    kind: 'upper-bearing',
    stem: '71531',
    position: 321,
    group: 'Bearings',
    key: byModel,
    name: (m) => `Ball bearing 63${xfpShaft(m) > 40 ? '10' : '07'} 2Z C3, upper`,
    price: (m) => 95 * xfpMotor(m) ** 0.5,
    availability: 'In stock',
    image: ['ball-bearing.jpg', 'Pair of angular contact ball bearings'],
  },
  {
    kind: 'lower-bearing',
    stem: '71532',
    position: 322,
    group: 'Bearings',
    key: byModel,
    name: (m) => `Angular contact ball bearing 32${xfpShaft(m) > 40 ? '10' : '07'}, lower`,
    price: (m) => 210 * xfpMotor(m) ** 0.5,
    availability: 'In stock',
    image: ['roller-bearing.jpg', 'Cylindrical roller bearing'],
  },
  {
    kind: 'volute-gasket',
    stem: '71544',
    position: 400,
    group: 'Gaskets & O-rings',
    key: byModel,
    name: (m) => `Volute gasket, DN${m.connection.discharge}, NBR`,
    price: () => 42,
    availability: 'In stock',
    image: ['flat-gasket.jpg', 'Flat round casing gasket'],
  },
  {
    kind: 'o-rings',
    stem: '71541',
    position: 412,
    group: 'Gaskets & O-rings',
    key: byModel,
    name: () => 'O-ring set, NBR, complete pump',
    price: (m) => 64 * xfpMotor(m) ** 0.3,
    availability: 'In stock',
    image: ['o-ring-set.jpg', 'Set of black O-rings of different sizes'],
  },
  {
    kind: 'oil-plug',
    stem: '71527',
    position: 903,
    group: 'Gaskets & O-rings',
    key: byModel,
    name: () => 'Oil plug with seal ring, stainless steel',
    price: () => 18,
    availability: 'In stock',
    image: ['oil-plug.jpg', 'Stainless steel screw plug with a copper seal ring'],
  },
  {
    kind: 'motor-housing',
    stem: '71511',
    position: 811,
    group: 'Motor & cable',
    key: byModel,
    name: (m) => `Motor housing with stator, ${m.power} kW, 400 V, IE3`,
    price: (m) => 5400 * xfpMotor(m),
    availability: 'Made to order',
    image: [
      'xfp-motor-housing.jpg',
      'XFP motor housing with the stator fitted, cooling fins outside',
    ],
  },
  {
    kind: 'rotor',
    stem: '71512',
    position: 818,
    group: 'Motor & cable',
    key: byModel,
    name: (m) => `Rotor with shaft, ${m.power} kW`,
    price: (m) => 2400 * xfpMotor(m),
    availability: 'Made to order',
    image: ['xfp-rotor.jpg', 'Motor rotor on its shaft'],
  },
  {
    kind: 'moisture-sensor',
    stem: '71526',
    position: 817,
    group: 'Motor & cable',
    key: byModel,
    name: () => 'Moisture sensor (DI), oil chamber',
    price: () => 210,
    availability: 'In stock',
    image: ['moisture-sensor.jpg', 'Small moisture sensor probe with its cable'],
  },
  {
    kind: 'cable',
    stem: '71524',
    position: 824,
    group: 'Motor & cable',
    key: byModel,
    name: (m) => `Power cable, 10 m, ${m.power > 10 ? '4G6' : '4G2.5'} + 2×1.5 mm², EMC screened`,
    price: (m) => 380 * xfpMotor(m) ** 0.5,
    availability: 'Fast delivery',
    image: ['power-cable.jpg', 'Coiled black rubber power cable'],
  },
  {
    kind: 'cable-entry',
    stem: '71525',
    position: 826,
    group: 'Motor & cable',
    key: byModel,
    name: () => 'Cable entry kit, sealed, with strain relief',
    price: () => 145,
    availability: 'In stock',
    image: ['cable-entry-kit.jpg', 'Cable gland, grommet and strain relief laid out'],
  },
  {
    kind: 'seal-kit',
    stem: '71545',
    group: 'Service kits',
    key: byModel,
    name: () => 'Seal kit, upper and lower mechanical seals',
    availability: 'In stock',
    image: ['xfp-seal-kit.jpg', 'Seal kit: two mechanical seals, O-rings and oil plug'],
    kit: {
      contains: [
        ['lower-seal', 1],
        ['upper-seal', 1],
        ['o-rings', 1],
        ['oil-plug', 1],
      ],
    },
  },
  {
    kind: 'bearing-kit',
    stem: '71546',
    group: 'Service kits',
    key: byModel,
    name: () => 'Bearing kit, upper and lower bearings',
    availability: 'In stock',
    image: ['xfp-bearing-kit.jpg', 'Bearing kit: two bearings and O-rings'],
    kit: {
      contains: [
        ['upper-bearing', 1],
        ['lower-bearing', 1],
        ['o-rings', 1],
      ],
    },
  },
  {
    kind: 'wear-kit',
    stem: '71547',
    group: 'Service kits',
    key: byModel,
    name: () => 'Wear parts kit, Contrablock',
    availability: 'In stock',
    image: ['xfp-wear-parts-kit.jpg', 'Contrablock bottom plate, gasket and impeller screw'],
    kit: {
      contains: [
        ['bottom-plate', 1],
        ['volute-gasket', 1],
        ['impeller-screw', 1],
      ],
    },
  },
  {
    kind: 'service-kit',
    stem: '71560',
    position: null,
    group: 'Service kits',
    key: byModel,
    name: () => '2-year service kit',
    availability: 'In stock',
    image: ['xfp-service-kit.jpg', 'Sulzer service kit box with O-rings and gaskets'],
    kit: {
      interval: 'Every 2 years or 8 000 h',
      contains: [
        ['o-rings', 1],
        ['oil-plug', 1],
        ['volute-gasket', 1],
        ['impeller-screw', 1],
      ],
    },
  },
  {
    kind: 'overhaul-kit',
    stem: '71561',
    position: null,
    group: 'Service kits',
    key: byModel,
    name: () => '5-year overhaul kit',
    availability: 'Fast delivery',
    image: ['xfp-overhaul-kit.jpg', 'Complete overhaul kit laid out on a workbench'],
    kit: {
      interval: 'Every 5 years or 20 000 h',
      contains: [
        ['lower-seal', 1],
        ['upper-seal', 1],
        ['upper-bearing', 1],
        ['lower-bearing', 1],
        ['bottom-plate', 1],
        ['volute-gasket', 1],
        ['impeller-screw', 1],
        ['cable-entry', 1],
        ['o-rings', 1],
        ['oil-plug', 1],
      ],
    },
  },
]

const templates: Record<string, Template[]> = { ahlstar: ahlstarTemplates, xfp: xfpTemplates }

/* ── Build ────────────────────────────────────────────────────────────────── */

type Built = { part: SparePart; kind: string }

function buildParts(productId: string, list: Template[]): Built[] {
  const models = productModels.filter((m) => m.productId === productId)
  const built: Built[] = []
  /** The part of one of `kinds` that fits `model`, built earlier (kits come last). */
  const partFor = (kinds: string, model: ProductModel) =>
    built.find((b) => kinds.split('|').includes(b.kind) && b.part.modelIds.includes(model.id))!.part

  for (const template of list) {
    const groups = new Map<string, ProductModel[]>()
    for (const model of models) {
      const key = template.key(model)
      if (key !== null) groups.set(key, [...(groups.get(key) ?? []), model])
    }
    for (const fits of groups.values()) {
      const first = fits[0]
      const partNumber = template.stem + (template.code?.(first) ?? first.productNumber.slice(-3))
      const contains: KitItem[] | undefined = template.kit?.contains.map(([kinds, quantity]) => ({
        partId: partFor(kinds, first).id,
        quantity,
      }))
      const listPrice = contains
        ? round(
            contains.reduce((sum, item) => {
              const part = built.find((b) => b.part.id === item.partId)!.part
              return sum + part.listPrice * item.quantity
            }, 0) *
              (1 - kitSaving),
          )
        : round(template.price!(first))
      const position =
        template.position === null
          ? undefined
          : (template.position ??
            (contains && built.find((b) => b.part.id === contains[0].partId)!.part.position))
      const [file, shows] = template.image
      built.push({
        kind: template.kind,
        part: {
          id: partNumber,
          partNumber,
          name: template.name(first),
          productId,
          modelIds: fits.map((m) => m.id),
          group: template.group,
          ...(position !== undefined ? { position } : {}),
          quantity: template.quantity ?? 1,
          listPrice,
          availability:
            typeof template.availability === 'function'
              ? template.availability(first)
              : template.availability,
          image: { src: `/images/spare-parts/parts/${file}`, alt: shows },
          ...(contains ? { contains } : {}),
          ...(template.kit?.interval ? { interval: template.kit.interval } : {}),
        },
      })
    }
  }
  return built
}

const built = Object.entries(templates).flatMap(([productId, list]) =>
  buildParts(productId, list).map((b) => ({ ...b, productId })),
)

export const spareParts: SparePart[] = built.map((b) => b.part)

/** The part of a kind (a template `kind`, e.g. "service-kit") that fits a model, if any. */
export const findPartOfKind = (modelId: string, kind: string) =>
  built.find((b) => b.kind === kind && b.part.modelIds.includes(modelId))?.part

/**
 * Like `findPartOfKind`, for seed data (orders, quotations, findings) that names parts by
 * what they are, not by number. Throws if the model has no such part.
 */
export function partOfKind(modelId: string, kind: string) {
  const part = findPartOfKind(modelId, kind)
  if (!part) throw new Error(`No ${kind} for ${modelId}`)
  return part
}
