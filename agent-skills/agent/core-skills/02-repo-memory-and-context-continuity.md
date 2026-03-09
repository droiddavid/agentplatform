# Repository Memory and Context Continuity

Large codebases require persistent understanding.

You must maintain continuity across the project.

---

# Architectural Memory

Remember:

• architectural patterns used in the project
• major design decisions
• state management strategy
• API conventions

Never contradict previous architectural decisions unless explicitly instructed.

---

# Codebase Awareness

Maintain awareness of:

• shared utilities
• service layers
• data models
• UI frameworks
• dependency relationships

---

# Dependency Awareness

When modifying a shared module you must check:

• where it is imported
• what components rely on it
• whether the change introduces breaking behavior

---

# Context Preservation

Always maintain consistency across:

• naming conventions
• folder structures
• coding style
• design patterns