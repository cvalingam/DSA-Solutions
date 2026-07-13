import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-metrics-monitoring-system',
  title: 'Design a Metrics Monitoring System (Prometheus-style)',
  description:
    'How to design a metrics and monitoring system for interviews: metric ingestion, time-series storage, aggregation, alerting, dashboards, and cardinality explosions.',
  readMinutes: 13,
  published: '2026-07-16',
  category: 'case-study',
  seoKeywords: [
    'metrics monitoring system design',
    'Prometheus system design interview',
    'time series database architecture',
    'observability system design',
  ],
  sections: [
    {
      type: 'p',
      text: 'Every sober production story ends with graphs. A metrics system ingests counters/gauges/histograms from thousands of services, stores them as time series, and fires alerts when error rate spikes. It is the cousin of [analytics pipelines](/system-design/message-queues-async-processing) but optimized for recent, high-resolution operational data rather than long-term warehouse joins.',
    },
    {
      type: 'p',
      text: 'Clarify with the [framework](/system-design/how-to-approach-system-design-interviews): pull vs push, retention (15 days vs 2 years), and whether logs/traces are in scope (usually metrics only).',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Ingest metrics with labels (service, host, path, status).',
        'Query ranges: rate(http_requests[5m]), p99 latency.',
        'Dashboards over common queries.',
        'Alert rules → [notification](/system-design/design-notification-system) channels.',
        'Service discovery of scrape targets (optional).',
      ],
    },
    { type: 'h2', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'Keep ingesting during partial outages — monitoring must not die with the app.',
        'Query recent data in under a second for dashboards.',
        'Survive cardinality mistakes without melting the cluster (or degrade gracefully).',
        'Retention tiering: hot TSDB, cold object storage.',
      ],
    },
    {
      type: 'callout',
      title: 'Cardinality is the boss fight',
      text: 'A label like user_id on every request creates billions of series. Teach clients to use bounded labels (status_code, route_template). Mention this early — interviewers love it.',
    },
    { type: 'h2', text: 'Pull vs push' },
    {
      type: 'table',
      headers: ['Model', 'How', 'Trade-off'],
      rows: [
        ['Pull (Prometheus)', 'Scraper fetches /metrics HTTP endpoints', 'Simple targets; harder through NAT'],
        ['Push (StatsD/Agent)', 'Apps push UDP/HTTP to collectors', 'Easy from everywhere; need buffering'],
        ['Hybrid', 'Agent on host pushes; central scrape agents', 'Common in large orgs'],
      ],
    },
    {
      type: 'p',
      text: 'Either works in an interview. Pick one and stay consistent. Push pairs naturally with Kafka as a buffer; pull pairs with a discovery service listing pod IPs.',
    },
    { type: 'h2', text: 'Architecture' },
    {
      type: 'ol',
      items: [
        'Instrumentation libraries in each service (counters, histograms).',
        'Collectors / agents batch and forward samples.',
        'Ingest gateway — validate, auth, [rate limit](/system-design/design-rate-limiter) abusive sources.',
        'Time-series DB (TSDB) shards by metric name + label hash.',
        'Query API — PromQL-like evaluation.',
        'Alertmanager — dedupe, group, route pages.',
        'Grafana-style dashboard frontend reading the query API.',
      ],
    },
    { type: 'h2', text: 'Time-series storage' },
    {
      type: 'p',
      text: 'A series is identified by metric name + label set. Samples are (timestamp, value) append-only. Store recent hours in memory/mmap chunks; compact to disk blocks; expire by retention. Downsample old data (1s → 1m → 1h) to save space — similar lifecycle thinking to [Pastebin](/system-design/design-pastebin) TTL tiers.',
    },
    {
      type: 'ul',
      items: [
        'Shard by hash(series_id) across ingest nodes ([sharding](/system-design/database-sharding-replication)).',
        'Replication factor 2–3 for durability of recent data.',
        'Compression (XOR delta, Gorilla-style) for float time series.',
      ],
    },
    { type: 'h2', text: 'Aggregation and rollups' },
    {
      type: 'p',
      text: 'Dashboards rarely need raw 1-second points for a 30-day chart. Pre-aggregate rollups in the background, or compute rate() at query time over raw samples for short windows. Histograms need careful merge rules (same bucket boundaries) — say “use sparse histograms” if pressed.',
    },
    { type: 'h2', text: 'Alerting' },
    {
      type: 'ol',
      items: [
        'Rule: `rate(http_5xx[5m]) / rate(http_requests[5m]) > 0.05` for 2m.',
        'Evaluator runs rules on a schedule against the TSDB.',
        'Alertmanager groups by service, silences maintenance windows, pages Slack/PagerDuty.',
        'Idempotent notification delivery — same ideas as the [notification system](/system-design/design-notification-system).',
      ],
    },
    { type: 'h2', text: 'Failure modes' },
    {
      type: 'ul',
      items: [
        'Scrape target down → mark series stale; alert on up{} == 0.',
        'Ingest hotspot on one metric → isolate or sample.',
        'Query of death (huge regex on labels) → timeouts and query budgeting.',
        'Monitoring of the monitoring: meta-metrics on ingest lag and TSDB disk.',
      ],
    },
    { type: 'h2', text: 'Capacity math' },
    {
      type: 'p',
      text: '10K services × 100 metrics × 10 label combos = 10M series. One sample every 15s → ~670K samples/sec. At 16 bytes compressed ≈ 10 MB/s ingest — very doable with a small Kafka + TSDB cluster. Cardinality mistakes turn 10M into 10B; that is the real scaling threat.',
    },
    { type: 'h2', text: 'Logs and traces (boundary)' },
    {
      type: 'p',
      text: 'Metrics answer “how much / how fast.” Logs answer “what happened to request X.” Traces answer “where time went across services.” Keep them separate stores with shared trace_id / request_id correlation. Trying to build one mega-observability DB in an interview usually loses the plot — say three pillars, one design deep.',
    },
    {
      type: 'callout',
      title: 'SLO math',
      text: 'Error budget = 1 − SLO. Alert on burn rate, not raw error count, so a brief blip does not page at 3 AM. Tie alerts to user journeys (checkout success) when possible.',
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'Checkout service exposes http_requests_total{path,code}.',
        'Agent scrapes every 15s; samples land on TSDB shard 7.',
        'On-call opens dashboard; query API computes 5m error rate.',
        'Rule fires; Alertmanager pages the checkout rotation once (grouped).',
      ],
    },
    { type: 'h2', text: 'Interview summary' },
    {
      type: 'p',
      text: 'Draw agents → ingest → TSDB → query/alert. Emphasize labels, cardinality, pull vs push, and retention. Separate monitoring from business analytics warehouses. That distinction keeps the design crisp.',
    },
  ],
}

export default article
