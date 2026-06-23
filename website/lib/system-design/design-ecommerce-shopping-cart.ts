import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-ecommerce-shopping-cart',
  title: 'Design an E-Commerce Platform (Amazon)',
  description:
    'System design for online shopping: product catalog, inventory, cart, checkout, order fulfillment, and scaling browse vs buy paths for interviews.',
  readMinutes: 12,
  published: '2026-06-27',
  category: 'case-study',
  seoKeywords: [
    'Amazon system design interview',
    'e-commerce architecture',
    'shopping cart system design',
    'inventory management interview',
  ],
  sections: [
    {
      type: 'p',
      text: 'E-commerce interviews blend read-heavy catalog browsing with write-heavy checkout that must not oversell inventory. Amazon-scale sounds scary; mid-level loops usually want product search, cart, order placement, and how browse and buy paths differ. Use the [framework](/system-design/how-to-approach-system-design-interviews) and connect to [payments](/system-design/design-payment-system), [search](/system-design/design-search-engine), and [distributed cache](/system-design/design-distributed-cache-redis).',
    },
    { type: 'h2', text: 'Requirements' },
    { type: 'h3', text: 'Functional' },
    {
      type: 'ul',
      items: [
        'Browse products by category; search by keyword; view detail page.',
        'Add to cart; update quantity; checkout with shipping address.',
        'Place order; decrement inventory; charge payment.',
        'Order history and order status tracking.',
      ],
    },
    { type: 'h3', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        '100M products, 50M DAU, Black Friday 10× traffic spike.',
        'Browse p99 under 300 ms; checkout must not oversell (inventory accuracy).',
        'Cart can be anonymous (session) or logged-in.',
        'Eventual consistency OK for product reviews; not for inventory at checkout.',
      ],
    },
    {
      type: 'callout',
      title: 'Scope marketplace vs retail',
      text: 'Marketplace (third-party sellers) adds seller inventory partitions and split payouts. Retail-only (Amazon 1P) simplifies to one inventory table per SKU. Ask which model to design.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'table',
      headers: ['Component', 'Role'],
      rows: [
        ['Product catalog service', 'SKU metadata, images, price (read-heavy)'],
        ['Search ([search engine](/system-design/design-search-engine))', 'Elasticsearch index of catalog'],
        ['Cart service (Redis)', 'session_id / user_id → line items'],
        ['Inventory service', 'Available quantity per SKU; reserve on checkout'],
        ['Order service', 'Create order, orchestrate payment + fulfillment'],
        ['Payment service', 'Charge card ([payment design](/system-design/design-payment-system))'],
        ['Notification', 'Order confirmation email'],
      ],
    },
    { type: 'h2', text: 'Browse path (read-heavy)' },
    {
      type: 'p',
      text: 'Product detail served from [cache](/system-design/caching-fundamentals-for-interviews) — CDN for images, Redis for JSON catalog rows. Category browse uses denormalized lists or search filters. Price may change — short TTL (60 sec) or version field on cache entry. [Load balancer](/system-design/load-balancing-and-scaling) scales stateless API tier horizontally. Database: PostgreSQL or Dynamo for catalog; [sharding](/system-design/database-sharding-replication) by product_id at billion-SKU scale.',
    },
    { type: 'h2', text: 'Cart' },
    {
      type: 'p',
      text: 'Cart is ephemeral: `cart:{user_id}` hash in Redis — `sku_id → { qty, price_snapshot }`. No inventory reservation in cart (Amazon model) — reservation happens at checkout. Anonymous carts keyed by session cookie; merge on login. TTL 30 days for logged-in users. Cart writes are cheap; losing Redis loses carts — acceptable vs losing orders.',
    },
    { type: 'h2', text: 'Checkout and inventory' },
    {
      type: 'ol',
      items: [
        'POST /checkout — validate cart SKUs still active and priced.',
        'Inventory: `UPDATE inventory SET reserved = reserved + ? WHERE sku_id = ? AND quantity - reserved >= ?` in transaction.',
        'If any SKU fails, abort entire checkout (all-or-nothing).',
        'Create order row status=PENDING_PAYMENT; call payment authorize.',
        'On payment success: order=CONFIRMED, reserved→sold; on failure: release reservation.',
        'Publish order event to [Kafka](/system-design/message-queues-async-processing) for warehouse fulfillment.',
      ],
    },
    {
      type: 'p',
      text: 'Overselling is the failure mode interviewers probe. Row-level lock or atomic UPDATE on inventory — same pattern as [ticket booking](/system-design/design-ticket-booking-system). Do not cache inventory counts for checkout writes.',
    },
    { type: 'h2', text: 'Order service and sagas' },
    {
      type: 'p',
      text: 'Checkout spans inventory, payment, and shipping label — classic saga. Happy path: single orchestrated flow. Payment timeout: compensating transaction releases inventory reservation. Use idempotency key on `POST /checkout` so retry does not double-order ([unique IDs](/system-design/design-unique-id-generator)). Order state machine: PENDING_PAYMENT → CONFIRMED → SHIPPED → DELIVERED.',
    },
    { type: 'h2', text: 'Search and recommendations' },
    {
      type: 'p',
      text: 'Catalog search mirrors [search engine](/system-design/design-search-engine) design: inverted index on title, brand, attributes. Autocomplete on product names ([typeahead](/system-design/design-typeahead-autocomplete)). Recommendations ("customers also bought") precomputed offline into Redis feature store — not on checkout critical path.',
    },
    { type: 'h2', text: 'Data model sketch' },
    {
      type: 'ul',
      items: [
        'products: sku_id, title, description, price_cents, category_id',
        'inventory: sku_id, warehouse_id, quantity, reserved',
        'orders: order_id, user_id, status, total, payment_id, created_at',
        'order_items: order_id, sku_id, qty, price_at_purchase',
        'carts: Redis only — not durable SQL',
      ],
    },
    { type: 'h2', text: 'Capacity estimation' },
    {
      type: 'p',
      text: '100M SKUs × 2 KB metadata ≈ 200 GB catalog — fits sharded SQL with aggressive caching. 1M orders/day ≈ 12 order writes/sec average (500/sec peak on Black Friday) — modest for PostgreSQL. Browse 50M DAU × 20 page views × 5 KB ≈ 5 TB/day CDN traffic if uncached — cache product pages at edge. Black Friday: queue checkout if inventory service saturates ([rate limiter](/system-design/design-rate-limiter)).',
    },
    { type: 'h2', text: 'Failure modes' },
    {
      type: 'table',
      headers: ['Failure', 'Mitigation'],
      rows: [
        ['Payment charged but order not saved', 'Reconciliation job; idempotent order create by payment_id'],
        ['Inventory reserved, payment fails', 'TTL on reservation; sweeper releases stock'],
        ['Stale price in cart', 'Re-price at checkout; show user delta'],
        ['Hot SKU flash sale', 'Queue + per-user purchase limit; same as ticketing'],
        ['Search index lag', 'New products hidden until indexed; OK for minutes'],
      ],
    },
    { type: 'h2', text: 'API sketch' },
    {
      type: 'ul',
      items: [
        'GET /products/{sku} — detail (cached)',
        'GET /search?q= — Elasticsearch',
        'POST /cart/items — add SKU',
        'POST /checkout — idempotency-key header required',
        'GET /orders/{id} — status',
      ],
    },
    { type: 'h2', text: 'Sample opening (first three minutes)' },
    {
      type: 'p',
      text: 'Interviewer: "Design Amazon." You: "I will separate browse — cached catalog and search — from checkout — transactional inventory and payment. Cart lives in Redis without reservation. Checkout atomically reserves stock, charges payment with idempotency, and emits fulfillment events. I will clarify marketplace scope and estimate read vs write QPS."',
    },
    { type: 'h2', text: 'Warehouse fulfillment (async)' },
    {
      type: 'p',
      text: 'After order CONFIRMED, warehouse service consumes Kafka event, picks nearest fulfillment centre with stock, prints label, updates tracking. User sees SHIPPED via polling or push [notification](/system-design/design-notification-system). Returns flow increments inventory when item received — separate reverse saga. None of this blocks checkout latency.',
    },
    { type: 'h2', text: 'Reviews and ratings' },
    {
      type: 'p',
      text: 'Product reviews are write-rare, read-often — eventual consistency fine. Aggregate rating updated async from review stream; detail page shows cached 4.3 stars with minutes of lag. Do not couple review writes to purchase transaction.',
    },
    { type: 'h2', text: 'What to say in the last five minutes' },
    {
      type: 'p',
      text: 'Close with: "Cached catalog and Elasticsearch for browse, Redis cart, SQL inventory reservation at checkout, idempotent payment, Kafka to warehouse." Draw the read/write split on the board.',
    },
    { type: 'h2', text: 'Mock interview checklist' },
    {
      type: 'ol',
      items: [
        'Split read path (cache, CDN, search) from write path (inventory, orders).',
        'Explained cart in Redis vs inventory in SQL.',
        'Described atomic inventory decrement / reservation.',
        'Mentioned idempotent checkout and payment saga.',
        'Addressed flash sale / hot SKU contention.',
      ],
    },
    { type: 'h2', text: 'Closing summary' },
    {
      type: 'p',
      text: 'E-commerce is two systems glued together: a fast catalog and a careful checkout. Nail inventory atomicity and payment idempotency — everything else is caching and search you have already practised on this site.',
    },
  ],
}

export default article
