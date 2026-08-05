import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-webhook-delivery-system',
  title: 'Design a Webhook Delivery System',
  description:
    'How to design reliable webhook delivery for interviews: signed payloads, at-least-once retries, backoff, fan-out queues, endpoint health, and idempotency keys.',
  readMinutes: 12,
  published: '2026-08-05',
  category: 'case-study',
  seoKeywords: [
    'webhook delivery system design',
    'design webhooks interview',
    'webhook retry backoff design',
    'signed webhook payload',
  ],
  sections: [
    {
      type: 'p',
      text: 'Webhooks are HTTP callbacks you push when something happens: payment.captured, invoice.paid, repo.push. Stripe, GitHub, and Slack all run variants of this. The interview is really “design a reliable outbound notification over HTTP with hostile or flaky receivers” - half [notification system](/system-design/design-notification-system), half [job scheduler](/system-design/design-distributed-job-scheduler) with signature headers.',
    },
    {
      type: 'p',
      text: 'Scope with the [framework](/system-design/how-to-approach-system-design-interviews): producers publish domain events; subscribers register HTTPS endpoints; you deliver with retries, signing, and observability. Do not boil the ocean into a full event bus unless asked.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'CRUD subscription: URL, secret, event types, enabled flag.',
        'Enqueue delivery when a matching event occurs.',
        'POST JSON with signature header (HMAC) and event id.',
        'Retry on failure with exponential backoff + capped attempts.',
        'Disable or pause endpoints that fail too often; allow manual replay.',
        'Delivery logs: attempt timestamps, status codes, latency.',
      ],
    },
    { type: 'h2', text: 'Non-functional requirements' },
    {
      type: 'ul',
      items: [
        'At-least-once delivery (receivers must be idempotent).',
        'High throughput when a popular event fans out to many tenants.',
        'Bounded lag: p50 seconds, not hours, for healthy endpoints.',
        'Isolation: one slow customer must not stall others (noisy neighbour).',
      ],
    },
    {
      type: 'callout',
      title: 'At-least-once is the honest contract',
      text: 'Exactly-once over the public internet is a fiction. Sign payloads, send a stable event_id, and tell customers to dedupe. Same lesson as [Kafka consumers](/system-design/message-queues-async-processing).',
    },
    { type: 'h2', text: 'Architecture' },
    {
      type: 'ol',
      items: [
        'Event sources write to an internal topic/outbox (order.paid).',
        'Matcher expands subscriptions → pending deliveries rows / queue messages.',
        'Worker pool POSTs to customer URLs with timeouts.',
        'On non-2xx or timeout: schedule next attempt (delay queue / visibility timeout).',
        'Success: mark delivered; Exhausted: dead-letter + alert merchant.',
      ],
    },
    {
      type: 'table',
      headers: ['Piece', 'Responsibility'],
      rows: [
        ['Subscriptions DB', 'URL, secret, filters, health state'],
        ['Delivery queue', 'Per-attempt work items with run_at'],
        ['Workers', 'Sign, POST, record outcomes'],
        ['Logs / metrics', 'Status codes, latency, retry depth'],
      ],
    },
    { type: 'h2', text: 'Signing and security' },
    {
      type: 'ul',
      items: [
        'HMAC-SHA256 over timestamp + body; header like X-Signature-256.',
        'Include timestamp; reject skew to block replay.',
        'Only HTTPS endpoints; optional IP allowlists.',
        'SSRF guard: block link-local / metadata IPs when resolving customer hosts.',
        'Rotate secrets; dual-sign during rotation windows.',
      ],
    },
    {
      type: 'p',
      text: 'Treat customer URLs as untrusted. SSRF is the security question interviewers spring when you forget it. Cap redirect hops and response body size you read.',
    },
    { type: 'h2', text: 'Retries and backoff' },
    {
      type: 'ol',
      items: [
        'Immediate retry once for obvious flukes (optional).',
        'Then 1m, 5m, 30m, 2h, 6h… with jitter ([rate limiter](/system-design/design-rate-limiter) thinking).',
        'Give up after N attempts (e.g. 72h window) → DLQ.',
        'Circuit-break a subscription after consecutive failures; drain slowly when healthy again.',
      ],
    },
    {
      type: 'p',
      text: 'Use per-subscription concurrency limits so one webhook that waits 30s on every call cannot monopolize workers. Partition queues by tenant_id for fairness.',
    },
    { type: 'h2', text: 'Ordering' },
    {
      type: 'p',
      text: 'Global order across all events is usually unnecessary. Per-resource order (all events for invoice_42) can be approximated with a partition key and single-threaded consumer for that key. Still assume duplicates. Do not promise total order over flaky HTTPS.',
    },
    { type: 'h2', text: 'Observability' },
    {
      type: 'ul',
      items: [
        'Metrics: success rate, attempt latency, queue lag, DLQ depth ([metrics](/system-design/design-metrics-monitoring-system)).',
        'Redact secrets in [logs](/system-design/design-distributed-logging-system); keep response codes and truncated error bodies.',
        'Customer-facing delivery dashboard with replay button.',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'Payment service commits charge and outbox row payment.succeeded.',
        'Matcher finds 3 subscriptions; enqueues 3 deliveries with the same event_id.',
        'Two return 200; one times out → retry at 1m, 5m; succeeds on third try.',
        'Merchant dedupes on event_id so the late retry does not double-ship.',
      ],
    },
    { type: 'h2', text: 'Interview summary' },
    {
      type: 'p',
      text: 'Outbox → match → signed POST → backoff retries → DLQ. Stress idempotent receivers, SSRF protections, and tenant isolation. That is the webhook design interview.',
    },
  ],
}

export default article
