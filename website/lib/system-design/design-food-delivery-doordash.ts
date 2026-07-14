import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-food-delivery-doordash',
  title: 'Design a Food Delivery App (DoorDash)',
  description:
    'How to design DoorDash / Uber Eats for interviews: restaurant catalog, cart and checkout, courier dispatch, ETA, live tracking, and peak-hour scaling.',
  readMinutes: 13,
  published: '2026-07-14',
  category: 'case-study',
  seoKeywords: [
    'DoorDash system design',
    'food delivery system design interview',
    'Uber Eats architecture',
    'courier dispatch system design',
  ],
  sections: [
    {
      type: 'p',
      text: 'Food delivery sits between [Uber ride hailing](/system-design/design-ride-hailing-uber) and [e-commerce](/system-design/design-ecommerce-shopping-cart). You still match supply and demand in space and time, but the “trip” includes a restaurant prep constraint, a multi-stop courier sometimes, and a cart/checkout that looks like shopping. Interviewers listen for dispatch + ETA + order state machine — not a generic microservice collage.',
    },
    {
      type: 'p',
      text: 'Scope via the [framework](/system-design/how-to-approach-system-design-interviews): one metro, customers/restaurants/couriers, place order → deliver. Defer grocery, group orders, and ads. Payments can be a black box pointing at the [payment](/system-design/design-payment-system) article.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Browse nearby restaurants and menus; search dishes.',
        'Cart, coupons, checkout; place order.',
        'Restaurant accepts/rejects; updates prep status.',
        'Dispatch courier; live track delivery.',
        'Ratings, order history, basic support hooks.',
        'Optional: batching two orders to one courier (mention as optimization).',
      ],
    },
    { type: 'h2', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'Order placement P99 under a second.',
        'Location updates every few seconds during active delivery.',
        'Correctness on order state — no double charge, no lost orders.',
        'Lunch/dinner peaks 5–10× baseline; degrade discovery before breaking checkout.',
        'Geo accuracy good enough for ETA, not military GPS.',
      ],
    },
    {
      type: 'callout',
      title: 'Three-sided marketplace',
      text: 'Optimize for customer ETA, restaurant idle time, and courier utilization together. A design that only minimizes customer wait will starve restaurants or burn couriers — say that out loud.',
    },
    { type: 'h2', text: 'Capacity sketch' },
    {
      type: 'p',
      text: 'City-scale: 50K active customers at dinner, 5K restaurants, 3K couriers online. Order rate ~200/sec peak in one region. Courier location updates at 0.2–1 Hz → few thousand points/sec — fine for Kafka + spatial index, similar order of magnitude to Uber’s location stream but with stickier “assignments.”',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'ol',
      items: [
        'Catalog / discovery — restaurants, menus, hours; geo query ([Yelp-like](/system-design/design-yelp-nearby-places)).',
        'Cart & order service — cart lines, pricing snapshot, order state machine.',
        'Payment service — authorize on place, capture on handoff/delivery.',
        'Restaurant device API — accept, mark ready.',
        'Dispatch service — match order to courier with constraints.',
        'Location & ETA — courier GPS stream, traffic-aware ETA ([maps](/system-design/design-google-maps) ideas).',
        'Tracking — WebSocket/push to customer app.',
        'Notifications — SMS/push on status changes.',
      ],
    },
    { type: 'h2', text: 'Order state machine' },
    {
      type: 'ol',
      items: [
        'CREATED → PAYMENT_AUTHORIZED → SENT_TO_RESTAURANT.',
        'ACCEPTED → PREPARING → READY_FOR_PICKUP.',
        'COURIER_ASSIGNED → PICKED_UP → DELIVERED.',
        'Terminal: CANCELED / FAILED with refunds rules.',
      ],
    },
    {
      type: 'p',
      text: 'Persist every transition with timestamps. Couriers and restaurants should not invent states client-side — servers own the machine. Idempotent status webhooks prevent double transitions when mobile networks flake.',
    },
    { type: 'h2', text: 'Data model' },
    {
      type: 'table',
      headers: ['Data', 'Store', 'Notes'],
      rows: [
        ['Restaurant / menu', 'SQL', 'Versioned prices; snapshot into order lines'],
        ['Orders', 'SQL shard by city or order_id', 'State + totals; strong writes'],
        ['Courier session', 'Redis + SQL', 'Online flag, current order_id'],
        ['Location points', 'Redis geo / Kafka', 'Hot ephemeral; sample to warehouse'],
        ['Ratings', 'SQL', 'Async, not on critical path'],
      ],
    },
    { type: 'h2', text: 'Discovery and cart' },
    {
      type: 'p',
      text: 'Geohash or quadtree for “open restaurants near me,” then rank by ETA, rating, and promo. Cache menu reads aggressively ([caching](/system-design/caching-fundamentals-for-interviews)); invalidate on restaurant edits. Cart holds price snapshots so a menu change mid-checkout does not silently change the charged amount — same lesson as ticket holds.',
    },
    { type: 'h2', text: 'Dispatch' },
    {
      type: 'ol',
      items: [
        'When order is ACCEPTED (or earlier, predictively), build a courier candidate set in a radius.',
        'Score by distance to restaurant, active load, vehicle type, batching potential.',
        'Offer to top courier with a short timeout; on decline/timeout, try next (or broadcast with fencing).',
        'On accept, lock assignment with a [distributed lock](/system-design/design-distributed-lock) or conditional update so two orders do not claim the same courier slot incorrectly.',
      ],
    },
    {
      type: 'p',
      text: 'Unlike Uber’s continuous matching, food dispatch often waits until prep is underway so couriers do not idle at the door. Mention predictive dispatch as a stretch: start the courier just in time for READY_FOR_PICKUP.',
    },
    { type: 'h2', text: 'ETA and tracking' },
    {
      type: 'p',
      text: 'ETA = restaurant prep estimate + courier travel to restaurant + travel to customer, with traffic. Prep time from historical ML or restaurant-provided estimates. Push GPS to customers throttled (every 5–10 s) to save battery and bandwidth. Map tiles and routing can be delegated to a maps provider — do not build a full Google Maps unless asked.',
    },
    { type: 'h2', text: 'Scaling peaks' },
    {
      type: 'ul',
      items: [
        'Shard by city/region — lunch in NYC should not contend with SF databases ([sharding](/system-design/database-sharding-replication)).',
        'Queue restaurant accept notifications; never lose an order on push failure (retry via [queues](/system-design/message-queues-async-processing)).',
        'Read replicas for browse; primary for place-order.',
        'If dispatch is overloaded, widen search radius or fall back to sequential assignment — keep placing orders.',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'User adds tacos, checks out; payment authorized; order O99 created.',
        'Restaurant accepts; prep ETA 15 min; dispatch schedules courier for minute 12.',
        'Courier C7 accepts offer; tracks to restaurant; marks picked up.',
        'Customer watches C7 on map; delivery confirmed; payment captured; rating prompt.',
      ],
    },
    { type: 'h2', text: 'Interview narrative' },
    {
      type: 'p',
      text: 'Emphasize three-sided flow and the order state machine. Contrast with Uber (no restaurant prep) and e-commerce (no live courier). Draw discovery → order → dispatch → track, and keep payments as a dependency box. That is the DoorDash interview in one clean story.',
    },
  ],
}

export default article
