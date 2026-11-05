import { useLayoutEffect, useRef, useState } from 'react'

/**
 * Width of an element in CSS pixels, kept up to date as it resizes. Charts use
 * it to draw at their real size, so text and strokes stay crisp. 0 until measured.
 */
export function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, width] as const
}
