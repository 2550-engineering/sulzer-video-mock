import { CircleCheck, Info, TriangleAlert } from 'lucide-react'
import { replacementPage as copy } from '../../data/replacementPage'
import type { FitNoteKind } from '../../types'

const icons = {
  ok: { Icon: CircleCheck, className: 'text-success' },
  info: { Icon: Info, className: 'text-primary' },
  warning: { Icon: TriangleAlert, className: 'text-warning-strong' },
} satisfies Record<FitNoteKind, unknown>

/** "Will it fit?": warnings first, then information, then what simply fits. */
export function FitNotes({ notes }: { notes: { kind: FitNoteKind; text: string }[] }) {
  return (
    <section className="rounded-lg border border-border bg-white px-6 py-5">
      <h2 className="text-lg font-bold tracking-tight text-navy-900">{copy.fit.title}</h2>
      <ul className="mt-3 space-y-2.5">
        {notes.map((note) => {
          const { Icon, className } = icons[note.kind]
          return (
            <li
              key={note.text}
              className={`flex gap-3 rounded-md px-3 py-2 text-[15px] ${
                note.kind === 'warning' ? 'bg-warning-tint text-navy-900' : 'text-text'
              }`}
            >
              <Icon aria-hidden className={`mt-0.5 size-[18px] shrink-0 ${className}`} />
              {note.text}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
