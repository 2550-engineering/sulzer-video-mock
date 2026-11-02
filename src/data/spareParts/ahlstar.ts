import { shipsIn, weeks } from '../../lib/availability'
import { namedKit, partOf, serviceKit, type PartInput } from '../../lib/sparePartsData'
import type { PartGroup, ProductModel, SparePartCatalogue } from '../../types'
import { ahlstarModels } from '../models/ahlstar'

/*
 * Spare parts of the AHLSTAR end-suction pump (back pull-out design), one
 * parts list per model. Position numbers follow the usual pump nomenclature
 * (102 volute casing, 230 impeller, 321 bearing …). Parts that depend on the
 * size (casing, impeller, wear rings, casing cover, gasket, coupling) and on the
 * motor get the model's own part numbers and prices; the bearing unit and
 * small parts are shared. Every number and price is invented, sized for
 * AHLSTAR 100-80-250 and scaled for the others.
 */

const groups: PartGroup[] = [
  { id: 'hydraulics', name: 'Hydraulics' },
  { id: 'shaft-sealing', name: 'Shaft and sealing' },
  { id: 'bearing-unit', name: 'Bearing unit' },
  { id: 'drive', name: 'Drive' },
  { id: 'base-fixing', name: 'Base and fixing' },
  { id: 'o-rings-gaskets', name: 'O-rings and gaskets' },
  { id: 'plugs', name: 'Plugs' },
]

const inStock = shipsIn(2)

const casingMaterials: Record<ProductModel['casingMaterial'], string> = {
  'Grey cast iron': 'Grey cast iron EN-GJL-250',
  'Ductile iron': 'Ductile iron EN-GJS-400-15',
  'Duplex stainless steel': 'Duplex stainless steel 1.4470',
}

/** Size codes 01, 02 … in order of first appearance; 50 and 60 Hz models of a size share them. */
const sizes = [...new Set(ahlstarModels.map((m) => m.name))]
const sizeCode = (model: ProductModel) => String(sizes.indexOf(model.name) + 1).padStart(2, '0')

/** Price of a size-dependent part: the 100-80-250 price, scaled by impeller and discharge size. */
const scaled = (base: number, model: ProductModel) =>
  Math.round(
    base * (model.impeller / 250) ** 1.6 * ((model.connection.discharge + 20) / 100) ** 0.4,
  )

function partsFor(model: ProductModel): PartInput[] {
  const code = sizeCode(model)
  /** Size-dependent part number: 62 + position digits + size code. */
  const sized = (position: string) => `62${position.replace('.', '')}${code}`.padEnd(8, '0')
  const casing = casingMaterials[model.casingMaterial]
  const duplex = model.casingMaterial === 'Duplex stainless steel'
  const poles = model.speed > 2000 ? 2 : 4
  const motorKw = model.power % 1 ? model.power.toFixed(1) : String(model.power)
  const seal =
    model.shaftSeal === 'Packing'
      ? {
          position: '461',
          name: 'Gland packing set, 5 rings',
          material: 'PTFE-impregnated aramid',
          listPrice: 96,
        }
      : model.shaftSeal === 'Double mechanical seal'
        ? {
            position: '433',
            name: 'Mechanical seal, double cartridge',
            material: 'SiC/SiC and carbon/SiC, FKM',
            listPrice: 1480,
          }
        : {
            position: '433',
            name: 'Mechanical seal, single, balanced',
            material: 'Carbon/SiC, EPDM',
            listPrice: 545,
          }

  return [
    // Hydraulics
    {
      position: '102',
      name: `Volute casing, DN ${model.connection.suction} / DN ${model.connection.discharge}`,
      partNumber: sized('102'),
      quantity: 1,
      groupId: 'hydraulics',
      material: casing,
      listPrice: scaled(2680, model),
      availability: weeks(6, 8),
      hotspot: 'volute-casing',
    },
    {
      position: '230',
      name: `Impeller, closed, Ø${model.impeller}`,
      partNumber: sized('230'),
      quantity: 1,
      groupId: 'hydraulics',
      material: duplex ? 'Duplex stainless steel 1.4470' : 'Grey cast iron EN-GJL-250',
      listPrice: scaled(1240, model),
      availability: weeks(2, 3),
      hotspot: 'impeller',
    },
    {
      position: '922',
      name: 'Impeller nut, M24, self-locking',
      partNumber: '62092224',
      quantity: 1,
      groupId: 'hydraulics',
      material: 'Stainless steel A4',
      listPrice: 38,
      availability: inStock,
      recommendedAfter: 2,
      hotspot: 'impeller-nut',
    },
    {
      position: '502.1',
      name: 'Wear ring, front (suction side)',
      partNumber: sized('502.1'),
      quantity: 1,
      groupId: 'hydraulics',
      material: duplex ? 'Duplex stainless steel 1.4462' : 'Bronze CuSn10',
      listPrice: scaled(168, model),
      availability: inStock,
      recommendedAfter: 2,
      hotspot: 'wear-ring-front',
    },
    {
      position: '502.2',
      name: 'Wear ring, back (casing cover)',
      partNumber: sized('502.2'),
      quantity: 1,
      groupId: 'hydraulics',
      material: duplex ? 'Duplex stainless steel 1.4462' : 'Bronze CuSn10',
      listPrice: scaled(154, model),
      availability: inStock,
      recommendedAfter: 2,
      hotspot: 'wear-ring-back',
    },
    {
      position: '161',
      name: 'Casing cover',
      partNumber: sized('161'),
      quantity: 1,
      groupId: 'hydraulics',
      material: casing,
      listPrice: scaled(1120, model),
      availability: weeks(4, 6),
      hotspot: 'casing-cover',
    },

    // Shaft and sealing
    {
      position: '210',
      name: 'Shaft',
      partNumber: '62021045',
      quantity: 1,
      groupId: 'shaft-sealing',
      material: 'Stainless steel 1.4021',
      listPrice: 760,
      availability: weeks(2, 3),
      hotspot: 'shaft',
    },
    {
      position: '524',
      name: 'Shaft sleeve',
      partNumber: '62052445',
      quantity: 1,
      groupId: 'shaft-sealing',
      material: 'Stainless steel 1.4462, hard-faced',
      listPrice: 236,
      availability: inStock,
      recommendedAfter: 5,
      hotspot: 'shaft-sleeve',
    },
    {
      ...seal,
      partNumber: `620${seal.position}4${model.shaftSeal === 'Double mechanical seal' ? '2' : '1'}`,
      quantity: 1,
      groupId: 'shaft-sealing',
      availability: model.shaftSeal === 'Double mechanical seal' ? weeks(2, 3) : inStock,
      recommendedAfter: 5,
      hotspot: 'mechanical-seal',
    },
    {
      position: '471',
      name: 'Seal cover',
      partNumber: '62047145',
      quantity: 1,
      groupId: 'shaft-sealing',
      material: 'Stainless steel 1.4408',
      listPrice: 312,
      availability: weeks(2, 3),
      hotspot: 'seal-cover',
    },
    {
      position: '456',
      name: 'Throttle bushing',
      partNumber: '62045645',
      quantity: 1,
      groupId: 'shaft-sealing',
      material: 'Carbon-filled PTFE',
      listPrice: 88,
      availability: inStock,
      recommendedAfter: 5,
      hotspot: 'throttle-bushing',
    },

    // Bearing unit
    {
      position: '330',
      name: 'Bearing housing',
      partNumber: '62033045',
      quantity: 1,
      groupId: 'bearing-unit',
      material: 'Grey cast iron EN-GJL-250',
      listPrice: 1460,
      availability: weeks(4, 6),
      hotspot: 'bearing-housing',
    },
    {
      position: '321.1',
      name: 'Inboard bearing, deep groove ball bearing 6309-C3',
      partNumber: '62032109',
      quantity: 1,
      groupId: 'bearing-unit',
      material: 'Bearing steel',
      listPrice: 64,
      availability: inStock,
      recommendedAfter: 5,
      hotspot: 'bearing-inboard',
    },
    {
      position: '321.2',
      name: 'Outboard bearing, angular contact ball bearing pair 7309-BECBM',
      partNumber: '62032209',
      quantity: 1,
      groupId: 'bearing-unit',
      material: 'Bearing steel, brass cage',
      listPrice: 248,
      availability: inStock,
      recommendedAfter: 5,
      hotspot: 'bearing-outboard',
    },
    {
      position: '360.1',
      name: 'Bearing cover, inboard',
      partNumber: '62036145',
      quantity: 1,
      groupId: 'bearing-unit',
      material: 'Grey cast iron EN-GJL-250',
      listPrice: 142,
      availability: weeks(2, 3),
      hotspot: 'bearing-cover-inboard',
    },
    {
      position: '360.2',
      name: 'Bearing cover, outboard',
      partNumber: '62036245',
      quantity: 1,
      groupId: 'bearing-unit',
      material: 'Grey cast iron EN-GJL-250',
      listPrice: 138,
      availability: weeks(2, 3),
      hotspot: 'bearing-cover-outboard',
    },
    {
      position: '421.1',
      name: 'Oil seal, inboard, 45×62×8',
      partNumber: '62042145',
      quantity: 1,
      groupId: 'bearing-unit',
      material: 'FKM',
      listPrice: 18.5,
      availability: inStock,
      recommendedAfter: 2,
      hotspot: 'oil-seal-inboard',
    },
    {
      position: '421.2',
      name: 'Oil seal, outboard, 40×55×7',
      partNumber: '62042240',
      quantity: 1,
      groupId: 'bearing-unit',
      material: 'FKM',
      listPrice: 16.9,
      availability: inStock,
      recommendedAfter: 2,
      hotspot: 'oil-seal-outboard',
    },
    {
      position: '638',
      name: 'Oil level indicator, constant level oiler',
      partNumber: '62063801',
      quantity: 1,
      groupId: 'bearing-unit',
      material: 'Aluminium, glass',
      listPrice: 74,
      availability: inStock,
      hotspot: 'oil-level',
    },

    // Drive
    {
      position: '840',
      name: 'Coupling, flexible with spacer',
      partNumber: sized('840'),
      quantity: 1,
      groupId: 'drive',
      material: 'Grey cast iron, NBR element',
      listPrice: scaled(420, model),
      availability: weeks(2, 3),
      hotspot: 'coupling',
    },
    {
      position: '681',
      name: 'Coupling guard',
      partNumber: '62068145',
      quantity: 1,
      groupId: 'drive',
      material: 'Steel, powder-coated',
      listPrice: 186,
      availability: weeks(2, 3),
      hotspot: 'coupling-guard',
    },
    {
      position: '800',
      name: `Motor, ${motorKw} kW, ${poles}-pole, ${model.frequency} Hz, IE3`,
      partNumber: `6280${String(Math.round(model.power * 10)).padStart(4, '0')}`,
      quantity: 1,
      groupId: 'drive',
      material: 'Cast iron frame, IP55',
      listPrice: Math.round(900 + 128 * model.power),
      availability: model.power > 30 ? weeks(6, 8) : weeks(2, 3),
      hotspot: 'motor',
    },

    // Base and fixing
    {
      position: '890',
      name: 'Base plate',
      partNumber: sized('890'),
      quantity: 1,
      groupId: 'base-fixing',
      material: 'Steel S235, epoxy-painted',
      listPrice: scaled(980, model),
      availability: weeks(4, 6),
      hotspot: 'base-plate',
    },
    {
      position: '183',
      name: 'Support foot',
      partNumber: '62018345',
      quantity: 1,
      groupId: 'base-fixing',
      material: 'Grey cast iron EN-GJL-250',
      listPrice: 164,
      availability: weeks(2, 3),
      hotspot: 'support-foot',
    },
    {
      position: '901',
      name: 'Hexagon screw, M16×60, casing cover',
      partNumber: '62090116',
      quantity: 12,
      groupId: 'base-fixing',
      material: 'Steel 8.8, zinc-plated',
      listPrice: 2.4,
      availability: inStock,
      hotspot: 'screws',
    },
    {
      position: '920',
      name: 'Hexagon nut, M16',
      partNumber: '62092016',
      quantity: 12,
      groupId: 'base-fixing',
      material: 'Steel 8, zinc-plated',
      listPrice: 0.8,
      availability: inStock,
      hotspot: 'nuts',
    },

    // O-rings and gaskets
    {
      position: '400',
      name: 'Casing gasket',
      partNumber: sized('400'),
      quantity: 1,
      groupId: 'o-rings-gaskets',
      material: 'Aramid fibre, NBR-bonded',
      listPrice: scaled(42, model),
      availability: inStock,
      recommendedAfter: 2,
      hotspot: 'casing-gasket',
    },
    {
      position: '412.1',
      name: 'O-ring, 45×3, shaft sleeve',
      partNumber: '62041245',
      quantity: 1,
      groupId: 'o-rings-gaskets',
      material: 'EPDM',
      listPrice: 6.4,
      availability: inStock,
      recommendedAfter: 2,
      hotspot: 'o-ring-sleeve',
    },
    {
      position: '412.2',
      name: 'O-ring, 135×4, seal cover',
      partNumber: '62041235',
      quantity: 1,
      groupId: 'o-rings-gaskets',
      material: 'EPDM',
      listPrice: 9.8,
      availability: inStock,
      recommendedAfter: 2,
      hotspot: 'o-ring-seal-cover',
    },

    // Plugs
    {
      position: '903.1',
      name: 'Drain plug, G 1/2, with sealing ring',
      partNumber: '62090312',
      quantity: 1,
      groupId: 'plugs',
      material: 'Stainless steel 1.4401',
      listPrice: 12.6,
      availability: inStock,
      hotspot: 'drain-plug',
    },
    {
      position: '903.2',
      name: 'Vent plug, G 3/8, with sealing ring',
      partNumber: '62090338',
      quantity: 1,
      groupId: 'plugs',
      material: 'Stainless steel 1.4401',
      listPrice: 10.4,
      availability: inStock,
      hotspot: 'vent-plug',
    },
  ]
}

function catalogueFor(model: ProductModel): SparePartCatalogue {
  const id = model.id
  const parts = partsFor(model).map(partOf(id))
  const code = sizeCode(model)
  // Gland packing models have the packing at 461 instead of the seal at 433.
  const seal = model.shaftSeal === 'Packing' ? '461' : '433'
  const kit = (slug: string, name: string, number: string, positions: string[]) =>
    namedKit(id, parts, slug, name, `6299${code}${number}`, positions)
  return {
    id,
    productId: model.productId,
    forIds: [model.id],
    drawingId: 'ga-ahlstar-01',
    groups,
    parts,
    kits: [
      serviceKit(id, parts, 2, `6299${code}02`),
      serviceKit(id, parts, 5, `6299${code}05`),
      kit('impeller', 'Kit, impeller', '23', ['230', '922', '502.1', '502.2']),
      kit('bearings', 'Kit, bearings', '32', ['321.1', '321.2', '421.1', '421.2']),
      kit('seal', 'Kit, shaft seal', '43', [seal, '412.1', '412.2', '524']),
      kit('gaskets', 'Kit, gaskets and O-rings', '40', ['400', '412.1', '412.2']),
      kit('overhaul', 'Kit, overhaul', '99', [
        '922',
        '502.1',
        '502.2',
        seal,
        '412.1',
        '412.2',
        '524',
        '456',
        '321.1',
        '321.2',
        '421.1',
        '421.2',
        '400',
      ]),
      kit('plugs', 'Kit, plugs', '90', ['903.1', '903.2']),
    ],
    featured: [
      { kind: 'part', id: `${id}-230` },
      ...['impeller', 'bearings', 'seal', 'overhaul', 'plugs'].map((slug) => ({
        kind: 'kit' as const,
        id: `${id}-kit-${slug}`,
      })),
    ],
    versions: [{ id: 'current', label: 'Current production', productionCode: {}, changes: {} }],
  }
}

/** One parts list per AHLSTAR model, in Models tab order. */
export const ahlstarSpareParts = ahlstarModels.map(catalogueFor)
