import { FolderPlus } from 'lucide-react'
import { useState } from 'react'
import { myProjectsPage } from '../../data/projectPages'
import type { NewProjectInfo } from '../../projects/ProjectsContext'
import { Modal } from '../Modal'
import { TextField } from '../TextField'

const copy = myProjectsPage.newProject

type NewProjectDialogProps = {
  open: boolean
  onCreate: (name: string, info: NewProjectInfo) => void
  onClose: () => void
}

/** "New project": name, client and site. Remount (via `key`) per opening. */
export function NewProjectDialog({ open, onCreate, onClose }: NewProjectDialogProps) {
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [site, setSite] = useState('')

  return (
    <Modal
      open={open}
      title={copy.title}
      closeLabel={copy.close}
      onClose={onClose}
      width="max-w-lg"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onCreate(name.trim() || copy.defaultName, {
            company: company.trim(),
            site: site.trim(),
          })
        }}
        className="space-y-4 px-7 py-6"
      >
        <TextField
          label={copy.name}
          value={name}
          onChange={setName}
          placeholder={copy.namePlaceholder}
          autoFocus
        />
        <TextField
          label={copy.company}
          value={company}
          onChange={setCompany}
          placeholder={copy.companyPlaceholder}
        />
        <TextField
          label={copy.site}
          value={site}
          onChange={setSite}
          placeholder={copy.sitePlaceholder}
        />
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center rounded-pill border border-border-strong px-5 font-semibold text-navy-900 transition-colors hover:border-primary hover:text-primary"
          >
            {copy.cancel}
          </button>
          <button
            type="submit"
            className="inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
          >
            <FolderPlus className="size-4" />
            {copy.create}
          </button>
        </div>
      </form>
    </Modal>
  )
}
