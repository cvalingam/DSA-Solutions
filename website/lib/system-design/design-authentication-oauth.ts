import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-authentication-oauth',
  title: 'Design an Authentication System (OAuth / SSO)',
  description:
    'How to design authentication and SSO for interviews: sessions vs JWTs, OAuth 2.0 / OIDC flows, refresh tokens, MFA, logout, and multi-tenant identity.',
  readMinutes: 13,
  published: '2026-08-05',
  category: 'case-study',
  seoKeywords: [
    'authentication system design interview',
    'OAuth 2.0 system design',
    'SSO design interview',
    'JWT vs session design',
  ],
  sections: [
    {
      type: 'p',
      text: 'Auth looks easy until tokens leak, refresh rotates wrong, or someone asks “how does logout work with JWTs?” Companies ask this because every product sits behind an identity boundary - [API gateways](/system-design/design-api-gateway), [payments](/system-design/design-payment-system), and internal tooling all depend on it. Decide early whether you are designing first-party login, OAuth for third-party apps, or enterprise SSO (SAML/OIDC).',
    },
    {
      type: 'p',
      text: 'Scope with the [framework](/system-design/how-to-approach-system-design-interviews): password login + social login, issue access tokens, refresh, revoke, MFA, and authorize APIs. Authorization (RBAC/ABAC) can stay shallow unless they push.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Register / login with password (hashed), optional social IdP.',
        'Issue short-lived access tokens and longer-lived refresh tokens.',
        'OAuth 2.0 authorization code flow (+ PKCE for public clients).',
        'OIDC ID tokens for “who is the user” claims.',
        'Logout / revoke; MFA (TOTP or WebAuthn) for step-up.',
        'Admin: disable user, rotate keys, audit login events.',
      ],
    },
    { type: 'h2', text: 'Non-functional requirements' },
    {
      type: 'ul',
      items: [
        'Login p99 under a few hundred ms (excluding MFA).',
        'High availability: outages lock people out of everything else.',
        'Secrets never logged; passwords only as salted hashes (Argon2/bcrypt).',
        'Horizontal scale of token validation (stateless or shared session store).',
      ],
    },
    {
      type: 'callout',
      title: 'Sessions and JWTs are tools, not religions',
      text: 'Server sessions (opaque cookie → Redis) revoke instantly. JWTs validate without a DB hit but revoke poorly. Real systems often use short JWT access tokens plus server-side refresh or a denylist for emergencies. Say that trade-off out loud.',
    },
    { type: 'h2', text: 'Core components' },
    {
      type: 'ol',
      items: [
        'Auth service: credentials, MFA, issuance, OAuth endpoints.',
        'User directory: profiles, password hashes, IdP links.',
        'Session / token store: Redis for sessions or refresh-token hashes.',
        'Key management: signing keys (RSA/EC) with rotation.',
        'Gateway / resource servers: validate access tokens on each API call.',
      ],
    },
    { type: 'h2', text: 'Password login path' },
    {
      type: 'ol',
      items: [
        'Client POSTs email + password over TLS.',
        'Auth looks up user, verifies hash, applies lockouts / [rate limits](/system-design/design-rate-limiter).',
        'Optional MFA challenge.',
        'Issue access (5-15 min) + refresh (days); set HttpOnly Secure cookies or return bearer tokens for SPAs/mobile.',
        'Write an audit log to your [logging](/system-design/design-distributed-logging-system) pipeline.',
      ],
    },
    { type: 'h2', text: 'OAuth 2.0 authorization code (+ PKCE)' },
    {
      type: 'ol',
      items: [
        'Client redirects user to /authorize with client_id, redirect_uri, scope, state, code_challenge.',
        'User authenticates and consents.',
        'Auth redirects back with a one-time code.',
        'Client exchanges code + code_verifier at /token; receives tokens.',
        'Resource server validates access token on APIs.',
      ],
    },
    {
      type: 'p',
      text: 'Never recommend implicit flow for new work. For first-party mobile/SPA, PKCE is mandatory. For SSO into many internal apps, this IdP becomes the company OIDC provider - apps trust its JWKS endpoint.',
    },
    { type: 'h2', text: 'Token design' },
    {
      type: 'table',
      headers: ['Token', 'Lifetime', 'Stored where', 'Revocation'],
      rows: [
        ['Access JWT', '5-15 min', 'Client memory / cookie', 'Wait expiry or denylist jti'],
        ['Refresh', 'Days-weeks', 'Hash in DB/Redis', 'Delete hash on logout/theft'],
        ['Session id', 'Hours', 'Redis', 'Delete key'],
      ],
    },
    {
      type: 'p',
      text: 'Rotate refresh tokens on use (detect reuse → revoke family). Sign JWTs with rotatable keys; publish JWKS. Keep claims minimal (sub, aud, scope, exp). Push heavy profile reads to a user service, not the token.',
    },
    { type: 'h2', text: 'Logout and compromise' },
    {
      type: 'ul',
      items: [
        'Delete server session or refresh-token hash.',
        'Clear cookies; instruct clients to drop memory tokens.',
        'For stolen access JWTs: short TTL + optional denylist until exp.',
        'Global “logout everywhere”: bump token_version on the user row and reject older versions.',
      ],
    },
    { type: 'h2', text: 'Scale and multi-region' },
    {
      type: 'p',
      text: 'Auth is read-heavy after login (validate) and write-spiky at morning peaks. Put session keys in a [distributed cache](/system-design/design-distributed-cache-redis). Replicate user directory with care - password changes need strong consistency for that row. Regional auth PoPs reduce latency; centralize key material. Cross-link [sharding](/system-design/database-sharding-replication) if user counts blow up.',
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'Mobile app starts OAuth + PKCE against accounts.example.com.',
        'User completes password + TOTP; code issued.',
        'App exchanges code; stores refresh in OS secure storage; keeps access in memory.',
        'API gateway validates JWT via JWKS; on day 8 refresh rotates and old refresh is rejected if replayed.',
      ],
    },
    { type: 'h2', text: 'Interview summary' },
    {
      type: 'p',
      text: 'Clarify first-party vs OAuth vs SSO. Prefer authorization code + PKCE. Contrast session store vs short JWTs. Explain refresh rotation and logout. That narrative beats drawing boxes alone.',
    },
  ],
}

export default article
