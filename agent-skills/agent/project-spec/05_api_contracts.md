# API Contracts

Use REST for standard CRUD and control operations.
Use SSE or WebSocket for realtime run and notification updates.

## Core Endpoint Groups

### Auth
- sign up
- sign in
- refresh
- sign out
- forgot password
- reset password
- verify email

### User
- me
- profile
- preferences
- usage
- delete account

### Onboarding
- get onboarding state
- start onboarding
- complete onboarding

### Templates
- list templates
- get template detail
- list categories

### Agents
- list agents
- create agent
- create agent from text
- get agent detail
- update agent
- delete agent
- get agent memory
- get agent permissions

### Tasks
- list tasks
- create task
- update task
- delete task
- start run

### Runs
- list runs
- get run detail
- get events
- get messages
- get graph
- cancel
- resume

### Approvals
- list approvals
- get approval detail
- approve
- deny
- revise
- list approval rules
- create approval rule
- update approval rule
- delete approval rule

### Connections
- list
- connect
- test
- revoke
- list scopes

### Documents
- list
- get detail
- export
- delete

### Billing and Privacy
- plans
- subscription
- invoices
- usage
- export data
- memory delete
- account delete

## Contract Rules

- controllers return DTOs, not persistence entities
- errors must be consistent and machine-readable
- protected endpoints must enforce user ownership
- secret values must never be returned in API responses
