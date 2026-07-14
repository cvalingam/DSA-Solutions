import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-email-service-gmail',
  title: 'Design an Email Service (Gmail)',
  description:
    'How to design Gmail for interviews: SMTP ingest, mailbox storage, search indexing, spam filtering, push sync, and multi-device consistency.',
  readMinutes: 13,
  published: '2026-07-14',
  category: 'case-study',
  seoKeywords: [
    'Gmail system design',
    'email service system design interview',
    'design email system architecture',
    'SMTP IMAP mailbox design',
  ],
  sections: [
    {
      type: 'p',
      text: 'Email looks boring until you design it. You are mixing a decades-old protocol (SMTP), a write-once-ish append log per mailbox, full-text search, spam ML, and near-real-time sync to phones. Interviewers like Gmail because it forces storage layout decisions and async pipelines without needing a flashy UI story.',
    },
    {
      type: 'p',
      text: 'Scope with the [framework](/system-design/how-to-approach-system-design-interviews): send/receive for one provider, web + mobile clients, search, spam. Skip building a full anti-abuse PhD and skip inventing a new mail protocol — you speak SMTP/IMAP/HTTP APIs.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Send mail to external domains; receive mail for @yourdomain users.',
        'Inbox, sent, drafts, labels/folders; mark read/unread, archive, delete.',
        'Full-text search across subject and body.',
        'Attachments up to a size limit (e.g. 25 MB).',
        'Push new mail to online clients; eventual sync when offline.',
        'Optional: filters, vacation responder, threaded conversations (mention).',
      ],
    },
    { type: 'h2', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'Durability: never lose accepted mail (at-least-once to durable store).',
        'Send latency: user sees “Sent” in under a second; remote delivery can be async.',
        'Search freshness: searchable within a few seconds of arrival.',
        'Multi-device: last-write-wins on labels/read state is usually enough.',
        'Prefer catching phishing over perfect ham precision — a missed phish in the inbox is worse than an occasional false positive in Spam.',
      ],
    },
    {
      type: 'callout',
      title: 'Mailbox ≠ chat',
      text: 'Unlike [chat](/system-design/design-chat-messaging), email is append-heavy, rarely edited, and must interoperate with the open internet. Your “source of truth” is the mailbox store plus an outbound queue — not a WebSocket fan-out graph.',
    },
    { type: 'h2', text: 'Capacity sketch' },
    {
      type: 'p',
      text: 'Assume 500M users, average 20 messages/day received → ~100K msg/sec ingest globally (bursty around mornings). Average message 50 KB with headers → ~5 GB/s raw before compression and attachment offload. Attachments go to object storage; metadata and a truncated body preview stay in the mailbox DB. Search index size is often larger than the raw store — plan for that early.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'ol',
      items: [
        'SMTP edge (MX) — accept inbound TCP, TLS, greylisting basics.',
        'Ingest pipeline — parse MIME, virus scan, spam score, attach object IDs.',
        'Mailbox service — append message metadata + pointers; assign UID / history id.',
        'Object storage — attachment blobs (same pattern as [file storage](/system-design/design-file-storage-dropbox)).',
        'Search indexer — async consumer writes to Elasticsearch / Vespa.',
        'Outbound MTA — queue for remote SMTP delivery with retries.',
        'Sync / push — [notifications](/system-design/design-notification-system) or long-poll / WebSocket for open clients.',
        'Web/API tier — REST/GraphQL for Gmail-like clients ([API design](/system-design/api-design-rest-interviews)).',
      ],
    },
    { type: 'h2', text: 'Inbound path' },
    {
      type: 'ol',
      items: [
        'Remote MTA connects to your MX; you validate recipient exists and is under quota.',
        'Accept the DATA payload to a durable ingest queue ([Kafka](/system-design/message-queues-async-processing)) — then 250 OK. Do not do heavy ML before accept if that risks timeouts; do cheap checks first.',
        'Workers parse MIME, store attachments, run spam/virus, compute thread_id.',
        'Mailbox append is transactional per user shard: insert row + bump history_id.',
        'Emit index and push events; never block the SMTP accept on search.',
      ],
    },
    {
      type: 'p',
      text: 'Idempotency matters: retries from remote MTAs can redeliver. Deduplicate on (Message-ID header, recipient) or content hash within a window so users do not see clones.',
    },
    { type: 'h2', text: 'Data model' },
    {
      type: 'table',
      headers: ['Data', 'Store', 'Notes'],
      rows: [
        ['User / quota', 'SQL', 'Strong identity, billing tier'],
        ['Message metadata', 'SQL or wide-column shard by user_id', 'uid, labels, flags, thread_id, pointers'],
        ['Body / attachments', 'Object storage', 'Immutable blobs; CDN for large downloads'],
        ['Search docs', 'Search cluster', 'Eventual; rebuildable from mailbox'],
        ['Outbound queue', 'Kafka / SQS', 'Retry with exponential backoff + DSN'],
      ],
    },
    {
      type: 'p',
      text: 'Shard mailboxes by user_id ([sharding](/system-design/database-sharding-replication)). A single hot celebrity inbox is rare compared to chat celebrities, but corporate shared inboxes can spike — isolate them.',
    },
    { type: 'h2', text: 'Send path' },
    {
      type: 'ol',
      items: [
        'Client posts draft → stored; “Send” creates an immutable outbound job and a Sent copy.',
        'Outbound workers resolve MX for each recipient domain, speak SMTP with TLS.',
        'On 4xx, retry; on hard 5xx, generate a bounce into the sender’s mailbox.',
        'Rate-limit per user and per destination domain ([rate limiter](/system-design/design-rate-limiter)) to protect reputation.',
      ],
    },
    { type: 'h2', text: 'Search and spam' },
    {
      type: 'p',
      text: 'Index from, to, subject, body text, labels. Users expect Gmail operators (from:, has:attachment) — implement as structured fields, not only free text. Spam is a scored async stage: quarantine or foldering based on threshold. Keep a human-review / user “Report spam” feedback loop feeding the model offline. Do not pretend you will train transformers on the whiteboard.',
    },
    { type: 'h2', text: 'Sync and consistency' },
    {
      type: 'p',
      text: 'Each mailbox exposes a monotonically increasing history_id. Clients sync deltas since last id — same spirit as Dropbox’s cursor. Read/unread flips are small metadata writes; conflicts across devices use last-write-wins on flag version. For [CAP](/system-design/cap-theorem-consistency-models): choose CP for mailbox append (you accepted the mail), AP for search and badge counts.',
    },
    { type: 'h2', text: 'Scaling and failure' },
    {
      type: 'ul',
      items: [
        'Separate MX ingest from mailbox write tier so SMTP stays up if search is down.',
        'Cache hot metadata pages of the inbox in Redis ([caching](/system-design/caching-fundamentals-for-interviews)).',
        'Attachment virus scan timeouts → quarantine, never silent drop.',
        'Outbound IP pools and warming — reputation is part of the design story.',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'Alice sends mail to bob@company.com.',
        'API writes Sent + outbound job; Bob’s MX accepts and enqueues ingest.',
        'Worker stores PDF in object storage, spam score low, appends to Bob’s shard.',
        'Indexer makes it searchable; Bob’s open web client gets a push with new history_id.',
        'Bob searches “invoice from:alice” — hits search cluster, hydrates bodies from mailbox pointers.',
      ],
    },
    { type: 'h2', text: 'Interview narrative' },
    {
      type: 'p',
      text: 'Lead with MX → durable queue → mailbox append → async search/push. Call out attachment offload and per-user sharding. Contrast with notifications (you own both ends) and chat (ephemeral delivery receipts). That is a complete senior-level Gmail design without reinventing SMTP.',
    },
  ],
}

export default article
