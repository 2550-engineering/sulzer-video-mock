import { useCallback, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'
import type { TabDef } from '../types'

/**
 * Active tab taken from the URL hash (e.g. `#models`), falling back to the first tab.
 * `select` swaps the hash in place — no reload, no new history entry — and smoothly
 * scrolls the tab bar up to just under the site header, so the new tab starts in view.
 * Pass `anchorRef` to <TabBar>.
 */
export function useHashTab(tabs: TabDef[]) {
  const { pathname, search, hash } = useLocation()
  const navigate = useNavigate()
  const anchorRef = useRef<HTMLDivElement>(null)

  const requested = decodeURIComponent(hash.slice(1))
  const active = tabs.some((tab) => tab.id === requested) ? requested : tabs[0].id

  const select = useCallback(
    (id: string) => {
      navigate({ pathname, search, hash: id }, { replace: true })
      const anchor = anchorRef.current
      if (!anchor) return
      const headerHeight =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--sz-header-height'),
        ) || 0
      const barTop = anchor.getBoundingClientRect().top + window.scrollY - headerHeight
      if (Math.abs(window.scrollY - barTop) > 1)
        window.scrollTo({ top: barTop, behavior: 'smooth' })
    },
    [navigate, pathname, search],
  )

  return { active, select, anchorRef }
}
