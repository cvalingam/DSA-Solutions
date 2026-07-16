import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-live-streaming-twitch',
  title: 'Design Live Streaming (Twitch)',
  description:
    'How to design Twitch-style live streaming for interviews: ingest, transcoding, HLS/LL-HLS, CDN fan-out, chat, and failure handling.',
  readMinutes: 13,
  published: '2026-07-16',
  category: 'case-study',
  seoKeywords: [
    'Twitch system design',
    'live streaming system design interview',
    'design live video streaming architecture',
    'HLS RTMP ingest system design',
  ],
  sections: [
    {
      type: 'p',
      text: 'Live streaming is Netflix with a stopwatch. You cannot pre-transcode the whole catalog — the bits are born seconds before viewers need them. Interviewers use Twitch/YouTube Live to test ingest → process → [CDN](/system-design/design-cdn-content-delivery-network) fan-out under tight latency, plus a noisy [chat](/system-design/design-chat-messaging) sidecar.',
    },
    {
      type: 'p',
      text: 'Scope via the [framework](/system-design/how-to-approach-system-design-interviews): one broadcaster to many viewers, adaptive bitrate, optional low-latency mode, live chat. Skip DRM deep dives and crypto tipping unless asked.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Streamer publishes a live video+audio feed.',
        'Platform transcodes to multiple bitrates/resolutions.',
        'Viewers play with adaptive streaming (HLS / DASH / LL-HLS).',
        'Live chat / reactions alongside the stream.',
        'Start/stop stream, basic VODs after the broadcast (mention).',
        'Optional: clips, subscriptions, raids (mention only).',
      ],
    },
    { type: 'h2', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'Glass-to-glass latency: often ~10–30 s for conventional HLS; low-latency HLS/LL-HLS targets a few seconds (trade buffer for freshness).',
        'Handle streamer reconnects without killing the viewer session forever.',
        'Scale to millions of concurrent viewers on a hot channel.',
        'Chat must not block media; media must not wait on chat.',
      ],
    },
    {
      type: 'callout',
      title: 'VOD vs live',
      text: '[Netflix-style VOD](/system-design/design-video-streaming-netflix) optimizes for catalog and long CDN TTLs. Live optimizes for continuous segment production and short segment windows. Say that contrast in the first two minutes — it frames every later choice.',
    },
    { type: 'h2', text: 'Capacity sketch' },
    {
      type: 'p',
      text: 'Assume 5M concurrent viewers globally, 100K concurrent streamers, top stream at 500K viewers. One 1080p source might become 5 renditions; segment duration 2 s → each rendition emits a new object every 2 s. Hot stream: 500K viewers × playlist refresh traffic is mostly CDN-cached; origin/transcoder load stays near “rendition count,” not viewer count — that is the whole point of the CDN.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'ol',
      items: [
        'Ingest edge — RTMPS / WebRTC / SRT from OBS to nearest ingest PoP.',
        'Transcode fleet — GPU/CPU workers produce ABR ladders and fMP4/TS segments.',
        'Packager — writes media playlist + segments to object storage / packager cache.',
        'CDN — edges serve playlists and segments worldwide.',
        'Playback API — returns signed CDN URLs and stream metadata.',
        'Chat service — separate WebSocket cluster keyed by channel_id.',
        'Control plane — channel state, auth, stream keys, health.',
      ],
    },
    { type: 'h2', text: 'Ingest and transcode' },
    {
      type: 'ol',
      items: [
        'Streamer authenticates with a stream key; ingest accepts the session.',
        'Ingest forwards to a transcode worker (sticky for the session).',
        'Worker outputs 360p/720p/1080p (etc.) with aligned keyframes for ABR switching.',
        'On worker death, control plane reassigns; brief freeze beats permanent outage.',
        'Never put transcode in the viewer path — viewers only talk to CDN.',
      ],
    },
    { type: 'h2', text: 'Playback path' },
    {
      type: 'table',
      headers: ['Component', 'Role', 'Notes'],
      rows: [
        ['Master playlist', 'Lists renditions', 'Short TTL / no-cache often'],
        ['Media playlist', 'Sliding window of segments', 'Updates every segment duration'],
        ['Segments', '2–6 s media chunks', 'Immutable; highly cacheable'],
        ['Player', 'ABR + buffer', 'Switches renditions on bandwidth'],
      ],
    },
    {
      type: 'p',
      text: 'Low-latency live shortens segments and uses partial segment download (LL-HLS/LHLS). Mention the trade-off: less CDN efficiency and less rebuffering budget. For a standard interview, classic HLS plus “LL mode as stretch” is enough.',
    },
    { type: 'h2', text: 'Chat and discovery' },
    {
      type: 'p',
      text: 'Chat is a channel-scoped pub/sub — reuse [messaging](/system-design/design-chat-messaging) ideas: WebSockets, presence, [rate limits](/system-design/design-rate-limiter) against spam. Hot channels need fan-out trees or Redis pub/sub shards by channel_id. Discovery (browse games, followed channels) is a normal read-heavy API with caching — not on the media critical path.',
    },
    { type: 'h2', text: 'Scaling and failure' },
    {
      type: 'ul',
      items: [
        'Autoscaling transcoder pools per region; queue for non-live post-processing only.',
        'CDN absorbs viewer spikes; origin shield for playlist/segment origin.',
        'If chat partitions, video continues ([CAP](/system-design/cap-theorem-consistency-models): media availability over chat consistency).',
        'DVR / rewind: retain last N hours of segments in object storage for late joiners.',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'Streamer goes live from Berlin; RTMPS hits EU ingest.',
        'Transcoder emits 2 s segments for three renditions into packager storage.',
        'Viewer in Brazil gets signed playlist URL; São Paulo PoP caches segments.',
        'Chat messages flow on a separate WS shard for channel C42; a chat blip does not pause video.',
      ],
    },
    { type: 'h2', text: 'Interview narrative' },
    {
      type: 'p',
      text: 'Lead with ingest → transcoder → packager → CDN → player, and park chat beside it. Contrast with VOD. End on failure: reconnect streamer, keep serving last segments, degrade chat first. That story is Twitch without building every creator monetization feature.',
    },
  ],
}

export default article
