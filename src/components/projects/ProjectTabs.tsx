type ProjectTabsProps<T extends string> = {
  tabs: { id: T; label: string; count: number }[]
  active: T
  onSelect: (id: T) => void
  /** Id prefix linking each tab to the panel below (`${idPrefix}-panel`). */
  idPrefix: string
}

/** The project's main tabs (Products, Discussion, Documents) with counts. */
export function ProjectTabs<T extends string>({
  tabs,
  active,
  onSelect,
  idPrefix,
}: ProjectTabsProps<T>) {
  return (
    <div
      role="tablist"
      className="mt-6 flex gap-1 border-b border-border-strong max-md:[scrollbar-width:none] max-md:overflow-x-auto max-md:overscroll-x-contain"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          id={`${idPrefix}-${tab.id}-tab`}
          aria-selected={active === tab.id}
          aria-controls={`${idPrefix}-panel`}
          onClick={() => onSelect(tab.id)}
          className={`relative px-4 pt-2 pb-3 text-base font-semibold transition-colors max-md:shrink-0 max-md:px-3 max-md:whitespace-nowrap ${
            active === tab.id ? 'text-navy-900' : 'text-text-muted hover:text-navy-900'
          }`}
        >
          {tab.label}
          <span
            className={`ml-2 rounded-pill px-2 py-0.5 text-xs tabular-nums ${
              active === tab.id ? 'bg-primary text-white' : 'bg-surface-sunken text-text-muted'
            }`}
          >
            {tab.count}
          </span>
          {active === tab.id && (
            <span
              aria-hidden
              className="absolute inset-x-2 -bottom-px h-[3px] rounded-t-sm bg-primary max-md:bottom-0"
            />
          )}
        </button>
      ))}
    </div>
  )
}
