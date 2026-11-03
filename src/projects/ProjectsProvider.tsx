import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from '../auth/useAuth'
import { defaultPersona, personas } from '../config/demo'
import { customers } from '../data/assets'
import { customerMember, projects as seed } from '../data/projects'
import { isVisibleTo } from '../lib/projects'
import type { Project, ProjectItem, SizingRecord, User } from '../types'
import { ProjectsContext, type ProductEntry, type ProjectsState } from './ProjectsContext'

// Versioned, so a change to the Project shape starts from the seed instead of old data.
const STORAGE_KEY = 'sz-demo-projects-v3'

function readProjects(): Project[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = stored ? JSON.parse(stored) : null
    return Array.isArray(parsed) ? (parsed as Project[]) : seed
  } catch {
    return seed
  }
}

function writeProjects(projects: Project[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  } catch {
    // Storage unavailable (private mode etc.): keep the in-memory state only.
  }
}

/** A change made now: shown as "Just now" by `user`, sorted first. */
const touched = (projects: Project[], user: User) => ({
  lastModified: 'Just now',
  lastModifiedBy: user.name,
  modifiedOrder: Math.max(0, ...projects.map((p) => p.modifiedOrder)) + 1,
})

/** New items for a project, positions continuing in steps of 10 (10, 20, 30 …). */
function newItems(project: Project, entries: ProductEntry[], sizingId?: string) {
  const start = Math.max(0, ...project.items.map((item) => item.position))
  return entries.map((entry, i): ProjectItem => {
    const position = start + 10 * (i + 1)
    return {
      id: `${project.id}-${position}`,
      position,
      customerPosition: '',
      variantId: entry.variantId,
      dutyPoint: entry.dutyPoint,
      quantity: 1,
      ...(sizingId ? { sizingId } : {}),
    }
  })
}

/** The next free sizing id in a project: "<project id>-s<n>". */
function nextSizingId(project: Project) {
  let n = project.sizings.length + 1
  while (project.sizings.some((s) => s.id === `${project.id}-s${n}`)) n += 1
  return `${project.id}-s${n}`
}

/**
 * Every persona's projects, seeded from data/projects.ts and kept in localStorage,
 * so saved sizings and products survive a reload. "Reset demo" clears it. The
 * signed-in persona sees their own projects and the ones they are a member of, so
 * a project the partner shares shows up for the customer too. Ids and numbers are
 * sequential (project-7, P-2026-0146, riverside-intake-30, project-7-s1 …), never random.
 */
export function ProjectsProvider({ children }: { children: ReactNode }) {
  const { user: signedIn, persona: signedInAs } = useAuth()
  const [projects, setProjects] = useState(readProjects)

  useEffect(() => writeProjects(projects), [projects])

  const value = useMemo<ProjectsState>(() => {
    // Only signed-in pages change projects; the default persona keeps the types simple.
    const persona = signedInAs ?? defaultPersona
    const user = signedIn ?? personas[persona]

    /** A new empty Draft project owned by the signed-in persona; not yet stored. */
    function blankProject(name: string, site = ''): Project {
      let n = projects.length + 1
      while (projects.some((p) => p.id === `project-${n}`)) n += 1
      return {
        id: `project-${n}`,
        owner: persona,
        refNo: `P-2026-${String(139 + n).padStart(4, '0')}`,
        projectNumber: String(396088 + n),
        name,
        status: 'Draft',
        created: 'Today',
        createdBy: user.name,
        ...touched(projects, user),
        members: [{ name: user.name, role: 'Owner' }],
        // A customer's project is for their own company; a partner picks the customer later.
        client:
          user.kind === 'customer'
            ? { company: user.company, contact: user.name, site, email: user.email }
            : { company: '', contact: '', site, email: '' },
        items: [],
        sizings: [],
      }
    }

    const update = (projectId: string, change: (p: Project) => Project) =>
      setProjects((current) =>
        current.map((p) => (p.id === projectId ? { ...change(p), ...touched(current, user) } : p)),
      )

    return {
      projects: signedIn ? projects.filter((p) => isVisibleTo(p, persona, signedIn)) : [],
      addItems(projectId, entries) {
        const project = projects.find((p) => p.id === projectId)
        if (!project) return []
        const items = newItems(project, entries)
        update(projectId, (p) => ({ ...p, items: [...p.items, ...items] }))
        return items.map((item) => item.id)
      },
      createProject(name, entries) {
        const project = blankProject(name)
        const items = newItems(project, entries)
        setProjects((current) => [...current, { ...project, items }])
        return { projectId: project.id, itemIds: items.map((item) => item.id) }
      },
      updateItem(projectId, itemId, patch) {
        update(projectId, (p) => ({
          ...p,
          items: p.items.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
        }))
      },
      saveSizing(target, draft, withProducts) {
        const isNew = target.kind === 'new'
        const project = isNew
          ? blankProject(target.name, target.site)
          : projects.find((p) => p.id === target.projectId)
        if (!project) return { projectId: '', sizingId: '', itemIds: [] }
        const sizing: SizingRecord = {
          ...draft,
          ...(isNew && target.note ? { note: target.note } : {}),
          id: nextSizingId(project),
          created: 'Today',
          createdBy: user.name,
        }
        const entries = sizing.variantIds.map((variantId) => ({
          variantId,
          dutyPoint: sizing.dutyPoint,
        }))
        const items = withProducts ? newItems(project, entries, sizing.id) : []
        const saved = (p: Project) => ({
          ...p,
          sizings: [...p.sizings, sizing],
          items: [...p.items, ...items],
        })
        if (isNew) setProjects((current) => [...current, saved(project)])
        else update(project.id, saved)
        return { projectId: project.id, sizingId: sizing.id, itemIds: items.map((item) => item.id) }
      },
      updateSizing(projectId, sizingId, draft) {
        const project = projects.find((p) => p.id === projectId)
        const old = project?.sizings.find((s) => s.id === sizingId)
        if (!project || !old) return []
        const kept = {
          ...project,
          items: project.items.filter((item) => item.sizingId !== sizingId),
        }
        const items = newItems(
          kept,
          draft.variantIds.map((variantId) => ({ variantId, dutyPoint: draft.dutyPoint })),
          sizingId,
        )
        update(projectId, () => ({
          ...kept,
          items: [...kept.items, ...items],
          sizings: project.sizings.map((s) => (s.id === sizingId ? { ...old, ...draft } : s)),
        }))
        return items.map((item) => item.id)
      },
      duplicateSizing(projectId, sizingId) {
        const project = projects.find((p) => p.id === projectId)
        const original = project?.sizings.find((s) => s.id === sizingId)
        if (!project || !original) return
        const copy: SizingRecord = {
          ...original,
          id: nextSizingId(project),
          name: `${original.name} (copy)`,
          created: 'Today',
          createdBy: user.name,
        }
        update(projectId, (p) => ({ ...p, sizings: [...p.sizings, copy] }))
      },
      deleteSizing(projectId, sizingId) {
        update(projectId, (p) => ({
          ...p,
          sizings: p.sizings.filter((s) => s.id !== sizingId),
          items: p.items.map((item) =>
            item.sizingId === sizingId ? { ...item, sizingId: undefined } : item,
          ),
        }))
      },
      setClientAccount(projectId, customerId) {
        const customer = customers.find((c) => c.id === customerId)
        if (!customer) return
        update(projectId, (p) => ({
          ...p,
          clientAccount: customerId,
          client: {
            company: customer.name,
            contact: customer.contact.name,
            site: p.client.site,
            email: customer.contact.email,
          },
        }))
      },
      shareWithClient(projectId) {
        update(projectId, (p) =>
          p.members.some((member) => member.name === p.client.contact)
            ? p
            : { ...p, members: [...p.members, customerMember(p)] },
        )
      },
    }
  }, [projects, signedIn, signedInAs])

  return <ProjectsContext value={value}>{children}</ProjectsContext>
}
