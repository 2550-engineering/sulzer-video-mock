type SwitchProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

/** On/off toggle with its label on the left. */
export function Switch({ label, checked, onChange }: SwitchProps) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-medium text-navy-900">
      {label}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-pill transition-colors duration-200 ${
          checked ? 'bg-primary' : 'bg-border-strong'
        }`}
      >
        <span
          aria-hidden
          className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-card transition-transform duration-200 ease-sz ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </label>
  )
}
