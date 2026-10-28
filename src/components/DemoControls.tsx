import { LogIn, RotateCcw, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { useDismiss } from '../hooks/useDismiss'

const actionButton =
  'flex h-11 w-full items-center gap-3 rounded-md px-4 text-sm font-semibold transition-colors disabled:cursor-default disabled:opacity-40'

function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  )
}

function clearStorage() {
  try {
    localStorage.clear()
    sessionStorage.clear()
  } catch {
    // Storage unavailable (private mode etc.) — the reload below still resets in-memory state.
  }
}

/**
 * Presenter-only panel for preparing screen recordings, toggled with Shift+D.
 * Renders nothing while closed, so it can never show up in a take.
 */
export function DemoControls() {
  const { user, signIn, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'D' || !event.shiftKey || event.repeat) return
      if (event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return
      event.preventDefault()
      setOpen((value) => !value)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!open) return null

  function resetDemo() {
    signOut()
    clearStorage()
    // Full reload to "/" so every open panel, form field and scroll position starts fresh.
    window.location.assign('/')
  }

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Demo controls"
      className="fixed bottom-6 left-6 z-[60] w-72 animate-fade-in overflow-hidden rounded-lg bg-navy-900 text-text-on-dark shadow-card ring-1 ring-white/10 on-dark"
    >
      <div className="flex items-center justify-between border-b border-white/10 py-2 pr-2 pl-4">
        <p className="text-xs font-semibold tracking-wide text-white uppercase">Demo controls</p>
        <button
          type="button"
          onClick={close}
          aria-label="Close demo controls"
          className="flex size-8 items-center justify-center rounded-full text-text-on-dark-muted transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="grid gap-1.5 p-2">
        <button
          type="button"
          onClick={resetDemo}
          className={`${actionButton} text-white hover:bg-white/10`}
        >
          <RotateCcw className="size-[18px] text-primary-on-dark" />
          Reset demo
        </button>
        <button
          type="button"
          onClick={() => {
            signIn()
            close()
          }}
          disabled={user !== null}
          className={`${actionButton} text-white enabled:hover:bg-white/10`}
        >
          <LogIn className="size-[18px] text-primary-on-dark" />
          Sign in as demo user
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-2.5 text-xs text-text-on-dark-muted">
        <span className="truncate">{user ? `Signed in as ${user.name}` : 'Signed out'}</span>
        <kbd className="shrink-0 rounded-sm bg-white/10 px-1.5 py-0.5 font-sans text-[11px] text-text-on-dark">
          Shift D
        </kbd>
      </div>
    </div>
  )
}
