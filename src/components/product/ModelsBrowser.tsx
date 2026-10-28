import { useState } from 'react'
import { productPage as copy } from '../../data/catalogPages'
import type { ProductModel } from '../../types'
import { TabHeading } from '../TabHeading'
import { ModelsTable } from './ModelsTable'

const { modelFilters } = copy

/** Models tab: filter list on the left (checkbox groups with counts), result count and table on the right. */
export function ModelsBrowser({ models }: { models: ProductModel[] }) {
  // Selected option ids per group id.
  const [selected, setSelected] = useState<Record<string, string[]>>({})

  const visible = models.filter((model) =>
    modelFilters.groups.every((group) => {
      const ids = selected[group.id] ?? []
      return (
        ids.length === 0 ||
        group.options.some((option) => ids.includes(option.id) && option.matches(model))
      )
    }),
  )

  function toggle(groupId: string, optionId: string) {
    setSelected((current) => {
      const ids = current[groupId] ?? []
      return {
        ...current,
        [groupId]: ids.includes(optionId)
          ? ids.filter((id) => id !== optionId)
          : [...ids, optionId],
      }
    })
  }

  const anySelected = Object.values(selected).some((ids) => ids.length > 0)

  return (
    <div className="grid gap-12 lg:grid-cols-[17rem_1fr]">
      <aside>
        <div className="flex items-baseline justify-between border-b border-border pb-4">
          <h3 className="text-xl font-bold tracking-tight text-heading">{modelFilters.title}</h3>
          <button
            type="button"
            onClick={() => setSelected({})}
            disabled={!anySelected}
            className="text-sm font-medium text-primary transition-colors hover:text-primary-hover disabled:text-text-subtle"
          >
            {modelFilters.resetLabel}
          </button>
        </div>

        {modelFilters.groups.map((group) => {
          const options = group.options
            .map((option) => ({ ...option, count: models.filter(option.matches).length }))
            .filter((option) => option.count > 0)
          if (options.length < 2) return null
          return (
            <fieldset key={group.id} className="border-b border-border py-5">
              <legend className="float-left mb-3 w-full font-semibold text-heading">
                {group.label}
              </legend>
              <div className="clear-left space-y-2.5">
                {options.map((option) => (
                  <label
                    key={option.id}
                    className="flex cursor-pointer items-center gap-3 text-[15px] text-text"
                  >
                    <input
                      type="checkbox"
                      checked={(selected[group.id] ?? []).includes(option.id)}
                      onChange={() => toggle(group.id, option.id)}
                      className="size-[18px] accent-primary"
                    />
                    {option.label}
                    <span className="text-text-muted tabular-nums">({option.count})</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )
        })}
      </aside>

      <div className="min-w-0">
        <TabHeading title={copy.modelsTitle(visible.length)} />
        <div className="mt-6">
          {visible.length > 0 ? (
            <ModelsTable models={visible} />
          ) : (
            <p className="rounded-lg border border-border px-6 py-10 text-center text-text-muted">
              {modelFilters.noMatches}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
