import { describe, expect, it } from 'vitest'
import { matchRanges, normalizeQuery, search, searchGroups, suggestGroups } from './search'

const ids = (query: string) =>
  search(query).results.map((result) => {
    switch (result.kind) {
      case 'product':
        return `product:${result.product.id}`
      case 'model':
        return `model:${result.model.id}`
      case 'document':
        return `document:${result.document.id}`
      case 'service':
        return `service:${result.service.id}`
      case 'application':
        return `application:${result.application.id}`
    }
  })

describe('normalizeQuery', () => {
  it('lowercases, trims, collapses spaces and drops quotes and accents', () => {
    expect(normalizeQuery('  “AHLSTAR”   Pump ')).toBe('ahlstar pump')
    expect(normalizeQuery('Pompe à eau')).toBe('pompe a eau')
  })
})

describe('search', () => {
  it('finds nothing for an empty or unknown query', () => {
    expect(search('').results).toEqual([])
    expect(search('   ').results).toEqual([])
    expect(search('zzzz').counts.all).toBe(0)
  })

  it('is case-insensitive', () => {
    expect(ids('AHLSTAR')).toEqual(ids('ahlstar'))
  })

  it('returns the recording counts for AHLSTAR, with the product first', () => {
    const { results, counts } = search('AHLSTAR')
    expect(counts).toEqual({
      all: 25,
      product: 1,
      model: 14,
      document: 10,
      service: 0,
      application: 0,
    })
    expect(results[0]).toMatchObject({ kind: 'product', product: { id: 'ahlstar' } })
  })

  it('ranks an exact name match first, whatever its kind', () => {
    expect(ids('Surface water intake')[0]).toBe('application:surface-water-intake')
    expect(ids('xfp')[0]).toBe('product:xfp')
    expect(ids('Commissioning')[0]).toBe('service:commissioning')
  })

  it('matches product numbers', () => {
    expect(ids('62801067')).toEqual(['model:ahlstar-100-80-250'])
  })

  it('matches families and categories', () => {
    expect(ids('vertical turbine')).toContain('product:sjt')
    expect(ids('Submersible pumps').slice(0, 2)).toEqual(['product:xfp', 'product:afp'])
  })

  it('finds products through the names of their applications', () => {
    const hits = ids('stock preparation')
    expect(hits[0]).toBe('application:stock-preparation')
    expect(hits).toContain('product:ahlstar')
  })

  it('requires every word to match', () => {
    expect(ids('ahlstar duplex')).toEqual([
      'model:ahlstar-65-40-250',
      'model:ahlstar-100-80-250-60hz',
    ])
  })

  it('keeps models of equal score in data order', () => {
    const models = ids('ahlstar').filter((id) => id.startsWith('model:'))
    expect(models.slice(0, 3)).toEqual([
      'model:ahlstar-40-25-160',
      'model:ahlstar-50-32-200',
      'model:ahlstar-65-40-250',
    ])
  })

  it('is deterministic', () => {
    expect(search('pump')).toEqual(search('pump'))
  })
})

describe('searchGroups', () => {
  it('lists each product once, also when found through several models', () => {
    const groups = searchGroups('ahlstar')
    expect(groups.products.map((product) => product.id)).toEqual(['ahlstar'])
    expect(groups.documents).toHaveLength(10)
    expect(groups.applications).toHaveLength(0)
  })

  it('finds a product by article number', () => {
    expect(searchGroups('62806030').products.map((product) => product.id)).toEqual(['ahlstar'])
  })
})

describe('suggestGroups', () => {
  const names = (query: string) => {
    const groups = suggestGroups(query)
    return {
      products: groups.products.map((product) => product.id),
      applications: groups.applications.map((application) => application.id),
      documents: groups.documents.map((document) => document.id),
    }
  }

  it('waits for two characters', () => {
    expect(names('a')).toEqual({ products: [], applications: [], documents: [] })
    expect(names(' a ')).toEqual({ products: [], applications: [], documents: [] })
  })

  it('groups the best hits, at most 4 per group', () => {
    expect(names('ahl')).toEqual({
      products: ['ahlstar'],
      applications: [],
      documents: [
        'doc-ahlstar-brochure',
        'doc-ahlstar-iom',
        'doc-ahlstar-quick-guide',
        'doc-ahlstar-datasheet',
      ],
    })
    const water = suggestGroups('water')
    expect(water.applications).toHaveLength(4)
    expect(water.products.length).toBeLessThanOrEqual(4)
  })

  it('suggests a product when one of its models matches', () => {
    expect(names('100-80-250').products).toEqual(['ahlstar'])
  })

  it('is deterministic', () => {
    expect(suggestGroups('wa')).toEqual(suggestGroups('wa'))
  })
})

describe('matchRanges', () => {
  it('finds every word, merges overlaps and ignores case and accents', () => {
    expect(matchRanges('AHLSTAR 100-80-250', 'ahl 80')).toEqual([
      [0, 3],
      [12, 14],
    ])
    expect(matchRanges('Pompe à eau', 'A EAU')).toEqual([
      [6, 7],
      [8, 11],
    ])
    expect(matchRanges('aaaa', 'aa')).toEqual([[0, 4]])
  })
})
