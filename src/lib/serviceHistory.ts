import { conditionLimits } from '../config/demo'
import type { Asset, ServiceHistoryEntry } from '../types'

/*
 * Service history per asset, built from its dates so it always matches the
 * asset data: commissioning, the Sulzer Connect retrofit, one repair or
 * inspection and the last two annual services. Deterministic. Technicians and
 * work done are invented: see docs/content-to-confirm.md.
 */

const technicians = ['Mikael Sjöberg', 'Anna Forsell', 'Jonas Wikström', 'Elin Bergqvist']

/** When the connected fleet got its Sulzer Connect sensors. */
const connectRollout = '2024-10-08'

type Work = { title: string; text: string }

/** What a visit involves, per pump type: dry-installed end-suction or submersible. */
const workByType = {
  dry: {
    service: {
      title: 'Annual service',
      text: 'Checked alignment, bearings and mechanical seal, regreased the bearings and measured vibration.',
    },
    repair: {
      kind: 'Repair',
      title: 'Mechanical seal replaced',
      text: 'Seal leaking at the drive end. Fitted a new SiC/SiC seal set and checked the shaft sleeve.',
    },
    commissioning: {
      title: 'Commissioned by Sulzer',
      text: 'Start-up, laser alignment and baseline vibration measurement.',
    },
  },
  submersible: {
    service: {
      title: 'Annual service',
      text: 'Inspected the impeller and wear plate, checked the seals, oil and insulation resistance.',
    },
    repair: {
      kind: 'Inspection',
      title: 'Wear plate adjusted',
      text: 'Lower efficiency reported. Reset the impeller clearance and cleaned the volute.',
    },
    commissioning: {
      title: 'Commissioned by Sulzer',
      text: 'Start-up, level settings in the pump controller and a test run on all levels.',
    },
  },
} as const

const minusMonths = (iso: string, months: number) => {
  const date = new Date(`${iso}T00:00:00Z`)
  date.setUTCMonth(date.getUTCMonth() - months)
  return date.toISOString().slice(0, 10)
}

/** Newest first, three to five entries. */
export function serviceHistory(asset: Asset): ServiceHistoryEntry[] {
  const index = Number(asset.serialNumber.slice(-4))
  const technician = (n: number) => technicians[(index + n) % technicians.length]
  const work = workByType[asset.productId === 'ahlstar' ? 'dry' : 'submersible']
  const reference = (date: string) =>
    `WO-${date.replaceAll('-', '').slice(2)}-${asset.tag.replace('-', '')}`

  const entry = (
    date: string,
    kind: ServiceHistoryEntry['kind'],
    { title, text }: Work,
    n: number,
  ): ServiceHistoryEntry => ({
    id: `${asset.id}-${date}`,
    date,
    kind,
    title,
    text,
    technician: technician(n),
    reference: reference(date),
  })

  const lastYear = minusMonths(asset.lastService, 12)
  const midway = minusMonths(asset.lastService, 7)
  const entries = [
    entry(asset.lastService, 'Service', withVibration(work.service, asset), 0),
    asset.installedOn < midway && entry(midway, work.repair.kind, work.repair, 1),
    asset.connected &&
      entry(
        asset.installedOn > connectRollout ? asset.installedOn : connectRollout,
        'Upgrade',
        {
          title: 'Sulzer Connect sensor fitted',
          text: 'Vibration and temperature sensor fitted on the bearing housing and paired with the gateway.',
        },
        2,
      ),
    asset.installedOn < lastYear && entry(lastYear, 'Service', work.service, 3),
    entry(asset.installedOn, 'Commissioning', work.commissioning, 1),
  ].filter((e): e is ServiceHistoryEntry => Boolean(e))

  // One entry per date, newest first.
  const byDate = new Map(entries.map((e) => [e.date, e]))
  return [...byDate.values()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
}

/** The last annual service records the vibration level it found, well inside zone A/B. */
function withVibration(work: Work, asset: Asset): Work {
  const measured = (1.6 + (Number(asset.serialNumber.slice(-2)) % 9) / 10).toFixed(1)
  const zoneA = conditionLimits.vibration.zones[0]
  return {
    title: work.title,
    text: `${work.text} Vibration ${measured} mm/s (zone A below ${zoneA} mm/s).`,
  }
}
