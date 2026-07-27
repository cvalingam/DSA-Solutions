import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-yelp-nearby-places',
  title: 'Design Yelp (Nearby Places / Local Search)',
  description:
    'How to design Yelp-style nearby search for interviews: geospatial indexing, geohashes, ranking, reviews, and scaling location-based queries.',
  readMinutes: 13,
  published: '2026-07-12',
  category: 'case-study',
  seoKeywords: [
    'Yelp system design',
    'nearby places system design interview',
    'geospatial index system design',
    'geohash local search architecture',
  ],
  sections: [
    {
      type: 'p',
      text: 'Yelp (or “find coffee near me”) is the classic geospatial interview. The hard part is not storing businesses - it is answering “points within radius R of (lat, lng), filtered by category, ranked by distance and rating” in tens of milliseconds. You will reuse geo ideas from [Uber](/system-design/design-ride-hailing-uber) but optimize for read-heavy discovery instead of real-time driver matching.',
    },
    {
      type: 'p',
      text: 'Start with the [framework](/system-design/how-to-approach-system-design-interviews): radius vs map viewport, whether live inventory (open now) matters, and review write volume vs search QPS.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Search businesses near a location with optional category and keyword.',
        'Return ranked list: distance, rating, relevance.',
        'Business detail page: hours, photos, reviews.',
        'Users write reviews and upload photos.',
        'Optional: autocomplete for business names ([typeahead](/system-design/design-typeahead-autocomplete)).',
      ],
    },
    { type: 'h2', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'Search p99 under ~100-150 ms.',
        'Freshness: new business visible within minutes; reviews near-real-time on detail page.',
        'Scale to tens of millions of businesses and high mobile QPS in dense cities.',
      ],
    },
    {
      type: 'callout',
      title: 'Dense cities are the stress test',
      text: 'Manhattan at lunch has more businesses per km² than rural Kansas. Index design must not scan the continent to find bagels on 5th Avenue.',
    },
    { type: 'h2', text: 'Capacity' },
    {
      type: 'p',
      text: '50M businesses, 5K search QPS peak, average result set 20. Reviews: 1M/day. Photos via S3/CDN like [Instagram](/system-design/design-instagram-photo-sharing). Search is the bottleneck; writes are smaller but must invalidate or update geo indexes.',
    },
    { type: 'h2', text: 'Geospatial indexing options' },
    {
      type: 'table',
      headers: ['Approach', 'Idea', 'Trade-off'],
      rows: [
        ['Geohash', 'Encode lat/lng as base32 string; nearby = shared prefix', 'Simple; edge cells need neighbor hashes'],
        ['Quadtree', 'Recursive subdivision of map', 'Good adaptive density; more complex'],
        ['Google S2 / Hilbert', 'Cell IDs on sphere', 'Production-grade; name it, do not implement'],
        ['PostGIS / ES geo', 'DB or Elasticsearch geo queries', 'Practical default in interviews'],
      ],
    },
    {
      type: 'p',
      text: 'Interview favorite: geohash. Choose precision so cell size ≈ search radius (e.g. ~1.2 km for precision 6). Query the cell containing the user plus 8 neighbors. Fetch candidates, filter exact Haversine distance client-side or in app, then rank. For map viewport, compute covering geohashes for the bounding box.',
    },
    { type: 'h2', text: 'Architecture' },
    {
      type: 'ol',
      items: [
        'Business service - metadata in PostgreSQL (business_id, name, category, lat, lng, hours).',
        'Geo index - Redis sets keyed by geohash → business_ids, or Elasticsearch geo_point index.',
        'Search / ranker - merge candidates, apply filters, score.',
        'Review service - append-only reviews; aggregate rating async.',
        'Media - S3 + CDN for photos.',
        'Cache - hot geohash result pages in Redis ([caching](/system-design/caching-fundamentals-for-interviews)).',
      ],
    },
    { type: 'h3', text: 'Why not SQL alone?' },
    {
      type: 'p',
      text: '`SELECT * FROM businesses WHERE lat BETWEEN … AND lng BETWEEN …` with a btree on lat fails at scale (lng filter still scans). Spatial indexes (GiST/SP-GiST, ES geo) or geohash buckets are required. See [SQL vs NoSQL](/system-design/sql-vs-nosql-for-interviews): OLTP for source of truth, specialized index for geo read path.',
    },
    { type: 'h2', text: 'Ranking' },
    {
      type: 'p',
      text: 'Score = f(distance, rating, review_count, text relevance, business response rate). Keep the formula simple: weighted sum. Personalization is a stretch. Never rank only by distance - a 4.9 café 200 m away beats a 2.0 café 50 m away for most products.',
    },
    {
      type: 'ul',
      items: [
        'Keyword: inverted index on name/category (same ideas as [search engine](/system-design/design-search-engine)).',
        'Category filter: term filter in ES or secondary index category → ids intersected with geo set.',
        '“Open now”: filter on hours; cache carefully around midnight boundaries in local TZ.',
      ],
    },
    { type: 'h2', text: 'Write path for reviews' },
    {
      type: 'ol',
      items: [
        'POST review → review DB; enqueue rating recompute.',
        'Worker updates business.avg_rating and review_count.',
        'Invalidate cache keys for that business and surrounding geohash pages.',
        'Moderate abuse async ([rate limits](/system-design/design-rate-limiter) on review create).',
      ],
    },
    { type: 'h2', text: 'Scaling tricks' },
    {
      type: 'ul',
      items: [
        'Shard geo index by geohash prefix or region ([sharding](/system-design/database-sharding-replication)).',
        'Precompute top businesses per popular geohash for anonymous homepage.',
        'CDN for static business photos; API for search JSON.',
        'Load-balance search tier ([load balancing](/system-design/load-balancing-and-scaling)).',
      ],
    },
    { type: 'h2', text: 'Edge cases' },
    {
      type: 'ul',
      items: [
        'International date line / poles - use a library; mention you would not hand-roll spherical math.',
        'Geohash boundaries - always include neighbors or results vanish at cell edges.',
        'Moving user - mobile refetches on significant location change; debounce.',
        'Duplicate listings - dedupe by place_id / address fingerprint.',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'User at (12.97, 77.59) searches “coffee” radius 1 km.',
        'Geohash precision 6 → cell tdr1u2 + 8 neighbors.',
        'Union business_ids from Redis sets; intersect with category=coffee.',
        'Compute distances; keep ≤ 1 km; sort by score; return top 20.',
        'Detail page loads reviews from review service; photos from CDN.',
      ],
    },
    { type: 'h2', text: 'Autocomplete and discovery' },
    {
      type: 'p',
      text: 'As the user types “piz”, hit a prefix index scoped to the current city or viewport - reuse [typeahead](/system-design/design-typeahead-autocomplete) with a geo filter. Popular queries (“best tacos near me”) can be cached as entire result lists keyed by coarse geohash + query hash.',
    },
    {
      type: 'table',
      headers: ['Layer', 'Store', 'Role'],
      rows: [
        ['Source of truth', 'PostgreSQL', 'Business rows, hours, owner'],
        ['Geo + text search', 'Elasticsearch', 'geo_point + filters + BM25'],
        ['Hot cache', 'Redis', 'Top results per geohash'],
        ['Media', 'S3 + CDN', 'Photos'],
      ],
    },
    {
      type: 'p',
      text: 'Fraudulent reviews and fake businesses need async moderation queues - not on the search critical path. Shadow-ban in the index by flipping an `is_visible` flag and reindexing.',
    },
    { type: 'h2', text: 'Map view vs list view' },
    {
      type: 'p',
      text: 'Map pinch-zoom changes the bounding box constantly. Debounce search requests (300 ms) and request only the delta of newly visible geohashes when possible. List view can page with `search_after` in Elasticsearch. Return lightweight pins (id, lat, lng, rating) for the map; hydrate cards on tap to cut payload size on mobile networks.',
    },
    { type: 'h2', text: 'Interview narrative' },
    {
      type: 'p',
      text: 'Lead with geohash + neighbors, then ranking, then review write path. Compare to Uber: Uber needs live locations updating every few seconds; Yelp businesses are mostly static coordinates. That comparison proves you pick indexes for the workload, not by buzzword.',
    },
  ],
}

export default article
