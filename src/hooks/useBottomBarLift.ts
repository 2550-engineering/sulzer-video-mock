import { useEffect, useState } from 'react'

const selector = '[data-bottom-bar="open"]'

/**
 * Height of the open fixed bottom bars (elements with data-bottom-bar="open",
 * e.g. the sizing selection bar), so a floating button can sit above them.
 * Follows bars opening, closing and changing height.
 */
export function useBottomBarLift() {
  const [lift, setLift] = useState(0)

  useEffect(() => {
    const resize = new ResizeObserver(measure)
    function measure() {
      const bars = [...document.querySelectorAll<HTMLElement>(selector)]
      resize.disconnect()
      bars.forEach((bar) => resize.observe(bar))
      setLift(Math.max(0, ...bars.map((bar) => bar.offsetHeight)))
    }
    const mutations = new MutationObserver(measure)
    mutations.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['data-bottom-bar'],
    })
    measure()
    return () => {
      mutations.disconnect()
      resize.disconnect()
    }
  }, [])

  return lift
}
