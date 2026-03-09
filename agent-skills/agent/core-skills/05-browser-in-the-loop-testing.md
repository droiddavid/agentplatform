# Browser-in-the-Loop Testing

You must verify the running application in a browser context.

A full-stack coding agent cannot rely only on static code review or successful builds. It must observe actual runtime behavior.

---

## Purpose

Use this skill to validate:

- rendered UI
- routing behavior
- responsive layouts
- forms and interactions
- runtime errors
- network behavior
- PWA features
- installability and service worker behavior where applicable

---

## Core Rule

A feature is not verified until it works in the browser.

Compilation success is not the same as user-facing success.

---

## Browser Validation Responsibilities

You must be able to:

- launch the application
- open pages
- navigate flows
- interact with forms and controls
- inspect visual layout
- detect console errors
- detect failed network requests
- verify expected state changes
- verify mobile-width behavior

---

## Testing Strategy

Use browser automation such as Playwright or Puppeteer when available.

For important flows, validate:

1. page loads
2. expected UI elements appear
3. interactions work
4. network requests succeed
5. success and error states render correctly
6. layout works at target screen widths

---

## Required Browser Checks

For major flows, inspect:

- route rendering
- form validation
- loading states
- empty states
- success feedback
- error feedback
- accessibility-critical focus behavior where practical

---

## Responsive Verification

At minimum validate:

- desktop width
- tablet width
- mobile width

Look for:

- overflow
- clipped content
- broken navigation
- inaccessible controls
- overlapping panels
- unusable modals or drawers

---

## Console and Network Discipline

Always check:

- browser console errors
- uncaught exceptions
- failed resource loads
- failed API calls
- CORS issues
- service worker registration errors
- manifest errors where relevant

A page that looks fine but throws console errors is not fully validated.

---

## PWA-Specific Browser Checks

For PWA-capable projects verify:

- manifest loads
- service worker registers
- app meets installability criteria if expected
- offline behavior is reasonable
- cache behavior aligns with strategy
- updates do not create broken stale experiences

---

## Screenshot Discipline

When visual comparison is useful:

- capture screenshots
- compare before and after if relevant
- use screenshots to confirm layout fixes

Do not rely on vague visual assumptions.

---

## Bug Isolation Rules

When a browser test fails:

1. determine whether failure is frontend, backend, config, network, or state related
2. inspect logs and responses
3. fix the smallest correct layer
4. rerun browser validation

---

## Anti-Patterns to Avoid

Do not:

- declare success without opening the feature
- assume components render correctly because they compile
- ignore responsive issues
- ignore broken loading or error states
- ignore browser warnings that indicate real user impact

---

## Definition of Browser-Verified Completion

A browser-verified feature:

- renders correctly
- behaves correctly
- handles success and error states
- works at intended viewport sizes
- does not produce avoidable runtime errors
