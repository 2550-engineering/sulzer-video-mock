import { useState } from 'react'
import { compactControl } from './CompactSelect'

type CompactNumberProps = {
  id: string
  value: number
  onValue: (value: number) => void
  /** Which numbers are passed on; default: greater than zero. */
  accept?: (value: number) => boolean
  invalid?: boolean
}

const positive = (value: number) => value > 0

/**
 * Small number field. The text is kept while typing (even "" or "3."), and
 * only accepted numbers are passed on; a value changed from outside (chart
 * click, reset, load) replaces the text.
 */
export function CompactNumber({
  id,
  value,
  onValue,
  accept = positive,
  invalid,
}: CompactNumberProps) {
  const [draft, setDraft] = useState<{ text: string; value: number } | null>(null)
  const text = draft && draft.value === value ? draft.text : String(value)
  const parse = (raw: string) => Number(raw.replace(',', '.'))
  const valid = (raw: string) =>
    raw.trim() !== '' && Number.isFinite(parse(raw)) && accept(parse(raw))
  const showInvalid = invalid || (draft !== null && draft.value === value && !valid(draft.text))

  return (
    <input
      id={id}
      inputMode="decimal"
      value={text}
      onChange={(e) => {
        const next = e.target.value
        const ok = valid(next)
        setDraft({ text: next, value: ok ? parse(next) : value })
        if (ok) onValue(parse(next))
      }}
      onBlur={() => setDraft(null)}
      aria-invalid={showInvalid}
      className={`${compactControl} tabular-nums ${showInvalid ? 'border-danger' : ''}`}
    />
  )
}
