import { MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { myProjectsPage } from '../../data/projectPages'
import type { NewComment } from '../../projects/ProjectsContext'
import type { Project, ProjectComment } from '../../types'
import { ChipGroup } from '../ChipGroup'
import { CommentComposer } from './CommentComposer'
import { CommentItem } from './CommentItem'

const copy = myProjectsPage.discussion

/** "all", "project" (not about a product) or an item id. */
export type DiscussionFilter = string

type ProjectDiscussionProps = {
  project: Project
  meId: string
  filter: DiscussionFilter
  onFilter: (filter: DiscussionFilter) => void
  onPost: (comment: NewComment) => void
  onResolve: (commentId: string, resolved: boolean) => void
}

/**
 * Discussion tab: comments on the project and its products, oldest first,
 * with one level of replies. Chips filter by product; the composer below
 * posts as the current user.
 */
export function ProjectDiscussion({
  project,
  meId,
  filter,
  onFilter,
  onPost,
  onResolve,
}: ProjectDiscussionProps) {
  const [replyTo, setReplyTo] = useState<ProjectComment | null>(null)
  const members = project.members
  const itemLabel = (itemId?: string) => {
    const item = project.items.find((i) => i.id === itemId)
    if (!item) return undefined
    return [copy.position(item.position), item.customerPosition].filter(Boolean).join(' · ')
  }
  const items = project.items.map((item) => ({ id: item.id, label: itemLabel(item.id)! }))

  const topLevel = project.comments.filter((c) => !c.parentId)
  const matches = (c: ProjectComment) =>
    filter === 'all' || (filter === 'project' ? !c.itemId : c.itemId === filter)
  const threads = topLevel.filter(matches)
  const countFor = (f: DiscussionFilter) =>
    project.comments.filter((c) => {
      const root = c.parentId ? project.comments.find((p) => p.id === c.parentId) : c
      return root ? f === 'all' || (f === 'project' ? !root.itemId : root.itemId === f) : false
    }).length

  const filters = [
    { value: 'project', label: copy.filters.project, count: countFor('project') },
    ...items.map((item) => ({ value: item.id, label: item.label, count: countFor(item.id) })),
  ]
  const replyAuthor = replyTo && members.find((m) => m.id === replyTo.authorId)

  return (
    <div className="rounded-lg border border-border bg-white">
      <div className="border-b border-border px-5 py-4">
        <p className="mb-2 text-sm font-semibold text-navy-900">{copy.filterLabel}</p>
        <ChipGroup
          label={copy.filterLabel}
          allLabel={`${copy.filters.all} (${project.comments.length})`}
          options={filters}
          selected={filter === 'all' ? [] : [filter]}
          onToggle={(value) => onFilter(value === filter ? 'all' : value)}
          onClear={() => onFilter('all')}
        />
      </div>

      <div className="px-3 py-3">
        {threads.length > 0 ? (
          <ul className="space-y-1">
            {threads.map((comment) => {
              const replies = project.comments.filter((c) => c.parentId === comment.id)
              const label = filter === comment.itemId ? undefined : itemLabel(comment.itemId)
              return (
                <li key={comment.id}>
                  <CommentItem
                    comment={comment}
                    members={members}
                    itemLabel={label}
                    onReply={() => setReplyTo(comment)}
                    onResolve={(resolved) => onResolve(comment.id, resolved)}
                  />
                  {replies.length > 0 && (
                    <ul className="ml-11 border-l-2 border-border pl-2">
                      {replies.map((reply) => (
                        <li key={reply.id}>
                          <CommentItem
                            comment={reply}
                            members={members}
                            onResolve={(resolved) => onResolve(reply.id, resolved)}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center px-8 py-10 text-center">
            <MessageSquare aria-hidden className="size-9 text-text-subtle" strokeWidth={1.5} />
            <p className="mt-3 max-w-sm text-sm text-text-muted">{copy.empty}</p>
          </div>
        )}
      </div>

      <div className="border-t border-border bg-surface-subtle px-5 py-4">
        <CommentComposer
          key={`${filter}-${replyTo?.id ?? ''}`}
          me={members.find((m) => m.id === meId)}
          members={members}
          items={items}
          defaultItemId={filter === 'all' || filter === 'project' ? undefined : filter}
          replyTo={
            replyTo
              ? { id: replyTo.id, name: replyAuthor?.name ?? '', itemId: replyTo.itemId }
              : undefined
          }
          onCancelReply={() => setReplyTo(null)}
          onPost={(comment) => {
            onPost(comment)
            setReplyTo(null)
          }}
        />
      </div>
    </div>
  )
}
