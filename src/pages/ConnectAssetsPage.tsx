import { Plus, Search, Settings2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { AccountsTable } from '../components/connect/AccountsTable'
import { AssetMonitorTable } from '../components/connect/AssetMonitorTable'
import { ConnectPageHeader } from '../components/connect/ConnectPageHeader'
import { ConnectPanel } from '../components/connect/ConnectPanel'
import { useConnect } from '../connect/useConnect'
import { customers } from '../data/assets'
import { connectApp, assetsPage as copy } from '../data/connect'
import { matchesQuery } from '../lib/assetList'

/**
 * Asset Monitor: /connect/assets. The end user sees their connected assets by
 * site; a partner (or service provider) sees their customer accounts, each
 * expanding to its assets.
 */
export function ConnectAssetsPage() {
  const { user } = useAuth()
  const { assets } = useConnect()
  const [query, setQuery] = useState('')
  const partner = user!.kind === 'partner'
  const connected = assets.filter((asset) => asset.connected)
  const shown = connected.filter((asset) => matchesQuery(asset, query))
  const q = query.trim().toLowerCase()
  const accountIds = customers
    .filter(
      (customer) =>
        !q ||
        customer.name.toLowerCase().includes(q) ||
        shown.some((asset) => asset.customerId === customer.id),
    )
    .map((customer) => customer.id)
  const notConnected = assets.length - connected.length

  return (
    <div className="mx-auto max-w-[1680px] px-10 pt-8 pb-16 max-xl:px-6 max-md:px-4 max-md:pt-6">
      <title>{`${copy.title} – ${connectApp.name}`}</title>

      <ConnectPageHeader
        back={{ label: copy.back, to: '/connect/dashboard' }}
        title={partner ? copy.accountsTitle : copy.title}
        subtitle={`${user!.company} · ${connectApp.synced}`}
      />

      <ConnectPanel flush className="mt-8 overflow-hidden max-md:mt-6">
        <div className="flex items-center gap-4 px-6 py-4 max-md:gap-3 max-md:px-4">
          <div className="relative w-full max-w-sm">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-text-on-dark-muted"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={partner ? copy.searchAccounts : copy.search}
              aria-label={partner ? copy.searchAccounts : copy.search}
              className="h-10 w-full rounded-md border border-white/15 bg-navy-800 pr-3 pl-10 text-sm text-white transition-colors placeholder:text-text-on-dark-muted focus:border-primary-on-dark focus-visible:outline-none"
            />
          </div>
          <span className="text-sm text-text-on-dark-muted tabular-nums max-md:shrink-0">
            {shown.length}/{connected.length}
          </span>
          <Settings2
            aria-hidden
            className="ml-auto size-5 text-text-on-dark-muted max-md:shrink-0"
          />
        </div>

        {partner ? (
          <AccountsTable
            key={q}
            assets={shown}
            accountIds={accountIds}
            defaultOpen={q ? accountIds : []}
          />
        ) : shown.length > 0 ? (
          <AssetMonitorTable assets={shown} />
        ) : (
          <p className="border-t border-white/10 px-6 py-10 text-text-on-dark-muted">
            {copy.noResults}
          </p>
        )}

        {!partner && notConnected > 0 && (
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 px-6 py-4 text-sm text-text-on-dark-muted max-md:px-4">
            {copy.notConnected(notConnected)}
            <Link
              to={connectApp.welcome.action.to}
              className="inline-flex items-center gap-1.5 font-semibold text-primary-on-dark hover:text-white"
            >
              <Plus className="size-4" />
              {copy.connectMore}
            </Link>
          </p>
        )}
      </ConnectPanel>
    </div>
  )
}
