import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'caching-fundamentals-for-interviews',
  title: 'Caching Fundamentals Every Interview Candidate Should Know',
  description:
    'When to add a cache, cache-aside vs read-through vs write-through, TTL and invalidation, Redis vs CDN, and the consistency traps that catch candidates in system design interviews.',
  readMinutes: 13,
  published: '2026-06-06',
  category: 'fundamentals',
  sections: [
    {
      type: 'p',
      text: 'Caching is the first optimisation interviewers expect you to reach for on read-heavy systems. It is also where designs fall apart — stale data, thundering herds, and caches that never warm up. This article explains caching the way you would use it on a real .NET or Java backend, not as an abstract buzzword. You will apply these ideas directly in our [URL shortener](/system-design/design-url-shortener) and [rate limiter](/system-design/design-rate-limiter) walkthroughs.',
    },
    {
      type: 'p',
      text: 'If you have implemented LRU Cache on LeetCode (problem 146), you already understand eviction. Production caching adds distribution, TTLs, and the hard question: what happens when the database and cache disagree?',
    },
    { type: 'h2', text: 'Why cache at all?' },
    {
      type: 'p',
      text: 'Caches trade memory for latency and throughput. A PostgreSQL query that takes 15ms might become 1ms in Redis. More importantly, you protect the database from repetitive identical reads — the URL shortener redirect path, product catalog pages, user profile lookups. Without caching, viral traffic becomes a database outage.',
    },
    {
      type: 'ul',
      items: [
        'Read-heavy workloads with repeated keys (80/20 rule: 20% of keys serve 80% of traffic).',
        'Expensive computation (aggregations, ML inference results).',
        'Session data and rate limit counters.',
        'Static assets — images, JS bundles — via CDN at the edge.',
      ],
    },
    {
      type: 'callout',
      title: 'When not to cache',
      text: 'Do not cache everything. Highly personalised, rarely repeated queries waste memory. Strongly consistent financial balances should not be served from a stale cache without careful invalidation. Ask: "If this value is 30 seconds old, is that acceptable?"',
    },
    { type: 'h2', text: 'Cache placement in the stack' },
    {
      type: 'ol',
      items: [
        'Client/browser cache — HTTP Cache-Control headers.',
        'CDN — geographically close to users for static and some API responses.',
        'Application in-memory cache — per-server, ultra fast, not shared (IMemoryCache in .NET).',
        'Distributed cache — Redis, Memcached, shared across all app instances.',
        'Database buffer pool — internal to PostgreSQL/SQL Server, not your design choice but worth acknowledging.',
      ],
    },
    { type: 'h2', text: 'The main caching patterns' },
    { type: 'h3', text: 'Cache-aside (lazy loading)' },
    {
      type: 'p',
      text: 'Application manages cache. On read: check cache → on miss, read DB → write to cache → return. On write: update DB → delete cache key (or update cache). This is the default pattern in interviews because it is simple and the application controls consistency.',
    },
    { type: 'h3', text: 'Read-through' },
    {
      type: 'p',
      text: 'Cache sits in front of DB; cache library loads on miss transparently. Less application code, but you need a cache product that supports it. ORM second-level caches often work this way.',
    },
    { type: 'h3', text: 'Write-through' },
    {
      type: 'p',
      text: 'Writes go to cache and DB synchronously. Stronger consistency, higher write latency. Used when reads must never see stale data after a write.',
    },
    { type: 'h3', text: 'Write-behind (write-back)' },
    {
      type: 'p',
      text: 'Writes ack to cache immediately; async flush to DB. High write throughput, risk of data loss on crash. Mention for analytics buffers, not for bank transfers.',
    },
    {
      type: 'table',
      headers: ['Pattern', 'Read path', 'Write path', 'Typical use'],
      rows: [
        ['Cache-aside', 'App checks cache first', 'App invalidates or updates cache', 'General purpose APIs'],
        ['Read-through', 'Cache loads from DB', 'App writes DB, invalidates', 'ORM-heavy apps'],
        ['Write-through', 'Cache always warm', 'Sync to cache + DB', 'Inventory with strict reads'],
        ['Write-behind', 'From cache', 'Async DB persist', 'Metrics, logs, counters'],
      ],
    },
    { type: 'h2', text: 'TTL and invalidation' },
    {
      type: 'p',
      text: 'Time-to-live (TTL) is a safety net. Even if invalidation fails, data expires. Short TTL (30–60s) for semi-dynamic content; long TTL (hours) for static catalog data with explicit purge on update.',
    },
    {
      type: 'p',
      text: 'Invalidation strategies:',
    },
    {
      type: 'ul',
      items: [
        'Delete key on write — simplest cache-aside approach.',
        'Versioned keys — cache user:123:v5; bump version on update instead of hunting all derived keys.',
        'Pub/sub broadcast — on update, all app servers evict local caches (useful with in-memory L1 + Redis L2).',
        'Event-driven — change data capture from DB streams invalidates downstream caches.',
      ],
    },
    {
      type: 'callout',
      title: 'Thundering herd',
      text: 'Cache expires on a hot key; 10,000 requests simultaneously miss and hammer the database. Mitigations: probabilistic early expiry, request coalescing (only one thread reloads), or a short-lived mutex lock in Redis during refresh.',
    },
    { type: 'h2', text: 'Redis vs CDN vs in-process' },
    {
      type: 'p',
      text: 'Redis: sub-millisecond shared state, rich data structures (sorted sets for leaderboards, HyperLogLog for counts). Use for API response caching, sessions, rate limits.',
    },
    {
      type: 'p',
      text: 'CDN (Cloudflare, CloudFront): caches HTTP responses at edge PoPs. Perfect for static files and cacheable GET APIs with proper Cache-Control. Cannot run your business logic.',
    },
    {
      type: 'p',
      text: 'In-process (IMemoryCache, Caffeine): zero network hop but not shared across pods. Good for config, reference data, and L1 in front of Redis. In .NET: register IMemoryCache for hot keys, IDistributedCache backed by Redis for shared state.',
    },
    { type: 'h2', text: 'Consistency vocabulary' },
    {
      type: 'ul',
      items: [
        'Cache hit ratio — % of reads served from cache; monitor this in production.',
        'Stale read — user sees old value after someone else updated; acceptable for social likes, not for seat reservations.',
        'Cold start — empty cache after deploy; warm critical keys or use gradual rollout.',
        'Cache penetration — queries for non-existent keys bypass cache every time; use short TTL on negative cache entries.',
      ],
    },
    { type: 'h2', text: 'Worked example: URL shortener redirect' },
    {
      type: 'p',
      text: 'Follow the redirect path from our [URL shortener case study](/system-design/design-url-shortener). User requests GET /abc123. App checks Redis key url:abc123. Hit → return long URL in 1ms. Miss → SELECT from PostgreSQL read replica → SET Redis with 24h TTL → redirect. On link delete, DEL url:abc123. On update, DEL or SET new value. Draw this flow in an interview before mentioning CDN — it shows you understand the core loop.',
    },
    { type: 'h2', text: '.NET implementation sketch' },
    {
      type: 'p',
      text: 'In ASP.NET Core, register IDistributedCache with StackExchange.Redis. Cache-aside pseudocode: var cached = await cache.GetStringAsync(key); if (cached != null) return cached; var fromDb = await repo.GetAsync(key); await cache.SetStringAsync(key, fromDb, new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5) }); return fromDb. For L1+L2, wrap IMemoryCache around Redis for config and reference data within a single pod. This is production-grade .NET, not pseudocode fantasy.',
    },
    { type: 'h2', text: 'Monitoring what matters' },
    {
      type: 'ul',
      items: [
        'Hit ratio — below 80% on a read-heavy path means TTL too short, wrong keys, or insufficient memory.',
        'Eviction rate — Redis evicting keys means memory maxed; scale cluster or tighten TTLs.',
        'Miss latency p99 — spikes indicate thundering herd or cold start after deploy.',
        'Stale read incidents — track version mismatches after writes; alert if user-facing.',
      ],
    },
    {
      type: 'p',
      text: 'Interviewers at product companies appreciate when you mention observability without being asked. Caching is not fire-and-forget — bad cache config causes subtle production bugs for weeks.',
    },
    { type: 'h2', text: 'Interview sound bite' },
    {
      type: 'p',
      text: 'When the interviewer asks "how would you speed this up?", say: "This path is read-heavy with repeated keys. I would add a Redis cache-aside layer with a 5-minute TTL, invalidate on write, and put static assets on a CDN. I would monitor hit ratio and watch for thundering herd on hot keys." That single paragraph covers pattern, technology, invalidation, and operational awareness.',
    },
    { type: 'h2', text: 'Cache stampede — step-by-step mitigation' },
    {
      type: 'p',
      text: 'Step 1: hot key expires. Step 2: 10,000 concurrent requests miss. Step 3: all 10,000 hit PostgreSQL. Step 4: database latency spikes, timeouts cascade. Mitigation A: single-flight — first miss acquires a lock, others wait for reload. Mitigation B: stale-while-revalidate — serve stale value while one worker refreshes. Mitigation C: jittered TTL so keys do not expire simultaneously. Mention at least one in every design that uses [caching](/system-design/caching-fundamentals-for-interviews).',
    },
    {
      type: 'p',
      text: 'You cannot simultaneously guarantee perfect consistency, full availability, and tolerance to network partitions. Caches choose availability + partition tolerance with eventual consistency. Bank ledgers choose consistency over availability during a partition. Saying which letter you sacrifice — and why — is often enough at mid-level without a full lecture.',
    },
    { type: 'h2', text: 'When the interviewer says "design a news feed"' },
    {
      type: 'p',
      text: 'Feeds are a caching and fan-out problem. Precompute timelines (fan-out on write) and cache per user in Redis — fast reads, heavy writes when celebrities post. Or assemble on read (fan-out on read) — lighter writes, slower reads for users following thousands. Most answers blend both: cache hot users, assemble cold ones. Tie back to [caching patterns](/system-design/caching-fundamentals-for-interviews) and our [LeetCode-to-systems bridge](/system-design/from-leetcode-patterns-to-real-systems) (BFS fan-out).',
    },
  ],
}

export default article
