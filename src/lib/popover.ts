/**
 * Shared fade/slide classes for header panels, the chat card and other popovers.
 * Visibility only transitions on close, so a panel is focusable the moment it opens.
 */
export function popoverClasses(open: boolean) {
  return [
    'duration-200 ease-sz',
    open
      ? 'visible translate-y-0 opacity-100 transition-[opacity,translate]'
      : 'invisible -translate-y-1.5 opacity-0 transition-[opacity,translate,visibility]',
  ].join(' ')
}
