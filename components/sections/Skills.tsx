import { Fragment } from "react";
import { ArchDivider } from "@/components/ui/Arch";
import { Rich } from "@/components/ui/Rich";
import type { Skills as SkillsData } from "@/lib/content";

/** Items up to this length never break inside ("scikit-learn", "AWS (S3, EC2)"); longer phrases wrap between words. */
const NO_BREAK_MAX = 24;

/** Items as plain text separated by mid-dots. An item ending in "(depthNote)" shows that as a small mono note. */
function ItemList({ items, depthNote, lead }: { items: string[]; depthNote: string; lead: boolean }) {
  const suffix = `(${depthNote})`;
  return (
    <ul className={`mt-4 text-text ${lead ? "text-lg leading-relaxed" : ""}`}>
      {items.map((item, i) => {
        const deep = item.endsWith(suffix);
        const name = deep ? item.slice(0, -suffix.length).trim() : item;
        return (
          // The space between items stays outside the <li>, so lines can always break between items.
          <Fragment key={item}>
            <li className={`inline ${name.length <= NO_BREAK_MAX ? "whitespace-nowrap" : ""}`}>
              {name}
              {deep && (
                <span className="ml-2 inline-block rounded-card border border-border-strong px-1.5 align-middle font-mono text-label leading-5 text-accent-soft">
                  {depthNote}
                </span>
              )}
              {i < items.length - 1 && <span aria-hidden="true" className="text-muted">{" ·"}</span>}
            </li>{" "}
          </Fragment>
        );
      })}
    </ul>
  );
}

/**
 * The first group (AI and LLM engineering) leads: it spans two columns on desktop with a larger title.
 * The other groups are equal panels; the SQL note is a callout with a pointed-arch top.
 */
export function Skills({ skills, depthNote }: { skills: SkillsData; depthNote: string }) {
  const [lead, ...rest] = skills.groups;
  const panel = "rounded-card border bg-surface p-[var(--card-pad)]";

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {lead && (
        <div className={`${panel} border-border-strong md:col-span-2`}>
          <h3 className="text-h3">{lead.title}</h3>
          <ItemList items={lead.items} depthNote={depthNote} lead />
        </div>
      )}

      {rest.map((g) => (
        <div key={g.title} className={`${panel} border-border`}>
          <h3 className="font-sans text-lg leading-snug font-semibold">{g.title}</h3>
          <ItemList items={g.items} depthNote={depthNote} lead={false} />
        </div>
      ))}

      {skills.callout && (
        // The arch divider sits on the box's top edge, so its hairline is the top border.
        <aside className="relative mt-5 self-start rounded-b-card border-x border-b border-border-strong px-[var(--card-pad)] pt-8 pb-[var(--card-pad)]">
          <ArchDivider className="absolute inset-x-0 -top-[19.5px]" />
          <p className="label text-accent-soft">{skills.callout.title}</p>
          <p className="mt-3 text-text">
            <Rich text={skills.callout.text} />
          </p>
        </aside>
      )}
    </div>
  );
}
