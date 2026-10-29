import { useEffect, useRef, useState } from 'react'

/** Counts from the previous value to `value` in `duration` ms (ease-out), e.g. "18 → 2 best matches". */
export function AnimatedNumber({ value, duration = 250 }: { value: number; duration?: number }) {
  const [shown, setShown] = useState(value)
  const from = useRef(value)

  useEffect(() => {
    const start = from.current
    if (start === value) return
    const begin = performance.now()
    let frame = requestAnimationFrame(function step(now) {
      const t = Math.min(1, (now - begin) / duration)
      const current = Math.round(start + (value - start) * (1 - (1 - t) ** 3))
      from.current = current
      setShown(current)
      if (t < 1) frame = requestAnimationFrame(step)
    })
    return () => cancelAnimationFrame(frame)
  }, [value, duration])

  return <span className="tabular-nums">{shown}</span>
}
