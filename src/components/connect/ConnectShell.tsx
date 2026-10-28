import { LogOut } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { connectApp } from '../../data/connect'
import { Avatar } from '../Avatar'
import { SulzerLogo } from '../SulzerLogo'

const railItem =
  'flex w-full flex-col items-center gap-1.5 rounded-md py-2.5 text-[11px] font-medium transition-colors'

/** Full-screen dark app frame for Sulzer Connect: top bar, left icon rail and a scrolling content area. */
export function ConnectShell({ children }: { children: ReactNode }) {
  const { user, signIn } = useAuth()
  const { nav, settings, exit } = connectApp
  const SettingsIcon = settings.icon

  return (
    <div className="flex h-screen flex-col bg-navy-800 text-text-on-dark on-dark">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-navy-900 pr-6">
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
          <div className="flex items-center gap-3 text-sm">
            <Avatar initials={user.initials} />
            <span className="text-white">{user.name}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={signIn}
            className="h-9 rounded-pill border border-white/25 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Sign in
          </button>
        )}
      </header>

      <div className="flex min-h-0 flex-1">
        <nav
          aria-label={connectApp.name}
          className="flex w-20 shrink-0 flex-col items-center gap-1 border-r border-white/10 bg-navy-900 px-2 py-3"
        >
          {nav.map(({ label, icon: Icon }, i) => (
            <button
              key={label}
              type="button"
              aria-current={i === 0 ? 'page' : undefined}
              className={`${railItem} ${
                i === 0
                  ? 'bg-primary text-white'
                  : 'text-text-on-dark-muted hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="size-5" strokeWidth={1.75} />
              {label}
            </button>
          ))}

          <div className="mt-auto w-full space-y-1 border-t border-white/10 pt-3">
            <button
              type="button"
              className={`${railItem} text-text-on-dark-muted hover:bg-white/5 hover:text-white`}
            >
              <SettingsIcon className="size-5" strokeWidth={1.75} />
              {settings.label}
            </button>
            <Link
              to={exit.to}
              title={exit.title}
              className={`${railItem} text-text-on-dark-muted hover:bg-white/5 hover:text-white`}
            >
              <LogOut className="size-5" strokeWidth={1.75} />
              {exit.label}
            </Link>
          </div>
        </nav>

        <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
