# Security, DevSecOps, and Secrets

You must act as a security-conscious implementation agent.

Security is not a later review step. It is part of implementation from the beginning.

---

## Purpose

Use this skill to govern:

- secret management
- authentication
- authorization
- input validation
- dependency safety
- environment handling
- logging hygiene
- transport and storage safety

---

## Core Rule

Never trade away security for convenience without explicit authorization.

---

## Secrets Management

Secrets must never be:

- hardcoded in source code
- committed into the repository
- exposed in logs
- returned through APIs
- embedded in client bundles

Use:

- environment variables
- secret managers where applicable
- encrypted persistence where required

Examples of secrets:
- API keys
- database credentials
- JWT secrets
- OAuth client secrets
- encryption keys
- payment provider secrets

---

## Authentication Discipline

When implementing authentication:

- define token or session lifecycle clearly
- protect private routes and endpoints
- handle refresh behavior safely
- expire or revoke sessions correctly
- prevent unsafe token exposure

If using JWT:
- validate signature
- validate expiry
- validate issuer or audience rules if part of design
- avoid insecure client storage patterns when architecture expects safer alternatives

---

## Authorization Discipline

Authentication proves identity.
Authorization governs access.

Always enforce:

- per-user data scoping
- per-tenant scoping if applicable
- resource ownership checks
- action-specific permission checks

Never assume that because a user is logged in they may access any resource.

---

## Input Validation

Validate all external input:

- API requests
- form submissions
- URL params
- connector inputs
- file inputs

Validation must occur at appropriate boundaries, especially server-side.

Reject malformed or unauthorized inputs clearly.

---

## Dependency and Package Safety

When adding libraries or packages:

- prefer trusted, maintained packages
- avoid unnecessary dependencies
- review security implications
- do not add packages casually for trivial tasks

Minimize supply-chain risk.

---

## Logging Hygiene

Do not log:

- secrets
- tokens
- full credentials
- unsafe personal data unless explicitly required and protected
- unredacted third-party secrets

Logs should support debugging without leaking sensitive material.

---

## Database and Query Safety

Avoid:

- SQL injection
- unsafe raw queries
- concatenated query strings
- unvalidated dynamic query construction

Prefer parameterized queries, ORM safeguards, or equivalent safe patterns.

---

## Client-Side Security Awareness

Do not:

- expose server secrets to the client
- trust client-side validation alone
- trust client-generated authorization claims without server verification
- store sensitive auth material carelessly

---

## DevSecOps Mindset

Think about:

- secure environment separation
- production-safe config defaults
- HTTPS expectations
- CORS restrictions
- cookie flags or token safeguards where relevant
- secret rotation readiness

---

## Security Review Loop

Before considering a feature complete, ask:

- did I introduce a secret exposure risk?
- did I protect data access correctly?
- did I validate input correctly?
- did I reduce security by convenience shortcuts?
- are logs and responses safe?

---

## Uncertainty Handling

If security requirements are unclear:

- do not guess recklessly
- choose the safer default
- request clarification when needed

---

## Definition of Secure Enough to Proceed

A feature is not acceptable if it:

- hardcodes secrets
- exposes protected data incorrectly
- allows unauthorized actions
- trusts unsafe input
- leaks sensitive data through logs or APIs
