import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-airbnb-hotel-booking',
  title: 'Design Airbnb (Hotel / Home Booking Marketplace)',
  description:
    'How to design Airbnb for interviews: listing search, availability calendar, booking holds, payments, host/guest flows, and scaling a two-sided marketplace.',
  readMinutes: 14,
  published: '2026-07-09',
  category: 'case-study',
  seoKeywords: [
    'Airbnb system design',
    'hotel booking system design interview',
    'marketplace system design',
    'availability calendar architecture',
  ],
  sections: [
    {
      type: 'p',
      text: 'Airbnb is not just “Ticketmaster for houses.” You have a two-sided marketplace: hosts publish listings with calendars and prices; guests search, book, and pay; the platform sits in the middle with trust, messaging, and money movement. Interviewers use it to test search, inventory consistency, and [payment](/system-design/design-payment-system) flows in one design. If you already did [ticket booking](/system-design/design-ticket-booking-system), reuse the hold-then-confirm idea — seats become nights.',
    },
    {
      type: 'p',
      text: 'Open with the [interview framework](/system-design/how-to-approach-system-design-interviews): clarify city-level search vs map search, whether instant book exists, and how far ahead calendars go. Most interviews want search + book + payment, not the full review ML stack.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Hosts create listings: photos, amenities, location, nightly price, availability calendar.',
        'Guests search by city/dates/guests and filter (price, bedrooms, pets).',
        'Guest books a stay; host may auto-accept (instant book) or approve.',
        'Payment authorize on book, capture on check-in or after host accept.',
        'Messaging between host and guest; reviews after stay.',
      ],
    },
    { type: 'h2', text: 'Non-functional requirements' },
    {
      type: 'ul',
      items: [
        'Search latency under ~200 ms p99 for common city queries.',
        'No double-booking the same listing for overlapping nights.',
        'Strong consistency on booking writes; search can be slightly stale.',
        'High availability on browse; booking can fail closed rather than oversell.',
      ],
    },
    {
      type: 'callout',
      title: 'Clarify inventory model',
      text: 'One listing = one physical unit (entire home) is the default. Multi-room hotels with identical room types need inventory counts — say which model you assume early.',
    },
    { type: 'h2', text: 'Capacity sketch' },
    {
      type: 'p',
      text: 'Assume 5M listings, 100M searches/day (~1K QPS average, 5K peak), 500K bookings/day. Search dominates. Photos are heavy — same CDN story as [Instagram](/system-design/design-instagram-photo-sharing). Booking QPS is modest; correctness matters more than raw throughput.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'ol',
      items: [
        'Listing service — CRUD for listing metadata; photos to S3 + CDN.',
        'Calendar / inventory service — night-level availability and holds.',
        'Search service — Elasticsearch or OpenSearch index of listings + geo.',
        'Booking service — create reservation, call payments, update calendar.',
        'Payment service — authorize/capture via Stripe-like PSP ([payment design](/system-design/design-payment-system)).',
        'Notification + messaging — booking emails, in-app chat ([notifications](/system-design/design-notification-system), [chat](/system-design/design-chat-messaging)).',
      ],
    },
    { type: 'h2', text: 'Data model (interview-friendly)' },
    {
      type: 'table',
      headers: ['Entity', 'Key fields', 'Store'],
      rows: [
        ['Listing', 'listing_id, host_id, lat/lng, price, amenities JSON', 'PostgreSQL + search index'],
        ['CalendarNight', 'listing_id, date, status (open/held/booked)', 'SQL or Redis for hot dates'],
        ['Booking', 'booking_id, guest_id, listing_id, check_in, check_out, status', 'PostgreSQL'],
        ['Payment', 'booking_id, auth_id, amount, status', 'Ledger / payment DB'],
      ],
    },
    {
      type: 'p',
      text: 'Avoid one row per night forever without pruning — archive past nights. For “next 18 months” availability, materialize nights or store ranges with exceptions. Ranges are compact; night rows make conflict checks trivial. Pick one and defend it.',
    },
    { type: 'h2', text: 'Search path' },
    {
      type: 'p',
      text: 'Guest query: city=Paris, check_in, check_out, guests=2. Search service queries geo + filters in Elasticsearch, then filters candidates that have open nights for the date range. Do not run calendar joins on every listing in Postgres at peak — denormalize a “available_from / available_to” hint or maintain a secondary availability index updated on calendar writes.',
    },
    {
      type: 'ul',
      items: [
        'Geo: geohash or geo_point queries for map viewport.',
        'Ranking: price, review score, host response rate, distance — keep ranking simple in interviews.',
        'Cache hot city landing pages in Redis/CDN for anonymous browse.',
        'Eventual consistency: new listing appears in search within seconds via async indexer ([Kafka](/system-design/message-queues-async-processing)).',
      ],
    },
    { type: 'h2', text: 'Booking and double-booking prevention' },
    {
      type: 'ol',
      items: [
        'Guest clicks Book → booking service starts a transaction or saga.',
        'Try to mark nights [check_in, check_out) as `held` with TTL (e.g. 10 minutes) for this booking_id.',
        'If any night already held/booked → fail with conflict.',
        'Authorize payment; on success flip nights to `booked` and booking to `confirmed`.',
        'On timeout or payment fail → release hold (TTL expiry job or explicit cancel).',
      ],
    },
    {
      type: 'p',
      text: 'Same pattern as [ticket booking](/system-design/design-ticket-booking-system): optimistic hold + payment + confirm. Use `SELECT … FOR UPDATE` on night rows, or a conditional update `WHERE status = open`. Redis SETNX per `listing:date` key works for hot listings if you accept Redis as source of truth for holds and sync to SQL.',
    },
    {
      type: 'callout',
      title: 'CAP choice',
      text: 'For inventory, prefer consistency over availability — better to show “unavailable” than double-book. Search can be AP. See [CAP theorem](/system-design/cap-theorem-consistency-models).',
    },
    { type: 'h2', text: 'Instant book vs host approval' },
    {
      type: 'p',
      text: 'Instant book: hold → pay → confirm in one flow. Request-to-book: create `pending_host` booking, notify host, hold nights with longer TTL (24h). Host accept triggers capture; decline releases hold and voids auth. State machine on booking status keeps the story clear on the whiteboard.',
    },
    { type: 'h2', text: 'Photos and media' },
    {
      type: 'p',
      text: 'Presigned upload to S3, async resize, CDN URLs on listing — copy the media pipeline from [file storage](/system-design/design-file-storage-dropbox) / Instagram. Listing pages are read-heavy; cache HTML fragments or JSON for popular listings.',
    },
    { type: 'h2', text: 'Scaling checklist' },
    {
      type: 'ul',
      items: [
        'Shard bookings by listing_id or booking_id ([sharding](/system-design/database-sharding-replication)).',
        'Search cluster separate from OLTP — never let Elasticsearch be the booking source of truth.',
        'Rate-limit scrapers on search ([rate limiter](/system-design/design-rate-limiter), [API gateway](/system-design/design-api-gateway)).',
        'Idempotency keys on CreateBooking so retries do not double-charge.',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'Guest searches Paris, Jun 10–12, 2 guests → ES returns listing L42.',
        'Calendar shows Jun 10 and 11 open.',
        'Book: hold both nights for booking B99, TTL 10 min.',
        'Payment auth succeeds → nights booked, B99 confirmed, host notified.',
        'Concurrent book on same nights fails at hold step — guest sees “dates taken.”',
      ],
    },
    { type: 'h2', text: 'Pricing and dynamic rates' },
    {
      type: 'p',
      text: 'MVP: fixed nightly price on the listing. Production: weekend premiums, seasonal rules, length-of-stay discounts. Keep a pricing service that returns a quote for (listing, dates) at book time and freeze that quote on the booking row — never re-price after payment auth. Dynamic pricing ML is optional depth; freeze-the-quote is the interview-safe rule.',
    },
    { type: 'h2', text: 'Trust and safety (short)' },
    {
      type: 'ul',
      items: [
        'ID verification and host/guest reviews after checkout.',
        'Messaging stays on-platform to detect scams ([chat](/system-design/design-chat-messaging)).',
        'Payouts to hosts on a delayed schedule after guest check-in (chargebacks).',
        'Fraud signals on new accounts — rate-limit listing creation.',
      ],
    },
    {
      type: 'p',
      text: 'Multi-region: pin booking writes to the listing’s home region to avoid split-brain calendars; replicate listings read-only elsewhere for search. Guests booking across regions accept slightly higher latency on confirm.',
    },
    { type: 'h2', text: 'Cancellations and refunds' },
    {
      type: 'p',
      text: 'Cancellation policy (flexible/moderate/strict) is metadata on the listing. Cancel transitions booking to `cancelled`, frees nights, and calls payment refund/void APIs with the same idempotency discipline as capture. Partial refunds for early checkout are ledger entries — point back to the [payment system](/system-design/design-payment-system) article rather than inventing accounting on the whiteboard.',
    },
    { type: 'h2', text: 'Interview narrative' },
    {
      type: 'p',
      text: 'Spend time on search vs booking consistency, the hold TTL, and payment authorize/capture. Mention marketplace trust (reviews, messaging) as secondary. Compare to pure [e-commerce](/system-design/design-ecommerce-shopping-cart): inventory is time-ranged, not SKU counts. That distinction shows you understand the problem.',
    },
  ],
}

export default article
