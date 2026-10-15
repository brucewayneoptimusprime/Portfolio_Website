/** An outlined link button, at least 44px tall. External links open in a new tab. */
export function LinkButton({
  href,
  children,
  context,
}: {
  href: string;
  children: React.ReactNode;
  /** Extra text for screen readers, e.g. the project title. */
  context?: string;
}) {
  const external = /^https?:/.test(href);
  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className="inline-flex min-h-11 items-center gap-2 rounded-card border border-border-strong px-4 py-2 text-sm font-medium text-text no-underline transition-colors hover:border-accent-soft hover:bg-surface-2"
    >
      {children}
      {context && <span className="sr-only">, {context}</span>}
      {external && (
        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 text-muted" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 3h7v7M13 3L4 12" />
        </svg>
      )}
    </a>
  );
}
