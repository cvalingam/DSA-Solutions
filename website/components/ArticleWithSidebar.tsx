import type { ReactNode } from 'react'
import SidebarAdSlot from './SidebarAdSlot'

interface Props {
  children: ReactNode
  showSidebar?: boolean
  adSlot?: string
}

/**
 * Desktop: main column + sticky right sidebar for a 130×100-class ad unit.
 * Mobile: single-column content only (inline mobile ad handled inside children).
 */
export default function ArticleWithSidebar({
  children,
  showSidebar = false,
  adSlot,
}: Props) {
  if (!showSidebar) {
    return <div className="max-w-3xl mx-auto">{children}</div>
  }

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_160px] lg:gap-8 lg:items-start">
      <div className="min-w-0 max-w-3xl">{children}</div>
      <aside className="hidden lg:block" aria-label="Sponsored">
        <SidebarAdSlot slot={adSlot} />
      </aside>
    </div>
  )
}
