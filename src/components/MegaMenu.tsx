import { ArrowRight, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import sizingImage from '../assets/images/sulzer-dynamical-still.jpg'
import { megaMenu } from '../config/navigation'
import { popoverClasses } from '../lib/popover'
import { DutyPointChip } from './DutyPointChip'

type MegaMenuProps = {
  open: boolean
  /** Changes every time the menu opens, so the hovered column resets. */
  session: number
  onNavigate: () => void
}

/** "Products & services" panel under the header. */
export function MegaMenu({ open, session, onNavigate }: MegaMenuProps) {
  const [hovered, setHovered] = useState<{ label: string; session: number } | null>(null)
  const activeLabel = hovered?.session === session ? hovered.label : null
  const activeItem = megaMenu.find((item) => item.label === activeLabel)

  return (
    <div
      id="mega-menu"
      inert={!open}
      className={`absolute inset-x-0 top-full z-10 border-t border-border bg-white shadow-card ${popoverClasses(open)}`}
    >
      <div className="site-container grid grid-cols-12 gap-8 pt-10 pb-12">
        <div className="col-span-4 xl:col-span-3">
          <Link
            to="/products"
            onClick={onNavigate}
            className="inline-block border-b-2 border-primary pb-1 text-2xl font-bold tracking-tight text-primary transition-colors hover:border-primary-hover hover:text-primary-hover"
          >
            Products & services
          </Link>
          <ul className="mt-6 space-y-0.5">
            {megaMenu.map((item) => {
              const active = item.label === activeLabel
              return (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    onMouseEnter={() => setHovered({ label: item.label, session })}
                    onFocus={() => setHovered({ label: item.label, session })}
                    className={`flex h-11 items-center justify-between rounded-sm px-3 text-[15px] transition-colors ${
                      active
                        ? 'bg-surface-sunken font-medium text-navy-900'
                        : 'text-text hover:bg-surface-muted'
                    }`}
                  >
                    {item.label}
                    {item.children && <ChevronRight className="size-4 text-primary" />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="col-span-4 pt-[60px]">
          {activeItem?.children && (
            <ul key={activeItem.label} className="animate-fade-in space-y-0.5">
              {activeItem.children.map((child) => (
                <li key={child.label}>
                  <Link
                    to={child.to}
                    onClick={onNavigate}
                    className="flex h-11 items-center rounded-sm px-3 text-[15px] text-text transition-colors hover:bg-surface-muted hover:text-primary"
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="col-span-4 xl:col-start-9">
          <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-surface-muted">
            <img
              src={sizingImage}
              alt=""
              className="absolute inset-0 size-full scale-110 object-cover"
              draggable={false}
            />
            <DutyPointChip />
          </div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-navy-900">
            Size your product
          </h2>
          <p className="mt-2 max-w-md text-[15px] leading-relaxed text-text-muted">
            Enter your duty point and get matching Sulzer pumps with performance curves, energy data
            and drawings in minutes.
          </p>
          <Link
            to="/sizing"
            onClick={onNavigate}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
          >
            Start sizing
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
