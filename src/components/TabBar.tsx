import type { RefObject } from 'react'
import type { TabDef } from '../types'

type TabBarProps = {
  tabs: TabDef[]
  active: string
  onSelect: (id: string) => void
  /** From useHashTab, so switching tabs can scroll back to the bar. */
  anchorRef: RefObject<HTMLDivElement | null>
  /** Prefix for tab/panel ids, so `aria-controls` points at `${idPrefix}-${tab.id}-panel`. */
  idPrefix: string
}

/** White tab strip that sticks under the site header. Pair with <TabPanel> and useHashTab. */
export function TabBar({ tabs, active, onSelect, anchorRef, idPrefix }: TabBarProps) {
  return (
    <>
      <div ref={anchorRef} aria-hidden />
      <div className="sticky top-(--sz-header-height) z-40 border-b border-border bg-white/95 backdrop-blur-sm">
        <div className="site-container">
          <div role="tablist" className="-ml-4 flex overflow-x-auto">
            {tabs.map((tab) => {
              const selected = tab.id === active
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`${idPrefix}-${tab.id}-tab`}
                  aria-selected={selected}
                  aria-controls={`${idPrefix}-${tab.id}-panel`}
                  onClick={() => onSelect(tab.id)}
                  className={[
                    'relative h-16 shrink-0 px-4 text-[15px] whitespace-nowrap transition-colors',
                    'after:absolute after:inset-x-4 after:bottom-0 after:h-[3px] after:rounded-t-sm after:bg-primary after:transition-transform after:duration-200',
                    selected
                      ? 'font-semibold text-navy-900 after:scale-x-100'
                      : 'font-medium text-text-muted after:scale-x-0 hover:text-navy-900',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
