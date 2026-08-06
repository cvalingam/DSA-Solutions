import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-bloom-filter',
  title: 'Design a Bloom Filter Service',
  description:
    'How to design Bloom filters for interviews: false positives, bit array sizing, k hash functions, counting/scalable variants, Redis bitmaps, and classic use cases.',
  readMinutes: 11,
  published: '2026-08-06',
  category: 'fundamentals',
  seoKeywords: [
    'Bloom filter system design',
    'Bloom filter interview',
    'probabilistic data structure design',
    'Redis bloom filter',
  ],
  sections: [
    {
      type: 'p',
      text: 'A Bloom filter answers “have I maybe seen this key?” in tiny space. False positives happen; false negatives do not (for the classic non-deleting filter). Interviews love it because it shows up in [caches](/system-design/caching-fundamentals-for-interviews), [web crawlers](/system-design/design-web-crawler), [databases](/system-design/database-sharding-replication), and CDN origin shields.',
    },
    {
      type: 'p',
      text: 'Clarify with the [framework](/system-design/how-to-approach-system-design-interviews): expected n inserts, target false positive rate p, whether deletes matter, and single-node vs distributed service.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'add(key) set k bits.',
        'mightContain(key) → true/false (true may be wrong; false is certain absent).',
        'Optional: merge filters, create snapshot, expire / rotate generations.',
        'Optional: counting Bloom filter or Cuckoo filter if deletes are required.',
      ],
    },
    { type: 'h2', text: 'Non-functional requirements' },
    {
      type: 'ul',
      items: [
        'O(k) bit ops per add/lookup; k usually small (5-10).',
        'Memory linear in n for a fixed p - size carefully.',
        'Thread-safe add under concurrency or shard the bitset.',
      ],
    },
    {
      type: 'callout',
      title: 'Never treat true as proof',
      text: 'Bloom filters gate expensive checks (disk, remote API). On true, you still verify. On false, skip the expensive path. That sentence alone shows you understand the structure.',
    },
    { type: 'h2', text: 'Sizing math (say it once)' },
    {
      type: 'ul',
      items: [
        'Bits m ≈ -n ln(p) / (ln 2)^2.',
        'Hashes k ≈ (m/n) ln 2.',
        'Example: n=1e9, p=1% → on the order of a few GB - call it “gigabytes, not terabytes.”',
      ],
    },
    {
      type: 'p',
      text: 'You will not be graded on deriving the formula from scratch. Quoting m and k and naming the trade-off (more bits → fewer false positives, more RAM) is enough.',
    },
    { type: 'h2', text: 'Implementation sketch' },
    {
      type: 'ol',
      items: [
        'Allocate a bit array of m bits (or Redis SETBIT / BITFIELD).',
        'Derive k positions from 1-2 hash functions via double hashing to save CPU.',
        'add: set those bits. mightContain: return true only if all k bits are set.',
        'For multi-tenant service: one filter per (namespace, generation).',
      ],
    },
    {
      type: 'table',
      headers: ['Variant', 'When to use'],
      rows: [
        ['Classic Bloom', 'Insert-only membership; cheapest'],
        ['Counting Bloom', 'Need deletes; more memory'],
        ['Scalable Bloom', 'n unknown; chain filters as load grows'],
        ['Cuckoo filter', 'Deletes + better for some workloads'],
      ],
    },
    { type: 'h2', text: 'Distributed design' },
    {
      type: 'p',
      text: 'A Bloom service can wrap sharded bitsets behind an API, or embed filters in each app process rebuilt from a daily key dump. Cross-host: broadcast adds over [Kafka](/system-design/message-queues-async-processing) or rebuild from [object storage](/system-design/design-object-storage-s3) snapshots. Merges work when filters share m and hash seeds - OR the bit arrays together.',
    },
    { type: 'h2', text: 'Classic interview use cases' },
    {
      type: 'ul',
      items: [
        'Cache: miss filter avoids stampedes into a DB for never-seen keys.',
        'Crawler: URL seen filter before enqueueing.',
        'DB: SSTable / LSM bloom short-circuits disk reads (LSM design adjacent to [KV stores](/system-design/design-key-value-store)).',
        'Username signup: cheap “probably taken” before authoritative lookup.',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'API cache sits in front of user service; Bloom holds 200M active user ids.',
        'Request for id 42: filter says false → return 404 without hitting DB.',
        'Request for id 7: filter says true → query DB; found; return profile.',
        'False positive on id 99 → DB miss once; still correct externally.',
      ],
    },
    { type: 'h2', text: 'Interview summary' },
    {
      type: 'p',
      text: 'One-way errors, m/k sizing, bit array + k hashes, and a real use case (cache or crawler). Mention deletes need a different variant. That closes the Bloom filter round.',
    },
  ],
}

export default article
