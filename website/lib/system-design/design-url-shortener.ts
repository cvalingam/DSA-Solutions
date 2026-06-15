import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-url-shortener',
  title: 'Design a URL Shortener — Complete Interview Walkthrough',
  description:
    'Step-by-step system design for a URL shortening service like bit.ly: API design, short-code generation, database schema, caching, redirects, and scaling reads to millions per second.',
  readMinutes: 16,
  published: '2026-06-06',
  category: 'case-study',
  sections: [
    {
      type: 'p',
      text: 'The URL shortener is the "Two Sum" of system design interviews. It is simple enough to finish in forty-five minutes, yet rich enough to discuss hashing, databases, [caching](/system-design/caching-fundamentals-for-interviews), and [rate limiting](/system-design/design-rate-limiter). Interviewers use it to see whether you can move from requirements to a working architecture without over-engineering. If you have not read our [interview framework](/system-design/how-to-approach-system-design-interviews) yet, skim that first — this walkthrough follows the same steps.',
    },
    {
      type: 'p',
      text: 'This walkthrough assumes a realistic product: users paste a long URL, get a short link, and anyone who clicks is redirected. We are not building enterprise SSO or link analytics dashboards unless the interviewer asks.',
    },
    { type: 'h2', text: 'Requirements' },
    { type: 'h3', text: 'Functional' },
    {
      type: 'ul',
      items: [
        'Given a long URL, return a shorter URL on our domain (e.g. dsas.ly/abc123).',
        'Visiting the short URL redirects (HTTP 301 or 302) to the original long URL.',
        'Optional: custom alias (dsas.ly/my-resume) if not taken.',
        'Optional: links expire after a TTL.',
      ],
    },
    { type: 'h3', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'Highly available redirects — a broken short link erodes trust immediately.',
        'Low latency on redirect — target under 100ms p99.',
        'Read-heavy: assume 100:1 read-to-write ratio or higher.',
        'Scale: 100M new URLs/month, 10B redirects/month (adjust with interviewer).',
      ],
    },
    { type: 'h2', text: 'Capacity estimation' },
    {
      type: 'p',
      text: '100M writes/month ≈ 38 writes/sec average, ~200/sec peak. 10B reads/month ≈ 3,800 reads/sec average, ~20,000/sec peak. Each row: short code (7 chars), long URL (~200 bytes avg), metadata ~100 bytes → ~350 bytes/row. 100M/month × 12 × 350 bytes ≈ 420 GB/year before indexes and replication. Manageable on one cluster initially; reads need caching.',
    },
    { type: 'h2', text: 'API design' },
    {
      type: 'table',
      headers: ['Endpoint', 'Purpose', 'Notes'],
      rows: [
        ['POST /v1/urls', 'Create short URL', 'Body: { url, customAlias?, expiresInDays? } → { shortUrl, shortCode }'],
        ['GET /{shortCode}', 'Redirect', '302 Found + Location header (302 allows changing destination later)'],
        ['DELETE /v1/urls/{shortCode}', 'Remove link', 'Requires auth in real product; optional in interview'],
      ],
    },
    {
      type: 'callout',
      title: '301 vs 302',
      text: 'Use 302 (temporary redirect) if you might update the destination or want accurate click counts per hop. Use 301 (permanent) if the mapping never changes and you want browsers to cache aggressively. Most shorteners use 302 for flexibility.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'p',
      text: 'Split the design into two paths — **create** (write-heavy, rare) and **redirect** (read-heavy, constant). Interviewers care more about the redirect path. Draw both, but spend 70% of your time on GET /{code}.',
    },
    { type: 'h3', text: 'Write path: create a short URL' },
    {
      type: 'ol',
      items: [
        'Client POSTs { url, customAlias?, expiresInDays? } to POST /v1/urls.',
        'API validates URL scheme, length, blocklist, and SSRF rules.',
        '[Rate limiter](/system-design/design-rate-limiter) checks IP / API key — reject 429 if abusive.',
        'Generate short code (base62 ID) or validate custom alias uniqueness.',
        'INSERT into PostgreSQL primary — short_code, long_url, created_at, expires_at.',
        'Return 201 { shortUrl: "https://dsas.ly/abc123" } — no need to warm cache yet; link is cold.',
      ],
    },
    { type: 'h3', text: 'Read path: redirect (the critical path)' },
    {
      type: 'ol',
      items: [
        'Browser or bot GETs https://dsas.ly/abc123.',
        'Optional CDN edge — cache 302 Location for viral links only.',
        'Load balancer routes to any stateless API server.',
        'Redis GET url:abc123 — on hit, return long URL immediately.',
        'On miss: SELECT long_url FROM read replica WHERE short_code = $1.',
        'Populate Redis (TTL 24h), respond HTTP 302 with Location: long_url.',
      ],
    },
    {
      type: 'table',
      headers: ['Component', 'Role', 'Write path', 'Read path'],
      rows: [
        ['Load balancer', 'Distributes traffic', 'Yes', 'Yes'],
        ['API servers', 'Validation, business logic', 'Insert mapping', 'Lookup + redirect'],
        ['Redis', 'Hot redirect cache', 'Optional invalidate', 'Primary lookup'],
        ['PostgreSQL primary', 'Source of truth', 'INSERT new links', 'Not on hot path'],
        ['Read replicas', 'Scale reads', 'No', 'Fallback on cache miss'],
        ['CDN', 'Edge cache for 302', 'No', 'Optional for viral URLs'],
      ],
    },
    { type: 'h2', text: 'Generating short codes' },
    { type: 'h3', text: 'Option 1: Base62 encode a unique ID' },
    {
      type: 'p',
      text: 'Use a 64-bit auto-increment ID (from DB sequence or dedicated ID generator). Encode in base62 [a-zA-Z0-9] → 7 characters covers 62^7 ≈ 3.5 trillion URLs. Pros: no collisions, predictable length. Cons: exposes volume (minor concern).',
    },
    { type: 'h3', text: 'Option 2: Hash the long URL' },
    {
      type: 'p',
      text: 'MD5/SHA truncated — fast but collisions require detection and retry. Same long URL might get different short links unless you deduplicate with a separate lookup table. Good for idempotent shortening; trickier to explain under time pressure.',
    },
    {
      type: 'p',
      text: 'In interviews, Option 1 is the safer default. Mention Option 2 if the interviewer asks about deduplication.',
    },
    { type: 'h2', text: 'Database schema' },
    {
      type: 'table',
      headers: ['Column', 'Type', 'Purpose'],
      rows: [
        ['short_code', 'VARCHAR(10) PK', 'Public identifier in the URL — indexed for redirect lookup'],
        ['long_url', 'TEXT NOT NULL', 'Original destination — can be long'],
        ['user_id', 'UUID NULL', 'Owner if authenticated; NULL for anonymous'],
        ['created_at', 'TIMESTAMPTZ', 'Audit, analytics, TTL calculation'],
        ['expires_at', 'TIMESTAMPTZ NULL', 'Optional link expiry — cron deletes expired rows'],
      ],
    },
    { type: 'h3', text: 'Key queries' },
    {
      type: 'ul',
      items: [
        'Redirect: SELECT long_url FROM url_mappings WHERE short_code = $1 — must use unique index on short_code.',
        'Create: INSERT … ON CONFLICT (short_code) DO NOTHING — return 409 for taken custom aliases.',
        'Cleanup: DELETE FROM url_mappings WHERE expires_at < NOW() — batch nightly job.',
      ],
    },
    {
      type: 'p',
      text: 'Do not store click counts in this table if redirects are hot — updates on every read would kill write throughput. Use async analytics instead.',
    },
    { type: 'h2', text: 'Caching strategy' },
    {
      type: 'p',
      text: 'Use [cache-aside](/system-design/caching-fundamentals-for-interviews) on the redirect path. Key format: url:{shortCode} → long URL string.',
    },
    {
      type: 'ol',
      items: [
        'GET redirect: Redis GET url:abc123.',
        'Hit → build 302 Location header, return immediately.',
        'Miss → query read replica, SET Redis with 24h TTL, then redirect.',
        'POST create: write to DB primary; cache optional (link not yet clicked).',
        'DELETE / update: DEL url:abc123 in Redis + purge CDN edge if used.',
      ],
    },
    {
      type: 'p',
      text: 'TTL choice: 24 hours balances freshness vs hit ratio. Viral links get millions of hits within hours — one cache fill serves them all. Long-tail links may expire from Redis unused; that is fine — occasional DB miss is cheap.',
    },
    {
      type: 'callout',
      title: 'Cache invalidation',
      text: 'If a URL is deleted or updated, purge Redis key and CDN edge entry. Stale redirects are a classic bug in student designs — mention it proactively.',
    },
    { type: 'h2', text: 'Scaling writes and reads' },
    {
      type: 'ul',
      items: [
        'API servers: horizontal scale behind load balancer; stateless.',
        'Database: primary for writes, multiple read replicas for redirect lookups on cache miss.',
        'Sharding: partition by short_code hash when single DB exhausts write IOPS or storage.',
        'Rate limiting: token bucket per IP on POST to prevent abuse — see [Design a Rate Limiter](/system-design/design-rate-limiter).',
      ],
    },
    { type: 'h2', text: 'Security and abuse' },
    {
      type: 'ul',
      items: [
        'Validate URLs — block javascript: and internal IP ranges (SSRF prevention).',
        'Scan or blocklist known phishing domains.',
        'CAPTCHA or auth for anonymous bulk creation.',
        'Monitor redirect targets for malware reports.',
      ],
    },
    { type: 'h2', text: 'Failure modes' },
    {
      type: 'table',
      headers: ['Failure', 'Create path', 'Redirect path', 'Mitigation'],
      rows: [
        ['Redis down', 'Works — writes go to DB', 'Slower — fall through to replica', 'Auto-failover Redis; replicas handle miss load'],
        ['DB primary down', 'Fail writes (503)', 'Reads OK via replica + cache', 'Promote replica or queue writes'],
        ['Replica lag', 'N/A', 'Rare stale redirect after edit', 'Invalidate cache on write; accept brief staleness'],
        ['Region outage', 'Writes fail in region', 'DNS failover to secondary region', 'Multi-region replicas + cache — advanced'],
      ],
    },
    { type: 'h2', text: 'Latency budget for the redirect path' },
    {
      type: 'p',
      text: 'Redirects must feel instant. Break down a 100ms p99 budget: DNS + TLS ~20ms (CDN helps), load balancer ~5ms, Redis GET ~1ms, application logic ~2ms, HTTP 302 response ~1ms. That leaves headroom. On cache miss, add read replica query ~10–20ms — still acceptable if misses are rare. This is why [cache-aside](/system-design/caching-fundamentals-for-interviews) is non-negotiable at scale.',
    },
    {
      type: 'table',
      headers: ['Step', 'Component', 'Typical latency'],
      rows: [
        ['1', 'CDN edge (optional)', '5–15ms'],
        ['2', 'Load balancer', '1–5ms'],
        ['3', 'Redis cache hit', '0.5–2ms'],
        ['4', 'PostgreSQL replica (miss)', '5–20ms'],
        ['5', '302 redirect to client', '1ms'],
      ],
    },
    { type: 'h2', text: 'Custom alias and reserved words' },
    {
      type: 'p',
      text: 'Custom aliases (dsas.ly/my-portfolio) require a uniqueness check before insert. Reserve paths like /api, /admin, /health so they never collide with short codes. Reject profanity and impersonation domains. For interview depth: store reserved words in a small in-memory set loaded at startup — faster than a DB check on every create.',
    },
    { type: 'h2', text: 'Optional: click analytics without slowing redirects' },
    {
      type: 'p',
      text: 'If the interviewer asks for analytics, never block the redirect on a write. Return 302 immediately, then publish a click event to a message queue (Kafka, SQS, RabbitMQ). A consumer batch-inserts into an analytics store (ClickHouse, BigQuery). Users perceive zero latency impact. Mention this pattern — it shows you understand async decoupling from your [system design framework](/system-design/how-to-approach-system-design-interviews).',
    },
    { type: 'h2', text: 'Multi-region considerations' },
    {
      type: 'p',
      text: 'For global users, deploy read replicas and Redis clusters in multiple regions. Writes go to one primary region; replicas async replicate. Redirects served locally from regional cache. Conflict resolution on custom aliases requires global uniqueness — use the primary DB or a dedicated coordination service. Only discuss this if the interviewer raises global scale; otherwise it is scope creep.',
    },
    { type: 'h2', text: 'What to say in the last five minutes' },
    {
      type: 'p',
      text: 'Summarise: "We optimised for read latency with Redis and replicas, kept writes simple with base62 IDs in PostgreSQL, and added [rate limiting](/system-design/design-rate-limiter) plus URL validation for abuse. With more time I would add click analytics via an async queue so redirects stay fast." That closing shows product sense, not just diagram drawing.',
    },
    { type: 'h2', text: 'Database indexing detail interviewers love' },
    {
      type: 'p',
      text: 'The redirect query is SELECT long_url FROM url_mappings WHERE short_code = $1. B-tree index on short_code makes this O(log n) disk lookups — effectively constant for interview purposes. Mention covering indexes only if asked: if the index includes long_url, the query is index-only without heap fetch. PostgreSQL EXPLAIN ANALYZE is what you use in production to verify; in an interview, stating "unique index on short_code" is sufficient.',
    },
    { type: 'h2', text: 'Comparison to bit.ly and TinyURL' },
    {
      type: 'p',
      text: 'Real products add link preview crawlers, malware scanning, and logged-in user dashboards. In an interview, acknowledge these as v2 features unless the prompt includes them. TinyURL launched on a single server; bit.ly scaled with caching and sharding. You are designing the core path that every shortener shares — do not apologise for skipping login unless required.',
    },
    { type: 'h2', text: 'Mock interview checklist' },
    {
      type: 'ol',
      items: [
        'Clarified functional + non-functional requirements (5 min)',
        'Did napkin math for writes, reads, storage (5 min)',
        'Drew API + components: LB, app, Redis, PostgreSQL (10 min)',
        'Explained short code generation and DB schema (10 min)',
        'Deep dive on [caching](/system-design/caching-fundamentals-for-interviews) and redirect latency (10 min)',
        'Mentioned abuse prevention, failure modes, analytics extension (5 min)',
      ],
    },
  ],
}

export default article
