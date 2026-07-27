import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-ride-hailing-uber',
  title: 'Design a Ride Hailing System (Uber / Lyft)',
  description:
    'System design for ride matching: geospatial indexing, ETA, surge pricing, trip state machine, and real-time location for interview prep.',
  readMinutes: 12,
  published: '2026-06-22',
  category: 'case-study',
  seoKeywords: ['Uber system design', 'ride hailing architecture', 'geospatial matching interview'],
  sections: [
    {
      type: 'p',
      text: 'Ride hailing connects riders and drivers in real time. The interview tests geospatial queries, state machines, and [WebSocket](/system-design/design-chat-messaging)-style location updates - not just CRUD. Clarify with the [framework](/system-design/how-to-approach-system-design-interviews): city-level launch vs global, and whether you need pooling or food delivery on the same platform.',
    },
    { type: 'h2', text: 'Requirements' },
    { type: 'h3', text: 'Functional' },
    {
      type: 'ul',
      items: [
        'Rider requests trip: pickup, dropoff, ride type.',
        'Match nearby available drivers; rider accepts ETA and price.',
        'Live trip tracking: driver location on map until dropoff.',
        'Payment settle at end; rating both ways.',
        'Driver goes online/offline; accept or decline offers.',
      ],
    },
    { type: 'h3', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'Match driver within 30 seconds in dense cities.',
        'Location updates every 3-5 seconds during active trip.',
        '1M daily trips; 100K concurrent drivers in peak city.',
        'Strong consistency for trip state and payment - no double charge.',
      ],
    },
    {
      type: 'callout',
      title: 'Clarify matching',
      text: 'Greedy nearest driver is v1. Pooling, scheduled rides, and multi-stop are v2. Say which you defer.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'table',
      headers: ['Component', 'Role'],
      rows: [
        ['Trip service', 'Create trip, state machine, pricing quote'],
        ['Matching service', 'Find drivers in radius; dispatch offers'],
        ['Location service', 'Ingest GPS; index driver positions (Redis GEO / geohash)'],
        ['WebSocket / push gateway', 'Bidirectional rider and driver updates'],
        ['Payment service', 'Authorize at request, capture at completion'],
        ['Notification service', 'Driver offer push, rider ETA ([notifications](/system-design/design-notification-system))'],
        ['Trip DB (PostgreSQL)', 'Trips, statuses, fare breakdown'],
      ],
    },
    { type: 'h2', text: 'Trip state machine' },
    {
      type: 'ol',
      items: [
        'REQUESTED → rider submits; quote returned.',
        'MATCHING → matching service searches drivers.',
        'DRIVER_ASSIGNED → driver accepted; rider notified.',
        'DRIVER_ARRIVED → geofence at pickup.',
        'IN_PROGRESS → rider picked up.',
        'COMPLETED → payment captured; ratings.',
        'CANCELLED - by rider or driver with policy rules.',
      ],
    },
    {
      type: 'p',
      text: 'Store state transitions with timestamps. Use optimistic locking or row version to prevent double-accept. Payment uses [idempotency keys](/system-design/design-unique-id-generator) on capture.',
    },
    { type: 'h2', text: 'Geospatial matching' },
    {
      type: 'p',
      text: 'Drivers heartbeat location to Location service every few seconds when online. Index with Redis GEOADD or geohash grid: query GEORADIUS pickup lat/lng, 3 km, LIMIT 20. Filter by vehicle type and not already on trip. Rank by ETA (road network API or distance heuristic). Send offer to top 3 drivers serially or in parallel with 15s timeout - first accept wins.',
    },
    { type: 'h2', text: 'Pricing and surge' },
    {
      type: 'p',
      text: 'Base fare + per-mile + per-minute. Surge multiplier when demand/supply ratio in geohash cell exceeds threshold (computed every minute from open requests vs idle drivers). Quote locked at request time for rider transparency. Surge is hot-path [cache](/system-design/caching-fundamentals-for-interviews) per cell.',
    },
    { type: 'h2', text: 'Real-time location path' },
    {
      type: 'p',
      text: 'Driver app → WebSocket to gateway → Location service → Redis GEO update. Active trip: fan-out driver position to rider subscription on same trip_id channel. Do not write every GPS point to Postgres - stream to Redis; archive trip polyline to object storage after completion for disputes.',
    },
    { type: 'h2', text: 'Capacity estimation' },
    {
      type: 'p',
      text: '100K concurrent drivers × 1 update/4 sec ≈ 25K location writes/sec - Redis cluster handles this. 50K active trips × 2 WebSocket clients ≈ 100K connections on gateway fleet behind [load balancer](/system-design/load-balancing-and-scaling). Matching: 5K new requests/min in peak city × 3 driver pings each ≈ 15K offer notifications/min - async via push queue.',
    },
    { type: 'h2', text: 'Failure modes' },
    {
      type: 'table',
      headers: ['Failure', 'Mitigation'],
      rows: [
        ['No drivers in radius', 'Expand radius; increase surge; retry'],
        ['Driver ignores offer', 'Timeout; offer next driver'],
        ['Payment capture fails', 'Retry; flag account; support workflow'],
        ['Location stream gap', 'Last-known position; interpolate briefly'],
        ['Split-brain double assign', 'DB transaction + unique constraint on driver active trip'],
      ],
    },
    { type: 'h2', text: 'API sketch' },
    {
      type: 'table',
      headers: ['Endpoint', 'Purpose'],
      rows: [
        ['POST /v1/trips', 'Request ride; returns quote and trip_id'],
        ['POST /v1/trips/{id}/cancel', 'Cancel with policy fee'],
        ['GET /v1/trips/{id}', 'Status and driver info'],
        ['WS /v1/stream?trip_id=', 'Live location and status events'],
        ['POST /v1/drivers/location', 'Heartbeat lat/lng when online'],
      ],
    },
    { type: 'h2', text: 'Matching flow step by step' },
    {
      type: 'ol',
      items: [
        'Rider POST /trips with pickup, dropoff, payment method.',
        'Trip service validates; payment service auth hold for estimate.',
        'Matching service queries Redis GEO within 3 km; filters online + correct vehicle.',
        'Push offer to driver app with 15s TTL.',
        'Driver accept → atomic update trip + driver busy flag.',
        'WebSocket streams driver ETA and location to rider.',
        'Trip completes → capture payment ([payment system](/system-design/design-payment-system) pattern).',
      ],
    },
    { type: 'h2', text: 'Data model sketch' },
    {
      type: 'ul',
      items: [
        'trips: id, rider_id, driver_id, status, pickup, dropoff, fare, surge_multiplier',
        'drivers: id, vehicle_type, online, current_trip_id',
        'driver_locations: Redis GEO - not long-term Postgres rows',
        'trip_events: append-only status transitions for audit',
      ],
    },
    { type: 'h2', text: 'Cancellation and disputes' },
    {
      type: 'p',
      text: 'Rider cancel before assign: no fee. After driver en route: cancellation fee to driver. Driver no-show vs rider no-show use geofence timestamps. Trip polyline in S3 for fare dispute. All policy rules in config service - not hardcoded in app.',
    },
    { type: 'h2', text: 'Latency budget' },
    {
      type: 'table',
      headers: ['Path', 'Target'],
      rows: [
        ['Request trip + quote', '< 300ms'],
        ['Match + first offer sent', '< 5s p99'],
        ['Location update to rider map', '< 2s end-to-end'],
        ['Payment capture on complete', '< 3s'],
      ],
    },
    { type: 'h2', text: 'What to say in the last five minutes' },
    {
      type: 'p',
      text: 'Summarise: Redis GEO matching, trip state machine in Postgres, WebSocket location fan-out, surge in cache, payment auth/capture with idempotency. Defer pooling and multi-region to v2.',
    },
    { type: 'h2', text: 'Sample opening (first three minutes)' },
    {
      type: 'p',
      text: 'Interviewer: "Design Uber." You: "Rider requests a trip; I match an available driver nearby using a geospatial index, track both parties over WebSockets, and run a trip state machine through payment. I will assume one city at first, greedy matching, and separate services for location, matching, trips, and payments with idempotent capture at the end."',
    },
    { type: 'h2', text: 'Geohash grid detail' },
    {
      type: 'p',
      text: 'Geohash encodes lat/lng into a string prefix - nearby locations share prefix. Store drivers in cells; query pickup cell and 8 neighbors. Finer precision for dense downtown, coarser for suburbs (configurable). Alternative: Redis GEOADD is simpler in interviews - same concept, less math on the whiteboard.',
    },
    { type: 'h2', text: 'Multi-region and maps' },
    {
      type: 'p',
      text: 'City-level deployment first: all matching in one region for low latency. ETA uses routing API (Google/OSRM) cached by (origin_cell, dest_cell) pairs. Map tiles are CDN - out of scope unless interviewer asks. [Database sharding](/system-design/database-sharding-replication) by city_id if trip history grows large.',
    },
    { type: 'h2', text: 'Driver supply incentives' },
    {
      type: 'p',
      text: 'Surge is demand-side pricing; heatmaps push drivers toward high-demand zones (optional v2). Mention as product layer on top of location index - not required for core design pass.',
    },
    { type: 'h2', text: 'Pooling and scheduled rides (v2)' },
    {
      type: 'p',
      text: 'Pooling matches multiple riders on overlapping routes - harder matching NP-hard heuristic. Scheduled rides pre-assign drivers 30 min ahead. Defer unless interviewer insists; mention as future complexity on top of core state machine.',
    },
    { type: 'h2', text: 'Observability' },
    {
      type: 'ul',
      items: [
        'Metrics: match time p99, cancel rate, active WebSocket connections.',
        'Traces: trip_id across matching, payment, notification.',
        'Alerts: payment capture failure spike, Redis GEO lag.',
      ],
    },
    { type: 'h2', text: 'ETA and routing cache' },
    {
      type: 'p',
      text: 'Road network ETA is expensive - cache by rounded pickup/dropoff geohash pairs for 5 minutes. Fallback: haversine distance ÷ average city speed for matching rank only. Refresh ETA every 30s during trip from live driver position. Rider sees "3 min away" from cached route polyline progress.',
    },
    { type: 'h2', text: 'Trust and safety (brief)' },
    {
      type: 'p',
      text: 'Share trip with contacts, masked phone numbers between rider and driver, and SOS button route to ops. Trip_id links all events for support. Out of core matching design but worth one sentence in senior interviews.',
    },
    { type: 'h2', text: 'Mock interview checklist' },
    {
      type: 'ol',
      items: [
        'Drew trip state machine with clear transitions.',
        'Explained geospatial index and driver search radius.',
        'Separated location hot path from trip metadata DB.',
        'Mentioned surge pricing and quote at request time.',
        'Named WebSocket fan-out and payment idempotency.',
      ],
    },
    { type: 'h2', text: 'Closing summary' },
    {
      type: 'p',
      text: 'Ride hailing is real-time matching plus a strict trip state machine. Nail geospatial search, location streaming, and payment capture - the rest is product features on top.',
    },
  ],
}

export default article
