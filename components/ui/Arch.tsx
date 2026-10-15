// Pointed (equilateral) arch shapes. Decorative only: aria-hidden, drawn with the border tokens.

/** A hairline across the page with a small pointed arch at its centre. */
export function ArchDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-end gap-3 ${className}`}>
      <span className="h-px flex-1 bg-border-strong" />
      <svg width="16" height="20" viewBox="0 0 16 20" className="block shrink-0">
        <path
          d="M1 20 V13 A14 14 0 0 1 8 0.88 A14 14 0 0 1 15 13 V20"
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth="1"
        />
      </svg>
      <span className="h-px flex-1 bg-border-strong" />
    </div>
  );
}

/**
 * A tall lancet-window outline (outer and inner hairline). With `glow`, the static hero glow
 * fills the window: this is gradient use 1 of 2 from PLAN.md. It scales with its width.
 */
export function ArchFrame({ className = "", glow = false }: { className?: string; glow?: boolean }) {
  const outer = "M1 300 V176 A198 198 0 0 1 100 4.53 A198 198 0 0 1 199 176 V300";
  const inner = "M13 300 V176 A174 174 0 0 1 100 25.31 A174 174 0 0 1 187 176 V300";

  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 200 300" className={className}>
      {glow && (
        <>
          <defs>
            <radialGradient id="arch-glow" cx="50%" cy="38%" r="62%">
              <stop offset="0%" style={{ stopColor: "var(--glow)" }} />
              <stop offset="100%" style={{ stopColor: "var(--glow)", stopOpacity: 0 }} />
            </radialGradient>
          </defs>
          <path d={`${outer} Z`} fill="url(#arch-glow)" className="arch-glow" />
        </>
      )}
      <path d={outer} fill="none" stroke="var(--border-strong)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path d={inner} fill="none" stroke="var(--border)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
