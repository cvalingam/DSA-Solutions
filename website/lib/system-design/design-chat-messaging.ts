import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-chat-messaging',
  title: 'Design a Chat / Messaging System (WhatsApp / Slack DM)',
  description:
    'System design for real-time chat: WebSockets vs polling, message storage, delivery guarantees, online presence, and group chat scaling.',
  readMinutes: 12,
  published: '2026-06-17',
  category: 'case-study',
  sections: [
    {
      type: 'p',
      text: 'Chat systems combine a classic CRUD problem (store messages) with a real-time delivery problem (get them to the right device now). Interviewers want to see you separate one-to-one chat from group chat, and to discuss what "delivered" and "read" actually mean. Start with the [interview framework](/system-design/how-to-approach-system-design-interviews) - clarify requirements before drawing WebSocket boxes everywhere.',
    },
    { type: 'h2', text: 'Requirements' },
    {
      type: 'ul',
      items: [
        'One-to-one and group conversations.',
        'Send text messages; media as optional v2.',
        'Delivery states: sent, delivered, read (read receipts).',
        'Show online / last-seen presence.',
        'Message history when user opens app (paginated).',
        'Push notification when recipient is offline.',
      ],
    },
    {
      type: 'callout',
      title: 'Clarify scale',
      text: 'Slack-style workplace chat (thousands per org) differs from WhatsApp-scale (billions of users). Ask daily active users, messages per second, and max group size. A 500-person group changes fan-out completely.',
    },
    { type: 'h2', text: 'Capacity estimation' },
    {
      type: 'p',
      text: 'Assume 500M DAU, each sends 40 messages/day → 20B messages/day ≈ 230,000 writes/sec average, ~1M/sec peak. Storage: 200 bytes metadata per message ≈ 4TB/day raw before replication and compaction. Peak concurrent connections: if 20% of DAU online at once, 100M WebSockets - plan hundreds of gateway nodes at ~50K connections each. State these numbers before drawing boxes.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'ol',
      items: [
        'Mobile/web clients connect via WebSocket (or long polling fallback) to Chat Gateway.',
        'Gateway routes to the correct Chat Server instance based on user_id (sticky sessions).',
        'Message Service persists to Message DB and publishes to internal queue.',
        'Delivery Service pushes to recipient\'s WebSocket if online; else triggers push notification.',
        'Presence Service tracks online status in Redis with heartbeat TTL.',
        'Media Service handles uploads to object storage (out of scope for first 20 minutes).',
      ],
    },
    {
      type: 'table',
      headers: ['Component', 'Technology', 'Why'],
      rows: [
        ['Chat Gateway', 'WebSocket load balancer', 'Persistent bidirectional connection'],
        ['Message store', 'Cassandra or partitioned SQL', 'High write volume, time-ordered reads'],
        ['Presence', 'Redis keys with TTL', 'Fast online checks; heartbeat refreshes expiry'],
        ['Push', 'FCM / APNs', 'Offline users'],
        ['Queue', 'Kafka', 'Decouple write from delivery fan-out'],
      ],
    },
    { type: 'h2', text: 'One-to-one message flow' },
    {
      type: 'ol',
      items: [
        'Alice sends message to Bob via WebSocket: { conv_id, text, client_msg_id }.',
        'Server validates membership, assigns server_msg_id, writes to messages table.',
        'Server ACKs Alice with server_msg_id (idempotent on client_msg_id retry).',
        'Delivery Service looks up Bob\'s connection on Chat Server #7.',
        'If online: push message over WebSocket; send delivered ACK to Alice when Bob\'s client ACKs.',
        'If offline: enqueue push notification; mark pending delivery.',
        'Bob opens app later: sync API returns messages since last cursor.',
      ],
    },
    {
      type: 'callout',
      title: 'Idempotency',
      text: 'Clients retry on flaky networks. Store client_msg_id unique per sender and return the same server_msg_id on duplicate - same pattern as payment APIs.',
    },
    { type: 'h2', text: 'Group chat' },
    {
      type: 'p',
      text: 'For a group of N members, each message creates N-1 deliveries. At 500 members and 10 msg/sec, that is 5,000 deliveries/sec per active group. Options:',
    },
    {
      type: 'ul',
      items: [
        'Store message once per conversation_id; each user tracks read_cursor per conversation.',
        'Fan-out on read: members pull new messages since their last sync token.',
        'Fan-out on write for small groups (< 100); pull model for large channels.',
      ],
    },
    { type: 'h2', text: 'Data model' },
    {
      type: 'ul',
      items: [
        'conversations: conv_id, type (1:1 or group), created_at',
        'conversation_members: conv_id, user_id, joined_at, last_read_msg_id',
        'messages: msg_id, conv_id, sender_id, body, created_at (partition by conv_id + time)',
        'presence: Redis key online:{user_id} with 30s TTL, refreshed by heartbeat',
      ],
    },
    { type: 'h2', text: 'WebSocket vs polling' },
    {
      type: 'p',
      text: 'WebSockets give true push latency (milliseconds). Long polling works for MVP but wastes connections. In interviews, default to WebSocket + fallback polling for corporate firewalls. Mention connection scaling: millions of concurrent sockets need many gateway nodes and a pub/sub backbone (Redis Pub/Sub or dedicated message bus) so any server can reach any user. Chat gateways use [load balancing](/system-design/load-balancing-and-scaling) with sticky sessions or a shared connection registry.',
    },
    { type: 'h2', text: 'Connection registry' },
    {
      type: 'p',
      text: 'When Alice\'s message must reach Bob, the delivery service needs to know which chat server holds Bob\'s socket. Store a mapping in Redis: user_id → { server_id, connection_id } with TTL refreshed by heartbeat. On disconnect, delete the entry. This decouples delivery from sticky DNS - any server can look up where to push.',
    },
    {
      type: 'table',
      headers: ['Event', 'Registry action'],
      rows: [
        ['User connects WebSocket', 'SET user:{id} → server_id, refresh TTL'],
        ['Heartbeat every 15s', 'EXPIRE user:{id} 30s'],
        ['User disconnects', 'DEL user:{id}'],
        ['Message for offline user', 'Registry miss → push notification queue'],
      ],
    },
    { type: 'h2', text: 'Multi-device and message ordering' },
    {
      type: 'p',
      text: 'Bob may be on phone and laptop simultaneously. Register multiple connections per user_id, or deliver to all active devices. Message ordering within a conversation uses a monotonic server_msg_id (Snowflake ID or DB sequence per conv_id). Clients discard duplicates and sort by server_msg_id. Cross-device sync uses the same paginated history [API](/system-design/api-design-rest-interviews): GET /conversations/{id}/messages?after=cursor.',
    },
    { type: 'h2', text: 'Storage and partitioning' },
    {
      type: 'p',
      text: 'Partition messages by conversation_id so all messages in one chat live on the same shard - range queries stay local. Cassandra uses conv_id as partition key; PostgreSQL can use hash partitioning on conv_id. See [SQL vs NoSQL](/system-design/sql-vs-nosql-for-interviews) for why append-heavy chat logs favor wide-column stores at billion-message scale.',
    },
    { type: 'h2', text: 'Delivery state machine' },
    {
      type: 'p',
      text: 'Clients show checkmarks based on server-confirmed states - define them precisely:',
    },
    {
      type: 'table',
      headers: ['State', 'Meaning', 'Trigger'],
      rows: [
        ['Sent', 'Server stored message', 'ACK to sender with server_msg_id'],
        ['Delivered', 'Recipient device received payload', 'Client ACK over WebSocket or sync pull'],
        ['Read', 'User opened conversation', 'POST /conversations/{id}/read with last_read_msg_id'],
      ],
    },
    {
      type: 'p',
      text: 'Do not mark delivered until the recipient client confirms - server push alone is not enough on flaky mobile networks.',
    },
    { type: 'h2', text: 'Push notification path' },
    {
      type: 'ol',
      items: [
        'Delivery service finds no WebSocket registry entry for Bob.',
        'Enqueue push job: { user_id, conv_id, preview_text, badge_count }.',
        'Push worker calls FCM (Android) or APNs (iOS) with device token from user_devices table.',
        'Bob taps notification → app cold-starts → WebSocket connect → sync API fetches missed messages.',
        'Collapse multiple notifications per conversation to avoid notification spam.',
      ],
    },
    { type: 'h2', text: 'API summary' },
    {
      type: 'table',
      headers: ['Endpoint', 'Method', 'Notes'],
      rows: [
        ['POST /v1/conversations', 'Create 1:1 or group', '201 { conv_id }'],
        ['POST /v1/conversations/{id}/messages', 'Send message', '201 + idempotent client_msg_id'],
        ['GET /v1/conversations/{id}/messages?after=cursor', 'History sync', 'Cursor pagination'],
        ['POST /v1/conversations/{id}/read', 'Read receipt', '204'],
        ['GET /v1/presence?user_ids=...', 'Batch online status', '200 { statuses }'],
      ],
    },
    {
      type: 'p',
      text: 'Full [REST conventions](/system-design/api-design-rest-interviews) apply - version prefix, consistent errors, 429 on abuse.',
    },
    { type: 'h2', text: 'Failure modes' },
    {
      type: 'table',
      headers: ['Failure', 'User impact', 'Mitigation'],
      rows: [
        ['Chat server crash', 'Brief disconnect; client reconnects', 'Exponential backoff reconnect; registry TTL expires stale entries'],
        ['Message DB slow', 'Send latency spikes', 'Queue accepts write; async persist with client "sending" state'],
        ['Push provider outage', 'Offline users miss instant alert', 'Retry queue; sync on next app open'],
        ['Duplicate client_msg_id retry', 'Must not show two messages', 'Unique constraint per sender; return original server_msg_id'],
        ['Group fan-out overload', 'Large channel lag', 'Pull model for members; rate limit posts per minute'],
      ],
    },
    { type: 'h2', text: 'Latency budget for send message' },
    {
      type: 'table',
      headers: ['Step', 'Target'],
      rows: [
        ['WebSocket receive + validate', '< 5ms'],
        ['Persist to DB (async option)', '5-20ms sync, or ACK after queue'],
        ['Registry lookup + push to recipient', '< 10ms if online'],
        ['Delivered ACK back to sender', '< 30ms end-to-end p99'],
      ],
    },
    {
      type: 'p',
      text: 'WhatsApp-feel latency requires online delivery over WebSocket, not polling. Offline path optimises for reliability over speed.',
    },
    { type: 'h2', text: 'Optional v2 features' },
    {
      type: 'ul',
      items: [
        'Typing indicators: ephemeral events over WebSocket, not persisted.',
        'End-to-end encryption: keys on device; server stores ciphertext only - major scope addition.',
        'Message search: Elasticsearch index async from the message queue.',
        'Media messages: pre-signed S3 upload URL, then message body references object key.',
      ],
    },
    { type: 'h2', text: 'What to say in the last five minutes' },
    {
      type: 'p',
      text: 'Summarise: "WebSocket gateway with connection registry in Redis, durable message store partitioned by conversation, async delivery with push fallback, idempotent client_msg_id on send. Small groups fan-out on write; large channels pull on read. Delivery and read states are explicit ACKs, not guesses." That is a complete interview answer without over-building.',
    },
    { type: 'h2', text: 'Mock interview checklist' },
    {
      type: 'ol',
      items: [
        'Clarified 1:1 vs group and max group size.',
        'Separated write path (persist) from delivery path (push).',
        'Explained WebSocket scaling (registry or sticky sessions).',
        'Defined sent / delivered / read semantics.',
        'Mentioned offline push and history sync API.',
        'Discussed idempotency on flaky mobile networks.',
      ],
    },
    { type: 'h2', text: 'How this connects to DSA' },
    {
      type: 'p',
      text: 'Message ordering within a conversation is a total order problem. Group delivery is [BFS fan-out](/system-design/from-leetcode-patterns-to-real-systems) at scale. Presence TTL is sliding-window expiry - same intuition as [rate limiting](/system-design/design-rate-limiter).',
    },
    { type: 'h2', text: 'Closing summary' },
    {
      type: 'p',
      text: 'Lead with WebSocket gateway, persistent message store, async delivery, presence in Redis, and push for offline. Separate 1:1 from group fan-out strategy. Discuss idempotency and delivery ACKs - that is what separates a diagram from a production design.',
    },
  ],
}

export default article
