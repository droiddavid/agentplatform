# Implementation and Code Change Discipline

You must implement code with discipline.

This skill defines how to make changes safely, consistently, and in alignment with the surrounding codebase.

---

## Purpose

Use this skill to govern:

- file creation
- file modification
- refactoring
- naming
- scope control
- change isolation
- code consistency

---

## Core Rule

Do not treat the repository like a blank page.

Every change must respect:

- existing architecture
- current conventions
- naming patterns
- directory organization
- public interfaces
- dependency boundaries

---

## Before Changing Code

Before editing or creating files:

1. inspect related files
2. understand local patterns
3. identify public interfaces
4. check where the code is referenced
5. determine the smallest safe change

---

## File Creation Rules

Create a new file only when one of these is true:

- the architecture explicitly requires it
- the file map or spec requires it
- separation of responsibilities clearly demands it
- the current file would become incoherent or overloaded otherwise

Do not create unnecessary files simply because it feels cleaner in the moment.

---

## File Modification Rules

When modifying a file:

- preserve existing structure where practical
- keep related logic together
- avoid unrelated cleanups unless necessary for correctness
- avoid introducing conflicting patterns

If a file is poor quality, improve only what is necessary for the task unless broader refactoring is explicitly justified.

---

## Refactoring Rules

Refactor only when:

- duplication materially harms maintainability
- the current structure blocks the required change
- the existing abstraction is clearly broken
- the refactor is required for correctness or performance

When refactoring:

- preserve behavior
- update all callers
- rerun tests and builds
- verify no hidden regressions were introduced

---

## Scope Control

Never allow a focused task to expand into uncontrolled repo-wide churn.

Keep changes:

- intentional
- bounded
- reviewable
- traceable

If a change touches many files, be able to explain why each file must change.

---

## Naming Discipline

Names must be:

- explicit
- consistent
- aligned with existing domain language
- suitable for long-term maintenance

Prefer names that communicate responsibility.

Avoid vague names like:
- helper
- utilThing
- tempService
- managerObject

Unless the architecture genuinely requires those semantics.

---

## Interface Discipline

When working with APIs, DTOs, services, hooks, stores, or components:

- define clear inputs
- define clear outputs
- avoid hidden side effects
- avoid leaking internal structures to public boundaries

Never expose internal persistence entities directly to external consumers when the architecture expects DTOs or view models.

---

## Backward Compatibility Awareness

Before changing a shared API, shared utility, or shared component:

- locate all consumers
- assess breakage risk
- update all affected callers
- validate behavior after change

---

## Change Verification Loop

After implementing a change:

1. build
2. test
3. inspect related flows
4. review for architectural consistency
5. review for security and UX implications if relevant

---

## Anti-Patterns to Avoid

Do not:

- patch randomly until errors disappear
- duplicate logic instead of integrating correctly
- hardcode values that belong in config
- bypass architecture to move faster
- leave TODOs in place of core functionality unless explicitly allowed
- silently ignore failing tests

---

## Definition of a Good Code Change

A good change is:

- minimal but sufficient
- easy to understand
- aligned with architecture
- tested
- safe for future extension
