import { Outlet, useLocation } from 'react-router'
import { ChatWidget } from './ChatWidget'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

/** Shell for every route: sticky header, page content, footer and floating chat. */
export function SiteLayout() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Keyed by path so each new page fades in; tab and hash changes don't. */}
        <div key={pathname} className="animate-page-in">
          <Outlet />
        </div>
      </main>
      <SiteFooter />
      <ChatWidget />
    </div>
  )
}
