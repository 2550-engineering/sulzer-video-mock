import { useEffect, useState } from 'react'

/** 20 steps of 50 ms: one second, the same on every run. */
const steps = 20
const stepMs = 50

/**
 * A pretend calculation that runs once per `key` (e.g. the sizing input):
 * progress 0 → 100 in fixed steps, then `done`. A new key starts over.
 */
export function useCalculating(key: string) {
  const [run, setRun] = useState({ key: '', step: 0 })

  useEffect(() => {
    let step = 0
    const timer = window.setInterval(() => {
      step += 1
      setRun({ key, step })
      if (step >= steps) window.clearInterval(timer)
    }, stepMs)
    return () => window.clearInterval(timer)
  }, [key])

  const step = run.key === key ? run.step : 0
  return { progress: Math.round((step / steps) * 100), done: step >= steps }
}
