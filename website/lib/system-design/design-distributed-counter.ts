import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-distributed-counter',
  title: 'Design a Distributed Counter',
  description:
    'How to design distributed counters for interviews: Redis INCR, sharded counters, CRDTs, approximate counts, write buffering, and read-your-writes trade-offs.',
  readMinutes: 12,
  published: '2026-08-06',
  category: 'case-study',
  seoKeywords: [
    'distributed counter system design',
    'Redis counter interview',
    'sharded counter design',
    'CRDT counter system design',
  ],
  sections: [
    {
      type: 'p',
      text: 'Like counts, view counts, inventory soft caps, and [rate limiter](/system-design/design-rate-limiter) buckets all need counters under contention. A single DB row becomes a hotspot instantly. The interview is about spreading writes and stating how stale or approximate a read may be.',
    },
    {
      type: 'p',
      text: 'Scope with the [framework](/system-design/how-to-approach-system-design-interviews): incr/decr by delta, get current value, optional reset, accuracy vs QPS. Tie to [Redis](/system-design/design-distributed-cache-redis) and [CAP](/system-design/cap-theorem-consistency-models).',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Increment(key, delta) and Decrement(key, delta).',
        'Get(key) → current count (exact or approximate - say which).',
        'Optional: GetAtLeast / GetApprox for cheaper paths.',
        'TTL or daily buckets for time-windowed counts.',
      ],
    },
    { type: 'h2', text: 'Non-functional requirements' },
    {
      type: 'ul',
      items: [
        'Very high write QPS on hot keys (viral posts).',
        'Low latency reads for rendering counts on pages.',
        'Durability: losing a few increments on crash may be OK for likes - not for money.',
        'Horizontal scale without a single-row bottleneck.',
      ],
    },
    {
      type: 'callout',
      title: 'Exact and hot do not mix cheaply',
      text: 'If every increment must be globally serialised and durable, throughput dies. Most social counts accept eventual consistency or ±1% error. Billing and stock need different tools (ledger / inventory service).',
    },
    { type: 'h2', text: 'Approach ladder' },
    {
      type: 'table',
      headers: ['Approach', 'Pros', 'Cons'],
      rows: [
        ['Single Redis INCR', 'Simple, atomic, fast', 'One key hotspot; memory lost on crash unless AOF'],
        ['DB row + retries', 'Durable', 'Locks / hot page'],
        ['Sharded counters', 'Spreads writes', 'Reads must sum shards'],
        ['Write buffer + flush', 'Smooths spikes', 'Delayed visibility'],
        ['CRDT G-Counter / PN-Counter', 'Multi-region merge', 'More complex; grow with replicas'],
      ],
    },
    { type: 'h2', text: 'Sharded counter design' },
    {
      type: 'ol',
      items: [
        'Pick N shards: key#0 .. key#(N-1).',
        'Increment: choose shard by hash(request_id) or random → INCR that shard.',
        'Get: MGET all shards and sum (or cache the sum for a second).',
        'Grow N when write QPS climbs; mention re-sharding pain.',
      ],
    },
    {
      type: 'p',
      text: 'N ≈ 10-100 is a common interview starting point. Reads become O(N). Mitigate with a periodically refreshed total in another key, knowing it lags. For [leaderboards](/system-design/design-leaderboard) you often want sorted sets instead of raw counters.',
    },
    { type: 'h2', text: 'Async aggregation' },
    {
      type: 'p',
      text: 'Apps enqueue +1 events to [Kafka](/system-design/message-queues-async-processing); consumers batch-update shards or a warehouse. UI reads a slightly stale cache. This matches [ad click](/system-design/design-ad-click-aggregator) style pipelines when volume explodes.',
    },
    { type: 'h2', text: 'Multi-region' },
    {
      type: 'p',
      text: 'Active-active: each region owns local shards; a CRDT merge (max per replica id for G-Counters) yields a global value. Or designate a primary region for exact counts and accept cross-region latency. Be explicit which model you pick.',
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'Viral video like counter; target 200k writes/s.',
        'Use 64 Redis shards video123#i; clients INCR a random shard.',
        'Read path sums shards every request for admin; public page reads a 1s cached total.',
        'Nightly job persists totals to durable DB for analytics.',
      ],
    },
    { type: 'h2', text: 'Interview summary' },
    {
      type: 'p',
      text: 'Start with INCR, then shard for hot keys, then async or CRDT for multi-region. State accuracy SLOs. That progression is the distributed counter interview.',
    },
  ],
}

export default article
