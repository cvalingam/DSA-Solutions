import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-spotify-music-streaming',
  title: 'Design Spotify (Music Streaming)',
  description:
    'How to design Spotify for interviews: music catalog, audio CDN delivery, playlists, search, recommendations sketch, and scaling play-count writes.',
  readMinutes: 13,
  published: '2026-07-14',
  category: 'case-study',
  seoKeywords: [
    'Spotify system design',
    'music streaming system design interview',
    'audio streaming architecture',
    'playlist system design',
  ],
  sections: [
    {
      type: 'p',
      text: 'Spotify looks like [Netflix](/system-design/design-video-streaming-netflix) until you zoom in. Audio files are smaller, sessions are longer and more interactive (skip, shuffle, offline), and the social layer (playlists, follows) matters as much as playback. Interviewers use it to test CDN delivery plus a write-heavy “now playing / play count” path without drowning in ML ranking detail.',
    },
    {
      type: 'p',
      text: 'Open with the [framework](/system-design/how-to-approach-system-design-interviews): clarify free vs premium, offline downloads, and whether recommendations are in scope. Most rounds want catalog + stream + playlist; treat Discover Weekly as a stretch.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Browse and search songs, albums, artists.',
        'Stream audio with low startup latency; pause/seek/skip.',
        'Create and edit playlists; follow artists/users.',
        'Record plays for history and charts.',
        'Optional: offline download, lyrics, podcasts (mention, do not build).',
      ],
    },
    { type: 'h2', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'Time-to-first-byte under ~200 ms for popular tracks via CDN.',
        'Availability over perfect consistency on play counts.',
        'Handle flash crowds when a new album drops.',
        'DRM / licensed delivery - acknowledge without designing Widevine.',
      ],
    },
    {
      type: 'callout',
      title: 'Audio vs video',
      text: 'A 3-minute song at 160 kbps is about 3.6 MB (160×180/8 ≈ 3600 KB) - tiny next to a 4K movie. You still need CDN and adaptive bitrate (e.g. 96/160/320 kbps), but transcoding cost and storage math are kinder than Netflix.',
    },
    { type: 'h2', text: 'Capacity sketch' },
    {
      type: 'p',
      text: 'Assume 100M songs, 500M users, 50M concurrent streams peak. Average song 5 MB × 3 bitrates ≈ 1.5 PB catalog before replication. Play events: if 10M concurrent users skip every 3 minutes, that is ~50K events/sec - perfect for [Kafka](/system-design/message-queues-async-processing), not for synchronous SQL updates per skip.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'ol',
      items: [
        'Catalog service - metadata (title, artist, album, duration) in PostgreSQL or Cassandra.',
        'Media pipeline - ingest masters, encode bitrates, store in object storage ([file storage](/system-design/design-file-storage-dropbox) pattern).',
        'CDN - edge caches encrypted audio segments; clients fetch with signed URLs.',
        'Playlist service - user playlists as ordered track_id lists.',
        'Search - Elasticsearch on title/artist ([search](/system-design/design-search-engine) / [typeahead](/system-design/design-typeahead-autocomplete)).',
        'Playback / session service - authorize stream, return CDN URL + license.',
        'Event pipeline - play, skip, seek → Kafka → counters and recommendations offline.',
      ],
    },
    { type: 'h2', text: 'Playback path' },
    {
      type: 'ol',
      items: [
        'Client requests play(track_id); API checks entitlement (premium / free with ads).',
        'Issue short-lived signed CDN URL for the chosen bitrate.',
        'Client streams via HTTPS; may switch bitrate mid-song if bandwidth drops.',
        'Emit play_started and play_completed events asynchronously.',
      ],
    },
    {
      type: 'p',
      text: 'Do not proxy audio through your app servers - same rule as Zoom media and Netflix egress. App tier is control plane; CDN is data plane.',
    },
    { type: 'h2', text: 'Playlists and library' },
    {
      type: 'table',
      headers: ['Data', 'Store', 'Notes'],
      rows: [
        ['Track metadata', 'SQL / wide-column', 'Strong identity, joins to artists'],
        ['Playlist items', 'SQL or Redis list', 'Ordered track_ids; shard by user_id'],
        ['Liked songs', 'SQL or KV set', 'Fast membership checks'],
        ['Play counts', 'Cassandra / Redis + warehouse', 'Eventual; never block playback'],
      ],
    },
    {
      type: 'p',
      text: 'Collaborative playlists need conflict handling - last-write-wins on item order is fine for MVP; OT/CRDT is overkill unless the interviewer pushes (point to [Docs](/system-design/design-collaborative-document-editor)).',
    },
    { type: 'h2', text: 'Search and browse' },
    {
      type: 'p',
      text: 'Index track/artist/album documents in Elasticsearch. Prefix search for artist names uses the same ideas as [autocomplete](/system-design/design-typeahead-autocomplete). Hot homepage shelves (“Today’s Top Hits”) are precomputed lists cached in Redis and invalidated on chart jobs.',
    },
    { type: 'h2', text: 'Recommendations (keep light)' },
    {
      type: 'p',
      text: 'Offline jobs train embeddings or collaborative filters nightly; online serving reads a precomputed candidate list per user from a feature store / KV. In a 45-minute interview, say “batch pipeline + cached candidates,” not “I will derive Word2Vec on the whiteboard.”',
    },
    { type: 'h2', text: 'Scaling and failure' },
    {
      type: 'ul',
      items: [
        'Shard users for playlists/library ([sharding](/system-design/database-sharding-replication)).',
        'CDN origin shield to protect object storage on viral tracks.',
        'Rate-limit anonymous scraping of the catalog ([rate limiter](/system-design/design-rate-limiter)).',
        'If Kafka lags, playback still works - analytics delay is acceptable ([CAP](/system-design/cap-theorem-consistency-models) AP on counters).',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'User taps track T9 on a playlist.',
        'API validates premium, returns signed URL for 160 kbps object on CloudFront.',
        'Edge cache hit - audio starts in <100 ms.',
        'Client sends play_started; worker increments artist/track counters eventually.',
        'User skips at 0:40 - skip event feeds “skip rate” features for tomorrow’s model.',
      ],
    },
    { type: 'h2', text: 'Offline and mobile' },
    {
      type: 'p',
      text: 'Downloads store encrypted blobs on device with a license that expires. Sync library deltas when online. Mention battery and storage quotas - interviewers like practical mobile constraints.',
    },
    { type: 'h2', text: 'Ads and free tier' },
    {
      type: 'p',
      text: 'Free users may hear ads between tracks. Ad decisioning is a separate service returning audio creatives; the client stitches them into the play queue. Do not block playback on ad auction latency - fall back to a cached house ad. Premium skips this path entirely after entitlement check.',
    },
    {
      type: 'p',
      text: 'Artist payouts and royalty ledgers are payment-adjacent; point to the [payment system](/system-design/design-payment-system) article and keep them out of the critical stream path.',
    },
    { type: 'h2', text: 'Interview narrative' },
    {
      type: 'p',
      text: 'Contrast with Netflix: smaller files, heavier social/playlist writes, play-event firehose. Draw CDN outside the API box, Kafka for plays, Elasticsearch for search. That story is complete without inventing a recommender PhD.',
    },
  ],
}

export default article
