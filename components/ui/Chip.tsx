/** A small mono label. "tag" = a filter tag (AI, Data, CV); "chip" = a secondary label. */
export function Chip({ children, kind = "chip" }: { children: React.ReactNode; kind?: "tag" | "chip" }) {
  const style =
    kind === "tag" ? "border-border-strong text-accent-soft" : "border-border text-muted";
  return (
    <span className={`label inline-flex items-center rounded-card border px-2.5 py-1 ${style}`}>
      {children}
    </span>
  );
}

/** Tags first, then chips, capped at `max` labels in total. */
export function ChipRow({ tags, chips = [], max = 4 }: { tags: string[]; chips?: string[]; max?: number }) {
  const labels = [
    ...tags.map((t) => ({ text: t, kind: "tag" as const })),
    ...chips.map((c) => ({ text: c, kind: "chip" as const })),
  ].slice(0, max);
  return (
    <ul className="flex flex-wrap gap-2">
      {labels.map((l) => (
        <li key={l.text}>
          <Chip kind={l.kind}>{l.text}</Chip>
        </li>
      ))}
    </ul>
  );
}
