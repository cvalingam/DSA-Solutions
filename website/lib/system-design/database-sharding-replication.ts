import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'database-sharding-replication',
  title: 'Database Sharding and Replication for Interviews',
  description:
    'How to shard relational and NoSQL databases: shard keys, consistent hashing, read replicas, failover, and rebalancing in system design interviews.',
  readMinutes: 12,
  published: '2026-06-22',
  category: 'fundamentals',
  seoKeywords: ['database sharding interview', 'read replica architecture', 'consistent hashing shards'],
  sections: [
    {
      type: 'p',
      text: 'Single Postgres instance stops scaling around tens of thousands of writes per second. Sharding splits data across machines; replication copies it for read scale and failover. You will need both on almost every large [case study](/system-design/design-news-feed) — this article explains how to draw them without hand-waving.',
    },
    { type: 'h2', text: 'Replication basics' },
    {
      type: 'ul',
      items: [
        'Primary-replica (leader-follower): writes to primary; replicas async or sync replicate.',
        'Read replicas: scale SELECT traffic; replication lag means stale reads.',
        'Failover: promote replica to primary on leader death — risk of lost async writes.',
        'Multi-primary: writes to any node — conflict resolution required (harder).',
      ],
    },
    {
      type: 'callout',
      title: 'Interview default',
      text: 'Say single primary + N read replicas for v1. Mention sync replica for zero data loss on failover if the prompt is financial.',
    },
    { type: 'h2', text: 'When to shard' },
    {
      type: 'p',
      text: 'Shard when vertical scale (bigger machine) fails or is too expensive. Signals: disk full, write IOPS maxed, backup restore too slow. [SQL vs NoSQL](/system-design/sql-vs-nosql-for-interviews): shard relational by tenant or user_id; Cassandra shards by partition key natively.',
    },
    { type: 'h2', text: 'Choosing a shard key' },
    {
      type: 'table',
      headers: ['Shard key', 'Pros', 'Cons'],
      rows: [
        ['user_id', 'User data colocated; no cross-shard user queries in v1', 'Hot users create hot shards'],
        ['tenant_id', 'B2B isolation; easy per-customer export', 'Whale tenant overloads one shard'],
        ['hash(user_id)', 'Even spread', 'Range queries across users hard'],
        ['geo region', 'Data residency compliance', 'Uneven population density'],
      ],
    },
    {
      type: 'p',
      text: 'Good shard key: high cardinality, even distribution, queries mostly include it. Bad: country alone (India shard huge), boolean flags.',
    },
    { type: 'h2', text: 'Routing layer' },
    {
      type: 'p',
      text: 'Application or proxy (Vitess, Citus, custom) maps shard_key → physical shard. `shard = hash(user_id) % num_shards`. Store mapping in config service; bump num_shards only with rebalancing plan. [Consistent hashing](/system-design/design-url-shortener) with virtual nodes reduces data movement when adding shards.',
    },
    { type: 'h2', text: 'Cross-shard operations' },
    {
      type: 'ul',
      items: [
        'Avoid in v1 — design around single-shard queries.',
        'Global secondary index: index table on each shard or separate index service (expensive).',
        'Scatter-gather: query all shards, merge — high latency; use for admin only.',
        'Two-phase commit across shards — slow; avoid unless critical.',
      ],
    },
    { type: 'h2', text: 'Worked example: sharded user posts' },
    {
      type: 'ol',
      items: [
        'Shard by user_id hash into 64 Postgres clusters.',
        'Post insert includes user_id — routes to one shard.',
        'Feed read for user A: fan-out table on A\'s shard only if followers stored per user.',
        'Celebrity with hot shard: split read replicas; cache; or dedicated shard override.',
      ],
    },
    { type: 'h2', text: 'Rebalancing' },
    {
      type: 'p',
      text: 'Adding shards: consistent hashing moves only K/N keys. Dual-write old+new during migration; backfill; cut read traffic; drop old. Plan maintenance window or online migration tools. Never reshuffle without copy — downtime unacceptable at scale.',
    },
    { type: 'h2', text: 'Read replica lag' },
    {
      type: 'p',
      text: 'Replica lag 100ms–seconds. After user writes profile, read-your-writes: route to primary or sticky session. Analytics on replicas OK with stale data. Monitor replication lag alert — lag spike means replica unfit for failover.',
    },
    { type: 'h2', text: 'Capacity back-of-envelope' },
    {
      type: 'p',
      text: '1 TB data, 64 shards ≈ 16 GB each — fits SSD comfortably. 10K writes/sec total ÷ 64 ≈ 156 writes/sec per shard — easy for Postgres. Hot shard problem: 1% users causing 50% traffic — detect via per-shard metrics; split hot key or add [cache](/system-design/caching-fundamentals-for-interviews).',
    },
    { type: 'h2', text: 'Failure modes' },
    {
      type: 'table',
      headers: ['Failure', 'Mitigation'],
      rows: [
        ['Primary down', 'Auto failover to sync replica; brief write outage'],
        ['Replica lag extreme', 'Stop routing reads to that replica'],
        ['Shard unreachable', 'Partial outage — only users on that shard affected'],
        ['Wrong shard key choice', 'Painful migration — clarify key early in design'],
      ],
    },
    { type: 'h2', text: 'Hot shard detection and mitigation' },
    {
      type: 'ul',
      items: [
        'Per-shard QPS metrics — alert on 3× median.',
        'Split hot shard into sub-shards (re-hash with salt prefix).',
        'Aggressive [cache](/system-design/caching-fundamentals-for-interviews) for celebrity user rows.',
        'Read replicas on hot shard only.',
      ],
    },
    { type: 'h2', text: 'Tools interviewers recognize' },
    {
      type: 'p',
      text: 'Vitess (YouTube) shards MySQL with routing layer. Citus distributes Postgres. DynamoDB/Cassandra shard by partition key natively. CockroachDB offers geo-distributed SQL with tunable survival goals. Name one if relevant — then explain shard key, not logo dropping.',
    },
    { type: 'h2', text: 'What to say in the last five minutes' },
    {
      type: 'p',
      text: 'Replication first for read scale; shard when writes or disk break single node. Shard key = user_id hash. No cross-shard joins in v1. Consistent hashing for growth. Read replicas with lag awareness.',
    },
    { type: 'h2', text: 'Sample opening (first three minutes)' },
    {
      type: 'p',
      text: 'Interviewer: "Your database is the bottleneck." You: "I would start with read replicas for read-heavy traffic and monitor write headroom. If writes exceed single-node capacity, shard by user_id hash with a routing layer. I avoid cross-shard joins in v1 and plan consistent hashing so we can add shards without full reshuffle."',
    },
    { type: 'h2', text: 'Replication lag math' },
    {
      type: 'p',
      text: 'Primary writes 5K/sec; async replica 100ms lag → replica may be 500 rows behind on read. For social timeline served from replica, user might miss own post for 100ms — fix with read-your-writes routing. For [notification](/system-design/design-notification-system) inbox, same pattern.',
    },
    { type: 'h2', text: 'Shard count planning' },
    {
      type: 'table',
      headers: ['Factor', 'Guidance'],
      rows: [
        ['Start small', '8–16 shards; double when per-shard CPU > 60% sustained'],
        ['Too many shards', 'Ops overhead; empty shards waste connections'],
        ['Too few', 'Hot spots; migration pain later'],
        ['Growth', 'Plan 2× headroom; consistent hashing eases add'],
      ],
    },
    { type: 'h2', text: 'Backup and restore at shard scale' },
    {
      type: 'p',
      text: 'Per-shard backups parallelize restore time. Global logical backup needs coordinated point-in-time — harder. [SQL vs NoSQL](/system-design/sql-vs-nosql-for-interviews): Cassandra snapshots per node; Postgres pg_dump per shard. Test restore quarterly — interview mention shows ops maturity.',
    },
    { type: 'h2', text: 'Global tables and reference data' },
    {
      type: 'p',
      text: 'Small reference tables (country codes, fare rules) replicate to every shard or live in separate global DB with cache. Avoid joining user shard to global on every query — cache reference data in app memory with TTL.',
    },
    { type: 'h2', text: 'Worked example: [file storage](/system-design/design-file-storage-dropbox) metadata' },
    {
      type: 'p',
      text: 'File metadata (name, ACL) lives on shard by user_id — list folder is single-shard query. Blob bytes in S3 are not sharded with metadata — global object store. Cross-user share: sharee_id looks up file_id in global share index (small table) then routes to owner shard for ACL check. Say this when combining sharding with case studies.',
    },
    { type: 'h2', text: 'Connection pooling per shard' },
    {
      type: 'p',
      text: '64 shards × 100 app connections each = 6400 DB connections — use PgBouncer per shard or proxy layer. Connection storms on deploy — ramp slowly. Interviewers at FAANG care about this ops detail after you nail shard key.',
    },
    { type: 'h2', text: 'Follower reads and staleness SLAs' },
    {
      type: 'p',
      text: 'Define explicit SLAs: "replica reads may lag 500ms" on product pages; "payment reads always from primary." Document in API contracts. Auto-failover promotes replica — verify sync replication or accept small loss window and say so aloud.',
    },
    { type: 'h2', text: 'Mock interview checklist' },
    {
      type: 'ol',
      items: [
        'Explained primary-replica vs sharding purpose.',
        'Named shard key and justified even distribution.',
        'Mentioned read replica lag and read-your-writes.',
        'Avoided cross-shard transactions in v1.',
        'Described adding shards / rebalancing at high level.',
      ],
    },
    { type: 'h2', text: 'Closing summary' },
    {
      type: 'p',
      text: 'Replication scales reads and adds failover; sharding scales writes and storage. Pick the shard key carefully — it is the hardest thing to change later.',
    },
  ],
}

export default article
