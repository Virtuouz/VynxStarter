---
title: 'Sequence Diagram'
spacing: 'all'
blocks:
  _component: building-blocks/core-elements/mermaid-diagram
  source: |
    sequenceDiagram
      participant Browser
      participant CDN
      participant Origin
      Browser->>CDN: GET /post
      CDN->>Origin: Cache miss
      Origin-->>CDN: Rendered HTML
      CDN-->>Browser: 200 OK
  caption: ''
---
