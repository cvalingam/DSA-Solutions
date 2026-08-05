import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-object-storage-s3',
  title: 'Design Object Storage (Amazon S3)',
  description:
    'How to design S3-style object storage for interviews: buckets and keys, multipart upload, erasure coding vs replication, metadata indexes, consistency, and CDN egress.',
  readMinutes: 13,
  published: '2026-08-05',
  category: 'case-study',
  seoKeywords: [
    'object storage system design',
    'design Amazon S3 interview',
    'S3 multipart upload design',
    'erasure coding vs replication',
  ],
  sections: [
    {
      type: 'p',
      text: 'Object storage is the blob layer under almost every product: photos on [Instagram](/system-design/design-instagram-photo-sharing), video segments for [Netflix](/system-design/design-video-streaming-netflix), backups, [CDN](/system-design/design-cdn-content-delivery-network) origins, and log archives. Interviewers ask it because it forces you to separate a tiny amount of metadata from petabytes of immutable bytes - and to talk honestly about durability, cost, and consistency.',
    },
    {
      type: 'p',
      text: 'It is not the same problem as [Dropbox-style file sync](/system-design/design-file-storage-dropbox). Here clients speak HTTP PUT/GET to a key, not a filesystem with rename semantics. Scope with the [framework](/system-design/how-to-approach-system-design-interviews): PUT/GET/DELETE, multipart for large objects, strong or eventual read-after-write, Eleven 9s durability marketing.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'PutObject(bucket, key, body, headers) and GetObject / DeleteObject.',
        'ListObjects with prefix and pagination (lexicographic keys).',
        'Multipart upload: initiate, upload parts, complete (or abort).',
        'Optional: versioning, lifecycle policies (hot → cold → delete), pre-signed URLs.',
        'Auth: IAM-style identity, bucket policies, encryption at rest.',
      ],
    },
    { type: 'h2', text: 'Non-functional requirements' },
    {
      type: 'ul',
      items: [
        'Durability first (lose almost no objects), availability second.',
        'Throughput scales with number of keys and clients; single-key writes are often limited.',
        'Metadata lookups must be fast; large GETs stream from disk/SSD/HDD tiers.',
        'Cost predictable: storage GB-month, PUT/GET request counts, egress.',
      ],
    },
    {
      type: 'callout',
      title: 'Metadata is the hard part at scale',
      text: 'Bytes are relatively easy once chunked across machines. Finding where an object lives, listing prefixes, and surviving metadata failures are what break designs. Budget time for the index, not only for placing disks.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'ol',
      items: [
        'Front door: HTTP API / load balancers with auth and [rate limits](/system-design/design-rate-limiter).',
        'Metadata service: maps (bucket, key) → list of chunk IDs, checksums, ACL, size, version.',
        'Data nodes (storage servers): store chunks on local disks; report health.',
        'Placement / placement-master: decides which nodes hold replicas or erasure shards.',
        'Optional: multipart staging, lifecycle workers, repair/scrubbers.',
      ],
    },
    { type: 'h2', text: 'Data model' },
    {
      type: 'table',
      headers: ['Store', 'What it holds', 'Notes'],
      rows: [
        ['Metadata DB', 'bucket, key, version, chunk list, etag, ACL', 'Strong consistency preferred for PUT visibility'],
        ['Chunk store', 'opaque bytes + checksum', 'Immutable; rewrite = new object version'],
        ['Part index', 'upload_id → parts', 'Used until CompleteMultipart'],
      ],
    },
    {
      type: 'p',
      text: 'Pick something that can take high write QPS on metadata ([key-value](/system-design/design-key-value-store) or NewSQL). Keys are often hashed for data placement but stored sorted for ListObjects - or you maintain a separate prefix index. Mention both path-style and virtual-hosted URLs if asked about API shape.',
    },
    { type: 'h2', text: 'Putting an object' },
    {
      type: 'ol',
      items: [
        'Client PUTs; API authenticates and computes content hash.',
        'For small objects: write N replicas or erasure shards to data nodes, then commit metadata.',
        'For large objects: client starts multipart, uploads parts in parallel to different nodes, then Complete writes final metadata.',
        'Return etag / version id. Failures before metadata commit leave orphan chunks for GC.',
      ],
    },
    {
      type: 'p',
      text: 'Order matters: data first, metadata second (or two-phase). If metadata commits before all shards land, readers may 404 or get incomplete data. GC workers reap unreferenced chunks from incomplete uploads after a TTL.',
    },
    { type: 'h2', text: 'Replication vs erasure coding' },
    {
      type: 'table',
      headers: ['Scheme', 'Storage overhead', 'Repair cost', 'When to use'],
      rows: [
        ['3-way replication', '~3x', 'Cheap (copy one replica)', 'Hot / small objects, simple ops'],
        ['Erasure coding (e.g. 6+3)', '~1.5x', 'Heavier (reconstruct)', 'Cold / large objects, cost sensitive'],
      ],
    },
    {
      type: 'p',
      text: 'Interviewers love this trade-off. Hot tiers often replicate; cold tiers erasure-code. Cross-AZ or cross-region copies buy durability against site loss. Tie durability math loosely to independent failure domains - do not invent fake 11-nines proofs.',
    },
    { type: 'h2', text: 'Consistency' },
    {
      type: 'p',
      text: 'Modern S3 offers strong read-after-write for new objects in a region. In an interview, say: after a successful PUT, metadata is committed so subsequent GETs see the object. Listings and cross-region replication may lag. Overwrites with versioning keep prior versions addressable. Relate choices to [CAP](/system-design/cap-theorem-consistency-models): metadata quorum CP-ish, bulk data availability weighted.',
    },
    { type: 'h2', text: 'Listing and hot prefixes' },
    {
      type: 'p',
      text: 'ListObjects by prefix is a classic hotspot (logs/2026/08/05/...). Shard metadata by hash(bucket+key) for GET/PUT, and maintain a secondary index for lexicographic list, or require clients to spread keys. Same advice as [sharding](/system-design/database-sharding-replication): avoid monotonically increasing keys for every write.',
    },
    { type: 'h2', text: 'Reads, CDN, and range GETs' },
    {
      type: 'p',
      text: 'GET resolves metadata → streams chunks (possibly parallel). Support HTTP Range for video seekers. Front popular objects with a [CDN](/system-design/design-cdn-content-delivery-network); origin remains object storage. Pre-signed URLs offload auth to short-lived signatures so browsers talk to storage directly.',
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'User uploads a 5 GB video: CreateMultipartUpload → 50 × 100 MB parts in parallel.',
        'Each part lands on distinct failure domains; checksums recorded.',
        'CompleteMultipart writes metadata mapping key → ordered parts.',
        'Player issues Range GETs; CDN caches popular byte ranges at the edge.',
      ],
    },
    { type: 'h2', text: 'Interview summary' },
    {
      type: 'p',
      text: 'Separate metadata from bytes. Commit data then metadata. Compare replication vs erasure coding with cost. Call out multipart, orphan GC, and prefix hotspots. That is a complete S3-style interview answer.',
    },
  ],
}

export default article
