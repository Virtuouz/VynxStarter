---
name: site-data-navigation
description: Configure site-wide data including navigation, footer, SEO, banner, theme, and collections. Use when setting up or editing JSON data files under src/data/ or understanding how navigation components consume data.
---

# Site Data & Navigation

Site-wide data lives in JSON files under `src/data/`. These are imported in layouts and global wrapper components, and are editable through CloudCannon's data collection.

## Data files overview

| File                        | Purpose                  | Consumed by                                    |
| --------------------------- | ------------------------ | ---------------------------------------------- |
| `src/data/site.json`        | Site metadata & SEO      | `BaseLayout.astro`                             |
| `src/data/navigation.json`  | Nav & footer links       | `global/Nav.astro`, `global/Footer.astro`      |
| `src/data/banner.json`      | Announcement banner      | `global/Banner.astro`                          |
| `src/data/theme.json`       | Design tokens & colors   | `BaseLayout.astro` (injected as CSS variables) |
| `src/data/collections.json` | Generic collection defs  | `content.config.ts`, dynamic route pages       |

---

## Navigation (`src/data/navigation.json`)

### Structure

```json
{
  "logo": {
    "source": "/images/logo.svg",
    "alt": "Logo"
  },
  "primary": [
    { "label": "Home", "url": "/" },
    { "label": "Services", "url": "/services/" },
    { "label": "Blog", "url": "/blog/" }
  ],
  "cta": {
    "label": "Search",
    "url": "/search/",
    "icon": "magnifying-glass"
  },
  "footer": {
    "use_primary": true,
    "columns": [],
    "socials": [
      { "icon": "social/github", "link": "https://github.com" },
      { "icon": "social/x", "link": "https://twitter.com" }
    ],
    "text": "© 2026 All rights reserved."
  }
}
```

`footer.use_primary: true` mirrors the primary nav; `columns` is only used when it's false.

### How it renders

`global/Nav.astro` reads `navigation.json` and maps the `primary` array into props for `MainNav.astro` (which expects `navData` with `{name, path, children}` shape). The CTA is mapped into a `buttonSections` array.

`global/Footer.astro` reads `navigation.json`. When `footer.use_primary` is true, it mirrors the primary nav links. Socials render as icon-only ghost buttons.

Both are rendered as named slot defaults in `BaseLayout.astro`. Override by passing a custom component to the slot.

---

## Site Metadata (`src/data/site.json`)

### Structure

```json
{
  "name": "Your Site Name",
  "url": "https://yourdomain.com",
  "description": "Default meta description.",
  "logoSource": "/images/logo.svg",
  "titleFormat": "{title} | Your Site Name",
  "twitterHandle": "@yourhandle"
}
```

`BaseLayout.astro` uses this for `<title>`, OpenGraph meta, canonical links, and JSON-LD structured data.

---

## Banner (`src/data/banner.json`)

### Structure

```json
{
  "enabled": false,
  "text": "Free consultation through end of month.",
  "cta_text": "Book now",
  "cta_url": "/contact",
  "dismissible": true,
  "reappear_after": "1 week"
}
```

`reappear_after` accepts `false`, `"1 day"`, `"1 week"`, or `"1 month"`.

`global/Banner.astro` renders at the top of every page via named slot in `BaseLayout.astro`. Dismissal logic uses localStorage with configurable reappear intervals.

---

## Theme (`src/data/theme.json`)

### Structure

```json
{
  "colors": {
    "primary": {
      "brand": "#000000",
      "text": "#2a2a2a",
      "bg": "#ffffff"
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

Additional color groups under `colors` (sibling to `primary`) are applied via `data-color-group="name"`.

`BaseLayout.astro` reads `theme.json` at build time and injects CSS custom properties via `<style is:inline>`. The primary color group sets `:root` variables. Additional groups generate `[data-color-group="name"]` selectors.

---

## Data flow diagram

```
src/data/site.json ──→ BaseLayout.astro (SEO, structured data)
src/data/theme.json ──→ BaseLayout.astro (CSS custom properties)

src/data/navigation.json ──→ global/Nav.astro ──→ MainNav.astro
                         ──→ global/Footer.astro ──→ Footer.astro

src/data/banner.json ──→ global/Banner.astro

BaseLayout.astro renders:
  <slot name="banner"> → Banner.astro (default)
  <slot name="nav">    → Nav.astro (default)
  <main><slot /></main>
  <slot name="footer"> → Footer.astro (default)
```

---

## Setting up for a new site

### Step 1: Update site metadata
Edit `src/data/site.json` — set name, url, description, titleFormat, twitterHandle.
Also update `site` in `astro.config.mjs` to match the production URL.

### Step 2: Update theme
Edit `src/data/theme.json` — set brand colors, fonts, rounding. Also update `site-fonts.mjs` if changing font families.

### Step 3: Update navigation
Edit `src/data/navigation.json` — set logo, primary nav items, CTA, footer config, and socials.

### Step 4: Configure banner
Edit `src/data/banner.json` — set enabled, text, CTA, dismissal behavior.

### Step 5: Add logo files
Place logo files in `public/images/` for static serving, or in `src/assets/images/` for Astro image optimization.
