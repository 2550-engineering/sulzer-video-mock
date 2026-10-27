import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { ChatWidget } from './ChatWidget'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

/** Shell for every route: sticky header, page content, footer and floating chat. */
export function SiteLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <ChatWidget />
    </div>
  )
}
