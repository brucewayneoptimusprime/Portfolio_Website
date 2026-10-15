import { LogoViewer } from "@/components/ui/LogoViewer";
import { Rich } from "@/components/ui/Rich";
import type { Club, Role } from "@/lib/content";

/** A small pointed arch sitting on the spine. The newest role's marker is filled. */
function ArchMarker({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 16 20"
      aria-hidden="true"
      className="absolute top-1 -left-[8.5px] h-5 w-4 md:top-2"
    >
      <path
        d="M1 19.5 V13 A14 14 0 0 1 8 0.88 A14 14 0 0 1 15 13 V19.5 Z"
        fill={filled ? "var(--accent)" : "var(--bg)"}
        stroke="var(--accent)"
        strokeWidth="1"
      />
    </svg>
  );
}

/** A compact list below the timeline: one row per club (name, role, dates), no markers or bullets. */
function Clubs({ clubs, heading }: { clubs: Club[]; heading: string }) {
  return (
    <div className="mt-16 md:mt-20 md:ml-56 md:pl-12">
      <h3 className="label text-label-lg font-normal text-accent-soft">{heading}</h3>
      <ul className="mt-5 border-t border-border">
        {clubs.map((c) => (
          <li
            key={c.name}
            className="border-b border-border py-3 md:flex md:items-baseline md:justify-between md:gap-6"
          >
            <p className="text-text">
              <span className="font-medium">{c.name}</span>
              {c.role && <span className="text-muted">{`, ${c.role}`}</span>}
            </p>
            {c.period && <p className="label mt-1 shrink-0 whitespace-nowrap md:mt-0">{c.period}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Vertical timeline, in content order (newest first). Dates sit in the left gutter on desktop. Clubs follow it. */
export function Experience({
  roles,
  clubs,
  clubsHeading,
  logoLabels,
}: {
  roles: Role[];
  clubs: Club[];
  clubsHeading: string;
  logoLabels: { view: string; close: string };
}) {
  return (
    <>
      <ol className="relative">
        {roles.map((r, i) => {
          const [impact, ...rest] = r.bullets;
          return (
            <li key={`${r.company}-${r.period}`} className="md:grid md:grid-cols-[14rem_1fr]">
              <p className="label hidden pt-3 pr-8 text-right whitespace-nowrap md:block">{r.period}</p>

              <div className={`relative border-l border-border-strong pl-8 md:pl-12 ${i < roles.length - 1 ? "pb-14" : "pb-2"}`}>
                <ArchMarker filled={i === 0} />
                <p className="label md:hidden">{r.period}</p>
                <div className="mt-2 flex items-center gap-4 md:mt-0">
                  {r.logo && <LogoViewer src={r.logo} company={r.company} labels={logoLabels} />}
                  <div>
                    <h3 className="text-h3">{r.company}</h3>
                    {r.role && <p className="mt-2 font-medium text-text">{r.role}</p>}
                  </div>
                </div>
                {r.location && <p className="label mt-2">{r.location}</p>}

                {impact && (
                  <p className="mt-5 max-w-[68ch] font-slab text-lg leading-relaxed font-normal text-text [&_strong]:font-normal">
                    <Rich text={impact} />
                  </p>
                )}
                {rest.length > 0 && (
                  <ul className="mt-4 max-w-[68ch] list-disc space-y-2 pl-5 font-slab text-text marker:text-muted [&_strong]:font-normal">
                    {rest.map((b) => (
                      <li key={b}>
                        <Rich text={b} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {clubs.length > 0 && <Clubs clubs={clubs} heading={clubsHeading} />}
    </>
  );
}
