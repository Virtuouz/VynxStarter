---
title: 'Primary Mermaid Diagram'
spacing: 'all'
blocks:
  _component: building-blocks/core-elements/mermaid-diagram
  source: |
    graph TD
      A[User opens post] --> B{Logged in?}
      B -->|Yes| C[Show personalized feed]
      B -->|No| D[Show anonymous feed]
      C --> E[Render comments]
      D --> E
  caption: 'Request flow for rendering a blog post.'
---
