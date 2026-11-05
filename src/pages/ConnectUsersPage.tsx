import { MapPin, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { Avatar } from '../components/Avatar'
import { ConnectPageHeader } from '../components/connect/ConnectPageHeader'
import { ConnectPanel } from '../components/connect/ConnectPanel'
import { InviteUserDialog } from '../components/connect/InviteUserDialog'
import { siteById } from '../data/assets'
import { connectApp, connectTeams, connectUsers, usersPage as copy } from '../data/connect'

const roleTones: Record<string, string> = {
  Admin: 'bg-primary-on-dark/15 text-primary-on-dark',
  Operator: 'bg-success-on-dark/15 text-success-on-dark',
  Viewer: 'bg-white/10 text-text-on-dark',
  'Service partner': 'bg-warning-on-dark/15 text-warning-on-dark',
}

const tabClass = ({ isActive }: { isActive: boolean }) =>
  `relative flex h-14 items-center px-4 text-sm font-semibold transition-colors ${
    isActive
      ? 'text-white after:absolute after:inset-x-4 after:bottom-0 after:h-[3px] after:rounded-t-sm after:bg-primary-on-dark'
      : 'text-text-on-dark-muted hover:text-white'
  }`

/** Users and teams: /connect/users and /connect/teams, with "Invite user". */
export function ConnectUsersPage({ view }: { view: 'users' | 'teams' }) {
  const { user } = useAuth()
  const [inviting, setInviting] = useState(false)
  // The signed-in user first, as the account admin.
  const people = [
    {
      name: user!.name,
      initials: user!.initials,
      email: user!.email,
      role: 'Admin',
      teams: connectTeams.slice(0, 2).map((t) => t.name),
      lastActive: copy.you,
      pending: false,
    },
    ...connectUsers.filter((person) => person.name !== user!.name),
  ]

  return (
    <div className="mx-auto max-w-[1280px] px-10 pt-8 pb-16 max-xl:px-6 max-md:px-4 max-md:pt-6">
      <title>{`${view === 'users' ? copy.title : copy.teamsTitle} – ${connectApp.name}`}</title>
      <ConnectPageHeader
        title={view === 'users' ? copy.title : copy.teamsTitle}
        subtitle={user!.company}
        actions={
          <button
            type="button"
            onClick={() => setInviting(true)}
            className="inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <UserPlus className="size-4" />
            {copy.invite.action}
          </button>
        }
      />

      <ConnectPanel
        flush
        className="mt-8 overflow-hidden max-md:mt-6 max-md:overflow-visible max-md:border-0 max-md:bg-transparent max-md:shadow-none"
      >
        <nav
          aria-label={copy.title}
          className="flex gap-1 border-b border-white/10 px-4 max-md:mb-4 max-md:px-0"
        >
          <NavLink to="/connect/users" className={tabClass}>
            {copy.tabs.users}
          </NavLink>
          <NavLink to="/connect/teams" className={tabClass}>
            {copy.tabs.teams}
          </NavLink>
        </nav>

        {view === 'users' ? (
          <div className="md:max-xl:overflow-x-auto">
            <table className="table-cards w-full animate-fade-in text-left text-sm max-xl:min-w-[48rem]">
              <thead className="bg-white/[0.04] text-[13px] text-text-on-dark">
                <tr>
                  {Object.values(copy.columns).map((column) => (
                    <th key={column} scope="col" className="px-6 py-3 font-semibold">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.07]">
                {people.map((person) => (
                  <tr
                    key={person.email}
                    className="transition-colors hover:bg-white/[0.03] max-md:bg-navy-900/70"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar
                          initials={person.initials}
                          className={person.pending ? 'opacity-50' : ''}
                        />
                        <div>
                          <p className="font-semibold text-white">{person.name}</p>
                          <p className="text-[13px] text-text-on-dark-muted max-md:font-normal">
                            {person.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`rounded-sm px-2 py-0.5 text-xs font-semibold ${roleTones[person.role]}`}
                      >
                        {person.role}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-text-on-dark">{person.teams.join(', ')}</td>
                    <td className="px-6 py-3.5 text-text-on-dark-muted tabular-nums">
                      {person.pending ? (
                        <span className="font-semibold text-warning-on-dark">{copy.pending}</span>
                      ) : (
                        person.lastActive
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ul className="grid animate-fade-in gap-4 p-6 max-md:grid-cols-1 max-md:px-0 max-md:pt-0 md:grid-cols-3 md:max-lg:grid-cols-2!">
            {connectTeams.map((team) => {
              const members = people.filter((person) => person.teams.includes(team.name))
              return (
                <li
                  key={team.name}
                  className="rounded-lg border border-white/10 bg-navy-800/60 p-5 max-md:bg-navy-900/70"
                >
                  <h2 className="font-semibold text-white">{team.name}</h2>
                  <p className="mt-1 text-[13px] text-text-on-dark-muted">{team.description}</p>
                  <div className="mt-4 flex -space-x-2">
                    {members.map((member) => (
                      <Avatar
                        key={member.email}
                        initials={member.initials}
                        className="ring-2 ring-navy-900"
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-[13px] text-text-on-dark">
                    {copy.team.members(members.length)}
                  </p>
                  <ul className="mt-4 space-y-1.5 border-t border-white/10 pt-4 text-[13px] text-text-on-dark">
                    {team.siteIds.map((id) => (
                      <li key={id} className="flex items-center gap-2">
                        <MapPin className="size-3.5 text-text-on-dark-muted" />
                        {siteById(id)?.name}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-[13px] text-text-on-dark-muted">
                    {copy.team.alerts}: <span className="text-text-on-dark">{team.alertsBy}</span>
                  </p>
                </li>
              )
            })}
          </ul>
        )}
      </ConnectPanel>

      <InviteUserDialog open={inviting} onClose={() => setInviting(false)} />
    </div>
  )
}
