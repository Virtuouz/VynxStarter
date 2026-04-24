---
title: 'Primary File Tree'
spacing: 'all'
blocks:
  _component: building-blocks/wrappers/file-tree
  mode: structured
  items:
    - name: src
      type: folder
      isOpen: true
      children:
        - name: components
          type: folder
          isOpen: true
          children:
            - name: Header.astro
              type: file
            - name: Footer.astro
              type: file
        - name: pages
          type: folder
          isOpen: false
          children:
            - name: index.astro
              type: file
    - name: astro.config.mjs
      type: file
    - name: package.json
      type: file
---
