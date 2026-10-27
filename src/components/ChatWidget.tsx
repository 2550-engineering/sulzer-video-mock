import { ChevronRight, MessageCircleMore, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router'
import { chatOptions } from '../config/navigation'
import { useDismiss } from '../hooks/useDismiss'
import { popoverClasses } from '../lib/popover'
import { SulzerLogo } from './SulzerLogo'

/** Floating chat button with a "How can we help?" card. Decorative: options just navigate. */
export function ChatWidget() {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  return (
    <div ref={ref} className="fixed right-6 bottom-6 z-40">
      <div
        id="chat-card"
        inert={!open}
        className={`absolute right-0 bottom-[calc(100%+16px)] w-[344px] origin-bottom-right overflow-hidden rounded-lg bg-white shadow-card ring-1 ring-navy-900/5 ${popoverClasses(open)}`}
      >
        <div className="bg-navy-900 px-6 pt-5 pb-6 text-white">
          <SulzerLogo variant="white" className="h-4" />
          <p className="mt-5 text-xl font-bold tracking-tight">How can we help?</p>
          <p className="mt-1.5 flex items-center gap-2 text-sm text-text-on-dark">
            <span className="size-2 rounded-full bg-success" aria-hidden />
            Our team typically replies within minutes
          </p>
        </div>
        <ul className="space-y-1 p-3">
          {chatOptions.map(({ label, to, icon: Icon }) => (
            <li key={label}>
              <Link
                to={to}
                onClick={close}
                className="group flex items-center gap-3 rounded-md px-3 py-3 text-[15px] font-medium text-text transition-colors hover:bg-primary-tint"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-primary-tint text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Icon className="size-[18px]" strokeWidth={1.75} />
                </span>
                {label}
                <ChevronRight className="ml-auto size-4 text-text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Close chat' : 'Chat with Sulzer'}
        aria-expanded={open}
        aria-controls="chat-card"
        className="flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-raised transition-[background-color,scale] hover:scale-105 hover:bg-primary-hover active:scale-95"
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
