---
name: theming
description: Customize the design system for brand matching. Use when changing colors, fonts, spacing, or other design tokens, extending the theme system, or migrating an existing brand into this Astro component starter.
---

# Theming & Design Tokens

All visual styling uses CSS custom properties (design tokens). Components never hardcode colors, spacing, fonts, or other visual values — they reference tokens so the entire look can be changed from `src/data/theme.json`.

## Token pipeline

```
src/data/theme.json              → color groups, fonts, rounding (editable in CloudCannon)
BaseLayout.astro                 → reads theme.json, injects CSS variables via <style is:inline>
src/styles/variables/*.css       → raw palette scales, spacing, fonts, layers, etc.
src/styles/style.css             → imports everything (entry point)
```

CSS layer order (declared in `BaseLayout.astro`):

```css
@layer reset, base, components, page-sections, utils, overrides;
```

---

## Theme system (`src/data/theme.json`)

The theme file is the primary source of truth for brand colors. It defines one or more **color groups**.

### Structure

```json
{
  "colors": {
    "primary": {
      "brand": "#000000",
      "brand_muted": "#404040",
      "brand_subtle": "#6a6a6a",
      "brand_on": "#ffffff",
      "text": "#2a2a2a",
      "text_strong": "#000000",
      "text_muted": "#555555",
      "text_on_muted": "#000000",
      "text_on_brand": "#ffffff",
      "text_inverse": "#ffffff",
      "link": "blue",
      "link_hover": "darkblue",
      "bg": "#ffffff",
      "bg_surface": "#eaeaea",
      "bg_muted": "#d4d4d4",
      "bg_accent": "#d5fdff",
      "bg_highlight": "#fff9d6",
      "bg_brand": "#000000",
      "bg_brand_muted": "#404040",
      "bg_inverse": "#000000",
      "border": "#aaaaaa",
      "border_inputs": "#6a6a6a",
      "border_strong": "#2a2a2a",
      "border_subtle": "#eaeaea",
      "state_hover": "rgba(0, 0, 0, 0.04)",
      "state_active": "rgba(0, 0, 0, 0.08)",
      "overlay": "rgba(0, 0, 0, 0.5)",
      "focus_ring": "rgba(0, 87, 255, 0.4)",
      "error": "#f00"
    },
    "dark": {
      "brand": "#ffffff",
      "text": "#eaeaea",
      "bg": "#000000"
    }
  },
  "typography": {
    "heading_font": "Raleway",
    "content_font": "Inter"
  },
  "rounding": {
    "button": "0.375rem",
    "image": "0.5rem",
    "card": "0.75rem"
  }
}
```

The `primary` group is injected on `:root`. Additional groups (e.g., `dark`) generate `[data-color-group="name"]` selectors — they may be partial or full overrides.

### How color groups work

- The `primary` group sets `:root` CSS variables. Every page uses these by default.
- Additional groups (e.g., `dark`, `inverted`, `accent`) generate CSS like `[data-color-group="dark"] { ... }`.
- Apply a color group to any section by setting `colorScheme` prop on `CustomSection.astro` or `Card.astro` — this sets the `data-color-group` attribute.

### Color token mapping

Each key in a color group maps to a CSS variable:

| JSON key       | CSS variable           |
| -------------- | ---------------------- |
| `brand`        | `--color-brand`        |
| `brand_muted`  | `--color-brand-muted`  |
| `text`         | `--color-text`         |
| `bg`           | `--color-bg`           |
| `bg_surface`   | `--color-bg-surface`   |
| `border`       | `--color-border`       |
| `error`        | `--color-error`        |
| ...            | Pattern: `--color-{key with _ → -}` |

---

## Static token files (`src/styles/variables/`)

These define scales and values that don't change per color group:

| File                | Contents                          |
| ------------------- | --------------------------------- |
| `_spacing.css`      | Spacing scale (xs through 6xl)    |
| `_fonts.css`        | Font sizes, weights, responsive   |
| `_colors.css`       | Raw gray scale & utility colors   |
| `_radius.css`       | Border radius scale               |
| `_content-widths.css` | Container max-widths            |
| `_animations.css`   | Transition timings                |
| `_aspects.css`      | Aspect ratio values               |
| `_layers.css`       | Z-index scale                     |

These files provide foundational tokens. Components reference semantic tokens from the theme system for colors, and these static scales for everything else.

---

## Font configuration

Fonts are managed in `site-fonts.mjs` at the project root. Font family names should match `theme.json`'s `typography` section.

```js
// site-fonts.mjs
import { fontProviders } from 'astro/config';

export const siteFonts = [
  {
    name: 'Inter',             // Must match theme.json typography.content_font
    cssVariable: '--font-body',
    provider: fontProviders.google(),
    weights: [400, 600, 700],
    styles: ['normal'],
  },
  {
    name: 'Raleway',           // Must match theme.json typography.heading_font
    cssVariable: '--font-headings',
    provider: fontProviders.google(),
    weights: [400, 600, 700],
    styles: ['normal'],
  },
];
```

When changing fonts, update both `site-fonts.mjs` and `theme.json` typography section.

---

## Extending the theme system

### Adding a new color token

1. Add the key to the `primary` color group in `theme.json`
2. Add the mapping in `BaseLayout.astro`'s `colorVarMap` object
3. Add the same key to any additional color groups that need it
4. Use `var(--color-your-token)` in components

### Adding non-color tokens

For spacing, radius, or other scales: edit the appropriate file in `src/styles/variables/`. These are defined in CSS, not in theme.json, because they don't typically change per color group.

### Adding a new color group

Add a new key under `colors` in `theme.json`:

```json
{
  "colors": {
    "primary": { },
    "accent": {
      "brand": "#2563eb",
      "text": "#ffffff",
      "bg": "#2563eb"
    }
  }
}
```

You only need to define tokens that differ from primary. Use it on any section: `<CustomSection colorScheme="accent">`.

---

## Brand migration workflow

1. **Set brand colors**: Edit `src/data/theme.json` primary color group with brand values
2. **Add color groups**: Add additional groups for dark sections, accent sections, etc.
3. **Set brand fonts**: Edit `site-fonts.mjs` and `theme.json` typography section
4. **Adjust rounding**: Edit `theme.json` rounding section
5. **Update gray scale** (optional): Edit `src/styles/variables/_colors.css` for warm/cool grays
6. **Adjust spacing** (optional): Edit `src/styles/variables/_spacing.css` if brand requires it
