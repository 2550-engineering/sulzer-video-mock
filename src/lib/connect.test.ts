import { describe, expect, it } from 'vitest'
import { personas } from '../config/demo'
import { assetById, assets } from '../data/assets'
import {
  alertsFor,
  alertsForAsset,
  alertTime,
  assetsFor,
  healthBand,
  healthScore,
  runHoursByDay,
} from './connect'

describe('Sulzer Connect', () => {
  it('scores RW-02 at 62 (Fair), as in the recording script', () => {
    const score = healthScore(assetById('rw-02')!)
    expect(score).toBe(62)
    expect(healthBand(score!)).toBe('fair')
  })

  it('scores every connected asset, and normal ones as Good', () => {
    for (const asset of assets.filter((a) => a.connected)) {
      const score = healthScore(asset)!
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)
      if (asset.status === 'ok') expect(healthBand(score)).toBe('good')
    }
    expect(healthScore(assetById('cd-01')!)).toBeNull()
  })

  it('raises "Vibration exceeded warning limit 7.1 mm/s – today 03:12" on RW-02', () => {
    const [latest] = alertsForAsset(assetById('rw-02')!)
    expect(latest).toMatchObject({
      title: 'Vibration exceeded warning limit 7.1 mm/s',
      severity: 'warning',
      active: true,
    })
    expect(alertTime(latest.time)).toBe('Today 03:12')
  })

  it('has exactly two active alerts: the P-211 alarm and the RW-02 warning', () => {
    const active = alertsFor(assets).filter((alert) => alert.active)
    expect(active.map((alert) => alert.assetId).sort()).toEqual(['p-211', 'rw-02'])
  })

  it('shows the end user their own assets and a partner every account', () => {
    expect(assetsFor(personas.endUser)).toHaveLength(24)
    expect(assetsFor(personas.channelPartner)).toHaveLength(assets.length)
  })

  it('counts run hours for each of the last 7 days, today only up to the last sample', () => {
    const week = runHoursByDay(assets.filter((a) => a.connected))
    expect(week).toHaveLength(7)
    expect(week.at(-1)!.hours).toBeLessThan(week[0].hours)
  })
})
