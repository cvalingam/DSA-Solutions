import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-video-streaming-netflix',
  title: 'Design a Video Streaming Platform (Netflix / YouTube)',
  description:
    'System design for video streaming at scale: upload pipeline, transcoding, adaptive bitrate, CDN delivery, and playback APIs for interview prep.',
  readMinutes: 12,
  published: '2026-06-23',
  category: 'case-study',
  seoKeywords: [
    'Netflix system design',
    'video streaming architecture',
    'YouTube system design interview',
    'CDN video delivery',
  ],
  sections: [
    {
      type: 'p',
      text: 'Video streaming interviews test whether you understand the difference between metadata and multi-gigabyte blobs, and whether you can explain why playback must never hit your origin database. Netflix and YouTube are read-heavy systems with an expensive write path (transcoding) and a cheap read path (CDN). Start with the [interview framework](/system-design/how-to-approach-system-design-interviews): clarify live vs on-demand, mobile vs TV, and whether uploads are in scope.',
    },
    { type: 'h2', text: 'Requirements' },
    { type: 'h3', text: 'Functional' },
    {
      type: 'ul',
      items: [
        'Creators upload video; viewers browse catalog and play with seek/pause/resume.',
        'Adaptive quality: switch bitrate based on bandwidth (360p → 4K).',
        'Resume playback from last position across devices.',
        'Search and recommendations (optional v2 - mention but defer depth).',
      ],
    },
    { type: 'h3', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        '100M DAU, peak evening traffic in each timezone.',
        'Playback start under 2 seconds on good network.',
        'Uploads can take minutes; playback is latency-sensitive.',
        'High availability for reads; eventual consistency OK for view counts.',
      ],
    },
    {
      type: 'callout',
      title: 'Clarify live vs VOD',
      text: 'Live streaming (Twitch, sports) needs low-latency ingest and segment buffers measured in seconds. On-demand (Netflix) tolerates minutes of transcoding before publish. Mixing both in one interview usually means you pick one and say what you would add later.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'table',
      headers: ['Component', 'Role'],
      rows: [
        ['Upload API + resumable chunks', 'Accept large files; store raw in object storage (S3)'],
        ['Transcoding workers', 'FFmpeg jobs: H.264/H.265 at multiple bitrates and resolutions'],
        ['Manifest service', 'HLS/DASH playlist linking segment URLs per quality level'],
        ['Metadata DB (PostgreSQL)', 'Title, owner, status, duration, poster URL'],
        ['Blob store + CDN', 'Segments at edge; origin shield reduces S3 egress'],
        ['Playback API', 'Return signed manifest URL + resume offset'],
        ['Progress service (Redis)', 'Last watched position per user per video'],
      ],
    },
    { type: 'h2', text: 'Upload and transcoding pipeline' },
    {
      type: 'ol',
      items: [
        'Client requests presigned multipart upload URL for video_id.',
        'Chunks land in S3 `raw/{video_id}/`; completion event on [Kafka](/system-design/message-queues-async-processing).',
        'Transcoder fleet pulls job: produce 360p, 720p, 1080p segments (2-6 sec each).',
        'Write `transcoded/{video_id}/{quality}/segment_N.ts` to S3; update metadata status = ready.',
        'Generate master HLS manifest listing variant streams.',
        'Invalidate CDN cache for poster thumbnail only - segments are immutable URLs.',
      ],
    },
    {
      type: 'p',
      text: 'Transcoding is CPU-heavy and embarrassingly parallel - scale worker pool independently from API servers. Failed jobs retry with backoff; poison videos go to dead-letter queue for manual review. Never block the upload HTTP response on transcoding - return `202 Accepted` with `video_id` and poll status or use WebSocket ([chat pattern](/system-design/design-chat-messaging) for status push).',
    },
    { type: 'h2', text: 'Adaptive bitrate playback' },
    {
      type: 'p',
      text: 'HLS/DASH clients download a manifest, then pick a quality rung based on measured throughput. Each segment is a separate HTTP GET - perfect for [CDN](/system-design/caching-fundamentals-for-interviews) caching at edge PoPs worldwide. Player buffers 3-5 segments ahead; on bandwidth drop it switches to a lower manifest variant without rebuffering if possible. Interview tip: say "segments are immutable" - cache TTL can be weeks.',
    },
    { type: 'h2', text: 'CDN and origin shield' },
    {
      type: 'p',
      text: 'Without CDN, 10M concurrent viewers × 5 Mbps average = 50 Tbps - impossible from one data centre. CloudFront/Akamai/Fastly cache `.ts` segments at edge. Origin shield (mid-tier cache) collapses duplicate misses to S3. Signed URLs or signed cookies prevent hot-linking; short TTL (hours) on manifest, long on segments. Geographic [load balancing](/system-design/load-balancing-and-scaling) sends users to nearest PoP via DNS anycast.',
    },
    { type: 'h2', text: 'Capacity estimation' },
    {
      type: 'p',
      text: 'Assume 1M videos, average 500 MB raw each → ~500 TB raw storage. A transcoded bitrate ladder (360p/720p/1080p) often totals roughly 1-2× raw size depending on codec and segment count - budget ~0.5-1 PB transcoded, not “raw × number of qualities.” 50M views/day, average watch 20 min: at ~3 Mbps effective throughput that is ~450 MB per full session from the CDN (not origin). Peak 5M concurrent × 3 Mbps ≈ 15 Tbps CDN egress - you buy bandwidth at the edge, not serve from one data centre. Metadata DB: 1M titles × 2 KB = 2 GB - trivial in PostgreSQL with read replicas.',
    },
    { type: 'h2', text: 'Resume playback and progress' },
    {
      type: 'p',
      text: 'Store `user_id, video_id → offset_seconds` in Redis with TTL 90 days. On play start, API merges progress into manifest response. Client heartbeats every 30 sec (async, fire-and-forget) - do not block playback. Conflict: two devices - last-write-wins is fine for Netflix; live co-watch is out of scope. Progress writes are AP; losing a heartbeat loses at most 30 sec of position.',
    },
    { type: 'h2', text: 'Search and catalog' },
    {
      type: 'p',
      text: 'Full-text search on title, description, tags via Elasticsearch - index updated when metadata status = ready. Trending and home feed can reuse [news feed](/system-design/design-news-feed) fan-out patterns or precomputed rails per region. Keep search off the playback hot path.',
    },
    { type: 'h2', text: 'API sketch' },
    {
      type: 'ul',
      items: [
        'POST /videos - initiate upload, return video_id + presigned URLs',
        'GET /videos/{id}/playback - signed manifest URL + resume_offset',
        'PUT /videos/{id}/progress - { position_sec } (async)',
        'GET /videos/search?q= - Elasticsearch proxy',
      ],
    },
    { type: 'h2', text: 'Failure modes' },
    {
      type: 'table',
      headers: ['Failure', 'Mitigation'],
      rows: [
        ['Transcoder crash mid-job', 'Idempotent job id; resume from last completed segment'],
        ['CDN miss storm on new viral video', 'Pre-warm top N PoPs; origin shield'],
        ['S3 outage in one region', 'Multi-region replication for popular catalog'],
        ['Stale manifest after transcode', 'Version manifest URL; CDN short TTL on .m3u8'],
        ['Upload interrupted', 'Multipart resume with completed part ETags'],
      ],
    },
    { type: 'h2', text: 'Security and DRM (brief)' },
    {
      type: 'p',
      text: 'Premium content uses Widevine/FairPlay encryption - license server validates subscription before decryption key. Interviewers at Netflix may go deep; for general loops, mention "encrypted segments + license endpoint" and move on unless prompted. [Payment](/system-design/design-payment-system) subscription gates playback API.',
    },
    { type: 'h2', text: 'Live streaming extension' },
    {
      type: 'p',
      text: 'Ingest RTMP/WebRTC to media server; segment live into 2 sec HLS chunks with 10-30 sec total latency. No full transcode pipeline - single bitrate or limited ladder. Chat and reactions use separate [WebSocket](/system-design/design-chat-messaging) channel. Different beast from VOD - say so explicitly.',
    },
    { type: 'h2', text: 'Sample opening (first three minutes)' },
    {
      type: 'p',
      text: 'Interviewer: "Design YouTube." You: "I will focus on on-demand upload and playback at global scale. Upload goes to object storage, async transcode to HLS segments, metadata in SQL, delivery via CDN with adaptive bitrate. Playback API returns a signed manifest and resume position from Redis. I will estimate CDN bandwidth and keep transcoding off the critical read path."',
    },
    { type: 'h2', text: 'View count and analytics' },
    {
      type: 'p',
      text: 'Increment view counter async on play start - [Kafka](/system-design/message-queues-async-processing) event, batch aggregate to data warehouse. Do not synchronously write every view to SQL on the playback path. Trending list computed offline hourly. Same pattern as [URL shortener](/system-design/design-url-shortener) click analytics.',
    },
    { type: 'h2', text: 'What to say in the last five minutes' },
    {
      type: 'p',
      text: 'Close with: "S3 raw upload, async FFmpeg transcode to HLS, CDN serves segments, signed manifest API, resume in Redis." Mention adaptive bitrate and that transcoding is never on the playback hot path.',
    },
    { type: 'h2', text: 'Mock interview checklist' },
    {
      type: 'ol',
      items: [
        'Separated upload/transcode (write) from CDN playback (read).',
        'Explained HLS segments and adaptive bitrate.',
        'Named object storage + CDN + metadata DB.',
        'Discussed resume progress and signed URLs.',
        'Gave rough capacity numbers for storage and peak bandwidth.',
      ],
    },
    { type: 'h2', text: 'Closing summary' },
    {
      type: 'p',
      text: 'Video streaming is a blob delivery problem with a heavy offline pipeline. Transcode once, serve millions of times from the edge. Pair with [file storage](/system-design/design-file-storage-dropbox) chunking intuition and [caching](/system-design/caching-fundamentals-for-interviews) for CDN - that trio covers most streaming interviews.',
    },
  ],
}

export default article
