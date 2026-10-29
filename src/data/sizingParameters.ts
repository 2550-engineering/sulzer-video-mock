import { sizingDemo } from '../config/demo'
import { couplingOptions, materialOptions, sealOptions } from './hydraulics'
import { liquids } from './liquids'

/*
 * The "Select parameters" form on /sizing: every row in display order, with
 * its label, control, default, units and options. Rows with `filter` narrow
 * the configurations (see lib/sizingFilters.ts, same ids); their options come
 * from the data when not listed here. Ids are URL params. Invented values: see
 * docs/content-to-confirm.md.
 */

export type ParameterOption = { value: string; label: string }

export type ParameterDef =
  | {
      kind: 'select'
      id: string
      label: string
      required?: boolean
      /** Used when the URL has no value. Selects without one start on "–" (any). */
      default?: string
      /** Static options; filter rows without them take their options from the data. */
      options?: ParameterOption[]
      /** Narrows the configurations (and the number of hits). */
      filter?: boolean
    }
  | {
      kind: 'checkboxes'
      id: string
      label: string
      options?: ParameterOption[]
      filter: true
    }
  | {
      kind: 'number'
      id: 'temp' | 'q' | 'h' | 'maxfreq'
      label: string
      required?: boolean
      /** URL param holding the display unit, when there is a unit select. */
      unitParam?: string
      units: ParameterOption[]
    }
  | { kind: 'readonly'; id: string; label: string; value: string }
  | { kind: 'hits'; id: 'hits'; label: string }

export const anyOption = '–'

export const parameterDefs: ParameterDef[] = [
  {
    kind: 'select',
    id: 'liquid',
    label: 'Pumped liquid',
    default: 'water',
    options: liquids.map((liquid) => ({ value: liquid.id, label: liquid.label })),
    filter: true,
  },
  {
    kind: 'number',
    id: 'temp',
    label: 'Liquid temperature during operation',
    required: true,
    units: [{ value: 'c', label: '°C' }],
  },
  {
    kind: 'number',
    id: 'q',
    label: 'Flow (Q)',
    unitParam: 'qu',
    units: [
      { value: 'm3h', label: 'm³/h' },
      { value: 'ls', label: 'l/s' },
      { value: 'm3s', label: 'm³/s' },
    ],
  },
  {
    kind: 'number',
    id: 'h',
    label: 'Head (H)',
    unitParam: 'hu',
    units: [
      { value: 'm', label: 'm' },
      { value: 'bar', label: 'bar' },
      { value: 'kpa', label: 'kPa' },
    ],
  },
  {
    kind: 'select',
    id: 'voltage',
    label: 'Mains voltage',
    options: [
      { value: '3x400', label: '3×400 V' },
      { value: '3x690', label: '3×690 V' },
      { value: '3x460', label: '3×460 V' },
    ],
    filter: true,
  },
  {
    kind: 'select',
    id: 'vsd',
    label: 'Variable speed',
    default: 'external',
    options: [
      { value: 'no', label: 'No' },
      { value: 'external', label: 'Yes, external' },
      { value: 'integrated', label: 'Yes, integrated' },
    ],
    filter: true,
  },
  {
    kind: 'select',
    id: 'enclosure',
    label: 'Enclosure class',
    options: ['IP55', 'IP56', 'IP65'].map((ip) => ({ value: ip, label: ip })),
    filter: true,
  },
  {
    kind: 'select',
    id: 'impsize',
    label: 'Impeller size',
    default: 'optimised',
    options: [
      { value: 'optimised', label: 'Energy optimised' },
      { value: 'max', label: 'Max impeller' },
      { value: 'fixed', label: 'Fixed trim (10 mm steps)' },
    ],
  },
  {
    kind: 'number',
    id: 'maxfreq',
    label: 'Maximum frequency',
    required: true,
    units: [{ value: 'pct', label: '%' }],
  },
  {
    kind: 'select',
    id: 'margin',
    label: 'Flow rate margin',
    default: 'curve',
    options: [
      { value: 'curve', label: 'From 0 m³/h to end of the actual curve' },
      { value: 'range', label: 'Within the allowed operating range' },
      { value: 'bep', label: 'Close to best efficiency (±20 %)' },
    ],
  },
  { kind: 'select', id: 'size', label: 'Product name', filter: true },
  { kind: 'select', id: 'code', label: 'Name continued', filter: true },
  {
    kind: 'select',
    id: 'material',
    label: 'Material code',
    options: materialOptions.map((m) => ({ value: m.code, label: `${m.code} – ${m.label}` })),
    filter: true,
  },
  {
    kind: 'checkboxes',
    id: 'impmat',
    label: 'Impeller material',
    options: materialOptions.map((m) => ({ value: m.impeller, label: m.impeller })),
    filter: true,
  },
  {
    kind: 'select',
    id: 'impeller',
    label: 'Impeller',
    options: [
      { value: 'closed', label: 'Closed' },
      { value: 'semi-open', label: 'Semi-open' },
    ],
    filter: true,
  },
  {
    kind: 'checkboxes',
    id: 'housing',
    label: 'Pump housing material',
    options: materialOptions.map((m) => ({ value: m.housing, label: m.housing })),
    filter: true,
  },
  {
    kind: 'checkboxes',
    id: 'grade',
    label: 'Pump housing grade',
    options: materialOptions.map((m) => ({ value: m.grade, label: m.grade })),
    filter: true,
  },
  // Follows the shaft seal choice: "Double" when only DD is selected.
  { kind: 'readonly', id: 'mechanicalSeal', label: 'Mechanical seal', value: 'Single' },
  {
    kind: 'readonly',
    id: 'sealDesignation',
    label: 'Shaft seal designation',
    value: 'Mechanical seal',
  },
  {
    kind: 'select',
    id: 'seal',
    label: 'Shaft seal',
    options: sealOptions.map((s) => ({ value: s.code, label: `${s.code} – ${s.label}` })),
    filter: true,
  },
  { kind: 'readonly', id: 'bearing', label: 'Bearing design', value: 'Standard' },
  { kind: 'select', id: 'inlet', label: 'Connection size inlet', filter: true },
  { kind: 'select', id: 'outlet', label: 'Connection size outlet', filter: true },
  {
    kind: 'checkboxes',
    id: 'coupling',
    label: 'Coupling type',
    options: couplingOptions.map((c) => ({ value: c.code, label: c.label })),
    filter: true,
  },
  { kind: 'readonly', id: 'baseFrame', label: 'Base frame', value: 'EN/ISO' },
  {
    kind: 'checkboxes',
    id: 'poles',
    label: 'Poles',
    options: ['2', '4', '6'].map((p) => ({ value: p, label: p })),
    filter: true,
  },
  { kind: 'select', id: 'kw', label: 'P2', filter: true },
  { kind: 'select', id: 'u', label: 'U', filter: true },
  { kind: 'select', id: 'menc', label: 'Motor enclosure class', filter: true },
  { kind: 'select', id: 'motorno', label: 'Motor no.', filter: true },
  {
    kind: 'checkboxes',
    id: 'supply',
    label: 'Motor supply',
    options: [
      { value: 'sulzer', label: 'Sulzer supplied motor' },
      { value: 'customer', label: 'Customer motor' },
    ],
    filter: true,
  },
  { kind: 'readonly', id: 'ie', label: 'IE efficiency class', value: 'IE4' },
  { kind: 'select', id: 'nominal', label: 'Nominal impeller', filter: true },
  { kind: 'readonly', id: 'plate', label: 'Language on pump plate', value: 'GB' },
  { kind: 'hits', id: 'hits', label: 'Number of hits' },
  {
    kind: 'select',
    id: 'application',
    label: 'Select application',
    default: 'surface-water-intake',
    filter: true,
  },
]

/** Defaults of the number rows. Flow and head come from the demo duty point. */
export const numberDefaults = {
  temp: sizingDemo.temperature,
  q: sizingDemo.flow,
  h: sizingDemo.head,
  maxfreq: 105,
}

/** Allowed operating range per "Flow rate margin", as a share of best-efficiency flow. */
export const marginRanges: Record<string, { min: number; max: number }> = {
  curve: { min: 0.2, max: 1.25 },
  range: { min: 0.5, max: 1.2 },
  bep: { min: 0.8, max: 1.2 },
}

/** Every param the sizing form writes; "Start sizing" carries them all to the results. */
export const sizingParamIds = [
  'product',
  ...parameterDefs.flatMap((def) =>
    def.kind === 'number' ? [def.id, ...(def.unitParam ? [def.unitParam] : [])] : [def.id],
  ),
  'hz',
  'hours',
  'eprice',
]

export const formCopy = {
  helper: 'Use the duty curves to find a valid sizing input.',
  numberError: 'Enter a number greater than zero.',
  temperatureError: (min: number, max: number) => `Allowed: ${min} to ${max} °C.`,
  maxFrequencyError: 'Enter 50 to 120 %. Above 100 % needs variable speed.',
  hits: (count: number) => `${count}`,
}

/* ── Optional sizing parameters ────────────────────────────────────────────── */

export type OptionalField =
  | { kind: 'select'; id: string; label: string; default: string; options: ParameterOption[] }
  | { kind: 'number'; id: string; label: string; default: number; unit: string }

export type OptionalSection = {
  id: string
  title: string
  fields: OptionalField[]
}

export const optionalCopy = {
  title: 'Optional sizing parameters',
  expandAll: 'Expand all',
  collapseAll: 'Collapse all',
  fullWidth: 'Show full width',
  normalWidth: 'Show next to the chart',
}

export const optionalSections: OptionalSection[] = [
  {
    id: 'lcc',
    title: 'Lifecycle cost calculation',
    fields: [
      {
        kind: 'select',
        id: 'profile',
        label: 'Load profile',
        default: 'water-supply',
        options: [
          { value: 'constant', label: 'Constant, 100 % flow' },
          { value: 'water-supply', label: 'Water supply (100/75/50 %)' },
          { value: 'wastewater', label: 'Wastewater (variable)' },
        ],
      },
      {
        kind: 'number',
        id: 'hours',
        label: 'Operating hours per year',
        default: sizingDemo.operatingHours,
        unit: 'h',
      },
      {
        kind: 'number',
        id: 'eprice',
        label: 'Energy price',
        default: sizingDemo.electricityPrice,
        unit: 'EUR/kWh',
      },
      {
        kind: 'select',
        id: 'control',
        label: 'Control mode',
        default: 'constant-speed',
        options: [
          { value: 'constant-speed', label: 'Constant speed' },
          { value: 'constant-pressure', label: 'Constant pressure' },
          { value: 'proportional', label: 'Proportional pressure' },
        ],
      },
      {
        kind: 'select',
        id: 'night',
        label: 'Reduced night-time duty',
        default: 'no',
        options: [
          { value: 'no', label: 'No' },
          { value: 'yes', label: 'Yes, 50 % from 22:00 to 06:00' },
        ],
      },
    ],
  },
  {
    id: 'system',
    title: 'System and installation',
    fields: [
      { kind: 'number', id: 'pumps', label: 'Number of pumps', default: 1, unit: '' },
      {
        kind: 'select',
        id: 'standby',
        label: 'Duty/standby',
        default: '1-duty',
        options: [
          { value: '1-duty', label: '1 duty' },
          { value: '1-1', label: '1 duty + 1 standby' },
          { value: '2-1', label: '2 duty + 1 standby' },
        ],
      },
      {
        kind: 'select',
        id: 'parallel',
        label: 'Parallel operation',
        default: 'no',
        options: [
          { value: 'no', label: 'No' },
          { value: 'yes', label: 'Yes' },
        ],
      },
    ],
  },
  {
    id: 'suction',
    title: 'Suction conditions',
    fields: [
      { kind: 'number', id: 'npsha', label: 'NPSH available', default: 6, unit: 'm' },
      { kind: 'number', id: 'psuction', label: 'Suction pressure', default: 0, unit: 'bar' },
      { kind: 'number', id: 'altitude', label: 'Altitude', default: 50, unit: 'm' },
    ],
  },
  {
    id: 'liquid',
    title: 'Liquid properties',
    fields: [
      { kind: 'number', id: 'density', label: 'Density', default: 998, unit: 'kg/m³' },
      { kind: 'number', id: 'viscosity', label: 'Viscosity', default: 1, unit: 'mm²/s' },
      { kind: 'number', id: 'solids', label: 'Solids content', default: 0, unit: '%' },
    ],
  },
  {
    id: 'tolerances',
    title: 'Tolerances and standards',
    fields: [
      {
        kind: 'select',
        id: 'iso9906',
        label: 'ISO 9906 grade',
        default: '2B',
        options: ['1B', '2B', '3B'].map((g) => ({ value: g, label: `Grade ${g}` })),
      },
      {
        kind: 'select',
        id: 'certificate',
        label: 'Test certificate',
        default: 'none',
        options: [
          { value: 'none', label: 'None' },
          { value: '2.2', label: 'Works certificate 2.2' },
          { value: '3.1', label: 'Inspection certificate 3.1' },
        ],
      },
    ],
  },
]
