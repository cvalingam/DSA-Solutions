import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'message-queues-async-processing',
  title: 'Message Queues and Async Processing (Kafka) for Interviews',
  description:
    'When and how to use message queues in system design: Kafka vs RabbitMQ, pub/sub, consumer groups, ordering, and decoupling write paths in interviews.',
  readMinutes: 11,
  published: '2026-06-18',
  category: 'fundamentals',
  seoKeywords: ['Kafka interview', 'message queue system design', 'event-driven architecture'],
  sections: [
    {
      type: 'p',
      text: 'The best system design answers use async somewhere — analytics on [URL shortener](/system-design/design-url-shortener) clicks, fan-out in [news feed](/system-design/design-news-feed), delivery in [notifications](/system-design/design-notification-system). This article explains when a queue helps, what Kafka gives you, and how to draw it without name-dropping tools blindly. Pair with [load balancing](/system-design/load-balancing-and-scaling) for consumer scaling.',
    },
    { type: 'h2', text: 'Sync vs async' },
    {
      type: 'table',
      headers: ['Sync (HTTP/RPC)', 'Async (queue)'],
      rows: [
        ['Caller waits for result', 'Caller publishes event and returns'],
        ['Simple mental model', 'Eventual consistency downstream'],
        ['Couples availability', 'Decouples peak load'],
        ['Good for read-your-writes', 'Good for fire-and-forget side effects'],
      ],
    },
    {
      type: 'callout',
      title: 'The sentence interviewers want',
      text: '"The user-facing path returns 302 immediately; we publish a click event to Kafka and process analytics asynchronously so redirects stay fast."',
    },
    { type: 'h2', text: 'Core concepts' },
    {
      type: 'ul',
      items: [
        'Producer — service that publishes messages.',
        'Topic — named stream of events (orders.created, clicks).',
        'Partition — ordered sub-stream within a topic; enables parallelism.',
        'Consumer group — workers share partitions; each partition consumed by one worker in group.',
        'Offset — cursor of how far a consumer has read.',
      ],
    },
    { type: 'h2', text: 'Kafka vs RabbitMQ (brief)' },
    {
      type: 'table',
      headers: ['Kafka', 'RabbitMQ'],
      rows: [
        ['Log-based; retain messages', 'Queue-based; often delete after ack'],
        ['Replay by offset', 'Harder to replay history'],
        ['High throughput analytics', 'Task queues, RPC-style work'],
        ['Partition ordering', 'Per-queue ordering'],
      ],
    },
    {
      type: 'p',
      text: 'In interviews, Kafka fits event streams and analytics; RabbitMQ/SQS fits job queues and simple task dispatch. AWS SQS is fine to mention for managed simplicity.',
    },
    { type: 'h2', text: 'Ordering guarantees' },
    {
      type: 'p',
      text: 'Kafka orders within one partition, not across partitions. Key by user_id or conversation_id so related events land in the same partition — critical for [chat](/system-design/design-chat-messaging) message ordering per conversation. Global order requires single partition (does not scale).',
    },
    { type: 'h2', text: 'Delivery semantics' },
    {
      type: 'ul',
      items: [
        'At-most-once — may lose messages; rare in production.',
        'At-least-once — default; consumers must be idempotent.',
        'Exactly-once — Kafka transactions or dedup with idempotency keys; expensive.',
      ],
    },
    {
      type: 'p',
      text: 'Say "at-least-once with idempotent consumers" for most designs — ties to [API idempotency](/system-design/api-design-rest-interviews) and [unique event IDs](/system-design/design-unique-id-generator).',
    },
    { type: 'h2', text: 'Worked examples on this site' },
    { type: 'h3', text: 'URL shortener analytics' },
    {
      type: 'p',
      text: 'Redirect handler publishes { short_code, timestamp, ip_hash } to clicks topic. Flink or batch consumer writes to ClickHouse. Zero impact on redirect latency.',
    },
    { type: 'h3', text: 'News feed fan-out' },
    {
      type: 'p',
      text: 'Post service publishes post_created; fan-out workers consume and update Redis timelines. Write path stays milliseconds; followers catch up async.',
    },
    { type: 'h3', text: 'Notification delivery' },
    {
      type: 'p',
      text: 'Separate topics per channel (push, email) so email slowdown does not block push workers.',
    },
    { type: 'h2', text: 'Consumer scaling' },
    {
      type: 'p',
      text: 'Consumers in the same group split partitions — max parallel consumers equals partition count. Need more throughput? Add partitions (plan ahead; rebalancing is costly). Separate consumer groups for inventory, email, and analytics so slow email workers do not steal partitions from fast inventory handlers. Scale horizontally behind [load balancing](/system-design/load-balancing-and-scaling) is irrelevant here — Kafka assigns partitions, not round-robin HTTP.',
    },
    { type: 'h2', text: 'Retry and exponential backoff' },
    {
      type: 'p',
      text: 'Transient failures (downstream DB timeout) should retry with jittered backoff inside the consumer — not infinite tight loops that poison the partition. After N failures, publish to DLQ with original payload and error reason. Ops replays DLQ after fix. Say: "Poison message does not block the whole topic forever." That is more convincing than only naming DLQ.',
    },
    { type: 'h2', text: 'Backpressure and DLQ' },
    {
      type: 'p',
      text: 'If consumers lag, queue depth grows. Scale consumer instances (same group). Failed messages after N retries go to dead-letter queue (DLQ) for manual inspection. Alert on DLQ depth and consumer lag — ops concern interviewers like hearing.',
    },
    { type: 'h2', text: 'When NOT to use a queue' },
    {
      type: 'ul',
      items: [
        'User needs immediate confirmation of downstream result (payment settled).',
        'Flow is simple CRUD with no peak decoupling need.',
        'Team cannot operate Kafka yet — honest MVP answer: "start sync, queue when analytics lag hurts."',
      ],
    },
    { type: 'h2', text: 'Schema registry and evolution' },
    {
      type: 'p',
      text: 'Events carry versioned JSON schema (Avro/Protobuf). Consumers tolerate unknown fields. Breaking changes get new topic or new schema version — mention briefly for senior loops.',
    },
    { type: 'h2', text: 'Monitoring' },
    {
      type: 'ul',
      items: [
        'Consumer lag (messages behind real time).',
        'DLQ depth.',
        'Publish rate vs consume rate per topic.',
        'P99 processing time per consumer.',
      ],
    },
    { type: 'h2', text: 'SQS vs Kafka quick pick' },
    {
      type: 'table',
      headers: ['Use SQS when', 'Use Kafka when'],
      rows: [
        ['Managed simplicity on AWS', 'Replay and stream analytics needed'],
        ['Job queue with visibility timeout', 'Multiple consumers read same history'],
        ['Low ops overhead MVP', 'High throughput event backbone'],
      ],
    },
    { type: 'h2', text: 'End-to-end tracing' },
    {
      type: 'p',
      text: 'Propagate correlation_id from HTTP request into message headers. Consumers log same ID — debug "order placed but email missing" across services. Standard in event-driven systems paired with [notification](/system-design/design-notification-system) workers.',
    },
    { type: 'h2', text: 'Sample event payload' },
    {
      type: 'p',
      text: 'Topic orders.created: { "order_id": "sf_123", "user_id": "u_9", "total_cents": 4999, "correlation_id": "req_abc", "timestamp": 1710000000 }. Inventory service and email service consume same topic with different consumer groups — parallel independent processing.',
    },
    { type: 'h2', text: 'Fan-out vs task queue' },
    {
      type: 'p',
      text: 'Fan-out: one message, many consumer groups each process fully ([notification](/system-design/design-notification-system) + analytics + search index). Task queue: one message, one worker claims job (competing consumers in same group). Kafka supports both patterns via consumer group design.',
    },
    { type: 'h2', text: 'Publish and consume flow' },
    {
      type: 'ol',
      items: [
        'Producer serializes event JSON; picks partition key (e.g. user_id hash).',
        'Kafka appends to partition log; acks after replica quorum (configurable).',
        'Consumer polls batch; processes message; updates offset on success.',
        'Crash before offset commit → message redelivered (at-least-once).',
        'Idempotent handler: check processed_events table or use natural idempotency key.',
      ],
    },
    { type: 'h2', text: 'Capacity back-of-envelope' },
    {
      type: 'p',
      text: '10K events/sec × 1KB payload ≈ 10 MB/sec ingress — modest for Kafka. Retain 7 days at 86GB/day per topic tier — tune retention. Partition count ≈ max desired parallel consumers in one group. Too few partitions → consumer scaling ceiling; too many → broker metadata overhead.',
    },
    { type: 'h2', text: 'Exactly-once when payments matter' },
    {
      type: 'p',
      text: 'For analytics clicks, at-least-once is fine. For ledger or inventory deduction, duplicate consumption is costly. Options: idempotent consumer with business key (order_id), Kafka transactional producer + read-process-write in one transaction, or database dedup table. Most interviews stop at idempotency — only go deeper if interviewer pushes on money movement.',
    },
    { type: 'h2', text: 'Transactional outbox pattern' },
    {
      type: 'p',
      text: 'Problem: DB commit succeeds but Kafka publish fails (or vice versa). Solution: insert business row + outbox event in one SQL transaction. Relay worker polls outbox, publishes to topic, deletes or marks sent. Same pattern links [notifications](/system-design/design-notification-system) to order creation without two-phase commit across Postgres and Kafka.',
    },
    { type: 'h2', text: 'URL shortener click — full async path' },
    {
      type: 'ol',
      items: [
        'User hits GET /abc123 → cache hit → 302 redirect in <20ms.',
        'Handler publishes { short_code, ts, referrer } to clicks topic (non-blocking).',
        'Analytics consumer group writes to ClickHouse.',
        'Fraud consumer group checks referrer against blocklist asynchronously.',
        'If Kafka briefly down: buffer in local queue or drop analytics — never block redirect.',
      ],
    },
    { type: 'h2', text: 'Common mistakes in interviews' },
    {
      type: 'table',
      headers: ['Mistake', 'Better answer'],
      rows: [
        ['"We use Kafka" with no event named', 'Name producer, topic, consumer, payload'],
        ['Queue for synchronous read', 'Queues for side effects only'],
        ['Ignore ordering', 'Partition key when per-user order matters'],
        ['No idempotency story', 'At-least-once + dedup table or natural keys'],
        ['Single consumer for everything', 'Separate consumer groups per downstream'],
      ],
    },
    { type: 'h2', text: 'News feed fan-out — partition detail' },
    {
      type: 'p',
      text: 'Topic post_created, key = author_id so all posts from one author land in one partition (optional ordering for profile page). Fan-out workers in consumer group "timeline" read event, fetch follower list (or celebrity cache), write Redis timeline keys. Celebrity with 10M followers: hybrid — do not fan-out on write; merge on read for that author only. Connects directly to [news feed](/system-design/design-news-feed) hybrid model.',
    },
    { type: 'h2', text: 'Choreography vs orchestration' },
    {
      type: 'p',
      text: 'Choreography: services react to events independently (order_created → inventory, email, analytics). Orchestration: central saga coordinator calls each step. Interviews usually prefer choreography with topics — simpler diagram. Mention saga coordinator only for strict multi-step rollback requirements (payments).',
    },
    { type: 'h2', text: 'Sample opening (first three minutes)' },
    {
      type: 'p',
      text: 'Interviewer: "Where would you use a message queue in this design?" You: "Any side effect that must not block the user path — click analytics after a redirect, fan-out after a post, email after an order. I publish an event to a topic, return HTTP immediately, and consumers process at-least-once with idempotent handlers. Partition by user_id when order matters."',
    },
    { type: 'h2', text: 'What to say in the last five minutes' },
    {
      type: 'p',
      text: 'Name the event, the topic, the producer, and the consumer. State at-least-once + idempotent handlers. Partition key for ordering. DLQ for poison messages.',
    },
    { type: 'h2', text: 'Mock interview checklist' },
    {
      type: 'ol',
      items: [
        'Explained why async (latency, decoupling, peak smoothing).',
        'Drew producer → topic → consumer group.',
        'Mentioned partition key for ordering.',
        'Stated delivery semantics and idempotency.',
        'Named DLQ or retry policy.',
      ],
    },
    { type: 'h2', text: 'Closing summary' },
    {
      type: 'p',
      text: 'Queues turn synchronous bottlenecks into background work — use them for side effects, fan-out, and analytics, not for every read path.',
    },
  ],
}

export default article
