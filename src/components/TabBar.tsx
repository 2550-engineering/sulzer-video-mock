import { type RefObject, useLayoutEffect, useRef } from 'react'
import type { TabDef } from '../types'

type TabBarProps = {
  tabs: TabDef[]
  active: string
  onSelect: (id: string) => void
  /** From useHashTab, so switching tabs can scroll back to the bar. */
  anchorRef: RefObject<HTMLDivElement | null>
  /** Prefix for tab/panel ids, so `aria-controls` points at `${idPrefix}-${tab.id}-panel`. */
  idPrefix: string
}

/** Tab button padding (px-4); the underline is inset by the same amount. */
const tabPadding = 16

/**
 * White tab strip that sticks under the site header, with a blue underline that
 * slides to the active tab. Pair with <TabPanel> and useHashTab.
 */
export function TabBar({ tabs, active, onSelect, anchorRef, idPrefix }: TabBarProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const underlineRef = useRef<HTMLSpanElement>(null)

  // Position the underline under the active tab. The first placement is instant;
  // `data-ready` turns the slide transition on for later changes.
  useLayoutEffect(() => {
    const list = listRef.current
    const underline = underlineRef.current
    if (!list || !underline) return
    const place = () => {
      const tab = list.querySelector<HTMLElement>('[aria-selected="true"]')
      if (!tab) return
      underline.style.width = `${tab.offsetWidth - 2 * tabPadding}px`
      underline.style.transform = `translateX(${tab.offsetLeft + tabPadding}px)`
    }
    place()
    const frame = requestAnimationFrame(() => (underline.dataset.ready = ''))
    const observer = new ResizeObserver(place)
    observer.observe(list)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [active])

  return (
    <>
      <div ref={anchorRef} aria-hidden />
      <div className="sticky top-(--sz-header-height) z-40 border-b border-border bg-white/95 backdrop-blur-sm">
        <div className="site-container">
          <div ref={listRef} role="tablist" className="relative -ml-4 flex overflow-x-auto">
            {tabs.map((tab) => {
              const selected = tab.id === active
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`${idPrefix}-${tab.id}-tab`}
                  aria-selected={selected}
                  aria-controls={`${idPrefix}-${tab.id}-panel`}
                  onClick={() => onSelect(tab.id)}
                  className={[
                    'h-16 shrink-0 px-4 text-[15px] whitespace-nowrap transition-colors',
                    selected
                      ? 'font-semibold text-navy-900'
                      : 'font-medium text-text-muted hover:text-navy-900',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              )
            })}
            <span
              ref={underlineRef}
              aria-hidden
              className="absolute bottom-0 left-0 h-[3px] rounded-t-sm bg-primary data-ready:transition-[transform,width] data-ready:duration-250 data-ready:ease-sz"
            />
          </div>
        </div>
      </div>
    </>
  )
}
