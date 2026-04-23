# Project notes for Claude Code

## Skills

Project skills live in `.claude/skills/`. They are invoked automatically when their description matches the task, or explicitly as `/<skill-name>`.

| Skill                      | Use when                                                           |
| -------------------------- | ------------------------------------------------------------------ |
| `blog-mdx-content`         | Writing blog posts or embedding components in MDX                  |
| `create-component`         | Scaffolding a new component, wrapper, or page section              |
| `debug-cloudcannon`        | CloudCannon visual editing isn't working as expected               |
| `editable-regions`         | Wiring `data-prop` / `data-children-prop` bindings on components   |
| `migrate-existing-site`    | Porting an existing site into this starter                         |
| `page-content-authoring`   | Assembling pages from existing components                          |
| `page-design`              | Designing a new page from scratch before picking or building sections |
| `screenshot-to-component`  | Turning a screenshot into an Astro page-section component          |
| `site-data-navigation`     | Editing `src/data/*.json` (site, navigation, theme, banner, etc.)  |
| `theming`                  | Changing brand colors, fonts, rounding, or design tokens           |

## Changelog

When making functional changes (bug fixes, new features, enhancements, breaking changes), add an entry to the `[Unreleased]` section of `CHANGELOG.md` using [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) categories: **Added**, **Changed**, **Deprecated**, **Removed**, **Fixed**, **Security**.

Skip changelog entries for refactors, code style changes, or other internal-only changes with no user-facing impact.
