'use client'

import AdUnit from './AdUnit'

interface Props {
  slot?: string
}

/** Sticky sidebar slot sized for Carbon / EthicalAds (~130×100). */
export default function SidebarAdSlot({ slot = '4545599910' }: Props) {
  return (
    <div className="sticky top-24">
      <p className="mb-2 text-center text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
        Sponsored
      </p>
      <AdUnit slot={slot} style="sidebar" placeholder />
    </div>
  )
}
