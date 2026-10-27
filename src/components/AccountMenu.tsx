import { ChevronDown, CircleUserRound, LayoutDashboard, LogOut } from 'lucide-react'
import { Link } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { popoverClasses } from '../lib/popover'
import { Avatar } from './Avatar'

type AccountMenuProps = {
  open: boolean
  onToggle: () => void
  onClose: () => void
  buttonClassName: string
}

/** "Sign in" when logged out; avatar, name and a small menu when logged in. */
export function AccountMenu({ open, onToggle, onClose, buttonClassName }: AccountMenuProps) {
  const { user, signIn, signOut } = useAuth()

  if (!user) {
    return (
      <button type="button" onClick={signIn} className={buttonClassName}>
        <CircleUserRound className="size-5" strokeWidth={1.75} />
        Sign in
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="account-menu"
        className={`${buttonClassName} pl-1.5`}
      >
        <Avatar initials={user.initials} className="ring-2 ring-white/20" />
        {user.name}
        <ChevronDown
          className={`size-4 text-white/70 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        id="account-menu"
        inert={!open}
        className={`absolute top-[calc(100%+14px)] right-0 w-72 overflow-hidden rounded-lg bg-white text-text shadow-card ring-1 ring-navy-900/5 ${popoverClasses(open)}`}
      >
        <div className="flex items-center gap-3 border-b border-border bg-surface-muted px-5 py-4">
          <Avatar initials={user.initials} size="md" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-navy-900">{user.name}</p>
            <p className="truncate text-sm text-text-muted">{user.company}</p>
          </div>
        </div>
        <ul className="p-2 text-sm font-medium">
          <li>
            <Link
              to="/my-sulzer"
              onClick={onClose}
              className="flex items-center gap-3 rounded-sm px-3 py-2.5 transition-colors hover:bg-primary-tint hover:text-primary"
            >
              <LayoutDashboard className="size-[18px] text-primary" strokeWidth={1.75} />
              My Pages
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                onClose()
                signOut()
              }}
              className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 transition-colors hover:bg-primary-tint hover:text-primary"
            >
              <LogOut className="size-[18px] text-primary" strokeWidth={1.75} />
              Sign out
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}
