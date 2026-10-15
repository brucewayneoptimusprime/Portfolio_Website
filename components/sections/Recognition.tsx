import { Rich } from "@/components/ui/Rich";
import type { Recognition as RecognitionData, RecognitionGroup, RecognitionItem } from "@/lib/content";

/** 'Title. Venue…' or '"Title." Venue…' → the title (without quotes or full stop) and the venue line. */
function splitTitle(text: string) {
  const end = /\."?\s+(?=[A-Z])/.exec(text);
  if (!end) return { title: text, venue: undefined };
  return { title: text.slice(0, end.index).replace(/^"/, ""), venue: text.slice(end.index + end[0].length) };
}

function GroupTitle({ children }: { children: string }) {
  return <h3 className="label text-label-lg font-normal text-accent-soft">{children}</h3>;
}

/** Manuscript entries: label in mono, title in Inter italic, venue in mono. */
function Publications({ group }: { group: RecognitionGroup }) {
  return (
    <div>
      <GroupTitle>{group.title}</GroupTitle>
      <ul className="mt-6 divide-y divide-border border-y border-border">
        {group.items.map((item) => {
          const { title, venue } = splitTitle(item.text);
          return (
            <li key={item.text} className="py-6 md:grid md:grid-cols-[14rem_1fr] md:gap-8">
              {item.label && <p className="label">{item.label}</p>}
              <div className="mt-3 md:mt-0">
                <p className="max-w-[60ch] text-lg leading-snug text-text italic">
                  <Rich text={title} />
                </p>
                {venue && <p className="mt-3 max-w-[68ch] font-mono text-sm leading-relaxed text-muted">{venue}</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** A ledger: each placing large in Cormorant (exactly as written in the content), the event beside it. */
function Ledger({ group }: { group: RecognitionGroup }) {
  return (
    <div>
      <GroupTitle>{group.title}</GroupTitle>
      <ol className="mt-6 border-t border-border">
        {group.items.map((item) => (
          <li
            key={item.text}
            className="border-b border-border py-5 md:grid md:grid-cols-[20rem_1fr] md:items-baseline md:gap-8"
          >
            {item.label && (
              <p className="font-serif text-h3 leading-tight font-semibold text-text lining-nums md:text-[2rem]">
                {item.label}
              </p>
            )}
            <p className="mt-2 max-w-[60ch] text-text md:mt-0">
              <Rich text={item.text} />
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Compact list; certifications carry the issuer and date as a mono line. `more` is an optional link below. */
function CompactList({ group, more }: { group: RecognitionGroup; more?: { href: string; label: string } }) {
  return (
    <div>
      <GroupTitle>{group.title}</GroupTitle>
      <ul className="mt-5 space-y-3">
        {group.items.map((item: RecognitionItem) => (
          <li key={item.text} className="border-l border-border-strong pl-4 text-text">
            {item.label && <span className="font-medium">{item.label}: </span>}
            <Rich text={item.text} />
            {item.more?.map((line) => (
              <span key={line} className="block">
                <Rich text={line} />
              </span>
            ))}
            {(item.issuer || item.date) && (
              <span className="mt-0.5 block font-mono text-sm text-muted">
                {[item.issuer, item.date].filter(Boolean).join(" · ")}
              </span>
            )}
          </li>
        ))}
      </ul>
      {more && (
        <a
          href={more.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
        >
          {more.label}
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 3h7v7M13 3L4 12" />
          </svg>
        </a>
      )}
    </div>
  );
}

export function Recognition({
  recognition,
  allCertifications,
}: {
  recognition: RecognitionData;
  /** "All certifications" link (LinkedIn); omitted when there's no LinkedIn URL. */
  allCertifications?: { href: string; label: string };
}) {
  const { publications, hackathons, certifications, education } = recognition;
  return (
    <div className="space-y-16 md:space-y-20">
      {publications && <Publications group={publications} />}
      {hackathons && <Ledger group={hackathons} />}
      {(certifications || education) && (
        <div className="grid gap-12 md:grid-cols-2 md:gap-10">
          {certifications && <CompactList group={certifications} more={allCertifications} />}
          {education && <CompactList group={education} />}
        </div>
      )}
    </div>
  );
}
