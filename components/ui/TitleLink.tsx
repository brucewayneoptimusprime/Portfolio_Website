/**
 * A project title that links to its repo when there is one (new tab), or plain text when there isn't.
 * It keeps the surrounding heading's typography: no underline at rest; underline and accent on hover.
 */
export function TitleLink({ title, href, label }: { title: string; href?: string; label: string }) {
  if (!href) return <>{title}</>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label.replace("{title}", title)}
      className="text-inherit no-underline decoration-1 underline-offset-4 transition-colors hover:text-accent-soft hover:underline"
    >
      {title}
    </a>
  );
}
