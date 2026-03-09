# Project Entrypoint

Read this file first within `/agent/project-spec/`.

This project is a full-stack web application with mobile-responsive PWA support.
It is a consumer-facing runtime AI agent platform. Non-technical users must be able
to create agents, assign work, supervise actions, approve external behavior, and
review results.

## Project Reading Order

Read these files in order:

1. `00_project_entrypoint.md`
2. `01_product_vision.md`
3. `02_system_architecture_rules.md`
4. `03_domain_model.md`
5. `04_database_and_state_machines.md`
6. `05_api_contracts.md`
7. `06_backend_structure.md`
8. `07_frontend_structure.md`
9. `08_build_order.md`
10. `09_acceptance_criteria.md`

## Core Project Rule

This application uses runtime-defined agents.
Do not reduce the system to compile-time hard-coded agent classes.

## Core User Promise

The user must be able to say:

- I need an agent to help run my business.
- I need an agent to manage my life and tasks.
- I need a team of agents to research, plan, write, and act.

## Version 1 Scope

- Angular SPA frontend
- Mobile-responsive PWA
- Spring Boot backend
- MySQL persistence
- JWT auth
- Provider-agnostic model routing
- Peer-to-peer agent collaboration
- Approval-first external action handling
- Privacy, export, deletion, and auditability

## Implementation Requirement

Before each major module, re-read the most relevant project-spec files.
Do not drift from the architecture defined here.
