import { describe, expect, it } from 'vitest'
import { assetById, assets } from '../data/assets'
import { assetAlert, assetFilters, matchesQuery, readingTime, sortAssets } from './assetList'
import { applyFilters } from './filters'
import { serviceHistory } from './serviceHistory'

describe('asset list', () => {
  it('puts the alarm, then the warning, then service due first', () => {
    expect(
      sortAssets(assets, 'attention')
        .slice(0, 3)
        .map((a) => a.tag),
    ).toEqual(['P-211', 'RW-02', 'BW-01'])
  })

  it('"Needs attention" on My Pages shows exactly the two units', () => {
    const shown = applyFilters(assets, assetFilters, { status: ['alarm', 'warning'] })
    expect(shown.map((a) => a.tag).sort()).toEqual(['P-211', 'RW-02'])
  })

  it('finds a unit by tag or serial number, ignoring case and dashes', () => {
    const rw02 = assetById('rw-02')!
    expect(matchesQuery(rw02, 'rw02')).toBe(true)
    expect(matchesQuery(rw02, 'ah 1918 04512')).toBe(true)
    expect(matchesQuery(rw02, 'p-211')).toBe(false)
  })
})

describe('asset alert', () => {
  it('RW-02: vibration crossed the warning limit today at 03:12', () => {
    const alert = assetAlert(assetById('rw-02')!)!
    expect(alert.channel).toBe('vibration')
    expect(alert.level).toBe('warning')
    expect(readingTime(alert.since!)).toBe('today 03:12')
  })

  it('P-211: motor temperature alarm', () => {
    const alert = assetAlert(assetById('p-211')!)!
    expect(alert).toMatchObject({ channel: 'motorTemperature', level: 'alarm' })
  })

  it('no alert for a normal unit', () => {
    expect(assetAlert(assetById('rw-01')!)).toBeNull()
  })
})

describe('service history', () => {
  it('has three to five entries per unit, newest first, ending with commissioning', () => {
    for (const asset of assets) {
      const history = serviceHistory(asset)
      expect(history.length).toBeGreaterThanOrEqual(3)
      expect(history.length).toBeLessThanOrEqual(5)
      expect(history.map((e) => e.date)).toEqual(
        history
          .map((e) => e.date)
          .sort()
          .reverse(),
      )
      expect(history.at(-1)).toMatchObject({ kind: 'Commissioning', date: asset.installedOn })
    }
  })
})
