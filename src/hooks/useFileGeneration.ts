import { useEffect, useRef, useState } from 'react'

/** 20 steps of 100 ms: 2 seconds, the same on every run. */
const steps = 20
const stepMs = 100

/**
 * A pretend "generate file" job for `key` (e.g. model + format). Progress runs
 * 0 → 100 in fixed steps. Changing `key` shows the idle state again, so a new
 * selection needs a new run.
 */
export function useFileGeneration(key: string) {
  const [run, setRun] = useState({ key: '', progress: -1 })
  const timer = useRef<number>(undefined)
  useEffect(() => () => window.clearInterval(timer.current), [])

  const progress = run.key === key ? run.progress : -1
  const status = progress < 0 ? 'idle' : progress < 100 ? 'generating' : 'ready'

  function start() {
    window.clearInterval(timer.current)
    let step = 0
    setRun({ key, progress: 0 })
    timer.current = window.setInterval(() => {
      step += 1
      setRun({ key, progress: Math.round((step / steps) * 100) })
      if (step >= steps) window.clearInterval(timer.current)
    }, stepMs)
  }

  return { status, progress, start } as const
}
