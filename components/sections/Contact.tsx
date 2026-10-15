import { ArchFrame } from "@/components/ui/Arch";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { CopyButton } from "@/components/ui/CopyButton";
import { Rich } from "@/components/ui/Rich";
import type { About, Site } from "@/lib/content";

type Labels = { buttons: Site["buttons"]; links: Site["links"]; contact: Site["contact"] };

const iconLink =
  "inline-flex min-h-11 items-center gap-2 rounded-card border border-border-strong px-4 py-2 text-sm font-medium text-text no-underline transition-colors hover:border-accent-soft hover:bg-surface-2";

/** The email with a break opportunity before the "@", so a long address wraps cleanly on phones. */
function EmailText({ email }: { email: string }) {
  const at = email.indexOf("@");
  if (at === -1) return <>{email}</>;
  return (
    <>
      {email.slice(0, at)}
      <wbr />
      {email.slice(at)}
    </>
  );
}

/**
 * A closing arch "doorway" mirroring the hero (outline only, no glow), framing the email, a copy
 * button and the profile links. "How I work" and languages sit below it.
 */
export function Contact({ about, labels }: { about: About; labels: Labels }) {
  const { email, linkedin, github } = about.links;

  return (
    <div>
      <div
        // --door-w sizes the arch; the content starts where the arch is already wide.
        style={{ "--door-w": "min(88vw, 34rem)" } as React.CSSProperties}
        className="relative mx-auto overflow-hidden pt-[calc(var(--door-w)*0.55)] pb-16"
      >
        {/* The fade sits on this box, not the SVG, so the arch has fully faded where the doorway is clipped. */}
        <div aria-hidden="true" className="arch-fade pointer-events-none absolute inset-0">
          <ArchFrame className="absolute top-0 left-1/2 block w-[var(--door-w)] -translate-x-1/2" />
        </div>

        <div className="relative mx-auto flex max-w-[calc(var(--door-w)*0.9)] flex-col items-center text-center">
          <p className="label">{labels.links.email}</p>
          <a
            id="contact-email"
            href={`mailto:${email}`}
            className="mt-4 inline-block py-2 text-lg leading-snug font-medium break-words text-accent-soft underline-offset-4 hover:underline sm:text-[1.375rem]"
          >
            <EmailText email={email} />
          </a>
          <div className="mt-5">
            <CopyButton
              text={email}
              selectId="contact-email"
              labels={{ copy: labels.buttons.copyEmail, copied: labels.buttons.copied, failed: labels.buttons.copyFailed }}
            />
          </div>
          {(linkedin || github) && (
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className={iconLink}>
                  <LinkedInIcon className="h-4 w-4 text-muted" />
                  {labels.links.linkedin}
                </a>
              )}
              {github && (
                <a href={github} target="_blank" rel="noopener noreferrer" className={iconLink}>
                  <GitHubIcon className="h-4 w-4 text-muted" />
                  {labels.links.github}
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {(about.howIWork || about.languages.length > 0) && (
        <div className="mx-auto mt-8 grid max-w-4xl gap-12 border-t border-border pt-12 md:grid-cols-[3fr_2fr] md:gap-16">
          {about.howIWork && (
            <div>
              <h3 className="label text-label-lg font-normal text-accent-soft">{labels.contact.howIWork}</h3>
              <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-text">
                <Rich text={about.howIWork} />
              </p>
            </div>
          )}
          {about.languages.length > 0 && (
            <div>
              <h3 className="label text-label-lg font-normal text-accent-soft">{labels.contact.languages}</h3>
              <ul className="mt-4 space-y-3">
                {about.languages.map((l) => (
                  <li key={l.name} className="flex flex-wrap items-baseline gap-x-3">
                    <span className="text-text">{l.name}</span>
                    {l.level && <span className="font-mono text-sm text-muted">{l.level}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
