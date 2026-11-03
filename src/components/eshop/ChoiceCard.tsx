import type { ReactNode } from 'react'

/** A radio option as a bordered card; without `onChange` it is the only, fixed choice. */
export function ChoiceCard({
  name,
  checked,
  onChange,
  children,
}: {
  name: string
  checked: boolean
  onChange?: () => void
  children: ReactNode
}) {
  return (
    <label
      className={`flex cursor-pointer gap-3 rounded-md border px-4 py-3.5 transition-[border-color,background-color] duration-150 ${
        checked
          ? 'border-primary bg-primary-tint'
          : 'border-border bg-white hover:border-primary-border'
      }`}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        readOnly={!onChange}
        className="mt-1 size-4 shrink-0 accent-primary"
      />
      <span className="min-w-0 text-[15px]">{children}</span>
    </label>
  )
}
