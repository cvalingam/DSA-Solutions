import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-notification-system',
  title: 'Design a Notification System (Push, Email, SMS, In-App)',
  description:
    'System design for notifications at scale: multi-channel delivery, templates, user preferences, queues, retries, and idempotency for interview prep.',
  readMinutes: 12,
  published: '2026-06-18',
  category: 'case-study',
  seoKeywords: ['notification system design', 'push notification architecture', 'email queue design'],
  sections: [
    {
      type: 'p',
      text: 'Almost every product sends notifications - order shipped, friend request, password reset. Interviewers use this prompt to test queues, fan-out, third-party providers, and failure handling without building a full [chat system](/system-design/design-chat-messaging). Start with the [interview framework](/system-design/how-to-approach-system-design-interviews): clarify channels, volume, and whether delivery must be exactly-once or at-least-once.',
    },
    { type: 'h2', text: 'Requirements' },
    { type: 'h3', text: 'Functional' },
    {
      type: 'ul',
      items: [
        'Send notifications via push (mobile), email, SMS, and in-app inbox.',
        'Support templates with variables: "Hi {{name}}, your order {{id}} shipped."',
        'Users set per-channel preferences (marketing off, security alerts on).',
        'Track delivery status: queued, sent, failed, opened (optional).',
        'Schedule notifications for future delivery.',
      ],
    },
    { type: 'h3', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'Handle 1M notifications per day; burst to 10K per minute.',
        'Push and email latency under 30 seconds p99 for transactional alerts.',
        'At-least-once delivery with idempotency to avoid duplicate charges or spam.',
        'Third-party providers (SendGrid, FCM, Twilio) can fail or rate-limit.',
      ],
    },
    {
      type: 'callout',
      title: 'Clarify priority',
      text: 'Password reset is high priority; marketing digest is low. Ask if you need priority queues. Most interviews accept two tiers: transactional (immediate) and bulk (batched).',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'table',
      headers: ['Component', 'Role'],
      rows: [
        ['Notification API', 'Accept send requests from other services'],
        ['Template service', 'Store and render templates'],
        ['Preference service', 'User opt-in per channel and category'],
        ['Message queue (Kafka/SQS)', 'Decouple producers from delivery workers'],
        ['Channel workers', 'Push worker, email worker, SMS worker'],
        ['Provider adapters', 'FCM, APNs, SendGrid, Twilio'],
        ['Status store', 'PostgreSQL or DynamoDB for delivery logs'],
        ['In-app inbox', 'PostgreSQL + optional Redis cache for unread count'],
      ],
    },
    { type: 'h2', text: 'Send flow step by step' },
    {
      type: 'ol',
      items: [
        'Order service POST /v1/notifications { user_id, template_id, channel, payload, idempotency_key }.',
        'API validates idempotency_key - return 200 with same notification_id if duplicate.',
        'Load user preferences; skip channel if opted out (return accepted but not queued).',
        'Render template with payload variables.',
        'Publish event to Kafka topic notifications.{channel} with priority header.',
        'Worker consumes, calls provider API (FCM/SendGrid/etc.).',
        'On success: update status = sent. On failure: retry with exponential backoff; dead-letter after N tries.',
        'In-app channel writes row to inbox table; push/email/SMS skip inbox or mirror summary.',
      ],
    },
    { type: 'h2', text: 'Idempotency and deduplication' },
    {
      type: 'p',
      text: 'Producers retry on network failure. Store idempotency_key → notification_id in Redis with 24h TTL (same pattern as [API design](/system-design/api-design-rest-interviews) payment flows). Workers can also dedupe by (user_id, template_id, event_id) within a time window to prevent double password-reset emails from duplicate upstream events.',
    },
    { type: 'h2', text: 'Templates and localization' },
    {
      type: 'p',
      text: 'Templates live in DB: template_id, channel, locale, subject/body with {{placeholders}}. Render server-side before enqueue - never trust client HTML for email (XSS). For 10 locales, store 10 rows per template or use a CMS. Version templates so old queued jobs reference template_version at enqueue time.',
    },
    { type: 'h2', text: 'Scaling workers' },
    {
      type: 'p',
      text: 'Each channel scales independently behind its own consumer group. Email provider limits 100/sec - scale workers but respect provider [rate limits](/system-design/design-rate-limiter) with a token bucket in the worker. Push scales higher; SMS is expensive - batch where possible. Use [load balancing](/system-design/load-balancing-and-scaling) for stateless API and worker fleets.',
    },
    { type: 'h2', text: 'Data model sketch' },
    {
      type: 'ul',
      items: [
        'notifications: id, user_id, channel, template_id, status, created_at, sent_at',
        'user_preferences: user_id, channel, category, enabled',
        'templates: id, channel, locale, body, version',
        'in_app_inbox: id, user_id, title, body, read, created_at',
      ],
    },
    { type: 'h2', text: 'Failure modes' },
    {
      type: 'table',
      headers: ['Failure', 'Mitigation'],
      rows: [
        ['Provider 429', 'Backoff + reduce worker concurrency'],
        ['Invalid device token', 'Mark token dead; stop retrying push to that device'],
        ['Queue backlog', 'Scale consumers; shed low-priority marketing first'],
        ['Template render error', 'Fail fast; alert ops; do not send blank email'],
      ],
    },
    { type: 'h2', text: 'Capacity estimation' },
    {
      type: 'p',
      text: '1M notifications/day ≈ 12/sec average, ~100/sec peak. Push payload ~500 bytes → 50 KB/sec peak egress to FCM - trivial. Email HTML ~50 KB × 200K emails/day → storage for templates and logs, not bandwidth. Worker pool: if each worker sends 50/sec and peak is 5K/sec, need ~100 workers per channel with headroom. Metadata DB: 1M rows/day × 365 ≈ 400M rows/year - partition by created_at or archive to cold storage.',
    },
    { type: 'h2', text: 'Priority queues' },
    {
      type: 'table',
      headers: ['Tier', 'Examples', 'Handling'],
      rows: [
        ['P0 transactional', 'OTP, password reset, payment failed', 'Dedicated topic; max workers; no batching'],
        ['P1 product', 'Order shipped, friend request', 'Standard queue; retry 3×'],
        ['P2 marketing', 'Weekly digest, promotions', 'Low-priority topic; rate-limited; drop under load'],
      ],
    },
    { type: 'h2', text: 'Latency budget' },
    {
      type: 'table',
      headers: ['Step', 'Target'],
      rows: [
        ['API accept + idempotency check', '< 20ms'],
        ['Preference + template render', '< 30ms'],
        ['Enqueue to Kafka', '< 10ms'],
        ['Worker → provider (push)', '< 5s p99 end-to-end'],
      ],
    },
    {
      type: 'p',
      text: 'User-facing API returns 202 Accepted quickly; delivery is async. Do not block HTTP on SendGrid response.',
    },
    { type: 'h2', text: 'Provider abstraction' },
    {
      type: 'p',
      text: 'Wrap FCM, APNs, SendGrid behind a NotificationProvider interface. Swap vendors without changing workers. Store provider_message_id on success for support lookups. Circuit-breaker when provider error rate spikes - pause marketing, keep transactional on backup provider if configured.',
    },
    { type: 'h2', text: 'Sample API contract' },
    {
      type: 'table',
      headers: ['Endpoint', 'Response'],
      rows: [
        ['POST /v1/notifications', '202 { notification_id }'],
        ['GET /v1/notifications/{id}', '200 { status, channel, sent_at }'],
        ['GET /v1/users/{id}/preferences', '200 { channels: [...] }'],
        ['PATCH /v1/users/{id}/preferences', '204'],
        ['GET /v1/inbox?cursor=', '200 paginated in-app messages'],
      ],
    },
    { type: 'h2', text: 'Scheduled and digest notifications' },
    {
      type: 'p',
      text: 'Schedule: write row with send_at; cron scanner publishes to queue when due - same worker path. Daily digest: batch per user at 8am local time - shard users by timezone, enqueue one job per user with aggregated content. Avoid sending 1M jobs at midnight UTC; spread over the hour.',
    },
    { type: 'h2', text: 'Push channel in depth' },
    {
      type: 'p',
      text: 'Mobile push requires device tokens per app install. Store user_devices: user_id, platform (iOS/Android), token, last_seen. On send, worker loads active tokens for user_id; calls FCM (Android) or APNs (iOS). Invalid token response → mark device dead. Users with three devices get three push attempts unless you collapse to one notification per logical event. Payload size limits (~4KB) - deep links only, not full email body.',
    },
    { type: 'h2', text: 'Email and SMS specifics' },
    {
      type: 'table',
      headers: ['Channel', 'Gotcha', 'Mitigation'],
      rows: [
        ['Email', 'Bounces and spam complaints', 'Webhook from SendGrid; suppress bad addresses'],
        ['Email', 'HTML rendering across clients', 'Test templates; inline CSS for v1'],
        ['SMS', 'Cost per segment', 'Reserve for OTP and critical alerts only'],
        ['SMS', 'Regulatory opt-in (TCPA, etc.)', 'Double opt-in stored in preferences'],
      ],
    },
    { type: 'h2', text: 'How this differs from chat' },
    {
      type: 'p',
      text: '[Chat](/system-design/design-chat-messaging) is bidirectional real-time with read receipts. Notifications are mostly one-way fire-and-forget (plus optional in-app inbox). Chat needs WebSocket; notifications need durable queues and provider adapters. You can mention both use [message queues](/system-design/message-queues-async-processing) but chat optimizes latency to milliseconds; notifications optimize reliable delivery over seconds.',
    },
    { type: 'h2', text: 'Transactional outbox (advanced)' },
    {
      type: 'p',
      text: 'If order DB commit and notification enqueue must be atomic: write order row + outbox row in same DB transaction. Separate relay process reads outbox, publishes to Kafka, marks row sent. Prevents "order saved but notification never queued" without distributed transactions. Mention if interviewer pushes on consistency between DB and queue.',
    },
    { type: 'h2', text: 'Sample opening (first three minutes)' },
    {
      type: 'p',
      text: 'Interviewer: "Design a notification system." You: "Before I draw boxes - which channels matter for v1: push, email, SMS, in-app? Is this transactional only or marketing too? For scale, should I assume millions per day? I will assume at-least-once delivery with idempotency keys, async workers per channel, and preference checks before enqueue." That opening shows product sense and sets scope.',
    },
    { type: 'h2', text: 'What to say in the last five minutes' },
    {
      type: 'p',
      text: 'Close with: "Async queue per channel, template rendering before enqueue, preference checks at API, idempotency keys for producers, retries with dead-letter queue, separate workers for push/email/SMS." Mention [message queues](/system-design/message-queues-async-processing) if you discussed Kafka already.',
    },
    { type: 'h2', text: 'Mock interview checklist' },
    {
      type: 'ol',
      items: [
        'Listed channels and asked about priority / volume.',
        'Drew API → queue → workers → providers.',
        'Explained idempotency and at-least-once semantics.',
        'Mentioned user preferences and template rendering.',
        'Discussed retries, DLQ, and provider rate limits.',
      ],
    },
    { type: 'h2', text: 'Closing summary' },
    {
      type: 'p',
      text: 'Notifications are a queue-and-adapter problem: accept fast, deliver async, scale per channel, and never duplicate transactional messages. Tie back to [caching](/system-design/caching-fundamentals-for-interviews) for idempotency keys and inbox unread counts.',
    },
  ],
}

export default article
