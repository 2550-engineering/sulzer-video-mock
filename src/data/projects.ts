import { demoUser } from '../config/demo'
import { sizePumps } from '../lib/sizing'
import { matchingConfigurations, sizingSelection } from '../lib/sizingFilters'
import { configurationsForProduct } from '../lib/variants'
import type { DutyPoint, Project, ProjectItem, SizingRecord } from '../types'

/*
 * The demo user's projects ("/my-projects"), seeding the projects context.
 * Each item is the best sizing result for its duty point, so it always matches
 * the current hydraulic data. Names, numbers, people and dates are invented:
 * see docs/content-to-confirm.md.
 */

function sizedItem(
  id: string,
  position: number,
  customerPosition: string,
  flow: number,
  head: number,
  quantity = 1,
): ProjectItem {
  const dutyPoint: DutyPoint = { flow, head, liquid: 'water', temperature: 20, frequency: 50 }
  const best = sizePumps(dutyPoint).results[0]
  return { id, position, customerPosition, variantId: best.variant.id, dutyPoint, quantity }
}

const riversideItem = sizedItem('riverside-intake-10', 10, 'RW-01/02', 220, 38, 2)

/** Riverside intake's first sizing, the one position 10 came from. */
const riversideSizing: SizingRecord = {
  id: 'riverside-intake-s1',
  name: 'Surface water intake – 220 m³/h @ 38 m',
  created: '14 Oct 2026',
  createdBy: demoUser.name,
  params: [
    ['product', 'ahlstar'],
    ['q', '220'],
    ['h', '38'],
    ['liquid', 'water'],
    ['temp', '20'],
    ['application', 'surface-water-intake'],
  ],
  dutyPoint: riversideItem.dutyPoint,
  productId: 'ahlstar',
  applicationId: 'surface-water-intake',
  variantIds: [riversideItem.variantId],
  hits: matchingConfigurations(
    configurationsForProduct('ahlstar'),
    sizingSelection(new URLSearchParams('application=surface-water-intake')),
    20,
  ).length,
  includeCurves: true,
}

const client = (site: string) => ({
  company: demoUser.company,
  contact: demoUser.name,
  site,
  email: demoUser.email,
})

const owner = { name: demoUser.name, role: 'Owner' }

export const projects: Project[] = [
  {
    id: 'riverside-intake',
    refNo: 'P-2026-0318',
    projectNumber: '396088',
    name: 'Riverside intake',
    applicationId: 'surface-water-intake',
    status: 'Draft',
    created: '14 Oct 2026',
    createdBy: demoUser.name,
    lastModified: 'Today, 07:58',
    lastModifiedBy: 'Johan Berg',
    modifiedOrder: 3,
    deadline: '15 Dec 2026',
    members: [
      owner,
      { name: 'Johan Berg', role: 'Process engineer' },
      { name: 'Sara Nyström', role: 'Purchasing' },
      { name: 'Mikael Ahonen', role: 'Application engineer, Sulzer' },
    ],
    client: client('Riverside intake, Västerås'),
    items: [
      { ...riversideItem, sizingId: riversideSizing.id },
      sizedItem('riverside-intake-20', 20, 'FW-01', 40, 30),
    ],
    sizings: [riversideSizing],
  },
  {
    id: 'north-ps-upgrade',
    refNo: 'P-2026-0291',
    projectNumber: '395412',
    name: 'North pump station upgrade',
    applicationId: 'wastewater',
    status: 'Quoted',
    created: '2 Sep 2026',
    createdBy: demoUser.name,
    lastModified: '21 Oct 2026',
    lastModifiedBy: demoUser.name,
    modifiedOrder: 2,
    deadline: '30 Nov 2026',
    members: [owner, { name: 'Lars Holm', role: 'Site manager' }],
    client: client('North pump station, Västerås'),
    items: [sizedItem('north-ps-upgrade-10', 10, 'NP-01', 500, 25, 2)],
    sizings: [],
  },
  {
    id: 'harbour-booster',
    refNo: 'P-2026-0274',
    projectNumber: '394987',
    name: 'Harbour district booster station',
    applicationId: 'water-distribution',
    status: 'Draft',
    created: '9 Oct 2026',
    createdBy: demoUser.name,
    lastModified: '14 Oct 2026',
    lastModifiedBy: demoUser.name,
    modifiedOrder: 1,
    members: [owner],
    client: client('Harbour district, Västerås'),
    items: [sizedItem('harbour-booster-10', 10, 'HB-01', 150, 55, 3)],
    sizings: [],
  },
]
