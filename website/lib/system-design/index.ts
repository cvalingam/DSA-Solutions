import type { SystemDesignArticle } from './types'
import howToApproach from './how-to-approach'
import designUrlShortener from './design-url-shortener'
import designRateLimiter from './design-rate-limiter'
import cachingFundamentals from './caching-fundamentals'
import fromLeetcodePatterns from './from-leetcode-patterns'
import sqlVsNosql from './sql-vs-nosql-for-interviews'
import loadBalancing from './load-balancing-and-scaling'
import designNewsFeed from './design-news-feed'
import designChatMessaging from './design-chat-messaging'
import apiDesignRest from './api-design-rest-interviews'
import designNotificationSystem from './design-notification-system'
import designUniqueIdGenerator from './design-unique-id-generator'
import designTypeaheadAutocomplete from './design-typeahead-autocomplete'
import designFileStorageDropbox from './design-file-storage-dropbox'
import messageQueuesAsync from './message-queues-async-processing'
import designWebCrawler from './design-web-crawler'
import designRideHailingUber from './design-ride-hailing-uber'
import capTheoremConsistency from './cap-theorem-consistency-models'
import databaseShardingReplication from './database-sharding-replication'
import designPaymentSystem from './design-payment-system'
import designVideoStreamingNetflix from './design-video-streaming-netflix'
import designSearchEngine from './design-search-engine'
import designTicketBookingSystem from './design-ticket-booking-system'
import designDistributedCacheRedis from './design-distributed-cache-redis'
import designEcommerceShoppingCart from './design-ecommerce-shopping-cart'
import { estimateReadMinutes } from './word-count'

export const SYSTEM_DESIGN_ARTICLES: SystemDesignArticle[] = [
  howToApproach,
  designUrlShortener,
  designRateLimiter,
  cachingFundamentals,
  fromLeetcodePatterns,
  sqlVsNosql,
  loadBalancing,
  designNewsFeed,
  designChatMessaging,
  apiDesignRest,
  designUniqueIdGenerator,
  messageQueuesAsync,
  designNotificationSystem,
  designTypeaheadAutocomplete,
  designFileStorageDropbox,
  designWebCrawler,
  designRideHailingUber,
  capTheoremConsistency,
  databaseShardingReplication,
  designPaymentSystem,
  designVideoStreamingNetflix,
  designSearchEngine,
  designTicketBookingSystem,
  designDistributedCacheRedis,
  designEcommerceShoppingCart,
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
