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
import designPastebin from './design-pastebin'
import designLeaderboard from './design-leaderboard'
import designApiGateway from './design-api-gateway'
import designCollaborativeDocumentEditor from './design-collaborative-document-editor'
import designInstagramPhotoSharing from './design-instagram-photo-sharing'
import designAirbnbHotelBooking from './design-airbnb-hotel-booking'
import designDistributedJobScheduler from './design-distributed-job-scheduler'
import designKeyValueStore from './design-key-value-store'
import designYelpNearbyPlaces from './design-yelp-nearby-places'
import designZoomVideoConferencing from './design-zoom-video-conferencing'
import designSpotifyMusicStreaming from './design-spotify-music-streaming'
import designGoogleMaps from './design-google-maps'
import designMetricsMonitoringSystem from './design-metrics-monitoring-system'
import designDistributedLock from './design-distributed-lock'
import designOnlineCodeJudge from './design-online-code-judge'
import designEmailServiceGmail from './design-email-service-gmail'
import designRecommendationSystem from './design-recommendation-system'
import designStockTradingSystem from './design-stock-trading-system'
import designFoodDeliveryDoordash from './design-food-delivery-doordash'
import designQaPlatformStackOverflow from './design-qa-platform-stack-overflow'
import designCdnContentDeliveryNetwork from './design-cdn-content-delivery-network'
import designLiveStreamingTwitch from './design-live-streaming-twitch'
import designDistributedLoggingSystem from './design-distributed-logging-system'
import designAdClickAggregator from './design-ad-click-aggregator'
import designGoogleCalendar from './design-google-calendar'
import designObjectStorageS3 from './design-object-storage-s3'
import designDnsSystem from './design-dns-system'
import designAuthenticationOauth from './design-authentication-oauth'
import designWebhookDeliverySystem from './design-webhook-delivery-system'
import designServiceDiscovery from './design-service-discovery'
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
  designPastebin,
  designLeaderboard,
  designApiGateway,
  designCollaborativeDocumentEditor,
  designInstagramPhotoSharing,
  designAirbnbHotelBooking,
  designDistributedJobScheduler,
  designKeyValueStore,
  designYelpNearbyPlaces,
  designZoomVideoConferencing,
  designSpotifyMusicStreaming,
  designGoogleMaps,
  designMetricsMonitoringSystem,
  designDistributedLock,
  designOnlineCodeJudge,
  designEmailServiceGmail,
  designRecommendationSystem,
  designStockTradingSystem,
  designFoodDeliveryDoordash,
  designQaPlatformStackOverflow,
  designCdnContentDeliveryNetwork,
  designLiveStreamingTwitch,
  designDistributedLoggingSystem,
  designAdClickAggregator,
  designGoogleCalendar,
  designObjectStorageS3,
  designDnsSystem,
  designAuthenticationOauth,
  designWebhookDeliverySystem,
  designServiceDiscovery,
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
