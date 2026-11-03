import {
  ArrowRightLeft,
  Box,
  CircleDot,
  FilePlus2,
  FileText,
  FolderPlus,
  type LucideIcon,
  MessageSquare,
  PackagePlus,
  Pencil,
  Ruler,
  Share2,
  ShieldCheck,
  Upload,
  UserPlus,
  CircleCheck,
} from 'lucide-react'
import { useState } from 'react'
import { myProjectsPage } from '../../data/projectPages'
import { firstName } from '../../lib/projects'
import type { Project, ProjectActivityKind } from '../../types'

const copy = myProjectsPage.activity

const icons: Record<ProjectActivityKind, LucideIcon> = {
  created: FolderPlus,
  sizing: Ruler,
  items: PackagePlus,
  status: ArrowRightLeft,
  member: UserPlus,
  access: ShieldCheck,
  comment: MessageSquare,
  tender: FileText,
  cad: Box,
  upload: Upload,
  report: FilePlus2,
  details: Pencil,
  renamed: Pencil,
  alternative: CircleCheck,
  itemStatus: CircleDot,
  share: Share2,
}

/** How many entries show before "Show all". */
const initialCount = 8

/** Activity tab: what happened in the project, newest first, one sentence each. */
export function ProjectActivityFeed({ project }: { project: Project }) {
  const [showAll, setShowAll] = useState(false)
  const entries = showAll ? project.activity : project.activity.slice(0, initialCount)
  const actor = (id: string) => project.members.find((m) => m.id === id)?.name ?? id

  if (project.activity.length === 0)
    return <p className="py-2 text-sm text-text-muted">{copy.empty}</p>

  return (
    <>
      <ol className="relative">
        {entries.map((entry, index) => {
          const Icon = icons[entry.kind]
          const name = actor(entry.actorId)
          return (
            <li key={entry.id} className="relative flex animate-fade-in gap-3 pb-4">
              {index < entries.length - 1 && (
                <span aria-hidden className="absolute top-8 bottom-0 left-[15px] w-px bg-border" />
              )}
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                <Icon className="size-4" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 pt-0.5 text-sm">
                <span className="text-text">
                  <span className="font-semibold text-navy-900" title={name}>
                    {firstName(name)}
                  </span>{' '}
                  {copy.sentence(entry.kind, entry.detail, project.name)}
                </span>
                <span className="mt-0.5 block text-xs text-text-muted tabular-nums">
                  {entry.at}
                </span>
              </span>
            </li>
          )
        })}
      </ol>
      {project.activity.length > initialCount && (
        <button
          type="button"
          onClick={() => setShowAll((value) => !value)}
          className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          {showAll
            ? myProjectsPage.activityLess
            : myProjectsPage.activityMore(project.activity.length)}
        </button>
      )}
    </>
  )
}
