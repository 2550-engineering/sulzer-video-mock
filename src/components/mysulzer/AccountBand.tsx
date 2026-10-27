import { UserPlus } from 'lucide-react'
import { Link } from 'react-router'
import { accountSection } from '../../data/mySulzer'

/** Navy "Create a Sulzer account" band. The intro's secondary button scrolls here. */
export function AccountBand() {
  return (
    <section id="create-account" className="scroll-mt-[168px] bg-navy-900 text-white">
      <div className="site-container grid items-center gap-16 py-24 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-primary-on-dark uppercase">
            {accountSection.eyebrow}
          </p>
          <h2 className="mt-4 text-[2.75rem] leading-[1.1] font-bold tracking-tight">
            {accountSection.title}
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-text-on-dark">
            {accountSection.text}
          </p>
          <Link
            to={accountSection.cta.to}
            className="mt-10 inline-flex h-12 items-center gap-2 rounded-pill bg-primary px-7 text-[15px] font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <UserPlus className="size-[18px]" />
            {accountSection.cta.label}
          </Link>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2">
          {accountSection.benefits.map(({ label, text, icon: Icon }) => (
            <li key={label} className="rounded-lg bg-white/[0.04] p-7 ring-1 ring-white/10">
              <span className="flex size-11 items-center justify-center rounded-full bg-primary text-white">
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <p className="mt-5 text-lg font-semibold">{label}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-text-on-dark-muted">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
