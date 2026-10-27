const sizes = {
  sm: 'size-8 text-xs',
  md: 'size-11 text-sm',
} as const

type AvatarProps = {
  initials: string
  size?: keyof typeof sizes
  className?: string
}

/** Initials in a Sulzer-blue circle. */
export function Avatar({ initials, size = 'sm', className = '' }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-primary font-semibold tracking-wide text-white ${sizes[size]} ${className}`}
    >
      {initials}
    </span>
  )
}
