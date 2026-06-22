import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-payment-system',
  title: 'Design a Payment System (Stripe / PayPal)',
  description:
    'System design for payments: idempotency, ledger, authorization vs capture, PCI scope, and exactly-once money movement for interviews.',
  readMinutes: 12,
  published: '2026-06-22',
  category: 'case-study',
  seoKeywords: ['payment system design', 'Stripe architecture interview', 'idempotent payment API'],
  sections: [
    {
      type: 'p',
      text: 'Payment systems move money — mistakes are irreversible and regulated. Interviewers test idempotency, ledger accounting, and async provider integration without storing raw card numbers. Pair with [API design](/system-design/api-design-rest-interviews), [unique IDs](/system-design/design-unique-id-generator), and [CAP/consistency](/system-design/cap-theorem-consistency-models) — payments are the canonical CP component.',
    },
    { type: 'h2', text: 'Requirements' },
    { type: 'h3', text: 'Functional' },
    {
      type: 'ul',
      items: [
        'Merchant charges customer card or wallet.',
        'Support authorize (hold) then capture (settle) or one-step charge.',
        'Refunds full or partial.',
        'Webhooks to merchant on success/failure.',
        'Idempotent API — retry safe.',
      ],
    },
    { type: 'h3', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'Exactly-once money effect — no double charge on retry.',
        'PCI DSS: minimize card data in your systems (tokenization).',
        'Audit trail for every state change.',
        '99.99% correctness over raw availability.',
      ],
    },
    {
      type: 'callout',
      title: 'PCI scope',
      text: 'Never log full PAN/CVV. Use payment provider iframe or token — your servers touch only tokens. Say this early; interviewers notice.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'table',
      headers: ['Component', 'Role'],
      rows: [
        ['Payment API', 'POST /charges with Idempotency-Key header'],
        ['Payment orchestrator', 'State machine; calls acquirer/processor'],
        ['Ledger service', 'Double-entry bookkeeping; source of truth'],
        ['Idempotency store (Redis + DB)', 'Key → payment_id, 24h TTL'],
        ['Card vault / tokenizer', 'Provider tokens only in your DB'],
        ['Webhook dispatcher', 'Reliable delivery to merchants ([queues](/system-design/message-queues-async-processing))'],
        ['Reconciliation worker', 'Match provider settlement files to ledger'],
      ],
    },
    { type: 'h2', text: 'Payment state machine' },
    {
      type: 'ol',
      items: [
        'CREATED — idempotency record inserted.',
        'AUTHORIZED — funds held at issuer.',
        'CAPTURED — money moved to merchant settlement.',
        'FAILED — decline with reason code.',
        'REFUNDED — partial or full credit.',
      ],
    },
    {
      type: 'p',
      text: 'Transitions append-only in ledger_events table. Current state = latest event or materialized status column updated in same DB transaction as ledger post.',
    },
    { type: 'h2', text: 'Idempotency flow' },
    {
      type: 'ol',
      items: [
        'Client sends Idempotency-Key: uuid per logical operation.',
        'API begins transaction: insert idempotency_key if absent.',
        'If duplicate key: return stored payment_id and status — no second charge.',
        'Call processor once; store processor_ref on success.',
        'On timeout: client retries same key — server returns in-flight or final state.',
      ],
    },
    { type: 'h2', text: 'Double-entry ledger' },
    {
      type: 'p',
      text: 'Every charge: debit customer liability account, credit merchant payable (minus fee). Every capture settles to merchant bank. Ledger rows never deleted — refunds are reversing entries. Balances computed from sum of entries or cached with periodic reconciliation. Strong consistency on ledger DB — single primary or distributed SQL with serializable transactions.',
    },
    { type: 'h2', text: 'Authorize vs capture' },
    {
      type: 'p',
      text: 'E-commerce checkout: authorize at order, capture at ship. Ride hailing: authorize estimate at trip start, capture actual at end. Hotel: larger auth hold. Orchestrator schedules capture job; partial capture if final amount lower. Uncaptured auth expires per card network rules (typically 7 days).',
    },
    { type: 'h2', text: 'Webhooks to merchants' },
    {
      type: 'p',
      text: 'payment.captured → POST merchant URL with HMAC signature. Retry with backoff; DLQ after N failures. Merchant must verify signature and be idempotent on their side too. Store webhook delivery attempts for support.',
    },
    { type: 'h2', text: 'Failure modes' },
    {
      type: 'table',
      headers: ['Failure', 'Mitigation'],
      rows: [
        ['Processor timeout', 'Mark PROCESSING; reconcile via webhook or polling'],
        ['Duplicate client retry', 'Idempotency key returns same result'],
        ['Double capture bug', 'Unique constraint on (payment_id, operation)'],
        ['Ledger/DB split', '[Transactional outbox](/system-design/message-queues-async-processing) for events'],
        ['Chargeback', 'Separate dispute workflow; debit merchant payable'],
      ],
    },
    { type: 'h2', text: 'Capacity estimation' },
    {
      type: 'p',
      text: '10K payments/sec peak × 500 bytes metadata ≈ 5 MB/sec to ledger DB — need sharded ledger or partitioned table by merchant_id. Idempotency Redis: 10K keys/sec × 1 KB × 24h ≈ few GB memory. Processor API often limits TPS — queue bursts and smooth with [rate limiter](/system-design/design-rate-limiter) on outbound calls.',
    },
    { type: 'h2', text: 'API sketch' },
    {
      type: 'table',
      headers: ['Endpoint', 'Notes'],
      rows: [
        ['POST /v1/charges', 'Idempotency-Key required; returns payment_id'],
        ['POST /v1/charges/{id}/capture', 'Idempotent capture of authorized amount'],
        ['POST /v1/refunds', 'Links to charge; idempotent'],
        ['GET /v1/charges/{id}', 'Status for polling after timeout'],
      ],
    },
    { type: 'h2', text: 'Worked charge flow' },
    {
      type: 'ol',
      items: [
        'Merchant POST /charges $50, Idempotency-Key: abc.',
        'Insert idempotency row; create payment PENDING.',
        'Call processor → AUTHORIZED.',
        'Ledger: debit customer $50 liability, credit merchant payable $48.50, fee $1.50.',
        'Webhook payment.authorized to merchant.',
        'Later capture job: CAPTURED at processor; ledger settlement entry.',
      ],
    },
    { type: 'h2', text: 'Reconciliation' },
    {
      type: 'p',
      text: 'Nightly batch: processor settlement file vs ledger sums. Mismatch triggers ops queue. Float and FX handled in separate accounts. Never delete rows — adjusting entries only. Required for audits and SOC2 conversations in senior loops.',
    },
    { type: 'h2', text: 'Fraud and risk (brief)' },
    {
      type: 'p',
      text: 'Rules engine before processor call: velocity limits, geo mismatch, blocklist BIN. Async ML score may decline after auth — void hold. Separate [rate limiter](/system-design/design-rate-limiter) per merchant API key. Out of scope for junior interviews unless prompted.',
    },
    { type: 'h2', text: 'What to say in the last five minutes' },
    {
      type: 'p',
      text: 'Idempotency keys, ledger double-entry, authorize/capture, webhooks with retry, PCI via tokenization. Strong consistency on money — fail closed on partition.',
    },
    { type: 'h2', text: 'Sample opening (first three minutes)' },
    {
      type: 'p',
      text: 'Interviewer: "Design a payment API." You: "Money movement must be exactly-once from the merchant perspective — idempotency keys on every mutating call, append-only ledger, authorize/capture split. Card data stays at the processor; we store tokens only. I will draw the state machine and explain reconciliation with the acquirer."',
    },
    { type: 'h2', text: 'Latency and availability trade-off' },
    {
      type: 'table',
      headers: ['Step', 'Consistency', 'Latency'],
      rows: [
        ['Idempotency check (Redis)', 'Strong per key', '< 5ms'],
        ['Ledger write (Postgres primary)', 'Strong', '< 20ms'],
        ['Processor API call', 'External CP', '200ms–2s'],
        ['Webhook to merchant', 'At-least-once', 'Async seconds'],
      ],
    },
    { type: 'h2', text: 'Disputes and chargebacks' },
    {
      type: 'p',
      text: 'Chargeback reverses ledger via new entries — debit merchant, credit customer. Evidence bundle from trip/order metadata. Separate workflow — do not block capture path. Links to [ride hailing](/system-design/design-ride-hailing-uber) trip polyline as proof of service.',
    },
    { type: 'h2', text: 'Multi-currency and payouts' },
    {
      type: 'p',
      text: 'Ledger accounts per currency. Settlement batch transfers merchant payable to bank via ACH wire — async [queue](/system-design/message-queues-async-processing). FX conversion uses separate rate service with locked quote at charge time. Senior interview extension only.',
    },
    { type: 'h2', text: 'Testing payments' },
    {
      type: 'ul',
      items: [
        'Processor sandbox with test cards for decline paths.',
        'Idempotency replay tests — same key 10× → one charge.',
        'Chaos: kill processor mid-request; verify PROCESSING + reconcile.',
      ],
    },
    { type: 'h2', text: 'Merchant integration' },
    {
      type: 'p',
      text: 'Merchants receive API keys (publishable vs secret). Server-side charges only with secret key. Client SDK tokenizes card → returns payment_method_id. Your API never sees PAN. Webhook signing secret per merchant for HMAC verify. Same patterns as [REST API design](/system-design/api-design-rest-interviews): versioned endpoints, idempotent POST, clear error codes (card_declined, insufficient_funds).',
    },
    { type: 'h2', text: 'Partial capture and refunds' },
    {
      type: 'p',
      text: 'Hotel checkout: authorized $200, capture $180 minibar included. Refund $50 partial — ledger reversing entries linked to original charge_id. Each operation gets its own idempotency key. State machine prevents refund exceeding captured amount.',
    },
    { type: 'h2', text: 'Settlement vs authorization' },
    {
      type: 'p',
      text: 'Authorization holds funds on issuer side; capture moves money in your ledger; settlement is when acquirer batches to your bank account (T+2 days). Interviewers confuse these — define each when drawing the timeline. Reconciliation matches all three layers.',
    },
    { type: 'h2', text: 'Mock interview checklist' },
    {
      type: 'ol',
      items: [
        'Stated idempotency and PCI/tokenization.',
        'Drew payment states authorize → capture → refund.',
        'Explained double-entry ledger as source of truth.',
        'Mentioned webhooks and reconciliation.',
        'Chose strong consistency for ledger writes.',
      ],
    },
    { type: 'h2', text: 'Closing summary' },
    {
      type: 'p',
      text: 'Payments are a state machine plus a ledger — idempotency everywhere, never double-charge, audit everything. Get those three right and the rest is integration plumbing.',
    },
  ],
}

export default article
