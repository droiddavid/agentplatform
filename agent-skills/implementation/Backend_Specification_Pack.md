Backend Specification Pack
=========================

Purpose
-------
Map the Database & API Contract Pack into concrete DTOs, validation rules, error codes, and service responsibilities. Serve as the implementation reference for backend feature PRs.

Conventions
-----------
- DTOs under package `com.agentplatform.backend.<module>.dto`
- Entities under `com.agentplatform.backend.<module>`
- Services under `com.agentplatform.backend.<module>`
- Controllers under `com.agentplatform.backend.<module>`
- Validation: use Jakarta Validation (`@NotNull`, `@Email`, `@Size`) on request DTOs
- Error responses: return JSON {"code":"ERROR_CODE","message":"human friendly"}

Common DTO patterns
-------------------
- CreateRequest: fields for creation validated with `@NotNull`/`@Size`.
- UpdateRequest: optional fields validated for length.
- Response: `id`, `createdAt`, `updatedAt`, plus domain fields.

Auth module
-----------
- SignUpRequest: `email` (`@Email @NotNull`), `password` (`@NotNull @Size(min=8)`)
- SignUpResponse: `id`, `email`, `createdAt`
- SignInRequest/Response: as implemented (accessToken, refreshToken)

Roles
-----
- RoleResponse: `id`, `name`
- AssignRoleRequest: `userId`, `roleName` (or `roleId`)
- Endpoints:
  - POST `/api/roles/assign` (admin only) — assign role to user
  - POST `/api/roles/remove` (admin only)
  - GET `/api/roles` — list roles

Audit
-----
- AuditEventResponse: `id`, `userId`, `eventType`, `payload`, `createdAt`
- Endpoints:
  - GET `/api/admin/audit?userId=&eventType=&since=` — admin-only query with pagination

Agents / Tasks / Runs (summary)
--------------------------------
- AgentCreateRequest: `name` (required), `description`, `spec` (JSON string)
- AgentResponse: `id`, `name`, `description`, `spec`, `createdAt`
- TaskCreateRequest: `agentId`, `title`, `description`, `assignedTo` (userId)
- RunStartRequest: `taskId`, `parameters` (JSON)

Error codes
-----------
- `INVALID_INPUT` — validation failure
- `NOT_FOUND` — resource missing
- `UNAUTHORIZED` — auth required
- `FORBIDDEN` — insufficient role
- `INTERNAL_ERROR` — generic server error

Testing
-------
- Unit tests: service-level mocking repositories
- Integration tests: `integration` Maven profile using Testcontainers or a CI DB
- Keep local dev fast by skipping integration profile by default

Next steps
----------
1. Generate code skeletons for Roles (DTOs, Controller, Service) and Audit query endpoint.
2. Add method-level security checks (admin only) and tests.
3. Produce PRs for each small item.
