import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-distributed-logging-system',
  title: 'Design a Distributed Logging System',
  description:
    'How to design distributed logging for interviews: agents, collectors, Kafka buffers, indexing, retention, query APIs, and alert hooks.',
  readMinutes: 13,
  published: '2026-07-16',
  category: 'case-study',
  seoKeywords: [
    'distributed logging system design',
    'ELK stack system design interview',
    'log aggregation architecture',
    'design logging pipeline interview',
  ],
  sections: [
    {
      type: 'p',
      text: 'Every microservice wants to printf into the void. A logging platform turns that void into searchable history. Interviewers like this prompt because it is a write-heavy ingest pipeline with cheap retention tiers — cousin to [metrics monitoring](/system-design/design-metrics-monitoring-system), but with fatter, less structured payloads.',
    },
    {
      type: 'p',
      text: 'Scope with the [framework](/system-design/how-to-approach-system-design-interviews): agents on hosts, central collection, index + cold storage, search UI/API. Skip building a full SIEM product; mention security log immutability as a stretch.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Collect logs from thousands of services/hosts.',
        'Parse common formats (JSON, syslog); attach service, host, trace_id.',
        'Near-real-time search and filter (last 15 minutes hot).',
        'Retention: hot days, warm weeks, cold months.',
        'Optional: live tail, anomaly alerts, PII redaction.',
      ],
    },
    { type: 'h2', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'Ingest durability: accepted logs should not vanish on collector restart.',
        'Search freshness: seconds to low minutes for indexed fields.',
        'Backpressure: when indexers lag, buffer — do not crash app servers.',
        'Multi-tenant isolation so one noisy customer cannot starve others.',
      ],
    },
    {
      type: 'callout',
      title: 'Logs ≠ metrics ≠ traces',
      text: 'Metrics are aggregates; traces are request graphs; logs are events with text. Share transport ideas ([Kafka](/system-design/message-queues-async-processing)) but store differently. Do not shove raw logs into a TSDB or Prometheus.',
    },
    { type: 'h2', text: 'Capacity sketch' },
    {
      type: 'p',
      text: 'Order-of-magnitude: 10K hosts averaging tens of KB/s is already multi‑GB/min; a chatty host at ~500 KB/s makes the math ugly fast (10K × 500 KB/s ≈ 5 GB/s before compression). With ~5–10× compression you still land on terabytes/day. Indexing every field forever is unaffordable — index a curated set (service, level, trace_id) and keep raw blobs for selective scan.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'ol',
      items: [
        'Agent (Fluent Bit / OpenTelemetry) — tail files or receive via SDK; batch + compress.',
        'Load-balanced collectors — validate, enrich, apply [rate limits](/system-design/design-rate-limiter) per tenant.',
        'Kafka (or Pulsar) — durable buffer; partition by tenant/service.',
        'Indexer workers — parse, write hot index (OpenSearch/Elasticsearch).',
        'Object storage — compressed raw segments for cold retention.',
        'Query API — fan out to hot index; fall back to cold scan jobs for old ranges.',
        'UI / alerts — dashboards and threshold notifications.',
      ],
    },
    { type: 'h2', text: 'Ingest path' },
    {
      type: 'ol',
      items: [
        'App writes structured JSON logs (prefer this over free-text soup).',
        'Agent batches (e.g. 1–5 MB or 1–2 s), sends HTTPS to collectors.',
        'Collector acks after Kafka produce with required acks.',
        'Indexer commits offsets only after durable index/blob write (at-least-once → dedupe by event_id if needed).',
      ],
    },
    {
      type: 'p',
      text: 'At-least-once is the honest default. Exactly-once across agent→Kafka→ES is painful; use idempotent event ids for critical audit logs and accept rare duplicates in debug logs.',
    },
    { type: 'h2', text: 'Storage tiers' },
    {
      type: 'table',
      headers: ['Tier', 'Store', 'Query'],
      rows: [
        ['Hot (0–7d)', 'Elasticsearch / OpenSearch', 'Interactive search'],
        ['Warm (7–30d)', 'Fewer replicas / spin-down nodes', 'Slower search'],
        ['Cold (30d+)', 'S3/GCS compressed', 'Async recreate or Athena-style scan'],
      ],
    },
    { type: 'h2', text: 'Query path' },
    {
      type: 'p',
      text: 'Parse a Lucene-like query: service:checkout AND level:ERROR AND trace_id:X. Time range prunes indices (daily index pattern). Cap result size; paginate. Expensive queries go to an offline cluster or require sampling — protect the hot cluster like you protect an origin behind a [CDN](/system-design/design-cdn-content-delivery-network).',
    },
    { type: 'h2', text: 'Scaling and multi-tenancy' },
    {
      type: 'ul',
      items: [
        'Kafka partitions and consumer groups scale indexer throughput.',
        'Per-tenant quotas on ingest bytes/day and indexed fields.',
        'Shard Elasticsearch by time + tenant hash ([sharding](/system-design/database-sharding-replication)).',
        'Drop or sample DEBUG under pressure; never silently drop ERROR without a metric.',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'Checkout service emits {"level":"ERROR","trace_id":"abc","msg":"payment timeout"}.',
        'Agent batches; collector writes to Kafka topic logs.checkout.',
        'Indexer writes to index logs-2026-07-16 and archives the raw batch to S3.',
        'On-call searches service:checkout level:ERROR; finds the line within seconds; jumps to trace system via trace_id.',
      ],
    },
    { type: 'h2', text: 'Interview narrative' },
    {
      type: 'p',
      text: 'Draw agent → collector → Kafka → indexer → hot/cold stores. Emphasize backpressure and retention economics. Contrast with metrics (numbers) and claim the win condition is “debuggable production,” not “index everything forever.”',
    },
  ],
}

export default article
