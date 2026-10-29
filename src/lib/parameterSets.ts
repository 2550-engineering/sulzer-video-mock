/*
 * Named parameter sets from "Save parameters" on /sizing, kept in this
 * browser (localStorage, try/catch). "Reset demo" clears them.
 */

export type ParameterSet = {
  /** "set-<n>", sequential. */
  id: string
  name: string
  /** Pre-formatted, e.g. "Today". */
  saved: string
  /** Sizing params as URL entries. */
  params: [string, string][]
}

const STORAGE_KEY = 'sz-demo-parameter-sets-v1'

export function readParameterSets(): ParameterSet[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? (parsed as ParameterSet[]) : []
  } catch {
    return []
  }
}

/** Stores a set under `name` (replacing one with the same name) and returns it. */
export function saveParameterSet(name: string, params: [string, string][]): ParameterSet {
  const sets = readParameterSets()
  const existing = sets.find((set) => set.name === name)
  let n = sets.length + 1
  while (sets.some((set) => set.id === `set-${n}`)) n += 1
  const set: ParameterSet = { id: existing?.id ?? `set-${n}`, name, saved: 'Today', params }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([set, ...sets.filter((s) => s.id !== set.id)]))
  } catch {
    // Storage unavailable: the set lives only until the dialog closes.
  }
  return set
}
