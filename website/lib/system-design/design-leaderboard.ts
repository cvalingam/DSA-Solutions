import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-leaderboard',
  title: 'Design a Real-Time Leaderboard',
  description:
    'How to design a gaming or app leaderboard for interviews: Redis sorted sets, score updates, top-K queries, sharding by game, and handling ties at scale.',
  readMinutes: 13,
  published: '2026-07-05',
  category: 'case-study',
  seoKeywords: [
    'leaderboard system design',
    'gaming leaderboard architecture',
    'Redis sorted set interview',
    'top K ranking system design',
  ],
  sections: [
    {
      type: 'p',
      text: '"Design a leaderboard" shows up in gaming companies, fitness apps, and anywhere users compete on scores. The core operations sound simple — update a score, show top 10, show my rank — but doing that millions of times per second with correct ordering is a classic [Redis](/system-design/design-distributed-cache-redis) interview question. It also connects to sorted-set intuition from LeetCode (heaps, priority queues) without writing a single `PriorityQueue` in C#.',
    },
    {
      type: 'p',
      text: 'Use the [interview framework](/system-design/how-to-approach-system-design-interviews) to pin down scope: global leaderboard vs friends-only, whether scores only go up or can decrease, and how fresh ranks must be (real-time vs eventual).',
    },
    { type: 'h2', text: 'Requirements' },
    {
      type: 'ul',
      items: [
        'Update player score when they finish a match or level.',
        'Fetch top N players (e.g. top 100) for a leaderboard scope.',
        'Fetch a specific player\'s rank and score.',
        'Support multiple leaderboards: daily, weekly, all-time, per-game mode.',
        'Handle ties consistently (same score → tie rank or secondary sort by timestamp).',
      ],
    },
    {
      type: 'callout',
      title: 'Clarify tie-breaking',
      text: 'If two players have score 9000, who ranks higher? Common rule: earlier achiever wins (store composite score `score * 1e13 + (MAX_TS - achieved_at)` in a single sorted-set member value), or show shared rank #5 with next player at #7.',
    },
    { type: 'h2', text: 'Why not SQL ORDER BY?' },
    {
      type: 'p',
      text: '`SELECT * FROM scores ORDER BY score DESC LIMIT 10` works for prototypes. At 10M players and 50K score updates per second, maintaining a global index on score becomes a write bottleneck and `LIMIT 10` still scans a large B-tree. Reads of top-K are fast; writes that reshuffle the index are not. In interviews, say SQL for durability and Redis for hot ranking — polyglot persistence from our [SQL vs NoSQL](/system-design/sql-vs-nosql-for-interviews) guide.',
    },
    { type: 'h2', text: 'Redis sorted sets (ZSET)' },
    {
      type: 'p',
      text: 'Redis ZSET maps member → score with O(log N) insert and O(log N + M) for top-M. Commands: `ZADD leaderboard:weekly user123 4500`, `ZREVRANGE leaderboard:weekly 0 9 WITHSCORES`, `ZREVRANK leaderboard:weekly user123`. One key per leaderboard scope. This is the answer interviewers want for real-time global boards under ~100M players per board.',
    },
    { type: 'h2', text: 'Architecture' },
    {
      type: 'ol',
      items: [
        'Game client sends score event to API after match ends.',
        'API validates, writes durable record to Kafka (optional audit).',
        'Worker updates Redis ZSET and sets TTL on daily/weekly keys.',
        'Read API serves top-N and rank from Redis; cache miss rebuilds from DB (slow path).',
        'Periodic snapshot job persists Redis top 10K to PostgreSQL for history.',
      ],
    },
    { type: 'h3', text: 'Composite score for tie-break' },
    {
      type: 'p',
      text: 'Store `display_score` in API responses but sort by `sort_score = score * 1e10 - timestamp_ms` so higher game score wins and earlier time wins ties. Document this in the API so clients do not reverse-engineer ranks incorrectly.',
    },
    { type: 'h2', text: 'Sharding large leaderboards' },
    {
      type: 'p',
      text: 'A single Redis node holds ~100M members comfortably for ZSET ops, but memory caps out. Shard by `hash(user_id) % num_shards` only if you partition users — global top-10 then needs merge across shards (expensive). Better: shard by `game_id` or `region` so each board is self-contained. For a true planet-scale single board, use Redis Cluster with one key per board and vertical scale first; mention [consistent hashing](/system-design/design-distributed-cache-redis) when adding nodes.',
    },
    { type: 'h2', text: 'Friends leaderboard' },
    {
      type: 'p',
      text: 'Do not maintain a separate ZSET per user\'s friend graph (combinatorial explosion). On read: fetch friend IDs from social graph service, `ZMScore` or pipelined `ZSCORE` for each friend, sort in app memory if friend count < 500. For larger graphs, maintain a friends-only ZSET updated on each friend\'s score change via [async fan-out](/system-design/design-news-feed) — trade write amplification for faster reads.',
    },
    { type: 'h2', text: 'Time-windowed boards (daily / weekly)' },
    {
      type: 'ul',
      items: [
        'Key naming: `lb:daily:2026-07-08`, `lb:weekly:2026-W27`.',
        'Set TTL 8 days on daily keys so Redis reclaims memory automatically.',
        'Rolling window alternative: store score events in a stream and aggregate — heavier, use only if rules are complex.',
      ],
    },
    { type: 'h2', text: 'API examples' },
    {
      type: 'table',
      headers: ['Endpoint', 'Behavior'],
      rows: [
        ['POST /v1/scores', 'Body `{ user_id, game_id, score }` → update board'],
        ['GET /v1/leaderboards/{id}/top?n=100', 'Return ranked list with ties handled'],
        ['GET /v1/leaderboards/{id}/users/{user_id}', 'Return rank, score, percentile'],
      ],
    },
    {
      type: 'p',
      text: 'Protect write endpoints with [rate limiting](/system-design/design-rate-limiter) — score cheating bots are common.',
    },
    { type: 'h2', text: 'Failure modes' },
    {
      type: 'ul',
      items: [
        'Redis down: serve stale rank from last snapshot; queue score updates in Kafka.',
        'Split brain on Redis Cluster: prefer short unavailability over double-counted ranks.',
        'Hot key on one global board: read replicas for ZSET reads if using Redis Enterprise or custom read fan-out.',
      ],
    },
    { type: 'h2', text: 'Worked example: weekly board' },
    {
      type: 'ol',
      items: [
        'Player `u42` scores 12,400 in a match.',
        'API publishes `ScoreEvent` to Kafka; consumer runs `ZADD lb:weekly:2026-W27 u42 <sort_score>`.',
        'Client opens leaderboard: `ZREVRANGE` top 100 → hydrate usernames from user service batch API.',
        'Player checks rank: `ZREVRANK` returns 847 → show "Top 8%" if you precompute percentiles offline.',
        'Sunday midnight UTC: new key `lb:weekly:2026-W28`; old key expires in 8 days.',
      ],
    },
    { type: 'h2', text: 'Percentile ranks without scanning everyone' },
    {
      type: 'p',
      text: 'Exact rank from ZREVRANK is O(log N). "Top 5%" for 10M players without O(N) scan: maintain coarse histogram buckets (score 0–999, 1000–1999, …) updated on each ZADD, or approximate with Redis `ZCOUNT` between score ranges. For interviews, ZREVRANK plus exact rank is enough; mention approximation only if interviewer asks about percentiles at scale.',
    },
    { type: 'h2', text: 'Cheating and integrity' },
    {
      type: 'ul',
      items: [
        'Server-side score validation — never trust client-reported points blindly.',
        'Detect impossible score jumps (0 to 999999 in one second).',
        'Rate limit score submissions per user per minute.',
        'Ban list synced to API layer before ZADD.',
      ],
    },
    { type: 'h2', text: 'Memory math' },
    {
      type: 'p',
      text: 'Rough ZSET cost: 10M members × ~64 bytes overhead ≈ 640 MB plus member strings. Fits one Redis node with headroom. 100M members needs cluster or archival of inactive players to cold storage. Archive users inactive 90 days: remove from hot ZSET, restore on next login if they play again.',
    },
    {
      type: 'table',
      headers: ['Scale', 'Approach'],
      rows: [
        ['< 1M players per board', 'Single Redis ZSET'],
        ['1M–50M', 'Redis Cluster, one key per board'],
        ['50M+ global', 'Regional boards + optional merge job'],
        ['Friends only', 'Read-time ZMScore on friend list'],
      ],
    },
    {
      type: 'callout',
      title: 'Do not over-build',
      text: 'Skip custom skip-list microservice unless interviewer forces it. Redis ZSET is the industry answer for gaming leaderboards at most companies you will interview with.',
    },
    { type: 'h2', text: 'Global and regional leaderboards' },
    {
      type: 'p',
      text: 'Separate ZSET per region (`lb:weekly:EU`, `lb:weekly:APAC`) keeps boards fair and shards naturally. A "global" board merging regions either runs periodic merge job (union top 1000 from each) or maintains a third ZSET fed by all score events — doubles write path. For interviews, regional boards plus optional global snapshot is a clean answer.',
    },
    {
      type: 'p',
      text: 'Persistence: Redis is in-memory — snapshot ZSET to disk hourly or replay Kafka score events to rebuild after Redis failure. Leaderboard data is not as critical as payments; brief empty board during rebuild may be acceptable with "scores updating" banner.',
    },
    { type: 'h2', text: 'Interview closing' },
    {
      type: 'p',
      text: 'Lead with ZSET operations and complexity. Mention durable event log, TTL for time windows, tie-breaking trick, and friends board as a read-time aggregation problem. Connect to [distributed cache](/system-design/design-distributed-cache-redis) eviction and memory limits. That shows you know the right tool without proposing a custom skip list service nobody wants to operate.',
    },
  ],
}

export default article
