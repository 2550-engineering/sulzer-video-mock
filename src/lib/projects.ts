import type {
  Project,
  ProjectItem,
  ProjectItemStatus,
  ProjectMember,
  ProjectStatus,
} from '../types'

/** Project lifecycle, in order. */
export const projectStatuses: ProjectStatus[] = [
  'Concept design',
  'Detailed design',
  'Tender',
  'Ordered',
  'Archived',
]

/** Where a product in a project stands, in order. */
export const itemStatuses: ProjectItemStatus[] = [
  'Proposed',
  'For review',
  'Approved',
  'Quoted',
  'Ordered',
]

/** Projects still being worked on: products can be added and sizings saved to them. */
export const isActiveProject = (project: Project) =>
  project.status !== 'Ordered' && project.status !== 'Archived'

/**
 * The products the project goes ahead with: every item, except alternatives
 * that were not chosen. A group where none is chosen yet counts in full.
 */
export function chosenItems(items: ProjectItem[]) {
  return items.filter(
    (item) =>
      !item.alternativeGroup ||
      item.preferred ||
      !items.some((other) => other.alternativeGroup === item.alternativeGroup && other.preferred),
  )
}

/** "johan.berg@alvstadvatten.example" → "Johan Berg". */
export function nameFromEmail(email: string) {
  return email
    .split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

export const firstName = (name: string) => name.split(' ')[0]

/** A comment's text in parts: plain text and @[member id] mentions. */
export function commentParts(text: string, members: ProjectMember[]) {
  return text.split(/(@\[[^\]]+\])/).map((part) => {
    const id = part.match(/^@\[([^\]]+)\]$/)?.[1]
    const member = id ? members.find((m) => m.id === id) : undefined
    return member ? { mention: member } : { text: part }
  })
}

/**
 * Typed text to stored text: "@Erik Sandberg" becomes "@[erik-sandberg]" for
 * every member, longest names first.
 */
export function encodeMentions(text: string, members: ProjectMember[]) {
  return [...members]
    .sort((a, b) => b.name.length - a.name.length)
    .reduce((out, member) => out.replaceAll(`@${member.name}`, `@[${member.id}]`), text)
}
