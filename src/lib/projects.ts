import type { Project, User } from '../types'

/* Who sees which project, and whether a partner has shared it with their customer. */

/** The persona's own projects, and the ones they are a member of (e.g. shared by their partner). */
export const isVisibleTo = (project: Project, persona: string, user: User) =>
  project.owner === persona || project.members.some((member) => member.name === user.name)

/** Run for a customer account, and the customer's contact is a member. */
export const isSharedWithClient = (project: Project) =>
  project.clientAccount !== undefined &&
  project.members.some((member) => member.name === project.client.contact)
