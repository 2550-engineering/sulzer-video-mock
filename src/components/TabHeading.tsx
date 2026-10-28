import type { ReactNode } from 'react'

type TabHeadingProps = {
  title: string
  /** Shown on the right, e.g. a count or a link. */
  children?: ReactNode
}

/** Section heading inside a tab panel. */
export function TabHeading({ title, children }: TabHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <h2 className="text-[2rem] leading-tight font-bold tracking-tight text-brand">{title}</h2>
      {children}
    </div>
  )
}
