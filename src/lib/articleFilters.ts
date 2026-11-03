import { searchPage } from '../data/catalogPages'
import type { ResultArticle } from '../types'
import { getProduct } from './catalog'
import type { FilterDef } from './filters'

const copy = searchPage.variants

/*
 * Filter list for variants and models in the /products results. Values are
 * URL params, beside the product range filters.
 */

const powerBucket = (kW: number) =>
  copy.powerBuckets.find(
    (b) => (b.above === undefined || kW > b.above) && (b.upTo === undefined || kW <= b.upTo),
  )!.value

export const articleFilterDefs: FilterDef<ResultArticle>[] = [
  {
    id: 'range',
    label: copy.groups.range,
    value: (a) => getProduct(a.productId)?.name ?? a.productId,
  },
  {
    id: 'discontinued',
    label: copy.groups.discontinued,
    value: (a) => (a.discontinued ? 'discontinued' : 'current'),
    options: ['current', 'discontinued'],
    optionLabel: (value) => copy.status[value as keyof typeof copy.status],
  },
  {
    id: 'frequency',
    label: copy.groups.frequency,
    value: (a) => String(a.frequency),
    optionLabel: (value) => `${value} Hz`,
  },
  {
    id: 'phase',
    label: copy.groups.phase,
    value: (a) => String(a.phase),
    optionLabel: (value) => `${value}-phase`,
  },
  {
    id: 'power',
    label: copy.groups.power,
    value: (a) => powerBucket(a.power),
    options: copy.powerBuckets.map((b) => b.value),
    optionLabel: (value) => copy.powerBuckets.find((b) => b.value === value)?.label ?? value,
  },
  { id: 'ip', label: copy.groups.ip, value: (a) => a.ipClass },
  { id: 'housing', label: copy.groups.housing, value: (a) => a.housing },
  {
    id: 'inlet',
    label: copy.groups.inlet,
    value: (a) => String(a.inlet),
    optionLabel: (value) => `DN ${value}`,
  },
  {
    id: 'outlet',
    label: copy.groups.outlet,
    value: (a) => String(a.outlet),
    optionLabel: (value) => `DN ${value}`,
  },
  { id: 'impeller', label: copy.groups.impeller, value: (a) => a.impellerType },
  {
    id: 'ex',
    label: copy.groups.ex,
    value: (a) => (a.exApproved ? 'yes' : 'no'),
    options: ['yes', 'no'],
    optionLabel: (value) => copy.yesNo[value as keyof typeof copy.yesNo],
  },
]

export const articleFilterIds = articleFilterDefs.map((def) => def.id)
