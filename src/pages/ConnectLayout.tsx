import { LockKeyhole } from 'lucide-react'
import { Outlet, useLocation } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { ConnectShell } from '../components/connect/ConnectShell'
import { ConnectProvider } from '../connect/ConnectProvider'
import { connectApp } from '../data/connect'

/**
 * Sulzer Connect app: /connect/*, outside the website header and footer. The
 * welcome screen is open to everyone; every other page needs a signed-in user.
 */
export function ConnectLayout() {
  const { user, signIn } = useAuth()
  const { pathname } = useLocation()
  const welcome = pathname.replace(/\/$/, '') === '/connect'

  if (!user) {
    return (
      <ConnectShell>
        {welcome ? (
          <Outlet />
        ) : (
          <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-8 max-md:min-h-[calc(100vh-10rem)] max-md:px-4">
            <title>{connectApp.name}</title>
            <div className="max-w-md animate-fade-in text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-white/10 text-primary-on-dark">
                <LockKeyhole className="size-6" strokeWidth={1.75} />
              </span>
              <h1 className="mt-6 text-2xl font-bold tracking-tight text-white">
                {connectApp.signedOut.title}
              </h1>
              <p className="mt-2 text-text-on-dark-muted">{connectApp.signedOut.text}</p>
              <button
                type="button"
                onClick={() => signIn()}
                className="mt-8 inline-flex h-11 items-center rounded-pill bg-primary px-7 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                {connectApp.signedOut.action}
              </button>
            </div>
          </div>
        )}
      </ConnectShell>
    )
  }

  return (
    <ConnectProvider user={user}>
      <ConnectShell>
        <Outlet />
      </ConnectShell>
    </ConnectProvider>
  )
}
