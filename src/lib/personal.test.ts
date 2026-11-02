import { describe, expect, it } from 'vitest'
import type { PersonalData } from '../types'
import {
  defaultPreferences,
  maxRecent,
  parsePersonal,
  recordView,
  toggleCompare,
  toggleSaved,
} from './personal'

const seed: PersonalData = {
  saved: [{ kind: 'product', id: 'ahlstar' }],
  recent: ['ahlstar'],
  preferences: defaultPreferences,
}

describe('toggleSaved', () => {
  it('adds new items at the top and removes saved ones', () => {
    const added = toggleSaved(seed.saved, { kind: 'document', id: 'doc-1' })
    expect(added).toEqual([{ kind: 'document', id: 'doc-1' }, ...seed.saved])
    expect(toggleSaved(added, { kind: 'document', id: 'doc-1' })).toEqual(seed.saved)
  })

  it('tells products and documents with the same id apart', () => {
    expect(toggleSaved(seed.saved, { kind: 'document', id: 'ahlstar' })).toHaveLength(2)
  })
})

describe('recordView', () => {
  it('moves a product to the front without duplicates', () => {
    expect(recordView(['a', 'b', 'c'], 'c')).toEqual(['c', 'a', 'b'])
  })

  it('returns the same list when the product is already first', () => {
    const recent = ['a', 'b']
    expect(recordView(recent, 'a')).toBe(recent)
  })

  it(`keeps at most ${maxRecent} products`, () => {
    const full = Array.from({ length: maxRecent }, (_, i) => `p${i}`)
    expect(recordView(full, 'new')).toHaveLength(maxRecent)
    expect(recordView(full, 'new')[0]).toBe('new')
  })
})

describe('toggleCompare', () => {
  const productOf = (id: string) => id.split('-')[0]

  it('adds up to 3 models of one product, then ignores more', () => {
    let ids: string[] = []
    for (const id of ['a-1', 'a-2', 'a-3', 'a-4']) ids = toggleCompare(ids, id, productOf)
    expect(ids).toEqual(['a-1', 'a-2', 'a-3'])
  })

  it('removes a model that is already selected', () => {
    expect(toggleCompare(['a-1', 'a-2'], 'a-1', productOf)).toEqual(['a-2'])
  })

  it('starts a new comparison for a model of another product', () => {
    expect(toggleCompare(['a-1', 'a-2'], 'b-1', productOf)).toEqual(['b-1'])
  })
})

describe('parsePersonal', () => {
  it('falls back to the seed for missing or malformed data', () => {
    expect(parsePersonal(null, seed)).toBe(seed)
    expect(parsePersonal({ saved: [{ kind: 'video', id: 'x' }], recent: 'a' }, seed)).toEqual(seed)
  })

  it('keeps valid stored data', () => {
    const stored = {
      saved: [],
      recent: ['xfp'],
      preferences: { units: 'us', frequency: 60 },
    }
    expect(parsePersonal(stored, seed)).toEqual(stored)
  })
})
