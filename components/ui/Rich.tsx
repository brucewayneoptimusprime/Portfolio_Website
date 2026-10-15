import type { ReactNode } from "react";

// **bold** or [text](href). Everything else renders as plain, escaped text.
const TOKEN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
const SAFE_HREF = /^(https?:|mailto:|\/|#)/;

/** Renders content text with **bold** and [links](url) as React elements. Never injects HTML. */
export function Rich({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;

  for (const m of text.matchAll(TOKEN)) {
    const i = m.index;
    if (i > last) out.push(text.slice(last, i));

    if (m[1] !== undefined) {
      out.push(<strong key={i}>{m[1]}</strong>);
    } else if (SAFE_HREF.test(m[3])) {
      const external = /^https?:/.test(m[3]);
      out.push(
        <a key={i} href={m[3]} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
          {m[2]}
        </a>,
      );
    } else {
      out.push(m[2]);
    }
    last = i + m[0].length;
  }

  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
