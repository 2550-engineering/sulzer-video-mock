import type { ReactNode } from 'react'
import { FileTypeIcon } from '../product/FileTypeIcon'

type ProjectFileRowProps = {
  format: string
  title: string
  /** Line under the title, e.g. the document number and size. */
  meta: string
  /** Marks the row, e.g. the drawing being previewed. */
  active?: boolean
  /** Buttons on the right. */
  children: ReactNode
}

/** A file in the project Files drawer: type icon, title, details and actions. */
export function ProjectFileRow({
  format,
  title,
  meta,
  active = false,
  children,
}: ProjectFileRowProps) {
  return (
    <li
      className={`flex items-center gap-4 px-4 py-3 transition-colors duration-150 ${
        active ? 'bg-primary-tint' : 'hover:bg-surface-subtle'
      }`}
    >
      <FileTypeIcon format={format} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-navy-900">{title}</p>
        <p className="mt-0.5 text-xs text-text-muted tabular-nums">{meta}</p>
      </div>
      <div className="flex shrink-0 gap-1">{children}</div>
    </li>
  )
}
