import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-api-gateway',
  title: 'Design an API Gateway',
  description:
    'How to design an API gateway for interviews: routing, auth, rate limiting, SSL termination, request transformation, and how it differs from a load balancer.',
  readMinutes: 14,
  published: '2026-07-06',
  category: 'fundamentals',
  seoKeywords: [
    'API gateway system design',
    'API gateway vs load balancer',
    'microservices gateway interview',
    'Kong AWS API Gateway architecture',
  ],
  sections: [
    {
      type: 'p',
      text: 'Every diagram has a box labeled "API Gateway" — fewer candidates can explain what it does differently from a [load balancer](/system-design/load-balancing-and-scaling). The gateway is the front door to your microservices: it terminates TLS, authenticates callers, enforces [rate limits](/system-design/design-rate-limiter), routes `/users` to the user service and `/orders` to the order service, and returns consistent error shapes. This article gives you language that sounds like someone who has shipped APIs, not just memorized AWS product names.',
    },
    {
      type: 'p',
      text: 'Pair this with [REST API design](/system-design/api-design-rest-interviews) and the [interview framework](/system-design/how-to-approach-system-design-interviews). Gateways implement policies; they should not contain business logic like calculating shipping tax.',
    },
    { type: 'h2', text: 'Gateway vs load balancer' },
    {
      type: 'table',
      headers: ['Concern', 'Load balancer (L4/L7)', 'API gateway'],
      rows: [
        ['Primary job', 'Distribute traffic to healthy backends', 'Route requests by path/header and apply policies'],
        ['TLS', 'Often terminates SSL', 'Terminates SSL + may validate JWT'],
        ['Routing', 'Host/path to pool', 'Path to service + version + canary weights'],
        ['Auth', 'Usually none', 'API keys, OAuth, mTLS'],
        ['Rate limits', 'Sometimes basic', 'Per client, per route, per tier'],
        ['Examples', 'AWS ALB, NGINX', 'Kong, Apigee, AWS API Gateway'],
      ],
    },
    {
      type: 'p',
      text: 'In practice, managed clouds merge layers: ALB + API Gateway + WAF. In interviews, draw them as two boxes so you can discuss responsibilities clearly.',
    },
    { type: 'h2', text: 'Core responsibilities' },
    {
      type: 'ol',
      items: [
        'Request routing — map external URL to internal service cluster.',
        'Authentication and authorization — validate JWT or API key before backend work.',
        'Rate limiting and quota enforcement — protect downstream databases.',
        'Request/response transformation — header injection, JSON ↔ gRPC transcoding.',
        'Observability — access logs, metrics, distributed tracing IDs.',
        'SSL/TLS termination — certificates managed at the edge.',
      ],
    },
    { type: 'h2', text: 'Request path (walk through aloud)' },
    {
      type: 'ol',
      items: [
        'Client sends `GET https://api.example.com/v2/orders/42` with Bearer token.',
        'Gateway terminates TLS, assigns `X-Request-Id`, checks WAF rules.',
        'Rate limiter bucket for `client_id` — 429 if empty.',
        'Auth plugin validates JWT signature and `exp` claim.',
        'Router matches `/v2/orders/*` → order-service Kubernetes service.',
        'Optional: strip `/v2` prefix, add `X-User-Id` header from JWT claims.',
        'Forward to healthy pod via internal load balancer; return response unchanged or normalized.',
      ],
    },
    { type: 'h2', text: 'Routing strategies' },
    {
      type: 'ul',
      items: [
        'Path-based: `/users` → user-svc, `/payments` → payment-svc ([payment design](/system-design/design-payment-system)).',
        'Header-based: `X-Api-Version: 2` → v2 cluster.',
        'Canary: 95% traffic to stable, 5% to new version — weighted routing.',
        'Geographic: route EU users to `eu-west` cluster for [CAP](/system-design/cap-theorem-consistency-models) latency wins.',
      ],
    },
    { type: 'h2', text: 'Authentication patterns' },
    {
      type: 'p',
      text: 'API keys in header for server-to-server and developer portals. OAuth 2.0 bearer tokens for user sessions. Gateway validates JWT locally with public keys (JWKS) — no call to auth service per request if token is self-contained. For invalid tokens, return 401 without hitting backend. Internal service mesh may use mTLS instead; gateway is the trust boundary for public internet.',
    },
    { type: 'h2', text: 'Rate limiting at the edge' },
    {
      type: 'p',
      text: 'Enforcing limits at the gateway protects all services at once. Store counters in Redis with token bucket Lua scripts — same design as our [rate limiter article](/system-design/design-rate-limiter). Different limits per route: `POST /login` stricter than `GET /public/status`. Return `X-RateLimit-Remaining` headers per [REST best practices](/system-design/api-design-rest-interviews).',
    },
    { type: 'h2', text: 'High availability' },
    {
      type: 'ul',
      items: [
        'Run multiple gateway instances behind an L4 load balancer (yes, LB in front of gateway).',
        'Config is declarative (YAML/CRD) synced from Git — no manual drift.',
        'Health checks on gateway itself; circuit break to unhealthy backends.',
        'Cold start: gateway stateless except Redis rate-limit keys — scale horizontally.',
      ],
    },
    { type: 'h2', text: 'When backends are overloaded' },
    {
      type: 'p',
      text: 'Circuit breaker: after N failures to order-service, gateway fails fast with 503 instead of queueing threads. Bulkhead: separate connection pools per upstream so one slow service does not exhaust all sockets. Mention timeout budgets — client sees 30s timeout but gateway aborts at 5s and returns 504.',
    },
    { type: 'h2', text: 'Anti-patterns to avoid' },
    {
      type: 'callout',
      title: 'Do not put business logic in the gateway',
      text: 'Calculating discounts or joining user + order tables in gateway Lua scripts creates a distributed monolith. Gateway policies only: auth, route, limit, log.',
    },
    {
      type: 'ul',
      items: [
        'Chaining 12 sync HTTP calls inside gateway for one client request — use BFF or GraphQL layer instead.',
        'Storing session shopping cart in gateway memory — use [Redis](/system-design/design-distributed-cache-redis).',
        'Different error JSON per service without normalization — clients suffer.',
      ],
    },
    { type: 'h2', text: 'Plugin model (Kong / Envoy style)' },
    {
      type: 'p',
      text: 'Gateways extend via plugins: auth, rate limit, logging, CORS, request transformation. Each plugin runs in a defined order (auth before rate limit before route). Custom plugins in Lua (Kong) or WASM (Envoy) for company-specific rules. Keep plugins stateless; state lives in Redis. This architecture lets platform team ship new policies without redeploying every microservice.',
    },
    {
      type: 'table',
      headers: ['Plugin', 'Typical order', 'Purpose'],
      rows: [
        ['Request ID', '1', 'Generate correlation ID'],
        ['Auth', '2', 'Validate JWT / API key'],
        ['Rate limit', '3', 'Token bucket in Redis'],
        ['ACL', '4', 'Route-level role check'],
        ['Proxy', '5', 'Forward to upstream'],
        ['Response transform', '6', 'Normalize errors'],
      ],
    },
    {
      type: 'p',
      text: 'Service mesh (Istio/Linkerd) adds sidecar proxies with similar policies inside the cluster — gateway handles north-south (internet to cluster), mesh handles east-west (service to service). Junior candidates conflate them; senior candidates draw both layers.',
    },
    { type: 'h2', text: 'BFF and GraphQL (when gateway is not enough)' },
    {
      type: 'p',
      text: 'Mobile app home screen needs user profile + orders + notifications in one screen. Three REST calls triple latency. Backend-for-frontend (BFF) service aggregates upstream calls server-side, or GraphQL gateway resolves one query graph. Position BFF behind the gateway: gateway handles auth and limits; BFF handles composition. Do not merge BFF into gateway config — separate deploy cycles.',
    },
    { type: 'h2', text: 'Observability at the edge' },
    {
      type: 'ul',
      items: [
        'Structured access logs: method, path, status, latency, client_id, request_id.',
        'Propagate `X-Request-Id` to all downstream services for distributed traces.',
        'Metrics per route: p50/p99 latency, 4xx/5xx rates, rate-limit denials.',
        'WAF integration for SQL injection and bot signatures before traffic hits backends.',
      ],
    },
    { type: 'h2', text: 'Worked example: login abuse' },
    {
      type: 'p',
      text: 'Attacker hammers `POST /v1/login` with credential stuffing. Gateway rule: 10 requests per minute per IP on `/login`, stricter than global 1000/min. Failed auth returns identical 401 body (no user enumeration). After threshold, CAPTCHA challenge plugin runs before forwarding. Backend database never sees 100K bogus attempts — gateway absorbed them. Tie this story to [rate limiter design](/system-design/design-rate-limiter) token buckets.',
    },
    {
      type: 'p',
      text: 'Multi-region gateways: deploy gateway clusters per region with shared Redis for rate limits (CRDT or centralized Redis with cross-region latency trade-off). Route users via geo-DNS. Config propagation via GitOps — same route definitions everywhere, different upstream service discovery per cluster.',
    },
    { type: 'h2', text: 'Zero trust and mTLS (internal APIs)' },
    {
      type: 'p',
      text: 'Public gateway terminates TLS from browsers. Inside the cluster, gateway-to-service calls may use mutual TLS so a compromised pod cannot impersonate the gateway. SPIFFE/SPIRE issues short-lived certs. Mention this when interviewer asks "how do you prevent lateral movement" — separates mid-level from senior answers.',
    },
    {
      type: 'p',
      text: 'API keys for partner integrations rotate via secrets manager; gateway hot-reloads keys without restart. Per-partner rate limits and audit logs satisfy enterprise contracts.',
    },
    { type: 'h2', text: 'Interview summary' },
    {
      type: 'p',
      text: 'Explain gateway as policy enforcement point vs LB as traffic distributor. Walk one request through auth, rate limit, route, forward. Name Redis for limits, JWT for auth, circuit breakers for resilience. Reference how your [e-commerce](/system-design/design-ecommerce-shopping-cart) or [chat](/system-design/design-chat-messaging) design exposes public APIs through this layer. That is a complete gateway answer in five minutes.',
    },
  ],
}

export default article
