import { matchRanges } from '../../lib/search'

/** `text` with every word of `query` in bold. */
export function Highlight({ text, query }: { text: string; query: string }) {
  const parts: { text: string; match: boolean }[] = []
  let at = 0
  for (const [start, end] of matchRanges(text, query)) {
    if (start > at) parts.push({ text: text.slice(at, start), match: false })
    parts.push({ text: text.slice(start, end), match: true })
    at = end
  }
  if (at < text.length) parts.push({ text: text.slice(at), match: false })

  return parts.map((part, i) =>
    part.match ? (
      <b key={i} className="font-bold text-navy-900">
        {part.text}
      </b>
    ) : (
      part.text
    ),
  )
}
