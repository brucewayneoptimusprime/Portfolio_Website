/*
  Content layer: reads content/*.md and content/site.json at build time.

  Markdown format (see the files in content/):
  - HTML comments are stripped first, so builder notes and TODOs never reach the page.
  - "## Heading" / "### Heading" start a section or entry, "key: value" lines are fields,
    "- text" lines are bullets. A "Highlights:" line with no value starts a bullet block.
  - Blank or missing optional fields become undefined, never "".
  - Lines that can't be mapped to a known field or bullet are listed as a build warning.
  - Problems that would put wrong text on the site fail the build with a clear message.
*/

import fs from "node:fs";
import path from "node:path";
import siteJson from "@/content/site.json";
import { imageSize } from "@/lib/imageSize";

export const TAGS = ["AI", "Data", "CV", "Research"] as const;
export type Tag = (typeof TAGS)[number];

export type About = {
  name: string;
  title: string;
  location?: string;
  pitch: string;
  bio: string;
  howIWork?: string;
  stats: string[];
  links: { linkedin?: string; github?: string; email: string; resume?: string };
  languages: { name: string; level?: string }[];
};

export type Project = {
  title: string;
  tier: "featured" | "all";
  tags: Tag[];
  chips?: string[];
  stack?: string[];
  outcome?: string;
  keyNumber?: string;
  highlight?: string;
  howItWorks?: string;
  pipeline?: string[];
  highlights?: string[];
  bullets?: string[];
  period?: string;
  links: { demo?: string; repo?: string; video?: string };
  /** Optional image in public/, with its alt text and pixel size (read from the file at build time). */
  image?: { src: string; alt: string; width: number; height: number };
};

export type Role = {
  company: string;
  role?: string;
  period: string;
  location?: string;
  /** Optional path to a logo in public/ (e.g. /logos/fumind.jpg). */
  logo?: string;
  bullets: string[];
};

export type Club = { name: string; role?: string; period?: string };

export type Skills = {
  groups: { title: string; items: string[] }[];
  callout?: { title: string; text: string };
};

export type RecognitionItem = {
  label?: string;
  text: string;
  /** Extra lines written under the bullet (without their own "- "), shown as separate lines of the same point. */
  more?: string[];
  issuer?: string;
  date?: string;
};
export type RecognitionGroup = { title: string; items: RecognitionItem[] };
export type Recognition = {
  publications?: RecognitionGroup;
  hackathons?: RecognitionGroup;
  certifications?: RecognitionGroup;
  education?: RecognitionGroup;
};

export type Site = typeof siteJson;
export type UnmappedLine = { file: string; where: string; line: string };

// ---------- Low-level parsing ----------

type Line =
  | { kind: "field"; key: string; value: string; raw: string }
  | { kind: "bullet"; text: string; raw: string }
  | { kind: "text"; raw: string };

type Section = { title: string; lines: Line[] };

const FIELD = /^([A-Za-z][A-Za-z ]{0,30}):\s*(.*)$/;

function readContent(file: string): string {
  const md = fs.readFileSync(path.join(process.cwd(), "content", file), "utf8");
  return md.replace(/<!--[\s\S]*?-->/g, "");
}

function toLine(raw: string): Line {
  if (raw.startsWith("- ")) return { kind: "bullet", text: raw.slice(2).trim(), raw };
  const m = FIELD.exec(raw);
  if (m) return { kind: "field", key: m[1].trim().toLowerCase(), value: m[2].trim(), raw };
  return { kind: "text", raw };
}

/** Splits a file into the lines before the first heading of `level`, and one section per heading of that level. The "# Title" line is dropped. */
function parseSections(md: string, level: 2 | 3): { intro: Line[]; sections: Section[] } {
  const marker = "#".repeat(level) + " ";
  const intro: Line[] = [];
  const sections: Section[] = [];
  for (const rawLine of md.split(/\r?\n/)) {
    const raw = rawLine.trim();
    if (!raw || raw.startsWith("# ")) continue;
    if (raw.startsWith(marker)) {
      sections.push({ title: raw.slice(marker.length).trim(), lines: [] });
      continue;
    }
    (sections.at(-1)?.lines ?? intro).push(toLine(raw));
  }
  return { intro, sections };
}

const opt = (v?: string) => (v && v.trim() ? v.trim() : undefined);

/** Splits "a, b (c, d), e" on commas outside parentheses. */
function splitList(v?: string): string[] | undefined {
  if (!opt(v)) return undefined;
  const items: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of v!) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      items.push(current);
      current = "";
    } else current += ch;
  }
  items.push(current);
  const clean = items.map((s) => s.trim()).filter(Boolean);
  return clean.length ? clean : undefined;
}

/** "Name, Issuer, Mon YYYY" → { text: name, issuer, date }; anything else → { text }. */
function certification(text: string): RecognitionItem {
  const m = /^(.+), ([^,]+), ([A-Z][a-z]{2} \d{4})$/.exec(text);
  return m ? { text: m[1].trim(), issuer: m[2].trim(), date: m[3] } : { text };
}

/** "**Label:** text" → { label, text }; anything else → { text }. */
function labelled(text: string): RecognitionItem {
  const m = /^\*\*(.+?):\*\*\s*(.*)$/.exec(text);
  return m ? { label: m[1].trim(), text: m[2].trim() } : { text };
}

class Ctx {
  errors: string[] = [];
  unmapped: UnmappedLine[] = [];
  error(file: string, where: string, message: string) {
    this.errors.push(`${file} › ${where}: ${message}`);
  }
  skip(file: string, where: string, line: Line) {
    this.unmapped.push({ file, where, line: line.raw });
  }
}

// ---------- Per-file parsers ----------

function parseAbout(ctx: Ctx): About {
  const file = "about.md";
  const { intro, sections } = parseSections(readContent(file), 2);

  const fields: Record<string, string> = {};
  for (const l of intro) {
    if (l.kind === "field" && ["name", "title", "location"].includes(l.key)) fields[l.key] = l.value;
    else ctx.skip(file, "(top of file)", l);
  }

  const text: Record<string, string> = {};
  const links: Record<string, string> = {};
  const languages: About["languages"] = [];
  const stats: string[] = [];
  const LINK_KEYS: Record<string, string> = {
    linkedin: "linkedin",
    github: "github",
    "public contact email": "email",
    resume: "resume",
  };

  for (const s of sections) {
    const heading = s.title.toLowerCase();
    if (heading === "links") {
      for (const l of s.lines) {
        const m = l.kind === "bullet" ? /^([^:]+):\s*(.*)$/.exec(l.text) : null;
        const key = m ? LINK_KEYS[m[1].trim().toLowerCase()] : undefined;
        if (m && key) links[key] = m[2].trim();
        else ctx.skip(file, s.title, l);
      }
    } else if (heading === "languages") {
      for (const l of s.lines) {
        if (l.kind !== "bullet") {
          ctx.skip(file, s.title, l);
          continue;
        }
        const m = /^(.+?)\s*\((.+)\)$/.exec(l.text);
        languages.push(m ? { name: m[1].trim(), level: m[2].trim() } : { name: l.text });
      }
    } else if (heading === "stats") {
      for (const l of s.lines) {
        if (l.kind === "bullet") stats.push(l.text);
        else ctx.skip(file, s.title, l);
      }
    } else if (["one-line pitch", "short bio", "how i work"].includes(heading)) {
      const paragraph: string[] = [];
      for (const l of s.lines) {
        if (l.kind === "bullet") ctx.skip(file, s.title, l);
        else paragraph.push(l.raw);
      }
      text[heading] = paragraph.join(" ");
    } else {
      s.lines.forEach((l) => ctx.skip(file, `## ${s.title} (unknown section)`, l));
    }
  }

  const about: About = {
    name: fields.name ?? "",
    title: fields.title ?? "",
    location: opt(fields.location),
    pitch: text["one-line pitch"] ?? "",
    bio: text["short bio"] ?? "",
    howIWork: opt(text["how i work"]),
    stats,
    links: {
      linkedin: opt(links.linkedin),
      github: opt(links.github),
      email: links.email ?? "",
      resume: opt(links.resume),
    },
    languages,
  };

  if (!opt(about.name)) ctx.error(file, "name", "required field is missing");
  if (!opt(about.title)) ctx.error(file, "title", "required field is missing");
  if (!opt(about.pitch)) ctx.error(file, "## One-line pitch", "required section is missing or empty");
  if (!opt(about.bio)) ctx.error(file, "## Short bio", "required section is missing or empty");
  if (!opt(about.links.email)) ctx.error(file, "## Links", "Public contact email is missing");
  return about;
}

const PROJECT_FIELDS = [
  "tier", "tags", "chips", "stack", "outcome", "key number", "highlight",
  "how it works", "pipeline", "period", "demo", "repo", "video", "image", "imagealt",
];

function parseProjects(ctx: Ctx): Project[] {
  const file = "projects.md";
  const { intro, sections } = parseSections(readContent(file), 3);
  intro.forEach((l) => ctx.skip(file, "(top of file)", l));

  return sections.map((s) => {
    const f: Record<string, string> = {};
    const bullets: string[] = [];
    const highlights: string[] = [];
    let inHighlights = false;

    for (const l of s.lines) {
      if (l.kind === "field" && l.key === "highlights" && !l.value) {
        inHighlights = true;
      } else if (l.kind === "bullet") {
        (inHighlights ? highlights : bullets).push(l.text);
      } else if (l.kind === "field" && PROJECT_FIELDS.includes(l.key)) {
        f[l.key] = l.value;
        inHighlights = false;
      } else {
        ctx.skip(file, s.title, l);
      }
    }

    const tags = splitList(f.tags) ?? [];
    for (const t of tags) {
      if (!TAGS.includes(t as Tag)) {
        ctx.error(file, s.title, `tag "${t}" is not one of ${TAGS.join(", ")} (use "chips:" for other labels)`);
      }
    }
    if (!tags.length) ctx.error(file, s.title, "required field \"tags\" is missing");

    const tier = f.tier;
    if (tier !== "featured" && tier !== "all") {
      ctx.error(file, s.title, `tier must be "featured" or "all" (got "${tier ?? ""}")`);
    }
    if (tier === "featured" && !opt(f.outcome)) {
      ctx.error(file, s.title, "featured projects need an \"outcome\"");
    }

    let image: Project["image"];
    const src = opt(f.image);
    if (src) {
      const onDisk = path.join(process.cwd(), "public", src);
      const size = fs.existsSync(onDisk) ? imageSize(onDisk) : undefined;
      if (!size) ctx.error(file, s.title, `image "${src}" not found or unreadable (expected public${src})`);
      else if (!opt(f.imagealt)) ctx.error(file, s.title, `image "${src}" needs an "imageAlt:" description`);
      else image = { src, alt: opt(f.imagealt)!, ...size };
    }

    return {
      title: s.title,
      tier: tier === "featured" ? "featured" : "all",
      tags: tags as Tag[],
      chips: splitList(f.chips),
      stack: splitList(f.stack),
      outcome: opt(f.outcome),
      keyNumber: opt(f["key number"]),
      highlight: opt(f.highlight),
      howItWorks: opt(f["how it works"]),
      pipeline: splitList(f.pipeline),
      highlights: highlights.length ? highlights : undefined,
      bullets: bullets.length ? bullets : undefined,
      period: opt(f.period),
      links: { demo: opt(f.demo), repo: opt(f.repo), video: opt(f.video) },
      image,
    };
  });
}

function parseExperience(ctx: Ctx): Role[] {
  const file = "experience.md";
  const { intro, sections } = parseSections(readContent(file), 2);
  intro.forEach((l) => ctx.skip(file, "(top of file)", l));

  return sections.map((s) => {
    const f: Record<string, string> = {};
    const bullets: string[] = [];
    for (const l of s.lines) {
      if (l.kind === "bullet") bullets.push(l.text);
      else if (l.kind === "field" && ["period", "location", "logo"].includes(l.key)) f[l.key] = l.value;
      else ctx.skip(file, s.title, l);
    }
    const split = s.title.indexOf(": ");
    const company = split === -1 ? s.title : s.title.slice(0, split).trim();
    const role = split === -1 ? undefined : opt(s.title.slice(split + 2));
    if (!opt(f.period)) ctx.error(file, s.title, "required field \"period\" is missing");
    const logo = opt(f.logo);
    if (logo && !fs.existsSync(path.join(process.cwd(), "public", logo))) {
      ctx.error(file, s.title, `logo "${logo}" not found in public/ (expected public${logo})`);
    }
    return { company, role, period: f.period ?? "", location: opt(f.location), logo, bullets };
  });
}

function parseClubs(ctx: Ctx): Club[] {
  const file = "clubs.md";
  const { intro, sections } = parseSections(readContent(file), 3);
  intro.forEach((l) => ctx.skip(file, "(top of file)", l));

  return sections.map((s) => {
    const f: Record<string, string> = {};
    for (const l of s.lines) {
      if (l.kind === "field" && ["role", "period"].includes(l.key)) f[l.key] = l.value;
      else ctx.skip(file, s.title, l);
    }
    return { name: s.title, role: opt(f.role), period: opt(f.period) };
  });
}

function parseSkills(ctx: Ctx): Skills {
  const file = "skills.md";
  const { intro, sections } = parseSections(readContent(file), 2);
  intro.forEach((l) => ctx.skip(file, "(top of file)", l));

  const skills: Skills = { groups: [] };
  for (const s of sections) {
    let style: string | undefined;
    const body: string[] = [];
    for (const l of s.lines) {
      if (l.kind === "field" && l.key === "style") style = l.value;
      else if (l.kind === "text") body.push(l.raw);
      else ctx.skip(file, s.title, l);
    }
    const text = body.join(" ");
    if (style === "callout") skills.callout = { title: s.title, text };
    else skills.groups.push({ title: s.title, items: splitList(text) ?? [] });
  }
  return skills;
}

const RECOGNITION_GROUPS: Record<string, keyof Recognition> = {
  publications: "publications",
  hackathons: "hackathons",
  certifications: "certifications",
  education: "education",
};

function parseRecognition(ctx: Ctx): Recognition {
  const file = "recognition.md";
  const { intro, sections } = parseSections(readContent(file), 2);
  intro.forEach((l) => ctx.skip(file, "(top of file)", l));

  const recognition: Recognition = {};
  for (const s of sections) {
    const key = Object.entries(RECOGNITION_GROUPS).find(([prefix]) =>
      s.title.toLowerCase().startsWith(prefix),
    )?.[1];
    if (!key) {
      s.lines.forEach((l) => ctx.skip(file, `## ${s.title} (unknown section)`, l));
      continue;
    }
    const items: RecognitionItem[] = [];
    for (const l of s.lines) {
      const last = items.at(-1);
      if (l.kind === "bullet") items.push(key === "certifications" ? certification(l.text) : labelled(l.text));
      else if (last) (last.more ??= []).push(l.raw);
      else ctx.skip(file, s.title, l);
    }
    recognition[key] = { title: s.title, items };
  }
  return recognition;
}

// ---------- Checks ----------

/** Walks every string that could be rendered and reports any "TODO". */
function findTodos(ctx: Ctx, file: string, value: unknown, where: string) {
  if (typeof value === "string") {
    if (/\bTODO\b/i.test(value)) ctx.error(file, where, `contains "TODO": "${value}"`);
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => {
      const name = v && typeof v === "object" && "title" in v ? `"${v.title}"` : `[${i}]`;
      findTodos(ctx, file, v, where ? `${where} › ${name}` : name);
    });
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) findTodos(ctx, file, v, where ? `${where} › ${k}` : k);
  }
}

// ---------- Loading ----------

type Loaded = {
  about: About;
  projects: Project[];
  experience: Role[];
  clubs: Club[];
  skills: Skills;
  recognition: Recognition;
  site: Site;
  unmapped: UnmappedLine[];
};

let cache: Loaded | undefined;
let warnedUnmapped = false;

function load(): Loaded {
  if (cache) return cache;
  const ctx = new Ctx();
  const data: Loaded = {
    about: parseAbout(ctx),
    projects: parseProjects(ctx),
    experience: parseExperience(ctx),
    clubs: parseClubs(ctx),
    skills: parseSkills(ctx),
    recognition: parseRecognition(ctx),
    site: siteJson,
    unmapped: ctx.unmapped,
  };

  findTodos(ctx, "about.md", data.about, "");
  findTodos(ctx, "projects.md", data.projects, "");
  findTodos(ctx, "experience.md", data.experience, "");
  findTodos(ctx, "clubs.md", data.clubs, "");
  findTodos(ctx, "skills.md", data.skills, "");
  findTodos(ctx, "recognition.md", data.recognition, "");
  findTodos(ctx, "site.json", data.site, "");

  if (ctx.errors.length) {
    throw new Error(
      `Content check failed with ${ctx.errors.length} problem(s). Fix these in content/:\n` +
        ctx.errors.map((e) => `  • ${e}`).join("\n"),
    );
  }

  // Content lines the parser ignored (typos in a field name, stray text) never reach the page; flag them.
  if (ctx.unmapped.length && !warnedUnmapped) {
    warnedUnmapped = true;
    console.warn(
      `[content] ${ctx.unmapped.length} line(s) in content/ were not recognised and are not shown on the site:\n` +
        ctx.unmapped.map((u) => `  • ${u.file} › ${u.where}: ${u.line}`).join("\n"),
    );
  }

  // Re-read on every request in dev so content edits show up without a restart.
  if (process.env.NODE_ENV === "production") cache = data;
  return data;
}

export const getAbout = () => load().about;
export const getExperience = () => load().experience;
export const getClubs = () => load().clubs;
export const getSkills = () => load().skills;
export const getRecognition = () => load().recognition;
export const getSite = () => load().site;

/** The resume link from about.md, or undefined when it points to a file missing from public/ (the button then doesn't render). */
export function getResumeHref(): string | undefined {
  const href = getAbout().links.resume;
  if (!href?.startsWith("/")) return href;
  if (fs.existsSync(path.join(process.cwd(), "public", href))) return href;
  console.warn(`[content] public${href} not found, so the resume button is hidden.`);
  return undefined;
}

/** All projects in file order (for the grid), plus the featured subset. */
export function getProjects() {
  const all = load().projects;
  return { all, featured: all.filter((p) => p.tier === "featured") };
}
