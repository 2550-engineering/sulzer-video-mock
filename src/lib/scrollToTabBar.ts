/**
 * Smoothly scrolls a tab bar's anchor up to just under the sticky site header,
 * so the newly selected tab starts in view. Does nothing when it is already there.
 */
export function scrollToTabBar(anchor: HTMLElement | null) {
  if (!anchor) return
  const headerHeight =
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sz-header-height')) ||
    0
  const barTop = anchor.getBoundingClientRect().top + window.scrollY - headerHeight
  if (Math.abs(window.scrollY - barTop) > 1) window.scrollTo({ top: barTop, behavior: 'smooth' })
}
