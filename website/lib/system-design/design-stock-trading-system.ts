import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-stock-trading-system',
  title: 'Design a Stock Trading Platform',
  description:
    'How to design a stock trading system for interviews: market data, order gateway, matching engine sketch, ledger, risk checks, and low-latency paths.',
  readMinutes: 13,
  published: '2026-07-14',
  category: 'case-study',
  seoKeywords: [
    'stock trading system design',
    'design trading platform interview',
    'order matching engine architecture',
    'Robinhood system design',
  ],
  sections: [
    {
      type: 'p',
      text: 'Trading platforms scare candidates into drawing a Wall Street exchange. Most interview prompts mean a retail broker: users place orders, you route or match, you keep a correct ledger of cash and positions. Latency matters, but correctness and idempotency matter more — same DNA as a [payment system](/system-design/design-payment-system), with a live market-data firehose on the side.',
    },
    {
      type: 'p',
      text: 'Clarify with the [framework](/system-design/how-to-approach-system-design-interviews): retail app vs exchange matching engine, equities only vs crypto, market hours, and whether you simulate an exchange or route to external venues. Pick retail broker + simplified matching unless they insist.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'View quotes and basic charts for symbols.',
        'Place market/limit orders; cancel open orders.',
        'Show portfolio: cash, positions, buying power.',
        'Fill notifications and order status history.',
        'Optional: watchlists, paper trading, options (mention only).',
      ],
    },
    { type: 'h2', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'Order path: low tens of milliseconds internally; never lose or double-apply a fill.',
        'Strong consistency on balances and positions — AP is wrong here.',
        'Market data: high throughput, eventual display lag of hundreds of ms is often OK for retail.',
        'Auditability: immutable order/fill log for compliance.',
        'Idempotent order submission (client order ids).',
      ],
    },
    {
      type: 'callout',
      title: 'Ledger first',
      text: 'If cash and share counts drift, the product is broken even if the UI is pretty. Design the ledger and risk checks before obsessing over nanosecond matching. Interviewers reward that ordering.',
    },
    { type: 'h2', text: 'Capacity sketch' },
    {
      type: 'p',
      text: '10M users, peak order rates in the tens of thousands/sec at the open (retail is bursty at 9:30 ET — use whatever number the interviewer gives you). Market data: thousands of symbols × quote updates — easily 1M+ msgs/sec into your fan-out tier. Separate the hot market-data plane from the transactional order plane so a quote storm cannot stall bookings.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'ol',
      items: [
        'API / mobile gateway — auth, [rate limits](/system-design/design-rate-limiter), schema validation ([API gateway](/system-design/design-api-gateway)).',
        'Market data service — ingest exchange feeds, normalize, publish to clients via WebSocket.',
        'Order gateway — validate, assign ids ([Snowflake](/system-design/design-unique-id-generator)), persist intent.',
        'Risk engine — buying power, pattern-day-trader rules, notional limits.',
        'Matching / router — simplify as an in-memory book per symbol or a smart order router to venues.',
        'Ledger service — double-entry cash and positions; source of truth.',
        'Notification — fills via [push](/system-design/design-notification-system).',
        'Analytics / warehouse — async copy for tax lots and statements.',
      ],
    },
    { type: 'h2', text: 'Order lifecycle' },
    {
      type: 'ol',
      items: [
        'Client sends placeOrder with client_order_id (idempotency key).',
        'Persist NEW order; reserve buying power (hold cash or shares).',
        'Risk accept/reject; on reject release hold and return reason.',
        'Route to matching engine or external broker API.',
        'On partial/full fill: ledger posts debit/credit; update order status.',
        'Emit fill event; unlock remaining holds on cancel/complete.',
      ],
    },
    {
      type: 'p',
      text: 'Treat fills as the only thing that mutates positions. UI optimism is fine; the ledger is not optimistic. Use exactly-once-effect processing with idempotent fill ids — classic [queue](/system-design/message-queues-async-processing) consumer pattern.',
    },
    { type: 'h2', text: 'Data model' },
    {
      type: 'table',
      headers: ['Entity', 'Store', 'Notes'],
      rows: [
        ['Account / balances', 'SQL CP primary', 'Row-level lock or serializable txn per account'],
        ['Orders', 'SQL + append log', 'Status machine: NEW→OPEN→PARTIAL→FILLED/CANCELED'],
        ['Fills / executions', 'Append-only SQL', 'Immutable; drive ledger postings'],
        ['Positions', 'SQL', 'Derived from fills; reconcile nightly'],
        ['Quotes', 'Redis / in-memory', 'Ephemeral; not transactional truth'],
        ['Watchlists', 'SQL or KV', 'Read-heavy, weakly consistent OK'],
      ],
    },
    { type: 'h2', text: 'Matching engine (keep honest)' },
    {
      type: 'p',
      text: 'If you include matching: one single-threaded event loop per symbol (or shard of symbols) processing an input queue — determinism beats premature multi-threading. Price-time priority for limit books. Market orders consume the opposite side. Acknowledge that real exchanges are FPGA/colocated beasts; you are illustrating the state machine. For a broker-only design, replace this box with “venue adapter.”',
    },
    { type: 'h2', text: 'Market data fan-out' },
    {
      type: 'p',
      text: 'Ingest → normalize → publish to a pub/sub fabric. Clients subscribe to symbols; gateway multiplexes WebSockets. Coalesce quotes (last N ms) so mobile clients are not crushed. Cache last trade/last quote in Redis for REST snapshots. This path should not share databases with the ledger.',
    },
    { type: 'h2', text: 'Consistency and failure' },
    {
      type: 'ul',
      items: [
        'Account updates are [CP](/system-design/cap-theorem-consistency-models): better to reject orders than corrupt cash.',
        'Use database transactions or a transactional outbox when emitting fill events.',
        'Replay the order log to rebuild an in-memory book after matcher crash.',
        'Circuit-break trading on a symbol if venue feed is stale — show “data delayed.”',
        'Shard users for ledger hot spots; shard books by symbol for matching.',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'User submits limit buy 10 AAPL @ $190 with client_order_id C1.',
        'Gateway dedupes C1; risk holds $1,900 buying power.',
        'Book rests the order; later a sell hits → fill 10 @ $190.',
        'Ledger: −$1900 cash, +10 AAPL; order FILLED; push notification.',
        'Retry of C1 is a no-op thanks to idempotency key.',
      ],
    },
    { type: 'h2', text: 'Interview narrative' },
    {
      type: 'p',
      text: 'Separate market-data plane from order/ledger plane. Walk place → risk → match/route → ledger → notify. Stress idempotency and strong consistency on money. Compare to payments (no live book) and to [ticket booking](/system-design/design-ticket-booking-system) (inventory holds). That story reads senior without claiming you built NASDAQ.',
    },
  ],
}

export default article
