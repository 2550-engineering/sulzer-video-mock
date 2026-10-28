import type { ProductModel } from '../../types'
import { CurveThumbnail } from './CurveThumbnail'

type Column = {
  label: string
  unit?: string
  value: (model: ProductModel) => string | number
}

const columns: Column[] = [
  { label: 'Flow', unit: 'm³/h', value: (m) => m.flow },
  { label: 'Head', unit: 'm', value: (m) => m.head },
  { label: 'P2', unit: 'kW', value: (m) => m.power },
  { label: 'n', unit: 'rpm', value: (m) => m.speed },
  { label: 'Impeller', unit: 'mm', value: (m) => m.impeller },
]

/** Models tab: one row per model with its curve, rated duty and motor data. */
export function ModelsTable({ models }: { models: ProductModel[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-[15px]">
        <thead className="bg-surface-sunken text-sm text-navy-900">
          <tr>
            <th scope="col" className="w-24 px-6 py-4 font-semibold">
              Curve
            </th>
            <th scope="col" className="px-6 py-4 font-semibold">
              Model
            </th>
            {columns.map((col) => (
              <th key={col.label} scope="col" className="px-6 py-4 text-right font-semibold">
                {col.label}
                {col.unit && (
                  <span className="block text-xs font-normal text-text-muted">[{col.unit}]</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {models.map((model) => (
            <tr key={model.id} className="transition-colors hover:bg-surface-muted">
              <td className="px-6 py-3">
                <CurveThumbnail model={model} />
              </td>
              <th scope="row" className="px-6 py-3 font-semibold text-primary">
                {model.name}
              </th>
              {columns.map((col) => (
                <td key={col.label} className="px-6 py-3 text-right text-text tabular-nums">
                  {col.value(model)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
