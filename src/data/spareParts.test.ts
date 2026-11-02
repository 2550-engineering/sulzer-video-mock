import { describe, expect, it } from 'vitest'
import { addWorkingDays, nextOrderId } from '../lib/eshop'
import { cartTotals } from '../lib/pricing'
import { atPosition, bomFor, getPart, modelsWithParts, searchParts } from '../lib/spareParts'
import { assets, conditionFindings } from './assets'
import { orderSeeds } from './orders'
import { productModels } from './productModels'
import { sectionalDrawings } from './sectionalDrawings'
import { spareParts } from './spareParts'

describe('spare parts', () => {
  it('has a 15–25 part BOM for every AHLSTAR and XFP model', () => {
    const models = productModels.filter((m) => ['ahlstar', 'xfp'].includes(m.productId))
    for (const model of models) {
      const bom = bomFor(model.id)
      expect(bom.length, model.id).toBeGreaterThanOrEqual(15)
      expect(bom.length, model.id).toBeLessThanOrEqual(25)
    }
    expect(modelsWithParts('ahlstar')).toHaveLength(
      models.filter((m) => m.productId === 'ahlstar').length,
    )
  })

  it('has unique 8-digit part numbers', () => {
    const numbers = spareParts.map((p) => p.partNumber)
    expect(new Set(numbers).size).toBe(numbers.length)
    for (const number of numbers) expect(number).toMatch(/^\d{8}$/)
  })

  it('builds kits from parts of the same models, for less than the parts', () => {
    for (const kit of spareParts.filter((p) => p.contains)) {
      let sum = 0
      for (const item of kit.contains!) {
        const part = getPart(item.partId)!
        for (const modelId of kit.modelIds) expect(part.modelIds).toContain(modelId)
        sum += part.listPrice * item.quantity
      }
      expect(kit.listPrice).toBeLessThan(sum)
    }
  })

  it('has a hotspot for every drawn position', () => {
    for (const part of spareParts) {
      if (part.position === undefined || part.group === 'Drive' || part.contains) continue
      const hotspots = sectionalDrawings[part.productId].hotspots.map((h) => h.position)
      expect(hotspots, `${part.productId} pos. ${part.position}`).toContain(part.position)
    }
  })

  it('finds the RW-02 bearing kit at hotspot 321 and by part number', () => {
    const kit = getPart(conditionFindings['rw-02'].partId!)!
    expect(kit.name).toMatch(/^Bearing kit/)
    expect(atPosition(kit, 321)).toBe(true)
    expect(kit.modelIds).toContain(assets.find((a) => a.id === 'rw-02')!.modelId)
    expect(searchParts(kit.partNumber)[0]).toBe(kit)
  })

  it('only orders parts that exist', () => {
    const numbers = new Set(spareParts.map((p) => p.partNumber))
    for (const order of orderSeeds) {
      for (const line of order.lines) expect(numbers).toContain(line.partNumber)
    }
  })
})

describe('checkout', () => {
  it('numbers new orders after the seeds', () => {
    expect(nextOrderId(orderSeeds)).toBe('SO-104400')
  })

  it('skips weekends', () => {
    // 28 Oct 2026 is a Wednesday.
    expect(addWorkingDays('2026-10-28', 3)).toBe('2026-11-02')
  })

  it('applies the discount to the totals', () => {
    const part = spareParts[0]
    const totals = cartTotals([{ partId: part.id, quantity: 2 }], getPart, 32)
    expect(totals.list).toBe(part.listPrice * 2)
    expect(totals.net).toBeCloseTo(part.listPrice * 2 * 0.68, 2)
  })
})
