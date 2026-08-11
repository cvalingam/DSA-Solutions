import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-distributed-transactions-saga',
  title: 'Design Distributed Transactions (Saga / 2PC)',
  description:
    'How to design distributed transactions for interviews: 2PC vs Saga, choreography vs orchestration, compensations, idempotency, and when to avoid cross-service ACID.',
  readMinutes: 13,
  published: '2026-08-11',
  category: 'fundamentals',
  seoKeywords: [
    'distributed transactions system design',
    'Saga pattern interview',
    'two phase commit vs saga',
    'compensation transaction design',
  ],
  sections: [
    {
      type: 'p',
      text: 'Microservices split what used to be one DB transaction across Order, Payment, and Inventory. Interviewers ask how you keep a business action atomic enough without a global lock. Reach for the [framework](/system-design/how-to-approach-system-design-interviews), then contrast two-phase commit with Sagas - and say when neither is worth it.',
    },
    {
      type: 'p',
      text: 'This shows up inside [payments](/system-design/design-payment-system), [checkout](/system-design/design-ecommerce-shopping-cart), and booking flows. Pair with [idempotency](/system-design/design-webhook-delivery-system) and outbox patterns from [queues](/system-design/message-queues-async-processing).',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Start a multi-step business transaction spanning services.',
        'Either all steps succeed (from a business view) or compensations undo partial work.',
        'Observe status: pending / completed / compensated / stuck.',
        'Retry safely; no double charge / double reserve.',
      ],
    },
    { type: 'h2', text: 'Non-functional requirements' },
    {
      type: 'ul',
      items: [
        'Prefer availability - long 2PC locks hurt under partition ([CAP](/system-design/cap-theorem-consistency-models)).',
        'Latency of checkout measured in seconds, not minutes of blocking locks.',
        'Operability: dead-letter and human replay for poison steps.',
      ],
    },
    {
      type: 'callout',
      title: 'Avoid distributed ACID when you can',
      text: 'Single-service transactions beat fancy protocols. If Order and Payment must share a store for the happy path, consider it. Reach for Saga when ownership truly splits.',
    },
    { type: 'h2', text: 'Two-phase commit (sketch)' },
    {
      type: 'ol',
      items: [
        'Coordinator asks participants to Prepare.',
        'If all vote yes, coordinator Commits; else Rollback.',
        'Participants hold locks between Prepare and Commit.',
      ],
    },
    {
      type: 'p',
      text: 'Strong atomicity when the coordinator and network cooperate. Cost: blocking, coordinator SPOF (mitigated with replication), poor fit for long HTTP calls. Mention XA / 2PC as the textbook baseline you usually reject for user-facing microservices.',
    },
    { type: 'h2', text: 'Saga pattern' },
    {
      type: 'p',
      text: 'A Saga is a sequence of local transactions. Each successful step may register a compensating action. If step k fails, run compensations for 1..k-1 in reverse (approximately). Semantic atomicity, not isolation - concurrent readers may see intermediate states.',
    },
    {
      type: 'table',
      headers: ['Style', 'How it runs', 'Pros', 'Cons'],
      rows: [
        ['Choreography', 'Services react to events', 'Loose coupling', 'Hard to see the flow'],
        ['Orchestration', 'Central saga worker drives steps', 'Clear status & retries', 'Orchestrator becomes critical'],
      ],
    },
    { type: 'h2', text: 'Orchestrated checkout example' },
    {
      type: 'ol',
      items: [
        'CreateOrder (local TX) → status PENDING.',
        'ReserveInventory; on fail compensate CancelOrder.',
        'ChargePayment; on fail ReleaseInventory + CancelOrder.',
        'MarkOrder CONFIRMED; emit events.',
      ],
    },
    {
      type: 'p',
      text: 'Every command carries an idempotency key. Compensations must be idempotent too - ReleaseInventory twice should not go negative. Persist saga state in a store with [locking](/system-design/design-distributed-lock) or optimistic versioning so two workers do not double-drive.',
    },
    { type: 'h2', text: 'Failure modes to name' },
    {
      type: 'ul',
      items: [
        'Compensation itself fails → park in DLQ, page humans.',
        'Out-of-order events in choreography → version vectors / ignored stale messages.',
        'Dirty reads during saga → UI shows “processing” not “paid” early.',
        'Timeout vs unknown: payment may have charged - query before compensate.',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'User buys a shoe; Order PENDING, inventory reserved, payment charge times out.',
        'Orchestrator queries payment: charge succeeded → continue to confirm.',
        'Alternate world: charge failed → ReleaseInventory, CancelOrder, user sees failure.',
      ],
    },
    { type: 'h2', text: 'Interview summary' },
    {
      type: 'p',
      text: 'Reject naïve 2PC for long workflows. Offer Saga with orchestration, compensations, and idempotency. State visibility of intermediate states honestly. That closes distributed transactions.',
    },
  ],
}

export default article
