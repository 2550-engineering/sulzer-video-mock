import { searchPage as copy } from '../../data/catalogPages'
import type { ResultSort } from '../../hooks/useResultsParams'
import { SelectField } from '../SelectField'

type SortSelectProps = {
  value: ResultSort
  onChange: (value: ResultSort) => void
}

/** "Sort by" select above the product results. */
export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <SelectField
      label={copy.sortLabel}
      value={value}
      onChange={onChange}
      options={(Object.keys(copy.sort) as ResultSort[]).map((key) => ({
        value: key,
        label: copy.sort[key],
      }))}
    />
  )
}
