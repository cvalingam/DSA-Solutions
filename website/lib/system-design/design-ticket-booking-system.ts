import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-ticket-booking-system',
  title: 'Design a Ticket Booking System (Ticketmaster)',
  description:
    'System design for concert and event ticketing: seat inventory, distributed locking, payment hold, and handling flash-sale traffic for interviews.',
  readMinutes: 12,
  published: '2026-06-25',
  category: 'case-study',
  seoKeywords: [
    'ticket booking system design',
    'Ticketmaster architecture interview',
    'seat reservation system',
    'distributed lock interview',
  ],
  sections: [
    {
      type: 'p',
      text: 'Ticket booking is the classic "strong consistency under extreme contention" problem. Ten thousand fans want seat 12A at 10:00:00.001 AM - only one can win. Interviewers test whether you reach for a cache first (wrong) or a transactional seat hold with TTL. Pair with [CAP theorem](/system-design/cap-theorem-consistency-models) CP thinking and [payment](/system-design/design-payment-system) capture after hold. Start with the [framework](/system-design/how-to-approach-system-design-interviews): stadium seating vs general admission changes the data model.',
    },
    { type: 'h2', text: 'Requirements' },
    { type: 'h3', text: 'Functional' },
    {
      type: 'ul',
      items: [
        'Browse events; view seat map with available / held / sold states.',
        'Select seats; hold for 10 minutes while user pays.',
        'Confirm booking on successful payment; release hold on timeout or cancel.',
        'One user cannot hold the same seat twice; no double booking.',
      ],
    },
    { type: 'h3', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'Flash sale: 500K users, 50K seats, spike in first 60 seconds.',
        'Seat hold must be strongly consistent - no two confirmed bookings for one seat.',
        'Browse can be eventually consistent; booking path cannot.',
        'Fair queue or virtual waiting room for hottest events (optional v2).',
      ],
    },
    {
      type: 'callout',
      title: 'General admission vs reserved seating',
      text: 'GA events sell a count of tickets - increment a counter with row-level lock. Reserved seating needs per-seat state machine. Clarify which one the interviewer wants before drawing the schema.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'table',
      headers: ['Component', 'Role'],
      rows: [
        ['Event catalog API', 'List shows, venues, pricing tiers (read-heavy, cached)'],
        ['Seat map service', 'Returns layout + availability bitmap per event'],
        ['Booking service', 'Hold, confirm, release - transactional core'],
        ['Seat inventory DB (PostgreSQL)', 'Row per seat with status + hold_expires_at'],
        ['Redis (optional)', 'Waiting room tokens, rate limit per user'],
        ['Payment service', 'Authorize at checkout; capture on order confirm'],
        ['Notification', 'Email ticket PDF on confirm ([notifications](/system-design/design-notification-system))'],
      ],
    },
    { type: 'h2', text: 'Seat state machine' },
    {
      type: 'ul',
      items: [
        'AVAILABLE → HELD (user_id, hold_id, expires_at) on successful hold',
        'HELD → SOLD on payment confirm',
        'HELD → AVAILABLE on timeout, cancel, or payment failure',
        'SOLD is terminal',
      ],
    },
    {
      type: 'p',
      text: 'Transition AVAILABLE → HELD must be atomic: `UPDATE seats SET status=\'HELD\', hold_id=?, expires_at=? WHERE event_id=? AND seat_id=? AND status=\'AVAILABLE\'` - check `rows_affected == 1`. If zero, another user won the race; return 409 Conflict. PostgreSQL takes a row-level lock during this UPDATE, but you are not holding a separate `SELECT FOR UPDATE` session - conditional UPDATE is the interview-safe pattern.',
    },
    { type: 'h2', text: 'Hold TTL and sweeper' },
    {
      type: 'p',
      text: 'Hold expires in 10 minutes. Background job every 30 sec: `UPDATE seats SET status=\'AVAILABLE\' WHERE status=\'HELD\' AND expires_at < NOW()`. Alternatively Redis key per hold with TTL fires release event to DB. Payment webhook must be idempotent ([idempotency keys](/system-design/design-unique-id-generator)) - duplicate capture must not double-charge.',
    },
    { type: 'h2', text: 'Flash sale traffic' },
    {
      type: 'ol',
      items: [
        'CDN-cache static event pages and seat map SVG (without live availability).',
        'Availability poll via WebSocket or short polling only after user enters queue.',
        'Virtual waiting room: issue random queue token; admit N users/sec to booking API.',
        '[Rate limiter](/system-design/design-rate-limiter) per user_id and IP on hold endpoint.',
        'Pre-warm DB connection pool; read replicas for browse only - writes go to primary.',
      ],
    },
    {
      type: 'p',
      text: 'Do not put seat inventory in Redis alone unless you can prove atomic Lua scripts survive failover without split-brain. PostgreSQL row lock is the interview-safe answer; Redis as acceleration is senior nuance.',
    },
    { type: 'h2', text: 'Booking flow' },
    {
      type: 'ol',
      items: [
        'GET /events/{id}/seats - cached layout; availability from DB or materialized view refreshed every few sec for browse.',
        'POST /bookings/hold - { event_id, seat_ids[] } - single DB transaction holds all seats or rolls back.',
        'POST /bookings/{hold_id}/pay - payment authorize; on success confirm all seats SOLD.',
        'Emit booking event to [Kafka](/system-design/message-queues-async-processing) for email ticket.',
      ],
    },
    { type: 'h2', text: 'Data model' },
    {
      type: 'ul',
      items: [
        'events: id, venue_id, start_time, on_sale_at',
        'seats: event_id, seat_id, section, row, number, status, hold_id, hold_expires_at',
        'bookings: id, user_id, hold_id, total_amount, payment_id, status',
        'booking_seats: booking_id, seat_id (denormalized for history)',
      ],
    },
    { type: 'h2', text: 'Capacity estimation' },
    {
      type: 'p',
      text: '50K seats × 100 bytes row ≈ 5 MB per event - fits in memory for one event, but millions of events need PostgreSQL with index on `(event_id, status)`. Peak 100K hold attempts/sec - most fail fast on `rows_affected=0`; DB handles short bursts if connection pool sized (e.g. 500 connections, pgbouncer). Bottleneck is row-level contention on popular sections, not CPU.',
    },
    { type: 'h2', text: 'Failure modes' },
    {
      type: 'table',
      headers: ['Failure', 'Mitigation'],
      rows: [
        ['Payment succeeds but confirm fails', 'Reconciliation job; idempotent confirm by payment_id'],
        ['User closes browser during hold', 'TTL sweeper releases seats'],
        ['Partial hold in multi-seat cart', 'Transaction wraps all seats - all or nothing'],
        ['DB primary down', 'Fail booking; browse from replica with stale banner'],
        ['Bot scalpers', 'CAPTCHA at queue entry; per-user hold limits'],
      ],
    },
    { type: 'h2', text: 'Waiting room pattern' },
    {
      type: 'p',
      text: 'Before on-sale, users get queue position in Redis sorted set by arrival time. Worker admits batches to booking shard when capacity allows. Prevents thundering herd on hold endpoint. Mention if interviewer describes Taylor Swift-scale demand - shows you read real postmortems.',
    },
    { type: 'h2', text: 'Sample opening (first three minutes)' },
    {
      type: 'p',
      text: 'Interviewer: "Design Ticketmaster." You: "Reserved seating with strong consistency on holds. Browse is read-heavy and cacheable; booking uses a conditional UPDATE to move seats AVAILABLE → HELD → SOLD with a 10-minute TTL. Payment authorizes at checkout and captures on confirm. For flash sales I add a waiting room and rate limits. I will sketch the seat state machine first."',
    },
    { type: 'h2', text: 'Multi-seat cart consistency' },
    {
      type: 'p',
      text: 'User selects seats A1, A2, A3 together. Hold all three in one database transaction - if A2 was taken, rollback and return which seats failed. UI refreshes map. Never hold seats one-by-one outside a transaction; partial holds strand users with unusable singles. For GA events, `UPDATE events SET tickets_remaining = tickets_remaining - qty WHERE id=? AND tickets_remaining >= qty` is the entire inventory model.',
    },
    { type: 'h2', text: 'Read vs write path separation' },
    {
      type: 'p',
      text: 'Seat map SVG and section prices are static per event - CDN cache. Live availability bitmap can be polled every 2-3 seconds from read replica with `SELECT seat_id FROM seats WHERE event_id=? AND status=\'AVAILABLE\'` - stale by a few seconds is OK for browsing, not for confirm. On hold click, always hit primary DB. This split mirrors [e-commerce](/system-design/design-ecommerce-shopping-cart) browse vs checkout.',
    },
    { type: 'h2', text: 'What to say in the last five minutes' },
    {
      type: 'p',
      text: 'Close with: "PostgreSQL seat row lock, HELD with 10-minute TTL, payment capture with idempotency, waiting room for flash sales." Emphasize browse can be stale; booking cannot.',
    },
    { type: 'h2', text: 'Mock interview checklist' },
    {
      type: 'ol',
      items: [
        'Clarified reserved vs general admission.',
        'Described atomic seat hold with conditional UPDATE.',
        'Explained hold TTL and payment confirm idempotency.',
        'Addressed flash sale with queue + rate limiting.',
        'Did not use eventual consistency for inventory writes.',
      ],
    },
    { type: 'h2', text: 'Closing summary' },
    {
      type: 'p',
      text: 'Ticketing is CP: one seat, one owner. Keep inventory in a transactional store, hold with TTL, pay with idempotency. Contrast with [news feed](/system-design/design-news-feed) eventual consistency - interviewers love when you name which pattern fits which subsystem.',
    },
  ],
}

export default article
