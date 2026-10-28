import { useId, type ReactNode } from 'react'

/** A labelled group of options in the suggestion panel. */
export function SuggestionGroup({
  title,
  className = '',
  children,
}: {
  title: string
  className?: string
  children: ReactNode
}) {
  const headingId = useId()
  return (
    <div role="group" aria-labelledby={headingId} className={`px-2 py-3 ${className}`}>
      <div
        id={headingId}
        role="presentation"
        className="px-3 pb-1.5 text-xs font-semibold tracking-[0.08em] text-text-muted uppercase"
      >
        {title}
      </div>
      {children}
    </div>
  )
}
