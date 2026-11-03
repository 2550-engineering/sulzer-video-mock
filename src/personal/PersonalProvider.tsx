import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from '../auth/useAuth'
import type { PersonaId } from '../config/demo'
import { emptyPersonal, personalSeeds } from '../data/personal'
import { getModel } from '../lib/catalog'
import * as personal from '../lib/personal'
import type { PersonalData } from '../types'
import { PersonalContext, type PersonalState } from './PersonalContext'

// Versioned and per persona, so each persona keeps its own saved items.
const storageKey = (persona: PersonaId) => `sz-demo-personal-v1-${persona}`

function readPersonal(persona: PersonaId): PersonalData {
  const seed = personalSeeds[persona] ?? emptyPersonal
  try {
    const stored = localStorage.getItem(storageKey(persona))
    return stored ? personal.parsePersonal(JSON.parse(stored), seed) : seed
  } catch {
    return seed
  }
}

function writePersonal(persona: PersonaId, data: PersonalData) {
  try {
    localStorage.setItem(storageKey(persona), JSON.stringify(data))
  } catch {
    // Storage unavailable (private mode etc.): keep the in-memory state only.
  }
}

const productOf = (modelId: string) => getModel(modelId)?.productId

/**
 * State behind the personal toolbar: saved items, recently viewed and units
 * per persona (seeded from data/personal.ts, kept in localStorage, so "Reset
 * demo" clears them), plus the model comparison, which lives in memory only.
 */
export function PersonalProvider({ children }: { children: ReactNode }) {
  const { persona } = useAuth()
  const [store, setStore] = useState<Partial<Record<PersonaId, PersonalData>>>({})
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [compareOpen, setCompareOpen] = useState(false)

  const stored = useMemo(() => (persona ? readPersonal(persona) : emptyPersonal), [persona])
  const changed = persona ? store[persona] : undefined
  const data = changed ?? stored

  // Only data that changed in this session is written back; seeds stay seeds.
  useEffect(() => {
    if (persona && changed) writePersonal(persona, changed)
  }, [persona, changed])

  const value = useMemo<PersonalState>(() => {
    const change = (update: (current: PersonalData) => PersonalData) => {
      if (!persona) return
      setStore((current) => ({
        ...current,
        [persona]: update(current[persona] ?? readPersonal(persona)),
      }))
    }

    return {
      ...data,
      isSaved: (item) => personal.isSaved(data.saved, item),
      toggleSaved(item) {
        change((d) => ({ ...d, saved: personal.toggleSaved(d.saved, item) }))
        return !personal.isSaved(data.saved, item)
      },
      recordView(productId) {
        if (data.recent[0] === productId) return
        change((d) => ({ ...d, recent: personal.recordView(d.recent, productId) }))
      },
      clearRecent: () => change((d) => ({ ...d, recent: [] })),
      setPreferences: (patch) =>
        change((d) => ({ ...d, preferences: { ...d.preferences, ...patch } })),
      compareIds,
      toggleCompare: (modelId) =>
        setCompareIds((ids) => personal.toggleCompare(ids, modelId, productOf)),
      clearCompare: () => setCompareIds([]),
      compareOpen,
      setCompareOpen,
    }
  }, [persona, data, compareIds, compareOpen])

  return <PersonalContext value={value}>{children}</PersonalContext>
}
