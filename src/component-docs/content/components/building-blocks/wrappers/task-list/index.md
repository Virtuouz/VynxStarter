---
title: Task List
overview: 'Checklist-style list of tasks with checked or unchecked state. Supports nested subtasks. Useful for onboarding guides and how-to content. Checkboxes are presentational — state is set in content, not toggled at runtime.'
slots:
  - title: default
    description: Task list items.
    fallback_for: items
    child_component:
      name: TaskListItem
      props:
        - 'text'
        - 'checked'
        - 'items'
examples:
  - title: Features
    slugs:
      - nested
---
