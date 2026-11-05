import { ChevronDown, LayoutGrid, Menu, Search, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { market } from '../config/demo'
import { mainNav } from '../config/navigation'
import { useDismiss } from '../hooks/useDismiss'
import { AccountMenu } from './AccountMenu'
import { CartMenu } from './eshop/CartMenu'
import { MegaMenu } from './MegaMenu'
import { MobileNavDrawer } from './MobileNavDrawer'
import { QuickLinksPanel } from './QuickLinksPanel'
import { SearchPanel } from './SearchPanel'
import { SulzerLogo } from './SulzerLogo'

type Panel = 'products' | 'quick-links' | 'search' | 'account' | 'cart' | 'menu'

const utilityButton =
  'flex h-10 items-center gap-2 rounded-sm px-3 text-navy-900 transition-colors hover:bg-surface-muted hover:text-primary max-xl:h-11 max-xl:min-w-11 max-xl:justify-center max-xl:px-2.5'

/** Icon buttons of the compact header below 1280px (search, menu). */
const compactButton =
  'flex size-11 items-center justify-center rounded-sm text-navy-900 transition-colors hover:bg-surface-muted hover:text-primary xl:hidden'

const marketButton =
  'flex items-center gap-1 rounded-sm text-white/85 transition-colors hover:text-white'

function navItemClass(active: boolean) {
  return [
    'relative flex items-center gap-1.5 px-4 text-[15px] font-medium transition-colors',
    'after:absolute after:inset-x-4 after:bottom-0 after:h-[3px] after:rounded-t-sm after:bg-primary-on-dark after:transition-transform after:duration-200',
    active
      ? 'text-white after:scale-x-100'
      : 'text-white/80 after:scale-x-0 hover:text-white hover:after:scale-x-100',
  ].join(' ')
}

/** Sticky header: navy market strip, white logo row (quick links, account) and navy main nav. */
export function SiteHeader() {
  const { pathname } = useLocation()
  const { user } = useAuth()
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
        <div className="bg-navy-900 on-dark max-xl:hidden">
          <div className="site-container flex h-8 items-center gap-2.5 text-[13px]">
            <button type="button" className={marketButton}>
              {market.country}
              <ChevronDown className="size-3.5" strokeWidth={2} />
            </button>
            <span aria-hidden className="text-white/40">
              ·
            </span>
            <button type="button" className={marketButton}>
              {market.language}
              <ChevronDown className="size-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="border-b border-border bg-white">
          <div className="site-container flex h-20 items-center justify-between max-xl:h-16">
            <Link to="/" aria-label="Sulzer home" className="-m-1 rounded-sm p-1">
              <SulzerLogo variant="blue" className="h-7 max-md:h-6" />
            </Link>

            <div className="-mr-3 flex items-center gap-1 text-sm font-medium max-xl:-mr-2.5 max-xl:gap-0.5">
              <div className="relative max-xl:hidden">
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

              <button
                type="button"
                onClick={() => toggle('search')}
                aria-label={open === 'search' ? 'Close search' : 'Search'}
                aria-expanded={open === 'search'}
                aria-controls="site-search"
                className={compactButton}
              >
                {open === 'search' ? (
                  <X className="size-[22px]" strokeWidth={1.75} />
                ) : (
                  <Search className="size-[22px]" strokeWidth={1.75} />
                )}
              </button>

              {user && (
                <CartMenu
                  open={open === 'cart'}
                  onToggle={() => toggle('cart')}
                  onClose={close}
                  buttonClassName={utilityButton}
                />
              )}

              <AccountMenu
                open={open === 'account'}
                onToggle={() => toggle('account')}
                onClose={close}
                buttonClassName={utilityButton}
              />

              <button
                type="button"
                onClick={() => toggle('menu')}
                aria-label="Menu"
                aria-expanded={open === 'menu'}
                aria-controls="mobile-nav"
                className={compactButton}
              >
                <Menu className="size-6" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>

        <nav aria-label="Main" className="bg-navy-900 text-white on-dark max-xl:hidden">
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
      <MobileNavDrawer open={open === 'menu'} onClose={close} />

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
