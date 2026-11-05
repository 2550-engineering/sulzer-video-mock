import { ChevronDown, CircleUserRound, LogOut } from 'lucide-react'
import { Link } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { accountMenuLinks, partnerMenuLinks } from '../config/navigation'
import { popoverClasses } from '../lib/popover'
import { Avatar } from './Avatar'
import { PartnerBadge } from './PartnerBadge'

const menuItem =
  'flex items-center gap-3 rounded-sm px-3 py-2.5 transition-colors hover:bg-primary-tint hover:text-primary'

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
      <button type="button" onClick={() => signIn()} className={buttonClassName}>
        <CircleUserRound className="size-5 text-primary max-xl:size-6" strokeWidth={1.75} />
        <span className="max-xl:sr-only">Sign in</span>
      </button>
    )
  }

  const partner = user.kind === 'partner'
  const links = partner
    ? [...accountMenuLinks.slice(0, 1), ...partnerMenuLinks, ...accountMenuLinks.slice(1)]
    : accountMenuLinks

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="account-menu"
        className={`${buttonClassName} pl-1.5`}
      >
        <Avatar initials={user.initials} className="ring-2 ring-primary-tint-strong" />
        <span className="max-xl:sr-only">{user.name}</span>
        {partner && <PartnerBadge className="max-xl:hidden" />}
        <ChevronDown
          className={`size-4 text-text-subtle transition-transform duration-200 max-xl:hidden ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        id="account-menu"
        inert={!open}
        className={`absolute top-[calc(100%+24px)] right-0 w-72 overflow-hidden rounded-lg bg-white text-text shadow-card ring-1 ring-navy-900/5 max-xl:top-[calc(100%+10px)] max-md:fixed max-md:inset-x-4 max-md:top-[calc(var(--sz-header-height)+8px)] max-md:w-auto ${popoverClasses(open)}`}
      >
        <div className="flex items-center gap-3 border-b border-border bg-surface-muted px-5 py-4">
          <Avatar initials={user.initials} size="md" />
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-semibold text-navy-900">
              <span className="truncate">{user.name}</span>
              {partner && <PartnerBadge />}
            </p>
            <p className="truncate text-sm text-text-muted">{user.company}</p>
            {user.partner && (
              <p className="truncate text-xs text-text-muted">{user.partner.type}</p>
            )}
          </div>
        </div>
        <ul className="p-2 text-sm font-medium">
          {links.map(({ label, to, icon: Icon }) => (
            <li key={to}>
              <Link to={to} onClick={onClose} className={menuItem}>
                <Icon className="size-[18px] text-primary" strokeWidth={1.75} />
                {label}
              </Link>
            </li>
          ))}
          <li className="mt-2 border-t border-border pt-2">
            <button
              type="button"
              onClick={() => {
                onClose()
                signOut()
              }}
              className={`w-full ${menuItem}`}
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
