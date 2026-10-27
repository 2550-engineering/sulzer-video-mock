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

/** A route rendered with the "Coming soon" placeholder until its real page is built. */
export type PlaceholderRoute = {
  path: string
  title: string
  description: string
  /** Path of the parent page, used to build the breadcrumb trail. */
  parent?: string
}
