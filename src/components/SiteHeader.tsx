import { ChevronDown, Globe, LayoutGrid, Search, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { market } from '../config/demo'
import { mainNav } from '../config/navigation'
import { useDismiss } from '../hooks/useDismiss'
import { AccountMenu } from './AccountMenu'
import { MegaMenu } from './MegaMenu'
import { QuickLinksPanel } from './QuickLinksPanel'
import { SearchPanel } from './SearchPanel'
import { SulzerLogo } from './SulzerLogo'

type Panel = 'products' | 'quick-links' | 'search' | 'account'

const utilityButton =
  'flex h-10 items-center gap-2 rounded-sm px-3 text-navy-900 transition-colors hover:bg-surface-muted hover:text-primary'

function navItemClass(active: boolean) {
  return [
    'relative flex items-center gap-1.5 px-4 text-[15px] font-medium transition-colors',
    'after:absolute after:inset-x-4 after:bottom-0 after:h-[3px] after:rounded-t-sm after:bg-primary-on-dark after:transition-transform after:duration-200',
    active
      ? 'text-white after:scale-x-100'
      : 'text-white/80 after:scale-x-0 hover:text-white hover:after:scale-x-100',
  ].join(' ')
}

/** Sticky header: white logo row (market, quick links, account) and navy main nav. */
export function SiteHeader() {
  const { pathname } = useLocation()
  const headerRef = useRef<HTMLElement>(null)
  // Remember the path a panel was opened on, so navigating anywhere closes it.
  const [openState, setOpenState] = useState<{ panel: Panel; path: string } | null>(null)
  const [megaMenuSession, setMegaMenuSession] = useState(0)
  const open = openState?.path === pathname ? openState.panel : null

  const close = useCallback(() => setOpenState(null), [])
  function toggle(panel: Panel) {
    if (open === panel) return close()
    if (panel === 'products') setMegaMenuSession((n) => n + 1)
    setOpenState({ panel, path: pathname })
  }

  useDismiss(headerRef, open !== null, close)

  const dimPage = open === 'products' || open === 'search'
  const productsActive = open === 'products' || (open === null && pathname.startsWith('/products'))

  return (
    <header ref={headerRef} className="sticky top-0 z-50">
      <div className="relative z-20">
        <div className="border-b border-border bg-white">
          <div className="site-container flex h-20 items-center justify-between">
            <Link to="/" aria-label="Sulzer home" className="-m-1 rounded-sm p-1">
              <SulzerLogo variant="blue" className="h-7" />
            </Link>

            <div className="-mr-3 flex items-center gap-1 text-sm font-medium">
              <button type="button" className={utilityButton}>
                <Globe className="size-[18px] text-primary" strokeWidth={1.75} />
                {market.country} – {market.languageCode}
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggle('quick-links')}
                  aria-expanded={open === 'quick-links'}
                  aria-controls="quick-links-panel"
                  className={`${utilityButton} ${open === 'quick-links' ? 'bg-surface-muted text-primary' : ''}`}
                >
                  <LayoutGrid className="size-[18px] text-primary" strokeWidth={1.75} />
                  Quick links
                </button>
                <QuickLinksPanel open={open === 'quick-links'} onNavigate={close} />
              </div>

              <AccountMenu
                open={open === 'account'}
                onToggle={() => toggle('account')}
                onClose={close}
                buttonClassName={utilityButton}
              />
            </div>
          </div>
        </div>

        <nav aria-label="Main" className="bg-navy-900 text-white on-dark">
          <div className="site-container flex h-14 items-stretch">
            <ul className="-ml-4 flex items-stretch">
              <li className="flex">
                <button
                  type="button"
                  onClick={() => toggle('products')}
                  aria-expanded={open === 'products'}
                  aria-controls="mega-menu"
                  className={navItemClass(productsActive)}
                >
                  Products & services
                  <ChevronDown
                    className={`size-4 opacity-70 transition-transform duration-200 ${open === 'products' ? 'rotate-180' : ''}`}
                  />
                </button>
              </li>
              {mainNav.map((item) => (
                <li key={item.to} className="flex">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => navItemClass(isActive && open !== 'products')}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => toggle('search')}
              aria-label={open === 'search' ? 'Close search' : 'Search'}
              aria-expanded={open === 'search'}
              aria-controls="site-search"
              className="-mr-2.5 ml-auto flex size-10 items-center justify-center self-center rounded-full text-white/90 transition-colors hover:bg-white/10 hover:text-white"
            >
              {open === 'search' ? (
                <X className="size-5" strokeWidth={1.75} />
              ) : (
                <Search className="size-5" strokeWidth={1.75} />
              )}
            </button>
          </div>
        </nav>
      </div>

      <MegaMenu open={open === 'products'} session={megaMenuSession} onNavigate={close} />
      <SearchPanel open={open === 'search'} onClose={close} />

      <div
        aria-hidden
        onClick={close}
        className={`fixed inset-0 z-0 bg-navy-900/40 transition-opacity duration-200 ${
          dimPage ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
    </header>
  )
}
