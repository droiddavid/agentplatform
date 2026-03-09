# Agent Runtime Loop

This file defines the self-driving execution loop for the autonomous coding agent.

Its purpose is to turn the skill files, project specification files, and task context files into a repeatable development cycle.

Recommended location:
`/agent/agent-runtime-loop.md`

---

## Purpose

The agent must not operate as a one-shot code generator.

It must operate as a loop-driven software engineer that repeatedly:

- reads context
- plans work
- edits code
- runs commands
- verifies results
- critiques outcomes
- updates task state
- continues until the milestone is complete

---

## Runtime Loop Overview

The agent must execute work in this order:

1. Load core skills
2. Load project specification
3. Load task context
4. Inspect repository
5. Plan next atomic step
6. Implement code changes
7. Run terminal validation
8. Run browser validation when relevant
9. Perform self-critique
10. Check acceptance criteria
11. Update task context
12. Decide whether to continue or stop

This is the primary runtime loop.

---

## Required Input Sources

Before each work session, load these sources in order.

### Layer 1: Core behavior
Read all files in `/agent/core-skills/`

### Layer 2: Project rules
Read all files in `/agent/project-spec/`

### Layer 3: Current work
Read all files in `/agent/task-context/`

The agent must not begin coding before these sources are loaded.

---

## Detailed Runtime Loop

### Step 1. Load context

Read:

- core skills
- project specification
- current objective
- current milestone
- current tasks

Determine:

- what the system is
- what architecture applies
- what milestone is active
- what the next unfinished task is

### Step 2. Inspect repository state

Inspect:

- directory structure
- relevant files
- existing implementations
- dependencies
- configs
- recent changes if available

Determine whether the current task already exists partially, fully, or not at all.

### Step 3. Select the next atomic task

Choose the next task from `current_tasks.md`

Rules:

- only choose one coherent atomic task at a time
- do not skip prerequisites
- do not jump to polish before foundations work
- do not invent a new milestone unless required by replanning

### Step 4. Plan the change

For the chosen atomic task, identify:

- files to create
- files to edit
- commands to run
- tests to run
- browser checks if relevant
- risks or ambiguities

If ambiguity is high, pause and request clarification.

### Step 5. Implement

Make the smallest correct code changes required to complete the task.

Implementation rules:

- preserve architecture
- preserve runtime-defined agent model
- preserve approval-first behavior
- preserve privacy and auditability
- avoid unrelated file churn

### Step 6. Run terminal validation

Run the commands required to verify the change.

Examples:

- install dependencies if needed
- build frontend
- build backend
- run tests
- run migrations
- start servers if necessary

Read and interpret errors.
Fix issues before moving on.

### Step 7. Run browser validation when relevant

If the task affects user-facing behavior, use browser validation.

Examples:

- page renders
- route loads
- form submits
- responsive layout works
- approval dialogs behave
- service worker or manifest behavior is correct if relevant

Do not skip browser validation for UI work.

### Step 8. Perform self-critique

Run an internal review:

- architecture consistency
- security review
- UX clarity review
- performance and waste check
- error handling review
- uncertainty detection

If major issues are found, fix them before moving on.

### Step 9. Check acceptance relevance

Determine whether the completed task satisfies the relevant acceptance criteria for the active milestone.

If not, continue.

### Step 10. Update task state

Update `current_tasks.md` by:

- marking the completed task
- adding new atomic follow-up tasks if needed
- preserving the correct execution order

Update `current_milestone.md` only if milestone status changed.

### Step 11. Decide whether to continue

Continue the runtime loop if:

- there are remaining tasks in the current milestone
- no blocking uncertainty requires clarification
- validation succeeded

Stop only if:

- milestone is complete
- clarification is required
- external credentials or missing dependencies block further safe progress

---

## Replanning Loop

Replan when:

- the repository differs from expectation
- a task reveals missing prerequisites
- the specification requires a more foundational step first
- tests reveal the current design is invalid
- a dependency or integration is unavailable

When replanning:

1. preserve the active objective
2. update current tasks
3. insert missing prerequisite tasks before continuing
4. do not abandon architecture

---

## Failure Recovery Loop

When validation fails:

1. capture the failure
2. classify it as:
   - code defect
   - config defect
   - environment defect
   - data defect
   - misunderstanding
3. fix the smallest correct layer
4. rerun validation
5. repeat until resolved or escalation is necessary

Do not thrash randomly.

---

## Clarification Threshold

Pause and ask for clarification when:

- the user intent is materially ambiguous
- credentials or integration details are missing and cannot be safely inferred
- architecture requirements conflict
- proceeding would likely create incorrect system design

Do not ask for clarification for trivial implementation details you can safely infer from the project spec.

---

## Completion Conditions

A task is complete only when:

- implementation exists
- build passes
- tests pass where relevant
- browser validation passes where relevant
- self-critique does not reveal major issues
- task state is updated

A milestone is complete only when:

- all required tasks are complete
- milestone-level acceptance criteria are satisfied
- no critical regression remains

---

## Anti-Drift Rules

Never:

- treat the agent as a one-shot coder
- skip reading project-spec files
- skip task-context updates
- skip validation after code changes
- bypass the approval system
- convert runtime agent behavior into hard-coded role classes
- ignore security because the feature appears internal
- declare work complete because code merely exists

---

## Recommended Invocation Pattern

At the beginning of each work cycle, mentally or programmatically follow this pattern:

1. Read `/agent/core-skills/*`
2. Read `/agent/project-spec/*`
3. Read `/agent/task-context/*`
4. Choose next unfinished atomic task
5. Implement
6. Validate
7. Critique
8. Update task files
9. Repeat

---

## Final Rule

This runtime loop is the operating heartbeat of the autonomous coding agent.

Without this loop, the agent behaves like a text generator.

With this loop, the agent behaves like a disciplined software engineer working through a real project over time.
