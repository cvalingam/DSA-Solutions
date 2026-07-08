import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-instagram-photo-sharing',
  title: 'Design Instagram (Photo Sharing)',
  description:
    'How to design a photo sharing app like Instagram for interviews: media upload pipeline, CDN delivery, news feed integration, likes, and scaling image-heavy social traffic.',
  readMinutes: 14,
  published: '2026-07-08',
  category: 'case-study',
  seoKeywords: [
    'Instagram system design',
    'photo sharing app architecture',
    'image upload CDN interview',
    'social media feed system design',
  ],
  sections: [
    {
      type: 'p',
      text: 'Instagram combines two hard problems: moving large binary files (photos and video) and showing a personalized [news feed](/system-design/design-news-feed) that feels instant. Interviewers use it when they want more than a text-only Twitter clone — you must discuss CDNs, transcoding, and object storage, not just fan-out on write. If you already read our feed article, this one adds the media path on top.',
    },
    {
      type: 'p',
      text: 'Follow the [interview framework](/system-design/how-to-approach-system-design-interviews). Clarify: photo + caption only (no Reels depth), followers graph like Twitter, chronological or ranked feed, and max image size (e.g. 10 MB).',
    },
    { type: 'h2', text: 'Core features' },
    {
      type: 'ul',
      items: [
        'Upload photo with caption and optional location.',
        'Follow / unfollow users.',
        'Home feed of posts from people you follow.',
        'Like and comment on posts.',
        'Profile page listing a user\'s posts (grid view).',
      ],
    },
    { type: 'h2', text: 'Upload path (most important media detail)' },
    {
      type: 'ol',
      items: [
        'Client requests presigned S3 URL from API (`POST /v1/media/upload-url`).',
        'Client PUTs image directly to S3 — avoids proxying bytes through API servers.',
        'Client calls `POST /v1/posts` with `media_id`, caption, filters metadata.',
        'Async worker generates thumbnails (150px, 640px, 1080px) and WebP variants.',
        'Worker updates post record when processing completes; CDN cache warms on first GET.',
      ],
    },
    {
      type: 'callout',
      title: 'Why presigned URLs?',
      text: 'API servers stay stateless and CPU-light. S3 absorbs upload bandwidth. Same pattern as [Dropbox](/system-design/design-file-storage-dropbox) chunked upload and [Netflix](/system-design/design-video-streaming-netflix) origin uploads — never stream large files through app tier.',
    },
    { type: 'h2', text: 'Data model' },
    {
      type: 'table',
      headers: ['Entity', 'Store', 'Notes'],
      rows: [
        ['users', 'PostgreSQL', 'user_id, username, bio, profile_pic_url'],
        ['posts', 'PostgreSQL', 'post_id, user_id, caption, created_at, media_ids[]'],
        ['media', 'PostgreSQL + S3', 'media_id, s3_keys per resolution, status'],
        ['follows', 'PostgreSQL / graph DB', 'follower_id, followee_id, indexed both ways'],
        ['likes', 'PostgreSQL or Redis', 'High write rate → consider Redis counter + async flush'],
        ['feed_timeline', 'Redis', 'Same hybrid fan-out as [news feed](/system-design/design-news-feed)'],
      ],
    },
    { type: 'h2', text: 'Feed generation' },
    {
      type: 'p',
      text: 'Reuse the hybrid fan-out from [news feed design](/system-design/design-news-feed): normal users fan-out on write to followers\' Redis timelines; celebrities with millions of followers fan-in on read (merge recent posts at request time). Post object in timeline stores `post_id` only; hydrate caption and media URLs in batch from cache or DB.',
    },
    { type: 'h2', text: 'Serving images fast' },
    {
      type: 'ul',
      items: [
        'Store multiple resolutions in S3; API returns CDN URLs per device DPI.',
        'CloudFront / Cloudflare caches `https://cdn.example.com/media/{id}_640.jpg`.',
        'Long cache TTL on immutable media (content-addressed filenames).',
        'Lazy generation: first request triggers worker if thumbnail missing — edge case only.',
      ],
    },
    {
      type: 'p',
      text: 'Image bytes never hit PostgreSQL. Metadata row points to CDN URLs — same blob/metadata split as [file storage](/system-design/design-file-storage-dropbox).',
    },
    { type: 'h2', text: 'Likes and counters' },
    {
      type: 'p',
      text: 'Like button spam generates huge write QPS. Hot path: `INCR post:{id}:likes` in Redis, `SADD post:{id}:likers user_id` if you need unlike idempotency. Async worker batches flush to PostgreSQL for analytics. Display count from Redis with periodic reconciliation. Mention [rate limiting](/system-design/design-rate-limiter) on like endpoint to block bots.',
    },
    { type: 'h2', text: 'Comments' },
    {
      type: 'p',
      text: 'Store comments in PostgreSQL sharded by `post_id`. Paginate `GET /posts/{id}/comments?cursor=`. Notify post owner via [notification service](/system-design/design-notification-system) on new comment — async Kafka event, not sync in request path.',
    },
    { type: 'h2', text: 'Profile grid' },
    {
      type: 'p',
      text: '`SELECT post_id, thumbnail_url FROM posts WHERE user_id = ? ORDER BY created_at DESC LIMIT 30` with index on `(user_id, created_at)`. Cache profile summary in Redis. Infinite scroll uses cursor pagination per [API design](/system-design/api-design-rest-interviews).',
    },
    { type: 'h2', text: 'Search and discovery (optional depth)' },
    {
      type: 'p',
      text: 'Hashtags: extract on post create, write to `hashtag_posts` table or inverted index. Explore tab uses ranking service — separate from core feed; mention [search engine](/system-design/design-search-engine) patterns if interviewer asks.',
    },
    { type: 'h2', text: 'Scaling checklist' },
    {
      type: 'ul',
      items: [
        'Stateless API behind [load balancer](/system-design/load-balancing-and-scaling).',
        'S3 + CDN for all media bytes.',
        'Redis timelines + [cache](/system-design/caching-fundamentals-for-interviews) for hot posts.',
        'Shard posts DB by `post_id` or `user_id` when single primary fills ([sharding](/system-design/database-sharding-replication)).',
        'Transcoding workers scale on SQS/Kafka queue depth ([async processing](/system-design/message-queues-async-processing)).',
      ],
    },
    { type: 'h2', text: 'Feed ranking (beyond chronological)' },
    {
      type: 'p',
      text: 'Chronological feed is MVP. Ranked feed scores posts by engagement prediction, relationship strength, and recency decay. Offline feature store computes scores; online serving reads precomputed ranks per user. Same timeline storage in Redis — change what post_ids you insert and in what order. Heavy ML is optional depth; mention "ranking service" without building Netflix-level recommendations in 45 minutes.',
    },
    {
      type: 'p',
      text: 'Explore tab is a different product surface: global popular media ranked by engagement velocity, heavily cached, refreshed every few minutes. Do not mix Explore infrastructure with home feed — different SLAs and cache keys.',
    },
    {
      type: 'callout',
      title: 'Interview time boxing',
      text: 'Spend at most 5 minutes on ranking unless prompt says "Instagram algorithm." Photo pipeline + fan-out usually fills the slot.',
    },
    { type: 'h2', text: 'Stories vs feed (Instagram-specific)' },
    {
      type: 'p',
      text: 'Stories are 24-hour ephemeral media with separate storage keys and aggressive TTL — similar to [Pastebin expiration](/system-design/design-pastebin). Feed posts are durable. If interviewer asks about Stories, describe a second media pipeline with `expires_at` on metadata and CDN cache TTL aligned to 24 hours. Do not merge Stories and feed tables without reason.',
    },
    { type: 'h2', text: 'Worked example: posting a photo' },
    {
      type: 'ol',
      items: [
        'User selects 4 MB JPEG, adds caption "Sunset in Chennai".',
        'App requests presigned URL, uploads to S3 `uploads/tmp/{uuid}`.',
        'App POSTs `/v1/posts` → API creates post row (status=processing), enqueues transcode job.',
        'Worker produces 320px and 1080px WebP, updates post status=live, writes CDN URLs.',
        'Fan-out post_id to 800 followers\' Redis timelines (user is not a celebrity).',
        'Followers\' next feed refresh shows thumbnail from CDN edge — no S3 hit.',
      ],
    },
    { type: 'h2', text: 'Celebrity follower problem' },
    {
      type: 'p',
      text: 'Celebrity with 30M followers cannot fan-out on write (30M Redis writes per post). Use fan-in on read: merge celebrity\'s recent posts when building home feed, same as [news feed](/system-design/design-news-feed) hybrid model. Media CDN URLs are identical — only timeline fan-out strategy changes.',
    },
    { type: 'h2', text: 'Cost awareness' },
    {
      type: 'ul',
      items: [
        'Egress from S3 to internet is expensive — CDN reduces origin pulls 90%+.',
        'Transcoding is CPU-heavy — autoscale workers separately from API pods.',
        'Delete orphaned S3 uploads when client never completes POST /posts.',
        'Store only derived resolutions users actually request in analytics.',
      ],
    },
    {
      type: 'p',
      text: 'Direct messages and sharing posts to DMs reuse [notification](/system-design/design-notification-system) infrastructure. Video posts extend pipeline with HLS transcoding like [Netflix](/system-design/design-video-streaming-netflix) — mention as extension, not core MVP.',
    },
    { type: 'h2', text: 'Hashtags and search' },
    {
      type: 'p',
      text: 'Caption parsing extracts `#chennai` tokens on post create. Write to inverted index: hashtag → sorted set of post_ids by timestamp (same Redis ZSET pattern as [leaderboard](/system-design/design-leaderboard)). Search "chennai" queries Elasticsearch for caption text; hashtag pages read Redis. Trending hashtags are a sliding-window count job — not on critical upload path.',
    },
    {
      type: 'p',
      text: 'User search by username hits PostgreSQL index on `username` or a dedicated search replica. Keep search eventually consistent — new post appears in hashtag feed within seconds, not milliseconds.',
    },
    { type: 'h2', text: 'Interview narrative' },
    {
      type: 'p',
      text: 'Spend 40% of time on upload + CDN + thumbnails, 40% on feed (cite celebrity hybrid fan-out), 20% on likes/comments/notifications. Draw S3 outside the API box. Compare to pure [news feed](/system-design/design-news-feed) — "same timeline machinery, plus object storage and CDN for binary assets." That structure matches how real teams built photo apps.',
    },
  ],
}

export default article
