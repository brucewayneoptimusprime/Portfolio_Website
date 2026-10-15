"use client";

import { AnimatePresence, LazyMotion, MotionConfig, domMax, m, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChipRow } from "@/components/ui/Chip";
import { LinkButton } from "@/components/ui/LinkButton";
import { Rich } from "@/components/ui/Rich";
import { TitleLink } from "@/components/ui/TitleLink";
import type { Project, Site, Tag } from "@/lib/content";

type Filter = "all" | Tag;
type Labels = { filter: Site["filter"]; links: Site["links"]; buttons: Site["buttons"] };

/** Reads ?tag= (any letter case) and returns a known tag, or "all". */
function filterFromUrl(tags: readonly string[]): Filter {
  const raw = new URLSearchParams(window.location.search).get("tag")?.toLowerCase();
  return (tags.find((t) => t.toLowerCase() === raw) as Tag | undefined) ?? "all";
}

function writeFilterToUrl(filter: Filter) {
  const url = new URL(window.location.href);
  if (filter === "all") url.searchParams.delete("tag");
  else url.searchParams.set("tag", filter);
  window.history.replaceState(window.history.state, "", url);
}

/** Card face: title, period, one-line summary, labels, links. Everything else (including any image) sits in <details>. */
function GridCard({ project, labels }: { project: Project; labels: Labels }) {
  const points = [...(project.highlights ?? []), ...(project.bullets ?? [])];
  const summary = project.outcome ?? points[0];
  const more = project.outcome ? points : points.slice(1);
  const links = (["demo", "repo", "video"] as const).filter((k) => project.links[k]);

  return (
    <article className="card flex h-full flex-col">
      <h3 className="font-sans text-lg leading-snug font-semibold"><TitleLink title={project.title} href={project.links.repo} label={labels.links.repoTitle} /></h3>
      {project.period && <p className="label mt-2">{project.period}</p>}
      {summary && (
        <p className="mt-4 text-text">
          <Rich text={summary} />
        </p>
      )}
      <div className="mt-5">
        <ChipRow tags={project.tags} chips={project.chips} />
      </div>
      {links.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-3">
          {links.map((k) => (
            <LinkButton key={k} href={project.links[k]!} context={project.title}>
              {labels.links[k]}
            </LinkButton>
          ))}
        </div>
      )}
      {(more.length > 0 || project.image) && (
        <details className="group mt-auto border-t border-border pt-1 [&:not(:first-child)]:mt-6">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
            <span className="label text-text group-hover:text-accent-soft">
              <span className="group-open:hidden">{labels.buttons.showDetails}</span>
              <span className="hidden group-open:inline">{labels.buttons.hideDetails}</span>
            </span>
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 text-muted transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6l5 5 5-5" />
            </svg>
          </summary>
          {project.image && (
            <Image
              src={project.image.src}
              alt={project.image.alt}
              width={project.image.width}
              height={project.image.height}
              unoptimized
              loading="lazy"
              className="mt-3 h-auto w-full rounded-card border border-border"
            />
          )}
          <ul className="list-disc space-y-2 pt-3 pb-1 pl-5 text-text marker:text-muted">
            {more.map((p) => (
              <li key={p}>
                <Rich text={p} />
              </li>
            ))}
          </ul>
        </details>
      )}
    </article>
  );
}

/** All projects with an ALL · AI · DATA · CV filter, mirrored in ?tag=. */
export function ProjectGrid({ projects, labels }: { projects: Project[]; labels: Labels }) {
  const tags = labels.filter.tags as Tag[];
  const [filter, setFilter] = useState<Filter>("all");
  const reduceMotion = useReducedMotion();

  // Static export: the URL is only readable in the browser, so apply ?tag= after mount.
  useEffect(() => {
    const fromUrl = filterFromUrl(tags);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL after hydration
    if (fromUrl !== "all") setFilter(fromUrl);
  }, [tags]);

  const choose = (f: Filter) => {
    setFilter(f);
    writeFilterToUrl(f);
  };

  const visible = filter === "all" ? projects : projects.filter((p) => p.tags.includes(filter));
  const options: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: labels.filter.all, count: projects.length },
    ...tags.map((t) => ({ value: t, label: t, count: projects.filter((p) => p.tags.includes(t)).length })),
  ];
  const status = (visible.length === 1 ? labels.filter.showingOne : labels.filter.showing).replace(
    "{count}",
    String(visible.length),
  );

  return (
    <div>
      <div className="sticky top-[var(--nav-h)] z-30 -mx-4 bg-bg/95 px-4 py-3 backdrop-blur-sm md:static md:mx-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
        <div
          role="group"
          aria-label={labels.filter.label}
          // One equal column per option (All + each tag), so adding a tag in site.json needs no change here.
          style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
          className="grid overflow-hidden rounded-card border border-border-strong md:inline-grid md:w-auto"
        >
          {options.map((o, i) => (
            <button
              key={o.value}
              type="button"
              aria-pressed={filter === o.value}
              onClick={() => choose(o.value)}
              // Phones: count under the label and slightly tighter type, so five segments fit at 375px.
              className={`label flex min-h-11 flex-col items-center justify-center px-1 py-1 text-[0.6875rem] leading-tight tracking-[0.06em] transition-colors hover:text-text aria-pressed:bg-surface-2 aria-pressed:text-accent-soft sm:flex-row sm:gap-2 sm:px-2 sm:text-label sm:tracking-[var(--tracking-label)] md:px-5 ${i > 0 ? "border-l border-border-strong" : ""}`}
            >
              {o.label}
              <span className="text-muted tabular-nums">{o.count}</span>
            </button>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="label mt-4">
        {status}
      </p>

      <LazyMotion features={domMax} strict>
        <MotionConfig transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: [0.2, 0, 0, 1] }}>
          <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((p) => (
                <m.li
                  key={p.title}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <GridCard project={p} labels={labels} />
                </m.li>
              ))}
            </AnimatePresence>
          </ul>
        </MotionConfig>
      </LazyMotion>
    </div>
  );
}
