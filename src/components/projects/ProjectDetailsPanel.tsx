import { useId } from 'react'
import { customers } from '../../data/assets'
import { myProjectsPage } from '../../data/projectPages'
import type { ProjectInfoPatch } from '../../projects/ProjectsContext'
import type { Project, ProjectAccess } from '../../types'
import { ProjectActivityFeed } from './ProjectActivityFeed'
import { ProjectInfo } from './ProjectInfo'
import { ProjectInfoForm } from './ProjectInfoForm'
import { ProjectMembers } from './ProjectMembers'
import { SelectField } from '../SelectField'

const copy = myProjectsPage.panel
export type PanelTab = keyof typeof copy.tabs

type ProjectDetailsPanelProps = {
  project: Project
  /** The current user's member id. */
  meId: string
  tab: PanelTab
  onTab: (tab: PanelTab) => void
  /** Project details in edit mode. */
  editing: boolean
  onEditing: (editing: boolean) => void
  onSave: (patch: ProjectInfoPatch) => void
  onInvite: () => void
  onAccess: (memberId: string, access: ProjectAccess) => void
  /** Partners: picks the customer account the project is for. */
  onClientAccount?: (customerId: string) => void
}

/**
 * Right column: tabs Project details (read or edit), Members and Activity. A
 * partner can pick the customer account the project is for.
 */
export function ProjectDetailsPanel({
  project,
  meId,
  tab,
  onTab,
  editing,
  onEditing,
  onSave,
  onInvite,
  onAccess,
  onClientAccount,
}: ProjectDetailsPanelProps) {
  const ids = useId()

  return (
    <aside className="self-start rounded-lg border border-border bg-white">
      <div role="tablist" className="flex border-b border-border px-1.5">
        {(Object.keys(copy.tabs) as PanelTab[]).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`${ids}-${id}-tab`}
            aria-selected={tab === id}
            aria-controls={`${ids}-panel`}
            onClick={() => onTab(id)}
            className={`relative px-2.5 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors ${
              tab === id ? 'text-navy-900' : 'text-text-muted hover:text-navy-900'
            }`}
          >
            {copy.tabs[id]}
            {tab === id && (
              <span
                aria-hidden
                className="absolute inset-x-2.5 bottom-0 h-[3px] rounded-t-sm bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      <div
        key={`${tab}-${editing}`}
        id={`${ids}-panel`}
        role="tabpanel"
        aria-labelledby={`${ids}-${tab}-tab`}
        className="animate-fade-in px-5 py-4"
      >
        {tab === 'details' &&
          (editing ? (
            <ProjectInfoForm project={project} onSave={onSave} onCancel={() => onEditing(false)} />
          ) : (
            <>
              {onClientAccount && (
                <div className="pb-4">
                  <SelectField
                    layout="stacked"
                    label={copy.clientAccount}
                    value={project.clientAccount ?? ''}
                    onChange={(id) => id && onClientAccount(id)}
                    options={[
                      ...(project.clientAccount
                        ? []
                        : [{ value: '', label: copy.chooseClient, disabled: true }]),
                      ...customers.map((c) => ({ value: c.id, label: c.name })),
                    ]}
                  />
                  {!project.clientAccount && (
                    <p className="mt-1.5 text-xs text-text-muted">{copy.chooseClientHint}</p>
                  )}
                </div>
              )}
              <ProjectInfo project={project} onEdit={() => onEditing(true)} />
            </>
          ))}
        {tab === 'members' && (
          <ProjectMembers project={project} meId={meId} onInvite={onInvite} onAccess={onAccess} />
        )}
        {tab === 'activity' && <ProjectActivityFeed project={project} />}
      </div>
    </aside>
  )
}
