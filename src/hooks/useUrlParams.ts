import { startTransition, useOptimistic } from 'react'
import { useLocation, useNavigate } from 'react-router'

/**
 * Query params as page state. `update` edits a copy and replaces the history
 * entry, keeping the hash (so a product tab like #models stays selected).
 *
 * React Router applies URL changes in a transition, so a controlled checkbox
 * or toggle would flick back until it lands. `useOptimistic` shows the new
 * state at once.
 */
export function useUrlParams() {
  const { search, hash } = useLocation()
  const navigate = useNavigate()
  const [params, setOptimisticParams] = useOptimistic(new URLSearchParams(search))

  function update(change: (next: URLSearchParams) => void) {
    const next = new URLSearchParams(params)
    change(next)
    startTransition(() => {
      setOptimisticParams(next)
      const query = next.toString()
      navigate({ search: query ? `?${query}` : '', hash }, { replace: true })
    })
  }

  return [params, update] as const
}
