import { LogOut, X } from 'lucide-react'
import { useEffect } from 'react'
import { Link, NavLink } from 'react-router'
import { connectApp } from '../../data/connect'
import type { IconLink } from '../../types'

type ConnectMoreSheetProps = {
  open: boolean
  onClose: () => void
  /** App pages that don't fit in the phone tab bar. */
  items: IconLink[]
  onSettings: () => void
}

const itemClass =
  'flex h-12 w-full items-center gap-3 rounded-md px-3 text-[15px] font-medium transition-colors'

/**
 * Phones only: the "More" sheet above the Sulzer Connect tab bar, with the
 * pages the bar has no room for, Settings and Exit. Closes on a choice, a tap
 * outside or Escape.
 */
export function ConnectMoreSheet({ open, onClose, items, onSettings }: ConnectMoreSheetProps) {
  const { settings, exit } = connectApp
  const SettingsIcon = settings.icon

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-30 md:hidden">
      <button
        type="button"
        aria-label={connectApp.more.close}
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-navy-900/60"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={connectApp.more.label}
        className="absolute inset-x-0 bottom-0 animate-fade-in rounded-t-lg border-t border-white/10 bg-navy-900 px-4 pt-3 pb-[calc(5.75rem+env(safe-area-inset-bottom))] shadow-[0_-24px_60px_-30px_rgba(0,0,0,0.8)]"
      >
        <div className="flex items-center justify-between pb-2 pl-3">
          <p className="text-sm font-semibold text-text-on-dark-muted">{connectApp.more.label}</p>
          <button
            type="button"
            aria-label={connectApp.more.close}
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-full text-text-on-dark transition-colors hover:bg-white/10"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav aria-label={connectApp.more.label} className="space-y-1">
          {items.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={label}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `${itemClass} ${isActive ? 'bg-primary text-white' : 'text-text-on-dark hover:bg-white/5'}`
              }
            >
              <Icon className="size-5" strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
          <div className="mt-2 space-y-1 border-t border-white/10 pt-2">
            <button
              type="button"
              onClick={() => {
                onClose()
                onSettings()
              }}
              className={`${itemClass} text-text-on-dark hover:bg-white/5`}
            >
              <SettingsIcon className="size-5" strokeWidth={1.75} />
              {settings.label}
            </button>
            <Link
              to={exit.to}
              onClick={onClose}
              className={`${itemClass} text-text-on-dark hover:bg-white/5`}
            >
              <LogOut className="size-5" strokeWidth={1.75} />
              {exit.title}
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}
