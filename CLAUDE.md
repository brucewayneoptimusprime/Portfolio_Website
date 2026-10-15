# Portfolio website: Aditya Vikram Singh

## Goal
A personal portfolio that positions Aditya as an **AI Engineer** first, with data analytics, research and recognition as supporting depth. Audience: recruiters and hiring managers who skim for ~30 seconds, then engineers who dig into the projects.

The visitor should know who he is within 5 seconds, find his best work within 15, and be able to sift through everything else without effort.

## How to work
- **`PLAN.md` is the source of truth for structure and build order** (approved). Build milestone by milestone as it describes. Propose and get approval before changing structure that differs from it.
- Run locally with `npm run dev` and check the result in the browser before calling anything done.
- Keep it simple: no backend, no database. A static site that deploys to Vercel with zero config.
- Never invent facts about Aditya. **All copy comes from `content/`.** If something is missing, add a `TODO` and ask, do not make it up.
- The text "TODO" must never appear on the rendered site. `TODO`s live only in content comments or notes.
- Optional fields (project `demo`, `repo`, `video`, `key number`, `highlight`, `chips`) may be empty. When a value is missing, the link, button or element simply does not render: no placeholder, no disabled button.

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS. Static export friendly.
- Content lives in `content/*.md` and `content/*.json`; components read from there. Editing text must never require touching components.
- `content/site.json` holds nav labels, section names, button labels and other UI strings. Builder notes in content files go in HTML comments, never in headings.
- Keep the content parser small and simple.
- Animation: Framer Motion (light use). Respect `prefers-reduced-motion`.
- Fonts via `next/font` (self-hosted).
- Deploy target: Vercel. Do not add anything that breaks static hosting.

## Design direction: dark gothic-technical, minimal but attractive
**Colour tokens (define once in a single theme file / CSS variables so the look can be changed later):**
- `--bg`: #0A0A0F (near-black with a faint blue-violet tint, never pure black)
- `--surface`: #12121A (cards), `--surface-2`: #1A1A26 (hover)
- `--border`: hairline, low-opacity white/violet
- `--text`: off-white #E8E6F0 (body), `--muted`: #9A98AB (secondary; keep contrast readable)
- `--accent`: violet #7C5CFF, with a lighter tint #A18BFF
- **Accent-coloured text always uses #A18BFF** (links, labels, hover text). Use #7C5CFF only for fills and borders; it fails contrast as small text.
- One accent only. Do not introduce a second brand colour.

**Gradients (sparingly):** a soft violet radial glow behind the hero; a faint gradient border that appears on card hover. Nowhere else.

**Typography:** Cormorant Garamond for headings, used only at 28px and above, clean sans for body (Inter), Roboto Slab for the experience descriptions (impact line and bullets), monospace (JetBrains Mono) for labels, tags, dates and small technical details. No blackletter, at most one tiny flourish.

**Gothic touches, kept minimal:** hairline borders, pointed-arch shapes as dividers or card corners, roman numerals for section numbers (I, II, III...), small-caps section labels, a subtle film-grain overlay.

**Skimmability rules:**
- Sticky nav with anchor links (Experience, Projects, Skills, Recognition, Contact) plus LinkedIn and GitHub icons.
- Project cards: one-line outcome, 3 to 4 tag chips, and a key number or a short highlight line (whichever exists; both are optional). Bold the crucial phrases.
- Tags: the project filter has exactly four tags: **AI, Data, CV, Research** (from each project's `tags` field). Anything else (e.g. Finance, RAG, Agents, BI, ML, Automation, from the `chips` field) renders as a small secondary chip and is never a filter.
- Strong contrast on all text. No small grey-on-black body copy.
- Fully responsive; check at 375px width.

## Page structure
1. **Hero (concept A, "The Lancet Window"):** centred; name, "AI Engineer", one-line pitch, one button (Download resume → `/resume.pdf`), violet glow inside a pointed-arch outline.
2. **Bio strip:** the short bio from `about.md`, directly under the hero, then the optional stats from `about.md` as small mono items.
3. **Experience:** timeline, newest first, impact-first bullets; then a compact "Clubs and volunteering" list from `clubs.md`.
4. **Featured projects (5, large):** invoice processing agent (full width), then agentic RAG financial product, Power BI forest dashboard, music genre analysis and quantum circuit in a 2x2 grid (one column on mobile).
5. **All projects:** filterable grid (AI, Data, CV, Research) showing **all 10 projects**, featured ones included. The invoice agent is a standalone project: never associate it with any company or employer.
6. **Skills:** grouped, not a wall of logos. Include the SQL practice note.
7. **Research and recognition:** IEEE paper, patent application (published), hackathon ranks, certifications, education.
8. **Contact:** email, LinkedIn, GitHub, then "How I work" and languages. No phone number on the public site.

## Deployment
- No custom domain yet: use the default `*.vercel.app` address.

## Privacy and repo hygiene
- The phone number does not appear anywhere on the site's pages. The public contact email is adityapersonalusefighttry@gmail.com (also in `content/about.md`).
- The downloadable resume PDF (`public/resume.pdf`) intentionally includes the phone number. That is a deliberate choice, not a bug.
- Never commit job-application notes, tailored resumes for specific companies, or credentials.
- The resume PDF for download lives at `public/resume.pdf` (served as `/resume.pdf`).

## Definition of done for each milestone
- Runs locally with no console errors, builds with `npm run build`, looks right on mobile and desktop, all text comes from `content/`.
