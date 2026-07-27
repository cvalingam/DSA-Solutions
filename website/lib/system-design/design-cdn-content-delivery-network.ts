import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-cdn-content-delivery-network',
  title: 'Design a CDN (Content Delivery Network)',
  description:
    'How to design a CDN for interviews: edge PoPs, cache hierarchy, origin shield, cache keys, invalidation, and anycast routing.',
  readMinutes: 13,
  published: '2026-07-16',
  category: 'case-study',
  seoKeywords: [
    'CDN system design',
    'content delivery network interview',
    'design a CDN architecture',
    'edge cache invalidation system design',
  ],
  sections: [
    {
      type: 'p',
      text: 'A CDN is the invisible half of Netflix, Spotify, and Instagram. Interviewers ask “design a CDN” to see if you understand latency, cache hierarchy, and failure domains - not whether you can recite Akamai marketing slides. You already touch CDN ideas in [video streaming](/system-design/design-video-streaming-netflix) and [file storage](/system-design/design-file-storage-dropbox); this article makes the CDN the product.',
    },
    {
      type: 'p',
      text: 'Scope with the [framework](/system-design/how-to-approach-system-design-interviews): pull-based HTTP/HTTPS caching for static and semi-static objects, global PoPs, purge/invalidate. Skip building a full DNS company or inventing QUIC from scratch unless they push.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Serve cached objects from an edge near the user.',
        'On miss, fetch from origin (or parent cache) and populate the edge.',
        'Support Cache-Control / TTL and explicit purge by URL or tag.',
        'Signed URLs or token auth for private content.',
        'Optional: image transforms, TLS termination, DDoS absorption (mention).',
      ],
    },
    { type: 'h2', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'P99 TTFB for hot objects under ~50-100 ms in-region.',
        'High hit ratio on popular content; origin protection under flash crowds.',
        'Availability: one PoP down should not take the whole CDN offline.',
        'Consistency: purge eventually reaches all edges within seconds to minutes - be explicit about the SLA.',
      ],
    },
    {
      type: 'callout',
      title: 'CDN is a cache product',
      text: 'Treat it as a globally distributed read-through cache with DNS/anycast steering. The hard parts are hierarchy, invalidation, and not melting the origin - same instincts as [Redis caching](/system-design/design-distributed-cache-redis), just at POP scale.',
    },
    { type: 'h2', text: 'Capacity sketch' },
    {
      type: 'p',
      text: 'Assume 200 PoPs, peak 50 Tbps egress industry-scale for a large CDN, but in interview pick a slice: 10M RPS globally, 90%+ hit rate on hot catalog. A viral multi‑MB HLS segment (or a larger progressive file) at 1M concurrent viewers without a CDN would destroy origin; with a CDN, origin roughly sees one fill per PoP or shield - not one request per viewer.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'ol',
      items: [
        'DNS / anycast - map client to nearest healthy PoP ([load balancing](/system-design/load-balancing-and-scaling) at geo scale).',
        'Edge cache - SSD/RAM tiers; HTTP reverse proxy (NGINX/ATS-class).',
        'Regional / mid-tier cache - optional parent before origin.',
        'Origin shield - single regional choke point so 200 edges do not stampede one origin.',
        'Origin - customer object store or app ([Dropbox-style](/system-design/design-file-storage-dropbox) buckets).',
        'Control plane - config, purge API, cert management, analytics.',
        'Logging - sampled access logs to a warehouse / [metrics](/system-design/design-metrics-monitoring-system).',
      ],
    },
    { type: 'h2', text: 'Request path' },
    {
      type: 'ol',
      items: [
        'Client resolves cdn.example.com → Anycast VIP of a nearby PoP.',
        'Edge looks up cache key (usually scheme+host+path+selected query params+Vary).',
        'Hit: stream bytes; refresh TTL metadata asynchronously if needed.',
        'Miss: request parent/shield; on miss there, GET origin with conditional validators (ETag / If-Modified-Since).',
        'Store object with TTL from Cache-Control; serve client; optionally fill siblings lazily.',
      ],
    },
    { type: 'h2', text: 'Cache keys and freshness' },
    {
      type: 'table',
      headers: ['Concern', 'Choice', 'Why'],
      rows: [
        ['Key', 'Normalized URL + Vary headers', 'Avoid duplicate entries for same bytes'],
        ['TTL', 'Honor origin Cache-Control', 'Customer controls freshness'],
        ['Stale-while-revalidate', 'Serve stale, refresh in background', 'Hide origin latency'],
        ['Private content', 'Signed URL / cookie token at edge', 'Auth without hitting origin every time'],
      ],
    },
    {
      type: 'p',
      text: 'Query-string allowlists matter: ignoring tracking params boosts hit ratio. Mention [CAP](/system-design/cap-theorem-consistency-models): edges are AP for reads - users may see slightly different versions until purge completes.',
    },
    { type: 'h2', text: 'Invalidation' },
    {
      type: 'p',
      text: 'Purge-by-URL is exact; purge-by-tag (Surrogate-Key) batches related objects. Control plane fans out purge messages over a pub/sub fabric ([Kafka](/system-design/message-queues-async-processing) or dedicated purge bus). Soft purge marks stale; hard purge deletes. Soft purge + revalidate is kinder under thundering herds.',
    },
    { type: 'h2', text: 'Origin protection' },
    {
      type: 'ul',
      items: [
        'Origin shield / request coalescing - one in-flight fill per cache key per PoP.',
        'Negative caching for 404s with short TTL.',
        '[Rate limit](/system-design/design-rate-limiter) abusive clients at the edge.',
        'Circuit-break a bad origin; serve stale if policy allows.',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'User in Mumbai requests /videos/ep1/seg012.ts.',
        'DNS lands on Mumbai PoP; miss → Singapore shield → S3 origin.',
        'Object cached 24h at edge and shield; next 50K viewers in India hit Mumbai RAM/SSD.',
        'Publisher uploads a fix; purge API invalidates the segment tag; edges revalidate within the purge SLA.',
      ],
    },
    { type: 'h2', text: 'Interview narrative' },
    {
      type: 'p',
      text: 'Draw client → edge → shield → origin. Stress hit ratio, coalesced fills, and purge as a control-plane problem. Tie back to Netflix/Spotify as customers of this box. That is a complete CDN design without pretending you operate every submarine cable.',
    },
  ],
}

export default article
