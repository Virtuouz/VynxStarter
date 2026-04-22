---
name: site-data-navigation
description: Configure site-wide data including navigation, footer, SEO, banner, theme, and collections. Use when setting up or editing YAML data files under src/data/ or understanding how navigation components consume data.
---

# Site Data & Navigation

Site-wide data lives in YAML files under `src/data/`. These are imported in layouts and global wrapper components, and are editable through CloudCannon's data collection.

## Data files overview

| File                        | Purpose                  | Consumed by                                    |
| --------------------------- | ------------------------ | ---------------------------------------------- |
| `src/data/site.yaml`       | Site metadata & SEO      | `BaseLayout.astro`                             |
| `src/data/navigation.yaml` | Nav & footer links       | `global/Nav.astro`, `global/Footer.astro`      |
| `src/data/banner.yaml`     | Announcement banner      | `global/Banner.astro`                          |
| `src/data/theme.yaml`      | Design tokens & colors   | `BaseLayout.astro` (injected as CSS variables) |
| `src/data/collections.yaml`| Generic collection defs  | `content.config.ts`, dynamic route pages       |

---

## Navigation (`src/data/navigation.yaml`)

### Structure

```yaml
logo:
  source: "/images/logo.svg"
  alt: "Logo"

primary:
  - label: "Home"
    url: "/"
  - label: "Services"
    url: "/services/"
  - label: "Blog"
    url: "/blog/"

cta:
  label: "Search"
  url: "/search/"
  icon: "magnifying-glass"

footer:
  use_primary: true       # mirror primary nav in footer
  columns: []             # only used if use_primary is false
  socials:
    - icon: "social/github"
      link: "https://github.com"
    - icon: "social/x"
      link: "https://twitter.com"
  text: "© 2026 All rights reserved."
```

### How it renders

`global/Nav.astro` reads `navigation.yaml` and maps the `primary` array into props for `MainNav.astro` (which expects `navData` with `{name, path, children}` shape). The CTA is mapped into a `buttonSections` array.

`global/Footer.astro` reads `navigation.yaml`. When `footer.use_primary` is true, it mirrors the primary nav links. Socials render as icon-only ghost buttons.

Both are rendered as named slot defaults in `BaseLayout.astro`. Override by passing a custom component to the slot.

---

## Site Metadata (`src/data/site.yaml`)

### Structure

```yaml
name: "Your Site Name"
url: "https://yourdomain.com"
description: "Default meta description."
logoSource: "/images/logo.svg"
titleFormat: "{title} | Your Site Name"
twitterHandle: "@yourhandle"
```

`BaseLayout.astro` uses this for `<title>`, OpenGraph meta, canonical links, and JSON-LD structured data.

---

## Banner (`src/data/banner.yaml`)

### Structure

```yaml
enabled: false
text: "Free consultation through end of month."
cta_text: "Book now"
cta_url: "/contact"
dismissible: true
reappear_after: "1 week"   # false | "1 day" | "1 week" | "1 month"
```

`global/Banner.astro` renders at the top of every page via named slot in `BaseLayout.astro`. Dismissal logic uses localStorage with configurable reappear intervals.

---

## Theme (`src/data/theme.yaml`)

### Structure

```yaml
colors:
  primary:
    brand: "#000000"
    text: "#2a2a2a"
    bg: "#ffffff"
    # ... full color token set
  # Additional color groups applied via data-color-group="name"

typography:
  heading_font: "Raleway"
  content_font: "Inter"

rounding:
  button: "0.375rem"
  image: "0.5rem"
  card: "0.75rem"
```

`BaseLayout.astro` reads `theme.yaml` at build time and injects CSS custom properties via `<style is:inline>`. The primary color group sets `:root` variables. Additional groups generate `[data-color-group="name"]` selectors.

---

## Data flow diagram

```
src/data/site.yaml ──→ BaseLayout.astro (SEO, structured data)
src/data/theme.yaml ──→ BaseLayout.astro (CSS custom properties)

src/data/navigation.yaml ──→ global/Nav.astro ──→ MainNav.astro
                         ──→ global/Footer.astro ──→ Footer.astro

src/data/banner.yaml ──→ global/Banner.astro

BaseLayout.astro renders:
  <slot name="banner"> → Banner.astro (default)
  <slot name="nav">    → Nav.astro (default)
  <main><slot /></main>
  <slot name="footer"> → Footer.astro (default)
```

---

## Setting up for a new site

### Step 1: Update site metadata
Edit `src/data/site.yaml` — set name, url, description, titleFormat, twitterHandle.
Also update `site` in `astro.config.mjs` to match the production URL.

### Step 2: Update theme
Edit `src/data/theme.yaml` — set brand colors, fonts, rounding. Also update `site-fonts.mjs` if changing font families.

### Step 3: Update navigation
Edit `src/data/navigation.yaml` — set logo, primary nav items, CTA, footer config, and socials.

### Step 4: Configure banner
Edit `src/data/banner.yaml` — set enabled, text, CTA, dismissal behavior.

### Step 5: Add logo files
Place logo files in `public/images/` for static serving, or in `src/assets/images/` for Astro image optimization.
