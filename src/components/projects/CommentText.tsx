import { commentParts } from '../../lib/projects'
import type { ProjectMember } from '../../types'

/** A comment's text with @mentions as name chips. */
export function CommentText({ text, members }: { text: string; members: ProjectMember[] }) {
  return (
    <p className="text-[15px] leading-relaxed whitespace-pre-line text-text">
      {commentParts(text, members).map((part, i) =>
        'mention' in part && part.mention ? (
          <span
            key={i}
            className="rounded-sm bg-primary-tint px-1 py-px font-semibold text-primary"
            title={part.mention.email}
          >
            @{part.mention.name}
          </span>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </p>
  )
}
