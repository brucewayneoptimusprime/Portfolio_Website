import { ChipRow } from "@/components/ui/Chip";
import { ImageZoom } from "@/components/ui/ImageZoom";
import { LinkButton } from "@/components/ui/LinkButton";
import { Rich } from "@/components/ui/Rich";
import { TitleLink } from "@/components/ui/TitleLink";
import type { Project, Site } from "@/lib/content";
import { toRoman } from "@/lib/roman";

type Labels = { project: Site["project"]; links: Site["links"]; buttons: Site["buttons"] };

/** "14 deterministic rules" → figure "14", caption "deterministic rules". */
function splitKeyNumber(text: string) {
  const m = /^([\d.,]+[%+]?)\s+(.+)$/.exec(text);
  return m ? { figure: m[1], caption: m[2] } : { figure: text, caption: undefined };
}

/** The card's anchor: the key number (number large, rest as caption) or the highlight line. */
function AnchorFigure({ project, lead, caption }: { project: Project; lead: boolean; caption: string }) {
  if (project.keyNumber) {
    const { figure, caption: rest } = splitKeyNumber(project.keyNumber);
    return (
      <div>
        <p className={`font-serif leading-none font-semibold text-text lining-nums ${lead ? "text-display" : "text-h2"}`}>
          {figure}
        </p>
        {rest && <p className="label mt-3">{rest}</p>}
      </div>
    );
  }
  if (project.highlight) {
    return (
      <div>
        <p className={`font-serif leading-tight font-semibold text-balance text-text lining-nums ${lead ? "text-h2" : "text-h3"}`}>
          {project.highlight}
        </p>
        <p className="label mt-3">{caption}</p>
      </div>
    );
  }
  return null;
}

function Pipeline({ steps, label }: { steps: string[]; label: string }) {
  return (
    <ol aria-label={label} className="flex flex-wrap items-center gap-y-2">
      {steps.map((step, i) => (
        <li key={step} className="flex items-center">
          <span className="label rounded-card border border-border px-2.5 py-1 text-text">{step}</span>
          {i < steps.length - 1 && (
            <svg viewBox="0 0 20 10" aria-hidden="true" className="mx-1.5 h-2.5 w-5 text-accent-soft" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M0 5h18M14 1l4 4-4 4" />
            </svg>
          )}
        </li>
      ))}
    </ol>
  );
}

function Details({ project, labels, open }: { project: Project; labels: Labels; open?: boolean }) {
  const points = [...(project.highlights ?? []), ...(project.bullets ?? [])];
  if (!project.howItWorks && !points.length && !project.stack) return null;
  const heading = "label text-accent-soft";

  return (
    <details open={open} className="group mt-6 border-t border-border">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 pt-2 [&::-webkit-details-marker]:hidden">
        <span className="label text-text group-hover:text-accent-soft">
          <span className="group-open:hidden">{labels.buttons.showDetails}</span>
          <span className="hidden group-open:inline">{labels.buttons.hideDetails}</span>
        </span>
        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 text-muted transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 6l5 5 5-5" />
        </svg>
      </summary>

      <div className="space-y-6 pt-4 pb-1">
        {project.howItWorks && (
          <div>
            <h4 className={heading}>{labels.project.howItWorks}</h4>
            <p className="mt-2 max-w-[68ch] text-text">
              <Rich text={project.howItWorks} />
            </p>
          </div>
        )}
        {points.length > 0 && (
          <div>
            <h4 className={heading}>{labels.project.highlights}</h4>
            <ul className="mt-2 max-w-[68ch] list-disc space-y-2 pl-5 text-text marker:text-muted">
              {points.map((p) => (
                <li key={p}>
                  <Rich text={p} />
                </li>
              ))}
            </ul>
          </div>
        )}
        {project.stack && (
          <div>
            <h4 className={heading}>{labels.project.stack}</h4>
            <p className="mt-2 font-mono text-label-lg text-muted">{project.stack.join(" · ")}</p>
          </div>
        )}
      </div>
    </details>
  );
}

type CardProps = { project: Project; index: number; lead: boolean; labels: Labels };

/** Standard cards share one frame ratio; all current images are 16:9, so they fill it exactly. */
const CARD_IMAGE_ASPECT = "16 / 9";

function ProjectCard({ project, index, lead, labels }: CardProps) {
  const links = (["demo", "repo", "video"] as const).filter((k) => project.links[k]);
  const anchor = <AnchorFigure project={project} lead={lead} caption={labels.project.highlightCaption} />;
  const hasAnchor = !!(project.keyNumber || project.highlight);
  const { image } = project;
  const figurePanel = !lead && !image && hasAnchor;

  const zoom = (aspect: string, frameClassName: string) =>
    image && (
      <ImageZoom
        image={image}
        aspect={aspect}
        frameClassName={frameClassName}
        enlargeLabel={labels.project.enlargeImage.replace("{title}", project.title)}
        closeLabel={labels.project.closeImage}
      />
    );

  const numeral = (
    <p aria-hidden="true" className="label text-accent-soft">
      {toRoman(index)}
    </p>
  );
  const outcome = project.outcome && (
    <p className="mt-5 max-w-[68ch] text-text">
      <Rich text={project.outcome} />
    </p>
  );
  const chips = (
    <div className="mt-5">
      <ChipRow tags={project.tags} chips={project.chips} />
    </div>
  );
  const pipeline = project.pipeline && (
    <div className="mt-6">
      <Pipeline steps={project.pipeline} label={labels.project.pipeline} />
    </div>
  );
  const linkRow = links.length > 0 && (
    <div className="mt-6 flex flex-wrap gap-3">
      {links.map((k) => (
        <LinkButton key={k} href={project.links[k]!} context={project.title}>
          {labels.links[k]}
        </LinkButton>
      ))}
    </div>
  );
  const details = (
    <div className="mt-auto">
      <Details project={project} labels={labels} />
    </div>
  );

  // Lead card with an image: image left (about 55%), text right on desktop; image first on mobile.
  if (lead && image) {
    return (
      <article className="card flex h-full flex-col">
        <div className="md:grid md:grid-cols-[11fr_9fr] md:items-center md:gap-10">
          {zoom(`${image.width} / ${image.height}`, "rounded-card border border-border")}
          <div className="mt-6 md:mt-0">
            {numeral}
            <h3 className="mt-4 text-h3 lg:text-[2.25rem]"><TitleLink title={project.title} href={project.links.repo} label={labels.links.repoTitle} /></h3>
            {hasAnchor && (
              <div className="mt-6">
                <AnchorFigure project={project} lead={false} caption={labels.project.highlightCaption} />
              </div>
            )}
            {outcome}
            {chips}
            {pipeline}
            {linkRow}
          </div>
        </div>
        {details}
      </article>
    );
  }

  return (
    <article className="card flex h-full flex-col">
      {/* Standard card image: edge to edge across the top of the card. */}
      {image && !lead && (
        <div className="-mx-[var(--card-pad)] -mt-[var(--card-pad)] mb-6">
          {zoom(CARD_IMAGE_ASPECT, "rounded-t-card border-b border-border")}
        </div>
      )}
      {/* No image: the key figure takes the image slot, so cards in a row stay aligned. */}
      {figurePanel && (
        <div
          style={{ aspectRatio: CARD_IMAGE_ASPECT }}
          className="-mx-[var(--card-pad)] -mt-[var(--card-pad)] mb-6 flex items-center rounded-t-card border-b border-border bg-surface-2 px-[var(--card-pad)]"
        >
          {anchor}
        </div>
      )}
      {numeral}

      <div className={lead && hasAnchor ? "mt-4 md:grid md:grid-cols-[1fr_auto] md:gap-12" : "mt-4"}>
        <div>
          {/* Lead title in Cormorant (h2 size); smaller cards use Inter so the anchor figure leads. */}
          <h3 className={lead ? "text-h2" : "font-sans text-xl leading-snug font-semibold"}><TitleLink title={project.title} href={project.links.repo} label={labels.links.repoTitle} /></h3>
          {hasAnchor && !figurePanel && <div className={`mt-6 ${lead ? "md:hidden" : ""}`}>{anchor}</div>}
          {outcome}
          {chips}
        </div>
        {lead && hasAnchor && (
          <div className="hidden md:mt-1 md:block md:min-w-48 md:border-l md:border-border md:pl-12">{anchor}</div>
        )}
      </div>

      {pipeline}
      {linkRow}
      {details}
    </article>
  );
}

/** One full-width lead card, then the rest as equal cards: two across on desktop, stacked on mobile. */
export function FeaturedProjects({
  projects,
  labels,
}: {
  projects: Project[];
  labels: Labels;
}) {
  const [lead, ...rest] = projects;
  if (!lead) return null;
  return (
    <div className="space-y-6">
      <ProjectCard project={lead} index={1} lead labels={labels} />
      {rest.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {rest.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i + 2} lead={false} labels={labels} />
          ))}
        </div>
      )}
    </div>
  );
}
