import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-web-crawler',
  title: 'Design a Web Crawler (Google Search Bot)',
  description:
    'System design for a web crawler at scale: URL frontier, politeness, deduplication, DNS, and distributed fetching for interview prep.',
  readMinutes: 12,
  published: '2026-06-22',
  category: 'case-study',
  seoKeywords: ['web crawler system design', 'distributed crawler architecture', 'URL frontier design'],
  sections: [
    {
      type: 'p',
      text: 'A web crawler discovers and downloads pages so a search engine can index them. Interviewers use it to test BFS thinking, distributed queues, and politeness constraints — the same graph traversal instincts as LeetCode, but with robots.txt and rate limits. Use the [interview framework](/system-design/how-to-approach-system-design-interviews) to clarify: are you crawling the whole public web or a fixed domain set?',
    },
    { type: 'h2', text: 'Requirements' },
    { type: 'h3', text: 'Functional' },
    {
      type: 'ul',
      items: [
        'Seed URLs in; discover new links; fetch HTML; pass documents to indexer.',
        'Respect robots.txt and per-host crawl-delay.',
        'Deduplicate URLs (canonical form) and avoid revisiting unchanged pages when possible.',
        'Prioritize important domains or fresh content (optional v2).',
      ],
    },
    { type: 'h3', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'Crawl billions of pages; millions of fetches per day.',
        'Politeness: max N concurrent requests per host (e.g. 1–2).',
        'Handle flaky sites, redirects, and DNS failures without stalling the fleet.',
        'Horizontally scale fetchers; frontier must not be a single-machine bottleneck.',
      ],
    },
    {
      type: 'callout',
      title: 'Clarify scope',
      text: 'Google-scale crawler vs single-tenant site mirror — scale and storage differ. Most interviews want distributed BFS with politeness, not a full PageRank lecture.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'table',
      headers: ['Component', 'Role'],
      rows: [
        ['URL frontier (Kafka / priority queues)', 'Pending URLs to fetch, partitioned by host hash'],
        ['Fetcher workers', 'HTTP GET, follow redirects, extract links'],
        ['URL dedup store (Bloom + DB)', 'Seen URLs; Bloom filter first, DB for certainty'],
        ['Robots cache (Redis)', 'robots.txt rules per host'],
        ['DNS resolver cache', 'Avoid repeated lookups; respect TTL'],
        ['Content store (S3 / HDFS)', 'Raw HTML for indexer pipeline'],
        ['Link extractor', 'Parse <a href>, normalize, enqueue new URLs'],
      ],
    },
    { type: 'h2', text: 'Crawl loop (BFS at scale)' },
    {
      type: 'ol',
      items: [
        'Normalize URL: lowercase host, strip fragment, resolve relative paths.',
        'Check Bloom filter — if probably seen, skip (or confirm in dedup DB).',
        'Load robots.txt for host; skip if disallowed.',
        'Enqueue to host-specific queue with politeness scheduler.',
        'Fetcher pulls when host token available; HTTP GET with timeout.',
        'Store body; extract links; enqueue unseen URLs back to frontier.',
        'Emit crawl metadata (status, checksum, fetched_at) for indexer.',
      ],
    },
    { type: 'h2', text: 'Politeness and per-host queues' },
    {
      type: 'p',
      text: 'Never hammer one server with 10K parallel requests. Partition frontier by `hash(host) % N` so all URLs for `example.com` land in one partition. A scheduler grants tokens: 1 fetch per host every X ms (robots crawl-delay or default 500ms). This is a [rate limiter](/system-design/design-rate-limiter) per host, not per user. Fetchers ask the scheduler before each GET.',
    },
    { type: 'h2', text: 'URL deduplication' },
    {
      type: 'p',
      text: 'Billions of URLs cannot fit in one Redis set. Use a Bloom filter for fast “probably seen” checks, then a distributed key-value store (Cassandra, RocksDB) for definitive membership. Canonicalize: `http://foo.com/` vs `http://foo.com/index.html` may be the same page — normalize trailing slashes and default ports. Store content hash to skip re-indexing unchanged pages ([caching](/system-design/caching-fundamentals-for-interviews) checksums).',
    },
    { type: 'h2', text: 'Capacity estimation' },
    {
      type: 'p',
      text: '1B pages, average 50 KB HTML → 50 TB raw storage (compressed ~15 TB). 10M pages/day ≈ 115 fetches/sec average; peak 5× with batch windows. If mean page has 50 links and 20% are new, frontier grows ~1M new URLs/day — Kafka handles millions/sec ingress; bottleneck is politeness, not queue throughput. 100K hosts × 1 req/sec max = 100K concurrent polite fetches upper bound — size fetcher fleet accordingly.',
    },
    { type: 'h2', text: 'Failure modes' },
    {
      type: 'table',
      headers: ['Failure', 'Mitigation'],
      rows: [
        ['Slow or hung host', 'Per-request timeout; circuit-breaker host for 1 hour'],
        ['DNS failure', 'Retry with backoff; cache negative results briefly'],
        ['Redirect loop', 'Max redirect depth 5; mark URL bad'],
        ['Duplicate storm', 'Bloom false positives rare; confirm in DB before permanent skip'],
        ['Fetcher crash mid-fetch', 'At-least-once queue; idempotent store by URL id'],
      ],
    },
    { type: 'h2', text: 'Freshness and recrawl' },
    {
      type: 'p',
      text: 'Not every URL needs daily refetch. Priority score: PageRank proxy, sitemap lastmod, or time-since-last-crawl. High-priority news sites hourly; long-tail yearly. Separate [message queue](/system-design/message-queues-async-processing) topic for “recrawl due” vs “discovered link”.',
    },
    { type: 'h2', text: 'Data model sketch' },
    {
      type: 'ul',
      items: [
        'urls: url_hash, canonical_url, host, last_fetched_at, content_hash, status',
        'host_politeness: host, max_concurrent, delay_ms, robots_fetched_at',
        'frontier_queue: Kafka topic partitioned by host hash',
      ],
    },
    { type: 'h2', text: 'DNS and robots.txt' },
    {
      type: 'p',
      text: 'Before fetching, resolve host via cached DNS (TTL respected). robots.txt is fetched once per host per day (cached in Redis). Parse Disallow rules and Crawl-delay. User-agent wildcard or specific bot name. If robots fetch fails, conservative default: slow rate or skip unknown host. This is legal/ethical requirement — not optional at Google scale.',
    },
    { type: 'h2', text: 'Link extraction and normalization' },
    {
      type: 'ol',
      items: [
        'Parse HTML (or PDF pipeline separately); extract href from <a> tags.',
        'Resolve relative URLs against base URL of parent page.',
        'Drop javascript:, mailto:, data: schemes.',
        'Canonical link tag may override duplicate URL choice.',
        'Enqueue only http/https within allowed domain policy if scoped crawl.',
      ],
    },
    { type: 'h2', text: 'Handoff to indexer' },
    {
      type: 'p',
      text: 'Crawler does not rank pages — it produces `(url, content_hash, fetch_time, raw_html_s3_key)` events on a [Kafka topic](/system-design/message-queues-async-processing). Indexer tokenizes, builds inverted index, computes PageRank offline. Decouple so fetch spikes do not block indexing. Poison pages (infinite SPA shells) detected by content-type and size limits.',
    },
    { type: 'h2', text: 'Latency budget per fetch' },
    {
      type: 'table',
      headers: ['Step', 'Target'],
      rows: [
        ['Dedup + robots check', '< 5ms'],
        ['Wait for politeness token', '0–2000ms (policy)'],
        ['DNS (cached)', '< 2ms'],
        ['HTTP GET', '< 5s timeout'],
        ['Store S3 + enqueue links', '< 50ms async'],
      ],
    },
    { type: 'h2', text: 'Worked example: single host politeness' },
    {
      type: 'p',
      text: 'Host `news.site` has crawl-delay 1s and 500 URLs discovered. Only one fetcher token per second is granted for that host — 500 seconds minimum to drain the queue for that host alone. Other hosts proceed in parallel on other partitions. Interview point: politeness caps per-host throughput regardless of fleet size.',
    },
    { type: 'h2', text: 'Sample opening (first three minutes)' },
    {
      type: 'p',
      text: 'Interviewer: "Design a web crawler." You: "I will assume we crawl the public web for search indexing. I need a distributed URL frontier, fetch workers that respect robots.txt and per-host rate limits, Bloom-filter dedup, and blob storage for HTML. I will start BFS from seed URLs, normalize links, and hand documents to a separate indexer. Politeness is non-negotiable at scale."',
    },
    { type: 'h2', text: 'What to say in the last five minutes' },
    {
      type: 'p',
      text: 'Close with: "Kafka frontier partitioned by host, per-host politeness scheduler, Bloom + DB dedup, S3 for pages, link extractor feeds BFS." Mention failures: timeouts, circuit breakers, redirect caps. That is a complete crawler answer.',
    },
    { type: 'h2', text: 'Scaling the fetcher fleet' },
    {
      type: 'p',
      text: 'Fetchers are stateless workers behind a [load balancer](/system-design/load-balancing-and-scaling) pulling from partitioned Kafka consumers. Scale consumer instances up to partition count per topic. Bottleneck is rarely CPU — it is politeness tokens and target site response time. Monitor p95 fetch latency and per-host error rate. Auto-scale on queue depth per partition, not global QPS alone.',
    },
    { type: 'h2', text: 'Security and abuse' },
    {
      type: 'ul',
      items: [
        'Do not crawl login walls or paywalled content without permission.',
        'Cap response body size (e.g. 10 MB) to avoid decompression bombs.',
        'Sandbox malware links — indexer runs in isolated pipeline.',
        'Identify crawler via User-Agent string with contact URL.',
      ],
    },
    { type: 'h2', text: 'Comparison: BFS vs priority crawl' },
    {
      type: 'table',
      headers: ['Strategy', 'When', 'Trade-off'],
      rows: [
        ['Pure BFS from seeds', 'Small domain mirror', 'Simple; may miss deep pages'],
        ['Priority queue by PageRank', 'Web-wide search', 'Complex scheduler; better crawl budget use'],
        ['Sitemap-driven', 'Cooperative sites', 'Fast fresh URLs; incomplete without BFS fallback'],
      ],
    },
    { type: 'h2', text: 'Indexer pipeline contract' },
    {
      type: 'p',
      text: 'Define event schema: `{ url, fetch_id, http_status, content_type, body_s3_key, outlinks_count }`. Indexer acks after durable write to inverted index. Failed index retries from S3 without re-fetching URL — saves politeness budget. Dead-letter index jobs for malformed HTML.',
    },
    { type: 'h2', text: 'Mock interview checklist' },
    {
      type: 'ol',
      items: [
        'Clarified scale and robots.txt / politeness.',
        'Described BFS with URL frontier and link extraction.',
        'Explained per-host rate limiting and queue partitioning.',
        'Named dedup strategy (Bloom + canonical URLs).',
        'Mentioned storage for raw HTML and handoff to indexer.',
      ],
    },
    { type: 'h2', text: 'Closing summary' },
    {
      type: 'p',
      text: 'Web crawlers are distributed BFS with manners — frontier queue, polite fetchers, dedup, and blob storage. Connect to graph traversal from DSA prep; the hard part is operations at billion-URL scale.',
    },
  ],
}

export default article
