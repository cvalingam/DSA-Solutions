import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-dns-system',
  title: 'Design a DNS System',
  description:
    'How to design DNS for interviews: hierarchy, recursive vs authoritative resolvers, caching TTLs, anycast, zone updates, DNSSEC basics, and failure modes.',
  readMinutes: 12,
  published: '2026-08-05',
  category: 'case-study',
  seoKeywords: [
    'DNS system design interview',
    'design DNS resolver',
    'authoritative DNS design',
    'DNS caching TTL anycast',
  ],
  sections: [
    {
      type: 'p',
      text: 'DNS turns names into addresses. Every web request, [CDN](/system-design/design-cdn-content-delivery-network) edge pick, and mail hop depends on it. Interview prompts split into two flavours: build a recursive resolver (what your laptop talks to) or run authoritative name servers for a huge zone (what Cloudflare / Route 53 sell). Clarify which one in the first minute.',
    },
    {
      type: 'p',
      text: 'Use the [framework](/system-design/how-to-approach-system-design-interviews). Capacity is wild: global QPS, tiny payloads, insane fan-out of names, and a hard availability bar. Link trade-offs to [caching](/system-design/caching-fundamentals-for-interviews) and [load balancing](/system-design/load-balancing-and-scaling).',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Resolve a name (A/AAAA/CNAME/MX/TXT…) within a timeout.',
        'Authoritative path: answer for owned zones; return referrals otherwise.',
        'Recursive path: chase referrals from root → TLD → authoritative.',
        'Cache positive and negative answers with TTLs.',
        'Admin API to publish zone updates (add/change/delete records).',
      ],
    },
    { type: 'h2', text: 'Non-functional requirements' },
    {
      type: 'ul',
      items: [
        'p99 latency in low tens of milliseconds for warm cache hits.',
        'Extremely high availability - DNS failure looks like the internet is down.',
        'Correctness under update (eventual propagation is OK if you state TTLs).',
        'Resilience to spoofing and amplification (source validation, rate limits, DNSSEC optional).',
      ],
    },
    {
      type: 'callout',
      title: 'UDP first, TCP when needed',
      text: 'Most queries fit in a UDP datagram. Truncation, zone transfers (AXFR/IXFR), and DNSSEC answers may need TCP. Mention both; do not design only HTTP-looking APIs.',
    },
    { type: 'h2', text: 'Hierarchy refresher' },
    {
      type: 'ol',
      items: [
        'Root hints → ask a root for .com.',
        'TLD (.com) returns NS for example.com.',
        'Authoritative NS for example.com returns the A/AAAA record.',
        'Resolver caches each step according to TTL.',
      ],
    },
    {
      type: 'p',
      text: 'Interviewers expect you to draw this ladder out loud. Mistaking recursive for authoritative is a common fail. Recursive servers do the walking; authoritative servers only answer what they own (plus NS glue).',
    },
    { type: 'h2', text: 'Recursive resolver architecture' },
    {
      type: 'ul',
      items: [
        'Anycast VIP in front of many resolver pods per PoP.',
        'In-memory cache (LRU + TTL expiry) holding RRsets keyed by (name, type).',
        'Outbound workers that query upstream with retries and parallel A/AAAA.',
        'Optional: shared Redis tier for multi-host cache warm ([distributed cache](/system-design/design-distributed-cache-redis)).',
        'Negative caching for NXDOMAIN / NODATA with conservative TTLs.',
      ],
    },
    {
      type: 'p',
      text: 'Cache hit ratio dominates latency and upstream cost. Honour TTLs; shorter TTLs mean fresher data and more origin load - same tension as CDN [edge caching](/system-design/design-cdn-content-delivery-network). Prefetch popular names before TTL expiry if traffic is predictable.',
    },
    { type: 'h2', text: 'Authoritative name servers' },
    {
      type: 'ol',
      items: [
        'Control plane stores zones in a replicated DB; operators publish via API or DNS UPDATE.',
        'Data plane loads a frozen snapshot of records into memory on each NS node.',
        'Anycast announces the same NS IPs worldwide; BGP steers clients to nearby PoPs.',
        'Health checks withdraw unhealthy PoPs from anycast.',
      ],
    },
    {
      type: 'table',
      headers: ['Component', 'Role'],
      rows: [
        ['Zone DB', 'Source of truth for records and SOA serial'],
        ['Publisher', 'Pushes snapshots to NS fleets'],
        ['NS nodes', 'Answer queries from RAM'],
        ['Anycast / LB', 'Global entrance and failover'],
      ],
    },
    { type: 'h2', text: 'Updates and propagation' },
    {
      type: 'p',
      text: 'Bump SOA serial; push incremental or full zone sync to secondaries. Clients keep old answers until TTL expires - that is intentional. For low-TTL cutovers (blue/green of a VIP), warn about resolver caches you do not control. Secondary AXFR/IXFR still matters in textbook designs even if many providers use proprietary sync.',
    },
    { type: 'h2', text: 'Security notes worth saying' },
    {
      type: 'ul',
      items: [
        'Rate-limit clients and open resolvers to cut amplification.',
        'Validate response source / use TCP or cookies where supported.',
        'DNSSEC: signed RRsets and chain of trust - heavy, mention as optional hardening.',
        'Split-horizon DNS for internal vs public answers behind [API gateway](/system-design/design-api-gateway) style corp networks.',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'Browser asks 1.1.1.1 for www.shop.example A.',
        'Cache miss → resolver walks root → .example TLD → shop.example NS.',
        'Authoritative returns 203.0.113.10 with TTL 300.',
        'Resolver caches; next 5 minutes of nearby clients get a PoP hit.',
      ],
    },
    { type: 'h2', text: 'Interview summary' },
    {
      type: 'p',
      text: 'Name recursive vs authoritative first. Draw the hierarchy. Put TTL caching and anycast at the centre. Close with update propagation and one security control. That set covers most DNS system design rounds.',
    },
  ],
}

export default article
