import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-google-maps',
  title: 'Design Google Maps (Navigation & Places)',
  description:
    'How to design Google Maps for interviews: map tiles, geospatial indexing, routing/ETA, traffic updates, and place search at global scale.',
  readMinutes: 14,
  published: '2026-07-15',
  category: 'case-study',
  seoKeywords: [
    'Google Maps system design',
    'navigation system design interview',
    'map tile architecture',
    'routing ETA system design',
  ],
  sections: [
    {
      type: 'p',
      text: 'Google Maps combines three products: a slippy map of tiles, a places directory like [Yelp](/system-design/design-yelp-nearby-places), and a routing engine that turns “home to airport” into turn-by-turn guidance with live traffic. Interviewers rarely expect you to invent A* from scratch - they want tile CDNs, geo indexes, and a sane split between static road graph and dynamic traffic.',
    },
    {
      type: 'p',
      text: 'Scope with the [framework](/system-design/how-to-approach-system-design-interviews): navigation only vs also place search; car vs multi-modal; whether offline maps matter.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Render maps at multiple zoom levels; pan/zoom smoothly.',
        'Search places and addresses; show details and reviews.',
        'Compute route A→B with ETA; reroute on deviation.',
        'Show live traffic coloring on major roads.',
        'Optional: Street View, transit - acknowledge as phase 2.',
      ],
    },
    { type: 'h2', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'Tile fetch p99 under ~100 ms from CDN.',
        'Route response under ~500 ms for city-scale trips.',
        'Fresh traffic within a few minutes; not millisecond-perfect.',
        'Global coverage - shard data by region.',
      ],
    },
    {
      type: 'callout',
      title: 'Static vs dynamic',
      text: 'Road geometry changes slowly (weeks). Traffic changes by the minute. Keep the base graph immutable in a release; overlay live speeds as a separate feed.',
    },
    { type: 'h2', text: 'Map tiles' },
    {
      type: 'p',
      text: 'The world is cut into square tiles at zoom levels 0…N (Web Mercator). Client requests `/{z}/{x}/{y}.pbf` or PNG. Pre-render or serve vector tiles from object storage + CDN - same edge story as [Instagram](/system-design/design-instagram-photo-sharing) images. Vector tiles are smaller and styleable on device; raster is simpler to explain.',
    },
    {
      type: 'ul',
      items: [
        'Popular city tiles stay hot in CDN; oceans are cold.',
        'Version tiles (`v2026.07`) so clients can cache aggressively.',
        'Never generate tiles on the request path at peak - batch pipeline.',
      ],
    },
    { type: 'h2', text: 'Places and geocoding' },
    {
      type: 'p',
      text: 'Reuse geohash / S2 / Elasticsearch geo from the [Yelp design](/system-design/design-yelp-nearby-places). Geocoding (“221B Baker St”) is a specialized search index: address tokens → lat/lng. Reverse geocoding snaps a GPS point to the nearest road segment using a spatial index on the road network.',
    },
    { type: 'h2', text: 'Road graph and routing' },
    {
      type: 'table',
      headers: ['Concept', 'Role'],
      rows: [
        ['Node', 'Intersection / endpoint'],
        ['Edge', 'Road segment with length, speed limit, one-way flag'],
        ['Weight', 'Travel time ≈ length / effective_speed'],
        ['Hierarchy', 'Highways contracted for long routes (CH / HL)'],
      ],
    },
    {
      type: 'p',
      text: 'For interviews: Dijkstra or A* on a regional subgraph is enough. Mention contraction hierarchies or hub labeling as “how production gets cross-country routes fast” without implementing them. Preload the graph for a metro area into memory on routing servers; shard servers by geohash/region.',
    },
    { type: 'h2', text: 'Traffic and ETA' },
    {
      type: 'ol',
      items: [
        'Phones that opted in send anonymized speed samples (or probe from fleet partners).',
        'Aggregate per road_segment_id in a streaming job (Kafka → Flink).',
        'Publish effective_speed to a traffic KV store keyed by segment.',
        'Routing service reads live speeds when weighting edges; falls back to free-flow speed.',
      ],
    },
    {
      type: 'p',
      text: 'ETA = sum of segment times on the chosen path ± uncertainty. Reroute when GPS leaves the corridor or traffic spikes on the remaining path. Client sends location every few seconds - similar presence chatter to [chat](/system-design/design-chat-messaging) but to a location service, not a message bus for everyone.',
    },
    { type: 'h2', text: 'Architecture diagram (verbal)' },
    {
      type: 'ol',
      items: [
        'Tile CDN + object storage.',
        'Places / geocode search cluster.',
        'Routing service fleet with in-memory graphs per region.',
        'Traffic pipeline: probes → stream processor → segment speed cache.',
        'Directions API behind [API gateway](/system-design/design-api-gateway) with [rate limits](/system-design/design-rate-limiter).',
      ],
    },
    { type: 'h2', text: 'Scaling' },
    {
      type: 'ul',
      items: [
        'Partition planet into regions; route within region or stitch at boundaries.',
        '[Load-balance](/system-design/load-balancing-and-scaling) routing pods; sticky not required if graph is replicated.',
        'Cache popular A→B directions for a short TTL (airport ↔ downtown).',
        'Offline packs: download regional tiles + graph subset for airplanes/mode.',
      ],
    },
    { type: 'h2', text: 'Privacy' },
    {
      type: 'p',
      text: 'Location is sensitive. Aggregate probes, snap to roads, drop raw trails quickly, and let users opt out. Say this aloud - it signals product maturity beyond boxes and arrows.',
    },
    { type: 'h2', text: 'Client rendering tips' },
    {
      type: 'p',
      text: 'Mobile clients request only visible tile IDs, prefetch neighbors while panning, and cancel in-flight fetches when the camera jumps. Polyline simplification (Douglas-Peucker) keeps route overlays light. These details show you have shipped map UIs, not only drawn CDNs.',
    },
    {
      type: 'table',
      headers: ['API', 'Owner service'],
      rows: [
        ['GET /tiles/{z}/{x}/{y}', 'Tile CDN'],
        ['GET /geocode', 'Places / search'],
        ['POST /directions', 'Routing'],
        ['GET /traffic/{region}', 'Traffic edge cache'],
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'User searches “coffee near me” → places geo query returns pins on vector tiles.',
        'User taps Directions to a café 2 km away.',
        'Routing service loads city graph, weights edges with live traffic KV, runs A*.',
        'Returns polyline + ETA 9 minutes; client follows GPS and requests reroute if off-path.',
      ],
    },
    { type: 'h2', text: 'Interview summary' },
    {
      type: 'p',
      text: 'Separate tiles, places, and routing. Static graph + dynamic traffic overlay. CDN for tiles, geo index for places, in-memory graph shards for routes. Compare to Uber: Uber optimizes matching drivers; Maps optimizes pathfinding on a mostly static network with a live speed seasoning.',
    },
  ],
}

export default article
