import { useId, useState, type FormEvent } from 'react'
import { sizingParametersPage } from '../../data/sizingPages'
import { saveParameterSet } from '../../lib/parameterSets'
import { useToast } from '../../toast/useToast'
import { Modal } from '../Modal'

const copy = sizingParametersPage.saveSet

type SaveParametersDialogProps = {
  open: boolean
  defaultName: string
  params: [string, string][]
  onClose: () => void
}

/** "Save parameters": names the current parameter set and keeps it. Remount (via `key`) per opening. */
export function SaveParametersDialog({
  open,
  defaultName,
  params,
  onClose,
}: SaveParametersDialogProps) {
  const id = useId()
  const showToast = useToast()
  const [name, setName] = useState(defaultName)

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const set = saveParameterSet(name.trim() || defaultName, params)
    showToast({ message: sizingParametersPage.actions.saved(set.name) })
    onClose()
  }

  return (
    <Modal
      open={open}
      title={copy.title}
      closeLabel={copy.close}
      onClose={onClose}
      width="max-w-md"
    >
      <form onSubmit={save} className="px-7 py-6">
        <p className="text-sm text-text-muted">{copy.text}</p>
        <label htmlFor={id} className="mt-5 mb-1.5 block text-sm font-semibold text-navy-900">
          {copy.name}
        </label>
        <input
          id={id}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 w-full rounded-md border border-border-strong bg-white px-3.5 text-[15px] text-text transition-[border-color,box-shadow] focus:border-primary focus:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none"
        />
        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center rounded-pill px-5 text-sm font-semibold text-navy-900 transition-colors hover:bg-surface-muted"
          >
            {copy.cancel}
          </button>
          <button
            type="submit"
            className="inline-flex h-11 items-center rounded-pill bg-primary px-7 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
          >
            {copy.save}
          </button>
        </div>
      </form>
    </Modal>
  )
}
