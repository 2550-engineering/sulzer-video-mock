import { ChevronDown, Send, X } from 'lucide-react'
import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { myProjectsPage } from '../../data/projectPages'
import { encodeMentions } from '../../lib/projects'
import type { NewComment } from '../../projects/ProjectsContext'
import type { ProjectMember } from '../../types'
import { Avatar } from '../Avatar'

const copy = myProjectsPage.discussion

type CommentComposerProps = {
  me: ProjectMember | undefined
  members: ProjectMember[]
  /** What a comment can be about: the products, as { id, label }. */
  items: { id: string; label: string }[]
  /** Preselected product (the list's filter). */
  defaultItemId?: string
  replyTo?: { id: string; name: string; itemId?: string }
  onCancelReply: () => void
  onPost: (comment: NewComment) => void
}

/** The @word being typed at the caret, if any. */
function mentionAt(text: string, caret: number) {
  const match = text.slice(0, caret).match(/(?:^|\s)@([^\s@[\]]*)$/)
  return match ? { start: caret - match[1].length - 1, query: match[1].toLowerCase() } : null
}

/**
 * Write a comment: a text area with @mention suggestions (members; arrow keys
 * and Enter, or click), what it is about (the project or a product), and Post.
 * ⌘/Ctrl+Enter posts too. Remount (via `key`) to start over.
 */
export function CommentComposer({
  me,
  members,
  items,
  defaultItemId,
  replyTo,
  onCancelReply,
  onPost,
}: CommentComposerProps) {
  const ids = useId()
  const textarea = useRef<HTMLTextAreaElement>(null)
  const [text, setText] = useState('')
  const [itemId, setItemId] = useState(defaultItemId ?? '')
  const [mention, setMention] = useState<{ start: number; query: string } | null>(null)
  const [active, setActive] = useState(0)
  /** Where the caret goes after a mention is inserted; set before the next keystroke. */
  const pendingCaret = useRef<number | null>(null)
  useLayoutEffect(() => {
    if (pendingCaret.current === null) return
    textarea.current?.focus()
    textarea.current?.setSelectionRange(pendingCaret.current, pendingCaret.current)
    pendingCaret.current = null
  }, [text])

  const suggestions = mention
    ? members
        .filter((m) => m.id !== me?.id && m.name.toLowerCase().includes(mention.query))
        .slice(0, 5)
    : []

  function track(value: string, caret: number) {
    setText(value)
    setMention(mentionAt(value, caret))
    setActive(0)
  }

  function insert(member: ProjectMember) {
    if (!mention) return
    const caret = textarea.current?.selectionStart ?? text.length
    const next = `${text.slice(0, mention.start)}@${member.name} ${text.slice(caret)}`
    const position = mention.start + member.name.length + 2
    pendingCaret.current = position
    setText(next)
    setMention(null)
  }

  function post() {
    const body = text.trim()
    if (!body) return
    onPost({
      text: encodeMentions(body, members),
      itemId: replyTo ? replyTo.itemId : itemId || undefined,
      parentId: replyTo?.id,
    })
    setText('')
    setMention(null)
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (suggestions.length > 0) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        const step = event.key === 'ArrowDown' ? 1 : -1
        setActive((i) => (i + step + suggestions.length) % suggestions.length)
        return
      }
      if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault()
        insert(suggestions[active])
        return
      }
      if (event.key === 'Escape') {
        event.stopPropagation()
        setMention(null)
        return
      }
    }
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      post()
    }
  }

  return (
    <div className="flex gap-3">
      <Avatar initials={me?.initials ?? '?'} />
      <div className="min-w-0 flex-1">
        {replyTo && (
          <p className="mb-1.5 flex items-center gap-2 text-sm text-text-muted">
            {copy.replyingTo(replyTo.name)}
            <button
              type="button"
              onClick={onCancelReply}
              aria-label={copy.cancelReply}
              className="flex size-6 items-center justify-center rounded-full transition-colors hover:bg-surface-muted hover:text-navy-900"
            >
              <X className="size-3.5" />
            </button>
          </p>
        )}
        <div className="relative">
          <textarea
            ref={textarea}
            rows={3}
            value={text}
            aria-label={copy.placeholder}
            placeholder={copy.placeholder}
            autoFocus={Boolean(replyTo)}
            aria-autocomplete="list"
            aria-controls={suggestions.length ? `${ids}-mentions` : undefined}
            aria-activedescendant={suggestions.length ? `${ids}-mention-${active}` : undefined}
            onChange={(e) => track(e.target.value, e.target.selectionStart)}
            onClick={(e) => setMention(mentionAt(text, e.currentTarget.selectionStart))}
            onKeyDown={onKeyDown}
            onBlur={() => setMention(null)}
            className="w-full resize-y rounded-md border border-border-strong bg-white px-3 py-2.5 text-[15px] leading-snug text-text transition-[border-color,box-shadow] placeholder:text-text-subtle focus:border-primary focus:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none"
          />
          {suggestions.length > 0 && (
            <ul
              id={`${ids}-mentions`}
              role="listbox"
              aria-label={copy.suggestions}
              className="absolute top-full left-0 z-20 mt-1 w-72 animate-fade-in rounded-md border border-border bg-white py-1 shadow-raised"
            >
              {suggestions.map((member, i) => (
                <li
                  key={member.id}
                  id={`${ids}-mention-${i}`}
                  role="option"
                  aria-selected={i === active}
                  // mousedown, so the text area keeps focus
                  onMouseDown={(e) => {
                    e.preventDefault()
                    insert(member)
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={`flex cursor-pointer items-center gap-2.5 px-3 py-2 ${
                    i === active ? 'bg-primary-tint' : ''
                  }`}
                >
                  <Avatar initials={member.initials} />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-navy-900">{member.name}</span>
                    <span className="block truncate text-xs text-text-muted">
                      {member.company || member.email}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          {replyTo ? (
            <span />
          ) : (
            <label className="flex items-center gap-2 text-sm text-text-muted">
              {copy.about}
              <span className="relative">
                <select
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                  className="h-9 cursor-pointer appearance-none rounded-md border border-border-strong bg-white pr-8 pl-3 text-sm font-semibold text-navy-900 transition-colors hover:border-primary focus:border-primary focus-visible:outline-none"
                >
                  <option value="">{copy.aboutProject}</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-text-muted"
                />
              </span>
            </label>
          )}
          <button
            type="button"
            onClick={post}
            disabled={!text.trim()}
            className="inline-flex h-10 items-center gap-2 rounded-pill bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-border-strong"
          >
            <Send className="size-4" />
            {copy.post}
          </button>
        </div>
      </div>
    </div>
  )
}
