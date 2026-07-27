// Shared site URL - set NEXT_PUBLIC_SITE_URL in your Vercel / .env.local
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dsasolved.com'

/** Convert a problem title to a URL-safe LeetCode problem slug (for leetcode.com links) */
export function toLeetCodeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
