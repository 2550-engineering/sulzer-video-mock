import { consultantUser, demoUser } from '../config/demo'
import { sizePumps } from '../lib/sizing'
import { matchingConfigurations, sizingSelection } from '../lib/sizingFilters'
import { configurationsForProduct, getVariant } from '../lib/variants'
import type {
  DutyPoint,
  PersonaId,
  Project,
  ProjectAccess,
  ProjectItem,
  ProjectMember,
  SizingRecord,
  User,
} from '../types'

/*
 * Seed projects per persona ("/my-projects"), for the projects context. Each
 * item is the best sizing result for its duty point, so it always matches the
 * current hydraulic data. Names, companies, numbers, people, comments and
 * dates are invented: see docs/content-to-confirm.md.
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

/** The runner-up sizing result for an item's duty point: alternative B in a comparison. */
function runnerUp(item: ProjectItem, id: string, position: number): ProjectItem {
  const second = sizePumps(item.dutyPoint).results[1]
  return { ...item, id, position, variantId: second.variant.id }
}

/** "AHLSTAR A25-200-400/390 C1-SD-4P-F", for activity entries. */
const productName = (item: ProjectItem) => getVariant(item.variantId)?.name ?? item.variantId

const riversideItem = sizedItem('riverside-intake-10', 10, 'RW-01/02', 220, 38, 2)

/** A saved "Surface water intake" sizing for an item: the one the item came from. */
const intakeSizing = (
  id: string,
  item: ProjectItem,
  created: string,
  createdBy: string,
): SizingRecord => ({
  id,
  name: `Surface water intake – ${item.dutyPoint.flow} m³/h @ ${item.dutyPoint.head} m`,
  created,
  createdBy,
  params: [
    ['product', 'ahlstar'],
    ['q', String(item.dutyPoint.flow)],
    ['h', String(item.dutyPoint.head)],
    ['liquid', 'water'],
    ['temp', '20'],
    ['application', 'surface-water-intake'],
  ],
  dutyPoint: item.dutyPoint,
  productId: 'ahlstar',
  applicationId: 'surface-water-intake',
  variantIds: [item.variantId],
  hits: matchingConfigurations(
    configurationsForProduct('ahlstar'),
    sizingSelection(new URLSearchParams('application=surface-water-intake')),
    20,
  ).length,
  includeCurves: true,
})

const riversideSizing = intakeSizing(
  'riverside-intake-s1',
  riversideItem,
  '14 Oct 2026',
  demoUser.name,
)

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

/** A project member; ids are the name in lower case with dashes ("anna-berg"). */
function member(
  name: string,
  company: string,
  role: string,
  email: string,
  access: ProjectAccess = 'editor',
): ProjectMember {
  const id = name.toLowerCase().replace(/[^a-z]+/g, '-')
  return { id, name, initials: initials(name), email, company, role, access, status: 'active' }
}

/** A signed-in persona as the owner of their projects. */
const ownerOf = (user: User) => member(user.name, user.company, user.role, user.email, 'owner')

// ── End user (Emma Lindqvist, Nordvatten Utilities) ─────────────────────────

const emma = ownerOf(demoUser)
const nordvatten = (site: string) => ({
  company: demoUser.company,
  contact: demoUser.name,
  site,
  email: demoUser.email,
})
const sulzerAe = member(
  'Mikael Ahonen',
  'Sulzer',
  'Application engineer, Sulzer',
  'mikael.ahonen@sulzer.example',
)

const endUserProjects: Project[] = [
  {
    id: 'riverside-intake',
    refNo: 'P-2026-0318',
    projectNumber: '396088',
    name: 'Riverside intake',
    applicationId: 'surface-water-intake',
    status: 'Concept design',
    created: '14 Oct 2026',
    createdBy: demoUser.name,
    lastModified: 'Today, 07:58',
    lastModifiedBy: 'Johan Berg',
    modifiedOrder: 3,
    deadline: '15 Dec 2026',
    members: [
      emma,
      member('Johan Berg', demoUser.company, 'Process engineer', 'johan.berg@nordvatten.example'),
      member('Sara Nyström', demoUser.company, 'Purchasing', 'sara.nystrom@nordvatten.example'),
      sulzerAe,
    ],
    client: nordvatten('Riverside intake, Västerås'),
    items: [
      { ...riversideItem, sizingId: riversideSizing.id },
      sizedItem('riverside-intake-20', 20, 'FW-01', 40, 30),
    ],
    sizings: [riversideSizing],
    comments: [],
    activity: [],
    documents: [],
  },
  {
    id: 'north-ps-upgrade',
    refNo: 'P-2026-0291',
    projectNumber: '395412',
    name: 'North pump station upgrade',
    applicationId: 'wastewater',
    status: 'Tender',
    created: '2 Sep 2026',
    createdBy: demoUser.name,
    lastModified: '21 Oct 2026',
    lastModifiedBy: demoUser.name,
    modifiedOrder: 2,
    deadline: '30 Nov 2026',
    members: [
      emma,
      member('Lars Holm', demoUser.company, 'Site manager', 'lars.holm@nordvatten.example'),
    ],
    client: nordvatten('North pump station, Västerås'),
    items: [sizedItem('north-ps-upgrade-10', 10, 'NP-01', 500, 25, 2)],
    sizings: [],
    comments: [],
    activity: [],
    documents: [],
  },
  {
    id: 'harbour-booster',
    refNo: 'P-2026-0274',
    projectNumber: '394987',
    name: 'Harbour district booster station',
    applicationId: 'water-distribution',
    status: 'Concept design',
    created: '9 Oct 2026',
    createdBy: demoUser.name,
    lastModified: '14 Oct 2026',
    lastModifiedBy: demoUser.name,
    modifiedOrder: 1,
    members: [emma],
    client: nordvatten('Harbour district, Västerås'),
    items: [sizedItem('harbour-booster-10', 10, 'HB-01', 150, 55, 3)],
    sizings: [],
    comments: [],
    activity: [],
    documents: [],
  },
]

// ── Consultant (Anna Berg, Nordic Water Consulting) ─────────────────────────

const anna = ownerOf(consultantUser)
const erik = member(
  'Erik Sandberg',
  consultantUser.company,
  'Electrical Engineer',
  'erik.sandberg@nordicwater.example',
)

/** The client of the consultant's projects: a fictional municipal water utility. */
const alvstad = (site: string) => ({
  company: 'Älvstad Vatten AB',
  contact: 'Maria Lund',
  address: 'Hamngatan 4, 652 24 Älvstad',
  site,
  email: 'maria.lund@alvstadvatten.example',
})

const maria = member(
  'Maria Lund',
  'Älvstad Vatten AB',
  'Project manager, client',
  'maria.lund@alvstadvatten.example',
  'viewer',
)

const rawWaterItem = sizedItem('riverside-raw-water-10', 10, 'RW-P1/P2', 220, 38, 2)
const rawWaterSizing = intakeSizing('riverside-raw-water-s1', rawWaterItem, '3 Oct 2026', anna.name)
/** Alternatives A and B for the intake pumps, saved from the compare page; A is chosen. */
const rawWaterAlternatives: ProjectItem[] = [
  { ...rawWaterItem, sizingId: rawWaterSizing.id, alternative: 'A', preferred: true },
  {
    ...runnerUp(rawWaterItem, 'riverside-raw-water-20', 20),
    sizingId: rawWaterSizing.id,
    alternative: 'B',
  },
].map((item): ProjectItem => ({
  ...item,
  alternativeGroup: 'riverside-raw-water-g1',
  status: item.preferred ? 'For review' : 'Proposed',
}))
const backwashItem = sizedItem('riverside-raw-water-30', 30, 'FW-P1', 150, 55)

const consultantProjects: Project[] = [
  {
    id: 'riverside-raw-water',
    refNo: 'P-2026-0412',
    projectNumber: '397140',
    name: 'Riverside raw water intake upgrade',
    applicationId: 'surface-water-intake',
    status: 'Concept design',
    created: '2 Oct 2026',
    createdBy: anna.name,
    lastModified: 'Today, 08:42',
    lastModifiedBy: erik.name,
    modifiedOrder: 3,
    deadline: '20 Jan 2027',
    members: [anna, erik, sulzerAe, maria],
    client: alvstad('Riverside raw water intake, Älvstad'),
    description:
      'Replacement of the two raw water intake pumps at the Riverside intake, with variable speed drives, new suction pipework and a backwash pump for the new filter line. Design for operation down to the lowest regulated river level.',
    consultantFirm: consultantUser.company,
    budget: 420000,
    requirements: [
      'Raw water: 2 × 220 m³/h at 38 m, duty/assist, river water 2–20 °C',
      'Filter backwash: 150 m³/h at 55 m',
      'NPSH margin of at least 1.0 m at the lowest river level',
      'Motors IE3 or better, suitable for variable speed drives',
      'Flanges to EN 1092-1, PN 16',
      'Acceptance test to ISO 9906, grade 2B',
    ],
    share: { access: 'project', memberIds: [], clientReadOnly: false },
    items: [...rawWaterAlternatives, { ...backwashItem, status: 'Proposed' }],
    sizings: [rawWaterSizing],
    comments: [
      {
        id: 'riverside-raw-water-c1',
        authorId: sulzerAe.id,
        at: 'Yesterday, 15:10',
        itemId: 'riverside-raw-water-10',
        text: 'I checked both duty points against the lowest river level. The intake pumps stay in the recommended operating range, also with 1.5 m extra suction lift.',
      },
      {
        id: 'riverside-raw-water-c2',
        authorId: erik.id,
        at: 'Yesterday, 16:02',
        text: `@[${anna.id}] Can we plan variable speed drives for both intake pumps? The switchgear room has space for two drives.`,
      },
      {
        id: 'riverside-raw-water-c3',
        authorId: anna.id,
        at: 'Today, 08:15',
        parentId: 'riverside-raw-water-c2',
        text: `@[${erik.id}] Yes, let's go for drives. I'll add them to the tender text.`,
      },
    ],
    activity: [
      {
        id: 'riverside-raw-water-a9',
        kind: 'upload',
        actorId: erik.id,
        at: 'Today, 08:42',
        detail: { file: 'Site layout.dwg' },
      },
      {
        id: 'riverside-raw-water-a8',
        kind: 'comment',
        actorId: anna.id,
        at: 'Today, 08:15',
        detail: {},
      },
      {
        id: 'riverside-raw-water-a7',
        kind: 'comment',
        actorId: erik.id,
        at: 'Yesterday, 16:02',
        detail: {},
      },
      {
        id: 'riverside-raw-water-a6',
        kind: 'comment',
        actorId: sulzerAe.id,
        at: 'Yesterday, 15:10',
        detail: {},
      },
      {
        id: 'riverside-raw-water-a5',
        kind: 'items',
        actorId: anna.id,
        at: '3 Oct 2026',
        detail: { product: productName(rawWaterItem), count: '3' },
      },
      {
        id: 'riverside-raw-water-a4',
        kind: 'sizing',
        actorId: anna.id,
        at: '3 Oct 2026',
        detail: { name: rawWaterSizing.name },
      },
      {
        id: 'riverside-raw-water-a3',
        kind: 'upload',
        actorId: anna.id,
        at: '2 Oct 2026',
        detail: { file: 'P&ID rev B.pdf' },
      },
      {
        id: 'riverside-raw-water-a2',
        kind: 'member',
        actorId: anna.id,
        at: '2 Oct 2026',
        detail: { name: `${erik.name}, ${sulzerAe.name}, ${maria.name}` },
      },
      {
        id: 'riverside-raw-water-a1',
        kind: 'created',
        actorId: anna.id,
        at: '2 Oct 2026',
        detail: {},
      },
    ],
    documents: [
      {
        id: 'riverside-raw-water-d1',
        kind: 'upload',
        title: 'P&ID rev B.pdf',
        format: 'PDF',
        size: '2.4 MB',
        addedBy: anna.id,
        at: '2 Oct 2026',
      },
      {
        id: 'riverside-raw-water-d2',
        kind: 'upload',
        title: 'Site layout.dwg',
        format: 'DWG',
        size: '5.8 MB',
        addedBy: erik.id,
        at: 'Today, 08:42',
      },
    ],
  },
  {
    id: 'mill-creek-ps',
    refNo: 'P-2026-0377',
    projectNumber: '396902',
    name: 'Mill Creek pump station renewal',
    applicationId: 'wastewater',
    status: 'Tender',
    created: '18 Aug 2026',
    createdBy: anna.name,
    lastModified: '28 Oct 2026',
    lastModifiedBy: anna.name,
    modifiedOrder: 2,
    deadline: '12 Nov 2026',
    members: [anna, erik],
    consultantFirm: consultantUser.company,
    client: alvstad('Mill Creek pump station, Älvstad'),
    items: [sizedItem('mill-creek-ps-10', 10, 'MC-P1/P2', 500, 25, 2)],
    sizings: [],
    comments: [],
    activity: [
      {
        id: 'mill-creek-ps-a2',
        kind: 'status',
        actorId: anna.id,
        at: '28 Oct 2026',
        detail: { status: 'Tender' },
      },
      { id: 'mill-creek-ps-a1', kind: 'created', actorId: anna.id, at: '18 Aug 2026', detail: {} },
    ],
    documents: [
      {
        id: 'mill-creek-ps-d1',
        kind: 'upload',
        title: 'Hydraulic report rev A.pdf',
        format: 'PDF',
        size: '1.7 MB',
        addedBy: anna.id,
        at: '9 Sep 2026',
      },
    ],
  },
  {
    id: 'kustby-booster-study',
    refNo: 'P-2026-0109',
    projectNumber: '392215',
    name: 'Kustby booster station study',
    applicationId: 'water-distribution',
    status: 'Archived',
    created: '12 Mar 2026',
    createdBy: anna.name,
    lastModified: '30 Jun 2026',
    lastModifiedBy: anna.name,
    modifiedOrder: 1,
    members: [anna],
    client: {
      company: 'Kustby Vatten AB',
      contact: 'Johanna Ek',
      site: 'Kustby booster station',
      email: 'johanna.ek@kustbyvatten.example',
    },
    items: [sizedItem('kustby-booster-study-10', 10, 'KB-01', 150, 55, 3)],
    sizings: [],
    comments: [],
    activity: [
      {
        id: 'kustby-booster-study-a2',
        kind: 'status',
        actorId: anna.id,
        at: '30 Jun 2026',
        detail: { status: 'Archived' },
      },
      {
        id: 'kustby-booster-study-a1',
        kind: 'created',
        actorId: anna.id,
        at: '12 Mar 2026',
        detail: {},
      },
    ],
    documents: [],
  },
]

/** Seed projects per persona. */
export const projectsSeed: Record<PersonaId, Project[]> = {
  endUser: endUserProjects,
  consultant: consultantProjects,
}

/** A member record for a signed-in user, e.g. as owner of a new project. */
export const memberFor = ownerOf
