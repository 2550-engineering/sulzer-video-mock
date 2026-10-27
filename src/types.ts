import type { LucideIcon } from 'lucide-react'

export type User = {
  name: string
  initials: string
  company: string
  role: string
}

export type NavItem = {
  label: string
  to: string
}

export type MegaMenuItem = NavItem & {
  children?: NavItem[]
}

export type IconLink = NavItem & {
  icon: LucideIcon
}

export type FooterColumn = {
  title: string
  links: NavItem[]
}

/** Gradient shown while an image file hasn't been supplied yet. */
export type PlaceholderTone = 'ocean' | 'deep' | 'steel' | 'slate'

/** An image from `_asset-source/images`, referenced by file name. */
export type ImageRef = {
  file: string
  alt: string
  tone: PlaceholderTone
}

/** Card with an icon, title, one line of text and an arrow link. */
export type LinkCard = {
  title: string
  text: string
  linkLabel: string
  to: string
  icon: LucideIcon
}

/** Icon + label (+ optional line of text), optionally linking somewhere. */
export type IconItem = {
  label: string
  text?: string
  icon: LucideIcon
  to?: string
}

export type ApplicationTeaser = {
  title: string
  caption: string
  to: string
  image: ImageRef
}

/** A live-looking reading shown on the Sulzer Connect promo. Deterministic demo data. */
export type AssetReadout = {
  label: string
  value: string
  status: 'ok' | 'warning'
  /** Sparkline values, 0–100. */
  trend?: number[]
}

/** A route rendered with the "Coming soon" placeholder until its real page is built. */
export type PlaceholderRoute = {
  path: string
  title: string
  description: string
  /** Path of the parent page, used to build the breadcrumb trail. */
  parent?: string
}
