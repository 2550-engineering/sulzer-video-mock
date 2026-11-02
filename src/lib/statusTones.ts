import type { AssetStatus } from '../types'

/** Colours per asset status: dot (with halo), chip and value text. */
export const statusTones: Record<AssetStatus, { dot: string; chip: string; text: string }> = {
  ok: {
    dot: 'bg-success ring-success-tint',
    chip: 'bg-success-tint text-success-strong',
    text: 'text-navy-900',
  },
  warning: {
    dot: 'bg-warning ring-warning-tint',
    chip: 'bg-warning-tint text-warning-strong',
    text: 'text-warning-strong',
  },
  alarm: {
    dot: 'bg-danger ring-danger-tint',
    chip: 'bg-danger-tint text-danger-strong',
    text: 'text-danger-strong',
  },
}
