import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { ConnectShell } from '../components/connect/ConnectShell'
import { connectApp } from '../data/connect'

/** Sulzer Connect: /connect. Own dark app shell (no site header/footer). Not built yet — welcome state. */
export function ConnectPage() {
  const { welcome, cards } = connectApp
  const ActionIcon = welcome.action.icon

  return (
    <ConnectShell>
      <title>{`${connectApp.name} | Sulzer`}</title>

      <div className="mx-auto flex min-h-full max-w-4xl flex-col justify-center px-8 py-16">
        <section className="animate-fade-in rounded-lg border border-white/10 bg-navy-900 px-10 py-14 text-center shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
          <span className="inline-flex items-center gap-2 rounded-pill bg-primary/20 px-3 py-1 text-xs font-semibold tracking-wide text-primary-on-dark uppercase">
            <span aria-hidden className="size-1.5 rounded-full bg-primary-on-dark" />
            {welcome.badge}
          </span>
          <h1 className="mt-6 text-[2.5rem] leading-tight font-bold tracking-tight text-white">
            {welcome.title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-text-on-dark">
            {welcome.text}
          </p>
          <Link
            to={welcome.action.to}
            className="mt-9 inline-flex h-12 items-center gap-2 rounded-pill bg-primary px-7 font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <ActionIcon className="size-[18px]" />
            {welcome.action.label}
          </Link>

          <ul className="mt-14 grid gap-4 text-left sm:grid-cols-2">
            {cards.map(({ text, link }) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="group flex h-full flex-col gap-4 rounded-md border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-primary-on-dark/50 hover:bg-white/[0.06]"
                >
                  <span className="text-[15px] leading-relaxed text-text-on-dark">{text}</span>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary-on-dark">
                    {link.label}
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ConnectShell>
  )
}
