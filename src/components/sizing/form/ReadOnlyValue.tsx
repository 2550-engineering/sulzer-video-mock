/** A value the configurator sets: shown greyed, not editable. */
export function ReadOnlyValue({ value }: { value: string }) {
  return (
    <div className="flex h-8 items-center rounded-sm border border-border bg-surface-sunken px-2 text-[13px] text-text-muted">
      {value}
    </div>
  )
}
