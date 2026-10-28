import { Globe } from 'lucide-react'
import { Link } from 'react-router'
import { market } from '../config/demo'
import { footerColumns, legalLinks } from '../config/navigation'
import { SocialIcon, type SocialNetwork } from './SocialIcon'
import { SulzerLogo } from './SulzerLogo'

const socials: { network: SocialNetwork; label: string }[] = [
  { network: 'linkedin', label: 'LinkedIn' },
  { network: 'youtube', label: 'YouTube' },
  { network: 'x', label: 'X' },
  { network: 'facebook', label: 'Facebook' },
]

const year = new Date().getFullYear()

export function SiteFooter() {
  return (
    <footer className="bg-navy-900 text-text-on-dark on-dark">
      <div className="site-container grid grid-cols-12 gap-x-8 gap-y-12 pt-16 pb-14">
        <div className="col-span-12 lg:col-span-4">
          <Link to="/" aria-label="Sulzer home" className="inline-block rounded-sm">
            <SulzerLogo variant="white" className="h-7" />
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-text-on-dark-muted">
            Sulzer is a global leader in fluid engineering. We pump, agitate, mix, separate and
            purify fluids of all types — sustainably.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 text-sm text-text-on-dark">
            <Globe className="size-4" strokeWidth={1.75} />
            {market.country} – {market.language}
          </p>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title} className="col-span-6 sm:col-span-3 lg:col-span-2">
            <h2 className="text-[15px] font-semibold text-white">{column.title}</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-text-on-dark-muted transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="site-container flex flex-wrap items-center justify-between gap-6 py-6 text-sm">
          <ul className="flex flex-wrap gap-x-7 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="text-text-on-dark-muted transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-8">
            <ul className="flex gap-2">
              {socials.map(({ network, label }) => (
                <li key={network}>
                  <a
                    href="#"
                    onClick={(event) => event.preventDefault()}
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-full bg-white/[0.08] text-text-on-dark transition-colors hover:bg-primary hover:text-white"
                  >
                    <SocialIcon network={network} />
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-text-on-dark-muted">© {year} Sulzer Ltd</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
