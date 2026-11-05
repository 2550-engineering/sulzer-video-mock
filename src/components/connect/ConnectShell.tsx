import { Bell, Ellipsis, LogOut } from 'lucide-react'
import { useContext, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { ConnectContext } from '../../connect/ConnectContext'
import { connectApp } from '../../data/connect'
import { useToast } from '../../toast/useToast'
import { Avatar } from '../Avatar'
import { SulzerLogo } from '../SulzerLogo'
import { ConnectMoreSheet } from './ConnectMoreSheet'

const railItem =
  'flex w-full flex-col items-center gap-1.5 rounded-md py-2.5 text-[11px] font-medium transition-colors'
const railIdle = 'text-text-on-dark-muted hover:bg-white/5 hover:text-white'
/** Pages in the phone tab bar; the fifth tab, "More", opens the rest. */
const phoneTabs = 4

/**
 * Dark app frame for Sulzer Connect: a sticky top bar (sync status, alerts,
 * user), a sticky icon rail of the app's pages, and the page below. The page
 * scrolls the document, so full-page screenshots and recordings see all of it.
 * On tablets the rail shows icons only; on phones it becomes a tab bar at the
 * bottom (with "More" for the rest) and the top bar shrinks.
 */
export function ConnectShell({ children }: { children: ReactNode }) {
  const { user, signIn } = useAuth()
  const connect = useContext(ConnectContext)
  const showToast = useToast()
  const { nav, settings, exit } = connectApp
  const SettingsIcon = settings.icon
  const openAlerts = connect?.open.length ?? 0
  const { pathname } = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)
  const moreItems = nav.slice(phoneTabs)
  const moreActive = moreItems.some(({ to }) => pathname.startsWith(to))
  const openSettings = () => showToast({ message: connectApp.settingsToast })

  return (
    <div className="min-h-screen bg-navy-800 text-text-on-dark on-dark">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-navy-900/95 pr-4 backdrop-blur-sm sm:pr-6">
        <div className="flex items-center">
          <Link
            to="/"
            aria-label="Sulzer home"
            className="flex h-16 items-center border-r border-white/10 px-4 sm:px-6"
          >
            <SulzerLogo variant="white" className="h-4 sm:h-5" />
          </Link>
          <p className="ml-4 text-[15px] font-semibold whitespace-nowrap text-white sm:ml-6">
            {connectApp.name}
            <span className="ml-2 font-normal text-text-on-dark-muted max-sm:hidden">
              {connectApp.section}
            </span>
          </p>
        </div>

        {user ? (
          <div className="flex items-center gap-3 text-sm sm:gap-5">
            <p className="hidden items-center gap-2 text-text-on-dark-muted max-lg:hidden! md:flex">
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
            <div className="flex items-center gap-3 border-l border-white/10 pl-3 sm:pl-5">
              <Avatar initials={user.initials} />
              <div className="leading-tight max-lg:hidden max-sm:hidden">
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
        <div className="w-20 shrink-0 border-r border-white/10 bg-navy-900 max-xl:w-16 max-md:hidden max-sm:hidden">
          <nav
            aria-label={connectApp.name}
            className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col items-center gap-1 overflow-y-auto px-2 py-3"
          >
            {nav.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `${railItem} ${isActive ? 'bg-primary text-white' : railIdle} max-xl:py-3`
                }
              >
                <Icon className="size-5" strokeWidth={1.75} />
                <span className="max-xl:sr-only">{label}</span>
              </NavLink>
            ))}

            <div className="mt-auto w-full space-y-1 border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={openSettings}
                className={`${railItem} ${railIdle} max-xl:py-3`}
              >
                <SettingsIcon className="size-5" strokeWidth={1.75} />
                <span className="max-xl:sr-only">{settings.label}</span>
              </button>
              <Link
                to={exit.to}
                title={exit.title}
                className={`${railItem} ${railIdle} max-xl:py-3`}
              >
                <LogOut className="size-5" strokeWidth={1.75} />
                <span className="max-xl:sr-only">{exit.label}</span>
              </Link>
            </div>
          </nav>
        </div>

        <main className="min-w-0 flex-1 max-md:pb-[calc(6rem+env(safe-area-inset-bottom))]! max-sm:pb-20">
          {children}
        </main>
      </div>

      <nav
        aria-label={connectApp.name}
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 bg-navy-900/95 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-sm max-md:flex! sm:hidden"
      >
        {nav.slice(0, phoneTabs).map(({ label, to, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `${railItem} ${isActive ? 'text-white' : 'text-text-on-dark-muted'}`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-7 w-12 items-center justify-center rounded-pill transition-colors ${isActive ? 'bg-primary' : ''}`}
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
        <button
          type="button"
          aria-expanded={moreOpen}
          onClick={() => setMoreOpen((open) => !open)}
          className={`${railItem} ${moreActive || moreOpen ? 'text-white' : 'text-text-on-dark-muted'}`}
        >
          <span
            className={`flex h-7 w-12 items-center justify-center rounded-pill transition-colors ${moreActive ? 'bg-primary' : moreOpen ? 'bg-white/10' : ''}`}
          >
            <Ellipsis className="size-5" strokeWidth={1.75} />
          </span>
          {connectApp.more.label}
        </button>
      </nav>

      <ConnectMoreSheet
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        items={moreItems}
        onSettings={openSettings}
      />
    </div>
  )
}
