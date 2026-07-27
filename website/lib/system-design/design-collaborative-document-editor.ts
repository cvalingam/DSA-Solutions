import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-collaborative-document-editor',
  title: 'Design Google Docs (Collaborative Editor)',
  description:
    'How to design a real-time collaborative document editor for interviews: operational transform vs CRDT, WebSockets, presence, versioning, and conflict resolution at scale.',
  readMinutes: 15,
  published: '2026-07-07',
  category: 'case-study',
  seoKeywords: [
    'Google Docs system design',
    'collaborative editing interview',
    'operational transform CRDT',
    'real-time document editor architecture',
  ],
  sections: [
    {
      type: 'p',
      text: 'Designing Google Docs is the hardest "real-time" prompt interviewers ask. Two users type in the same paragraph at the same time - both see consistent text without locks. That requires operational transform (OT) or conflict-free replicated data types (CRDTs), plus [WebSockets](/system-design/design-chat-messaging) for push latency. If you have done collaborative coding interviews, this is the same family of problem as [chat](/system-design/design-chat-messaging), but with character-level merges instead of messages.',
    },
    {
      type: 'p',
      text: 'Use the [framework](/system-design/how-to-approach-system-design-interviews) to narrow scope: text only (no spreadsheets), up to 50 concurrent editors per doc, and strong eventual consistency (all users converge to the same document within seconds).',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Create, open, rename, delete documents.',
        'Real-time collaborative editing with cursor presence ("Alice is typing…").',
        'Offline edits merge when user reconnects.',
        'Version history and restore to timestamp.',
        'Share with view / comment / edit permissions.',
      ],
    },
    { type: 'h2', text: 'Non-functional requirements' },
    {
      type: 'ul',
      items: [
        'Latency < 200 ms for remote keystrokes to appear.',
        'Support documents up to ~1 MB of text (not video).',
        'Durability - never lose acknowledged edits.',
        'Availability during single data center failure.',
      ],
    },
    { type: 'h2', text: 'Naive approach (and why it fails)' },
    {
      type: 'p',
      text: 'Lock the paragraph while User A types - terrible UX. Last-write-wins on the whole document - User B\'s sentence vanishes. Send absolute positions ("insert \'hello\' at index 42") - if User A inserts 5 chars earlier, User B\'s index 42 is wrong. You need a merge algorithm that transforms operations against concurrent ops.',
    },
    { type: 'h2', text: 'Operational transform (OT)' },
    {
      type: 'p',
      text: 'Represent edits as operations: `Insert(pos, char)`, `Delete(pos)`, `Retain(n)`. When two ops conflict, transform them so applying either order converges. Server is often the central sequencer: clients send ops, server assigns revision numbers, broadcasts transformed ops to others. Google Docs historically used OT with a single coordination server per document shard.',
    },
    {
      type: 'callout',
      title: 'Interview shortcut',
      text: 'You do not need to derive OT math on a whiteboard. Say: "Clients send ops; server orders them with a revision counter; OT transforms concurrent ops so all clients converge." Mention that production OT is subtle - teams use libraries (ShareDB, custom) rather than hand-rolling.',
    },
    { type: 'h2', text: 'CRDT alternative' },
    {
      type: 'p',
      text: 'CRDTs attach unique IDs to each character so position is defined by logical order, not integer index. Peers merge without a central server ordering step - better for offline-first and P2P. Trade-off: more metadata per character, harder to implement rich formatting. Figma and many newer editors lean CRDT. In interviews, knowing both names and trade-offs beats picking the wrong one confidently.',
    },
    {
      type: 'table',
      headers: ['Approach', 'Pros', 'Cons'],
      rows: [
        ['OT + central server', 'Mature, efficient for text', 'Server is coordination bottleneck'],
        ['CRDT', 'Peer-friendly, offline merge', 'Memory overhead, complex formatting'],
        ['Last-write-wins', 'Simple', 'Unacceptable UX for collaboration'],
      ],
    },
    { type: 'h2', text: 'Architecture' },
    {
      type: 'ol',
      items: [
        'Browser editor sends ops over WebSocket to Collaboration Service.',
        'Service maintains in-memory doc state per open document (or loads snapshot + op log).',
        'Each op appended to durable log (Kafka or DB) before ACK to client.',
        'Service broadcasts transformed ops to other subscribers on same doc channel.',
        'Snapshot worker compacts op log every N minutes to object storage.',
        'Metadata service (PostgreSQL): doc_id, owner, ACL, title, latest_snapshot_s3_key.',
      ],
    },
    { type: 'h2', text: 'WebSocket scaling' },
    {
      type: 'p',
      text: 'Same patterns as [chat](/system-design/design-chat-messaging): millions of sockets across gateway nodes, pub/sub backbone (Redis Pub/Sub or dedicated bus) so any server can push to any user. Document channel: `doc:{doc_id}`. Sticky sessions optional if connection registry is shared. On reconnect, client sends `last_seen_revision`; server replays missed ops.',
    },
    { type: 'h2', text: 'Storage model' },
    {
      type: 'ul',
      items: [
        'Op log: append-only `(revision, user_id, op_payload, timestamp)` - source of truth.',
        'Periodic snapshot: full document JSON or compressed text in S3 for fast cold open.',
        'Open doc: load latest snapshot + replay ops after snapshot revision.',
        'Version history: list snapshot checkpoints; restore = fork new doc from old snapshot.',
      ],
    },
    {
      type: 'p',
      text: 'Immutable op log resembles [event sourcing](/system-design/message-queues-async-processing) - replay rebuilds state. Size cap per doc triggers compaction.',
    },
    { type: 'h2', text: 'Presence and cursors' },
    {
      type: 'p',
      text: 'Ephemeral data - not in durable log. `PUBLISH doc:123:presence { user_id, cursor_pos, color }` every 2 seconds; TTL clears stale users. Low priority vs edit ops; dropped packets acceptable.',
    },
    { type: 'h2', text: 'Permissions' },
    {
      type: 'p',
      text: 'Check ACL on WebSocket connect and on every op (or cache ACL in session). View-only users receive ops but cannot submit. Share links with role embedded in signed token. Audit log for enterprise.',
    },
    { type: 'h2', text: 'Offline editing' },
    {
      type: 'p',
      text: 'Client queues ops locally with CRDT or OT buffer. On reconnect, send queued ops; server transforms against ops that arrived while offline. Conflict UI rare if merge is correct; show notification if server rejects op (permission revoked).',
    },
    { type: 'h2', text: 'What interviewers probe' },
    {
      type: 'ul',
      items: [
        'How do concurrent inserts at the same position merge?',
        'What happens if collaboration server crashes mid-edit?',
        'How do you avoid broadcasting every keystroke to 500 viewers? (Throttle, or view-only subscribers get slower updates.)',
        'How is this different from [chat](/system-design/design-chat-messaging)? (Character ops vs messages; CRDT/OT vs simple ordering.)',
      ],
    },
    { type: 'h2', text: 'Comparison with simpler alternatives' },
    {
      type: 'table',
      headers: ['Approach', 'When it works', 'Limit'],
      rows: [
        ['Lock paragraph', 'Never for real collab', 'Blocking UX'],
        ['Last-write-wins', 'Single editor only', 'Data loss'],
        ['OT + central server', 'Google Docs scale', 'Server orders ops'],
        ['CRDT', 'Offline-first, Figma-like', 'Memory + complexity'],
        ['Periodic merge (git)', 'Not real-time', 'Conflict UI'],
      ],
    },
    {
      type: 'p',
      text: 'Mention that Notion and Figma made different bets (block-based CRDT vs scene graph). You are not expected to know their internals - only that real products invest years in merge correctness.',
    },
    { type: 'h2', text: 'Formatting and rich text (stretch goal)' },
    {
      type: 'p',
      text: 'Plain text OT is painful enough; bold/italic adds retained attributes per character range. Production editors store parallel attribute maps `(start, end, bold)` and apply OT to both text and marks. In interviews, say formatting is a layer above character ops - defer unless interviewer insists. Google Docs complexity is why startups ship Markdown first.',
    },
    { type: 'h2', text: 'Worked example: two users typing' },
    {
      type: 'ol',
      items: [
        'Doc revision 40: text is "Hello world".',
        'Alice inserts "!" at position 11 → op A, revision 41.',
        'Bob concurrently inserts " there" at position 5 → op B submitted as revision 41 too.',
        'Server orders A before B (tie-break by user_id).',
        'Transform B against A so position 5 still valid after Alice\'s insert.',
        'Broadcast transformed ops; both clients display "Hello there world!".',
      ],
    },
    { type: 'h2', text: 'Capacity planning' },
    {
      type: 'ul',
      items: [
        'Hot document problem: viral doc with 10K viewers - separate read-only fan-out channel with throttled updates.',
        'Memory per open doc: op log in RAM until snapshot - cap log length, force snapshot at 10K ops.',
        'WebSocket connections per collaboration server: ~50K practical; scale out with doc_id sharding to collaboration clusters.',
      ],
    },
    {
      type: 'p',
      text: 'Commenting in docs parallels [chat threads](/system-design/design-chat-messaging) anchored to text ranges - store comment metadata separately, do not mix into OT stream unless comment affects layout. Suggested edits mode: ops tagged `suggestion` applied only on accept - product feature, same transport.',
    },
    { type: 'h2', text: 'Closing pitch' },
    {
      type: 'p',
      text: 'Propose WebSocket collaboration service, OT or CRDT for merge, append-only op log + snapshots, pub/sub for fan-out, PostgreSQL for metadata. Acknowledge complexity - you would not build OT from scratch in production. That honesty plus correct component boundaries scores higher than fake formulas.',
    },
  ],
}

export default article
