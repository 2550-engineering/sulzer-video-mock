import { createContext } from 'react'
import type { PersonalPreferences, SavedItem } from '../types'

export type PersonalState = {
  /** The signed-in persona's saved items, newest first. Empty when signed out. */
  saved: SavedItem[]
  /** Product ids, most recent first. */
  recent: string[]
  preferences: PersonalPreferences
  isSaved: (item: SavedItem) => boolean
  /** Saves the item, or removes it when it is saved. Returns true when it was added. */
  toggleSaved: (item: SavedItem) => boolean
  /** Puts a product at the front of recently viewed. No-op when signed out. */
  recordView: (productId: string) => void
  clearRecent: () => void
  setPreferences: (patch: Partial<PersonalPreferences>) => void
  /** Model ids selected for comparison (one product at a time). In memory only. */
  compareIds: string[]
  toggleCompare: (modelId: string) => void
  clearCompare: () => void
  /** The comparison panel on the Models tab. */
  compareOpen: boolean
  setCompareOpen: (open: boolean) => void
}

export const PersonalContext = createContext<PersonalState | null>(null)
