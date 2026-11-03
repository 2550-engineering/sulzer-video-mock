import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from '../auth/useAuth'
import { personas } from '../config/demo'
import { memberFor, projectsSeed } from '../data/projects'
import { articleById } from '../lib/articles'
import { nameFromEmail } from '../lib/projects'
import { getVariant } from '../lib/variants'
import type {
  PersonaId,
  Project,
  ProjectActivity,
  ProjectActivityKind,
  ProjectDocumentKind,
  ProjectItem,
  ProjectMember,
  SizingRecord,
  User,
} from '../types'
import { ProjectsContext, type ProductEntry, type ProjectsState } from './ProjectsContext'

// One set per persona. Versioned, so a change to the Project shape starts from the seed instead of old data.
const storageKey = (persona: PersonaId) => `sz-demo-projects-v4-${persona}`

/** "Just now" from an earlier visit reads "Today" after a reload. */
const settle = (at: string) => (at === 'Just now' ? 'Today' : at)

function readProjects(persona: PersonaId): Project[] {
  const seed = projectsSeed[persona]
  try {
    const stored = localStorage.getItem(storageKey(persona))
    const parsed: unknown = stored ? JSON.parse(stored) : null
    if (!Array.isArray(parsed)) return seed
    return (parsed as Project[]).map((p) => ({
      ...p,
      lastModified: settle(p.lastModified),
      activity: p.activity.map((a) => ({ ...a, at: settle(a.at) })),
      comments: p.comments.map((c) => ({ ...c, at: settle(c.at) })),
      documents: p.documents.map((d) => ({ ...d, at: settle(d.at) })),
    }))
  } catch {
    return seed
  }
}

function writeProjects(persona: PersonaId, projects: Project[]) {
  try {
    localStorage.setItem(storageKey(persona), JSON.stringify(projects))
  } catch {
    // Storage unavailable (private mode etc.): keep the in-memory state only.
  }
}

/** A change made now: shown as "Just now" by the current user, sorted first. */
const touched = (projects: Project[], user: User) => ({
  lastModified: 'Just now',
  lastModifiedBy: user.name,
  modifiedOrder: Math.max(0, ...projects.map((p) => p.modifiedOrder)) + 1,
})

/** The next free id in a list: "<prefix><n>". */
function nextId(prefix: string, ids: string[], from = ids.length + 1) {
  let n = from
  while (ids.includes(`${prefix}${n}`)) n += 1
  return `${prefix}${n}`
}

const ids = (list: { id: string }[]) => list.map((entry) => entry.id)

/** "AHLSTAR A25-200-400/390 C1-SD-4P-F" for a sized variant or catalogue article id. */
const productName = (variantId: string) =>
  getVariant(variantId)?.name ?? articleById(variantId)?.code ?? variantId

/** New items for a project, positions continuing in steps of 10 (10, 20, 30 …). */
function newItems(project: Project, entries: ProductEntry[], sizingId?: string) {
  const start = Math.max(0, ...project.items.map((item) => item.position))
  // Alternatives saved together (from a comparison) form one group.
  const group = entries.some((entry) => entry.alternative)
    ? nextId(
        `${project.id}-g`,
        project.items.map((item) => item.alternativeGroup ?? ''),
        1,
      )
    : undefined
  return entries.map((entry, i): ProjectItem => {
    const position = start + 10 * (i + 1)
    return {
      id: `${project.id}-${position}`,
      position,
      customerPosition: '',
      variantId: entry.variantId,
      dutyPoint: entry.dutyPoint,
      quantity: 1,
      status: 'Proposed',
      ...(sizingId ? { sizingId } : {}),
      ...(entry.alternative ? { alternative: entry.alternative, alternativeGroup: group } : {}),
      ...(entry.preferred ? { preferred: true } : {}),
    }
  })
}

/** The "added products" activity detail: the first product's name and the count. */
const itemsDetail = (items: ProjectItem[]) => ({
  product: productName(items[0].variantId),
  count: String(items.length),
})

/** The next free sizing id in a project: "<project id>-s<n>". */
function nextSizingId(project: Project) {
  return nextId(`${project.id}-s`, ids(project.sizings))
}

/** The activity entry a new document writes, if any. */
const documentActivity: Partial<Record<ProjectDocumentKind, ProjectActivityKind>> = {
  upload: 'upload',
  cad: 'cad',
  bim: 'cad',
  report: 'report',
}

/**
 * The signed-in persona's projects (the last persona's while signed out),
 * seeded from data/projects.ts and kept in localStorage per persona, so saved
 * sizings, products, members, comments and activity survive a reload. "Reset
 * demo" clears them. Ids and numbers are sequential (project-4, P-2026-0143,
 * riverside-intake-30, project-4-s1 …), never random. Every change writes an
 * activity entry by the current user, "Just now".
 */
export function ProjectsProvider({ children }: { children: ReactNode }) {
  const { persona } = useAuth()
  const user = personas[persona]
  const [store, setStore] = useState(() => ({ persona, projects: readProjects(persona) }))
  // Another persona signed in: switch to their projects.
  if (store.persona !== persona) setStore({ persona, projects: readProjects(persona) })
  const projects = store.projects
  const setProjects = useCallback(
    (change: (current: Project[]) => Project[]) =>
      setStore((current) => ({ ...current, projects: change(current.projects) })),
    [],
  )

  useEffect(() => writeProjects(store.persona, store.projects), [store])

  const value = useMemo<ProjectsState>(() => {
    const me = memberFor(user)

    /** A project with one more activity entry by the current user, newest first. */
    const logged = (
      p: Project,
      kind: ProjectActivityKind,
      detail: ProjectActivity['detail'] = {},
    ): Project => ({
      ...p,
      activity: [
        { id: nextId(`${p.id}-a`, ids(p.activity)), kind, actorId: me.id, at: 'Just now', detail },
        ...p.activity,
      ],
    })

    /** A new empty project in Concept design, owned by the current user; not yet stored. */
    function blankProject(name: string, site = '', company: string = user.company): Project {
      const id = nextId('project-', ids(projects))
      const n = Number(id.split('-')[1])
      return {
        id,
        refNo: `P-2026-${String(139 + n).padStart(4, '0')}`,
        projectNumber: String(396088 + n),
        name,
        status: 'Concept design',
        created: 'Today',
        createdBy: user.name,
        ...touched(projects, user),
        members: [me],
        client: {
          company,
          contact: company === user.company ? user.name : '',
          site,
          email: company === user.company ? user.email : '',
        },
        consultantFirm: persona === 'consultant' ? user.company : undefined,
        requirements: [],
        share: { access: 'project', memberIds: [], clientReadOnly: false },
        items: [],
        sizings: [],
        comments: [],
        activity: [{ id: `${id}-a1`, kind: 'created', actorId: me.id, at: 'Just now', detail: {} }],
        documents: [],
      }
    }

    const update = (projectId: string, change: (p: Project) => Project) =>
      setProjects((current) =>
        current.map((p) => (p.id === projectId ? { ...change(p), ...touched(current, user) } : p)),
      )

    const find = (projectId: string) => projects.find((p) => p.id === projectId)

    return {
      projects,
      addItems(projectId, entries) {
        const project = find(projectId)
        if (!project || entries.length === 0) return []
        const items = newItems(project, entries)
        update(projectId, (p) =>
          logged({ ...p, items: [...p.items, ...items] }, 'items', itemsDetail(items)),
        )
        return items.map((item) => item.id)
      },
      createProject(name, entries, info) {
        const blank = blankProject(name, info?.site, info?.company || undefined)
        const items = newItems(blank, entries)
        const project = items.length
          ? logged({ ...blank, items }, 'items', itemsDetail(items))
          : blank
        setProjects((current) => [...current, project])
        return { projectId: project.id, itemIds: items.map((item) => item.id) }
      },
      updateItem(projectId, itemId, patch) {
        update(projectId, (p) => {
          const changed = {
            ...p,
            items: p.items.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
          }
          const item = p.items.find((i) => i.id === itemId)
          return patch.status && item
            ? logged(changed, 'itemStatus', {
                position: String(item.position),
                status: patch.status,
              })
            : changed
        })
      },
      updateProject(projectId, patch) {
        const project = find(projectId)
        if (!project) return
        const renamed = patch.name !== undefined && patch.name !== project.name
        const onlyName = Object.keys(patch).every((key) => key === 'name')
        update(projectId, (p) =>
          logged(
            { ...p, ...patch },
            renamed && onlyName ? 'renamed' : 'details',
            renamed ? { name: patch.name! } : {},
          ),
        )
      },
      setStatus(projectId, status) {
        update(projectId, (p) => logged({ ...p, status }, 'status', { status }))
      },
      chooseAlternative(projectId, itemId) {
        update(projectId, (p) => {
          const chosen = p.items.find((item) => item.id === itemId)
          if (!chosen?.alternativeGroup) return p
          return logged(
            {
              ...p,
              items: p.items.map((item) =>
                item.alternativeGroup === chosen.alternativeGroup
                  ? { ...item, preferred: item.id === itemId }
                  : item,
              ),
            },
            'alternative',
            { product: productName(chosen.variantId), alternative: chosen.alternative ?? '' },
          )
        })
      },
      inviteMember(projectId, invite) {
        const project = find(projectId)
        if (!project) return undefined
        const email = invite.email.trim()
        const name = nameFromEmail(email)
        const slug = name.toLowerCase().replace(/[^a-z]+/g, '-') || 'member'
        const member: ProjectMember = {
          id: ids(project.members).includes(slug)
            ? nextId(`${slug}-`, ids(project.members), 2)
            : slug,
          name,
          initials: name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
          email,
          company: '',
          role: '',
          access: invite.access,
          status: 'invited',
        }
        update(projectId, (p) =>
          logged({ ...p, members: [...p.members, member] }, 'member', { name }),
        )
        return member
      },
      setMemberAccess(projectId, memberId, access) {
        update(projectId, (p) => {
          const member = p.members.find((m) => m.id === memberId)
          if (!member || member.access === access) return p
          return logged(
            { ...p, members: p.members.map((m) => (m.id === memberId ? { ...m, access } : m)) },
            'access',
            { name: member.name, access },
          )
        })
      },
      addComment(projectId, comment) {
        update(projectId, (p) => {
          const item = p.items.find((i) => i.id === comment.itemId)
          return logged(
            {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: nextId(`${p.id}-c`, ids(p.comments)),
                  authorId: me.id,
                  at: 'Just now',
                  text: comment.text,
                  ...(comment.itemId ? { itemId: comment.itemId } : {}),
                  ...(comment.parentId ? { parentId: comment.parentId } : {}),
                },
              ],
            },
            'comment',
            item ? { position: String(item.position) } : {},
          )
        })
      },
      setCommentResolved(projectId, commentId, resolved) {
        update(projectId, (p) => ({
          ...p,
          comments: p.comments.map((c) => (c.id === commentId ? { ...c, resolved } : c)),
        }))
      },
      setShare(projectId, share) {
        update(projectId, (p) =>
          logged({ ...p, share }, 'share', {
            access: share.access,
            client: share.clientReadOnly ? 'yes' : 'no',
          }),
        )
      },
      saveSizing(target, draft, withProducts) {
        const isNew = target.kind === 'new'
        const project = isNew ? blankProject(target.name, target.site) : find(target.projectId)
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
        const saved = (p: Project) => {
          const withSizing = logged(
            { ...p, sizings: [...p.sizings, sizing], items: [...p.items, ...items] },
            'sizing',
            { name: sizing.name },
          )
          return items.length ? logged(withSizing, 'items', itemsDetail(items)) : withSizing
        }
        if (isNew) setProjects((current) => [...current, saved(project)])
        else update(project.id, saved)
        return { projectId: project.id, sizingId: sizing.id, itemIds: items.map((item) => item.id) }
      },
      updateSizing(projectId, sizingId, draft) {
        const project = find(projectId)
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
        update(projectId, () =>
          logged(
            {
              ...kept,
              items: [...kept.items, ...items],
              sizings: project.sizings.map((s) => (s.id === sizingId ? { ...old, ...draft } : s)),
            },
            'sizing',
            { name: draft.name },
          ),
        )
        return items.map((item) => item.id)
      },
      duplicateSizing(projectId, sizingId) {
        const project = find(projectId)
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
      addDocument(projectId, document) {
        const project = find(projectId)
        if (!project) return
        if (document.kind !== 'upload' && project.documents.some((d) => d.title === document.title))
          return
        const activityKind = documentActivity[document.kind]
        update(projectId, (p) => {
          const added = {
            ...p,
            documents: [
              ...p.documents,
              {
                ...document,
                id: nextId(`${p.id}-d`, ids(p.documents)),
                addedBy: me.id,
                at: 'Just now',
              },
            ],
          }
          return activityKind ? logged(added, activityKind, { file: document.title }) : added
        })
      },
    }
  }, [projects, setProjects, user, persona])

  return <ProjectsContext value={value}>{children}</ProjectsContext>
}
