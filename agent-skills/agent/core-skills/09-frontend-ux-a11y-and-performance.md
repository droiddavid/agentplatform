# Frontend UX, Accessibility, and Performance

You must build frontend experiences for real people, not only for successful renders.

---

## Purpose

Use this skill to govern:

- information hierarchy
- layout clarity
- component usability
- accessibility
- responsive behavior
- render performance
- bundle awareness
- loading and error states

---

## Core Rule

A frontend feature is not complete until it is understandable, usable, accessible, and reasonably performant.

---

## UX Clarity

Every meaningful screen should answer:

- what this page is for
- what the user can do here
- what is happening now
- what happens next
- what to do when something fails

Avoid interfaces that are technically functional but cognitively confusing.

---

## Information Hierarchy

Structure screens so users can quickly identify:

- primary action
- current status
- important warnings or approvals
- supporting details
- secondary controls

Do not bury critical actions in clutter.

---

## Loading, Empty, and Error States

Every important data-driven screen needs:

- loading state
- empty state
- error state

Do not assume data will always be present or requests will always succeed.

---

## Accessibility Requirements

At minimum, ensure:

- semantic structure
- logical heading hierarchy
- keyboard accessibility
- focus visibility
- meaningful labels
- sufficient contrast
- appropriate ARIA usage where native semantics are insufficient

Do not add ARIA where native HTML already expresses the structure correctly.

---

## Form Accessibility and Usability

Forms should provide:

- labels
- clear validation
- keyboard-friendly interaction
- understandable errors
- clear submit and cancel behavior

Do not rely on placeholder text as the only label.

---

## Responsive Design

Design for:

- desktop
- tablet
- mobile

Check for:

- overflow
- hidden actions
- clipped content
- broken drawers or modals
- unusable multi-panel layouts on small screens

Do not treat mobile support as an afterthought.

---

## Performance Awareness

Watch for:

- unnecessary rerenders
- oversized bundles
- excessive client-side work
- blocking data loads
- duplicate network requests
- huge unpaginated lists
- heavyweight dependencies for small needs

A working SPA that feels slow is not progressive.

---

## Performance Budget Mindset

Prefer:

- lazy loading where appropriate
- route-level code splitting
- efficient state updates
- small shared dependencies
- memoization or render optimization when justified

Do not optimize prematurely, but do avoid obvious waste.

---

## Component Discipline

Components should have:

- clear responsibility
- sensible boundaries
- predictable inputs and outputs
- minimal hidden side effects

Do not create giant components that mix layout, data orchestration, and unrelated business logic without necessity.

---

## Trust and User Confidence

Especially in operational apps, users need to feel in control.

Ensure the UI clearly communicates:

- what the system is doing
- when approval is required
- what changed after an action
- whether an action succeeded, failed, or is pending

---

## Definition of Good Frontend Work

A good frontend feature is:

- understandable
- accessible
- responsive
- stable
- reasonably fast
- clear in success and failure
