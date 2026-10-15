import { ArchDivider } from "@/components/ui/Arch";
import { Rich } from "@/components/ui/Rich";

/** The short bio from about.md, directly under the hero, then the optional stats as small mono items. */
export function BioStrip({ bio, stats }: { bio: string; stats: string[] }) {
  return (
    <div className="mx-auto max-w-content px-4 md:px-8">
      <ArchDivider />
      <p className="mx-auto mt-10 max-w-[68ch] text-center text-body text-text">
        <Rich text={bio} />
      </p>
      {stats.length > 0 && (
        <ul className="mx-auto mt-8 flex flex-wrap justify-center gap-2">
          {stats.map((s) => (
            <li key={s} className="label rounded-card border border-border px-3 py-1.5 whitespace-nowrap text-text">
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
