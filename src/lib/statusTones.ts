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

/** The same on navy surfaces (Sulzer Connect). */
export const statusTonesOnDark: Record<AssetStatus, { dot: string; text: string; chip: string }> = {
  ok: {
    dot: 'bg-success-on-dark ring-success-on-dark/20',
    text: 'text-white',
    chip: 'bg-success-on-dark/15 text-success-on-dark',
  },
  warning: {
    dot: 'bg-warning-on-dark ring-warning-on-dark/25',
    text: 'text-warning-on-dark',
    chip: 'bg-warning-on-dark/15 text-warning-on-dark',
  },
  alarm: {
    dot: 'bg-danger-on-dark ring-danger-on-dark/25',
    text: 'text-danger-on-dark',
    chip: 'bg-danger-on-dark/15 text-danger-on-dark',
  },
}
