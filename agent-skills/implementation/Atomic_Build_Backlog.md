Atomic Build Backlog
====================

Overview
--------
This file lists ordered, atomic implementation tasks derived from the Database & API Contract Pack and the Overall Specification. Tasks are grouped by module and ordered so each item is a small, testable increment (DB migration → backend model/repo → service → controller/DTO → unit tests → integration tests → frontend integration). Mark tasks as done when implemented and verified.

Priority ordering
-----------------
1. Small infra and safety tasks (seeds, roles, audit, CI integration tests)
2. Core domain modules needed for agent runtime: Agents → Tasks → Runs
3. Integrations and execution: Messaging, Connectors, Documents
4. Cross-cutting concerns: approvals, memory, audit, billing
5. Frontend pieces (UX per API) and E2E tests

Backlog (atomic tasks)
----------------------

Common task pattern for each domain table/module:
- Add Flyway migration for table(s)
- Add JPA entity + DB mapping
- Add Spring Data repository
- Add DTOs (Request/Response) and simple mappers
- Add service methods (CRUD + domain operations)
- Add controller endpoints (REST contract)
- Add unit tests for service + controller (mocked repo)
- Add an integration test (Testcontainers or H2 profile) covering happy path
- Add frontend service method to call API
- Add minimal frontend component/route to exercise API

1. Seed & Roles & Admin
- Add V3 migration: roles table + user_role join + admin user seed
- Add Role entity + repository
- Add simple RoleService + assign/remove role endpoints
- Unit tests for role assignment
- CI: enable integration test that verifies admin seed exists

2. Audit Logging & Token Events
- Add migration: audit_events table
- Add AuditEvent entity + repository
- Wire audit events for token issued/rotated/revoked in auth flows
- Add unit tests for AuditEvent creation
- Add API to query audit events (admin-only)

3. Auth Enhancements & Security Hardening
- Add rate-limiter middleware (simple in-memory or bucket) for auth endpoints
- Add CORS strict config and review allowed origins
- Add brute-force protection: track failed logins, lockout policy migration
- Add endpoint-level role checks (method security) and tests
- Add documentation: security checklist and config notes

4. Integration Tests & CI
- Add a CI job that runs Testcontainers-based integration test profile
- Add Docker-in-CI instructions and required GitHub Secrets documentation
- Create `integration` Maven profile using Testcontainers (skippable locally)
- Add auth flow integration test (signin → refresh → revoked token check)

5. Onboarding Frontend (small)
- Add frontend route `/onboarding` placeholder component
- Add OnboardingService method to POST `/api/onboarding/start`
- Add minimal UI button to start onboarding and show response
- Add E2E test that hits onboarding start and asserts response

6. Agents Module (core)
- Add migration: agents table + indices
- Add `Agent` entity + repository
- Add DTOs: AgentCreateRequest, AgentResponse
- Add AgentService: create/list/get/update (no runtime scheduling yet)
- Add AgentController endpoints (CRUD)
- Unit tests for agent service and controller
- Integration test for agent creation and retrieval
- Frontend: AgentsService, AgentsListComponent (placeholder), CreateAgentForm

7. Tasks Module (work units)
- Migration: tasks table (FK to agents, users), status enum
- Task entity + repository
- DTOs: TaskCreateRequest, TaskResponse, TaskUpdateStatusRequest
- TaskService: create, assign, update status, list by agent/user
- Controller endpoints + unit tests
- Integration tests for lifecycle (create → assign → complete)
- Frontend: TaskService, TaskListComponent, TaskDetailComponent

8. Runs Module (execution records)
- Migration: runs table (FK to tasks, agent, status, logs JSON)
- Run entity + repository
- DTOs and mappers for run creation and query
- RunService: startRunRecord, updateStatus, appendLogs
- Controller endpoints to fetch runs and logs
- Unit + integration tests for run lifecycle
- Frontend: RunsService, RunsList, RunDetail components

9. Messaging / Events / Queueing (integration stubs)
- Add migration: messages/events table for persisted events
- Message entity + repository
- Add simple in-memory queue adapter interface + default impl
- Add APIs to publish/read events (admin/debug endpoints)
- Unit tests for queue adapter; integration smoke test

10. Connectors / External Integrations (approved-first)
- Add connectors table, connector credential storage (encrypted/placeholder)
- Connector entity + repository + DTOs
- Controller to register connectors (admin/owner) and test connection endpoint
- Ensure connectors are not used automatically: approval workflow integration

11. Approvals Workflow
- Migration: approvals table (requested_by, approver, status, payload JSON)
- Approval entity + repository + service to request/approve/deny
- Controller endpoints for requesting approvals and approving/denying
- Unit + integration tests for approval lifecycle
- Frontend: Approvals list + approve/deny UI (admin/owner)

12. Memory / Documents / Knowledge
- Migration: documents table + vector metadata (if used later)
- Document entity + repository + upload endpoint (store metadata; content to blob later)
- DocumentService for CRUD + search stub
- Controller + tests
- Frontend: Document upload form + list

13. Audit & Compliance (reporting)
- Add endpoints to export audit events (CSV), with admin checks
- Add scheduled job to archive old audit records (migration + service)

14. Billing / Usage Tracking (minimal)
- Migration: usage_records table (user, feature, cost metric)
- UsageRecord entity + repository
- Service to record usage in key places (model invocations, connector calls)
- Simple billing report endpoint (admin) + tests

15. OpenAPI / Documentation
- Add Springdoc/OpenAPI dependency
- Expose OpenAPI JSON and Swagger UI behind dev-only profile
- Add generation step to CI to export `openapi.json`

16. Frontend E2E & Accessibility
- Add Cypress Playwright config (choose one) and basic auth flow E2E test
- Add accessibility audit step (axe-core) for main pages

17. Dockerize Frontend & Local Compose
- Add frontend Dockerfile for production build (multi-stage)
- Extend docker-compose.dev.yml to include frontend static container or reverse-proxy
- Add `make dev` or `npm run docker:dev` convenience command in README_DEV.md

18. Deployment & Infra
- Create basic Azure Bicep/Terraform templates for staging: MySQL, App Service or Container App
- Add `deploy:staging` script and documentation (do not auto-deploy to prod)

19. Final polish & production readiness
- Security review checklist run and fixes (rotate secrets, remove dev-only endpoints)
- Production observability: add Application Insights / monitoring hooks
- Performance tuning and DB indices (review slow queries)

Notes
-----
- Each backlog item should be implemented in a single branch with a focused PR and small scope.
- Where integration tests rely on Docker/Testcontainers, run them in CI; keep local dev fast by using the `-DskipITs=true` profile.
- Prefer small merges: one feature per PR with unit tests and at least one integration smoke test where applicable.

Next steps (immediate)
----------------------
1. Create the Backend Specification Pack from the Database & API Contract Pack (map DTOs, validation rules, errors)
2. Implement the first prioritized items: seed+roles migration, audit events, and CI integration test for auth flows
3. Add frontend onboarding route and minimal UI to exercise onboarding API

Prioritized sprint plan (runnable demo focus)
--------------------------------------------
Sprint 1 — Foundation (goal: backend runs with migrations, seeds, basic auth)
- Task S1.1: Validate Flyway migrations run in local dev and CI (V1..V5) and fix any errors.
- Task S1.2: Ensure `roles`, `user_roles`, and basic `ADMIN`/`USER` seeds are applied and that `DataInitializer` assigns an admin when configured.
- Task S1.3: Add integration profile for CI and a small Testcontainers-based health smoke test for DB connectivity.

Sprint 2 — Onboarding + Templates (goal: minimal frontend + API flows)
- Task S2.1: Expose onboarding API endpoints and add minimal frontend `/onboarding` route placeholder.
- Task S2.2: Ensure template catalog migrations and seed data are present and API to list templates exists.

Sprint 3 — Agent Core & Run Skeleton (goal: create/list agents and start a simple run record)
- Task S3.1: Finalize `Agent` DTOs, service, controller and full integration tests (create/list/get/update/delete).
- Task S3.2: Implement `Run` entity + start-run endpoint that persists a run record and emits an initial event.

Sprint 4 — Execution Engine & Approvals (goal: single-agent execution with approval gating)
- Task S4.1: Implement a minimal execution engine skeleton that can execute one agent turn and persist run events.
- Task S4.2: Add approvals table and approval request/decision endpoints; block external actions until approved.

Sprint 5 — Frontend Demo and Acceptance Tests (goal: end-to-end demo)
- Task S5.1: Build agent creation wizard UI (minimal), agent list, and run view that streams events via SSE/WebSocket.
- Task S5.2: Add E2E tests for core user journey: register → onboarding → create agent → start run → approve action.

Notes:
- Each sprint is broken into small PR-sized tasks (one task → one branch → tests → merge).
- I'll start with Sprint 1 Task S1.1 and work through S1.2 and S1.3, running tests and committing incremental changes.
