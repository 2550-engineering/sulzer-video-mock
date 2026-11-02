import { describe, expect, it } from 'vitest'
import { personas } from '../config/demo'
import { summarizeAssets } from '../lib/assetSummary'
import { conditionStatus, latestPoint } from '../lib/conditionData'
import { assetsCard } from './myPages'
import { assets, customers, sites } from './assets'
import { productModels } from './productModels'
import { products } from './products'

describe('installed base', () => {
  it('matches the My Pages story: 24 assets, 6 sites, 18 connected, 1 alarm, 1 warning, 1 service due', () => {
    expect(summarizeAssets(assets)).toEqual({
      total: 24,
      sites: 6,
      connected: 18,
      alarms: 1,
      warnings: 1,
      needsAttention: 2,
      serviceDue: 1,
    })
    expect(assetsCard.stats.map((stat) => [stat.value, stat.detail])).toEqual([
      ['24', 'Across 6 sites'],
      ['2', '1 alarm · 1 warning'],
      ['1', 'Within 30 days'],
    ])
  })

  it('keeps the ids the existing pages link to', () => {
    const ids = assets.map((asset) => asset.id)
    expect(ids).toEqual(expect.arrayContaining(['rw-02', 'p-104', 'p-211']))
    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(assets.map((asset) => asset.serialNumber)).size).toBe(assets.length)
  })

  it('only refers to customers, sites, products and models that exist', () => {
    for (const asset of assets) {
      expect(customers.map((c) => c.id)).toContain(asset.customerId)
      expect(sites.find((s) => s.id === asset.siteId)?.customerId).toBe(asset.customerId)
      expect(products.map((p) => p.id)).toContain(asset.productId)
      if (asset.modelId) {
        expect(productModels.find((m) => m.id === asset.modelId)?.productId).toBe(asset.productId)
      }
    }
    expect(customers).toHaveLength(4)
    expect(customers[0].id).toBe(personas.endUser.customerId)
  })

  it('has dates in order: installed, warranty, last service, next service', () => {
    for (const asset of assets) {
      expect(asset.installedOn < asset.warrantyUntil).toBe(true)
      expect(asset.installedOn < asset.lastService).toBe(true)
      expect(asset.lastService < asset.nextServiceDue).toBe(true)
      expect(asset.lastService <= '2026-10-28').toBe(true)
    }
  })

  it('has a status that matches the latest condition reading', () => {
    for (const asset of assets) {
      const latest = latestPoint(asset.id)
      expect(latest ? conditionStatus(latest) : 'ok').toBe(asset.status)
    }
  })
})
