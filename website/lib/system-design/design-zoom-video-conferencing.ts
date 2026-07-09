import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-zoom-video-conferencing',
  title: 'Design Zoom (Video Conferencing)',
  description:
    'How to design Zoom-style video conferencing for interviews: WebRTC, SFU vs MCU, media servers, signaling, recording, and scaling multiparty calls.',
  readMinutes: 14,
  published: '2026-07-13',
  category: 'case-study',
  seoKeywords: [
    'Zoom system design',
    'video conferencing system design interview',
    'WebRTC SFU architecture',
    'video call system design',
  ],
  sections: [
    {
      type: 'p',
      text: 'Zoom is harder than [Netflix](/system-design/design-video-streaming-netflix). Netflix is mostly one-way CDN delivery of pre-encoded files. Conferencing is interactive, low-latency, many-to-many media with people joining from bad hotel Wi-Fi. Interviewers want WebRTC vocabulary, SFU vs MCU, and a realistic signaling path — not a full DSP thesis.',
    },
    {
      type: 'p',
      text: 'Scope with the [framework](/system-design/how-to-approach-system-design-interviews): max participants per meeting (e.g. 100), whether recording/live stream is in scope, and mobile vs desktop. Start with 1:1 then scale to group.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Create/join meeting by ID; optional waiting room and passwords.',
        'Audio + video; mute, camera off, screen share.',
        'Chat in-meeting ([chat](/system-design/design-chat-messaging) lite).',
        'Optional: cloud recording, dial-in PSTN, breakout rooms (stretch).',
      ],
    },
    { type: 'h2', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'End-to-end latency target ~150–300 ms glass-to-glass for conversation.',
        'Adaptive bitrate when networks degrade.',
        'High availability of signaling; media can degrade gracefully (audio-only).',
        'Security: meeting passwords, encryption in transit (DTLS/SRTP).',
      ],
    },
    {
      type: 'callout',
      title: 'Do not invent a custom UDP stack',
      text: 'Say WebRTC for browsers/mobile SDKs. Your design is signaling + media servers + scaling policy around WebRTC, not replacing it.',
    },
    { type: 'h2', text: 'Mesh vs MCU vs SFU' },
    {
      type: 'table',
      headers: ['Model', 'How media flows', 'When'],
      rows: [
        ['Mesh', 'Every peer sends to every other peer', '2–4 people only; upload explodes'],
        ['MCU', 'Server mixes all streams into one composite', 'Heavy CPU on server; simple clients'],
        ['SFU', 'Server forwards streams without mixing', 'Default for Zoom-like systems'],
      ],
    },
    {
      type: 'p',
      text: 'SFU (Selective Forwarding Unit) is the answer you want: each client uploads once; SFU fans out to subscribers and can forward only the resolutions each receiver needs (simulcast). MCU is for recording composites or very weak clients. Mesh dies at group size.',
    },
    { type: 'h2', text: 'High-level components' },
    {
      type: 'ol',
      items: [
        'Meeting service — create meeting, auth, participant list (control plane).',
        'Signaling service — WebSocket: SDP offer/answer, ICE candidates, mute events.',
        'STUN/TURN — NAT traversal; TURN relays when P2P fails.',
        'SFU media servers — receive RTP, forward to peers in the meeting.',
        'Recording service — subscribe as a silent participant, write to object storage.',
        'Chat / presence — sidecar services.',
      ],
    },
    { type: 'h2', text: 'Call setup walkthrough' },
    {
      type: 'ol',
      items: [
        'Host creates meeting → meeting_id, join token.',
        'Client connects signaling WebSocket; authenticates.',
        'Client gets SFU endpoint for this meeting (region-aware).',
        'WebRTC PeerConnection to SFU: SDP exchange via signaling.',
        'ICE connectivity checks; media flows UDP to SFU.',
        'SFU notifies others; they subscribe to new publisher’s tracks.',
      ],
    },
    {
      type: 'p',
      text: 'For 1:1, you might allow direct P2P after signaling (lower cost). For groups, always SFU. Load balancer for signaling is easy ([load balancing](/system-design/load-balancing-and-scaling)); media servers need sticky meeting affinity — all participants of meeting M pin to the same SFU shard (or a small SFU cluster that shares that meeting).',
    },
    { type: 'h2', text: 'Scaling media servers' },
    {
      type: 'ul',
      items: [
        'Shard meetings by hash(meeting_id) → SFU pool.',
        'Large meetings: multiple SFUs with cascading (advanced); mention as stretch.',
        'Simulcast: client sends 3 resolutions; SFU picks per subscriber bandwidth.',
        'Last-N speakers: forward only active speakers’ video to save bandwidth.',
        'Regional SFUs: join nearest region; cross-region meetings pay latency.',
      ],
    },
    {
      type: 'p',
      text: 'Bandwidth math: 1.5 Mbps video × 50 viewers ≈ huge if mesh; with SFU each client still uploads ~1.5 Mbps once and downloads N streams (or last-N). Always show you understand upload vs download asymmetry.',
    },
    { type: 'h2', text: 'Signaling vs media' },
    {
      type: 'p',
      text: 'Signaling is small JSON over WebSocket — scale like [chat](/system-design/design-chat-messaging). Media is UDP-heavy and CPU/network bound on SFU boxes. Never push video frames through your app servers. Separate control and media planes clearly on the diagram.',
    },
    { type: 'h2', text: 'Recording and streaming' },
    {
      type: 'p',
      text: 'Recording bot joins as a participant, receives streams, muxes to file, uploads to S3 — similar durable object story as [file storage](/system-design/design-file-storage-dropbox). Live stream to YouTube is RTMP egress from a compositor. Keep recording out of the critical interactive path.',
    },
    { type: 'h2', text: 'Reliability and degraded modes' },
    {
      type: 'ul',
      items: [
        'Network bad → drop video resolution, then video entirely, keep audio.',
        'SFU dies → reconnect signaling, reassign meeting to warm standby (hard; say “meeting reconnect with new ICE”).',
        'TURN as fallback when corporate firewalls block UDP.',
        'Rate-limit meeting creation and join storms ([rate limiter](/system-design/design-rate-limiter)).',
      ],
    },
    { type: 'h2', text: 'Security' },
    {
      type: 'ul',
      items: [
        'Join tokens / meeting passwords; waiting room.',
        'DTLS-SRTP for media; TLS for signaling.',
        'Optional E2E encryption is a research-level follow-up — acknowledge Zoom’s history without overclaiming.',
        'Auth via [API gateway](/system-design/design-api-gateway) for REST meeting APIs.',
      ],
    },
    { type: 'h2', text: 'Worked example: 10-person standup' },
    {
      type: 'ol',
      items: [
        'Host creates meeting in us-east SFU pool.',
        '10 clients signal join; each publishes camera+mic to SFU S7.',
        'SFU forwards last-4 active speaker videos + all audio.',
        'One client on bad Wi-Fi gets 180p only via simulcast selection.',
        'Host hits Record → recorder joins S7, writes MP4 to S3 after call.',
      ],
    },
    { type: 'h2', text: 'Chat, reactions, and presence' },
    {
      type: 'p',
      text: 'In-meeting chat and raise-hand are signaling messages, not media. Fan them out on the same WebSocket or a lightweight pub/sub channel keyed by meeting_id — patterns from [chat](/system-design/design-chat-messaging). Do not mux chat into RTP.',
    },
    {
      type: 'table',
      headers: ['Plane', 'Protocol', 'Examples'],
      rows: [
        ['Signaling', 'WSS / JSON', 'Join, SDP, mute, chat, reactions'],
        ['Media', 'UDP / SRTP', 'Audio, video, screen share'],
        ['REST control', 'HTTPS', 'Create meeting, schedule, recordings list'],
      ],
    },
    {
      type: 'p',
      text: 'Screen share is another video track with higher resolution and lower frame rate. SFU treats it like a preferred layer for subscribers who pin the shared screen. Cap concurrent screen shares per meeting to protect bandwidth.',
    },
    { type: 'h2', text: 'PSTN and interoperability (stretch)' },
    {
      type: 'p',
      text: 'Phone dial-in needs a SIP/PSTN gateway that appears to the SFU as another participant publishing audio only. Calendar invites and waiting rooms live in the meeting service. Keep these as “phase 2” unless the prompt requires telephony — core WebRTC + SFU already fills the slot.',
    },
    { type: 'h2', text: 'Interview summary' },
    {
      type: 'p',
      text: 'Draw signaling, STUN/TURN, and SFU. Explain why mesh fails and MCU is CPU-heavy. Cover meeting affinity, simulcast, and degraded audio-only mode. Contrast with Netflix VOD. That package reads as someone who has thought about real calls, not just boxes labeled “video.”',
    },
  ],
}

export default article
