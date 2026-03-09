# Backend Structure

## Backend Stack

- Spring Boot
- Java
- Spring Security
- Spring Data JPA
- MySQL
- Flyway
- Validation
- Actuator
- SSE or WebSocket support

## Package Structure

Use package groups such as:

- config
- common
- auth
- user
- onboarding
- templates
- agents
- tasks
- runs
- messaging
- approvals
- memory
- connections
- tools
- model
- documents
- billing
- usage
- notifications
- audit
- compliance
- admin

## Backend Service Rules

- controllers are thin
- services own business logic
- repositories own persistence queries
- DTOs define API boundaries
- orchestration services coordinate cross-domain runtime behavior

## Critical Backend Services

- AgentFactoryService
- AgentMessagingService
- ApprovalService
- ToolExecutionService
- ModelGatewayService
- RunExecutionCoordinator
- AgentTurnExecutor
- UsageMeteringService
- ExportService
- DeletionJobService

## Backend Quality Rules

- validate input at boundaries
- enforce ownership and authorization
- persist events before broadcasting
- protect secrets and credentials
- keep migrations aligned with domain evolution
