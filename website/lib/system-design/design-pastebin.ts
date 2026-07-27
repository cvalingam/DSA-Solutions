import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-pastebin',
  title: 'Design Pastebin (Text Sharing Service)',
  description:
    'How to design Pastebin for interviews: short URL generation, paste storage, expiration, access control, and scaling read-heavy text sharing with object storage and caching.',
  readMinutes: 12,
  published: '2026-07-04',
  category: 'case-study',
  seoKeywords: [
    'Pastebin system design',
    'text sharing system design interview',
    'paste storage architecture',
    'URL shortener vs pastebin',
  ],
  sections: [
    {
      type: 'p',
      text: 'Pastebin is the cousin of the URL shortener - instead of mapping a short link to an existing URL, you store arbitrary text and hand back a short link to read it. Interviewers use it to test object storage choices, TTL policies, and abuse handling without the redirect latency tricks of a [URL shortener](/system-design/design-url-shortener). If you can explain Pastebin cleanly, you have already shown you understand key-value storage, [caching](/system-design/caching-fundamentals-for-interviews), and read-heavy traffic.',
    },
    {
      type: 'p',
      text: 'Start with the [interview framework](/system-design/how-to-approach-system-design-interviews): clarify whether pastes can be private, how long they live, and whether users need accounts. Most interviews assume anonymous paste creation with optional expiration - similar scope to bit.ly but with larger payloads.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Create a paste from raw text (up to a size limit, e.g. 1 MB).',
        'Return a unique short URL like `pastebin.com/abc123`.',
        'Read paste content by short key (public unless marked private).',
        'Optional expiration: 10 minutes, 1 hour, 1 day, never.',
        'Optional syntax highlighting is a nice-to-have - metadata flag, not core architecture.',
      ],
    },
    { type: 'h2', text: 'Non-functional requirements' },
    {
      type: 'ul',
      items: [
        'High availability on reads - links get shared in Slack and forums; downtime is visible.',
        'Low latency on GET (< 100 ms p99 for text under 100 KB).',
        'Durability for non-expired pastes - do not lose user data on single disk failure.',
        'Abuse resistance: malware paste reports, [rate limiting](/system-design/design-rate-limiter) on create.',
      ],
    },
    {
      type: 'callout',
      title: 'Clarify with the interviewer',
      text: 'Is content searchable on the site (public gallery), or only accessible with the exact link? Private-unlisted pastes are the default assumption - no global search index needed.',
    },
    { type: 'h2', text: 'Capacity estimation' },
    {
      type: 'p',
      text: 'Assume 10 million new pastes per day, average paste 10 KB. Daily write volume ≈ 100 GB; yearly ≈ 36 TB before replication. Reads often dominate: if each paste is viewed 5 times on average, read QPS is 5× write QPS. A 10:1 read:write ratio is typical - design for cache-friendly GETs.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'ol',
      items: [
        'Client POST /api/pastes with body text + optional TTL.',
        'API servers validate size, run spam checks, generate unique paste_id.',
        'Store blob in object storage (S3); store metadata row in SQL.',
        'Return short URL; CDN optional for popular public pastes.',
        'GET /{paste_id} → lookup metadata → fetch blob → render or return raw text.',
      ],
    },
    { type: 'h3', text: 'Why not stuff everything in PostgreSQL?' },
    {
      type: 'p',
      text: 'Metadata (paste_id, created_at, expires_at, owner_ip, size_bytes, s3_key) fits relational tables with indexes on paste_id and expires_at. The text body belongs in object storage - same split as [file storage](/system-design/design-file-storage-dropbox) metadata vs blobs. See [SQL vs NoSQL](/system-design/sql-vs-nosql-for-interviews): OLTP row for lookup, S3 for payload.',
    },
    { type: 'h2', text: 'Generating paste IDs' },
    {
      type: 'p',
      text: 'Reuse patterns from the [URL shortener](/system-design/design-url-shortener): base62 encoding of a [Snowflake ID](/system-design/design-unique-id-generator), or random 8-character keys with collision retry. Paste IDs must be unguessable if pastes are unlisted - avoid sequential integers alone. `paste_id = base62(random_64_bits)` gives vast keyspace.',
    },
    { type: 'h2', text: 'Expiration and cleanup' },
    {
      type: 'p',
      text: 'Store `expires_at` in the metadata table. On GET, return 404 if `now > expires_at`. Background job (cron or [Kafka consumer](/system-design/message-queues-async-processing)) scans `expires_at < now` in batches, deletes S3 objects, removes DB rows. Lazy deletion on read is not enough - you must reclaim storage. Index on `expires_at` for efficient sweeps.',
    },
    { type: 'h2', text: 'Caching strategy' },
    {
      type: 'ul',
      items: [
        'Redis cache-aside: key `paste:{id}` → full text for small pastes under 64 KB.',
        'Cache only on read; invalidate on delete or expiry job.',
        'TTL on cache keys aligned with paste expiration to avoid stale hits.',
        'Viral paste: CDN caches GET response at edge - same as static content.',
      ],
    },
    { type: 'h2', text: 'API sketch' },
    {
      type: 'table',
      headers: ['Method', 'Endpoint', 'Purpose'],
      rows: [
        ['POST', '/v1/pastes', 'Create paste; body `{ content, ttl_seconds?, private? }`'],
        ['GET', '/v1/pastes/{id}', 'Fetch raw content; 404 if expired or missing'],
        ['DELETE', '/v1/pastes/{id}', 'Owner-only if auth exists; else report abuse'],
      ],
    },
    {
      type: 'p',
      text: 'Follow [REST conventions](/system-design/api-design-rest-interviews): 201 on create with Location header, 429 on spam via gateway [rate limit](/system-design/design-rate-limiter).',
    },
    { type: 'h2', text: 'Scaling and sharding' },
    {
      type: 'p',
      text: 'API tier is stateless behind an [L7 load balancer](/system-design/load-balancing-and-scaling). Shard metadata by hash(paste_id) if single Postgres saturates - pastes are immutable after create, so no hot-row updates. S3 scales horizontally by design. Read replicas on metadata DB for analytics queries (top pastes by views) without touching primary.',
    },
    { type: 'h2', text: 'Security and abuse' },
    {
      type: 'ul',
      items: [
        'Rate limit creates per IP and per API key.',
        'Scan content for malware signatures asynchronously.',
        'CAPTCHA on anonymous create if abuse spikes.',
        'Private pastes: long random paste_id is security through obscurity; add password hash in metadata for stronger protection.',
      ],
    },
    { type: 'h2', text: 'Worked example: creating a paste' },
    {
      type: 'ol',
      items: [
        'User pastes 2 KB of log output, selects 24-hour expiration.',
        'API generates `paste_id = k7x9Qm2p`, writes metadata row, uploads body to `s3://pastes/k7/k7x9Qm2p.txt`.',
        'Response: `201 Created`, `Location: /k7x9Qm2p`.',
        'First GET: cache miss → S3 fetch → populate Redis with 24h TTL → return text/plain.',
        'Subsequent GETs: Redis hit, sub-5ms latency.',
        'After 24h: GET returns 404; nightly job deletes S3 object and DB row.',
      ],
    },
    { type: 'h2', text: 'Pastebin vs URL shortener' },
    {
      type: 'table',
      headers: ['Dimension', 'URL shortener', 'Pastebin'],
      rows: [
        ['Payload', 'Short URL string only', 'Full text blob you host'],
        ['Storage', 'Tiny mapping row', 'Object storage + metadata'],
        ['Expiration', 'Often never', 'Core feature'],
        ['Read pattern', '302 redirect', 'Return body content'],
        ['Abuse risk', 'Phishing links', 'Malware paste, illegal content'],
      ],
    },
    {
      type: 'p',
      text: 'Both share ID generation and [caching](/system-design/caching-fundamentals-for-interviews) patterns from our [URL shortener](/system-design/design-url-shortener) walkthrough. Mentioning both in one interview shows you generalize designs instead of memorizing one diagram.',
    },
    { type: 'h2', text: 'Monitoring and SLOs' },
    {
      type: 'ul',
      items: [
        'Track create QPS, read QPS, cache hit ratio, S3 GET latency.',
        'Alert on expiration job backlog (millions of expired rows not deleted).',
        'SLO: 99.9% availability on GET; creates can degrade briefly during incidents.',
        'Log paste_id on abuse reports - disable without deleting audit trail.',
      ],
    },
    { type: 'h2', text: 'Storage cost and lifecycle' },
    {
      type: 'p',
      text: 'S3 Standard for hot pastes; transition to Infrequent Access after 30 days if pastes are rarely read. Expiration job is also a cost control - dead data should not sit in Standard tier forever. For text under 1 KB, some teams store inline in PostgreSQL `BYTEA` to avoid S3 overhead; switch to S3 above 4 KB. Mention both - interviewer may ask breakpoint.',
    },
    {
      type: 'p',
      text: 'View counter: `INCR paste:{id}:views` in Redis, flush to analytics warehouse nightly. Do not update PostgreSQL on every read - that turns a read-heavy workload into write amplification. Popular pastes benefit from CDN; long-tail pastes stay S3 + Redis cache on first access.',
    },
    {
      type: 'callout',
      title: 'MVP vs production',
      text: 'MVP: single region, PostgreSQL + local disk or MinIO, no CDN. Production: S3, Redis, expiration workers, abuse pipeline, multi-AZ. Say which pieces you ship first and what breaks without the rest - interviewers reward phased thinking.',
    },
    { type: 'h2', text: 'Common follow-up questions' },
    {
      type: 'p',
      text: 'Interviewers often ask how you would add syntax highlighting. Store `language_hint` in metadata; render service runs highlighter on read (stateless) or precomputes HTML on write (faster reads, stale if grammar changes). Another follow-up: custom domains for pastes - CNAME to your service, TLS via managed certificates, same backend.',
    },
    {
      type: 'p',
      text: 'Global users: replicate S3 cross-region for durability; serve reads from nearest region with metadata lookup routed by geo-DNS. Writes go to home region to avoid conflict resolution - pastes are immutable, so no merge problem. Mention [CAP](/system-design/cap-theorem-consistency-models): choose consistency on create confirmation over multi-region write latency.',
    },
    { type: 'h2', text: 'What to say in the interview' },
    {
      type: 'p',
      text: 'Walk through create and read paths in under two minutes. Emphasize metadata in SQL, blobs in S3, cache on read, TTL job for cleanup, and rate limits on write. Mention how this differs from a URL shortener (you own the content, larger payloads, expiration matters more). That answer hits storage, [caching](/system-design/caching-fundamentals-for-interviews), and ops - without overbuilding search or analytics.',
    },
  ],
}

export default article
