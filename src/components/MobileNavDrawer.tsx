import { ChevronDown, ChevronRight, CircleUserRound, Globe, LogOut, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { market } from '../config/demo'
import { digitalOfferings, mainNav, megaMenu, quickLinks } from '../config/navigation'
import { Avatar } from './Avatar'
import { PartnerBadge } from './PartnerBadge'
import { MobileNavAccordionButton } from './mobileNav/MobileNavAccordionButton'
import { MobileNavMegaItem } from './mobileNav/MobileNavMegaItem'
import { QuickLinkTiles } from './mobileNav/QuickLinkTiles'
import { row } from './mobileNav/rows'
import { SulzerLogo } from './SulzerLogo'

type MobileNavDrawerProps = {
  open: boolean
  onClose: () => void
}

/**
 * The hamburger menu below 1280px: a drawer from the right (full screen on
 * phones, 400px on tablets) with the main nav as an accordion, quick links as
 * tiles, and market and sign-in at the bottom. Rendered inside the header, so
 * Escape and route changes close it like the other header panels. Hidden from
 * 1280px, where the desktop header takes over.
 */
export function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
  const { user, signIn, signOut } = useAuth()
  const [expanded, setExpanded] = useState<string | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Lock page scroll while open, and start with the close button focused.
  useEffect(() => {
    if (!open) return
    const { overflow } = document.documentElement.style
    document.documentElement.style.overflow = 'hidden'
    closeRef.current?.focus({ preventScroll: true })
    return () => {
      document.documentElement.style.overflow = overflow
    }
  }, [open])

  const toggle = (id: string) => setExpanded((current) => (current === id ? null : id))

  return (
    <div className="xl:hidden">
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-navy-900/50 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={`fixed inset-y-0 right-0 z-[61] flex w-full flex-col bg-white shadow-raised duration-250 ease-sz md:w-[400px] ${
          open
            ? 'visible translate-x-0 transition-transform'
            : 'invisible translate-x-full transition-[translate,visibility]'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border pr-2 pl-4">
          <Link to="/" onClick={onClose} aria-label="Sulzer home" className="rounded-sm p-1">
            <SulzerLogo variant="blue" className="h-6" />
          </Link>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex size-11 items-center justify-center rounded-sm text-navy-900 transition-colors hover:bg-surface-muted"
          >
            <X className="size-6" strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <nav aria-label="Main" className="border-b border-border py-2">
            <ul>
              <li>
                <MobileNavAccordionButton
                  label="Products & services"
                  expanded={expanded === 'products'}
                  onClick={() => toggle('products')}
                  controls="mobile-nav-products"
                />
                <ul id="mobile-nav-products" hidden={expanded !== 'products'} className="pb-2">
                  {megaMenu.map((item) => (
                    <MobileNavMegaItem key={item.label} item={item} onNavigate={onClose} />
                  ))}
                </ul>
              </li>
              {mainNav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} onClick={onClose} className={row}>
                    {item.label}
                    <ChevronRight className="ml-auto size-4 text-text-subtle" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <QuickLinkTiles title="Quick links" links={quickLinks} onNavigate={onClose} />
          <QuickLinkTiles title="Digital offerings" links={digitalOfferings} onNavigate={onClose} />
        </div>

        <div className="shrink-0 border-t border-border bg-surface-muted px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Globe className="size-4" strokeWidth={1.75} />
            <button
              type="button"
              className="flex min-h-11 items-center gap-1 font-medium text-navy-900"
            >
              {market.country}
              <ChevronDown className="size-3.5" strokeWidth={2} />
            </button>
            <span aria-hidden className="text-text-subtle">
              ·
            </span>
            <button
              type="button"
              className="flex min-h-11 items-center gap-1 font-medium text-navy-900"
            >
              {market.language}
              <ChevronDown className="size-3.5" strokeWidth={2} />
            </button>
          </div>

          {user ? (
            <div className="mt-3 flex items-center gap-3">
              <Avatar initials={user.initials} size="md" />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-semibold text-navy-900">
                  <span className="truncate">{user.name}</span>
                  {user.kind === 'partner' && <PartnerBadge />}
                </p>
                <p className="truncate text-sm text-text-muted">{user.company}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  signOut()
                  onClose()
                }}
                className="flex h-11 items-center gap-2 rounded-pill border border-border-strong bg-white px-4 text-sm font-semibold text-navy-900 transition-colors hover:border-primary hover:text-primary"
              >
                <LogOut className="size-4" strokeWidth={1.75} />
                Sign out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                signIn()
                onClose()
              }}
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-primary font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              <CircleUserRound className="size-5" strokeWidth={1.75} />
              Sign in
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
