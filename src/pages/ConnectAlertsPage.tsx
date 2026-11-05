import { useState } from 'react'
import { AlertRow } from '../components/connect/AlertRow'
import { ConnectPageHeader } from '../components/connect/ConnectPageHeader'
import { ConnectPanel } from '../components/connect/ConnectPanel'
import { useConnect } from '../connect/useConnect'
import { alertsPage as copy, connectApp } from '../data/connect'
import { useToast } from '../toast/useToast'

type Tab = keyof typeof copy.tabs

/** Alert inbox: /connect/alerts. Active, acknowledged and history; acknowledging is local state only. */
export function ConnectAlertsPage() {
  const { alerts, acknowledgedBy, acknowledge } = useConnect()
  const showToast = useToast()
  const [tab, setTab] = useState<Tab>('active')

  const lists: Record<Tab, typeof alerts> = {
    active: alerts.filter((alert) => alert.active && !acknowledgedBy[alert.id]),
    acknowledged: alerts.filter((alert) => acknowledgedBy[alert.id]),
    history: alerts.filter((alert) => !alert.active),
  }

  return (
    <div className="mx-auto max-w-[1280px] px-10 pt-8 pb-16 max-xl:px-6 max-md:px-4 max-md:pt-6">
      <title>{`${copy.title} – ${connectApp.name}`}</title>
      <ConnectPageHeader title={copy.title} subtitle={connectApp.synced} />

      <ConnectPanel flush className="mt-8 overflow-hidden max-md:mt-6">
        <div
          role="tablist"
          aria-label={copy.title}
          className="flex gap-1 border-b border-white/10 px-4 max-md:gap-0 max-md:overflow-x-auto max-md:px-1"
        >
          {(Object.keys(copy.tabs) as Tab[]).map((id) => {
            const selected = id === tab
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setTab(id)}
                className={`relative flex h-14 items-center gap-2 px-4 text-sm font-semibold transition-colors max-md:shrink-0 max-md:px-3 ${
                  selected ? 'text-white' : 'text-text-on-dark-muted hover:text-white'
                }`}
              >
                {copy.tabs[id]}
                <span
                  className={`rounded-pill px-2 py-0.5 text-xs tabular-nums ${
                    id === 'active' && lists.active.length
                      ? 'bg-danger-on-dark text-navy-900'
                      : 'bg-white/10 text-text-on-dark'
                  }`}
                >
                  {lists[id].length}
                </span>
                {selected && (
                  <span
                    aria-hidden
                    className="absolute inset-x-4 bottom-0 h-[3px] rounded-t-sm bg-primary-on-dark max-md:inset-x-3"
                  />
                )}
              </button>
            )
          })}
        </div>

        {lists[tab].length > 0 ? (
          <ul key={tab} role="tabpanel" className="animate-fade-in divide-y divide-white/[0.07]">
            {lists[tab].map((alert) => (
              <AlertRow
                key={alert.id}
                alert={alert}
                acknowledgedBy={acknowledgedBy[alert.id]}
                onAcknowledge={() => {
                  acknowledge(alert.id)
                  showToast({ message: copy.acknowledgedToast(alert.title) })
                }}
              />
            ))}
          </ul>
        ) : (
          <p role="tabpanel" className="px-6 py-12 text-center text-text-on-dark-muted">
            {copy.empty[tab]}
          </p>
        )}
      </ConnectPanel>
    </div>
  )
}
