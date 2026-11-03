import { createContext } from 'react'
import type {
  DutyPoint,
  Project,
  ProjectAccess,
  ProjectDocument,
  ProjectItem,
  ProjectMember,
  ProjectShare,
  ProjectStatus,
  SizingRecord,
} from '../types'

export type ProductEntry = {
  variantId: string
  dutyPoint: DutyPoint
  /** From "Save comparison to project": the alternative's letter, and whether it was selected. */
  alternative?: string
  preferred?: boolean
}

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
  /** Creates a Concept design project owned by the current user, with these products; returns the new ids. */
  createProject: (
    name: string,
    entries: ProductEntry[],
    info?: NewProjectInfo,
  ) => { projectId: string; itemIds: string[] }
  updateItem: (projectId: string, itemId: string, patch: ItemPatch) => void
  /** Name, description, client, consultant, deadline, budget, key requirements. */
  updateProject: (projectId: string, patch: ProjectInfoPatch) => void
  setStatus: (projectId: string, status: ProjectStatus) => void
  /** Marks one alternative of its group as selected, and the others not. */
  chooseAlternative: (projectId: string, itemId: string) => void
  /** Adds a member with status "invited"; returns them. */
  inviteMember: (projectId: string, invite: MemberInvite) => ProjectMember | undefined
  setMemberAccess: (projectId: string, memberId: string, access: ProjectAccess) => void
  addComment: (projectId: string, comment: NewComment) => void
  setCommentResolved: (projectId: string, commentId: string, resolved: boolean) => void
  setShare: (projectId: string, share: ProjectShare) => void
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
  /**
   * Adds a file to the project's documents, by the current user, "Just now".
   * Generated files (CAD, package …) already in the list are not added twice.
   */
  addDocument: (projectId: string, document: NewProjectDocument) => void
}

export type ItemPatch = Partial<Pick<ProjectItem, 'customerPosition' | 'quantity' | 'status'>>

export type ProjectInfoPatch = Partial<
  Pick<
    Project,
    | 'name'
    | 'description'
    | 'client'
    | 'clientAccount'
    | 'consultantFirm'
    | 'deadline'
    | 'budget'
    | 'requirements'
  >
>

/** Optional details from the "New project" dialog. */
export type NewProjectInfo = { company?: string; site?: string }

export type MemberInvite = {
  email: string
  access: Exclude<ProjectAccess, 'owner'>
  message: string
}

/** A comment to post, as the current user, "Just now". Mentions are written as @[member id]. */
export type NewComment = { text: string; itemId?: string; parentId?: string }

/** A document to add, before it gets its id, author and date. */
export type NewProjectDocument = Omit<ProjectDocument, 'id' | 'addedBy' | 'at'>

export const ProjectsContext = createContext<ProjectsState | null>(null)
