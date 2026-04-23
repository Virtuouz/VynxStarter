# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- `pageLink` frontmatter field on the pages schema for overriding a page's URL slug.
- `draft` frontmatter field on the pages schema. Pages with `draft: true` are skipped at build time.
- Vynxlabs content migration on the `vynx` branch: home, about-us, contact, three service pages (`/services/launch-pad-website/`, `/services/operations-hub/`, `/services/ai-employee/`), and two blog posts. Brand theme, fonts (Oswald/Inter), logo, site metadata, navigation, banner, and source images migrated from vynxlabs.com.
- `heroes/hero-agency` page section: modern agency hero with monospace eyebrow pill, gradient-accent headline (wrap a word in `*italics*` to render it as a gradient), optional trusted-by logo row, and dot-grid + gradient-orb backdrop.
- `builders/process-timeline` page section: vertical numbered (01 / 02 / 03…) timeline with alternating content and framed media per phase.
- `info-blocks/stats-strip` page section: horizontal row of big-number trust anchors.
- `info-blocks/logo-cloud` page section: clean grid of client / partner logos for social proof.
- `info-blocks/pricing-table` page section: SaaS-style pricing cards with tier name, price, feature checklist, and one optional featured card.
- `people/testimonial-grid` page section: responsive grid of testimonial cards (quote, author photo, name, role) — replaces stacked full-width testimonials.
- `light` and `dark` color groups in `src/data/theme.json` alongside the primary palette, usable via `colorScheme: light` / `colorScheme: dark` on any section.

### Changed

- Page URLs now default to a slugified version of the page `title` (or `pageLink` when set) instead of the source filename. Folder names are still retained as URL segments, and `index.md` still represents the folder root.
- Primary theme palette in `src/data/theme.json` retuned to a dark-first, modern-agency aesthetic (near-black deep-blue base, electric cyan brand accent, muted slate text). Root `color-scheme` set to `dark` so browser UI elements follow the palette.
- Vynxlabs pages (home, about, contact, Launchpad Website, Operations Hub, AI Employee) redesigned to use the new section set: agency hero, process timeline for the 3S System, stats strips, testimonial grid, and pricing tables replacing the previous feature-grid pricing layout.

## [1.0.1] - 2026-03-19

### Added

- Reset button in Component Builder that clears all state and returns to the Build tab.
- Bento Box component for asymmetric grid layouts where items can span multiple columns and rows.
- Input component now supports optional leading and trailing icons in ACS.
- Font setup is centralized in `site-fonts.mjs` with `SiteFonts.astro`
- Modal component for dialog overlays, using the Popover API with CSS animations and minimal JS for accessibility.
- Button component now supports `popovertarget` and `popovertargetaction` props, forwarding them to the inner element.

### Changed

- Exported Astro components now use scoped `<style>` instead of `<style is:global>`.
- CSS uses Vite’s default pipeline (PostCSS for processing, esbuild for minification) instead of opting into Lightning CSS for transform while minifying with esbuild.
- Raised Vite `chunkSizeWarningLimit` to 1024 kB so builds don’t warn on expected large chunks (e.g. Shiki in component docs).

### Fixed

- ComponentViewer Astro code preview now renders child items for BentoBox and Masonry components instead of showing self-closing tags.
- Component Builder sandbox delete button styles: replace Sass-style `&-delete` nesting with a flat `.sandbox-item-btn.sandbox-item-btn-delete` selector so esbuild CSS minify doesn’t warn on invalid nesting.

- SVGO icon optimization: use `cleanupIds` override (SVGO 4 plugin name) so disabling ID cleanup no longer prints a preset warning at build time.
- Bento Box item column/row span changes now update visually in the CloudCannon editor.

- Icon component no longer exposes an unsupported `4xl` size option.
- Image component no longer converts SVGs to WebP — SVGs are now served as-is.
- Button component no longer relies on `display: contents` on its root wrapper.
- Definition list items no longer rely on `display: contents` on their root wrapper.
- Content selector items now use camelCase `iconName` and `subtext` fields for optional icons and supporting text.
- Heading icons now stay inline with heading text so titles wrap naturally after the icon.
- Heading icons now render at `0.9em` to better match heading text sizing.
- Content selector tabs now keep `aria-selected` and panel `aria-hidden` in sync as panels are switched.
- Content selector top navigation now shows a subtle muted underline on inactive items to match the start navigation style.
- Side navigation now shows the active link underline when `aria-current="page"` is set.
- Fix case where List doesn't work when using slot
