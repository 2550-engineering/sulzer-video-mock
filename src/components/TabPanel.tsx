import type { ReactNode } from 'react'

type TabPanelProps = {
  idPrefix: string
  tabId: string
  /** Full width, no padding: the content brings its own full-bleed sections and containers. */
  bleed?: boolean
  children: ReactNode
}

/** Content area for the active tab of a <TabBar>. Fades in on every switch. */
export function TabPanel({ idPrefix, tabId, bleed = false, children }: TabPanelProps) {
  return (
    <div
      key={tabId}
      role="tabpanel"
      id={`${idPrefix}-${tabId}-panel`}
      aria-labelledby={`${idPrefix}-${tabId}-tab`}
      className={`min-h-[480px] animate-fade-in ${bleed ? '' : 'site-container py-16'}`}
    >
      {children}
    </div>
  )
}
