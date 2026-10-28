import type { SparePart } from '../types'

/* Genuine spare parts per product. Positions match the sectional drawing. */

export const spareParts: SparePart[] = [
  {
    id: 'sp-1001',
    partNumber: '62010315',
    name: 'Impeller, Ø315 mm, duplex stainless steel',
    productId: 'end-suction-pump',
    group: 'Wear parts',
    position: 230,
    availability: 'in-stock',
  },
  {
    id: 'sp-1002',
    partNumber: '62014420',
    name: 'Mechanical seal set, SiC/SiC, EPDM',
    productId: 'end-suction-pump',
    group: 'Seals',
    position: 433,
    availability: 'in-stock',
  },
  {
    id: 'sp-1003',
    partNumber: '62016308',
    name: 'Bearing kit, drive end and non-drive end',
    productId: 'end-suction-pump',
    group: 'Bearings',
    position: 321,
    availability: 'on-request',
  },
  {
    id: 'sp-2001',
    partNumber: '71540150',
    name: 'Contrablock wear plate',
    productId: 'submersible-wastewater-pump',
    group: 'Wear parts',
    position: 135,
    availability: 'in-stock',
  },
  {
    id: 'sp-2002',
    partNumber: '71542233',
    name: 'Seal kit, upper and lower mechanical seals',
    productId: 'submersible-wastewater-pump',
    group: 'Seals',
    position: 433,
    availability: 'in-stock',
  },
]
