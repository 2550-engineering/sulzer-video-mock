import { useEffect, useRef, useState, type PointerEvent, type RefObject } from 'react'
import { belowDesktop } from './useMediaQuery'

/**
 * Pointer handlers for a chart's reading line. With a mouse it behaves as
 * before: the reading follows the pointer and clears when it leaves. Below
 * 1280px, touch (and pen) also work: a tap sets the reading, dragging moves it,
 * and it stays after lifting the finger until the user taps outside `container`.
 * Pair with `touch-action: pan-y` on the chart so vertical swipes still scroll.
 */
export function useChartTouch<E extends Element>(
  container: RefObject<HTMLElement | null>,
  read: (event: PointerEvent<E>) => void,
  clear: () => void,
) {
  const dragging = useRef(false)
  const [pinned, setPinned] = useState(false)

  // A pinned (touch) reading clears on the next tap outside the chart.
  useEffect(() => {
    if (!pinned) return
    function handlePointerDown(event: globalThis.PointerEvent) {
      if (container.current?.contains(event.target as Node)) return
      setPinned(false)
      clear()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [pinned, container, clear])

  const touch = (event: PointerEvent<E>) =>
    event.pointerType !== 'mouse' && window.matchMedia?.(belowDesktop).matches

  return {
    onPointerDown(event: PointerEvent<E>) {
      if (!touch(event)) return
      dragging.current = true
      setPinned(true)
      read(event)
    },
    onPointerMove(event: PointerEvent<E>) {
      if (!touch(event) || dragging.current) read(event)
    },
    onPointerUp(event: PointerEvent<E>) {
      if (touch(event)) dragging.current = false
    },
    onPointerCancel(event: PointerEvent<E>) {
      if (touch(event)) dragging.current = false
    },
    onPointerLeave(event: PointerEvent<E>) {
      // A finger lifting (or a vertical scroll taking over) keeps the reading.
      if (!touch(event)) clear()
    },
  }
}
