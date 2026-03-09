# PWA Engineering and Offline Systems

You must understand and implement Progressive Web App behavior deliberately.

A PWA is not merely an SPA with a manifest. It is a system with installability, caching strategy, offline behavior, and lifecycle rules.

---

## Purpose

Use this skill when building or modifying:

- web app manifests
- service workers
- caching strategies
- offline UX
- installability behavior
- background synchronization
- asset update strategies

---

## Core Rule

PWA behavior must be designed intentionally, not added as an afterthought.

---

## Required PWA Knowledge Areas

You must understand:

- manifest requirements
- service worker lifecycle
- cache-first vs network-first tradeoffs
- stale-while-revalidate behavior
- offline fallback patterns
- update strategies
- install prompt prerequisites
- icon and splash asset requirements
- background sync concepts
- replay queue patterns for deferred actions

---

## Manifest Discipline

Ensure the manifest is valid and includes the fields required by the product and browser expectations, such as:

- name
- short_name
- start_url
- display
- background_color
- theme_color
- icons

Manifest design must align with actual branding and navigation behavior.

---

## Service Worker Discipline

When implementing service workers:

- choose explicit caching strategies
- separate static asset strategy from API or data strategy
- avoid caching sensitive or user-specific data unsafely
- define update behavior clearly
- verify registration and activation behavior

Do not implement service worker logic blindly.

---

## Caching Strategy Selection

Choose the strategy based on content type.

Examples:

### Static assets
Often cache-first or pre-cache appropriate.

### Frequently changing API data
Often network-first or stale-while-revalidate appropriate.

### Critical live state
Do not aggressively cache in ways that mislead the user.

Document the rationale for each major caching choice.

---

## Offline UX Rules

Offline mode must degrade gracefully.

Users should understand:

- whether they are offline
- which data is still available
- which actions are deferred
- what will happen when connectivity returns

Do not present misleading success states when actions are merely queued.

---

## Background Sync and Replay

If offline action replay is part of the design:

- store queued actions safely
- prevent duplicate replay
- preserve action order where required
- clearly track success and failure after reconnection

Background replay must not create hidden destructive outcomes.

---

## Update and Staleness Handling

PWA updates must not leave users trapped on broken cached versions.

Implement update handling that considers:

- new release availability
- reload prompts when necessary
- cache invalidation
- migration safety

---

## Security Considerations

Be careful with:

- caching authenticated responses
- exposing sensitive data offline
- storing tokens insecurely
- mixing public and private cache strategies

PWA convenience must not override security.

---

## Verification Checklist

For PWA features verify:

- manifest loads successfully
- service worker registers
- installability criteria are met when expected
- offline mode behaves predictably
- updates do not silently break the app
- caching does not serve dangerous stale data

---

## Anti-Patterns to Avoid

Do not:

- add a service worker without a cache strategy rationale
- cache everything
- ignore update lifecycle behavior
- mislead users about offline success
- store sensitive secrets in client-side storage

---

## Definition of Good PWA Implementation

A good PWA implementation is:

- installable when intended
- fast
- resilient
- transparent about offline state
- safe with data
- predictable across updates
