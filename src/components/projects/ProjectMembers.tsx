import { ChevronDown, UserPlus } from 'lucide-react'
import { myProjectsPage } from '../../data/projectPages'
import type { Project, ProjectAccess } from '../../types'
import { Avatar } from '../Avatar'

const copy = myProjectsPage.members

type ProjectMembersProps = {
  project: Project
  /** The current user's member id. */
  meId: string
  onInvite: () => void
  onAccess: (memberId: string, access: ProjectAccess) => void
}

/**
 * Members tab: avatar, name, company and job title (or the email while
 * invited), and the role. The project owner can change the other members'
 * roles; everyone else sees them.
 */
export function ProjectMembers({ project, meId, onInvite, onAccess }: ProjectMembersProps) {
  const isOwner = project.members.some((m) => m.id === meId && m.access === 'owner')
  return (
    <>
      <ul className="divide-y divide-border">
        {project.members.map((member) => {
          const invited = member.status === 'invited'
          const detail = invited
            ? member.email
            : [member.company, member.role].filter(Boolean).join(' · ')
          return (
            <li key={member.id} className="flex animate-fade-in items-center gap-3 py-3">
              <Avatar
                initials={member.initials}
                className={
                  invited
                    ? 'ring-dashed bg-surface-sunken !text-navy-700 ring-1 ring-border-strong'
                    : ''
                }
              />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-navy-900">
                  {member.name}
                  {member.id === meId && (
                    <span className="rounded-sm bg-surface-sunken px-1.5 py-px text-[11px] font-semibold text-navy-700">
                      {copy.you}
                    </span>
                  )}
                  {invited && (
                    <span className="rounded-sm bg-warning-tint px-1.5 py-px text-[11px] font-semibold text-warning-strong">
                      {copy.invited}
                    </span>
                  )}
                </span>
                <span className="block truncate text-xs text-text-muted" title={detail}>
                  {detail}
                </span>
              </span>
              {isOwner && member.access !== 'owner' ? (
                <span className="relative shrink-0">
                  <select
                    value={member.access}
                    aria-label={copy.accessFor(member.name)}
                    onChange={(e) => onAccess(member.id, e.target.value as ProjectAccess)}
                    className="h-8 cursor-pointer appearance-none rounded-md border border-border-strong bg-white pr-7 pl-2.5 text-xs font-semibold text-navy-900 transition-colors hover:border-primary focus:border-primary focus-visible:outline-none"
                  >
                    <option value="editor">{copy.access.editor}</option>
                    <option value="viewer">{copy.access.viewer}</option>
                  </select>
                  <ChevronDown
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-text-muted"
                  />
                </span>
              ) : (
                <span
                  className="shrink-0 text-xs font-semibold text-text-muted"
                  title={isOwner ? undefined : copy.ownerOnly}
                >
                  {copy.access[member.access]}
                </span>
              )}
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        onClick={onInvite}
        className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-pill border border-primary text-sm font-semibold text-primary transition-colors hover:bg-primary-tint"
      >
        <UserPlus className="size-4" />
        {copy.invite}
      </button>
    </>
  )
}
