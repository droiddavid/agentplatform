Database & API Contract Pack

Purpose
- Provide concrete DB table definitions (columns + types + constraints) and REST API contracts (endpoints, request/response DTOs, status codes) for core v1 modules to drive implementation and tests.
- Focus scope: Auth, Users, Onboarding, Agents, Templates, Tasks, Runs, Messages, Approvals, Memory, Connections, Documents, Audit, Usage.

Conventions
- All tables include `id BIGINT AUTO_INCREMENT PRIMARY KEY`, `user_id` for ownership (when applicable), `created_at`, `updated_at` timestamps.
- Use `VARCHAR(n)` for short strings, `TEXT` for longer fields, `JSON` for structured payloads where supported.
- Approval and run events use append-only ledger tables.
- API endpoints are prefixed with `/api/` and return JSON; errors use standard HTTP codes.

1) Identity & Auth

Table: `users`
- id BIGINT PK
- email VARCHAR(320) UNIQUE NOT NULL
- password_hash VARCHAR(255) NOT NULL
- email_verified BOOLEAN DEFAULT FALSE
- created_at TIMESTAMP
- updated_at TIMESTAMP

Table: `user_sessions`
- id BIGINT PK
- user_id BIGINT FK -> users(id)
- device_info VARCHAR(512)
- ip_address VARCHAR(64)
- created_at TIMESTAMP
- last_seen TIMESTAMP
- revoked BOOLEAN DEFAULT FALSE

Table: `refresh_tokens`
- id BIGINT PK
- token CHAR(36) UNIQUE NOT NULL
- user_id BIGINT FK
- issued_at TIMESTAMP
- expires_at TIMESTAMP
- revoked BOOLEAN DEFAULT FALSE
- replaced_by CHAR(36) NULL (rotation)

Auth APIs
- POST /api/auth/sign-up
  - body: {"email":"user@example.com", "password":"..."}
  - 200: {"id":123, "email":"user@example.com"}
  - 400: validation errors

- POST /api/auth/sign-in
  - body: {"email":"...","password":"..."}
  - 200: {"accessToken":"<jwt>", "refreshToken":"<uuid>"}
  - 401: invalid credentials

- POST /api/auth/refresh
  - body: {"refreshToken":"<uuid>"}
  - 200: {"accessToken":"<jwt>", "refreshToken":"<new-uuid>"}
  - 401: invalid/revoked

- POST /api/auth/logout
  - body: {"refreshToken":"<uuid>"}
  - 200: {}

- GET /api/me
  - header: Authorization: Bearer <jwt>
  - 200: user profile summary

2) Onboarding

Table: `onboarding_profiles`
- id, user_id FK, primary_goal_category VARCHAR, use_case_examples TEXT, privacy_preference VARCHAR, memory_preference VARCHAR, created_at, updated_at

APIs
- POST /api/onboarding/start
  - body: {userId, primaryGoalCategory, useCaseExamples, privacyPreference, memoryPreference}
  - 200: OnboardingResponse (id, userId, fields...)

- GET /api/onboarding/{userId}
  - 200: OnboardingResponse or 404

3) Agents & Templates

Table: `agent_templates`
- id, name, category, description, schema JSON, created_by (nullable), public BOOLEAN

Table: `agents`
- id, user_id, display_name, role_title, description TEXT, persona JSON, goals JSON, capabilities JSON, allowed_tools JSON, approval_policy JSON, memory_policy JSON, collaboration_policy JSON, spawn_policy JSON, model_preference JSON, prompt_scaffold TEXT, safety_constraints JSON, status VARCHAR, created_at, updated_at, archived BOOLEAN

APIs
- GET /api/templates
- GET /api/templates/:id
- POST /api/agents  (create agent from payload)
  - body: agent spec (see fields in table)
  - 201: {id, ...}

- POST /api/agents/from-text
  - body: {text: "Create an agent that..."}
  - 200: {proposedAgents:[{spec}]}

- GET /api/agents
- GET /api/agents/:id
- PATCH /api/agents/:id
- DELETE /api/agents/:id

4) Tasks

Table: `tasks`
- id, user_id, title, description TEXT, category VARCHAR, status VARCHAR, priority INT, due_date DATE NULL, assigned_agents JSON, approval_required BOOLEAN, created_at, updated_at

APIs
- POST /api/tasks
- GET /api/tasks
- GET /api/tasks/:id
- PATCH /api/tasks/:id
- POST /api/tasks/:id/start-run -> creates a run

5) Runs & Events

Table: `runs`
- id, task_id FK, user_id, run_state VARCHAR (Draft|Ready|Running|WaitingForApproval|...), start_time, end_time, active_agents JSON, created_at, updated_at

Table: `run_events`
- id BIGINT PK
- run_id FK
- seq BIGINT (monotonic)
- event_type VARCHAR
- payload JSON
- created_at TIMESTAMP

APIs
- POST /api/runs/:id/cancel
- POST /api/runs/:id/resume
- GET /api/runs/:id/events
- GET /api/runs/:id/messages

6) Messaging

Table: `agent_messages`
- id, run_id FK, from_agent_id (nullable), to_agent_id (nullable), message_type VARCHAR, content JSON, created_at

APIs
- POST /api/runs/:id/messages
  - body: {fromAgentId, toAgentId, type, content}
  - 201: message

7) Approvals

Table: `approvals`
- id, run_id, user_id, agent_id, action_type VARCHAR, action_payload JSON, request_scope VARCHAR (ONCE|TASK|AGENT|USER), status VARCHAR (Pending|Approved|Denied), created_at, resolved_at, resolver_user_id

Table: `approval_rules`
- id, user_id, agent_id NULLABLE, action_signature VARCHAR, decision VARCHAR (AlwaysAllow|AlwaysDeny|Ask), scope VARCHAR, created_at

APIs
- GET /api/approvals
- POST /api/approvals/:id/approve
- POST /api/approvals/:id/deny
- POST /api/approval-rules

8) Memory

Table: `memory_items`
- id, user_id, agent_id NULLABLE, run_id NULLABLE, scope ENUM (RUN,AGENT,USER,SHARED), type VARCHAR, content JSON, summary TEXT, created_at

APIs
- GET /api/privacy/memory
- DELETE /api/privacy/memory/:id

9) Connections

Table: `connections`
- id, user_id, type VARCHAR, display_name, config JSON (non-secret), credential_reference VARCHAR (encrypted key id), last_sync TIMESTAMP, status VARCHAR, created_at

APIs
- POST /api/connections/:type/connect -> returns OAuth URL or token test result
- POST /api/connections/:id/test
- DELETE /api/connections/:id

10) Documents

Table: `documents`
- id, user_id, run_id NULLABLE, title, content_ref VARCHAR (blob store key), metadata JSON, created_at

APIs
- POST /api/documents/:id/export
- GET /api/documents

11) Audit & Usage

Table: `audit_logs`
- id, user_id NULLABLE, actor VARCHAR, action VARCHAR, resource_type VARCHAR, resource_id BIGINT, details JSON, created_at

Table: `usage_records`
- id, user_id, run_id, feature VARCHAR, units INT, created_at

APIs
- GET /api/me/usage
- GET /api/usage

Acceptance Criteria (for this pack)
- Every table listed has at least columns, PK, and FK references documented.
- Core API endpoints include method, path, request body example, response example and potential errors.
- Backwards mapping: for each API, list the table(s) updated or read.

Next implementation steps (atomic)
1. Generate Flyway migrations for all tables above (auth already present; onboarding + others next).
2. Implement JPA entities + repositories for `agents`, `tasks`, `runs`, `run_events`, `agent_messages`, `approvals`, `approval_rules`, `memory_items`, `connections`, `documents`, `audit_logs`, `usage_records`.
3. Implement controllers and DTOs for CRUD APIs (Auth exists; implement Onboarding, Agents, Tasks, Runs basic endpoints).
4. Add unit tests for repository mapping and DTO validation.
5. Add integration tests for the main signup->create-agent->create-task->start-run flow.

Where this pack leads next
- With these contracts, we can generate service skeletons, DTOs, frontend API client types, and the atomic backlog. The pack provides the minimal surface required to start Phase 3 (Agent Domain) and Phase 4 (Tasks and Runs).


