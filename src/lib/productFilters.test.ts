import { describe, expect, it } from 'vitest'
import { products } from '../data/products'
import {
  emptySelection,
  facetsFor,
  filterProducts,
  specNumber,
  type FilterSelection,
} from './productFilters'

const select = (picks: Partial<FilterSelection>) => ({ ...emptySelection(), ...picks })
const ids = (selection: FilterSelection) => filterProducts(products, selection).map((p) => p.id)

describe('specNumber', () => {
  it('reads formatted key specs', () => {
    expect(specNumber('-40 .. 180 °C', 'first')).toBe(-40)
    expect(specNumber('-40 .. 180 °C', 'last')).toBe(180)
    expect(specNumber('5 000 m³/h', 'first')).toBe(5000)
    expect(specNumber('30 000 m³/h', 'first')).toBe(30000)
    expect(specNumber('600 m³/h', 'first')).toBe(600)
  })
})

describe('filterProducts', () => {
  it('shows everything without filters', () => {
    expect(ids(emptySelection())).toHaveLength(products.length)
  })

  it('ORs options within a group', () => {
    expect(ids(select({ category: ['split-case-pumps', 'dewatering-pumps'] }))).toEqual([
      'smd',
      'j-dewatering',
    ])
  })

  it('ANDs across groups', () => {
    expect(ids(select({ category: ['end-suction-pumps'], temp: ['above-120'] }))).toEqual([
      'ahlstar',
    ])
  })

  it('buckets pumps by the top of their range and leaves out products without specs', () => {
    expect(ids(select({ flow: ['above-5000'] }))).toEqual(['smd', 'sjt', 'sjm'])
    expect(ids(select({ temp: ['up-to-60'] }))).not.toContain('sulzer-connect')
  })

  it('filters by application area', () => {
    expect(ids(select({ application: ['pulp-paper'] }))).toEqual(['ahlstar'])
  })

  it('ignores unknown values', () => {
    expect(ids(select({ category: ['no-such-category'] }))).toHaveLength(products.length)
  })
})

describe('facetsFor', () => {
  it('counts each option against the other groups, not its own', () => {
    const facets = facetsFor(products, select({ category: ['end-suction-pumps'] }))
    const category = facets.find((facet) => facet.id === 'category')!
    // Other categories keep their full counts, so they can be added.
    expect(category.options.find((o) => o.value === 'submersible-pumps')?.count).toBe(2)
    const temp = facets.find((facet) => facet.id === 'temp')!
    expect(temp.options.map((o) => [o.value, o.count])).toEqual([
      ['60-120', 1],
      ['above-120', 1],
    ])
  })

  it('keeps a selected option even when nothing matches it', () => {
    const facets = facetsFor(
      products,
      select({ category: ['digital-solutions'], temp: ['above-120'] }),
    )
    const temp = facets.find((facet) => facet.id === 'temp')!
    expect(temp.options).toEqual([
      { value: 'above-120', label: 'Above 120 °C', count: 0, selected: true },
    ])
  })
})
