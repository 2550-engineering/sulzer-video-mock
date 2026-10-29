import { Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { myProjectsPage } from '../../data/projectPages'
import type { Project } from '../../types'
import { SelectField } from '../SelectField'
import { ProjectStatusChip } from './ProjectStatusChip'

const copy = myProjectsPage.list

type Scope = 'active' | 'all'
type Sort = 'date' | 'name'

/** Left column: scope and sort selects, search, and the projects (name, products, status, last modified). */
export function ProjectList({ projects, currentId }: { projects: Project[]; currentId: string }) {
  const [scope, setScope] = useState<Scope>('active')
  const [sort, setSort] = useState<Sort>('date')
  const [query, setQuery] = useState('')

  const shown = projects
    .filter((p) => scope === 'all' || p.status !== 'Quoted' || p.id === currentId)
    .filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) =>
      sort === 'name' ? a.name.localeCompare(b.name, 'en') : b.modifiedOrder - a.modifiedOrder,
    )

  return (
    <aside className="self-start rounded-lg border border-border bg-white">
      <div className="space-y-3 border-b border-border p-4">
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            layout="stacked"
            label={copy.scope}
            value={scope}
            onChange={setScope}
            options={[
              { value: 'active', label: copy.scopes.active },
              { value: 'all', label: copy.scopes.all },
            ]}
          />
          <SelectField
            layout="stacked"
            label={copy.sort}
            value={sort}
            onChange={setSort}
            options={[
              { value: 'date', label: copy.sorts.date },
              { value: 'name', label: copy.sorts.name },
            ]}
          />
        </div>
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-subtle"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.search}
            aria-label={copy.search}
            className="h-10 w-full rounded-md border border-border-strong bg-white pr-3 pl-9 text-sm text-text transition-[border-color,box-shadow] placeholder:text-text-subtle focus:border-primary focus:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none"
          />
        </div>
      </div>

      {shown.length > 0 ? (
        <ul className="divide-y divide-border">
          {shown.map((project) => {
            const current = project.id === currentId
            return (
              <li key={project.id}>
                <Link
                  to={`/my-projects/${project.id}`}
                  aria-current={current ? 'page' : undefined}
                  className={`relative block px-4 py-3.5 transition-colors duration-150 ${
                    current ? 'bg-primary-tint' : 'hover:bg-surface-subtle'
                  }`}
                >
                  {current && (
                    <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-primary" />
                  )}
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-navy-900">{project.name}</span>
                    <ProjectStatusChip status={project.status} />
                  </span>
                  <span className="mt-1 flex justify-between gap-3 text-xs text-text-muted">
                    <span>{copy.products(project.items.reduce((n, i) => n + i.quantity, 0))}</span>
                    <span>{project.lastModified}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="px-4 py-6 text-sm text-text-muted">{copy.empty}</p>
      )}
    </aside>
  )
}
