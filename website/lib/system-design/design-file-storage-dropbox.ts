import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-file-storage-dropbox',
  title: 'Design a File Storage System (Dropbox / Google Drive)',
  description:
    'System design for cloud file storage: upload chunking, metadata vs blob storage, sync, conflict resolution, and CDN delivery for interviews.',
  readMinutes: 12,
  published: '2026-06-18',
  category: 'case-study',
  seoKeywords: ['Dropbox system design', 'file storage architecture', 'cloud sync design'],
  sections: [
    {
      type: 'p',
      text: 'File storage interviews test whether you separate metadata from bytes, handle large uploads, and reason about sync across devices. It combines [API design](/system-design/api-design-rest-interviews), object storage (S3), and [caching](/system-design/caching-fundamentals-for-interviews). Clarify with the [interview framework](/system-design/how-to-approach-system-design-interviews): personal files vs shared folders, max file size, and real-time sync vs eventual consistency.',
    },
    { type: 'h2', text: 'Requirements' },
    { type: 'h3', text: 'Functional' },
    {
      type: 'ul',
      items: [
        'Upload, download, delete files and folders.',
        'Sync across multiple devices for the same user.',
        'Share files with other users (read/write permissions).',
        'Support large files (multi-GB) with resumable upload.',
        'Deduplication optional — same content stored once (content-addressable).',
      ],
    },
    { type: 'h3', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'Metadata operations under 100ms; blob throughput limited by client bandwidth.',
        '99.9% durability for blobs (S3 replication).',
        'Upload resume after network drop without re-sending completed chunks.',
        'ACL enforced on every metadata and download path.',
      ],
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'table',
      headers: ['Component', 'Role'],
      rows: [
        ['Upload/Download API', 'REST + pre-signed URLs for blob transfer'],
        ['Metadata DB (PostgreSQL)', 'file_id, user_id, path, version, blob_id, updated_at'],
        ['Blob store (S3)', 'Actual file bytes, keyed by content hash or blob_id'],
        ['Sync service', 'Long polling or WebSocket for change notifications'],
        ['Block/chunk service', 'Split large files into fixed-size chunks'],
        ['CDN', 'Serve popular downloads at edge'],
      ],
    },
    { type: 'h2', text: 'Upload flow (large file)' },
    {
      type: 'ol',
      items: [
        'Client POST /v1/files/init { name, size, parent_folder_id } → file_id, upload_id.',
        'Client splits file into 4MB chunks; compute hash per chunk.',
        'For each chunk: POST /v1/files/{file_id}/chunks { index, hash } → pre-signed S3 PUT URL if chunk new.',
        'Skip upload if server already has chunk hash (dedup).',
        'POST /v1/files/{file_id}/complete { upload_id, chunk_list } → metadata commit.',
        'Metadata row points to ordered list of blob chunk IDs.',
      ],
    },
    {
      type: 'callout',
      title: 'Why direct-to-S3',
      text: 'Bytes never stream through your API servers — only metadata and signed URLs. This is how you scale uploads without melting the app tier. Same pattern as [news feed](/system-design/design-news-feed) media upload.',
    },
    { type: 'h2', text: 'Download flow' },
    {
      type: 'ol',
      items: [
        'GET /v1/files/{file_id}/download → check ACL.',
        'Resolve chunk list from metadata; generate pre-signed GET URLs (or single URL if small file).',
        'Client downloads chunks in parallel; reassemble locally.',
        'Hot public files: serve via CDN with cache key = content hash.',
      ],
    },
    { type: 'h2', text: 'Sync across devices' },
    {
      type: 'p',
      text: 'Each file has monotonic version or updated_at. Client stores last_sync_cursor. On app open: GET /v1/sync?since=cursor → list of changed files (metadata only). Client pulls new blobs as needed. For near-real-time: WebSocket notifies "file X changed" — lighter than full [chat](/system-design/design-chat-messaging) but same push idea.',
    },
    { type: 'h2', text: 'Multi-device edge cases' },
    {
      type: 'ul',
      items: [
        'Device offline for days: cursor may expire; fall back to full metadata snapshot for that user.',
        'Same file edited on two laptops offline: conflict copies or LWW — state clearly in interview.',
        'Partial upload on phone: resume with same upload_id until TTL; other devices see file only after complete.',
        'Delete on web while mobile is offline: tombstone in sync delta; mobile removes local copy on next sync.',
      ],
    },
    { type: 'h2', text: 'Conflict resolution' },
    {
      type: 'p',
      text: 'Two devices edit offline: last-write-wins on metadata timestamp is simplest. Better UX: keep both versions as file (conflict copy). Interview answer: "I would start with LWW and mention conflict copies as v2." Use [unique IDs](/system-design/design-unique-id-generator) for file versions.',
    },
    { type: 'h2', text: 'Sharing and ACL' },
    {
      type: 'ul',
      items: [
        'shares table: file_id, grantee_user_id, permission (read/write).',
        'Check permission on every metadata and download request.',
        'Shared folder = tree of file_ids with inherited ACL (cache expanded ACL in Redis).',
      ],
    },
    { type: 'h2', text: 'Data model' },
    {
      type: 'ul',
      items: [
        'files: file_id, owner_id, parent_id, name, is_folder, latest_version',
        'file_versions: version_id, file_id, chunk_ids[], size, created_at',
        'chunks: chunk_hash, s3_key, size (dedup table)',
        'shares: file_id, user_id, role',
      ],
    },
    { type: 'h2', text: 'Capacity estimation' },
    {
      type: 'p',
      text: '50M users, 5GB average stored → 250PB logical; with 30% dedup by chunk hash → ~175PB in S3. Metadata: 500 files/user × 200 bytes ≈ 5TB relational — tiny vs blobs. API: 10M DAU × 20 metadata ops/day ≈ 2,300 RPS average; upload init spikes higher. Blob egress dominates cost — CDN for shared public links, infrequent-access tier for cold archives.',
    },
    { type: 'h2', text: 'Worked example: 2GB video upload' },
    {
      type: 'ol',
      items: [
        'Client calls init → receives file_id and upload_id.',
        'Splits into 512 × 4MB chunks; hashes each locally.',
        'For chunk 0: server returns pre-signed PUT URL; client uploads directly to S3.',
        'Chunk 47 already exists (same hash as another user\'s file) → server skips PUT, records chunk_hash in upload session.',
        'Complete commits file_versions row with ordered chunk list; sync pushes metadata delta to other devices.',
        'Other laptop sees new file in sync delta; downloads only missing chunks in parallel.',
      ],
    },
    { type: 'h2', text: 'Capacity and cost' },
    {
      type: 'p',
      text: 'Storage cost dominates — S3 + infrequent access tiers. Metadata is tiny vs blobs. 100M users × 10GB average = 1EB storage — mention sharding metadata by user_id and geographic S3 buckets. API tier scales with [load balancing](/system-design/load-balancing-and-scaling); blob tier scales with object store.',
    },
    { type: 'h2', text: 'Failure modes' },
    {
      type: 'table',
      headers: ['Failure', 'Mitigation'],
      rows: [
        ['Chunk upload incomplete', 'upload_id expires; garbage-collect orphan chunks'],
        ['Duplicate complete request', 'Idempotency on complete endpoint'],
        ['S3 outage', 'Retry; multi-region replication for enterprise tier'],
      ],
    },
    { type: 'h2', text: 'Small file fast path' },
    {
      type: 'p',
      text: 'Files under 5MB: single pre-signed PUT, no chunk orchestration. Metadata and blob commit in one transaction. Reduces API round-trips for photos and documents — most user files are small.',
    },
    { type: 'h2', text: 'Trash and versioning' },
    {
      type: 'p',
      text: 'Soft-delete: set deleted_at on metadata; garbage-collect blobs after 30 days if no version references chunk hash. Version history: new row in file_versions on each save; current pointer on files table. Users restore previous version by pointing latest_version backward.',
    },
    { type: 'h2', text: 'Latency budget' },
    {
      type: 'table',
      headers: ['Operation', 'Target'],
      rows: [
        ['List folder metadata', '< 100ms'],
        ['Init upload (API only)', '< 50ms'],
        ['Chunk PUT (direct S3)', 'Limited by client bandwidth'],
        ['Sync delta (metadata only)', '< 200ms'],
      ],
    },
    { type: 'h2', text: 'Security' },
    {
      type: 'ul',
      items: [
        'Pre-signed URLs expire in 15 minutes.',
        'Encrypt blobs at rest (S3 SSE).',
        'Virus scan optional hook on complete upload.',
        'ACL check on every metadata and download path.',
        '[Rate limit](/system-design/design-rate-limiter) upload init per user.',
      ],
    },
    { type: 'h2', text: 'Public share links' },
    {
      type: 'p',
      text: 'Optional: share_token (random UUID) maps to file_id with read-only ACL. GET /s/{token} redirects to CDN signed URL — similar to [URL shortener](/system-design/design-url-shortener) opaque links. Revoke by deleting share row.',
    },
    { type: 'h2', text: 'API summary' },
    {
      type: 'table',
      headers: ['Endpoint', 'Purpose'],
      rows: [
        ['POST /v1/files/init', 'Start upload; return file_id + upload_id'],
        ['POST /v1/files/{id}/chunks', 'Get pre-signed URL per chunk'],
        ['POST /v1/files/{id}/complete', 'Commit metadata after all chunks'],
        ['GET /v1/files/{id}/download', 'Pre-signed GET URLs'],
        ['GET /v1/folders/{id}/children', 'List folder metadata'],
        ['GET /v1/sync?since=cursor', 'Delta sync for client'],
      ],
    },
    { type: 'h2', text: 'Folder hierarchy' },
    {
      type: 'p',
      text: 'Folders are rows with is_folder=true. Path display is computed from parent chain or materialized path (/user/docs/2024). List children: SELECT * FROM files WHERE parent_id = ? AND deleted_at IS NULL — index on (parent_id, name) for fast folder browsing. Rename = update one metadata row; move = change parent_id with cycle check.',
    },
    { type: 'h2', text: 'Metadata sharding' },
    {
      type: 'p',
      text: 'Shard PostgreSQL by user_id hash when metadata QPS grows. Each user\'s tree lives on one shard — no cross-shard folder moves in v1. Blobs stay in global S3; only metadata shards. Cross-user share references file_id UUID globally unique via [Snowflake-style IDs](/system-design/design-unique-id-generator).',
    },
    { type: 'h2', text: 'Garbage collection' },
    {
      type: 'ol',
      items: [
        'Orphan chunks: uploaded but no file_version references after upload_id TTL.',
        'Deleted files: soft-delete metadata; after 30 days remove chunk refs.',
        'Reference-count chunks table; delete S3 object when refcount hits zero.',
        'Run GC as nightly [async job](/system-design/message-queues-async-processing) — never on request path.',
      ],
    },
    { type: 'h2', text: 'Metadata vs blob responsibilities' },
    {
      type: 'table',
      headers: ['Concern', 'Metadata DB', 'Blob store'],
      rows: [
        ['Name, path, ACL', 'Yes', 'No'],
        ['File bytes', 'No', 'Yes'],
        ['Dedup by hash', 'Chunk registry', 'Content-addressed keys'],
        ['CDN cache', 'No', 'Yes (GET URLs)'],
        ['Transactional rename', 'Yes', 'Unchanged blobs'],
      ],
    },
    { type: 'h2', text: 'Sample opening (first three minutes)' },
    {
      type: 'p',
      text: 'Interviewer: "Design Dropbox." You: "I will separate file metadata in PostgreSQL from blobs in S3. Uploads use pre-signed URLs so bytes never hit our API servers. Large files are chunked with content-hash dedup. Clients sync via metadata cursor and pull only changed blobs. Sharing uses ACL checks on every download."',
    },
    { type: 'h2', text: 'What to say in the last five minutes' },
    {
      type: 'p',
      text: 'Close with: "Metadata in Postgres, blobs in S3 via pre-signed URLs, chunked upload with content-hash dedup, sync via cursor + optional WebSocket, ACL on every access." That is a complete Dropbox-level answer.',
    },
    { type: 'h2', text: 'Mock interview checklist' },
    {
      type: 'ol',
      items: [
        'Separated metadata DB from blob object store.',
        'Walked chunked upload with content-hash dedup.',
        'Explained pre-signed S3 URLs — bytes bypass API tier.',
        'Described sync cursor and conflict strategy.',
        'Mentioned ACL on every access path.',
      ],
    },
    { type: 'h2', text: 'Closing summary' },
    {
      type: 'p',
      text: 'Never route file bytes through your API at scale. Metadata path and blob path are separate designs — nail both in the interview.',
    },
  ],
}

export default article
