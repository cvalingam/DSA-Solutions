import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'sql-vs-nosql-for-interviews',
  title: 'SQL vs NoSQL — How to Choose in System Design Interviews',
  description:
    'When to pick PostgreSQL vs MongoDB vs Cassandra in interviews: ACID, schema, joins, scale-out, and concrete examples from URL shorteners, feeds, and chat.',
  readMinutes: 11,
  published: '2026-06-17',
  category: 'fundamentals',
  sections: [
    {
      type: 'p',
      text: '"Should I use SQL or NoSQL?" is the question candidates ask most often — and the answer interviewers want is not a religion. They want trade-offs tied to your specific design. This guide gives you a decision framework you can use in any interview, with examples that connect to our [URL shortener](/system-design/design-url-shortener), [news feed](/system-design/design-news-feed), and [chat](/system-design/design-chat-messaging) walkthroughs.',
    },
    { type: 'h2', text: 'What SQL gives you' },
    {
      type: 'ul',
      items: [
        'ACID transactions — money, inventory, seat booking.',
        'Structured schema with foreign keys and joins.',
        'Mature tooling: migrations, ORMs, EXPLAIN plans.',
        'Strong consistency on a single primary node.',
        'Examples: PostgreSQL, MySQL, SQL Server.',
      ],
    },
    { type: 'h2', text: 'What NoSQL gives you' },
    {
      type: 'p',
      text: 'NoSQL is a bucket term, not one product. Document stores (MongoDB), wide-column (Cassandra, HBase), key-value (Redis, DynamoDB), and graph (Neo4j) solve different problems.',
    },
    {
      type: 'table',
      headers: ['Type', 'Example', 'Strength'],
      rows: [
        ['Document', 'MongoDB', 'Flexible JSON documents, secondary indexes'],
        ['Wide-column', 'Cassandra', 'Massive write throughput, partition by key'],
        ['Key-value', 'Redis, DynamoDB', 'O(1) lookup, caching, sessions'],
        ['Graph', 'Neo4j', 'Follow relationships, recommendations'],
      ],
    },
    { type: 'h2', text: 'The interview decision framework' },
    {
      type: 'ol',
      items: [
        'Do you need multi-row ACID transactions? → SQL (or careful distributed transaction design).',
        'Is your access pattern always by primary key with no joins? → Key-value or wide-column.',
        'Do you need flexible/evolving schema per record? → Document store.',
        'Is write volume sharding-bound on one machine? → Partitioned NoSQL.',
        'Can you tolerate eventual consistency on reads? → Many NoSQL setups; enables [caching](/system-design/caching-fundamentals-for-interviews).',
      ],
    },
    {
      type: 'callout',
      title: 'The sentence that wins points',
      text: '"I would use PostgreSQL for the source of truth on user accounts and billing because I need ACID. I would use Redis for feed timelines because it is key-value with sub-millisecond reads. I would use Cassandra for message storage because writes are append-only and partition by conversation_id."',
    },
    { type: 'h2', text: 'Worked examples from this site' },
    { type: 'h3', text: 'URL shortener' },
    {
      type: 'p',
      text: 'Mapping short_code → long_url needs unique lookup by primary key and strong uniqueness on insert. PostgreSQL with a B-tree index on short_code is the textbook answer. You do not need NoSQL unless write scale exceeds single-node capacity — then shard by hash of short_code.',
    },
    { type: 'h3', text: 'News feed' },
    {
      type: 'p',
      text: 'Posts table: SQL or document store both work. Precomputed timelines live in Redis (key-value), not in SQL. Follow graph can be SQL junction table or graph DB at very large scale.',
    },
    { type: 'h3', text: 'Chat messages' },
    {
      type: 'p',
      text: 'Append-heavy, read by conversation_id + time range. Wide-column stores (Cassandra) partition naturally. SQL with partitioning by conv_id works until billions of rows.',
    },
    { type: 'h2', text: 'CAP theorem in practice' },
    {
      type: 'p',
      text: 'During a network partition, you choose consistency or availability. SQL primary-replica: reads from replica may lag (eventual consistency). Cassandra leans AP — writes succeed with tunable consistency. Say which you sacrifice and why. Bank ledger: CP. Social likes count: AP with [cache](/system-design/caching-fundamentals-for-interviews) TTL.',
    },
    { type: 'h2', text: 'When candidates over-use NoSQL' },
    {
      type: 'ul',
      items: [
        'Proposing Cassandra for a 10K-user MVP with relational data.',
        'Avoiding SQL because "it does not scale" — PostgreSQL handles millions of rows with indexes.',
        'Using MongoDB when you need joins across five collections every request.',
        'Forgetting that Redis is not durable source of truth unless configured for persistence.',
      ],
    },
    { type: 'h2', text: 'Polyglot persistence' },
    {
      type: 'p',
      text: 'Real systems use multiple stores. One database rarely fits all. In an interview, naming two stores with clear roles shows maturity: "Postgres for users, Redis for sessions and timelines, S3 for media."',
    },
    { type: 'h2', text: 'Indexes and access patterns' },
    {
      type: 'p',
      text: 'SQL shines when queries need multiple columns filtered and joined — but only if indexes match access patterns. A URL shortener needs UNIQUE INDEX on short_code. A posts table needs INDEX on (user_id, created_at DESC) for profile timelines. Explain indexes in interviews the same way you explain hash maps: they turn full scans into targeted lookups.',
    },
    { type: 'h2', text: 'Normalization vs denormalization' },
    {
      type: 'p',
      text: 'Normalized SQL (separate users, posts, likes tables) avoids update anomalies and is correct for transactional data. Denormalized document stores embed related data (post with embedded author name) to avoid joins on read-heavy paths. Many systems use both: normalized source of truth in PostgreSQL, denormalized read models in cache or search indexes rebuilt async from events.',
    },
    { type: 'h2', text: 'Read replicas and connection pooling' },
    {
      type: 'p',
      text: 'When read QPS exceeds one PostgreSQL primary, add read replicas for SELECT queries. Writes still go to the primary; replicas may lag milliseconds. Thousands of app servers must not open thousands of DB connections each — use PgBouncer or RDS Proxy. This pairs directly with [horizontal scaling](/system-design/load-balancing-and-scaling) of stateless API servers.',
    },
    { type: 'h2', text: 'Interview mistakes on CAP' },
    {
      type: 'p',
      text: 'Do not recite "CAP means pick two" without context. Instead: "For a bank transfer I need strong consistency — CP. For a view counter on a blog post, eventual consistency with a [cached](/system-design/caching-fundamentals-for-interviews) aggregate is fine — AP." Interviewers want product judgment, not acronym recall.',
    },
    { type: 'h2', text: 'Rate limiter and session storage' },
    { type: 'h3', text: 'Rate limiter counters' },
    {
      type: 'p',
      text: 'Distributed [rate limiters](/system-design/design-rate-limiter) store per-key counters with TTL in Redis or DynamoDB. Access pattern: INCR key, EXPIRE key, compare to limit — always by key, never joins. DynamoDB fits when you need durable counters across regions; Redis fits when sub-millisecond latency matters and brief loss on failover is acceptable.',
    },
    { type: 'h3', text: 'Sessions and JWTs' },
    {
      type: 'p',
      text: 'Server-side sessions in Redis (key-value) scale horizontally behind a [load balancer](/system-design/load-balancing-and-scaling). JWTs in the client avoid session storage but cannot be revoked instantly without a blocklist — another key-value use case. Pick SQL for user accounts, Redis for session blobs.',
    },
    { type: 'h2', text: 'Sharding SQL vs native partitioning in NoSQL' },
    {
      type: 'table',
      headers: ['Approach', 'How it works', 'Interview note'],
      rows: [
        ['SQL sharding', 'App routes user_id % N to shard; cross-shard joins avoided', 'Mention when single Postgres primary saturates writes'],
        ['Cassandra partitions', 'Partition key determines node; clustering column sorts within partition', 'Natural for chat messages by conv_id'],
        ['DynamoDB partition key', 'Single-digit ms at any scale if key distribution is even', 'Hot partition keys are a common follow-up failure mode'],
        ['Redis Cluster', 'Hash slot per key; timelines and caches', 'Not for durable relational reporting without another store'],
      ],
    },
    {
      type: 'callout',
      title: 'Hot partition trap',
      text: 'If every message lands on the same Cassandra partition key (e.g. a global broadcast channel), one node melts. Design partition keys so load spreads — per conversation_id, per user_id, or per day bucket for analytics.',
    },
    { type: 'h2', text: 'Change Data Capture and read models' },
    {
      type: 'p',
      text: 'Many production systems keep PostgreSQL as source of truth and stream changes (CDC via Debezium or logical replication) to Elasticsearch for search, to Redis for caches, or to a data warehouse. You get SQL correctness on writes and denormalized speed on reads without choosing one database for everything. Mention this when an interviewer asks how search works on a SQL-backed product.',
    },
    { type: 'h2', text: 'Isolation levels (when they ask about transactions)' },
    {
      type: 'p',
      text: 'PostgreSQL default READ COMMITTED prevents dirty reads. SERIALIZABLE prevents phantom reads but costs throughput. In interviews, say "I would use a single-row transaction with SELECT FOR UPDATE on inventory decrement" for seat booking — that is the SQL advantage in one sentence. You do not need a lecture unless they push.',
    },
    { type: 'h2', text: 'What to say in the last five minutes' },
    {
      type: 'p',
      text: 'Close with: "I use PostgreSQL where I need ACID and relationships, Redis for caches and precomputed timelines, and Cassandra or partitioned SQL for append-only high-write logs like chat. I would not put everything in one database — each component picks the access pattern first." That answer sounds like someone who has shipped systems, not memorised a blog post.',
    },
    { type: 'h2', text: 'Mock interview checklist' },
    {
      type: 'ol',
      items: [
        'Named the access pattern for each component (lookup by key, range by time, graph traversal).',
        'Justified SQL vs NoSQL with consistency requirements, not hype.',
        'Mentioned indexes or partition keys explicitly.',
        'Acknowledged polyglot persistence (2+ stores with clear roles).',
        'Avoided "SQL does not scale" without numbers.',
        'Linked choice to a concrete case study on this site ([URL shortener](/system-design/design-url-shortener), [feed](/system-design/design-news-feed), or [chat](/system-design/design-chat-messaging)).',
      ],
    },
    { type: 'h2', text: 'Closing summary' },
    {
      type: 'p',
      text: 'Never answer SQL vs NoSQL in the abstract. Tie the choice to access pattern, consistency needs, and scale. Use the framework above and cite the component you are designing right now.',
    },
  ],
}

export default article
