import { CircleCheck, Reply } from 'lucide-react'
import { myProjectsPage } from '../../data/projectPages'
import type { ProjectComment, ProjectMember } from '../../types'
import { Avatar } from '../Avatar'
import { CommentText } from './CommentText'

const copy = myProjectsPage.discussion

type CommentItemProps = {
  comment: ProjectComment
  members: ProjectMember[]
  /** "Pos. 10 · RW-P1/P2" when the comment is about a product and the list isn't filtered to it. */
  itemLabel?: string
  onReply?: () => void
  onResolve: (resolved: boolean) => void
}

const action =
  'inline-flex items-center gap-1 text-xs font-semibold text-text-muted transition-colors hover:text-primary'

/** One comment: avatar, author, product, time, text, Reply and Resolve. */
export function CommentItem({ comment, members, itemLabel, onReply, onResolve }: CommentItemProps) {
  const author = members.find((m) => m.id === comment.authorId)
  const isNew = comment.at === 'Just now'
  return (
    <article
      className={`flex gap-3 rounded-md px-3 py-3 transition-opacity ${isNew ? 'animate-highlight' : ''} ${
        comment.resolved ? 'opacity-60' : ''
      }`}
    >
      <Avatar initials={author?.initials ?? '?'} />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm">
          <span className="font-semibold text-navy-900">{author?.name ?? comment.authorId}</span>
          {author?.company && <span className="text-xs text-text-muted">{author.company}</span>}
          {itemLabel && (
            <span className="rounded-sm bg-surface-sunken px-1.5 py-px text-xs font-semibold text-navy-700">
              {copy.on(itemLabel)}
            </span>
          )}
          <span className="text-xs text-text-muted tabular-nums">{comment.at}</span>
          {comment.resolved && (
            <span className="inline-flex items-center gap-1 rounded-sm bg-success-tint px-1.5 py-px text-xs font-semibold text-success-strong">
              <CircleCheck aria-hidden className="size-3" />
              {copy.resolved}
            </span>
          )}
        </p>
        <div className="mt-1">
          <CommentText text={comment.text} members={members} />
        </div>
        <div className="mt-1.5 flex gap-4">
          {onReply && (
            <button type="button" onClick={onReply} className={action}>
              <Reply className="size-3.5" />
              {copy.reply}
            </button>
          )}
          <button
            type="button"
            onClick={() => onResolve(!comment.resolved)}
            aria-pressed={Boolean(comment.resolved)}
            className={action}
          >
            <CircleCheck className="size-3.5" />
            {comment.resolved ? copy.reopen : copy.resolve}
          </button>
        </div>
      </div>
    </article>
  )
}
