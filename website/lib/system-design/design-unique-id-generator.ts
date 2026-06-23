import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-unique-id-generator',
  title: 'Design a Unique ID Generator (Snowflake, UUID, Auto-Increment)',
  description:
    'How to generate globally unique IDs in distributed systems: Snowflake, UUID, database sequences, and trade-offs for system design interviews.',
  readMinutes: 11,
  published: '2026-06-18',
  category: 'fundamentals',
  seoKeywords: ['Snowflake ID', 'distributed unique ID', 'UUID vs Snowflake'],
  sections: [
    {
      type: 'p',
      text: '"How do you generate IDs in a distributed system?" appears in almost every medium-to-hard interview — [URL shorteners](/system-design/design-url-shortener), [chat messages](/system-design/design-chat-messaging), and [notification](/system-design/design-notification-system) logs all need them. The answer is not "use UUID" without trade-offs. This guide compares approaches so you can pick one and defend it.',
    },
    { type: 'h2', text: 'Functional vs non-functional requirements' },
    { type: 'h3', text: 'Functional' },
    {
      type: 'ul',
      items: [
        'Generate a new ID on demand from any service instance.',
        'IDs must be unique across all regions and services.',
        'Support batch allocation for bulk inserts (imports, backfills).',
      ],
    },
    { type: 'h3', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'Millions of IDs per second cluster-wide without a central DB round-trip per ID.',
        'Rough time order for debugging and index locality.',
        'Survive single machine or AZ failure without stopping ID issuance.',
        'Low collision probability — effectively zero in production.',
      ],
    },
    { type: 'h2', text: 'What properties matter' },
    {
      type: 'ul',
      items: [
        'Uniqueness — no collisions across all services and regions.',
        'Roughly sortable by time — helps DB indexing and debugging.',
        'High throughput — millions of IDs per second cluster-wide.',
        'No single point of failure — no one DB sequence bottleneck.',
        'Opaque or short — URL-friendly vs 128-bit UUID string.',
      ],
    },
    { type: 'h2', text: 'Approach comparison' },
    {
      type: 'table',
      headers: ['Approach', 'Pros', 'Cons'],
      rows: [
        ['Auto-increment (single DB)', 'Simple, sortable', 'Single point of failure; sharding breaks global order'],
        ['UUID v4 (random)', 'No coordination', 'Not sortable; 36-char string; index fragmentation'],
        ['UUID v7 (time-ordered)', 'Sortable, decentralized', 'Still long; newer standard'],
        ['Snowflake (Twitter)', '64-bit, sortable, fast', 'Needs machine ID assignment; clock skew care'],
        ['DB range per server', 'Numeric, sortable', 'Range allocation service; gaps on crash'],
      ],
    },
    { type: 'h2', text: 'Snowflake layout (say this in interviews)' },
    {
      type: 'p',
      text: '64-bit integer: timestamp (ms since epoch) | datacenter_id | machine_id | sequence. Same millisecond: increment sequence. New millisecond: reset sequence. Sortable by time. ~4096 IDs per ms per machine with 12 sequence bits — billions per day per node.',
    },
    {
      type: 'callout',
      title: 'Clock skew',
      text: 'If system clock moves backward, wait until caught up or use last timestamp + sequence. NTP drift is a real ops issue — mention it briefly.',
    },
    { type: 'h2', text: 'Assigning machine IDs' },
    {
      type: 'ul',
      items: [
        'ZooKeeper / etcd: ephemeral nodes assign worker_id on startup.',
        'Kubernetes: hash pod name into fixed range (with collision risk at small scale).',
        'Config per deploy — works for < 1000 machines, painful at cloud scale.',
      ],
    },
    { type: 'h2', text: 'When to use what' },
    { type: 'h3', text: 'URL shortener short codes' },
    {
      type: 'p',
      text: 'Need short, non-guessable strings — base62 of auto-increment or random counter, not Snowflake integer. See [URL shortener](/system-design/design-url-shortener) ID generation section.',
    },
    { type: 'h3', text: 'Chat message IDs' },
    {
      type: 'p',
      text: 'Snowflake or per-conversation sequence — monotonic within conversation for ordering. Global sort helps debugging across shards.',
    },
    { type: 'h3', text: 'Internal order IDs' },
    {
      type: 'p',
      text: 'Snowflake or DB sequence with read replicas for display — [SQL vs NoSQL](/system-design/sql-vs-nosql-for-interviews) choice for storage separate from ID format.',
    },
    { type: 'h2', text: 'Implementation sketch' },
    {
      type: 'ol',
      items: [
        'On service start: acquire worker_id from coordination service.',
        'nextId(): lock or synchronized block per JVM/process.',
        'If now == last_timestamp: sequence++; if sequence overflow, wait next ms.',
        'Else: sequence = 0, last_timestamp = now.',
        'Return (timestamp << shift) | (dc << shift) | (worker << shift) | sequence.',
      ],
    },
    { type: 'h2', text: 'UUID v4 vs v7 detail' },
    {
      type: 'p',
      text: 'UUID v4 is 122 random bits — no sort order, painful for B-tree indexes (random inserts). UUID v7 embeds timestamp in high bits — better locality, still 128 bits string form. Snowflake fits in 64-bit BIGINT — compact URLs and fast comparisons. Mention collision probability: UUID v4 negligible; Snowflake needs unique (datacenter, machine) pairs.',
    },
    { type: 'h2', text: 'Database range allocation' },
    {
      type: 'p',
      text: 'Alternative to Snowflake: ID service allocates ranges — server A gets 1–1,000,000, server B gets 1,000,001–2,000,000. Simple numeric IDs, sortable, no clock dependency. On crash, gap in sequence is acceptable for many apps. Coordination service hands out ranges via atomic compare-and-swap.',
    },
    { type: 'h2', text: 'Security and guessability' },
    {
      type: 'p',
      text: 'Sequential IDs leak business metrics (order count). Use random short codes for public resources ([URL shortener](/system-design/design-url-shortener)). Internal Snowflake IDs are fine behind auth. Never expose raw auto-increment in public APIs.',
    },
    { type: 'h2', text: 'Multi-region IDs' },
    {
      type: 'p',
      text: 'Snowflake datacenter_id bits partition ID space per region — IDs remain globally unique without cross-region coordination on every insert. UUID v4 needs no regional planning. Centralized DB sequence needs a single primary writer per global sequence — bottleneck at scale.',
    },
    { type: 'h2', text: 'Worked numeric example' },
    {
      type: 'p',
      text: '41-bit timestamp ms + 5-bit dc + 5-bit machine + 12-bit sequence → 4096 IDs/ms/machine. One machine ≈ 4M IDs/sec theoretical; real limit is generation code and downstream write throughput. Enough for [chat](/system-design/design-chat-messaging) and order tables.',
    },
    { type: 'h2', text: 'Interview comparison table' },
    {
      type: 'table',
      headers: ['Requirement', 'Best fit'],
      rows: [
        ['Public short token', 'Base62 + random or counter'],
        ['Time-ordered events at scale', 'Snowflake'],
        ['No infra coordination', 'UUID v4'],
        ['Sortable + decentralized', 'UUID v7 or Snowflake'],
        ['Per-shard numeric only', 'DB sequence per shard'],
      ],
    },
    { type: 'h2', text: 'Common follow-up questions' },
    {
      type: 'ul',
      items: [
        '"What if two machines get the same worker ID?" — Partition ID assignment must be exclusive; ZooKeeper ephemeral znodes prevent duplicates.',
        '"Can IDs run out?" — 41-bit millisecond timestamp covers ~69 years from epoch; sequence overflow per ms waits 1ms.',
        '"Why not UUID for messages?" — Fine at moderate scale; Snowflake gives compact numeric sort for indexes.',
        '"How do shards use IDs?" — Each shard generates locally; no central coordinator per insert.',
      ],
    },
    { type: 'h2', text: 'Dedicated ID service API' },
    {
      type: 'p',
      text: 'At scale, embed Snowflake logic in a small ID service rather than every microservice. GET /v1/ids/batch?count=100 returns 100 IDs — reduces coordination overhead. Service holds worker_id lease; app servers call over gRPC with low latency. Alternative: library jar linked into each service with shared ZooKeeper lease — fewer network hops, more deploy coupling.',
    },
    { type: 'h2', text: 'Contention and hot spots' },
    {
      type: 'p',
      text: 'A single global auto-increment column in one Postgres primary becomes a write hot spot — every insert contends on the same B-tree page. Sharded sequences (each shard owns a range) fix throughput but lose global sort order. Snowflake avoids both: each JVM generates locally with no network hop. If you centralize in an ID service, batch requests (100 IDs per RPC) amortize latency and keep QPS on the service manageable.',
    },
    { type: 'h2', text: 'K-sortable and ULID (mention briefly)' },
    {
      type: 'p',
      text: 'ULID and KSUID encode time in the first bytes of a 128-bit string — lexicographically sortable in text form, no coordination beyond randomness in the tail. Good when you want string IDs in logs and URLs without a 64-bit integer. Snowflake is the numeric interview default; ULID is a credible "I know newer alternatives" follow-up.',
    },
    { type: 'h2', text: 'Database indexing impact' },
    {
      type: 'p',
      text: 'Random UUID primary keys cause B-tree page splits and fragmented indexes in PostgreSQL. Time-ordered Snowflake or UUID v7 insert at the right edge of the index — better write throughput on large tables. Say this when interviewer asks "why not UUID?" — it is an indexing argument, not just aesthetics.',
    },
    {
      type: 'table',
      headers: ['Failure', 'Effect', 'Mitigation'],
      rows: [
        ['Duplicate worker_id', 'ID collision risk', 'Exclusive lease via ZooKeeper/etcd'],
        ['Clock backward jump', 'Duplicate timestamp bucket', 'Wait or use last_ts until caught up'],
        ['Sequence overflow in 1ms', 'Cannot issue more IDs this ms', 'Spin until next millisecond'],
        ['ID service down', 'Writers block', 'Embedded generator fallback with local range cache'],
      ],
    },
    { type: 'h2', text: 'Worked example: order and notification' },
    {
      type: 'p',
      text: 'Order service creates order with Snowflake order_id, publishes order_created event with same id. [Notification](/system-design/design-notification-system) worker and warehouse consumer both reference order_id. Support can grep logs by time-sortable ID. Contrast with random UUID — harder to debug "what happened around 3pm" without a secondary created_at index.',
    },
    { type: 'h2', text: 'Sample opening (first three minutes)' },
    {
      type: 'p',
      text: 'Interviewer: "Design unique IDs for a distributed order service." You: "I need IDs that are unique cluster-wide, roughly time-ordered for indexing, and generated without a single DB bottleneck. I would use 64-bit Snowflake-style IDs: timestamp, datacenter, machine, sequence. Worker IDs from ZooKeeper. For public-facing short codes I would use a different encoding — not raw integers."',
    },
    { type: 'h2', text: 'What to say in the last five minutes' },
    {
      type: 'p',
      text: '"I would use Snowflake-style 64-bit IDs: time-sortable, no central DB bottleneck, thousands per ms per node. Assign worker IDs via ZooKeeper. For public short URLs I would use a separate base62 encoding layer." That shows you know more than one hammer.',
    },
    { type: 'h2', text: 'Mock interview checklist' },
    {
      type: 'ol',
      items: [
        'Stated requirements: uniqueness, sortability, throughput.',
        'Compared UUID vs Snowflake vs DB auto-increment.',
        'Explained Snowflake bit layout.',
        'Mentioned clock skew and worker ID assignment.',
        'Matched ID choice to use case (URL vs message vs order).',
      ],
    },
    { type: 'h2', text: 'Closing summary' },
    {
      type: 'p',
      text: 'Pick the ID scheme for the access pattern: short opaque codes for URLs, Snowflake for high-volume ordered events, UUID when coordination is unacceptable and sort order does not matter.',
    },
  ],
}

export default article
