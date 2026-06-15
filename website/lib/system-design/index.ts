import type { SystemDesignArticle } from './types'
import howToApproach from './how-to-approach'
import designUrlShortener from './design-url-shortener'
import designRateLimiter from './design-rate-limiter'
import cachingFundamentals from './caching-fundamentals'
import fromLeetcodePatterns from './from-leetcode-patterns'
import { estimateReadMinutes } from './word-count'

export const SYSTEM_DESIGN_ARTICLES: SystemDesignArticle[] = [
  howToApproach,
  designUrlShortener,
  designRateLimiter,
  cachingFundamentals,
  fromLeetcodePatterns,
].map(a => ({
  ...a,
  readMinutes: estimateReadMinutes(a.sections),
}))

export function getAllSystemDesignArticles(): SystemDesignArticle[] {
  return SYSTEM_DESIGN_ARTICLES
}

export function getSystemDesignArticle(slug: string): SystemDesignArticle | undefined {
  return SYSTEM_DESIGN_ARTICLES.find(a => a.slug === slug)
}

export const CATEGORY_LABELS: Record<SystemDesignArticle['category'], string> = {
  fundamentals: 'Fundamentals',
  'case-study': 'Case Study',
  bridge: 'DSA Bridge',
}
