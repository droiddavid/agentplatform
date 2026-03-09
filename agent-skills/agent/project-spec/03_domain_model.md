# Domain Model

## Core Entities

### User
The account owner. Version 1 supports personal accounts only.

### Agent
A runtime-defined worker with:

- identity
- role title
- description
- goals
- capabilities
- tool permissions
- approval policy
- memory policy
- collaboration policy
- spawn policy
- model preference

### Task
A user-facing unit of work to be completed by one or more agents.

### Run
An execution instance for a task. A run coordinates one or more agents,
tool invocations, approvals, messages, and outputs.

### Run Agent
A specific agent participating in a specific run.

### Approval
A required decision point before external action.

### Approval Rule
A remembered user decision that can apply at ONCE, TASK, AGENT, or USER scope.

### Memory
Scoped retained context. Memory scopes include:

- RUN
- AGENT
- USER
- SHARED

### Connection
A linked external integration such as email, calendar, or custom API.

### Tool
A callable capability that may use a connection and may require approval.

### Document
A generated or managed output such as a report, draft, summary, or export.

## Relationships

- A user owns many agents, tasks, runs, connections, approvals, and documents.
- A task may have one or more runs.
- A run has one or more run agents.
- Run agents exchange messages and create board items.
- Agents may relate to peer agents through collaboration rules.
- Approvals are linked to runs, tasks, and sometimes run agents.
- Tool invocations occur inside runs.
- Documents may belong to runs and tasks.

## Domain Rule

The domain model must remain data-driven.
Do not move domain identity into compile-time-only abstractions.
