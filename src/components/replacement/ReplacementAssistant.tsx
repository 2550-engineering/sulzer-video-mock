import { Bot, MessageCircleMore, SendHorizontal, X } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from 'react'
import { replacementGuideDemo } from '../../config/demo'
import { assistantCopy as copy } from '../../data/replacementAssistant'
import { useBottomBarLift } from '../../hooks/useBottomBarLift'
import { useDismiss } from '../../hooks/useDismiss'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { popoverClasses } from '../../lib/popover'
import { findAnswer, nextSuggestions, parseBold } from '../../lib/replacementAssistant'
import { SulzerLogo } from '../SulzerLogo'

type Message = { id: number; from: 'bot' | 'user'; text: string; fallback?: boolean }

const greeting: Message = { id: 0, from: 'bot', text: copy.greeting }

/** Text with `**bold**` markers as React nodes. */
function Rich({ text }: { text: string }) {
  return parseBold(text).map((part, index) =>
    part.bold ? (
      <strong key={index} className="font-semibold">
        {part.text}
      </strong>
    ) : (
      part.text
    ),
  )
}

function BotAvatar() {
  return (
    <span
      className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-white"
      aria-hidden
    >
      <Bot className="size-4" strokeWidth={2} />
    </span>
  )
}

function BotBubble({ children }: { children: ReactNode }) {
  return (
    <div className="flex animate-fade-in items-end gap-2">
      <BotAvatar />
      <div className="max-w-[80%] rounded-lg rounded-bl-sm bg-surface-sunken px-3.5 py-2.5 text-sm leading-relaxed text-text">
        {children}
      </div>
    </div>
  )
}

/**
 * The Replacement Guide's Sulzer Assistant: a scripted chat in the place of the chat
 * button. Opens by itself with a greeting and suggested questions, answers from the
 * guide's Q&A by keyword match after a fixed typing pause. Starts over on every visit.
 */
export function ReplacementAssistant() {
  const ref = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const autoOpenTimer = useRef<number | undefined>(undefined)
  const typingTimer = useRef<number | undefined>(undefined)
  const nextId = useRef(1)
  const focusOnOpen = useRef(false)

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([greeting])
  const [suggestions, setSuggestions] = useState<string[]>([...copy.suggestions])
  const [typing, setTyping] = useState(false)
  const [draft, setDraft] = useState('')

  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const finePointer = useMediaQuery('(pointer: fine)')
  // Below 1280px the button rises above an open bottom bar instead of covering it.
  const lift = useBottomBarLift()

  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  // Opens by itself once, shortly after the page loads, unless the visitor got there first.
  useEffect(() => {
    if (!replacementGuideDemo.assistantAutoOpen) return
    autoOpenTimer.current = window.setTimeout(
      () => setOpen(true),
      replacementGuideDemo.assistantAutoOpenDelay,
    )
    return () => window.clearTimeout(autoOpenTimer.current)
  }, [])

  useEffect(() => () => window.clearTimeout(typingTimer.current), [])

  // A visitor who opens it with a mouse can type straight away (no keyboard pops up on touch).
  useEffect(() => {
    if (open && focusOnOpen.current) inputRef.current?.focus({ preventScroll: true })
    focusOnOpen.current = false
  }, [open])

  // Keep the newest message in view.
  useEffect(() => {
    const list = listRef.current
    list?.scrollTo({ top: list.scrollHeight, behavior: reducedMotion ? 'auto' : 'smooth' })
  }, [messages, typing, reducedMotion])

  function toggle() {
    window.clearTimeout(autoOpenTimer.current)
    focusOnOpen.current = !open && finePointer
    setOpen(!open)
  }

  function ask(raw: string) {
    const text = raw.trim()
    if (!text || typing) return
    setDraft('')
    setSuggestions([])
    setMessages((list) => [...list, { id: nextId.current++, from: 'user', text }])
    setTyping(true)
    typingTimer.current = window.setTimeout(() => {
      const match = findAnswer(text)
      setTyping(false)
      setMessages((list) => [
        ...list,
        match
          ? { id: nextId.current++, from: 'bot', text: match.a }
          : { id: nextId.current++, from: 'bot', text: copy.fallback.text, fallback: true },
      ])
      setSuggestions(nextSuggestions(text))
    }, replacementGuideDemo.assistantTypingDelay)
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    ask(draft)
  }

  return (
    <div
      ref={ref}
      style={{ '--sz-chat-lift': `${lift}px` } as CSSProperties}
      className="fixed right-6 bottom-6 z-40 max-xl:bottom-[calc(1.5rem+var(--sz-chat-lift)+env(safe-area-inset-bottom))] max-xl:transition-[bottom] max-xl:duration-250 max-xl:ease-sz max-md:right-[max(1rem,env(safe-area-inset-right))] max-md:bottom-[calc(1rem+var(--sz-chat-lift)+env(safe-area-inset-bottom))]"
    >
      <section
        id="assistant-window"
        role="dialog"
        aria-label={copy.name}
        inert={!open}
        className={`absolute right-0 bottom-[calc(100%+16px)] flex max-h-[min(540px,calc(100dvh-12rem))] w-[344px] origin-bottom-right flex-col overflow-hidden rounded-lg bg-white shadow-card ring-1 ring-navy-900/5 max-md:w-[calc(100vw-2rem)] max-md:max-w-[344px] ${popoverClasses(open)}`}
      >
        <header className="flex shrink-0 items-start gap-3 bg-navy-900 px-5 pt-4 pb-4 text-white on-dark">
          <div className="min-w-0 flex-1">
            <SulzerLogo variant="white" className="h-3.5" />
            <p className="mt-3 text-base leading-tight font-bold tracking-tight">{copy.name}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-text-on-dark-muted">
              <span className="size-2 rounded-full bg-success" aria-hidden />
              {copy.status}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={copy.closeChat}
            className="-mt-1 -mr-2 flex size-8 items-center justify-center rounded-md text-text-on-dark-muted transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="size-5" strokeWidth={2} />
          </button>
        </header>

        <div
          ref={listRef}
          role="log"
          aria-live="polite"
          className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-4 pt-4 pb-3"
        >
          {messages.map((message) =>
            message.from === 'user' ? (
              <div key={message.id} className="flex animate-fade-in justify-end">
                <p className="max-w-[80%] rounded-lg rounded-br-sm bg-primary px-3.5 py-2.5 text-sm leading-relaxed text-white">
                  {message.text}
                </p>
              </div>
            ) : (
              <BotBubble key={message.id}>
                <Rich text={message.text} />
                {message.fallback && (
                  <>
                    {' '}
                    <a
                      href={copy.fallback.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary underline-offset-2 hover:underline"
                    >
                      {copy.fallback.link.label}
                    </a>{' '}
                    {copy.fallback.after}
                  </>
                )}
              </BotBubble>
            ),
          )}
          {typing && (
            <BotBubble>
              <span className="flex h-5 items-center gap-1" role="img" aria-label={copy.typing}>
                {[0, 180, 360].map((delay) => (
                  <span
                    key={delay}
                    style={{ animationDelay: `${delay}ms` }}
                    className="size-1.5 animate-typing rounded-full bg-text-subtle motion-reduce:animate-none"
                  />
                ))}
              </span>
            </BotBubble>
          )}
        </div>

        {suggestions.length > 0 && (
          <div
            role="group"
            aria-label={copy.suggestionsLabel}
            className="flex shrink-0 animate-fade-in flex-wrap gap-1.5 px-4 pb-3"
          >
            {suggestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => ask(question)}
                className="rounded-pill border border-primary-border bg-primary-tint px-3 py-1.5 text-left text-xs leading-snug font-semibold text-primary transition-colors hover:bg-primary-tint-strong"
              >
                {question}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={submit} className="flex shrink-0 gap-2 border-t border-border p-3">
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={copy.placeholder}
            aria-label={copy.placeholder}
            autoComplete="off"
            className="h-10 min-w-0 flex-1 rounded-md border border-border-strong bg-white px-3 text-sm text-text transition-[border-color,box-shadow] placeholder:text-text-subtle focus:border-primary focus:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none max-md:text-base"
          />
          <button
            type="submit"
            aria-label={copy.send}
            disabled={typing || !draft.trim()}
            className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-white transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:hover:bg-primary"
          >
            <SendHorizontal className="size-[18px]" strokeWidth={2} />
          </button>
        </form>
      </section>

      <button
        type="button"
        onClick={toggle}
        aria-label={open ? copy.close : copy.open}
        aria-expanded={open}
        aria-controls="assistant-window"
        className="flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-raised transition-[background-color,scale] hover:scale-105 hover:bg-primary-hover active:scale-95 max-md:size-12"
      >
        {open ? (
          <X className="size-6" strokeWidth={2} />
        ) : (
          <MessageCircleMore className="size-6" strokeWidth={2} />
        )}
      </button>
    </div>
  )
}
