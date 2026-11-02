import type { ReactNode } from 'react'

type ChoiceCardProps = {
  name: string
  value: string
  checked: boolean
  onChange: () => void
  children: ReactNode
  /** Right-hand side, e.g. a price. */
  aside?: ReactNode
}

/** A radio button as a bordered card: the whole card is the label. */
export function ChoiceCard({ name, value, checked, onChange, children, aside }: ChoiceCardProps) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-4 rounded-md border px-5 py-4 transition-[border-color,background-color,box-shadow] duration-150 ${
        checked
          ? 'border-primary bg-primary-tint/50 shadow-[0_0_0_1px_var(--sz-color-primary)]'
          : 'border-border-strong bg-white hover:border-primary'
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mt-1 size-[18px] shrink-0 accent-primary"
      />
      <span className="min-w-0 flex-1">{children}</span>
      {aside && <span className="shrink-0">{aside}</span>}
    </label>
  )
}
