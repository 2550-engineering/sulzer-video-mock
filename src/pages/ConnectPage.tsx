import { ArrowRight, LayoutDashboard } from 'lucide-react'
import { useContext } from 'react'
import { Link } from 'react-router'
import { ConnectContext } from '../connect/ConnectContext'
import { connectApp } from '../data/connect'

/** Sulzer Connect welcome: /connect. "Go to dashboard" appears once the account has connected assets. */
export function ConnectPage() {
  const { welcome, cards } = connectApp
  const connected =
    useContext(ConnectContext)?.assets.filter((asset) => asset.connected).length ?? 0
  const ActionIcon = welcome.action.icon

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col justify-center px-8 py-16 max-xl:px-6 max-md:min-h-[calc(100dvh-10rem)] max-md:px-4 max-md:py-6">
      <title>{connectApp.name}</title>

      <section className="animate-fade-in rounded-lg border border-white/10 bg-navy-900 px-10 py-14 text-center shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)] max-md:px-5 max-md:py-10">
        <h1 className="text-[2.5rem] leading-tight font-bold tracking-tight text-white max-md:text-[1.75rem]">
          {welcome.title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-text-on-dark max-md:text-base">
          {connected > 0 ? welcome.textConnected(connected) : welcome.text}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          {connected > 0 && (
            <Link
              to={welcome.dashboard.to}
              className="inline-flex h-12 items-center gap-2 rounded-pill bg-primary px-7 font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              <LayoutDashboard className="size-[18px]" />
              {welcome.dashboard.label}
            </Link>
          )}
          <Link
            to={welcome.action.to}
            className={`inline-flex h-12 items-center gap-2 rounded-pill px-7 font-semibold transition-colors ${
              connected > 0
                ? 'border border-white/25 text-white hover:border-white hover:bg-white/10'
                : 'bg-primary text-white hover:bg-primary-hover'
            }`}
          >
            <ActionIcon className="size-[18px]" />
            {welcome.action.label}
          </Link>
        </div>

        <ul className="mt-14 grid gap-4 text-left max-md:mt-10 max-md:grid-cols-1! sm:grid-cols-2">
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
  )
}
