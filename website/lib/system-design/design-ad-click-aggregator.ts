import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-ad-click-aggregator',
  title: 'Design an Ad Click Aggregator',
  description:
    'How to design an ad click aggregator for interviews: impression/click ingest, dedupe, real-time counters, batch warehouses, and fraud-light filters.',
  readMinutes: 13,
  published: '2026-07-16',
  category: 'case-study',
  seoKeywords: [
    'ad click aggregator system design',
    'click aggregation pipeline interview',
    'design ad analytics system',
    'impression click counting architecture',
  ],
  sections: [
    {
      type: 'p',
      text: 'Ad platforms live or die on honest counts. “Design an ad click aggregator” is less about cute UI and more about a firehose of events, idempotent counting, and dashboards that do not lie. It sits next to [metrics](/system-design/design-metrics-monitoring-system) and [Kafka pipelines](/system-design/message-queues-async-processing), with light bot filtering and the same idempotency instincts you use in [payments](/system-design/design-payment-system).',
    },
    {
      type: 'p',
      text: 'Scope with the [framework](/system-design/how-to-approach-system-design-interviews): ingest impressions and clicks, aggregate by campaign/ad/time, expose query APIs. Full RTB bidding exchanges are out of scope unless the interviewer expands.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Ingest impression and click events from edge beacons.',
        'Deduplicate retries and double-fires within a window.',
        'Maintain counts by campaign, creative, publisher, and time bucket.',
        'Near-real-time dashboards (seconds to a minute).',
        'Daily truth in a warehouse for billing.',
        'Optional: basic bot filtering, geo breakdowns.',
      ],
    },
    { type: 'h2', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'Very high write QPS; reads are fewer but bursty around business reviews.',
        'At-least-once delivery from clients → exactly-once-effect counts via event ids.',
        'Billing accuracy over flashy real-time - eventually consistent UI is OK if batch reconciles.',
        'Privacy: minimize PII; hash IPs where possible.',
      ],
    },
    {
      type: 'callout',
      title: 'Lambda-ish without the buzzword soup',
      text: 'Run a speed layer (streaming aggregates) and a batch layer (warehouse recomputes). Dashboards read speed; invoices trust batch. Saying that early shows you will not bill off a flaky Redis counter alone.',
    },
    { type: 'h2', text: 'Capacity sketch' },
    {
      type: 'p',
      text: '100K impressions/sec and 5K clicks/sec peak is a reasonable interview scale. Events ~200-500 bytes → tens of MB/s ingest. Aggregation keys: campaign_id × creative_id × minute can still explode - roll up carefully and expire hot keys.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'ol',
      items: [
        'Edge beacon / tracking pixel - 204 responses; never block the user page.',
        'Ingest API / [API gateway](/system-design/design-api-gateway) - validate schema, [rate limit](/system-design/design-rate-limiter).',
        'Kafka topics - impressions, clicks (partition by campaign_id or event_id hash).',
        'Stream processors - Flink/Spark Streaming style: dedupe + increment counters.',
        'Hot store - Redis / Druid / ClickHouse for real-time queries.',
        'Data lake / warehouse - S3 + nightly jobs for billing-grade aggregates.',
        'Query API - dashboards and advertiser reports.',
      ],
    },
    { type: 'h2', text: 'Event schema' },
    {
      type: 'table',
      headers: ['Field', 'Purpose', 'Notes'],
      rows: [
        ['event_id', 'Idempotency', 'UUID from client or edge'],
        ['type', 'impression | click', 'Separate topics optional'],
        ['campaign_id / ad_id', 'Aggregate dimensions', 'Required'],
        ['ts', 'Event time', 'Use event time + watermark, not only processing time'],
        ['user_cookie_hash', 'Dedupe / fraud signals', 'Not raw email'],
      ],
    },
    { type: 'h2', text: 'Dedupe and counting' },
    {
      type: 'ol',
      items: [
        'Dedupe with an exact KV/set of recent event_ids (e.g. 24 h for clicks). A Bloom filter is only a first pass - false positives can drop real events, which is unacceptable for billing.',
        'On new event_id, increment hierarchical counters: minute → hour → day via rollups.',
        'Click-through joins: optionally attribute click to a prior impression_id within a lookback.',
        'Emit compensated metrics when late data arrives (stream corrections) or fix in batch.',
      ],
    },
    {
      type: 'p',
      text: 'Redis INCR is fine for demos; at scale prefer a columnar OLAP store (ClickHouse/Druid) that appends raw events and aggregates on read, or pre-aggregates in stream jobs. Call out the trade-off: pre-agg is fast but rigid; raw+scan is flexible but costlier.',
    },
    { type: 'h2', text: 'Fraud-light filters' },
    {
      type: 'p',
      text: 'Drop impossible CTRs, datacenter ASNs, and click bursts from one IP. Keep filters explainable; heavy ML fraud can be an offline score that gates billing. Do not derail the interview into a full fraud product - one paragraph plus a dead-letter topic is enough.',
    },
    { type: 'h2', text: 'Query and billing' },
    {
      type: 'ul',
      items: [
        'Real-time API: GET /campaigns/{id}/stats?from&to → hot store.',
        'Billing: warehouse sum of billable clicks after fraud marks; immutable daily partitions.',
        'Reconcile speed vs batch; alert on divergence beyond a threshold ([monitoring](/system-design/design-metrics-monitoring-system)).',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'User loads a page; edge records impression event_id I1 for campaign 9.',
        'User clicks; click event_id C1 references I1; Kafka → stream job.',
        'Dedupe allows C1; Redis/Druid CTR updates within seconds.',
        'Nightly job recomputes campaign 9 billable clicks; finance uses that number.',
      ],
    },
    { type: 'h2', text: 'Interview narrative' },
    {
      type: 'p',
      text: 'Lead with beacon → Kafka → stream aggregate → hot OLAP, plus batch truth. Stress event_id idempotency and event-time windows. Keep bidding/exchange mechanics out unless invited. That is a crisp ad analytics design.',
    },
  ],
}

export default article
