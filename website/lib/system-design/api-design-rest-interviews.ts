import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'api-design-rest-interviews',
  title: 'API Design and REST Best Practices for Interviews',
  description:
    'How to design REST APIs in system design interviews: resources, HTTP verbs, pagination, versioning, errors, idempotency, and rate-limit headers.',
  readMinutes: 10,
  published: '2026-06-17',
  category: 'fundamentals',
  sections: [
    {
      type: 'p',
      text: 'System design interviews often end with "design the API." You do not need to memorize every RFC — you need consistent resource naming, correct HTTP semantics, and error shapes that clients can rely on. This guide pairs with our [rate limiter](/system-design/design-rate-limiter) (429 responses) and [URL shortener](/system-design/design-url-shortener) (POST /v1/urls, GET /{code}) examples.',
    },
    { type: 'h2', text: 'REST in one paragraph' },
    {
      type: 'p',
      text: 'REST models your system as resources (nouns) identified by URLs. HTTP verbs express actions on those resources. State lives on the server; each request carries enough context (auth, body) to be understood independently. Good API design makes the resource graph obvious to a new engineer reading the docs.',
    },
    { type: 'h2', text: 'Resource naming' },
    {
      type: 'ul',
      items: [
        'Use plural nouns: /users, /posts, /conversations.',
        'Nest for ownership: /users/{id}/posts — but avoid depth > 2.',
        'Actions that are not CRUD: POST /posts/{id}/like or POST /orders/{id}/cancel as sub-resource.',
        'Lowercase, hyphens for multi-word: /read-receipts.',
      ],
    },
    {
      type: 'callout',
      title: 'Bad vs good',
      text: 'Avoid: GET /getUserPosts?userId=5. Prefer: GET /users/5/posts. Avoid verbs in paths unless the operation is not a resource (e.g. POST /search with body).',
    },
    { type: 'h2', text: 'HTTP methods' },
    {
      type: 'table',
      headers: ['Method', 'Meaning', 'Idempotent?', 'Safe?'],
      rows: [
        ['GET', 'Read resource', 'Yes', 'Yes'],
        ['POST', 'Create or non-idempotent action', 'No', 'No'],
        ['PUT', 'Replace entire resource', 'Yes', 'No'],
        ['PATCH', 'Partial update', 'No*', 'No'],
        ['DELETE', 'Remove resource', 'Yes', 'No'],
      ],
    },
    {
      type: 'p',
      text: '*PATCH idempotency depends on implementation; mention Idempotency-Key header for POST payments and message sends.',
    },
    { type: 'h2', text: 'Status codes that matter' },
    {
      type: 'table',
      headers: ['Code', 'When'],
      rows: [
        ['200 OK', 'Successful GET, PUT, PATCH with body'],
        ['201 Created', 'POST created resource; include Location header'],
        ['204 No Content', 'DELETE success, empty body'],
        ['400 Bad Request', 'Validation error — client fixable'],
        ['401 Unauthorized', 'Missing or invalid auth'],
        ['403 Forbidden', 'Authenticated but not allowed'],
        ['404 Not Found', 'Resource does not exist'],
        ['409 Conflict', 'Duplicate create, version mismatch'],
        ['429 Too Many Requests', '[Rate limited](/system-design/design-rate-limiter) — include Retry-After'],
        ['500 Internal Server Error', 'Server bug — do not leak stack traces'],
      ],
    },
    { type: 'h2', text: 'Pagination' },
    {
      type: 'p',
      text: 'Offset pagination (page=2&limit=20) is simple but slow on deep pages — the DB skips millions of rows. Cursor pagination (after=cursor_token) uses an indexed position and scales for feeds and message history.',
    },
    {
      type: 'ul',
      items: [
        'Response: { data: [...], next_cursor: "eyJ...", has_more: true }',
        'Cursor is opaque (base64 of last sort key + id).',
        'Used in [news feed](/system-design/design-news-feed) and [chat](/system-design/design-chat-messaging) designs.',
      ],
    },
    { type: 'h2', text: 'Versioning' },
    {
      type: 'ul',
      items: [
        'URL path: /v1/users — clearest for public APIs.',
        'Header: Accept: application/vnd.api+json;version=1 — keeps URLs stable.',
        'Never break v1 without a new version; deprecate with sunset headers.',
      ],
    },
    { type: 'h2', text: 'Error response contract' },
    {
      type: 'p',
      text: 'Return a consistent JSON shape so clients can branch on machine-readable codes:',
    },
    {
      type: 'ul',
      items: [
        '{ "error": { "code": "INVALID_SHORT_CODE", "message": "Human readable", "field": "code" } }',
        'Log request_id on server; return request_id in body for support tickets.',
        'Same idea as the [rate limiter response contract](/system-design/design-rate-limiter).',
      ],
    },
    { type: 'h2', text: 'Authentication sketch' },
    {
      type: 'p',
      text: 'Bearer JWT in Authorization header for mobile/SPA. API keys for server-to-server. OAuth for third-party access. Say where auth terminates: API gateway validates JWT, passes user_id to internal services.',
    },
    { type: 'h2', text: 'Example: URL shortener API' },
    {
      type: 'ol',
      items: [
        'POST /v1/urls — body: { "url": "https://...", "customAlias": "optional" } → 201 { "shortUrl": "...", "shortCode": "abc12" }',
        'GET /v1/urls/{code} — redirect 302 or JSON for API clients',
        'DELETE /v1/urls/{code} — 204 if owner matches',
        'GET /v1/urls?cursor=... — list user\'s links (authenticated)',
      ],
    },
    { type: 'h2', text: 'Rate-limit response headers' },
    {
      type: 'p',
      text: 'When returning 429, include machine-readable headers so clients back off correctly — same contract as our [rate limiter design](/system-design/design-rate-limiter):',
    },
    {
      type: 'ul',
      items: [
        'Retry-After: seconds until the client may retry.',
        'X-RateLimit-Limit: max requests in the window.',
        'X-RateLimit-Remaining: requests left in current window.',
        'X-RateLimit-Reset: Unix timestamp when the window resets.',
      ],
    },
    { type: 'h2', text: 'Idempotency for write endpoints' },
    {
      type: 'p',
      text: 'POST /payments and POST /messages must not double-charge or duplicate on retry. Clients send Idempotency-Key: <uuid> header; server stores key → response mapping for 24 hours. Duplicate key returns the original 201 without re-executing. Mention this for any create endpoint where failure mid-flight is plausible.',
    },
    { type: 'h2', text: 'Request validation' },
    {
      type: 'p',
      text: 'Return 400 with field-level errors for malformed JSON or missing required fields — not 500. Validate URL schemes on shortener create (https only unless enterprise). Enforce max body size at the API gateway before traffic hits app servers, which ties to [load balancer](/system-design/load-balancing-and-scaling) and gateway placement in your diagram.',
    },
    { type: 'h2', text: 'Example: news feed endpoints' },
    {
      type: 'ol',
      items: [
        'POST /v1/posts — create post → 201 { post_id, created_at }',
        'GET /v1/feed?cursor=...&limit=20 — home timeline → 200 { posts, next_cursor }',
        'POST /v1/users/{id}/follow — follow user → 204',
        'DELETE /v1/users/{id}/follow — unfollow → 204',
      ],
    },
    { type: 'h2', text: 'Example: chat endpoints' },
    {
      type: 'ol',
      items: [
        'POST /v1/conversations/{id}/messages — body: { text, client_msg_id } → 201 { server_msg_id }',
        'GET /v1/conversations/{id}/messages?after=cursor — history sync → 200',
        'POST /v1/conversations/{id}/read — update read receipt → 204',
      ],
    },
    { type: 'h2', text: 'PUT vs PATCH in practice' },
    {
      type: 'p',
      text: 'PUT replaces the entire resource — client sends full object; missing fields become null. PATCH sends a partial diff (JSON Merge Patch or JSON Patch). Use PUT for small resources with stable shape; PATCH for large profiles where clients update one field. In interviews, saying "PATCH /users/me with { display_name }" beats debating RFCs.',
    },
    { type: 'h2', text: 'Filtering, sorting, and sparse fieldsets' },
    {
      type: 'ul',
      items: [
        'GET /posts?author_id=5&sort=-created_at — filter and sort via query params.',
        'GET /users?fields=id,name — reduce payload on mobile.',
        'Cap limit= at 100 server-side even if client asks for 10,000.',
        'Document which filters are indexed — unindexed filters become full table scans.',
      ],
    },
    { type: 'h2', text: 'Rate limiter API surface' },
    {
      type: 'p',
      text: 'If designing a standalone [rate limiter service](/system-design/design-rate-limiter), expose internal and admin APIs:',
    },
    {
      type: 'table',
      headers: ['Endpoint', 'Purpose'],
      rows: [
        ['POST /v1/check', 'Internal: { key, limit, window } → { allowed, remaining }'],
        ['GET /v1/rules/{api_key}', 'Admin: view configured limits'],
        ['PUT /v1/rules/{api_key}', 'Admin: update tier limits'],
        ['GET /health', 'Load balancer readiness probe'],
      ],
    },
    { type: 'h2', text: 'Content type and validation' },
    {
      type: 'p',
      text: 'Require Content-Type: application/json on POST/PATCH bodies. Reject unsupported types with 415 Unsupported Media Type. Return 413 Payload Too Large when body exceeds gateway limit — validate before parsing into app memory. For the URL shortener, reject non-http(s) schemes and private IP ranges in the url field with 400 and a clear error code.',
    },
    { type: 'h2', text: 'CORS and public APIs' },
    {
      type: 'p',
      text: 'Browser clients need Access-Control-Allow-Origin on API responses. Preflight OPTIONS requests hit before POST from another domain. Mention CORS only if the prompt includes a web SPA — mobile apps use native HTTP and skip CORS. API gateway often centralises CORS rules.',
    },
    { type: 'h2', text: 'Webhooks (when the interviewer asks)' },
    {
      type: 'p',
      text: 'Instead of polling, register POST /v1/webhooks on your platform; you POST to customer URLs on events (payment.succeeded, message.received). Sign payloads with HMAC; retry with exponential backoff; return 2xx quickly from receiver. Out of scope for most 45-minute designs unless the product is an API platform.',
    },
    { type: 'h2', text: 'Common API mistakes in interviews' },
    {
      type: 'table',
      headers: ['Mistake', 'Better approach'],
      rows: [
        ['Verbs in URLs (/createUser)', 'POST /users'],
        ['200 on POST create', '201 with Location header'],
        ['500 on validation failure', '400 with field errors'],
        ['Offset pagination on billion-row feed', 'Cursor pagination'],
        ['No idempotency on payment POST', 'Idempotency-Key header'],
        ['Leaking stack traces in errors', 'Generic 500 + request_id in logs only'],
      ],
    },
    { type: 'h2', text: 'What to say in the last five minutes' },
    {
      type: 'p',
      text: 'List 5–6 endpoints with methods and status codes for the system you just designed. Mention cursor pagination for feeds or chat history, 429 with Retry-After for abuse paths, and idempotency keys for creates. Point auth termination at the API gateway. That is sufficient API depth for most loops.',
    },
    { type: 'h2', text: 'Mock interview checklist' },
    {
      type: 'ol',
      items: [
        'Resources are plural nouns; no verbs in paths.',
        'Correct status codes (201 create, 204 delete, 409 conflict).',
        'Pagination strategy matches data scale (cursor for feed/chat).',
        'Consistent error JSON with machine-readable codes.',
        'Rate limit headers on 429 for public APIs.',
        'Version prefix /v1/ on all external routes.',
      ],
    },
    { type: 'h2', text: 'Closing summary' },
    {
      type: 'p',
      text: 'In interviews, spend five minutes listing 4–6 endpoints with methods, status codes, and one pagination strategy. Mention idempotency keys for writes that must not duplicate. That demonstrates API thinking without drowning in OpenAPI details.',
    },
  ],
}

export default article
