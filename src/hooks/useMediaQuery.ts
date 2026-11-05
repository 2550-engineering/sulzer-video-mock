import { useSyncExternalStore } from 'react'

/** Whether a media query matches, kept up to date (false where matchMedia is missing). */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia?.(query)
      list?.addEventListener('change', onChange)
      return () => list?.removeEventListener('change', onChange)
    },
    () => window.matchMedia?.(query).matches ?? false,
    () => false,
  )
}

/** Below the desktop layout (phones and tablets, < 1280px). */
export const belowDesktop = '(max-width: 1279px)'
