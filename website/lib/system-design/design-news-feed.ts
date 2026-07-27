import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-news-feed',
  title: 'Design a News Feed (Twitter / Instagram Home Timeline)',
  description:
    'How to design a social media news feed for interviews: fan-out on write vs fan-out on read, ranking, caching celebrity users, and storage trade-offs.',
  readMinutes: 12,
  published: '2026-06-17',
  category: 'case-study',
  sections: [
    {
      type: 'p',
      text: 'The news feed is one of the most common system design prompts at product companies. It sounds simple - "show me recent posts from people I follow" - but the moment you mention celebrities with 50 million followers, the naive design breaks. This walkthrough follows the same framework as our [interview guide](/system-design/how-to-approach-system-design-interviews) and leans heavily on [caching](/system-design/caching-fundamentals-for-interviews).',
    },
    { type: 'h2', text: 'Requirements' },
    { type: 'h3', text: 'Functional' },
    {
      type: 'ul',
      items: [
        'Users publish posts (text, image, video metadata).',
        'Users follow other users.',
        'Home feed shows recent posts from followed users, ranked by recency or engagement.',
        'Pagination: load older posts on scroll.',
      ],
    },
    { type: 'h3', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'Feed read latency under 200ms p99.',
        'Write path should not block on fan-out to millions of followers.',
        'Scale: 500M users, 200M DAU, average 200 follows per user.',
        'Celebrity accounts may have 10M+ followers.',
      ],
    },
    {
      type: 'callout',
      title: 'Clarify ranking',
      text: 'Is chronological order enough, or do you need ML ranking (likes, comments, affinity)? For most interviews, start with reverse-chronological, then mention ranking as a v2 layer on top of candidate post IDs.',
    },
    { type: 'h2', text: 'Capacity estimation' },
    {
      type: 'p',
      text: 'Assume 200M DAU, each views feed 5 times/day → 1B feed reads/day ≈ 12,000 reads/sec average, ~60,000/sec peak. Posts: 100M new posts/day ≈ 1,200 writes/sec. Storage: if average post is 500 bytes metadata + media in object storage, posts DB grows ~50GB/day before replication. Feed cache per user might hold 500 post IDs × 8 bytes = 4KB - for 200M active users that is 800GB if everyone is cached (you will not cache everyone).',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'p',
      text: 'Split write path (publish post) from read path (load feed). Both paths share user graph, post storage, and media CDN.',
    },
    {
      type: 'table',
      headers: ['Component', 'Role'],
      rows: [
        ['Post service', 'Accept new posts, store metadata, enqueue fan-out job'],
        ['User graph service', 'Follow / unfollow relationships'],
        ['Feed service', 'Assemble timeline for a user on read'],
        ['Timeline cache (Redis)', 'Precomputed list of post IDs per user'],
        ['Post DB (SQL or NoSQL)', 'Post content, author, timestamp'],
        ['Object storage + CDN', 'Images and video'],
        ['Fan-out workers', 'Push post IDs into follower timelines asynchronously'],
      ],
    },
    { type: 'h2', text: 'Fan-out on write vs fan-out on read' },
    { type: 'h3', text: 'Fan-out on write (push model)' },
    {
      type: 'p',
      text: 'When user A posts, a worker inserts the post ID into every follower\'s timeline cache. Reads are fast: fetch prebuilt list from Redis, hydrate post details, return. Problem: if A has 10M followers, one post triggers 10M Redis writes.',
    },
    { type: 'h3', text: 'Fan-out on read (pull model)' },
    {
      type: 'p',
      text: 'On feed load, query posts from all users A follows, merge by timestamp, return top N. Simple for writes, expensive for reads when users follow thousands of accounts. Works for low-follow-count users if you hybrid.',
    },
    {
      type: 'table',
      headers: ['Strategy', 'Write cost', 'Read cost', 'Best for'],
      rows: [
        ['Fan-out on write', 'High for celebrities', 'Low', 'Normal users (< 10K followers)'],
        ['Fan-out on read', 'Low', 'High', 'Users following thousands of accounts'],
        ['Hybrid', 'Bounded writes + selective pull', 'Moderate', 'Production systems at scale'],
      ],
    },
    {
      type: 'callout',
      title: 'The hybrid approach (say this in interviews)',
      text: 'Fan-out on write for users with fewer than, say, 10,000 followers. For celebrities, store the post once and merge their recent posts at read time from a celebrity feed shard. This is how Twitter historically handled the "Justin Bieber problem."',
    },
    { type: 'h2', text: 'Write path step by step' },
    {
      type: 'ol',
      items: [
        'Client POST /posts with text and media upload URL.',
        'Post service validates, writes row to posts table, returns post_id.',
        'Publish event to message queue: { post_id, author_id, timestamp }.',
        'Fan-out worker consumes event: load follower list from graph service.',
        'For each follower under threshold: LPUSH post_id to Redis key feed:{follower_id} (trim to max 1000).',
        'For celebrity authors: skip fan-out; post lives in celebrity timeline only.',
        'Upload media async to S3; CDN serves on read.',
      ],
    },
    { type: 'h2', text: 'Read path step by step' },
    {
      type: 'ol',
      items: [
        'Client GET /feed?cursor=...',
        'Fetch post ID list from Redis feed:{user_id}.',
        'Merge with celebrity posts (pull recent from followed celebrities).',
        'Deduplicate, sort by timestamp, take page size (e.g. 20).',
        'Batch GET post details from DB or post cache by IDs.',
        'Optional: ranking layer reorders the 20 candidates.',
        'Return JSON with author info and media URLs.',
      ],
    },
    { type: 'h2', text: 'Data model sketch' },
    {
      type: 'ul',
      items: [
        'posts: post_id, user_id, content, created_at, media_url',
        'follows: follower_id, followee_id, created_at (index both directions)',
        'feed cache: Redis list feed:{user_id} → [post_id, ...]',
      ],
    },
    { type: 'h2', text: 'Failure modes' },
    {
      type: 'table',
      headers: ['Failure', 'Behaviour'],
      rows: [
        ['Fan-out worker lag', 'User sees own post immediately; followers see delay of seconds'],
        ['Redis miss', 'Fall back to fan-out on read from DB - slower but correct'],
        ['Celebrity post', 'Never fan-out; always merged at read'],
      ],
    },
    { type: 'h2', text: 'Unfollow, block, and deleted posts' },
    {
      type: 'p',
      text: 'When user B unfollows A, stop fanning A\'s future posts into B\'s timeline - but you do not need to purge historical IDs immediately; they age out as the Redis list is trimmed. Blocks are stronger: filter A\'s post IDs at read time even if they remain in cache. Deleted posts should publish a tombstone event so fan-out workers and read path can remove or hide the post_id. Mentioning this shows you think about graph changes, not just the happy path.',
    },
    { type: 'h2', text: 'Hot keys and sharding timelines' },
    {
      type: 'p',
      text: 'A celebrity does not fan-out on write, but millions of users may still read the same hot post metadata. Cache post bodies by post_id in Redis with TTL - classic [cache-aside](/system-design/caching-fundamentals-for-interviews). Timeline lists themselves can shard across Redis Cluster by hash of user_id so no single node holds every feed. If one influencer triggers read spikes, CDN + post cache absorbs it; timeline list size stays bounded by LTRIM.',
    },
    { type: 'h2', text: 'Ranking layer (v2)' },
    {
      type: 'p',
      text: 'Reverse-chronological is v1. Engagement ranking scores each candidate post: affinity (how often you interact with author), recency decay, and engagement velocity (likes in last hour). Fetch 200 recent post IDs from cache, score in the app tier or a ranking service, return top 20. Never rank the entire database - narrow candidates first, then rank. ML models are optional depth; describing the candidate → score → sort pipeline is enough for most interviews.',
    },
    { type: 'h2', text: 'Database choice per component' },
    {
      type: 'p',
      text: 'Posts and follows fit PostgreSQL with indexes on user_id and created_at. Timelines belong in Redis, not SQL - see our [SQL vs NoSQL](/system-design/sql-vs-nosql-for-interviews) guide for why polyglot persistence fits here. Media blobs live in S3; only URLs in the posts table.',
    },
    { type: 'h2', text: 'Scaling the read path' },
    {
      type: 'p',
      text: 'Feed API servers sit behind an L7 [load balancer](/system-design/load-balancing-and-scaling) with a stateless app tier. Each request: Redis timeline fetch → optional celebrity merge → batch post hydrate. Use connection pooling to PostgreSQL read replicas for cache misses. Target sub-200ms p99 by keeping the critical path to one Redis round-trip plus one batched DB query.',
    },
    { type: 'h2', text: 'API design' },
    {
      type: 'table',
      headers: ['Endpoint', 'Method', 'Response'],
      rows: [
        ['POST /v1/posts', 'Create post', '201 { post_id, created_at }'],
        ['GET /v1/feed?cursor=&limit=20', 'Home timeline', '200 { posts[], next_cursor }'],
        ['GET /v1/users/{id}/posts?cursor=', 'Profile posts', '200 paginated'],
        ['POST /v1/users/{id}/follow', 'Follow', '204'],
        ['DELETE /v1/users/{id}/follow', 'Unfollow', '204'],
        ['POST /v1/media/upload', 'Pre-signed S3 URL', '201 { upload_url, media_id }'],
      ],
    },
    {
      type: 'p',
      text: 'Use cursor pagination on feed and profile - see [API design](/system-design/api-design-rest-interviews). Return 429 on post spam via [rate limiter](/system-design/design-rate-limiter).',
    },
    { type: 'h2', text: 'Media upload flow' },
    {
      type: 'ol',
      items: [
        'Client requests POST /v1/media/upload with content_type.',
        'Server returns pre-signed S3 PUT URL and media_id.',
        'Client uploads bytes directly to S3 (offloads bandwidth from app tier).',
        'Client POST /v1/posts with { content, media_id }.',
        'CDN serves media_url on feed read - same pattern as [URL shortener](/system-design/design-url-shortener) redirect offload.',
      ],
    },
    { type: 'h2', text: 'Follow graph at scale' },
    {
      type: 'p',
      text: 'follows table with (follower_id, followee_id) indexed both ways supports "who does A follow?" for fan-out and "who follows B?" for follower counts. At billions of edges, shard by follower_id for fan-out reads. Celebrity followee_id rows are few but fan-out workers batch them separately. Graph DB is optional depth unless the prompt is social recommendations.',
    },
    { type: 'h2', text: 'Latency budget for feed read' },
    {
      type: 'table',
      headers: ['Step', 'Target p99'],
      rows: [
        ['LB + auth', '5ms'],
        ['Redis LRANGE feed:{user_id}', '2ms'],
        ['Merge celebrity posts (small set)', '5ms'],
        ['Batch hydrate 20 posts from cache/DB', '15ms'],
        ['Serialize JSON response', '3ms'],
      ],
    },
    {
      type: 'p',
      text: 'Total ~30ms server-side leaves headroom for network on a 200ms p99 SLA. Cache post bodies by post_id to make hydrate a Redis MGET, not 20 SQL round-trips.',
    },
    { type: 'h2', text: 'What to say in the last five minutes' },
    {
      type: 'p',
      text: 'Close with: "Hybrid fan-out avoids celebrity write explosions, async workers keep post creation fast, Redis timelines make reads cheap per user, and we merge celebrity content at read. Post metadata in Postgres, timelines in Redis, media on S3/CDN. I would add engagement ranking on a bounded candidate set and rate-limit creates per user." That hits the trade-offs interviewers score highest.',
    },
    { type: 'h2', text: 'Mock interview checklist' },
    {
      type: 'ol',
      items: [
        'Clarified functional vs non-functional requirements and ranking scope.',
        'Did napkin math for reads/sec, writes/sec, and cache size.',
        'Explained fan-out on write vs read and the celebrity hybrid.',
        'Walked write path and read path separately.',
        'Named Redis for timelines and SQL for posts/follows.',
        'Mentioned failure modes (worker lag, cache miss fallback).',
      ],
    },
    { type: 'h2', text: 'Closing summary' },
    {
      type: 'p',
      text: 'Propose hybrid fan-out, async workers, Redis timelines, and celebrity exception. Mention [rate limiting](/system-design/design-rate-limiter) on post creation and [caching](/system-design/caching-fundamentals-for-interviews) for hot post metadata. That answer covers the hard part interviewers care about.',
    },
  ],
}

export default article
