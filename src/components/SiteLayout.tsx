import { Outlet, useLocation } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { assistantPaths } from '../config/navigation'
import { collapsedToolbarPaths, toolbarPaths } from '../data/personal'
import { ChatWidget } from './ChatWidget'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'
import { ReplacementAssistant } from './replacement/ReplacementAssistant'
import { PersonalToolbar } from './toolbar/PersonalToolbar'

/**
 * Shell for every route: sticky header, page content, footer and floating chat.
 * Signed in, product, application and search pages also get the personal toolbar.
 * The Replacement Guide swaps the chat card for the Sulzer Assistant, which starts
 * over each time the page is entered.
 */
export function SiteLayout() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const toolbar = user !== null && toolbarPaths.some((path) => path.test(pathname))
  // Tucked away: it overlays the page when opened, so the content needs no room for it.
  const toolbarCollapsible = collapsedToolbarPaths.some((path) => path.test(pathname))
  const toolbarSpace = toolbar && !toolbarCollapsible
  const assistant = assistantPaths.includes(pathname)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      {/* Content keeps clear of the toolbar where the page margin is narrow (see site-container). */}
      <main
        className={`flex-1 ${toolbarSpace ? 'max-xl:[--sz-toolbar-space:0px] lg:[--sz-toolbar-space:5rem]' : ''}`}
      >
        {/* Keyed by path so each new page fades in; tab and hash changes don't. */}
        <div key={pathname} className="animate-page-in">
          <Outlet />
        </div>
      </main>
      <SiteFooter />
      {toolbar && (
        <PersonalToolbar
          key={toolbarCollapsible ? 'collapsible' : 'fixed'}
          collapsible={toolbarCollapsible}
        />
      )}
      {assistant ? <ReplacementAssistant /> : <ChatWidget />}
    </div>
  )
}
