import { toRoman } from "@/lib/roman";

type Props = { id: string; index: number; label: string; title: string };

/** Numeral + small-caps label, then the section heading in Cormorant (h2, 32→48px). */
export function SectionHeader({ id, index, label, title }: Props) {
  return (
    <header className="mb-10 md:mb-14">
      <p className="label flex items-center gap-3">
        <span aria-hidden="true" className="text-accent-soft">
          {toRoman(index)}
        </span>
        <span aria-hidden="true" className="h-px w-8 bg-border-strong" />
        <span>{label}</span>
      </p>
      <h2 id={`${id}-title`} className="mt-4 text-h2">
        {title}
      </h2>
    </header>
  );
}

/** A page section with its header. The id is the nav anchor. */
export function Section({
  id,
  index,
  label,
  title,
  children,
}: Props & { children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="py-[var(--section-pad)]">
      <div className="mx-auto max-w-content px-4 md:px-8">
        <SectionHeader id={id} index={index} label={label} title={title} />
        {children}
      </div>
    </section>
  );
}
