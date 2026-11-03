import { describe, expect, it, vi } from 'vitest'
import { conditionLimits } from '../config/demo'
import { assets } from '../data/assets'
import {
  conditionEnd,
  conditionHours,
  conditionSeries,
  conditionStart,
  conditionStatus,
  findCrossing,
  latestPoint,
} from './conditionData'

const HOUR = 60 * 60 * 1000
const connected = assets.filter((asset) => asset.connected)
const series = (id: string) => {
  const result = conditionSeries(id)
  if (!result) throw new Error(`No condition data for ${id}`)
  return result
}

describe('conditionSeries', () => {
  it('covers 30 days hourly, ending today at 08:00', () => {
    expect(conditionHours).toBe(720)
    expect(new Date(conditionEnd).toISOString()).toBe('2026-10-28T08:00:00.000Z')
    for (const asset of connected) {
      const points = series(asset.id)
      expect(points).toHaveLength(720)
      expect(points[0].time).toBe(conditionStart)
      expect(points.at(-1)?.time).toBe(conditionEnd)
      points.slice(1).forEach((point, i) => expect(point.time - points[i].time).toBe(HOUR))
    }
  })

  it('is deterministic: regenerating gives exactly the same values', async () => {
    const first = connected.map((asset) => structuredClone(series(asset.id)))
    vi.resetModules()
    const fresh = await import('./conditionData')
    expect(fresh.conditionSeries).not.toBe(conditionSeries)
    expect(connected.map((asset) => fresh.conditionSeries(asset.id))).toEqual(first)
  })

  it('has data for connected assets only', () => {
    expect(connected.filter((asset) => asset.customerId === 'nordvatten')).toHaveLength(18)
    for (const asset of assets) {
      expect(conditionSeries(asset.id) !== null).toBe(asset.connected)
    }
    expect(conditionSeries('no-such-asset')).toBeNull()
  })

  it('stays in plausible ranges', () => {
    for (const asset of connected) {
      for (const point of series(asset.id)) {
        expect(point.vibration).toBeGreaterThan(0)
        expect(point.vibration).toBeLessThan(conditionLimits.vibration.alarm)
        expect(point.bearingTemperature).toBeGreaterThan(0)
        expect(point.motorTemperature).toBeGreaterThan(0)
        if (!point.running) expect(point.vibration).toBeLessThan(0.5)
      }
    }
  })
})

describe('RW-02 bearing wear', () => {
  const points = series('rw-02')
  const { warning } = conditionLimits.vibration

  it('crosses the 7.1 mm/s warning limit today at 03:12', () => {
    const crossing = findCrossing(points, 'vibration', warning)
    expect(crossing).not.toBeNull()
    expect(new Date(crossing!).toISOString()).toBe('2026-10-28T03:12:00.000Z')
  })

  it('stays below the limit before and above it after', () => {
    const crossing = findCrossing(points, 'vibration', warning)!
    for (const point of points) {
      if (point.time < crossing) expect(point.vibration).toBeLessThan(warning)
      else expect(point.vibration).toBeGreaterThanOrEqual(warning)
    }
  })

  it('rises over the last days and ends around 7.4 mm/s with a warning', () => {
    const daily = (day: number) => {
      const slice = points.slice(day * 24, day * 24 + 24).filter((point) => point.running)
      return slice.reduce((sum, point) => sum + point.vibration, 0) / slice.length
    }
    expect(daily(10)).toBeLessThan(3.2)
    expect(daily(25)).toBeGreaterThan(daily(22))
    expect(daily(28)).toBeGreaterThan(daily(25))
    const last = latestPoint('rw-02')!
    expect(last.vibration).toBeGreaterThan(7.2)
    expect(last.vibration).toBeLessThan(7.6)
    expect(conditionStatus(last)).toBe('warning')
  })
})

describe('P-211 motor temperature', () => {
  const points = series('p-211')
  const { warning, alarm } = conditionLimits.motorTemperature

  it('ends at 118 °C, above the alarm limit', () => {
    const last = latestPoint('p-211')!
    expect(last.motorTemperature).toBe(118)
    expect(last.running).toBe(true)
    expect(conditionStatus(last)).toBe('alarm')
  })

  it('was normal until the last day and crosses the alarm limit today', () => {
    points.slice(0, -24).forEach((point) => expect(point.motorTemperature).toBeLessThan(warning))
    const crossing = findCrossing(points, 'motorTemperature', alarm)!
    expect(new Date(crossing).toISOString().slice(0, 10)).toBe('2026-10-28')
  })
})

describe('other assets', () => {
  it('never reach a warning limit', () => {
    for (const asset of connected.filter((a) => a.id !== 'rw-02' && a.id !== 'p-211')) {
      for (const point of series(asset.id)) expect(conditionStatus(point)).toBe('ok')
    }
  })

  it('P-104 ends running at 2.1 mm/s, as on the home page promo', () => {
    expect(latestPoint('p-104')).toMatchObject({ vibration: 2.1, running: true })
  })
})

describe('findCrossing', () => {
  const point = (time: number, vibration: number) => ({
    time,
    vibration,
    bearingTemperature: 50,
    motorTemperature: 70,
    running: true,
  })

  it('interpolates between samples and ignores downward crossings', () => {
    const points = [point(0, 8), point(HOUR, 6), point(2 * HOUR, 7), point(3 * HOUR, 9)]
    expect(findCrossing(points, 'vibration', 8)).toBe(2.5 * HOUR)
    expect(findCrossing(points, 'vibration', 10)).toBeNull()
  })
})
