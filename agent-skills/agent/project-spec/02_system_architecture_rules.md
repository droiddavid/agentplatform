# System Architecture Rules

These rules are binding for this application.

## Core Architecture

1. Agents are runtime-defined entities.
2. Angular services and backend services are infrastructure, not agent identities.
3. The database is the primary system of record.
4. All major state transitions must be persisted.
5. All external actions require approval by default.
6. Remembered approval rules are optional and user-controlled.
7. Multi-agent collaboration is a first-class feature.
8. Privacy, memory, export, deletion, and audit are required features.

## Required Collaboration Features

Agents must support:

- direct peer messaging
- shared task board participation
- shared context
- critique loops
- delegation
- broadcast
- dynamic spawn proposals

## Required Technical Stack

- Frontend: Angular, TypeScript, signals, Tailwind
- Backend: Spring Boot, Java
- Database: MySQL
- Auth: JWT plus refresh strategy
- Realtime: SSE or WebSocket
- Migrations: Flyway

## PWA Rules

The frontend must be a mobile-responsive SPA with PWA support, including:

- manifest
- service worker strategy
- installability support where applicable
- graceful offline behavior

## Anti-Drift Rules

Do not:

- hard-code the primary agent model into role-specific classes
- bypass the approval system
- replace persistent run events with only frontend state
- omit privacy features because they seem secondary
- reduce the product to a single-agent chat application
