import { createContext } from 'react'
import type { DutyPoint, Project, ProjectItem, SizingRecord } from '../types'

export type ProductEntry = { variantId: string; dutyPoint: DutyPoint }

/** A sizing to store, before it gets its id, date and author. */
export type SizingDraft = Omit<SizingRecord, 'id' | 'created' | 'createdBy'>

/** Where "Save as project" puts a sizing. */
export type SaveTarget =
  | { kind: 'new'; name: string; site: string; note: string }
  | { kind: 'existing'; projectId: string }

export type ProjectsState = {
  projects: Project[]
  /** Adds sized products; returns the new item ids. */
  addItems: (projectId: string, entries: ProductEntry[]) => string[]
  /** Creates a Draft project owned by the demo user, with these products; returns the new ids. */
  createProject: (name: string, entries: ProductEntry[]) => { projectId: string; itemIds: string[] }
  updateItem: (
    projectId: string,
    itemId: string,
    patch: Partial<Pick<ProjectItem, 'customerPosition' | 'quantity'>>,
  ) => void
  /** Saves a whole sizing (and, if `withProducts`, its products) to a new or existing project. */
  saveSizing: (
    target: SaveTarget,
    sizing: SizingDraft,
    withProducts: boolean,
  ) => { projectId: string; sizingId: string; itemIds: string[] }
  /** Replaces a saved sizing's input and products with a new run ("Update project"). */
  updateSizing: (projectId: string, sizingId: string, sizing: SizingDraft) => string[]
  duplicateSizing: (projectId: string, sizingId: string) => void
  /** Removes the sizing record; its products stay, unlinked. */
  deleteSizing: (projectId: string, sizingId: string) => void
}

export const ProjectsContext = createContext<ProjectsState | null>(null)
