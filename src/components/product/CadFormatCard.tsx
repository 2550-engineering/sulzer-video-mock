import { Box, Building2, Check, FileText, Ruler } from 'lucide-react'
import type { CadFormatSpec } from '../../data/cad'
import type { CadFormat } from '../../types'

const icons: Record<CadFormat, typeof Box> = {
  Revit: Building2,
  IFC: Building2,
  STEP: Box,
  DWG: Ruler,
  DXF: Ruler,
  PDF: FileText,
}

type CadFormatCardProps = {
  spec: CadFormatSpec
  selected: boolean
  onSelect: () => void
}

/** One choosable file format (radio): icon, name, kind and version. */
export function CadFormatCard({ spec, selected, onSelect }: CadFormatCardProps) {
  const Icon = icons[spec.format]
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`relative flex h-full flex-col items-start rounded-md border bg-white p-4 text-left transition-[border-color,box-shadow] duration-150 ${
        selected
          ? 'border-primary shadow-[0_0_0_1px_var(--sz-color-primary)]'
          : 'border-border hover:border-primary-border'
      }`}
    >
      <span
        className={`flex size-9 items-center justify-center rounded-sm ${
          selected ? 'bg-primary text-white' : 'bg-primary-tint text-primary'
        } transition-colors duration-150`}
      >
        <Icon className="size-[18px]" strokeWidth={1.75} />
      </span>
      <span className="mt-3 font-semibold text-navy-900">{spec.label}</span>
      <span className="mt-0.5 text-xs text-text-muted">
        {spec.kind} · {spec.version}
      </span>
      {selected && (
        <Check
          aria-hidden
          className="absolute top-3 right-3 size-4 text-primary"
          strokeWidth={2.5}
        />
      )}
    </button>
  )
}
