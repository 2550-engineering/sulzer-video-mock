import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Jumps to the top on every route change, before paint so the new page never
 * flashes at the old scroll position. `instant` overrides the smooth scrolling
 * set on <html> for in-page anchors.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
