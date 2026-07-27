import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'cap-theorem-consistency-models',
  title: 'CAP Theorem and Consistency Models for Interviews',
  description:
    'CP vs AP trade-offs, strong vs eventual consistency, linearizability, and when to pick each in system design interviews.',
  readMinutes: 11,
  published: '2026-06-22',
  category: 'fundamentals',
  seoKeywords: ['CAP theorem interview', 'eventual consistency', 'strong consistency system design'],
  sections: [
    {
      type: 'p',
      text: 'Every distributed system faces partitions, replication lag, and consistency choices. Interviewers ask "SQL or NoSQL?" and really want to know if you understand what you give up. This article complements [SQL vs NoSQL](/system-design/sql-vs-nosql-for-interviews) with the theory behind those picks - say it in plain language, not textbook proofs.',
    },
    { type: 'h2', text: 'CAP in one paragraph' },
    {
      type: 'p',
      text: 'CAP: in a network partition (P), you cannot have both perfect Consistency (C) and Availability (A) for every request. You choose CP (refuse writes or reads until quorum agrees) or AP (serve stale data but stay up). In practice partitions are rare but inevitable - design for them anyway. PACELC extends this: else (E), choose Latency (L) vs Consistency (C).',
    },
    {
      type: 'callout',
      title: 'Interview sentence',
      text: '"Under partition, our cart service stays available with eventual consistency; payment ledger is CP - we fail closed rather than double-charge."',
    },
    { type: 'h2', text: 'Consistency levels (name them)' },
    {
      type: 'table',
      headers: ['Model', 'Meaning', 'Example use'],
      rows: [
        ['Strong / linearizable', 'Read sees latest write globally', 'Bank balance, inventory deduct'],
        ['Sequential', 'All nodes agree on operation order', 'Distributed logs (Kafka partition)'],
        ['Causal', 'Related ops seen in cause order', 'Social comments thread'],
        ['Eventual', 'Replicas converge if no new writes', 'Like counts, view counters'],
        ['Read-your-writes', 'User sees own updates', 'Profile edit then reload'],
      ],
    },
    { type: 'h2', text: 'CP systems' },
    {
      type: 'p',
      text: 'Traditional RDBMS with synchronous replication: write waits for replica ack - higher latency, consistent reads from primary. etcd/ZooKeeper: quorum writes for leader election and locks. During partition, minority side stops accepting writes (unavailable) to avoid split-brain. Use when correctness beats uptime: payments, seat booking, [unique ID](/system-design/design-unique-id-generator) allocation.',
    },
    { type: 'h2', text: 'AP systems' },
    {
      type: 'p',
      text: 'Cassandra, Dynamo-style stores: write to W nodes, read from R nodes; tune quorum (R + W > N) for desired consistency. Under partition, both sides may accept writes - resolve later (last-write-wins, vector clocks, or application merge). Great for high write throughput: metrics, activity feeds, [caching](/system-design/caching-fundamentals-for-interviews) layers.',
    },
    { type: 'h2', text: 'Real interview mappings' },
    { type: 'h3', text: 'URL shortener redirect' },
    {
      type: 'p',
      text: 'AP is fine - stale redirect for seconds after create is acceptable; [cache](/system-design/caching-fundamentals-for-interviews) TTL hides replication lag.',
    },
    { type: 'h3', text: 'Chat message order' },
    {
      type: 'p',
      text: 'Per-conversation sequential consistency via [Kafka partition key](/system-design/message-queues-async-processing); global order not required.',
    },
    { type: 'h3', text: 'Ticket inventory' },
    {
      type: 'p',
      text: 'CP - optimistic locking or DB row lock; never sell the same seat twice. Sacrifice availability during DB failover rather than oversell.',
    },
    { type: 'h2', text: 'Quorum reads and writes' },
    {
      type: 'p',
      text: 'N replicas, write to W, read from R. If R + W > N, reads see overlapping writes (tunable strong-ish reads). W=1, R=1 is fast and loose. W=N, R=1 gives strong writes. Mention this when interviewer asks "how does Cassandra consistency work?"',
    },
    { type: 'h2', text: 'Common mistakes' },
    {
      type: 'table',
      headers: ['Mistake', 'Better answer'],
      rows: [
        ['"We need strong consistency everywhere"', 'Pick per component; feeds can be eventual'],
        ['"NoSQL is always AP"', 'MongoDB/Cockroach offer tunable consistency'],
        ['Ignoring read-your-writes', 'Route user reads to primary or sticky session after write'],
        ['No conflict resolution story', 'LWW, version vectors, or business merge rules'],
      ],
    },
    { type: 'h2', text: 'Latency vs consistency (PACELC)' },
    {
      type: 'p',
      text: 'Even without partition, stronger consistency costs latency (cross-region quorum). Multi-region [news feed](/system-design/design-news-feed) often uses eventual replication; fraud check uses strong read on payment DB in one region.',
    },
    { type: 'h2', text: 'Worked example: checkout vs feed' },
    {
      type: 'table',
      headers: ['Component', 'Consistency', 'Why'],
      rows: [
        ['Inventory count', 'Strong / linearizable', 'Prevent overselling last item'],
        ['Shopping cart', 'Session sticky + RYW', 'User sees own adds immediately'],
        ['Product reviews list', 'Eventual', 'New review visible within seconds OK'],
        ['Search index', 'Eventual', 'Async indexer from [queue](/system-design/message-queues-async-processing)'],
      ],
    },
    { type: 'h2', text: 'Read repair and anti-entropy' },
    {
      type: 'p',
      text: 'AP replicas may diverge briefly. Read repair: on read, client reads R replicas and returns latest version, writing back to stale nodes. Anti-entropy: background Merkle-tree compare between replicas. Mention as v2 ops detail - shows you know AP systems converge.',
    },
    { type: 'h2', text: 'What to say in the last five minutes' },
    {
      type: 'p',
      text: 'Map each box in your design to C, A, or a tunable middle. "Postgres primary for orders, Redis cache eventual for catalog, Kafka for analytics." One sentence per component beats abstract CAP lecture.',
    },
    { type: 'h2', text: 'Sample opening (first three minutes)' },
    {
      type: 'p',
      text: 'Interviewer: "How do you handle consistency?" You: "I split by use case. Money and inventory need linearizable writes - CP, single leader or quorum. Social counters and analytics can be eventual - AP with async replication. I always state what the user can tolerate: stale likes for 5 seconds vs never stale balance."',
    },
    { type: 'h2', text: 'Partition behavior walkthrough' },
    {
      type: 'p',
      text: 'Network split isolates US-East and US-West. CP ledger: one side stops accepting writes - payments pause briefly. AP catalog cache: both sides serve reads; prices may disagree until heal. Interview gold: name which side of the split loses availability for CP and what user-visible symptom follows ("payment unavailable" vs "stale product image").',
    },
    { type: 'h2', text: 'Session guarantees users feel' },
    {
      type: 'ul',
      items: [
        'Read-your-writes: route to primary after user mutation.',
        'Monotonic reads: never go backward in time on refresh.',
        'Consistent prefix: see A before B if A caused B (comment threads).',
      ],
    },
    { type: 'h2', text: 'Tie-in to other articles' },
    {
      type: 'p',
      text: '[News feed](/system-design/design-news-feed) timelines are eventual. [Rate limiter](/system-design/design-rate-limiter) counters are often AP with TTL. [File storage](/system-design/design-file-storage-dropbox) metadata wants strong consistency for ACL; CDN blob cache is eventual. Build a consistency map on the whiteboard - interviewers love it.',
    },
    { type: 'h2', text: 'FAQ-style follow-ups' },
    {
      type: 'ul',
      items: [
        '"Is Kafka CP or AP?" - AP for availability; ordering per partition is sequential.',
        '"Does cache break CAP?" - Cache is separate layer; define consistency per read path.',
        '"Two-phase commit?" - Strong cross-shard; slow; avoid except critical financial batches.',
        '"What does MongoDB default give?" - Often read-your-writes on primary; eventual on secondaries.',
      ],
    },
    { type: 'h2', text: 'Design exercise: ticket booking' },
    {
      type: 'ol',
      items: [
        'Seat map row in DB with version column - optimistic lock on book.',
        'On conflict, user retries different seat - strong consistency on inventory row.',
        'Waitlist counter can be eventual - off by one acceptable.',
        'Confirmation email via async queue - at-least-once OK with idempotent send.',
        'Payment row on same shard as order_id - single-shard transaction.',
      ],
    },
    { type: 'h2', text: 'Design exercise: social like button' },
    {
      type: 'p',
      text: 'Increment like counter in Redis (AP). Periodic flush to Postgres. User sees own like immediately (local cache). Global count may lag 1-2 seconds - acceptable. If interviewer asks "can likes go negative on unlike?" - use clamp at zero and idempotent unlike key.',
    },
    { type: 'h2', text: 'Linearizability vs serializability' },
    {
      type: 'p',
      text: 'Linearizability: every operation appears instantaneous between invocation and response - strongest single-object guarantee. Serializable transactions: DB schedules transactions as if serial - enough for many ledgers. You do not need both names in every interview; use when comparing Postgres serializable vs Cassandra tunable reads.',
    },
    { type: 'h2', text: 'Mock interview checklist' },
    {
      type: 'ol',
      items: [
        'Explained CAP without claiming you can have all three.',
        'Named consistency level per component in a design.',
        'Gave CP example (payments) and AP example (metrics).',
        'Mentioned quorum or partition behavior briefly.',
        'Connected to SQL vs NoSQL choice.',
      ],
    },
    { type: 'h2', text: 'Closing summary' },
    {
      type: 'p',
      text: 'CAP is not a label you slap on a database - it is a per-operation choice. Strong where invariants matter, eventual where humans tolerate delay, and always say what happens when the network splits.',
    },
  ],
}

export default article
