import type { CSSProperties } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { Avatar } from '../components/Avatar'
import { Breadcrumb } from '../components/Breadcrumb'
import { AssetsCard } from '../components/mypages/AssetsCard'
import { LinksCard } from '../components/mypages/LinksCard'
import { RecentActivity } from '../components/mypages/RecentActivity'
import { dashboardCards, signedOutRedirect, welcome } from '../data/myPages'

// Cards fade in one after another on arrival, 50 ms apart.
const enter = 'animate-fade-in [animation-fill-mode:backwards]'
function delay(index: number): CSSProperties {
  return { animationDelay: `${index * 50}ms` }
}

/** Signed-in dashboard: welcome, card grid (self-service, learning, projects, portals, assets) and recent activity. */
export function MyPagesPage() {
  const { user } = useAuth()
  if (!user) return <Navigate to={signedOutRedirect} replace />

  const { selfService, learning, productsProjects, portals } = dashboardCards

  return (
    <div className="bg-surface-muted">
      <title>My Pages | mySulzer | Sulzer</title>

      <div className="site-container py-5">
        <Breadcrumb items={[{ label: 'mySulzer', to: '/my-sulzer' }, { label: 'My Pages' }]} />
      </div>

      <div className="site-container pt-6 pb-24">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="text-[2.75rem] leading-tight font-bold tracking-tight text-heading">
              {welcome.title}
            </h1>
            <p className="mt-2 text-lg text-text-muted">{welcome.subtitle}</p>
          </div>
          <div className="flex items-center gap-3 rounded-pill bg-surface py-2 pr-6 pl-2 shadow-card ring-1 ring-navy-900/5">
            <Avatar initials={user.initials} size="md" />
            <div>
              <p className="text-sm font-semibold text-navy-900">{user.company}</p>
              <p className="text-sm text-text-muted">{user.role}</p>
            </div>
          </div>
        </header>

        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[selfService, learning, productsProjects, portals].map((card, i) => (
            <li key={card.title} className={enter} style={delay(i)}>
              <LinksCard card={card} />
            </li>
          ))}
          <li className={`md:col-span-2 ${enter}`} style={delay(4)}>
            <AssetsCard />
          </li>
        </ul>

        <div className={`mt-6 ${enter}`} style={delay(5)}>
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}
