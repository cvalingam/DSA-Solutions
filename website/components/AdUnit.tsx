/**
 * AdUnit - AdSense when enabled, or a reserved placeholder for network review.
 *
 * Usage:
 *   <AdUnit slot="1234567890" style="sidebar" placeholder />
 *   <AdUnit slot="1234567890" style="leaderboard" />
 */

'use client'

import { useEffect } from 'react'
import { adsEnabled, adsenseClient, showAdSlots } from '@/lib/ads'

interface Props {
  slot: string
  style?: 'leaderboard' | 'rectangle' | 'sidebar'
  className?: string
  /** Render a reserved slot when live ads are disabled (article-page layout prep). */
  placeholder?: boolean
}

const heights: Record<NonNullable<Props['style']>, string> = {
  leaderboard: 'h-24',
  rectangle: 'h-64',
  sidebar: 'min-h-[100px] w-[130px]',
}

export default function AdUnit({
  slot,
  style = 'leaderboard',
  className = '',
  placeholder = false,
}: Props) {
  const liveAds = adsEnabled && !!adsenseClient && slot !== 'YOUR_AD_SLOT'
  const reservedSlot = placeholder && showAdSlots && !liveAds

  useEffect(() => {
    if (!liveAds) return
    try {
      // @ts-expect-error adsbygoogle is injected by Google's script
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // silently ignore - script not yet loaded
    }
  }, [slot, liveAds])

  if (!liveAds && !reservedSlot) {
    return null
  }

  if (reservedSlot) {
    return (
      <div
        className={`mx-auto flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/80 text-slate-400 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-500 ${heights[style]} ${className}`}
        aria-hidden="true"
      >
        <span className="text-[10px] uppercase tracking-wider">Ad</span>
      </div>
    )
  }

  return (
    <ins
      className={`adsbygoogle block ${heights[style]} ${className}`}
      data-ad-client={adsenseClient}
      data-ad-slot={slot}
      data-ad-format={style === 'sidebar' ? 'rectangle' : 'auto'}
      data-full-width-responsive={style === 'sidebar' ? 'false' : 'true'}
      style={style === 'sidebar' ? { display: 'inline-block', width: 130, height: 100 } : undefined}
    />
  )
}
