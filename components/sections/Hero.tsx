import { ArchFrame } from "@/components/ui/Arch";
import { Rich } from "@/components/ui/Rich";

type Props = {
  name: string;
  title: string;
  pitch: string;
  labels: { downloadResume: string };
  resumeHref?: string;
};

const button =
  "inline-flex min-h-11 items-center justify-center rounded-card px-6 py-3 font-medium no-underline transition-colors";

/** Concept A, "The Lancet Window": centred, the static glow inside a tall pointed arch. */
export function Hero({ name, title, pitch, labels, resumeHref }: Props) {
  return (
    <section
      id="top"
      // --arch-w drives the arch size; the text block overlaps the arch's lower half at every width.
      style={{ "--arch-w": "min(78vw, 26rem)" } as React.CSSProperties}
      className="relative flex min-h-[calc(100svh-var(--nav-h))] flex-col items-center justify-center overflow-hidden px-4 py-10 md:px-8"
    >
      <ArchFrame glow className="arch-fade pointer-events-none block w-[var(--arch-w)]" />

      <div className="relative mx-auto -mt-[calc(var(--arch-w)*0.75)] w-full max-w-3xl text-center">
        <h1 className="text-display leading-[1.02]">{name}</h1>
        <p className="label mt-5 text-label-lg text-accent-soft">{title}</p>
        <p className="mx-auto mt-6 max-w-[38rem] text-body text-text">
          <Rich text={pitch} />
        </p>
        {/* The only button; it doesn't render while public/resume.pdf is missing. */}
        {resumeHref && (
          <div className="mt-10 flex justify-center">
            <a href={resumeHref} download className={`${button} bg-accent-fill text-white hover:bg-accent-fill/85`}>
              {labels.downloadResume}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
