import type { ReactNode } from 'react'

type TabPanelProps = {
  idPrefix: string
  tabId: string
  children: ReactNode
}

/** Content area for the active tab of a <TabBar>. Fades in on every switch. */
export function TabPanel({ idPrefix, tabId, children }: TabPanelProps) {
  return (
    <div
      key={tabId}
      role="tabpanel"
      id={`${idPrefix}-${tabId}-panel`}
      aria-labelledby={`${idPrefix}-${tabId}-tab`}
      className="site-container min-h-[480px] animate-fade-in py-16"
    >
      {children}
    </div>
  )
}
