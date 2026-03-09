# Backend, API, and Data Discipline

You must implement backend systems with clear boundaries, durable data modeling, and consistent contracts.

---

## Purpose

Use this skill to govern:

- domain modeling
- API design
- DTO discipline
- persistence boundaries
- migrations
- transaction safety
- event ordering
- idempotency
- background work patterns

---

## Core Rule

The backend must be a coherent system, not a collection of endpoints.

---

## Domain Modeling

Model the business domain intentionally.

Identify:

- core entities
- relationships
- ownership boundaries
- lifecycle states
- invariants

Do not let controller convenience define the data model.

---

## API Contract Discipline

APIs must be:

- explicit
- predictable
- versionable where appropriate
- consistent in naming and structure
- aligned with the product model

Define clear request and response shapes.

Avoid unstable or ad hoc payloads unless the architecture intentionally allows flexible structures.

---

## DTO Discipline

Use DTOs or boundary objects when the architecture calls for them.

Do not expose internal persistence entities directly unless explicitly intended and safe.

Separate:

- persistence shape
- API contract shape
- UI or view shape

---

## Validation and Errors

Validate requests at the boundary.

Return errors that are:

- consistent
- machine-readable
- understandable
- appropriately specific

Do not return vague or misleading error responses.

---

## Transaction and Consistency Awareness

For multi-step operations, reason about:

- atomicity
- ordering
- rollback behavior
- partial failure
- concurrency implications

Do not assume the database will just handle it.

---

## Migration Discipline

Treat schema evolution as part of implementation, not as an afterthought.

When changing the data model:

- update migrations correctly
- preserve forward migration discipline
- avoid rewriting released migrations
- ensure new schema supports required queries and constraints

---

## Idempotency Awareness

For actions that may be retried or repeated, design safely.

Examples:
- cancel endpoints
- payment callbacks
- retryable action submissions
- queued event handling

Avoid destructive duplicate processing.

---

## Event and State Ordering

When a system depends on ordered events or state transitions:

- persist state changes deliberately
- preserve ordering constraints
- avoid broadcasting ephemeral state that contradicts stored state

This is especially important for run or event driven systems.

---

## Background Work

If work is asynchronous:

- make initiation explicit
- make status observable
- persist enough information for recovery
- surface failures clearly

Do not hide long-running work behind fake synchronous success.

---

## Query and Performance Discipline

Think about:

- indexes
- query shape
- pagination
- list vs detail endpoints
- filtering
- N plus 1 query risk
- over-fetching

A correct backend that collapses under ordinary load is not complete.

---

## Definition of Good Backend Work

Good backend implementation is:

- domain-consistent
- contract-consistent
- safely validated
- migration-aware
- observable
- testable
- resilient under retries and partial failures
