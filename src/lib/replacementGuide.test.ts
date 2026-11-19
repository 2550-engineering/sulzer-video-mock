import { describe, expect, it } from 'vitest'
import { guideExistingPumps, guideReplacements } from '../data/replacementGuide'
import { replacementGuidePage } from '../data/replacementGuidePage'
import { discontinuedArticles } from './replacement'
import {
  energySavings,
  existingSpecRows,
  findGuidePump,
  guideComparisonRows,
  guideSavingsPower,
  guideBrands,
  guideTargetQuery,
  replacementSpecRows,
  resolveGuideSelection,
  searchByCode,
  suggestReplacements,
} from './replacementGuide'

const pumpsReplacedBy = (id: string) =>
  guideExistingPumps.filter((pump) => pump.replacementId === id).map((p) => `${p.brand} ${p.model}`)

describe('replacement guide data', () => {
  it('has the guide catalogue: 10 replacements, 18 pumps, every replacement id known', () => {
    expect(guideReplacements).toHaveLength(10)
    expect(guideExistingPumps).toHaveLength(18)
    const ids = new Set(guideReplacements.map((r) => r.id))
    for (const pump of guideExistingPumps) expect(ids).toContain(pump.replacementId)
  })

  it('lists the six brands in guide order, then the discontinued Sulzer products', () => {
    const brands = guideBrands()
    expect(brands.map((b) => b.name)).toEqual([
      'Flygt',
      'Grundfos',
      'KSB',
      'Wilo',
      'Ebara',
      'Tsurumi',
      replacementGuidePage.discontinuedBrand,
    ])
    expect(brands.at(-1)?.models.map((m) => m.value)).toEqual(
      expect.arrayContaining(['24130931', 'ahlstar-a-100-80-250']),
    )
  })
})

describe('search by code', () => {
  it('resolves all five example chips', () => {
    for (const example of replacementGuidePage.search.examples) {
      expect(searchByCode(example.query), example.label).not.toBeNull()
    }
    expect(searchByCode('581 30 22')).toEqual({
      kind: 'competitor',
      brand: 'Grundfos',
      model: 'SE1.80.80.22',
    })
    expect(searchByCode('KTZ411')).toMatchObject({ brand: 'Tsurumi', model: 'KTZ 411' })
    expect(searchByCode('24130931')).toEqual({ kind: 'sulzer', articleId: '24130931' })
  })

  it('matches the start of a part or RSK number', () => {
    expect(searchByCode('581 30')).toMatchObject({ brand: 'Grundfos', model: 'SE1.80.80.22' })
  })

  it('finds nothing for nonsense', () => {
    expect(searchByCode('zzqx-999')).toBeNull()
    expect(searchByCode('  ')).toBeNull()
  })
})

describe('suggestions', () => {
  it('suggests the four Flygt pumps for "flygt"', () => {
    const suggestions = suggestReplacements('flygt')
    expect(suggestions).toHaveLength(4)
    expect(suggestions.every((s) => s.group === 'Flygt')).toBe(true)
  })

  it('suggests the pumps XFP 100C replaces for "xfp 100"', () => {
    const suggestions = suggestReplacements('xfp 100')
    expect(suggestions.map((s) => s.label)).toEqual(
      expect.arrayContaining(pumpsReplacedBy('xfp-100c')),
    )
    expect(suggestions).toHaveLength(pumpsReplacedBy('xfp-100c').length)
    for (const s of suggestions) expect(s.replacement).toBe('ABS XFP 100C-CB1.4 PE30/4')
  })

  it('suggests the discontinued XFP for its product number', () => {
    const [first] = suggestReplacements('24130931')
    expect(first).toMatchObject({
      group: replacementGuidePage.discontinuedBrand,
      target: { kind: 'sulzer', articleId: '24130931' },
      fit: 'adapter',
    })
  })

  it('matches part of an RSK number, ignoring spaces', () => {
    const labels = suggestReplacements('581 30').map((s) => s.label)
    expect(labels).toEqual(['Grundfos SE1.80.80.22', 'Grundfos SEV.80.80.40'])
  })

  it('ranks exact matches first and keeps groups together', () => {
    const suggestions = suggestReplacements('3085')
    expect(suggestions[0].label).toBe('Flygt NP 3085 SH')
    const groups = suggestions.map((s) => s.group)
    expect(groups).toEqual([...groups].sort((a, b) => groups.indexOf(a) - groups.indexOf(b)))
  })

  it('returns nothing for nonsense', () => {
    expect(suggestReplacements('zzqx-999')).toEqual([])
    expect(suggestReplacements('x')).toEqual([])
  })
})

describe('selection from the URL', () => {
  const resolve = (query: string) => resolveGuideSelection(new URLSearchParams(query))

  it('shows no pump until one is chosen', () => {
    expect(resolve('')).toBeUndefined()
    expect(resolve('brand=Wilo')).toBeUndefined()
    expect(resolve('brand=Wilo&model=unknown')).toBeUndefined()
    expect(resolve('brand=Sulzer (discontinued)&model=unknown')).toBeUndefined()
    expect(resolve('from=nothing')).toBeUndefined()
  })

  it('reads brand and model', () => {
    expect(resolve('brand=KSB&model=Amarex KRT F 100-251')).toMatchObject({
      replacement: { id: 'xfp-100c' },
      fit: 'drop-in',
    })
    expect(resolve('brand=Sulzer (discontinued)&model=24130931')).toMatchObject({
      kind: 'sulzer',
      article: { id: '24130931' },
    })
  })

  it('reads ?from as a Sulzer product number or a competitor code', () => {
    const sulzer = resolve('from=24130931')
    expect(sulzer?.kind).toBe('sulzer')
    if (sulzer?.kind === 'sulzer') expect(sulzer.successor?.id).toBe('24150231')
    expect(resolve('from=98044186')).toMatchObject({ pump: { model: 'SE1.80.80.22' } })
  })

  it('round-trips a target through the URL', () => {
    const target = searchByCode('581 41 25')!
    const selection = resolve(guideTargetQuery(target).slice(1))
    expect(selection).toMatchObject({ pump: findGuidePump('KSB', 'Amarex KRT F 100-251') })
  })
})

describe('energy savings', () => {
  it('Flygt NP 3085 SH → XFP 81C at 4000 h and €0.25/kWh', () => {
    const pump = findGuidePump('Flygt', 'NP 3085 SH')!
    const replacement = guideReplacements.find((r) => r.id === pump.replacementId)!
    expect(energySavings(pump.powerKw, replacement.powerKw, 4000, 0.25)).toEqual({
      kwhPerYear: 800,
      costPerYear: 200,
      costTenYears: 2000,
      co2Kg: 280,
    })
  })

  it('saves nothing when the replacement draws more', () => {
    expect(energySavings(2, 3, 4000, 0.25).kwhPerYear).toBe(0)
  })
})

describe('spec rows', () => {
  it('has 7 existing and 16 replacement rows, and 16 comparison rows (7 shared)', () => {
    const pump = findGuidePump('Flygt', 'NP 3085 SH')!
    const replacement = guideReplacements.find((r) => r.id === pump.replacementId)!
    expect(existingSpecRows(pump)).toHaveLength(7)
    expect(replacementSpecRows(replacement)).toHaveLength(16)
    const rows = guideComparisonRows(pump, replacement)
    expect(rows[0]).toEqual({ label: 'Manufacturer', existing: 'Flygt', replacement: 'Sulzer' })
    expect(rows).toHaveLength(16)
    expect(rows.at(-1)).toEqual({ label: 'Weight', existing: '', replacement: '78 kg' })
  })

  it('shows the calculator for competitor pumps', () => {
    const selection = resolveGuideSelection(
      new URLSearchParams({ brand: 'Flygt', model: 'NP 3085 SH' }),
    )!
    expect(guideSavingsPower(selection)).toEqual({ existingKw: 2.4, replacementKw: 2.2 })
  })
})

describe('discontinued banner links', () => {
  it('every /products/replacement?from=<id> lands on that product and its successor', () => {
    for (const article of discontinuedArticles()) {
      const selection = resolveGuideSelection(new URLSearchParams({ from: article.id }))
      expect(selection?.kind, article.id).toBe('sulzer')
      if (selection?.kind !== 'sulzer') continue
      expect(selection.article.id).toBe(article.id)
      expect(selection.successor?.id).toBe(article.discontinued!.successorId)
    }
  })
})
