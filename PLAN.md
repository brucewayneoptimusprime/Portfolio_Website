# Portfolio Build Plan: Aditya Vikram Singh

**Status: approved.** This file is the source of truth for structure and build order. `CLAUDE.md` holds the brief and rules; all copy lives in `content/`.

## Approved decisions
- Hero: **concept A, "The Lancet Window"**.
- Headings: **Cormorant Garamond**, only at 28px and above.
- The filter grid shows **all 10 projects**; featured projects also appear large above it.
- A **bio strip** sits under the hero. **Education** goes in Recognition. **"How I work" and languages** go at the bottom of Contact.
- **`content/site.json`** holds button labels, nav labels and section names. Builder notes live in HTML comments, never in headings.
- No custom domain yet: deploy to the default `*.vercel.app` address.
- The content parser stays **small and simple**.

---

## 1. Folder structure and content loading

```
app/
  layout.tsx          fonts, <Nav/>, grain layer, metadata (built from about.md)
  page.tsx            puts the sections together in order (server component)
  theme.css           the ONLY place for tokens (Tailwind v4 @theme)
  globals.css         base styles, grain, focus rings, reduced-motion rules
  icon.svg, apple-icon.png   favicon (pointed arch) and 180px touch icon
  robots.ts, sitemap.ts      written at build time; URLs from lib/siteUrl.ts
components/
  sections/  Hero, BioStrip, FeaturedProjects, Experience, ProjectGrid, Skills,
             Recognition, Contact
  ui/        Nav*, SectionHeader, ArchDivider, ArchFrame, Card, Chip, TagFilter*,
             LinkButton, Reveal*, Rich (renders **bold** and links)
lib/
  content.ts          small parser + getters: getSite(), getAbout(), getProjects(),
                      getExperience(), getSkills(), getRecognition(); prints a build
                      warning listing any content line it could not map
  siteUrl.ts          the site URL from Vercel's env at build time (localhost fallback)
content/
  about.md, experience.md, clubs.md, projects.md, skills.md, recognition.md
  site.json           nav labels, section names, button and UI labels
public/resume.pdf, og.png (1200x630 share preview), projects/, logos/
```
Components marked `*` are client components. Everything else renders to static HTML.

### How content gets parsed
- Pages read `content/` at **build time** with `fs`, inside server components. Nothing is read at runtime, and `output: 'export'` keeps the site fully static for Vercel.
- `site.json` is imported directly as JSON.
- `lib/content.ts` is one small file that handles the markdown format the files already use:
  - HTML comments are removed first, so builder notes and `TODO`s never reach the page.
  - `## Heading` starts a group, `### Title` starts an entry, `key: value` lines become fields, and `- ` lines become bullets.
  - `How it works:` and `Highlights:` become named blocks.
  - Projects are split into featured and grid by the `tier:` field.
- **The parser never needs editing.** Adding a project means copying an existing `###` block and editing the text.
- `Rich` turns `**bold**` and links into React elements. It never injects HTML.
- No schema library: a few plain TypeScript checks are enough (below).

### How missing optional fields are handled
- A blank value (`demo:`) or a missing key becomes `undefined`. Each component checks for the value and renders nothing when it's absent: no placeholder, no disabled button.
- **Build-time checks** (the build fails with a clear message):
  - any rendered string contains "TODO"
  - a project tag isn't AI, Data or CV
  - a featured project has no `outcome`
- `public/resume.pdf` being missing triggers a warning, not a failure.

---

## 2. Theme file (`app/theme.css`)

### Colour tokens
| Token | Value | Use |
|---|---|---|
| `--bg` | #0A0A0F | page background |
| `--surface` / `--surface-2` | #12121A / #1A1A26 | cards / card hover |
| `--border` | rgba(161,139,255,.12) | hairlines |
| `--border-strong` | rgba(161,139,255,.24) | dividers, active filter |
| `--text` / `--muted` | #E8E6F0 / #9A98AB | body text (~16:1) / secondary text (~6.8:1, passes AA) |
| `--accent` | #7C5CFF | **fills and borders only**: buttons (white text on it ≈ 5:1), markers |
| `--accent-soft` | #A18BFF | **all accent-coloured text**, including links |
| `--glow` | rgba(124,92,255,.18) | hero glow only |

#7C5CFF as small text on `--bg` is about 4:1, which fails AA. That's why accent text always uses #A18BFF.

### Fonts (via `next/font`, self-hosted, Latin subset, `display: swap`)
- **Cormorant Garamond** 500/600 for headings, only at 28px and above.
- **Inter** 400/500/600 for body text.
- **Roboto Slab** 400 for the experience descriptions (impact line and bullets).
- **JetBrains Mono** 400/500 for labels, dates, tags and numbers.

### Type scale (fluid, `clamp()`)
- display: 44 → 88px
- h2: 32 → 48px
- h3: 28px (Cormorant floor); smaller card titles use Inter 600
- body: 16 → 17px
- mono labels: 12–13px with 0.12em letter-spacing

### Spacing and layout
- Spacing on a 4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Section padding: 64px mobile, 96–128px desktop.
- Content width: 1120px max. Text lines: 68ch max.
- Corner radius: 6px. Card padding: 24px mobile, 32px desktop.

### Gradient rules (exactly two uses, nowhere else)
1. **Hero glow:** one static radial ellipse in `--glow`, sitting inside the hero arch, about 60vw wide, fading to transparent. It never moves. Turned off under `prefers-contrast: more`.
2. **Card hover border:** a violet gradient border made with a masked pseudo-element. Opacity goes from 0 to 1 over 200ms on hover or keyboard focus.

No gradient text, no gradient buttons, no gradient backgrounds anywhere else.

---

## 3. Page layout, section by section

Order: Hero → Bio strip → I Experience → II Featured projects → III All projects → IV Skills → V Research and recognition → VI Contact.
Section names, nav labels and button labels come from `content/site.json`. Roman numerals are generated from this order.

### Hero: concept A, "The Lancet Window"

```
┌───────────────────────────┐
│          ╱‾‾╲              │
│         ╱    ╲   ← hairline│
│        │ glow │    arch    │
│   Aditya Vikram Singh      │
│      AI ENGINEER           │
│   pitch line…              │
│     [Download resume]      │
└───────────────────────────┘
```
- Centred and symmetrical. The violet glow sits inside a tall pointed-arch outline, like light through a church window.
- Name, title and pitch from `about.md`; button labels from `site.json`.
- One button, "Download resume", linking to `/resume.pdf`. It is hidden while the file is missing.
- On mobile the arch scales down and stays behind the name.

### Bio strip (no numeral)
- A single band under the hero with the short bio from `about.md`, max 68ch, between two hairline arch dividers.
- Below the bio, the optional stats from `about.md` as a wrapping row of small mono items (no icons; hidden when the list is empty).

### I. Experience
- Vertical timeline with a hairline spine, newest first.
- **Distinctive idea:** each role's marker is a small pointed arch; the newest role's marker is filled violet.
- Dates in mono in the left gutter. The first bullet of each role is the impact line.
- Below the timeline, a compact "Clubs and volunteering" list from `clubs.md`: one row each (name, role, dates), newest first, no markers or bullets. Its heading comes from `site.json`.

### II. Featured projects
- One full-width card for the invoice agent, then the agentic RAG, forest dashboard, music genre analysis and quantum circuit cards in a 2x2 grid on desktop (one column on mobile). Each card carries a roman numeral (I–V).
- **Distinctive idea:** the key number or highlight is set as a large figure that anchors the card (e.g. "14 deterministic rules", "Runs fully local").
- The invoice card also shows its pipeline as a mono step strip: `ingest → extract → match → validate → decide → act`.
- Highlights sit inside a native `<details>`: engineers can open them, skimmers see only the outcome. Details stay concise: at most 4 bullets, one sentence each, and the stack on one line.

### III. All projects (filterable grid)
- Shows **all 10 projects** as compact cards, including the five featured ones.
- **Distinctive idea:** the filter is a segmented control in small-caps labels, `ALL · AI · DATA · CV · RESEARCH`, with live counts.
- Cards reflow with Framer Motion's `layout` animation (instant under reduced motion).
- The chosen filter is mirrored in the URL (`?tag=CV`) so a filtered view can be shared.
- Cards show tags plus secondary chips, capped at 4. Secondary chips (Finance, RAG, Agents, BI, ML, Automation) are never filters. The tech stack appears only in expanded details.

### IV. Skills
- **Distinctive idea:** the AI and LLM panel spans two columns and leads visually. The other three groups are equal panels of text separated by mid-dots, with no logos.
- The SQL practice note is a callout box with an arched top, like a marginal note.

### V. Research and recognition
- Publications styled as manuscript entries: italic serif titles, venue in mono. The patent is labelled "Patent application (published)".
- **Distinctive idea:** hackathon placings as a ledger of large serif ordinals (1st, 2nd, 2nd, 3rd, Top 10).
- Certifications (with issuer and date) and **education** as compact lists, with an "All certifications on LinkedIn" link below the certifications.

### VI. Contact
- **Distinctive idea:** a closing arch "doorway" mirrors the hero, framing the email as a large link with a copy button, plus LinkedIn and GitHub.
- Below it: **"How I work"** and **languages** from `about.md`.
- Footer: name and year. No phone number anywhere.

---

## 4. Gothic touches without hurting readability or performance

- **Pointed arches:** small inline SVG components (`ArchDivider`, `ArchFrame`) using `stroke: var(--border-strong)` and `aria-hidden`. No images, no clip-path on text containers, never behind body text.
- **Roman numerals:** generated from section order by a `toRoman()` helper, so reordering sections renumbers them automatically. `aria-hidden`, so screen readers hear the section name, not the number.
- **Small-caps labels:** JetBrains Mono, uppercase, 0.12em letter-spacing, 12–13px, in `--muted` or `--accent-soft`. Labels only, never paragraphs.
- **Film grain:** one fixed `body::after` with a tiny inline SVG noise texture (~1 KB).
  - Opacity about 0.05, no movement, no `mix-blend-mode` (which forces repaints on scroll), `pointer-events: none`.
  - Turned off under `prefers-contrast: more`.
- **Overall cost:** no decoration needs JavaScript. Framer Motion loads through `LazyMotion`, only for scroll reveals and the filter. Target: Lighthouse performance 95+.

---

## 5. Mobile behaviour

- **Nav**
  - 56px sticky bar: name or monogram on the left; LinkedIn, GitHub and a menu button on the right.
  - The menu opens a full-width sheet with the 5 section links (they don't fit across 375px).
  - Current section highlighted while scrolling.
  - `scroll-margin-top` stops headings landing under the bar.
- **Cards**
  - One column, full width.
  - Key number or highlight on top, chips wrap, details collapsed.
  - Tap targets at least 44px.
  - Timeline spine moves to the left edge, with dates above each title.
- **Filter**
  - Five equal segments across the full width; on phones each count sits under its label so all five fit at 375px.
  - Sticks just below the nav while scrolling through the grid.

---

## 6. Build order (each milestone runs with `npm run dev`)

| # | Milestone | What to check at the end |
|---|---|---|
| M0 | Scaffold: Next, TS, Tailwind v4, static export, fonts, theme.css, grain, a temporary colour-swatch page (removed before launch) | Dev server runs, `npm run build` passes, fonts load, grain is barely visible |
| M1 | Content layer: `lib/content.ts`, `site.json` loading, build checks, a temporary debug page dumping parsed content (removed before launch; unmapped lines are now a build warning) | Every field shows correctly; typing "TODO" into an outcome breaks the build; empty `demo:` disappears |
| M2 | Shell: Nav (with mobile sheet), SectionHeader with numerals, ArchDivider, footer, anchors | Anchor links land under the nav; menu works at 375px; keyboard focus visible |
| M3 | Hero (concept A), glow, resume button, bio strip | Name and role clear within 5 seconds; 375px and 1440px both look right |
| M4 | Featured projects | Invoice agent visible within 15 seconds; `<details>` works; all five cards show a number or highlight |
| M5 | Experience timeline | Newest role first; spine works on mobile |
| M6 | All projects grid (all 10) and filter | Counts correct; `?tag=` works; reduced motion makes it instant |
| (after M7) | Reorder: Experience before Featured projects | Numerals renumber I–VI from the new order; nav lists Experience first; every anchor lands under the nav |
| M7 | Skills, Recognition (with education), Contact (with How I work and languages) | AI panel leads; email copy button works; no phone number |
| M8 | Polish: reveal animations, metadata and preview image, favicon, accessibility pass, Lighthouse, Vercel preview deploy | No console errors; Lighthouse 95+ in all categories; real-phone check |

Every milestone also meets the `CLAUDE.md` definition of done: no console errors, `npm run build` passes, looks right on mobile and desktop, all text comes from `content/`.

---

## 7. Remaining notes
- **Resume:** `public/resume.pdf` exists locally but is not committed, because it contains a phone number. Until a version without it is committed, the deployed site hides the resume button.
- **Domain:** none yet. `metadataBase` comes from Vercel's `VERCEL_PROJECT_PRODUCTION_URL` at build time, falling back to `http://localhost:3000` locally.
- **Brand icons:** lucide-react no longer ships LinkedIn/GitHub icons; inline the official SVGs from simple-icons.
- **SageMaker:** still left out of Skills until hands-on depth is confirmed (the only `TODO` in `content/`).
