# Database and State Machines

## Persistence Model

Use MySQL as the primary system of record.

Persist at minimum:

- users and profiles
- agents and policies
- tasks
- runs
- run agents
- run events
- approvals and approval rules
- memory
- connections
- tools and invocations
- documents
- usage and billing
- notifications
- audit and compliance records

## Canonical Ledger

`run_events` is the canonical ledger for execution history.

Persist events before broadcasting them to clients.

## Run States

- DRAFT
- READY
- RUNNING
- WAITING_FOR_APPROVAL
- WAITING_FOR_INPUT
- BLOCKED
- COMPLETED
- FAILED
- CANCELLED
- ARCHIVED

## Run-Agent States

- IDLE
- ACTIVE
- WAITING
- NEEDS_APPROVAL
- ERROR
- COMPLETED
- SUSPENDED

## Approval States

- PENDING
- APPROVED
- DENIED
- EXPIRED
- REVISED

## Tool Invocation States

- PLANNED
- WAITING_FOR_APPROVAL
- AUTHORIZED
- RUNNING
- SUCCEEDED
- FAILED
- CANCELLED

## Spawn States

- PROPOSED
- WAITING_FOR_APPROVAL
- APPROVED
- REJECTED
- CREATED
- FAILED

## Migration Rule

Schema must evolve through forward-only Flyway migrations.
Do not rewrite released migrations.
