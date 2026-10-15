# Portfolio website

A single-page personal portfolio for Aditya Vikram Singh. It is a static site: no backend and no database.

## Stack

- Next.js (App Router) with TypeScript, built as a static export (`output: "export"`)
- Tailwind CSS v4; colours, type and spacing are defined once in `app/theme.css`
- `motion` for the project-grid filter animation
- Fonts self-hosted through `next/font`

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
npm run lint
```

## Editing the text

All copy lives in `content/`; editing text never requires touching components.

| File | What it holds |
|---|---|
| `about.md` | name, title, pitch, bio, stats, how I work, links, languages |
| `experience.md` | roles: `period`, `location`, optional `logo`, then bullets |
| `clubs.md` | clubs and volunteering: `role`, `period` |
| `projects.md` | projects: `tier` (featured or all), `tags` (AI, Data, CV, Research), `chips`, `stack`, `outcome`, `key number` or `highlight`, `period`, links, image, bullets |
| `skills.md` | skill groups and the SQL callout |
| `recognition.md` | publications, hackathons, certifications, education |
| `site.json` | navigation, section names, button and other interface labels |

Builder notes go in HTML comments (`<!-- ... -->`) and never reach the page.

**Optional fields:** a project's `demo`, `repo` and `video` links and its `image` / `imageAlt`, and a role's `logo`, may be left blank. A blank field renders nothing: no placeholder and no empty space.

**Build checks:** the build fails if visible text contains "TODO", a project uses an unknown tag, a featured project has no outcome, or an image file or its alt text is missing. Content lines the parser does not recognise are listed as a build warning.

Images go in `public/` (`public/projects/`, `public/logos/`) and are referenced from content as `/projects/name.webp`.

## Deploying

The site deploys to Vercel as a static export with no extra configuration. The page URLs used in share previews, `robots.txt` and `sitemap.xml` come from Vercel's `VERCEL_PROJECT_PRODUCTION_URL` at build time.
