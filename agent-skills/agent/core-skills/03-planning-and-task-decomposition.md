# Planning and Task Decomposition

You must plan before you implement.

Your job is not to jump directly into code. Your job is to convert goals into executable work that can be completed safely and in the correct order.

---

## Purpose

Use this skill to:

- understand a requested outcome
- break large work into milestones
- break milestones into atomic tasks
- identify dependencies
- order implementation correctly
- define acceptance criteria before coding

---

## Planning Rules

Always begin by answering these questions:

1. What is the requested end state?
2. What already exists in the repository?
3. What must be added, changed, or removed?
4. What depends on what?
5. What should be built first?
6. How will success be verified?

Never begin implementation until you can answer these clearly.

---

## Planning Layers

Reason at four levels:

### 1. Product outcome
What user-visible capability is being added or fixed?

### 2. Module outcome
What backend, frontend, data, and infrastructure modules are involved?

### 3. File outcome
Which files must be created or changed?

### 4. Verification outcome
How will you prove the change works?

---

## Decomposition Method

For every substantial request, produce:

### A. Objective
A concise statement of the desired result.

### B. Milestones
High-level implementation stages.

### C. Atomic tasks
Small executable tasks that can be completed and verified independently.

### D. Dependencies
What must exist before the current task can proceed.

### E. Acceptance criteria
Specific checks that prove completion.

---

## Atomic Task Rules

A task is atomic only if it:

- changes a small, coherent part of the system
- has a clear completion condition
- can be verified independently
- does not hide multiple unrelated changes inside one step

Bad example:
- Build the whole auth system

Good examples:
- Create UserEntity and UserRepository
- Add POST /api/auth/sign-up endpoint
- Create sign-up page and form validation

---

## Dependency Discipline

Always identify:

- schema dependencies
- API dependencies
- shared component dependencies
- configuration dependencies
- test dependencies

Build prerequisites first.

Examples:

- do not build UI forms for entities that do not exist in the backend contract
- do not call endpoints before DTOs and controllers exist
- do not implement event streaming UI before event contracts are defined

---

## Planning Output Format

Before substantial implementation, create a concise plan with:

- objective
- milestones
- atomic tasks
- dependencies
- risks
- verification steps

This plan can be internal or external depending on system context, but it must exist.

---

## Replanning Rules

Replan when:

- the build reveals missing prerequisites
- the repository structure differs from expectation
- the requested scope changes
- new constraints appear
- tests show architectural assumptions were wrong

Do not stubbornly continue with an invalid plan.

---

## Anti-Drift Rules

Do not:

- skip the planning step because the task looks easy
- merge unrelated changes into one milestone
- ignore data model consequences
- ignore deployment or config implications
- assume a feature is done just because code exists

---

## Definition of a Good Plan

A good plan:

- respects architecture
- minimizes rework
- builds foundations before UI polish
- makes testing straightforward
- allows safe iteration

Your planning quality directly determines implementation quality.
