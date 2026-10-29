import type { FilterGroup } from '../types'

/*
 * Generic faceted filtering: options within a group are OR'ed, groups are
 * AND'ed, and each option's count is how many items it would show given the
 * other groups' selections. An item can have several values in a group (e.g.
 * every mains voltage a motor supports). Pure, so the URL alone decides what
 * is shown.
 */

export type FilterDef<T> = {
  id: string
  label: string
  /** The item's value(s) in this group. */
  value: (item: T) => string | string[]
  /** Display label for a value. */
  optionLabel?: (value: string) => string
  /** Every option, in order, even those no item has. Defaults to the values found. */
  options?: string[]
  /** Option order when `options` isn't given; defaults to natural order ("80" before "100"). */
  compare?: (a: string, b: string) => number
}

/** Selected values per group id, as in the URL. */
export type FilterSelection = Record<string, string[]>

const naturalOrder = (a: string, b: string) => a.localeCompare(b, 'en', { numeric: true })
const valuesOf = <T>(def: FilterDef<T>, item: T) => {
  const value = def.value(item)
  return Array.isArray(value) ? value : [value]
}

function matches<T>(item: T, defs: FilterDef<T>[], selection: FilterSelection, except?: string) {
  return defs.every((def) => {
    if (def.id === except) return true
    const selected = selection[def.id] ?? []
    if (selected.length === 0) return true
    const values = valuesOf(def, item)
    return selected.some((value) => values.includes(value))
  })
}

/** Items that pass every group, in their original order. */
export function applyFilters<T>(items: T[], defs: FilterDef<T>[], selection: FilterSelection) {
  return items.filter((item) => matches(item, defs, selection))
}

/**
 * Each group with its options and counts. Options come from `def.options` or
 * from the values in `items`, so choosing one never makes the others vanish;
 * a selected value that matches nothing still shows, with count 0.
 */
export function filterGroups<T>(
  items: T[],
  defs: FilterDef<T>[],
  selection: FilterSelection,
): FilterGroup[] {
  return defs.map((def) => {
    const selected = selection[def.id] ?? []
    const base = items.filter((item) => matches(item, defs, selection, def.id))
    const found = [...new Set(items.flatMap((item) => valuesOf(def, item)))].sort(
      def.compare ?? naturalOrder,
    )
    const values = [...new Set([...(def.options ?? found), ...selected])]
    return {
      id: def.id,
      label: def.label,
      options: values.map((value) => ({
        value,
        label: def.optionLabel?.(value) ?? value,
        count: base.filter((item) => valuesOf(def, item).includes(value)).length,
        selected: selected.includes(value),
      })),
    }
  })
}
