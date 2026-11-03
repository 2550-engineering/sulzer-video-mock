import { describe, expect, it } from 'vitest'
import { getModel } from './catalog'
import {
  assetBySerial,
  existingFromAsset,
  existingFromInput,
  readReplacementInput,
  replacementOptions,
  replacementQuery,
} from './replacement'
import { itemTenderText, modelTenderText, tenderPlainText, tenderRtf } from './tenderText'
import { getVariant } from './variants'

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

describe('tender texts', () => {
  it('covers hydraulics, materials, seal, motor and standards for a model', () => {
    const doc = modelTenderText(getModel('ahlstar-150-125-315')!)
    const text = tenderPlainText(doc)
    for (const heading of ['HYDRAULIC DATA', 'MATERIALS', 'SHAFT SEAL', 'MOTOR', 'STANDARDS']) {
      expect(text).toContain(heading)
    }
    expect(text).toContain('320 m³/h')
  })

  it('writes project items to one RTF file, a page each', () => {
    const variant = getVariant(
      replacementOptions(existingFromAsset(assetBySerial('AH-1918-04512')!))[0].result.variant.id,
    )
    const item = {
      id: 'i1',
      position: 10,
      customerPosition: 'RW-02',
      variantId: variant!.id,
      dutyPoint: { flow: 150, head: 30, liquid: 'water', temperature: 8, frequency: 50 } as const,
      quantity: 1,
    }
    const doc = itemTenderText(item, variant)!
    const rtf = tenderRtf([doc, doc])
    expect(rtf.startsWith('{\\rtf1')).toBe(true)
    expect(rtf.match(/\\page/g)).toHaveLength(1)
    expect(rtf).toContain('\\u179?')
  })
})
