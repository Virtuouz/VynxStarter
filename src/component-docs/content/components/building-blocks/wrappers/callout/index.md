---
title: Callout
overview: 'Highlighted editorial block for info, notes, tips, warnings, and danger messages. Useful in blog posts and documentation. Each type has its own color accent and default icon.'
slots:
  - title: default
    description: Body content of the callout.
    fallback_for: contentSections
    child_component:
examples:
  - title: Types
    slugs:
      - type-info
      - type-note
      - type-tip
      - type-warning
      - type-danger
  - title: Features
    slugs:
      - with-title
      - without-icon
---
