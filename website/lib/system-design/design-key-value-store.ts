import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-key-value-store',
  title: 'Design a Distributed Key-Value Store',
  description:
    'How to design a Dynamo-style key-value store for interviews: partitioning, replication, consistency, gossip, hinted handoff, and CAP trade-offs.',
  readMinutes: 14,
  published: '2026-07-11',
  category: 'case-study',
  seoKeywords: [
    'key value store system design',
    'Dynamo DB system design interview',
    'distributed hash table design',
    'consistent hashing key value store',
  ],
  sections: [
    {
      type: 'p',
      text: '“Design a key-value store” is the interview behind Redis Cluster, DynamoDB, and Cassandra. You are building put/get with huge scale, not SQL joins. It sits under almost every other design — [URL shortener](/system-design/design-url-shortener) mappings, [session caches](/system-design/design-distributed-cache-redis), shopping carts. The difference from “design Redis cache” is durability and multi-node replication as first-class requirements.',
    },
    {
      type: 'p',
      text: 'Clarify with the [framework](/system-design/how-to-approach-system-design-interviews): value size limits, TTL support, strong vs eventual consistency, and whether range scans are needed (usually no — pure KV).',
    },
    { type: 'h2', text: 'API' },
    {
      type: 'table',
      headers: ['Operation', 'Semantics'],
      rows: [
        ['put(key, value)', 'Write or overwrite'],
        ['get(key)', 'Return value or not found'],
        ['delete(key)', 'Remove key'],
        ['Optional TTL', 'Expire after N seconds'],
      ],
    },
    { type: 'h2', text: 'Requirements' },
    {
      type: 'ul',
      items: [
        'Scale to billions of keys; horizontal add/remove of nodes.',
        'High availability — survive node and rack failures.',
        'Tunable consistency (Quorum R + W > N) or declare eventual.',
        'Low latency gets (single-digit ms in-region).',
      ],
    },
    { type: 'h2', text: 'Partitioning: consistent hashing' },
    {
      type: 'p',
      text: 'Hash the key onto a ring; each node owns a range. Virtual nodes (many tokens per physical machine) balance load when capacities differ. When a node joins, it takes keys from neighbors — same story as [distributed cache](/system-design/design-distributed-cache-redis) and [sharding](/system-design/database-sharding-replication). Mention virtual nodes unprompted — interviewers listen for it.',
    },
    {
      type: 'callout',
      title: 'Hot keys',
      text: 'A celebrity key still hashes to one partition. Mitigate with client-side cache, key salting (`key#0..N` fan-out), or request coalescing. Same celebrity problem as [news feed](/system-design/design-news-feed).',
    },
    { type: 'h2', text: 'Replication' },
    {
      type: 'p',
      text: 'Store N replicas (commonly 3) on the next N distinct nodes on the ring (or preference list). Writes go to the coordinator (first node in preference list or any node that forwards). Coordinator sends put to replicas; waits for W acknowledgments. Reads query R replicas and return the latest by version.',
    },
    {
      type: 'ul',
      items: [
        'N = 3, W = 2, R = 2 → quorum; strong-ish consistency for single key.',
        'W = 1, R = 1 → fastest, eventual; conflict resolution needed.',
        'R + W > N avoids reading stale unreplicated writes in the common case.',
      ],
    },
    { type: 'h2', text: 'Versioning and conflicts' },
    {
      type: 'p',
      text: 'Vector clocks or monotonic version numbers per key detect concurrent writes. On conflict, return both values to the client (Dynamo style) or last-write-wins with timestamp (simpler, riskier). For interviews, vector clocks show depth; LWW is acceptable if you name the data-loss risk. Tie to [CAP](/system-design/cap-theorem-consistency-models): AP store with conflict resolution vs CP store that rejects writes on minority.',
    },
    { type: 'h2', text: 'Failure handling' },
    {
      type: 'table',
      headers: ['Technique', 'Purpose'],
      rows: [
        ['Sloppy quorum / hinted handoff', 'Write to another node if replica down; hand hint back when it recovers'],
        ['Read repair', 'On get, fix stale replicas in background'],
        ['Anti-entropy / Merkle trees', 'Periodic sync between replicas'],
        ['Gossip membership', 'Nodes share ring membership and failure rumors'],
      ],
    },
    {
      type: 'p',
      text: 'You do not need to implement Merkle trees on the whiteboard — name anti-entropy and move on. Gossip for membership beats a single ZooKeeper if you are designing Dynamo-style AP; CP systems often use consensus (Raft) for membership — mention both camps.',
    },
    { type: 'h2', text: 'Storage engine on one node' },
    {
      type: 'p',
      text: 'Each node is a local store: LSM-tree (Cassandra, RocksDB) for write-heavy workloads, or B-tree / memory + disk. WAL for durability before ack. Memory cache of hot keys. Interview level: “log-structured merge tree on SSD + memtable” is enough.',
    },
    { type: 'h2', text: 'Client vs server routing' },
    {
      type: 'ul',
      items: [
        'Smart client: knows the ring, talks to the right node (lower hop).',
        'Dumb client: any node coordinates and proxies (simpler clients).',
        'Proxy tier: [API gateway](/system-design/design-api-gateway)-like KV proxy for auth and rate limits.',
      ],
    },
    { type: 'h2', text: 'Comparison table' },
    {
      type: 'table',
      headers: ['System', 'Consistency bias', 'Notable idea'],
      rows: [
        ['Dynamo / Cassandra', 'AP, tunable quorum', 'Preference list, hinted handoff'],
        ['etcd / ZooKeeper', 'CP', 'Raft/ZAB consensus'],
        ['Redis Cluster', 'AP-ish cache', 'Hash slots, async replica'],
        ['Bigtable / HBase', 'CP per row', 'Tablet servers + Chubby/ZK'],
      ],
    },
    { type: 'h2', text: 'Capacity math' },
    {
      type: 'p',
      text: '1 billion keys × 1 KB value ≈ 1 TB raw; with N=3 ≈ 3 TB plus LSM overhead. 100K QPS reads with R=1 is easy; R=2 doubles read fan-out. Always state N, R, W when estimating cluster size.',
    },
    { type: 'h2', text: 'Worked put/get' },
    {
      type: 'ol',
      items: [
        'put("user:42", "{…}") → hash → preference list nodes A,B,C.',
        'Coordinator A writes WAL + memtable, forwards to B and C, waits W=2.',
        'Ack client after 2 acks; C may still be catching up.',
        'get → query A and B (R=2); compare versions; return newest; async repair C if stale.',
      ],
    },
    { type: 'h2', text: 'TTL and deletion' },
    {
      type: 'p',
      text: 'Lazy expiry on get (check timestamp) plus a background sweeper scanning tombstones keeps disk bounded — same dual approach as [Pastebin](/system-design/design-pastebin) expiration. Deletes write a tombstone so replicas do not resurrect keys via anti-entropy. Compact tombstones after a grace period.',
    },
    {
      type: 'p',
      text: 'Secondary indexes are out of scope for pure KV. If the interviewer asks “query by value,” say that breaks the model — use Elasticsearch beside the store, or accept full scan. Stay disciplined about the API.',
    },
    { type: 'h2', text: 'Put path deep dive' },
    {
      type: 'p',
      text: 'Coordinator receives put, appends to local WAL, updates memtable, then parallel RPCs to replicas. If only W−1 replicas ack before timeout, you can still ack the client under sloppy quorum and repair later — or fail the write for stricter modes. Spell out which mode you choose. Checksums on values catch bit rot during anti-entropy. Compression (LZ4) on cold SSTables saves disk at CPU cost.',
    },
    { type: 'h2', text: 'Security and multi-tenancy' },
    {
      type: 'ul',
      items: [
        'Namespace keys as `tenant:key` or separate rings per tenant for noisy isolation.',
        'Auth at the proxy; encrypt values at rest with per-tenant keys if required.',
        'Rate-limit puts per API key so one writer cannot fill the cluster ([rate limiter](/system-design/design-rate-limiter)).',
      ],
    },
    { type: 'h2', text: 'What to say in 45 minutes' },
    {
      type: 'p',
      text: 'Ring + virtual nodes, N replicas, quorum R/W, version vectors, hinted handoff, anti-entropy. Contrast with single-node [Redis cache](/system-design/design-distributed-cache-redis): cache can flush; KV store promises durability. That contrast is the interview.',
    },
  ],
}

export default article
