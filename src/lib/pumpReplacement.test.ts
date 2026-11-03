import { describe, expect, it } from 'vitest'
import {
  assetBySerial,
  existingFromAsset,
  existingFromInput,
  readReplacementInput,
  replacementOptions,
  replacementQuery,
} from './pumpReplacement'

describe('replacement finder', () => {
  const rw02 = existingFromAsset(assetBySerial('ah-1918-04512')!)

  it('finds RW-02 by serial number and runs it at its measured duty point', () => {
    expect(rw02.asset?.tag).toBe('RW-02')
    expect(rw02.operation?.duty).toMatchObject({ flow: 150, head: 30 })
    expect(rw02.operation?.dutySource).toBe('measured')
  })

  it('suggests a drop-in first, then the lowest life cycle cost, with a saving', () => {
    const options = replacementOptions(rw02)
    expect(options).toHaveLength(2)
    expect(options[0].fits).toBe(true)
    expect(options[0].result.variant.connection).toEqual({ suction: 150, discharge: 125 })
    expect(options[1].lowestCost).toBe(true)
    for (const option of options) {
      expect(option.savingPerYear).toBeGreaterThan(0)
      expect(option.paybackYears).toBeGreaterThan(0)
    }
    expect(replacementOptions(rw02)).toEqual(options)
  })

  it('sends submersible pumps to an expert', () => {
    expect(replacementOptions(existingFromAsset(assetBySerial('XF-2041-26604')!))).toEqual([])
  })

  it('round-trips the form through the URL', () => {
    const input = readReplacementInput(new URLSearchParams('brand=Acme&q=120&h=25'))
    expect(input.mode).toBe('other')
    expect(replacementQuery(input)).toBe('?brand=Acme&q=120&h=25')
    expect(existingFromInput(input)).toMatchObject({ existing: { name: 'Acme' } })
    expect(existingFromInput(readReplacementInput(new URLSearchParams('serial=XX-1')))).toEqual({
      notFound: 'XX-1',
    })
  })
})
