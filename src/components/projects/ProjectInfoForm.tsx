import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { myProjectsPage } from '../../data/projectPages'
import type { ProjectInfoPatch } from '../../projects/ProjectsContext'
import type { Project } from '../../types'
import { TextField } from '../TextField'

const copy = myProjectsPage.panel

const heading = 'text-xs font-semibold tracking-[0.08em] text-text-muted uppercase'

type ProjectInfoFormProps = {
  project: Project
  onSave: (patch: ProjectInfoPatch) => void
  onCancel: () => void
}

/** Project details tab, edit mode: every field of the read view, with Save and Cancel. */
export function ProjectInfoForm({ project, onSave, onCancel }: ProjectInfoFormProps) {
  const [description, setDescription] = useState(project.description ?? '')
  const [client, setClient] = useState(project.client)
  const [consultantFirm, setConsultantFirm] = useState(project.consultantFirm ?? '')
  const [deadline, setDeadline] = useState(project.deadline ?? '')
  const [budget, setBudget] = useState(project.budget ? String(project.budget) : '')
  const [requirements, setRequirements] = useState(project.requirements ?? [])

  const setClientField = (key: keyof Project['client']) => (value: string) =>
    setClient((current) => ({ ...current, [key]: value }))

  function save() {
    const amount = Number(budget.replace(/[^\d.]/g, ''))
    onSave({
      description: description.trim(),
      client,
      consultantFirm: consultantFirm.trim() || undefined,
      deadline: deadline.trim() || undefined,
      budget: amount > 0 ? amount : undefined,
      requirements: requirements.map((r) => r.trim()).filter(Boolean),
    })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        save()
      }}
      className="space-y-4"
    >
      <TextField
        label={copy.description}
        value={description}
        onChange={setDescription}
        rows={4}
        autoFocus
      />

      <fieldset className="space-y-2">
        <legend className="mb-1 text-sm font-semibold text-navy-900">{copy.requirements}</legend>
        {requirements.map((requirement, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <input
              value={requirement}
              aria-label={copy.requirementLabel(i + 1)}
              placeholder={copy.requirementPlaceholder}
              onChange={(e) =>
                setRequirements((list) => list.map((r, j) => (j === i ? e.target.value : r)))
              }
              className="h-9 w-full rounded-md border border-border-strong bg-white px-2.5 text-sm text-text transition-[border-color,box-shadow] placeholder:text-text-subtle focus:border-primary focus:shadow-[0_0_0_3px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none"
            />
            <button
              type="button"
              onClick={() => setRequirements((list) => list.filter((_, j) => j !== i))}
              aria-label={copy.removeRequirement(i + 1)}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-muted hover:text-navy-900"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setRequirements((list) => [...list, ''])}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          <Plus className="size-4" />
          {copy.addRequirement}
        </button>
      </fieldset>

      <h3 className={`${heading} pt-2`}>{copy.project}</h3>
      <TextField label={copy.deadline} value={deadline} onChange={setDeadline} />
      <TextField label={copy.budgetLabel} value={budget} onChange={setBudget} type="number" />

      <h3 className={`${heading} pt-2`}>{copy.client}</h3>
      <TextField label={copy.company} value={client.company} onChange={setClientField('company')} />
      <TextField label={copy.contact} value={client.contact} onChange={setClientField('contact')} />
      <TextField
        label={copy.address}
        value={client.address ?? ''}
        onChange={setClientField('address')}
      />
      <TextField label={copy.site} value={client.site} onChange={setClientField('site')} />
      <TextField
        label={copy.email}
        value={client.email}
        onChange={setClientField('email')}
        type="email"
      />

      <h3 className={`${heading} pt-2`}>{copy.consultant}</h3>
      <TextField label={copy.consultantFirm} value={consultantFirm} onChange={setConsultantFirm} />

      <div className="sticky bottom-0 -mx-5 flex justify-end gap-2 border-t border-border bg-white px-5 py-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-10 items-center rounded-pill border border-border-strong px-4 text-sm font-semibold text-navy-900 transition-colors hover:border-primary hover:text-primary"
        >
          {copy.cancel}
        </button>
        <button
          type="submit"
          className="inline-flex h-10 items-center rounded-pill bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          {copy.save}
        </button>
      </div>
    </form>
  )
}
