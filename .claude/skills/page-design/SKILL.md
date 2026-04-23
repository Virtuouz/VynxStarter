---
name: page-design
description: Design-first workflow for new pages in this Astro + CloudCannon starter. Use when planning a new page from scratch, sketching the layout before implementation, deciding whether to reuse or extend existing page sections, or figuring out how to realize a design intent that the current page sections don't cleanly express. Invoke this before page-content-authoring whenever the page doesn't yet have a layout in mind.
---

# Page Design

Design the page first. Then figure out how to build it.

The existing page sections under `src/components/page-sections/` are a great _starting point_ — they cover a lot of marketing-page ground. But they are not a fixed vocabulary that every new page must speak. When a design calls for something the current sections don't express cleanly, the right answer is usually a new page section, not a worse version of the design crammed into an existing one.

The consistency of the site comes from the **building blocks** (`src/components/building-blocks/`), not from the page sections. As long as a new page section is composed of the same building blocks as everything else, it will look and behave like it belongs.

---

## When to use this skill

- The user describes a new page and there is no visual reference or layout yet.
- The user has a rough idea ("a services page", "a careers page") but hasn't decided the sections.
- The user has a design or layout in mind that doesn't obviously map to existing sections.
- You are about to jump straight into authoring `pageSections` YAML and realize the page needs more thought first.

If the user already has a finished layout in mind and just needs the YAML, skip ahead to the [page-content-authoring skill](../page-content-authoring/SKILL.md).

If the user pastes a screenshot, the [screenshot-to-component skill](../screenshot-to-component/SKILL.md) covers the scaffolding. This skill is the layer above that — it decides _what_ to build before that skill decides _how_.

---

## The core principle

> **Design the page. Then decide how to realize it.**
> **Don't let the existing catalog shape the design.**

Treat this as a guideline, not a rule. If an existing section happens to be exactly right, use it. But don't talk yourself into "close enough" just because it already exists — that is how a starter turns into a same-shaped set of sites.

### Two layers of consistency

| Layer              | Where consistency lives                          | Freedom to extend                                                    |
| ------------------ | ------------------------------------------------ | -------------------------------------------------------------------- |
| **Building blocks** | `src/components/building-blocks/` — core elements and wrappers (Heading, Text, Image, Button, Grid, Split, Card, Accordion, Carousel, etc.) | Extend sparingly. These are the visual vocabulary. |
| **Page sections**   | `src/components/page-sections/{category}/` — full-width compositions of building blocks | Extend freely. Add new ones whenever the design warrants it.          |

Building blocks are the shared language. Page sections are sentences in that language. A site can have as many page-section sentences as it needs, as long as every one uses the same words.

---

## Workflow

### Phase 1 — Design

Before opening `src/content/pages/` or the component catalog, answer these questions. If the user's brief is vague, ask.

1. **What is the page for?** What should a visitor understand, feel, or do after reading it?
2. **Who is it for?** Same audience as the rest of the site, or a specific persona (e.g., candidates for a careers page)?
3. **What is the core message hierarchy?** List the 3–7 things the page needs to convey, in priority order.
4. **What shape does the page want to be?** Sketch (in prose or ASCII) a top-to-bottom list of conceptual sections — not component names, just ideas. Examples:
   - "Intro with a tagline and two CTAs"
   - "Three things that make us different, side-by-side"
   - "A scrollable timeline of milestones"
   - "Two testimonials stacked, then a contact form"
5. **Are there visual constraints?** A specific feel (playful, minimal, editorial), a must-have layout element (a full-bleed image, a sticky side panel), a reference the user wants to echo.

Describe this design back to the user in a few sentences and confirm before proceeding. Design is the artefact being validated in this phase, not code.

### Phase 2 — Map to existing page sections (as a guideline)

Now — and only now — look at the existing page section catalog (see the [page-content-authoring skill](../page-content-authoring/SKILL.md) for the full list). For each conceptual section from Phase 1, ask:

| Question                                                        | If yes                     | If no                            |
| --------------------------------------------------------------- | -------------------------- | -------------------------------- |
| Is there an existing section that expresses this shape cleanly? | Use it.                    | Move to the next question.       |
| Is there one that's a close fit with minor prop tweaks?         | Use it, note the trade-off. | Move to the next question.       |
| Would using the closest existing section distort the design?    | Flag as a gap.             | —                                |

Be honest about "close fit". If you catch yourself dropping an element from the design to make it fit an existing section, that's a gap, not a fit.

### Phase 3 — Decide: reuse, extend prop-set, or create new

For each gap from Phase 2, pick one:

- **Reuse with prop tweaks.** The existing section can express the design via existing props (swap `reverse`, change `colorScheme`, populate more items). No code changes needed.
- **Extend an existing section.** A small, generally useful prop is missing. Add the prop to the existing section's Astro component, inputs YAML, and structure-value YAML. Prefer this when the change benefits more than just this one page.
- **Create a new page section.** The design calls for a layout or interaction the existing catalog doesn't express. Scaffold a new page section under an appropriate category (`builders`, `ctas`, `features`, `heroes`, `info-blocks`, `people`) following the [create-component skill](../create-component/SKILL.md).

When in doubt, prefer creating a new section over bending an existing one. An honest new section is easier to maintain than an existing section with a `variant: "the-one-we-added-for-careers"` prop.

### Phase 4 — Build new sections (if needed)

When a new page section is needed:

- Compose it from existing **building blocks** (core elements + wrappers). See the composition rules and building-block reference in the [screenshot-to-component skill](../screenshot-to-component/SKILL.md).
- Only create a new building block if the same atomic primitive will be reused across multiple page sections. A one-off building block is a smell — if it's only used here, its markup belongs inside the page section.
- Wrap the content in `CustomSection` so theming, padding, and background props behave like the rest of the catalog.
- Use design tokens (`var(--spacing-*)`, `var(--color-*)`, `var(--font-size-*)`, `var(--radius-*)`) for all visual values. Never hard-code colors, font sizes, or spacing.
- Follow CloudCannon editable-binding conventions from the [editable-regions skill](../editable-regions/SKILL.md).

### Phase 5 — Author the page

With all sections available (existing + new), populate `src/content/pages/{slug}.md` using the patterns in the [page-content-authoring skill](../page-content-authoring/SKILL.md).

---

## Decision framework: reuse vs. new section

Use this table as a tiebreaker when it's not obvious.

| Signal                                                           | Lean toward    |
| ---------------------------------------------------------------- | -------------- |
| Layout shape matches an existing section; only content differs   | Reuse          |
| Existing section needs one new prop; same prop helps other pages | Extend         |
| Design drops, merges, or reorders elements inside the section    | Extend or new  |
| Design introduces a new element type (timeline, split stats…)    | New section    |
| Interaction pattern isn't in the existing catalog                | New section    |
| You find yourself describing the section as "like X but…"        | New section    |
| Reusing would require CSS overrides from the page level          | New section    |
| Only this page will ever use this shape                          | Still build it — put it under `builders/` if it's truly bespoke |

---

## Example: a short careers page

**Brief**: "A careers page that tells candidates why we're a good place to work and lists open roles."

### Phase 1 — design

1. Purpose: get candidates excited and applying.
2. Audience: prospective hires.
3. Message hierarchy:
   1. Who we are in one line + a photo of the team.
   2. Three things candidates should know about working here.
   3. Open roles.
   4. Encouragement to apply even if no role fits.
4. Shape:
   - Opening: tagline + team photo.
   - "What it's like here" — three beats, each with a small visual.
   - Open roles — list of role title + location + link.
   - Closing: encouragement + contact CTA.

### Phase 2 — map

| Conceptual section   | Closest existing              | Fit?                                                              |
| -------------------- | ----------------------------- | ----------------------------------------------------------------- |
| Opening tagline+team | `heroes/hero-split`           | Good fit — text on one side, image on the other.                  |
| Three beats          | `features/feature-grid`       | Fit — three items with icon/title/description.                    |
| Open roles list      | — none —                      | Gap. Closest is `feature-grid`, but roles aren't really features. |
| Closing CTA          | `ctas/cta-center`             | Good fit.                                                         |

### Phase 3 — decide

- Opening → `hero-split`.
- Beats → `feature-grid`.
- Open roles → **new page section** `info-blocks/role-list`, composed of `Heading`, `DefinitionList` (or `Card` + `Grid`), and `Button` building blocks. Items array: `title`, `location`, `link`.
- Closing → `cta-center`.

### Phase 4 — build

Scaffold `role-list` following the create-component skill. Compose from existing building blocks; no new atoms needed.

### Phase 5 — author

Populate `src/content/pages/careers.md` with the four-section `pageSections` array.

---

## Anti-patterns

- **Catalog-shaped design.** Sketching the page out of the existing section names first. That's what leads to every site looking the same.
- **Close-enough creep.** Repeatedly using "it's close enough to hero-split" until the page is a chain of hero-splits. Each individual call felt fine; the result is monotonous.
- **One-off building blocks.** Creating a new core element or wrapper that only one page section uses. Keep that markup local to the page section instead.
- **Hard-coded styles in a new page section.** A new page section must still speak the design-token vocabulary, or it will visually drift from the rest of the site.
- **Skipping Phase 1.** Jumping into YAML before the design is described in words. The design should be something the user can react to before any code exists.

---

## Related skills

- [page-content-authoring](../page-content-authoring/SKILL.md) — assembling `pageSections` YAML from a chosen set of sections.
- [screenshot-to-component](../screenshot-to-component/SKILL.md) — turning a visual reference into a new page section.
- [create-component](../create-component/SKILL.md) — file layout, naming, and CloudCannon conventions for any new component.
- [editable-regions](../editable-regions/SKILL.md) — wiring CloudCannon visual-editing bindings on new components.
- [theming](../theming/SKILL.md) — the design-token system every new section should use.
