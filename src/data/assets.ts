import { personas } from '../config/demo'
import type { Asset, AssetStatus, ConditionFinding, Customer, Site } from '../types'
import { partOfKind } from './spareParts'

/*
 * Installed base ("/assets", Sulzer Connect). Deterministic: condition readings come from
 * lib/conditionData.ts. Customers, sites, serial numbers and dates are invented: see
 * docs/content-to-confirm.md. Demo "today" is demoClock.today (28 Oct 2026).
 */

const endUser = personas.endUser

/** Nordvatten is the end user's company; the other three are only seen by the channel partner. */
export const customers: Customer[] = [
  {
    id: endUser.customerId,
    name: endUser.company,
    customerNumber: 'C-104482',
    city: 'Västerås',
    industry: 'Water and wastewater utility',
    contact: { name: endUser.name, role: endUser.role, email: endUser.email },
  },
  {
    id: 'malarbruk',
    name: 'Mälarbruk Paper AB',
    customerNumber: 'C-108215',
    city: 'Köping',
    industry: 'Pulp and paper',
    contact: {
      name: 'Anders Holm',
      role: 'Production Engineer',
      email: 'anders.holm@malarbruk.example',
    },
  },
  {
    id: 'sorby-livsmedel',
    name: 'Sörby Livsmedel AB',
    customerNumber: 'C-110937',
    city: 'Eskilstuna',
    industry: 'Food and beverage',
    contact: {
      name: 'Sara Nyberg',
      role: 'Maintenance Planner',
      email: 'sara.nyberg@sorbylivsmedel.example',
    },
  },
  {
    id: 'vastmalm-energi',
    name: 'Västmalm Energi AB',
    customerNumber: 'C-112604',
    city: 'Sala',
    industry: 'Energy and district heating',
    contact: {
      name: 'Petra Lund',
      role: 'Operations Manager',
      email: 'petra.lund@vastmalmenergi.example',
    },
  },
]

const site = (id: string, name: string, type: string, shows: string): Site => ({
  id,
  customerId: endUser.customerId,
  name,
  city: 'Västerås',
  type,
  image: { src: `/images/sites/${id}.jpg`, alt: shows },
})

export const sites: Site[] = [
  site(
    'riverside-intake',
    'Riverside intake',
    'Raw water intake',
    'Brick pump house on the shore with the intake below it, open water and sky, daylight',
  ),
  site(
    'norra-wtp',
    'Norra water treatment plant',
    'Water treatment plant',
    'Round clarifier basin at a water treatment plant, process buildings and trees behind, daylight',
  ),
  site(
    'ekbacken-reservoir',
    'Ekbacken reservoir',
    'Reservoir and booster station',
    'Reservoir lake among wooded hills, with the intake and pump tower on a footbridge, daylight',
  ),
  site(
    'sodra-pump-station',
    'Södra pump station',
    'Wastewater lift station',
    'Sulzer service van and a technician at the control cabinet of a roadside lift station, summer',
  ),
  site(
    'hamnen-pump-station',
    'Hamnen pump station',
    'Wastewater pump station',
    'Inside a wastewater pump station: a row of dry-installed blue XFP pumps with stainless pipework',
  ),
  site(
    'ostra-wwtp',
    'Östra wastewater treatment plant',
    'Wastewater treatment plant',
    'Clarifier at a wastewater treatment plant, with walkways and a low sun under a wide sky',
  ),
]

type Row = [
  tag: string,
  role: string,
  siteId: string,
  productId: string,
  modelId: string | null,
  serialNumber: string,
  installedOn: string,
  warrantyUntil: string,
  runHours: number,
  lastService: string,
  nextServiceDue: string,
  connected: boolean,
  status: AssetStatus,
]

// Exactly what the My Pages card says: 24 assets on 6 sites, 18 connected,
// 2 need attention (RW-02 warning, P-211 alarm), 1 service due within 30 days (BW-01).
// prettier-ignore
const rows: Row[] = [
  // tag     role                    site                   product         model                  serial no.       installed     warranty      run h   last service  next service  conn.  status
  ['RW-01', 'Raw water pump',       'riverside-intake',    'ahlstar',      'ahlstar-150-125-315', 'AH-1918-04511', '2019-05-14', '2021-05-14', 42380, '2026-04-22', '2027-04-22', true,  'ok'],
  ['RW-02', 'Raw water pump',       'riverside-intake',    'ahlstar',      'ahlstar-150-125-315', 'AH-1918-04512', '2019-05-14', '2021-05-14', 44910, '2026-03-17', '2027-03-17', true,  'warning'],
  ['RW-03', 'Raw water pump',       'riverside-intake',    'ahlstar',      'ahlstar-150-125-315', 'AH-1918-04513', '2019-05-14', '2021-05-14', 18650, '2026-04-22', '2027-04-22', true,  'ok'],
  ['TW-01', 'Treated water pump',   'norra-wtp',           'ahlstar',      'ahlstar-125-100-315', 'AH-2133-07820', '2021-09-08', '2023-09-08', 31760, '2026-06-03', '2027-06-03', true,  'ok'],
  ['TW-02', 'Treated water pump',   'norra-wtp',           'ahlstar',      'ahlstar-125-100-315', 'AH-2133-07821', '2021-09-08', '2023-09-08', 29410, '2026-06-03', '2027-06-03', true,  'ok'],
  ['BW-01', 'Backwash pump',        'norra-wtp',           'ahlstar',      'ahlstar-200-150-400', 'AH-1745-02217', '2017-11-20', '2019-11-20',  9310, '2025-11-12', '2026-11-12', true,  'ok'],
  ['CD-01', 'Dosing feed pump',     'norra-wtp',           'ahlstar',      'ahlstar-40-25-160',   'AH-2308-11042', '2023-03-02', '2025-03-02', 12790, '2026-03-10', '2027-03-10', false, 'ok'],
  ['BP-01', 'Booster pump',         'ekbacken-reservoir',  'ahlstar',      'ahlstar-100-80-250',  'AH-2424-15530', '2024-06-18', '2027-06-18', 11370, '2026-06-10', '2027-06-10', true,  'ok'],
  ['BP-02', 'Booster pump',         'ekbacken-reservoir',  'ahlstar',      'ahlstar-100-80-250',  'AH-2424-15531', '2024-06-18', '2027-06-18', 10980, '2026-06-10', '2027-06-10', true,  'ok'],
  ['BP-03', 'Booster pump',         'ekbacken-reservoir',  'ahlstar',      'ahlstar-100-80-250',  'AH-2424-15532', '2024-06-18', '2027-06-18',  2140, '2026-06-10', '2027-06-10', false, 'ok'],
  ['P-101', 'Lift pump',            'sodra-pump-station',  'xfp',          'xfp-100-c',           'XF-1635-20114', '2016-08-29', '2018-08-29', 26800, '2026-02-04', '2027-02-04', false, 'ok'],
  ['P-102', 'Lift pump',            'sodra-pump-station',  'xfp',          'xfp-100-c',           'XF-2215-31876', '2022-04-11', '2024-04-11', 11960, '2026-05-19', '2027-05-19', true,  'ok'],
  ['P-103', 'Lift pump',            'sodra-pump-station',  'xfp',          'xfp-100-c',           'XF-2215-31877', '2022-04-11', '2024-04-11', 12410, '2026-05-19', '2027-05-19', true,  'ok'],
  ['P-104', 'Lift pump',            'sodra-pump-station',  'xfp',          'xfp-100-c',           'XF-2215-31878', '2022-04-11', '2024-04-11', 11830, '2026-05-19', '2027-05-19', true,  'ok'],
  ['P-210', 'Lift pump',            'hamnen-pump-station', 'xfp',          'xfp-150-e',           'XF-2041-26603', '2020-10-05', '2022-10-05', 18590, '2026-01-27', '2027-01-27', true,  'ok'],
  ['P-211', 'Lift pump',            'hamnen-pump-station', 'xfp',          'xfp-150-e',           'XF-2041-26604', '2020-10-05', '2022-10-05', 19240, '2026-01-27', '2027-01-27', true,  'alarm'],
  ['P-212', 'Lift pump',            'hamnen-pump-station', 'xfp',          'xfp-150-e',           'XF-2041-26605', '2020-10-05', '2022-10-05', 17980, '2026-01-27', '2027-01-27', true,  'ok'],
  ['IN-01', 'Inlet pump',           'ostra-wwtp',          'xfp',          'xfp-150-e',           'XF-1811-23310', '2018-03-12', '2020-03-12', 33870, '2026-03-03', '2027-03-03', true,  'ok'],
  ['IN-02', 'Inlet pump',           'ostra-wwtp',          'xfp',          'xfp-150-e',           'XF-1811-23311', '2018-03-12', '2020-03-12', 32450, '2026-03-03', '2027-03-03', true,  'ok'],
  ['RS-01', 'Return sludge pump',   'ostra-wwtp',          'afp',          null,                  'AF-1811-05240', '2018-03-12', '2020-03-12', 63920, '2026-02-17', '2027-02-17', true,  'ok'],
  ['RS-02', 'Return sludge pump',   'ostra-wwtp',          'afp',          null,                  'AF-1811-05241', '2018-03-12', '2020-03-12', 61380, '2026-02-17', '2027-02-17', false, 'ok'],
  ['SL-01', 'Sludge transfer pump', 'ostra-wwtp',          'ahlstar',      'ahlstar-80-50-200',   'AH-2108-06651', '2021-02-22', '2023-02-22', 12480, '2026-05-05', '2027-05-05', true,  'ok'],
  ['SL-02', 'Sludge transfer pump', 'ostra-wwtp',          'ahlstar',      'ahlstar-80-50-200',   'AH-2108-06652', '2021-02-22', '2023-02-22', 11940, '2026-05-05', '2027-05-05', false, 'ok'],
  ['DR-01', 'Drainage pump',        'ostra-wwtp',          'j-dewatering', null,                  'JD-2440-00918', '2024-09-30', '2027-09-30',  1260, '2025-12-15', '2026-12-15', false, 'ok'],
]

export const assets: Asset[] = rows.map(
  ([
    tag,
    role,
    siteId,
    productId,
    modelId,
    serialNumber,
    installedOn,
    warrantyUntil,
    runHours,
    lastService,
    nextServiceDue,
    connected,
    status,
  ]) => ({
    id: tag.toLowerCase(),
    tag,
    name: `${role} ${tag}`,
    customerId: endUser.customerId,
    siteId,
    productId,
    ...(modelId ? { modelId } : {}),
    serialNumber,
    installedOn,
    warrantyUntil,
    runHours,
    lastService,
    nextServiceDue,
    connected,
    status,
  }),
)

/** Sulzer Connect's diagnosis for the assets that need attention. Invented: see docs/content-to-confirm.md. */
export const conditionFindings: Record<string, ConditionFinding> = {
  'rw-02': {
    channel: 'vibration',
    title: 'Bearing wear pattern detected',
    action: 'Inspect within 14 days',
    detail:
      'Vibration on the drive-end bearing has risen steadily for nine days, with the pattern typical of bearing wear. The bearing runs about 9 °C warmer than last week.',
    partId: partOfKind('ahlstar-150-125-315', 'bearing-kit').id,
    partAction: 'Order bearing kit',
  },
  'p-211': {
    channel: 'motorTemperature',
    title: 'Motor running hot under continuous load',
    action: 'Check the inflow and motor cooling today',
    detail:
      'High inflow has kept the pump running non-stop since last night, and the motor winding has heated past the alarm limit. P-210 and P-212 can share the load.',
  },
}

export const assetById = (id: string) => assets.find((asset) => asset.id === id)

export const siteById = (id: string) => sites.find((s) => s.id === id)

/** "Riverside intake, Västerås". */
export function assetLocation(asset: Asset) {
  const assetSite = siteById(asset.siteId)
  return assetSite ? `${assetSite.name}, ${assetSite.city}` : ''
}
