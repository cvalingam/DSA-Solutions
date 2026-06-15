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
      text: 'The URL shortener is the "Two Sum" of system design interviews. It is simple enough to finish in forty-five minutes, yet rich enough to discuss hashing, databases, caching, and rate limiting. Interviewers use it to see whether you can move from requirements to a working architecture without over-engineering.',
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
      text: 'Client → CDN (optional) → Load Balancer → Stateless API servers → Redis cache → PostgreSQL (primary + replicas). The redirect path should avoid hitting the primary database on every click.',
    },
    {
      type: 'ol',
      items: [
        'User POSTs long URL to API tier.',
        'API validates URL (length, scheme, not on blocklist), generates short code, inserts row.',
        'API returns full short URL.',
        'On GET /{code}: check Redis → on miss, read replica → populate cache → redirect.',
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
      type: 'p',
      text: 'Table url_mappings: short_code VARCHAR(10) PRIMARY KEY, long_url TEXT NOT NULL, user_id UUID NULL, created_at TIMESTAMPTZ, expires_at TIMESTAMPTZ NULL. Index on expires_at for cleanup jobs. For custom aliases, uniqueness constraint on short_code handles conflicts — return 409 Conflict.',
    },
    { type: 'h2', text: 'Caching strategy' },
    {
      type: 'p',
      text: 'Cache-aside with Redis: on redirect, GET short_code. Miss → query read replica → SET with TTL (e.g. 24 hours). Hot links stay in memory; long tail may miss cache often but DB load stays bounded. Use a CDN in front for the most viral links if the interviewer pushes on global latency.',
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
        'Rate limiting: token bucket per IP on POST to prevent abuse (see our rate limiter article).',
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
      type: 'p',
      text: 'Redis down: fall through to database — slower but functional. Database primary down: fail writes, serve reads from replicas if replication lag acceptable. Region outage: multi-region active-passive with DNS failover — mention only if asked about disaster recovery.',
    },
    { type: 'h2', text: 'What to say in the last five minutes' },
    {
      type: 'p',
      text: 'Summarise: "We optimised for read latency with Redis and replicas, kept writes simple with base62 IDs in PostgreSQL, and added rate limiting plus URL validation for abuse. With more time I would add click analytics via an async queue so redirects stay fast." That closing shows product sense, not just diagram drawing.',
    },
  ],
}

export default article
