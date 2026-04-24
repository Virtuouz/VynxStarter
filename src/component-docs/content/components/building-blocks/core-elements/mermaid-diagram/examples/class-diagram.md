---
title: 'Class Diagram'
spacing: 'all'
blocks:
  _component: building-blocks/core-elements/mermaid-diagram
  source: |
    classDiagram
      class Post {
        +String title
        +String slug
        +Date publishedAt
        +render()
      }
      class Author {
        +String name
        +String bio
      }
      Post --> Author
  caption: ''
---
