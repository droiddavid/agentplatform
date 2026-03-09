# Release Validation and Acceptance

You must think beyond implementation and toward release readiness.

A feature is not truly complete until it satisfies its acceptance criteria and fits safely into a deployable system.

---

## Purpose

Use this skill to govern:

- acceptance validation
- end-to-end readiness
- release checklists
- regression awareness
- final quality gates

---

## Core Rule

Do not equate code written with ready to release.

---

## Acceptance-Criteria-First Thinking

Every meaningful feature must have acceptance criteria.

Before release or handoff, verify:

- the criteria exist
- the implementation matches them
- the tests or manual checks demonstrate them

If acceptance criteria are missing, derive explicit validation goals from the spec before claiming completion.

---

## Release Validation Layers

Review the system at multiple layers:

### 1. Code layer
- compiles
- passes linting where applicable
- passes unit tests where expected

### 2. Integration layer
- frontend and backend interact correctly
- data flows correctly
- errors are handled correctly

### 3. User layer
- the user can complete the intended workflow
- the system communicates clearly
- states and transitions are understandable

### 4. Operational layer
- config is correct
- migrations run
- seeds load if required
- secrets are externalized
- logging and observability are adequate

---

## Critical Release Questions

Before calling something ready, ask:

- Can a new user complete the intended flow?
- Do protected actions remain protected?
- Do approvals behave correctly?
- Do failures surface clearly?
- Do responsive layouts hold up?
- Are seeded defaults present if the product depends on them?
- Is there any missing step that would block real use?

---

## Regression Awareness

When changing the system, consider what may have been affected:

- shared services
- shared DTOs
- route guards
- state stores
- migrations
- event contracts
- connector logic
- auth flows

Do not validate only the new feature in isolation when the change touches shared infrastructure.

---

## Release Checklist Mindset

A release-ready system should satisfy:

- architecture consistency
- functional completeness for the targeted scope
- security expectations
- privacy expectations
- performance reasonableness
- UX clarity
- acceptance criteria
- test pass status for critical paths

---

## Incomplete Release Conditions

Do not mark as release-ready if any of the following are true:

- critical path flow is untested
- migrations fail on clean setup
- secrets are hardcoded
- approval or auth protections are bypassable
- required integrations are stubbed without being clearly marked
- the UI is unusable on supported form factors
- critical acceptance criteria are unmet

---

## Honest Status Labels

Use status labels accurately:

- planned
- partially implemented
- implemented but unverified
- verified in development
- acceptance-ready
- release-ready

Do not skip directly to release-ready.

---

## Definition of Release-Validated Work

Release-validated work is:

- implemented
- verified
- acceptance-aligned
- secure enough for its context
- operationally coherent
- honestly represented
