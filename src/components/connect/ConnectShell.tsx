import { Bell, LogOut } from 'lucide-react'
import { useContext, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { ConnectContext } from '../../connect/ConnectContext'
import { connectApp } from '../../data/connect'
import { useToast } from '../../toast/useToast'
import { Avatar } from '../Avatar'
import { SulzerLogo } from '../SulzerLogo'

const railItem =
  'flex w-full flex-col items-center gap-1.5 rounded-md py-2.5 text-[11px] font-medium transition-colors'
const railIdle = 'text-text-on-dark-muted hover:bg-white/5 hover:text-white'

/**
 * Dark app frame for Sulzer Connect: a sticky top bar (sync status, alerts,
 * user), a sticky icon rail of the app's pages, and the page below. The page
 * scrolls the document, so full-page screenshots and recordings see all of it.
 */
export function ConnectShell({ children }: { children: ReactNode }) {
  const { user, signIn } = useAuth()
  const connect = useContext(ConnectContext)
  const showToast = useToast()
  const { nav, settings, exit } = connectApp
  const SettingsIcon = settings.icon
  const openAlerts = connect?.open.length ?? 0

  return (
    <div className="min-h-screen bg-navy-800 text-text-on-dark on-dark">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-navy-900/95 pr-6 backdrop-blur-sm">
        <div className="flex items-center">
          <Link
            to="/"
            aria-label="Sulzer home"
            className="flex h-16 items-center border-r border-white/10 px-6"
          >
            <SulzerLogo variant="white" className="h-5" />
          </Link>
          <p className="ml-6 text-[15px] font-semibold text-white">
            {connectApp.name}
            <span className="ml-2 font-normal text-text-on-dark-muted">{connectApp.section}</span>
          </p>
        </div>

        {user ? (
          <div className="flex items-center gap-5 text-sm">
            <p className="hidden items-center gap-2 text-text-on-dark-muted md:flex">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-success-on-dark opacity-50 [animation-duration:2.4s]" />
                <span className="relative size-2 rounded-full bg-success-on-dark" />
              </span>
              {connectApp.synced}
            </p>
            <Link
              to="/connect/alerts"
              aria-label={connectApp.alertsLabel(openAlerts)}
              className="relative flex size-10 items-center justify-center rounded-full text-text-on-dark transition-colors hover:bg-white/10 hover:text-white"
            >
              <Bell className="size-5" strokeWidth={1.75} />
              {openAlerts > 0 && (
                <span className="absolute top-1 right-0.5 flex size-[18px] items-center justify-center rounded-full bg-danger-on-dark text-[10px] font-bold text-navy-900 tabular-nums">
                  {openAlerts}
                </span>
              )}
            </Link>
            <div className="flex items-center gap-3 border-l border-white/10 pl-5">
              <Avatar initials={user.initials} />
              <div className="leading-tight">
                <p className="font-medium text-white">{user.name}</p>
                <p className="text-xs text-text-on-dark-muted">{user.company}</p>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => signIn()}
            className="h-9 rounded-pill border border-white/25 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            {connectApp.signIn}
          </button>
        )}
      </header>

      <div className="flex">
        {/* The rail's background runs the full page height; the nav sticks under the top bar. */}
        <div className="w-20 shrink-0 border-r border-white/10 bg-navy-900">
          <nav
            aria-label={connectApp.name}
            className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col items-center gap-1 overflow-y-auto px-2 py-3"
          >
            {nav.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `${railItem} ${isActive ? 'bg-primary text-white' : railIdle}`
                }
              >
                <Icon className="size-5" strokeWidth={1.75} />
                {label}
              </NavLink>
            ))}

            <div className="mt-auto w-full space-y-1 border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={() => showToast({ message: connectApp.settingsToast })}
                className={`${railItem} ${railIdle}`}
              >
                <SettingsIcon className="size-5" strokeWidth={1.75} />
                {settings.label}
              </button>
              <Link to={exit.to} title={exit.title} className={`${railItem} ${railIdle}`}>
                <LogOut className="size-5" strokeWidth={1.75} />
                {exit.label}
              </Link>
            </div>
          </nav>
        </div>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
