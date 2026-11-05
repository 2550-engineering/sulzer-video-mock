import { Outlet, useLocation } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { toolbarPaths } from '../data/personal'
import { ChatWidget } from './ChatWidget'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'
import { PersonalToolbar } from './toolbar/PersonalToolbar'

/**
 * Shell for every route: sticky header, page content, footer and floating chat.
 * Signed in, product, application and search pages also get the personal toolbar.
 */
export function SiteLayout() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const toolbar = user !== null && toolbarPaths.some((path) => path.test(pathname))

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      {/* Content keeps clear of the toolbar where the page margin is narrow (see site-container). */}
      <main
        className={`flex-1 ${toolbar ? 'max-xl:[--sz-toolbar-space:0px] lg:[--sz-toolbar-space:5rem]' : ''}`}
      >
        {/* Keyed by path so each new page fades in; tab and hash changes don't. */}
        <div key={pathname} className="animate-page-in">
          <Outlet />
        </div>
      </main>
      <SiteFooter />
      {toolbar && <PersonalToolbar />}
      <ChatWidget />
    </div>
  )
}
