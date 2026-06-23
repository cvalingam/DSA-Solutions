import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-distributed-cache-redis',
  title: 'Design a Distributed Cache (Redis)',
  description:
    'How to design Redis-like distributed caching: consistent hashing, replication, eviction, cache stampede, and when to use cache-aside in system design interviews.',
  readMinutes: 11,
  published: '2026-06-26',
  category: 'fundamentals',
  seoKeywords: [
    'Redis system design interview',
    'distributed cache architecture',
    'consistent hashing cache',
    'cache stampede prevention',
  ],
  sections: [
    {
      type: 'p',
      text: 'Almost every case study on this site mentions Redis — [URL shortener](/system-design/design-url-shortener) redirects, [rate limiter](/system-design/design-rate-limiter) counters, [news feed](/system-design/design-news-feed) timelines. Interviewers sometimes zoom in: "How would you build Redis itself?" You are not implementing every command; you are explaining sharding, replication, eviction, and failure behaviour. Read [caching fundamentals](/system-design/caching-fundamentals-for-interviews) first for cache-aside vs write-through; this article goes one level deeper into the cache cluster.',
    },
    { type: 'h2', text: 'What interviewers want' },
    {
      type: 'ul',
      items: [
        'Why a distributed cache exists (RAM latency, offload hot reads from DB).',
        'How keys map to nodes (consistent hashing).',
        'What happens when a node dies (replication, failover).',
        'Eviction when memory is full (LRU, TTL).',
        'Stampede and thundering herd mitigation.',
      ],
    },
    {
      type: 'callout',
      title: 'Not the same as CDN',
      text: 'CDN caches static HTTP responses at the edge. Distributed cache (Redis) stores application objects (sessions, counters, serialized rows) close to app servers in the same region. Both are caches; different layers.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'table',
      headers: ['Component', 'Role'],
      rows: [
        ['Cache nodes', 'In-memory key-value store; partition of keyspace'],
        ['Consistent hash ring', 'Map key → primary node; virtual nodes for balance'],
        ['Replicas', 'Async copy of primary shard for read scaling and failover'],
        ['Client library / proxy', 'Smart client or Twemproxy/Envoy routes to correct shard'],
        ['Sentinel / control plane', 'Health checks, promote replica on primary failure'],
      ],
    },
    { type: 'h2', text: 'Consistent hashing' },
    {
      type: 'p',
      text: 'Naive `hash(key) % N` breaks when N changes — almost all keys remap. Consistent hashing places nodes and keys on a ring; key belongs to first node clockwise. Adding a node steals only adjacent key ranges. Virtual nodes (many points per physical server) smooth hot spots. Redis Cluster specifically uses 16,384 hash slots (CRC16 of key → slot → node) — same interview idea, slightly different implementation. Same idea as [database sharding](/system-design/database-sharding-replication) — interviewers expect you to draw the ring once.',
    },
    { type: 'h2', text: 'Replication and failover' },
    {
      type: 'p',
      text: 'Each primary has one or more replicas. Writes go to primary; replicate asynchronously to replica (AP — brief loss window if primary dies before replicate). On primary failure, sentinel promotes replica; clients refresh ring metadata. Split-brain risk if two primaries — use quorum-based failover (majority of sentinels agree). For [CAP](/system-design/cap-theorem-consistency-models) discussions: Redis cluster trades perfect consistency for speed unless you use WAIT command (rare in interviews).',
    },
    { type: 'h2', text: 'Eviction policies' },
    {
      type: 'table',
      headers: ['Policy', 'Behaviour', 'When to mention'],
      rows: [
        ['TTL expiry', 'Key vanishes after set time', 'Sessions, rate limit windows'],
        ['LRU (approximate)', 'Evict least recently used when maxmemory hit', 'General object cache'],
        ['LFU', 'Evict least frequently used', 'Hot key skew, repeated reads'],
        ['noeviction', 'Return error on write when full', 'Critical counters — fail loud'],
      ],
    },
    {
      type: 'p',
      text: 'LeetCode LRU Cache (146) is the same eviction idea in one machine — say that connection out loud.',
    },
    { type: 'h2', text: 'Cache-aside in production' },
    {
      type: 'ol',
      items: [
        'App reads cache; on miss, read DB, populate cache, return.',
        'On write, update DB first, then delete cache key (not update — avoids race).',
        'Set TTL to bound staleness even if invalidation misses.',
      ],
    },
    {
      type: 'p',
      text: 'This pattern appears in [URL shortener](/system-design/design-url-shortener), [ride hailing](/system-design/design-ride-hailing-uber) surge multipliers, and [ticket booking](/system-design/design-ticket-booking-system) browse paths — not in seat holds.',
    },
    { type: 'h2', text: 'Cache stampede' },
    {
      type: 'p',
      text: 'Hot key expires; 10K threads miss simultaneously and hammer DB. Fixes: (1) probabilistic early expiration — jitter TTL per key. (2) Mutex / "single flight" — one thread rebuilds, others wait. (3) Never expire ultra-hot keys; background refresh. (4) Pre-warm before known events (product launch). Mention at least one fix when discussing [flash sales](/system-design/design-ticket-booking-system).',
    },
    { type: 'h2', text: 'Hot keys and skew' },
    {
      type: 'p',
      text: 'One viral post’s like counter on a single Redis key saturates one CPU core. Mitigations: local in-process counter flushed periodically; split key into `likes:post:123:shard_{0..9}` and sum on read; read replicas for read-heavy hot keys. [Load balancer](/system-design/load-balancing-and-scaling) cannot fix hot keys inside one shard — you need application-level splitting.',
    },
    { type: 'h2', text: 'Capacity estimation' },
    {
      type: 'p',
      text: '1B keys × 100 bytes key + 500 bytes value ≈ 600 GB — needs cluster of ~10 nodes at 64 GB RAM each (with overhead). 100K ops/sec cluster: single-threaded Redis ~100K simple GETs/sec per core — scale shards horizontally. Network: 100K × 1 KB = 100 MB/sec — usually not the bottleneck.',
    },
    { type: 'h2', text: 'When not to use Redis' },
    {
      type: 'ul',
      items: [
        'Source of truth for money or seat inventory — use SQL with transactions.',
        'Large blobs (video) — use object storage + CDN.',
        'Complex queries (joins, range scans) — use [SQL](/system-design/sql-vs-nosql-for-interviews).',
        'Durability-first ledger — use WAL-backed database.',
      ],
    },
    { type: 'h2', text: 'Redis vs Memcached (quick compare)' },
    {
      type: 'table',
      headers: ['Feature', 'Redis', 'Memcached'],
      rows: [
        ['Data structures', 'Strings, hashes, lists, sorted sets', 'Strings only'],
        ['Persistence', 'Optional RDB/AOF', 'None (pure cache)'],
        ['Replication', 'Built-in', 'Client-side sharding only'],
        ['Typical use', 'Cache + session + rate limit + pub/sub', 'Simple object cache'],
      ],
    },
    { type: 'h2', text: 'Sample interview dialogue' },
    {
      type: 'p',
      text: 'Interviewer: "How does your cache scale?" You: "Keys shard via consistent hashing across Redis nodes with replicas for failover. App uses cache-aside with TTL and delete-on-write invalidation. I watch for hot keys and cache stampede on expiry — single-flight or jittered TTL. Redis is not durable source of truth; PostgreSQL is."',
    },
    { type: 'h2', text: 'Pub/sub and streams (bonus)' },
    {
      type: 'p',
      text: 'Redis pub/sub delivers fire-and-forget messages — no persistence, subscribers offline miss events. Redis Streams add append-only log with consumer groups — closer to [Kafka](/system-design/message-queues-async-processing) for lightweight event fan-out. Mention when interviewer asks "what else can Redis do?" — not required for cache-only deep dives.',
    },
    { type: 'h2', text: 'Persistence trade-off' },
    {
      type: 'p',
      text: 'RDB snapshots every N minutes — fast recovery, may lose last writes. AOF logs every write — durable but slower. Most cache use cases disable persistence entirely: rebuild from DB on cold start. Session store might use AOF — clarify durability requirements before recommending.',
    },
    { type: 'h2', text: 'What to say in the last five minutes' },
    {
      type: 'p',
      text: 'Close with: "Consistent hashing, primary-replica failover, LRU eviction with TTL, cache-aside with delete-on-write, single-flight against stampede." State clearly that money and seat inventory stay in SQL.',
    },
    { type: 'h2', text: 'Mock interview checklist' },
    {
      type: 'ol',
      items: [
        'Explained consistent hashing vs modulo sharding.',
        'Described primary-replica failover.',
        'Named eviction policy and TTL use cases.',
        'Gave stampede mitigation strategy.',
        'Stated when cache is wrong tool (strong consistency writes).',
      ],
    },
    { type: 'h2', text: 'Closing summary' },
    {
      type: 'p',
      text: 'Distributed cache is fast RAM with a hash ring and replication — the infrastructure behind every "add Redis" box in other designs. Master this fundamental and you will answer deep-dive questions on half your case studies without pausing.',
    },
  ],
}

export default article
