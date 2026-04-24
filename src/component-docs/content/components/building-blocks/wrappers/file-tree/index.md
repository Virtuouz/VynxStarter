---
title: File Tree
overview: 'Visualizes a directory and file hierarchy. Supports two authoring modes: structured items for rich CloudCannon editing with file/folder types, or raw indented text for quickly pasting a tree from a terminal.'
slots:
  - title: default
    description: File tree items.
    fallback_for: items
    child_component:
      name: FileTreeItem
      props:
        - 'name'
        - 'type'
        - 'isOpen'
        - 'children'
examples:
  - title: Modes
    slugs:
      - raw
---
