import type { PersonalData, PersonalPreferences, SavedItem } from '../types'

/* Pure helpers behind the personal toolbar state (personal/PersonalProvider.tsx). */

/** Recently viewed keeps this many products. */
export const maxRecent = 12

/** Models in one comparison. */
export const maxCompare = 3

export const defaultPreferences: PersonalPreferences = { units: 'metric', frequency: 50 }

const sameItem = (a: SavedItem, b: SavedItem) => a.kind === b.kind && a.id === b.id

export const isSaved = (saved: SavedItem[], item: SavedItem) => saved.some((s) => sameItem(s, item))

/** Adds the item at the top, or removes it when it is already saved. */
export function toggleSaved(saved: SavedItem[], item: SavedItem) {
  return isSaved(saved, item) ? saved.filter((s) => !sameItem(s, item)) : [item, ...saved]
}

/** Moves the product to the front of recently viewed, keeping at most `maxRecent`. */
export function recordView(recent: string[], productId: string) {
  if (recent[0] === productId) return recent
  return [productId, ...recent.filter((id) => id !== productId)].slice(0, maxRecent)
}

/**
 * Adds a model to the comparison or takes it out. Models compare within one
 * product, so a model of another product starts a new comparison. At most
 * `maxCompare`; further models are ignored.
 */
export function toggleCompare(
  ids: string[],
  id: string,
  productOf: (modelId: string) => string | undefined,
) {
  if (ids.includes(id)) return ids.filter((x) => x !== id)
  if (ids.some((x) => productOf(x) !== productOf(id))) return [id]
  return ids.length < maxCompare ? [...ids, id] : ids
}

const isSavedItem = (value: unknown): value is SavedItem =>
  typeof value === 'object' &&
  value !== null &&
  ((value as SavedItem).kind === 'product' || (value as SavedItem).kind === 'document') &&
  typeof (value as SavedItem).id === 'string'

/** Stored data checked field by field; anything missing or malformed comes from the seed. */
export function parsePersonal(stored: unknown, seed: PersonalData): PersonalData {
  if (typeof stored !== 'object' || stored === null) return seed
  const { saved, recent, preferences } = stored as Partial<PersonalData>
  return {
    saved: Array.isArray(saved) && saved.every(isSavedItem) ? saved : seed.saved,
    recent:
      Array.isArray(recent) && recent.every((id) => typeof id === 'string') ? recent : seed.recent,
    preferences: {
      units: preferences?.units === 'us' ? 'us' : seed.preferences.units,
      frequency: preferences?.frequency === 60 ? 60 : seed.preferences.frequency,
    },
  }
}
