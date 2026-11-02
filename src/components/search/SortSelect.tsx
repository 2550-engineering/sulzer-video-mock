import { searchPage as copy } from '../../data/catalogPages'
import type { ResultSort } from '../../hooks/useResultsParams'
import { SelectField } from '../SelectField'

type SortSelectProps = {
  value: ResultSort
  onChange: (value: ResultSort) => void
  /** The sorts offered, in order. */
  options: ResultSort[]
}

/** "Sort by" select above the product or variant results. */
export function SortSelect({ value, onChange, options }: SortSelectProps) {
  return (
    <SelectField
      label={copy.sortLabel}
      value={value}
      onChange={onChange}
      options={options.map((key) => ({
        value: key,
        label: copy.sort[key],
      }))}
    />
  )
}
