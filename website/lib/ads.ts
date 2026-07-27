/**
 * Ad configuration for dsasolved.com.
 *
 * NEXT_PUBLIC_ADS_ENABLED=false (default) - no AdSense script, no list-page ads.
 * NEXT_PUBLIC_SHOW_AD_SLOTS=true (default) - reserved sidebar/mobile slots on article pages
 *   for Carbon / EthicalAds layout review (subtle placeholders only).
 */

export const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true'

/** Show reserved ad real estate on article pages when live ads are off. */
export const showAdSlots =
  process.env.NEXT_PUBLIC_SHOW_AD_SLOTS !== 'false'

export const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? ''

/** Load the Google AdSense script only when explicitly enabled. */
export function shouldLoadAdsenseScript(): boolean {
  return adsEnabled && !!adsenseClient
}

/** Article pages (LC / GFG solutions with explanations). */
export function shouldShowArticleAdSlot(contentEligible: boolean): boolean {
  return showAdSlots && contentEligible
}

/** Homepage / hub leaderboard units. */
export function shouldShowHubAds(): boolean {
  return adsEnabled && !!adsenseClient
}
